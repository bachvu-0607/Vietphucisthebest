import { buildCostumePrompt } from './ai-prompt.ts';
import { monitor, recordFailure } from './monitor.ts';
import { GoogleGenAI } from '@google/genai';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import { RESULTS_DIR } from './storage.ts';
import { sqliteDb } from './sqlite.ts';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

// Initial dotenv load
dotenv.config();

/**
 * Dynamically resolves the OpenAI client at runtime so new environment variables
 * take effect immediately without needing server restart.
 */
function getOpenAIClient(): { client: OpenAI | null; key: string } {
  try {
    dotenv.config();
  } catch {}

  const key =
    process.env.OPENAI_API_KEY ||
    process.env.CHATGPT_API_KEY ||
    process.env.OPENAI_KEY ||
    process.env.VITE_OPENAI_API_KEY ||
    '';

  if (!key || key === 'MY_OPENAI_API_KEY' || key.trim() === '') {
    return { client: null, key: '' };
  }

  try {
    const client = new OpenAI({
      apiKey: key.trim(),
      maxRetries: 0, // No SDK backoff retries on quota limit
      timeout: 120000 // GPT image generation commonly takes 30-90s
    });
    return { client, key: key.trim() };
  } catch (err) {
    monitor.event('ai_client_init_failed','error');
    return { client: null, key };
  }
}

/**
 * Dynamically resolves the Gemini client at runtime
 */
function getGeminiClient(): { client: GoogleGenAI | null; key: string } {
  try {
    dotenv.config();
  } catch {}

  const key = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '';

  if (!key || key === 'MY_GEMINI_API_KEY' || key.trim() === '') {
    return { client: null, key: '' };
  }

  try {
    const client = new GoogleGenAI({
      apiKey: key.trim(),
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
    return { client, key: key.trim() };
  } catch (err) {
    return { client: null, key };
  }
}

/**
 * Processes an AI job asynchronously in the background.
 * Updates database status: queued -> processing -> completed | failed.
 */
export function processJobInBackground(jobId: string, options: {
  costumeId?: string;
  costumeName: string;
  eventName: string;
  remixStyle: string;
  modelGender?: 'male' | 'female';
  colorName?: string;
  materialName?: string;
  accessories?: string[];
  backgroundName?: string;
  customPrompt?: string;
  referenceImageUrl?: string;
  sketchDataUrl?: string;
}): void {
  const startedAt = Date.now();
  // Update to queued immediately
  sqliteDb.updateDetailedAIJob(jobId, { status: 'queued', progress: 10 });

  setTimeout(async () => {
    try {
      sqliteDb.updateDetailedAIJob(jobId, { status: 'processing', progress: 35 });
      const prompt = buildCostumePrompt(options);

      let finalImageUrl = '';

      const { client: dynamicOpenAI, key: activeOpenAIKey } = getOpenAIClient();
      const { client: dynamicGemini, key: activeGeminiKey } = getGeminiClient();

      // 1. Check if OpenAI (ChatGPT / DALL-E / GPT-Image) is configured
      if (dynamicOpenAI && activeOpenAIKey) {
        // Verified working models in order of priority (gpt-image-2.5-sunburst first, then gpt-image-1)
        const candidateModels = [
          'gpt-image-2.5-sunburst',
          'gpt-image-1',
          'gpt-image-1.5',
          'chatgpt-image-latest'
        ];
        
        for (const modelName of candidateModels) {
          try {
            monitor.event('ai_provider_attempt');
            sqliteDb.updateDetailedAIJob(jobId, { status: 'processing', progress: 55 });
            
            // Truncate prompt safely if too long for OpenAI image API
            const trimmedPrompt = prompt.length > 3500 ? prompt.substring(0, 3500) : prompt;

            monitor.count('openaiCalls');
            const dalleResponse = await dynamicOpenAI.images.generate({
              model: modelName,
              prompt: trimmedPrompt,
              n: 1,
              size: '1024x1536',
              quality: 'medium',
              output_format: 'jpeg'
            });

            if (dalleResponse.data?.[0]?.b64_json) {
              const b64 = dalleResponse.data[0].b64_json;
              const outDir = RESULTS_DIR;
              if (!fs.existsSync(outDir)) {
                fs.mkdirSync(outDir, { recursive: true });
              }
              const outFileName = `ai-${jobId}.jpg`;
              const outPath = path.resolve(outDir, outFileName);
              fs.writeFileSync(outPath, Buffer.from(b64, 'base64'));
              finalImageUrl = `/assets/results/${outFileName}`;

              break;
            } else if (dalleResponse.data?.[0]?.url) {
              finalImageUrl = dalleResponse.data[0].url;

              break;
            }
          } catch (err: any) {
            recordFailure('ai_provider', err);
            // If OpenAI quota/credits are exhausted or invalid auth, exit OpenAI immediately
            if (err?.status === 429 || err?.status === 401 || (err?.message && err.message.toLowerCase().includes('credit'))) {

              break;
            }
          }
        }
      }

      // 2. Check if Google Gemini / Imagen 3 image generation is possible
      if (!finalImageUrl && dynamicGemini && activeGeminiKey) {
        try {
          monitor.event('ai_provider_attempt');
          // Format image input if sketchDataUrl is provided as base64
          let contentsPart: any;
          if (options.sketchDataUrl && options.sketchDataUrl.includes('base64,')) {
            const base64Data = options.sketchDataUrl.split('base64,')[1];
            contentsPart = {
              parts: [
                {
                  inlineData: {
                    data: base64Data,
                    mimeType: 'image/png'
                  }
                },
                {
                  text: `Transform this Vietnamese costume sketch into a photorealistic, stunning masterpiece portrait. Follow prompt: ${prompt}`
                }
              ]
            };
          } else {
            contentsPart = prompt;
          }

          // Try Imagen 3 image generation
          try {
            monitor.count('googleCalls');
            const imgResponse = await (dynamicGemini.models as any).generateImages({
              model: 'imagen-3.0-generate-002',
              prompt: prompt,
              config: {
                numberOfImages: 1,
                aspectRatio: '3:4',
                outputMimeType: 'image/jpeg',
              }
            });

            if (imgResponse.generatedImages?.[0]?.image?.imageBytes) {
              const b64 = imgResponse.generatedImages[0].image.imageBytes;
              finalImageUrl = `data:image/jpeg;base64,${b64}`;
            }
          } catch {
            // If Imagen is unavailable or quota limited, try generateContent
            monitor.count('googleCalls');
            const response = await dynamicGemini.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: contentsPart
            });

            if (response.candidates?.[0]?.content?.parts) {
              for (const part of response.candidates[0].content.parts) {
                if ((part as any).inlineData) {
                  const b64 = (part as any).inlineData.data;
                  finalImageUrl = `data:image/png;base64,${b64}`;
                  break;
                }
              }
            }
          }
        } catch (err: any) {
          recordFailure('ai_provider', err);
          finalImageUrl = '';
        }
      }

      if (!finalImageUrl) throw new Error('Không tạo được ảnh từ dịch vụ AI. Hãy kiểm tra cấu hình hoặc thử lại sau.');
      if (finalImageUrl.startsWith('data:image/')) {
        const match = /^data:image\/(png|jpeg);base64,(.+)$/.exec(finalImageUrl);
        if (!match) throw new Error('Định dạng ảnh AI không hợp lệ.');
        fs.mkdirSync(RESULTS_DIR, { recursive: true });
        const filename = `ai-${jobId}.${match[1] === 'jpeg' ? 'jpg' : 'png'}`;
        fs.writeFileSync(path.join(RESULTS_DIR, filename), Buffer.from(match[2], 'base64'));
        finalImageUrl = `/assets/results/${filename}`;
      }
      if (!finalImageUrl.startsWith('/assets/results/')) throw new Error('Dịch vụ AI không trả ảnh có thể lưu riêng tư.');

      sqliteDb.updateDetailedAIJob(jobId, {
        status: 'completed',
        progress: 100,
        resultImageUrl: finalImageUrl,
        completedAt: new Date().toISOString()
      });
      monitor.count('completed'); monitor.count('durationMs', Date.now()-startedAt); monitor.event('ai_completed');
    } catch (err: any) {
      monitor.count('failed'); monitor.event('ai_failed', 'error');
      try { sqliteDb.updateDetailedAIJob(jobId, {
        status: 'failed',
        progress: 100,
        errorMessage: err?.message || 'Quá trình hoàn thiện trang phục gặp sự cố. Vui lòng thử lại.'
      }); } catch (storageError) { monitor.event('ai_result_save_failed','error'); }
    }
  }, 800);
}

function escapeXml(unsafe?: string): string {
  if (!unsafe) return '';
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

function getColorHex(colorName?: string): string {
  const name = (colorName || '').toLowerCase();
  if (name.includes('hoàng yến') || name.includes('vàng') || name.includes('cát')) return '#d4af37';
  if (name.includes('đỏ') || name.includes('son') || name.includes('rượu') || name.includes('gạch')) return '#a61c1c';
  if (name.includes('ngọc') || name.includes('teal')) return '#1b6b68';
  if (name.includes('lam') || name.includes('navy') || name.includes('chàm')) return '#1d3557';
  if (name.includes('than') || name.includes('đen') || name.includes('tuyền')) return '#2b2d42';
  if (name.includes('tím') || name.includes('cà')) return '#63326e';
  if (name.includes('trắng') || name.includes('mây')) return '#f1ede4';
  if (name.includes('rêu') || name.includes('lục')) return '#2d6a4f';
  return '#a61c1c';
}

function getBaseCostumePath(costumeName?: string): string {
  const name = (costumeName || '').toLowerCase();
  if (name.includes('nhật bình')) return 'public/assets/costumes/ao-nhat-binh-nam-phuong.jpg';
  if (name.includes('tấc')) return 'public/assets/costumes/ao-tac-bat-bao.jpeg';
  if (name.includes('ngũ thân') || name.includes('chẽn')) return 'public/assets/costumes/ao-ngu-than-tonkin.jpg';
  if (name.includes('giao lĩnh')) return 'public/assets/costumes/ao-giao-linh.jpg';
  if (name.includes('đối khâm')) return 'public/assets/costumes/ao-nhat-binh-tu-cung.jpg';
  return 'public/assets/costumes/ao-nhat-binh-nam-phuong.jpg';
}

/**
 * DIRECTION A: Dynamic Heritage Compositor
 * Combines authentic costume photography with dynamic color tinting, silk sheen,
 * imperial red seal, and personalized museum curatorial plaque.
 */
export async function generateCustomCompositedArtwork(
  jobId: string,
  options: {
    costumeName: string;
    eventName: string;
    remixStyle: string;
    colorName?: string;
    materialName?: string;
    accessories?: string[];
    backgroundName?: string;
  }
): Promise<string> {
  const baseImgRelPath = getBaseCostumePath(options.costumeName);
  const basePath = path.resolve(process.cwd(), baseImgRelPath);

  if (!fs.existsSync(basePath)) {
    return '/assets/costumes/ao-nhat-binh-nam-phuong.jpg';
  }

  const outFileName = `remix-${jobId}.jpg`;
  const outDir = RESULTS_DIR;
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  const outPath = path.resolve(outDir, outFileName);

  const width = 800;
  const height = 1100;
  const colorHex = getColorHex(options.colorName);
  const styleLabel =
    options.remixStyle === 'traditional'
      ? 'Truyền Thống Cung Đình'
      : options.remixStyle === 'subtle_modern'
      ? 'Cách Tân Nhẹ'
      : 'Remix Đương Đại';
  const accList =
    options.accessories && options.accessories.length > 0
      ? options.accessories.slice(0, 2).join(', ')
      : 'Trang sức cổ truyền';
  const bgLabel = options.backgroundName || 'Hoàng thành Thăng Long';

  const svgOverlay = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <!-- Dynamic Color Tinting Overlay based on user selection -->
      <rect x="0" y="0" width="${width}" height="${height}" fill="${colorHex}" opacity="0.26" style="mix-blend-mode: multiply;" />

      <!-- Golden Heritage Frame & Ambient Vignette -->
      <rect x="0" y="0" width="${width}" height="${height}" fill="none" stroke="#D4AF37" stroke-width="8" opacity="0.8"/>
      <rect x="14" y="14" width="${width - 28}" height="${height - 28}" fill="none" stroke="#FFFFFF" stroke-width="1.5" opacity="0.45"/>

      <!-- Imperial Red Vermilion Seal (Triện Son Hoàng Gia) -->
      <g transform="translate(${width - 130}, 36)">
        <rect x="0" y="0" width="92" height="92" rx="8" fill="#991B1B" fill-opacity="0.9" stroke="#D4AF37" stroke-width="2"/>
        <rect x="6" y="6" width="80" height="80" rx="5" fill="none" stroke="#FEF08A" stroke-width="1.2" stroke-dasharray="4,2"/>
        <text x="46" y="32" fill="#FEF08A" font-family="'Times New Roman', serif" font-size="12" font-weight="bold" text-anchor="middle">ĐẠI NAM</text>
        <text x="46" y="52" fill="#FFFFFF" font-family="'Times New Roman', serif" font-size="11" font-weight="bold" text-anchor="middle">CỔ PHỤC</text>
        <text x="46" y="72" fill="#FEF08A" font-family="'Times New Roman', serif" font-size="10" text-anchor="middle">ĐỘC BẢN</text>
      </g>

      <!-- Bottom Curatorial Plaque with User Customizations -->
      <g transform="translate(30, ${height - 135})">
        <rect x="0" y="0" width="${width - 60}" height="105" rx="10" fill="#1C1917" fill-opacity="0.92" stroke="#D4AF37" stroke-width="1.5"/>
        <text x="24" y="32" fill="#FEF08A" font-family="'Times New Roman', serif" font-size="18" font-weight="bold">${escapeXml(options.costumeName)} • Sắc ${escapeXml(options.colorName || 'Nguyên bản')}</text>
        <text x="24" y="58" fill="#E7E5E4" font-family="sans-serif" font-size="12">Chất liệu: ${escapeXml(options.materialName || 'Gấm tơ tằm')} | Phụ kiện: ${escapeXml(accList)}</text>
        <text x="24" y="80" fill="#A8A29E" font-family="sans-serif" font-size="11">Sự kiện: ${escapeXml(options.eventName)} • ${escapeXml(bgLabel)} | ${styleLabel}</text>
        <text x="${width - 90}" y="56" fill="#D4AF37" font-family="'Times New Roman', serif" font-size="13" font-style="italic" text-anchor="end">VIỆT PHỤC DISCOVERY</text>
      </g>
    </svg>
  `;

  await sharp(basePath)
    .resize(width, height, { fit: 'cover', position: 'top' })
    .composite([{ input: Buffer.from(svgOverlay), top: 0, left: 0 }])
    .jpeg({ quality: 90 })
    .toFile(outPath);

  return `/assets/results/${outFileName}`;
}

/**
 * Returns authentic, high-resolution museum restored artwork or photography for each costume.
 */
export function getCostumeMasterpieceImage(costumeName: string): string {
  const name = (costumeName || '').toLowerCase();
  if (name.includes('nhật bình')) {
    return '/assets/costumes/ao-nhat-binh-nam-phuong.jpg';
  }
  if (name.includes('tấc')) {
    return '/assets/costumes/ao-tac-bat-bao.jpeg';
  }
  if (name.includes('ngũ thân') || name.includes('chẽn')) {
    return '/assets/costumes/ao-ngu-than-tonkin.jpg';
  }
  if (name.includes('giao lĩnh')) {
    return '/assets/costumes/ao-giao-linh.jpg';
  }
  if (name.includes('đối khâm')) {
    return '/assets/costumes/ao-nhat-binh-tu-cung.jpg';
  }
  return '/assets/costumes/ao-nhat-binh-nam-phuong.jpg';
}

/**
 * High-fidelity cultural visual generator for the mock/fallback mode.
 * Dynamically adjusts color scheme, garment silhouette, and motifs based on costume type.
 */
function generateRealisticMockResult(options: {
  costumeName: string;
  eventName: string;
  remixStyle: string;
  colorName?: string;
  materialName?: string;
  accessories?: string[];
  backgroundName?: string;
}): string {
  const costume = options.costumeName;
  const event = options.eventName;
  const style =
    options.remixStyle === 'traditional'
      ? 'Truyền Thống Cung Đình'
      : options.remixStyle === 'subtle_modern'
      ? 'Cách Tân Nhẹ'
      : 'Remix Đương Đại';
  const color = options.colorName || 'Đỏ son';
  const bg = options.backgroundName || 'Hoàng thành Thăng Long';

  // Determine dynamic robe colors based on selection
  let primaryRobeColor = '#991b1b';
  let secondaryRobeColor = '#7f1d1d';
  let darkRobeColor = '#450a0a';

  if (color.toLowerCase().includes('lam') || color.toLowerCase().includes('navy') || color.toLowerCase().includes('xanh ngọc')) {
    primaryRobeColor = '#1d3557';
    secondaryRobeColor = '#1b4965';
    darkRobeColor = '#0b2545';
  } else if (color.toLowerCase().includes('yến') || color.toLowerCase().includes('vàng') || color.toLowerCase().includes('cát')) {
    primaryRobeColor = '#b45309';
    secondaryRobeColor = '#92400e';
    darkRobeColor = '#78350f';
  } else if (color.toLowerCase().includes('lục') || color.toLowerCase().includes('rêu')) {
    primaryRobeColor = '#2d6a4f';
    secondaryRobeColor = '#1b4332';
    darkRobeColor = '#081c15';
  } else if (color.toLowerCase().includes('than') || color.toLowerCase().includes('đen')) {
    primaryRobeColor = '#2b2d42';
    secondaryRobeColor = '#1e1f29';
    darkRobeColor = '#111217';
  } else if (color.toLowerCase().includes('tím')) {
    primaryRobeColor = '#581c87';
    secondaryRobeColor = '#3b0764';
    darkRobeColor = '#240046';
  }

  const isNhatBinh = costume.toLowerCase().includes('nhật bình');
  const isAoTac = costume.toLowerCase().includes('tấc');
  const isGiaoLinh = costume.toLowerCase().includes('giao lĩnh');
  const isDoiKham = costume.toLowerCase().includes('đối khâm');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 1200" width="900" height="1200">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#181311"/>
        <stop offset="50%" stop-color="#2a1a14"/>
        <stop offset="100%" stop-color="#0f0b09"/>
      </linearGradient>
      <linearGradient id="goldGlow" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#d4af37"/>
        <stop offset="50%" stop-color="#fef08a"/>
        <stop offset="100%" stop-color="#b45309"/>
      </linearGradient>
      <linearGradient id="robeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="${primaryRobeColor}"/>
        <stop offset="60%" stop-color="${secondaryRobeColor}"/>
        <stop offset="100%" stop-color="${darkRobeColor}"/>
      </linearGradient>
      <pattern id="motifPattern" width="60" height="60" patternUnits="userSpaceOnUse">
        <circle cx="30" cy="30" r="18" fill="none" stroke="#d4af37" stroke-width="1.2" opacity="0.22"/>
        <path d="M 30,12 L 30,48 M 12,30 L 48,30" stroke="#d4af37" stroke-width="0.8" opacity="0.18"/>
        <polygon points="30,18 42,30 30,42 18,30" fill="none" stroke="#d4af37" stroke-width="0.8" opacity="0.25"/>
      </pattern>
      <radialGradient id="halo" cx="50%" cy="30%" r="50%">
        <stop offset="0%" stop-color="#fef08a" stop-opacity="0.32"/>
        <stop offset="60%" stop-color="#eab308" stop-opacity="0.08"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
      </radialGradient>
      <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="8" result="blur"/>
        <feComposite in="SourceGraphic" in2="blur" operator="over"/>
      </filter>
    </defs>

    <!-- Background -->
    <rect width="900" height="1200" fill="url(#bgGrad)"/>
    <rect width="900" height="1200" fill="url(#motifPattern)"/>
    <circle cx="450" cy="400" r="360" fill="url(#halo)"/>

    <!-- Architectural Silhouette in Background -->
    <path d="M 140,430 L 450,290 L 760,430 L 710,560 L 190,560 Z" fill="#2d1a14" opacity="0.5"/>
    <path d="M 210,410 Q 450,340 690,410" stroke="#c2410c" stroke-width="3" fill="none" opacity="0.35"/>
    <circle cx="450" cy="330" r="8" fill="#eab308" opacity="0.7"/>

    <!-- Figure Silhouette & Garments -->
    <!-- Head & Headdress -->
    <ellipse cx="450" cy="320" rx="60" ry="75" fill="#fce7d2"/>
    <!-- Headwear / Khăn vành / Khăn đóng -->
    <path d="M 370,290 C 370,220 530,220 530,290 C 530,305 370,305 370,290 Z" fill="#1e1b4b" stroke="#d4af37" stroke-width="2"/>
    <ellipse cx="450" cy="270" rx="75" ry="30" fill="none" stroke="#d4af37" stroke-width="3"/>
    <ellipse cx="450" cy="262" rx="72" ry="26" fill="none" stroke="#eab308" stroke-width="1.5" stroke-dasharray="4,3"/>

    <!-- Facial hint & serenity -->
    <path d="M 425,320 Q 435,324 445,320" stroke="#a16207" stroke-width="2" fill="none"/>
    <path d="M 455,320 Q 465,324 475,320" stroke="#a16207" stroke-width="2" fill="none"/>
    <ellipse cx="450" cy="336" rx="4" ry="7" fill="#e29578" opacity="0.6"/>
    <path d="M 440,356 Q 450,364 460,356" stroke="#b91c1c" stroke-width="3" fill="none"/>

    <!-- Inner White Collar & Robe Base -->
    <polygon points="410,380 450,430 490,380 475,370 450,395 425,370" fill="#ffffff" stroke="#e2e8f0" stroke-width="1"/>
    
    <!-- Main Outer Robe (Thân Áo) -->
    ${
      isAoTac
        ? `<path d="M 370,385 L 210,610 L 290,1050 L 610,1050 L 690,610 L 530,385 Z" fill="url(#robeGrad)"/>`
        : isGiaoLinh
        ? `<path d="M 370,385 L 230,640 L 310,1050 L 590,1050 L 670,640 L 530,385 Z" fill="url(#robeGrad)"/>`
        : `<path d="M 370,385 L 260,650 L 320,1050 L 580,1050 L 640,650 L 530,385 Z" fill="url(#robeGrad)"/>`
    }
    <path d="M 370,385 L 260,650 L 320,1050 L 580,1050 L 640,650 L 530,385 Z" fill="url(#motifPattern)" opacity="0.38"/>

    <!-- Collar & Distinctive Historic Features -->
    ${
      isNhatBinh
        ? `<!-- Nhật Bình rectangular collar -->
          <rect x="405" y="385" width="90" height="240" rx="4" fill="#1e293b" stroke="#d4af37" stroke-width="3"/>
          <rect x="415" y="395" width="70" height="220" fill="none" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="5,3"/>
          <!-- 5 Colored Bands on Sleeves -->
          <g>
            <rect x="250" y="600" width="60" height="10" fill="#2563eb"/>
            <rect x="250" y="610" width="60" height="10" fill="#dc2626"/>
            <rect x="250" y="620" width="60" height="10" fill="#facc15"/>
            <rect x="250" y="630" width="60" height="10" fill="#ffffff"/>
            <rect x="250" y="640" width="60" height="10" fill="#000000"/>
            <rect x="590" y="600" width="60" height="10" fill="#2563eb"/>
            <rect x="590" y="610" width="60" height="10" fill="#dc2626"/>
            <rect x="590" y="620" width="60" height="10" fill="#facc15"/>
            <rect x="590" y="630" width="60" height="10" fill="#ffffff"/>
            <rect x="590" y="640" width="60" height="10" fill="#000000"/>
          </g>`
        : isGiaoLinh
        ? `<!-- Giao Lĩnh crossing collar -->
          <path d="M 400,380 L 490,520" stroke="#d4af37" stroke-width="5"/>
          <path d="M 500,380 L 430,480" stroke="#f59e0b" stroke-width="3"/>
          <!-- Red Waist Sash -->
          <rect x="360" y="550" width="180" height="28" fill="#b91c1c" stroke="#d4af37" stroke-width="2"/>`
        : isDoiKham
        ? `<!-- Đối Khâm parallel front panels -->
          <line x1="420" y1="385" x2="420" y2="1050" stroke="#d4af37" stroke-width="3"/>
          <line x1="480" y1="385" x2="480" y2="1050" stroke="#d4af37" stroke-width="3"/>`
        : `<!-- Áo Tấc / Ngũ Thân 5 buttons -->
          <circle cx="465" cy="400" r="5" fill="#fef08a" stroke="#d4af37" stroke-width="1.5"/>
          <circle cx="465" cy="440" r="5" fill="#fef08a" stroke="#d4af37" stroke-width="1.5"/>
          <circle cx="465" cy="480" r="5" fill="#fef08a" stroke="#d4af37" stroke-width="1.5"/>
          <circle cx="465" cy="520" r="5" fill="#fef08a" stroke="#d4af37" stroke-width="1.5"/>
          <circle cx="465" cy="560" r="5" fill="#fef08a" stroke="#d4af37" stroke-width="1.5"/>`
    }

    <!-- Kim Bội / Jewelry -->
    <path d="M 450,450 L 450,560" stroke="#fef08a" stroke-width="3"/>
    <circle cx="450" cy="565" r="14" fill="#d4af37" stroke="#ffffff" stroke-width="2"/>
    <polygon points="450,580 440,620 460,620" fill="#dc2626"/>

    <!-- Hands & Accessories -->
    <ellipse cx="450" cy="670" rx="45" ry="30" fill="#fce7d2"/>
    <path d="M 410,640 Q 450,600 490,640 L 450,675 Z" fill="#fed7aa" stroke="#d97706" stroke-width="1.5"/>

    <!-- Bottom border & feet -->
    <ellipse cx="420" cy="1060" rx="25" ry="12" fill="${primaryRobeColor}" stroke="#d4af37" stroke-width="1.5"/>
    <ellipse cx="480" cy="1060" rx="25" ry="12" fill="${primaryRobeColor}" stroke="#d4af37" stroke-width="1.5"/>

    <!-- Info Overlay Card (Curated Museum Art Label) -->
    <g transform="translate(60, 1080)">
      <rect width="780" height="90" rx="12" fill="#0f0c0b" fill-opacity="0.92" stroke="#d4af37" stroke-width="1.5" filter="url(#softGlow)"/>
      <text x="30" y="36" fill="#fef08a" font-family="'Times New Roman', serif" font-size="22" font-weight="bold">${costume} • ${style}</text>
      <text x="30" y="64" fill="#e2e8f0" font-family="sans-serif" font-size="14">Sự kiện: ${event} | Bối cảnh: ${bg}</text>
      <text x="750" y="52" text-anchor="end" fill="#d4af37" font-family="'Times New Roman', serif" font-size="16" font-style="italic">VIỆT PHỤC DISCOVERY AI</text>
    </g>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
