import { getStyleAccessoryCategories, getDefaultAccessoriesForStyle, getAccessoryDisplayLabel } from '../../content/styling/accessories.ts';
import { STYLING_CONTEXT } from '../../content/sources.ts';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Costume,
  EventItem,
  BackgroundSetting,
  FittingDraft,
  AIJob,
  ColorVariant,
  MaterialOption
} from '../types';
import { LayerCanvas } from './LayerCanvas';
import { ComparisonModal } from './ComparisonModal';
import { api, UserProfile as UserProfileType } from '../services/api';
import { ChimLacIcon } from './VietnameseMotifs';
import {
  Sparkles,
  Save,
  Palette,
  Sliders,
  Check,
  AlertCircle,
  Loader2,
  User,
  Compass,
  CheckCircle2,
  RotateCcw,
  Layers,
  Armchair,
  Wand2,
  Sparkle,
  ChevronDown,
  ChevronUp,
  Upload,
  Link as LinkIcon,
  Image as ImageIcon,
  Trash2,
  Calendar
} from 'lucide-react';

interface StudioRemixProps {
  costume: Costume;
  costumes?: Costume[];
  onSelectCostume?: (costume: Costume) => void;
  event?: EventItem;
  events?: EventItem[];
  onSelectEvent?: (evt: EventItem) => void;
  backgrounds: BackgroundSetting[];
  existingDraft?: FittingDraft | null;
  onDraftSaved: (draft: FittingDraft) => void;
  onJobCompleted: (job: AIJob) => void;
  currentUser?: UserProfileType | null;
  onRequestAuth?: (prompt?: string) => void;
}

export const StudioRemix: React.FC<StudioRemixProps> = ({
  costume,
  costumes,
  onSelectCostume,
  event,
  events,
  onSelectEvent,
  backgrounds,
  existingDraft,
  onDraftSaved,
  onJobCompleted,
  currentUser,
  onRequestAuth
}) => {
  const isFemaleOnly = costume.gender === 'female';
  const isMaleOnly = costume.gender === 'male';

  // Trạng thái mở/đóng của 2 Hộp Dropdown: Cổ Phục & Dịp Lễ
  const [isCostumeDropdownOpen, setIsCostumeDropdownOpen] = useState<boolean>(false);
  const [isEventDropdownOpen, setIsEventDropdownOpen] = useState<boolean>(false);
  const costumeDropdownRef = useRef<HTMLDivElement | null>(null);
  const eventDropdownRef = useRef<HTMLDivElement | null>(null);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (costumeDropdownRef.current && !costumeDropdownRef.current.contains(e.target as Node)) {
        setIsCostumeDropdownOpen(false);
      }
      if (eventDropdownRef.current && !eventDropdownRef.current.contains(e.target as Node)) {
        setIsEventDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [selectedEventItem, setSelectedEventItem] = useState<EventItem | undefined>(() => {
    if (event) return event;
    if (existingDraft?.eventId && events) {
      const found = events.find((e) => e.id === existingDraft.eventId);
      if (found) return found;
    }
    return events && events.length > 0 ? events[0] : undefined;
  });

  const handleSelectEvent = (evt: EventItem) => {
    setSelectedEventItem(evt);
    if (onSelectEvent) onSelectEvent(evt);
  };

  const suitabilityForEvent = useMemo(() => {
    if (!selectedEventItem) return null;
    return costume.suitability?.find((s) => s.eventId === selectedEventItem.id);
  }, [costume.suitability, selectedEventItem]);

  const [remixStyle, setRemixStyle] = useState<'traditional' | 'subtle_modern' | 'remix_fusion'>(
    existingDraft?.remixStyle || 'traditional'
  );

  const [modelGender, setModelGender] = useState<'male' | 'female'>(() => {
    if (isFemaleOnly) return 'female';
    if (isMaleOnly) return 'male';
    return existingDraft?.modelGender || 'female';
  });

  // Pose selection moved exclusively down to Part 2 for AI generation
  const [aiPose, setAiPose] = useState<'standing_formal' | 'seated_regal'>(
    (existingDraft?.modelPose as any) || 'standing_formal'
  );

  // Auto-sync gender when changing costume
  useEffect(() => {
    if (isFemaleOnly && modelGender === 'male') {
      setModelGender('female');
    } else if (isMaleOnly && modelGender === 'female') {
      setModelGender('male');
    }
  }, [costume.id, isFemaleOnly, isMaleOnly]);

  // 🌟 Lọc biến thể màu sắc theo đúng phong cách:
  // - Truyền thống (traditional): 4 màu cũ (Đỏ son, Hoàng yến, Xanh ngọc, Tím hoa cà)
  // - Cách tân & Remix: 2 màu mới (Trắng ngà lụa bạch & Hồng phấn pastel)
  const availableColors = useMemo<ColorVariant[]>(() => {
    if (remixStyle === 'traditional') {
      const trad = costume.colorVariants.filter(
        (c: ColorVariant) => c.id !== 'col-nb-ivory' && c.id !== 'col-nb-pink' && !c.name.toLowerCase().includes('trắng') && !c.name.toLowerCase().includes('hồng')
      );
      return trad.length > 0 ? trad : costume.colorVariants;
    } else {
      const modern = costume.colorVariants.filter(
        (c: ColorVariant) => c.id === 'col-nb-ivory' || c.id === 'col-nb-pink' || c.name.toLowerCase().includes('trắng') || c.name.toLowerCase().includes('hồng')
      );
      return modern.length > 0 ? modern : costume.colorVariants;
    }
  }, [costume.colorVariants, remixStyle]);

  const [selectedColor, setSelectedColor] = useState<ColorVariant>(() => {
    if (existingDraft?.selectedColorId) {
      const found = costume.colorVariants.find((c) => c.id === existingDraft.selectedColorId);
      if (found) return found;
    }
    return costume.colorVariants[0];
  });

  // Sync selectedColor whenever availableColors changes
  useEffect(() => {
    if (!availableColors.some((c: ColorVariant) => c.id === selectedColor.id)) {
      setSelectedColor(availableColors[0]);
    }
  }, [availableColors, selectedColor.id]);

  const [selectedMaterial, setSelectedMaterial] = useState<MaterialOption>(() => {
    if (existingDraft?.selectedMaterialId) {
      const found = costume.materials.find((m) => m.id === existingDraft.selectedMaterialId);
      if (found) return found;
    }
    return costume.materials[0];
  });

  // Auto-sync selectedMaterial when costume changes
  useEffect(() => {
    if (!costume.materials.some((m) => m.id === selectedMaterial.id)) {
      setSelectedMaterial(costume.materials[0]);
    }
  }, [costume.id, costume.materials, selectedMaterial.id]);

  const accessoryCategories = (style: 'traditional' | 'subtle_modern' | 'remix_fusion') => getStyleAccessoryCategories(style, costume);
  const defaultAccessories = (style: 'traditional' | 'subtle_modern' | 'remix_fusion') => getDefaultAccessoriesForStyle(style, costume);

  const [selectedAccessories, setSelectedAccessories] = useState<string[]>(() => {
    if (Array.isArray(existingDraft?.selectedAccessories)) {
      return existingDraft.selectedAccessories;
    }
    return defaultAccessories(existingDraft?.remixStyle || 'traditional');
  });

  // Trạng thái mở / đóng của từng Hộp Drop Down
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
    head: false,
    face_ears: false,
    neck_chest: true,
    hands_waist: false,
    feet_shoes: false
  });

  const toggleCategoryOpen = (catId: string) => {
    setOpenCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId]
    }));
  };

  const handleSelectRemixStyle = (newStyle: 'traditional' | 'subtle_modern' | 'remix_fusion') => {
    setRemixStyle(newStyle);
    const newDefaults = defaultAccessories(newStyle);
    setSelectedAccessories(newDefaults);

    // 🌟 Đổi phong cách -> Tự động chuyển đổi màu sắc tương ứng
    if (newStyle === 'traditional') {
      const redCol = costume.colorVariants.find((c) => c.id === 'col-nb-red' || c.id.includes('red') || c.name.toLowerCase().includes('đỏ')) || costume.colorVariants[0];
      if (redCol) setSelectedColor(redCol);
    } else if (newStyle === 'subtle_modern') {
      const ivoryCol = costume.colorVariants.find((c) => c.id === 'col-nb-ivory' || c.id.includes('ivory') || c.name.toLowerCase().includes('trắng') || c.name.toLowerCase().includes('bạch')) || costume.colorVariants[1] || costume.colorVariants[0];
      if (ivoryCol) setSelectedColor(ivoryCol);
    } else if (newStyle === 'remix_fusion') {
      const pinkCol = costume.colorVariants.find((c) => c.id === 'col-nb-pink' || c.id.includes('pink') || c.name.toLowerCase().includes('hồng')) || costume.colorVariants[2] || costume.colorVariants[0];
      if (pinkCol) setSelectedColor(pinkCol);
    }
  };

  const [selectedBackground, setSelectedBackground] = useState<BackgroundSetting>(() => {
    if (existingDraft?.selectedBackgroundId) {
      const found = backgrounds.find((b) => b.id === existingDraft.selectedBackgroundId);
      if (found) return found;
    }
    return backgrounds[0];
  });

  const [customPrompt, setCustomPrompt] = useState<string>(existingDraft?.customPrompt || '');

  // Ảnh tư liệu tham chiếu cho AI (Reference Artifact Image)
  const [referenceImageUrl, setReferenceImageUrl] = useState<string>(costume.coverImage || '');
  const [referenceMode, setReferenceMode] = useState<'preset' | 'upload' | 'url'>('preset');
  const [urlInput, setUrlInput] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync reference image when costume changes
  useEffect(() => {
    if (referenceMode === 'preset') {
      setReferenceImageUrl(costume.coverImage || '');
    }
  }, [costume.id, referenceMode]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setReferenceImageUrl(event.target.result as string);
        setReferenceMode('upload');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = () => {
    if (urlInput.trim()) {
      setReferenceImageUrl(urlInput.trim());
      setReferenceMode('url');
    }
  };

  // Visible Layers with dedicated waves layer separated from inner pants
  const [visibleLayers, setVisibleLayers] = useState<Record<string, boolean>>(
    existingDraft?.visibleLayers || {
      'cmp-model': true,
      'cmp-inner': true,
      'cmp-main': true,
      'cmp-collar': true,
      'cmp-waves': true,
      'cmp-head': true,
      'cmp-acc': true,
      'cmp-shoes': true
    }
  );

  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [saveErrorMsg, setSaveErrorMsg] = useState<string | null>(null);

  const [aiJob, setAiJob] = useState<AIJob | null>(null);
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiErrorMsg, setAiErrorMsg] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState<boolean>(false);

  const canvasExporterRef = useRef<(() => string) | null>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  const startPollingJob = (jobId: string) => {
    if (!jobId) return;
    if (pollingRef.current) clearInterval(pollingRef.current);

    let attempts = 0;
    const maxAttempts = 60; // 60 * 1.5s = 90s max wait time

    pollingRef.current = setInterval(async () => {
      attempts++;
      if (attempts > maxAttempts) {
        if (pollingRef.current) clearInterval(pollingRef.current);
        setAiLoading(false);
        setAiErrorMsg('Quá thời gian chờ phản hồi từ AI. Vui lòng thử lại.');
        return;
      }

      try {
        const updated = await api.getAIJob(jobId);
        if (!updated) return;

        setAiJob(updated);

        if (updated.status === 'completed') {
          if (pollingRef.current) clearInterval(pollingRef.current);
          setAiLoading(false);
          setShowComparison(true);
          onJobCompleted(updated);
        } else if (updated.status === 'failed') {
          if (pollingRef.current) clearInterval(pollingRef.current);
          setAiLoading(false);
          setAiErrorMsg(updated.errorMessage || 'Yêu cầu AI không thành công. Bạn có thể thử lại.');
        }
      } catch {
        // Suppress temporary network hiccups while polling
      }
    }, 1500);
  };

  const handleToggleLayer = (layerId: string) => {
    setVisibleLayers((prev) => ({
      ...prev,
      [layerId]: prev[layerId] === false ? true : false
    }));
  };

  const handleToggleAccessory = (accName: string) => {
    setSelectedAccessories((prev) =>
      prev.includes(accName) ? prev.filter((a) => a !== accName) : [...prev, accName]
    );
  };

  const [savedDraftId, setSavedDraftId] = useState(existingDraft?.id?.startsWith('preset-') ? undefined : existingDraft?.id);

  // ACTION 1: Save Draft (No AI)
  const handleSaveDraft = async () => {
    if (!currentUser) {
      if (onRequestAuth) {
        onRequestAuth('Vui lòng đăng nhập để lưu bản phối vào tủ đồ cá nhân.');
      }
      return;
    }

    setSaveLoading(true);
    setSaveSuccessMsg(null);
    setSaveErrorMsg(null);

    try {
      const sketchDataUrl = canvasExporterRef.current ? canvasExporterRef.current() : '';

      const draftPayload: Partial<FittingDraft> = {
        id: savedDraftId,
        title: `Phác thảo ${costume.name} • ${selectedColor.name}`,
        eventId: selectedEventItem?.id || event?.id || 'evt-tet',
        costumeId: costume.id,
        modelGender,
        modelPose: aiPose,
        selectedColorId: selectedColor.id,
        selectedMaterialId: selectedMaterial.id,
        selectedAccessories,
        selectedBackgroundId: selectedBackground.id,
        remixStyle,
        customPrompt,
        visibleLayers,
        sketchDataUrl
      };

      const saved = await api.saveDraft(draftPayload);
      setSavedDraftId(saved.id);
      onDraftSaved(saved);
      setSaveSuccessMsg('Đã lưu bản phác thảo vào Bộ sưu tập cá nhân.');
      setTimeout(() => setSaveSuccessMsg(null), 3500);
    } catch (err: any) {
      setSaveErrorMsg(err.message || 'Không thể lưu bản phác thảo.');
    } finally {
      setSaveLoading(false);
    }
  };

  // ACTION 2: Generate AI Masterpiece
  const handleGenerateAI = async () => {
    if (!currentUser) {
      if (onRequestAuth) {
        onRequestAuth('Vui lòng đăng nhập để sử dụng tính năng hoàn thiện cổ phục cùng AI.');
      }
      return;
    }

    setAiErrorMsg(null);
    setAiLoading(true);

    try {
      if (!costume || !costume.id) {
        throw new Error('Vui lòng chọn bộ Việt phục hợp lệ.');
      }

      const sketchDataUrl = canvasExporterRef.current ? canvasExporterRef.current() : '';
      if (!sketchDataUrl) {
        throw new Error('Không thể kết xuất ảnh phác thảo từ các tầng layer.');
      }

      const poseDescription = aiPose === 'seated_regal'
        ? 'Dáng ngồi uy nghiêm trên trường kỷ gỗ mun chạm trổ hoa văn mây khảm xà cừ, hai tà áo buông rủ qua đùi'
        : 'Dáng đứng thủ lễ cung đình trang nghiêm, hai tay nâng cành hoa sen';

      const job = await api.submitAIJob({
        draftId: existingDraft?.id,
        costumeId: costume.id,
        costumeName: costume.name,
        eventName: selectedEventItem?.name || event?.name || 'Sự kiện văn hóa',
        modelGender,
        remixStyle,
        colorName: selectedColor.name,
        materialName: selectedMaterial.name,
        accessories: selectedAccessories,
        backgroundName: selectedBackground.name,
        customPrompt: `${customPrompt ? customPrompt + '. ' : ''}${poseDescription}`,
        referenceImageUrl: referenceImageUrl || costume.coverImage || '',
        sketchDataUrl
      });

      setAiJob(job);
      startPollingJob(job.id);
    } catch (err: any) {
      setAiLoading(false);
      setAiErrorMsg(err.message || 'Gửi yêu cầu AI thất bại.');
    }
  };

  const handleRetryAI = async () => {
    if (!currentUser) {
      if (onRequestAuth) {
        onRequestAuth('Vui lòng đăng nhập để sử dụng tính năng này.');
      }
      return;
    }

    if (!aiJob) return;
    setAiErrorMsg(null);
    setAiLoading(true);
    try {
      const retried = await api.retryAIJob(aiJob.id);
      setAiJob(retried);
      startPollingJob(retried.id);
    } catch (err: any) {
      setAiLoading(false);
      setAiErrorMsg(err.message || 'Không thể thử lại yêu cầu.');
    }
  };

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Top Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[#F4C2CE] gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-serif text-[#C84B69] font-semibold tracking-wider uppercase mb-1">
            <ChimLacIcon className="w-3.5 h-3 text-[#C84B69]" />
            Xưởng Phối Đồ & Thử Cổ Phục AI
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-[#1C1917] flex items-center gap-3">
            {costume.name}
            <span className="text-xs font-sans font-normal px-2.5 py-0.5 rounded-full bg-[#FFF5F7] text-[#57534E] border border-[#F4C2CE]">
              {event?.name || 'Sự kiện tự chọn'}
            </span>
          </h1>
        </div>

        {/* Dual Actions in Top Bar */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveDraft}
            disabled={saveLoading || aiLoading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FFFFFF] hover:bg-[#FFF5F7] text-[#1C1917] text-xs font-serif font-semibold border border-[#F4C2CE] shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
          >
            {saveLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#C84B69]" />
            ) : (
              <Save className="w-3.5 h-3.5 text-[#C84B69]" />
            )}
            <span>Lưu phác thảo</span>
          </button>

          <button
            onClick={handleGenerateAI}
            disabled={aiLoading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#C84B69] hover:bg-[#B33B58] text-[#FFF5F7] text-xs font-semibold tracking-wide shadow-sm transition-all hover:shadow-md disabled:opacity-50 cursor-pointer"
          >
            {aiLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-white" />
            )}
            <span>Hoàn thiện bằng AI</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {saveSuccessMsg && (
        <div className="p-4 rounded-xl bg-[#FFF5F7] border border-[#C29B38]/50 text-[#57534E] text-xs flex items-center gap-2.5 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-[#C84B69]" />
          <span className="font-serif">{saveSuccessMsg}</span>
        </div>
      )}

      {saveErrorMsg && (
        <div className="p-4 rounded-xl bg-[#FEF2F2] border border-[#FCA5A5]/60 text-[#991B1B] text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-[#991B1B]" />
          <span>{saveErrorMsg}</span>
        </div>
      )}

      {/* AI Processing Banner */}
      {aiLoading && (
        <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#C29B38]/50 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#FFF5F7] border border-[#C29B38]/30 flex items-center justify-center shrink-0">
              <Loader2 className="w-6 h-6 text-[#C84B69] animate-spin" />
            </div>
            <div className="space-y-1">
              <div className="text-sm font-serif font-bold text-[#1C1917] flex items-center gap-2">
                AI đang xử lý nếp lụa & hoa văn hoàng cung...
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#FFF5F7] text-[#C84B69] border border-[#F4C2CE]">
                  {aiJob?.status || 'queued'} • {aiJob?.progress || 25}%
                </span>
              </div>
              <p className="text-xs text-[#78716C] font-light">
                Tạo hình theo chất liệu, màu sắc và phụ kiện bạn đã chọn.
              </p>
            </div>
          </div>

          <div className="w-full sm:w-56 bg-[#FFF5F7] rounded-full h-2.5 overflow-hidden border border-[#F4C2CE]">
            <div
              className="bg-gradient-to-r from-[#C29B38] to-[#C84B69] h-full transition-all duration-300"
              style={{ width: `${aiJob?.progress || 25}%` }}
            />
          </div>
        </div>
      )}

      {/* AI Error */}
      {aiErrorMsg && (
        <div className="p-4 rounded-xl bg-[#FEF2F2] border border-[#FCA5A5]/60 text-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-[#991B1B]">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{aiErrorMsg}</span>
          </div>
          <button
            onClick={handleRetryAI}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#991B1B] text-white font-medium hover:bg-[#7F1D1D] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Thử lại</span>
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PHẦN 1: STUDIO PHÁC THẢO & PHỐI ĐỒ TRỰC QUAN (Standing Fashion Croquis) */}
      {/* ========================================================================= */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-[#F4C2CE] pb-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#C84B69] text-white text-xs font-bold flex items-center justify-center font-serif">
              1
            </span>
            <h2 className="text-lg font-serif font-bold text-[#1C1917]">
              Phần 1: Studio Phác Thảo & Phối Đồ Trực Quan
            </h2>
          </div>
          <span className="text-xs text-[#78716C] font-serif italic">
            Người mẫu, Phom dáng đứng & Phụ kiện phối
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cột Trái: Canvas phác thảo tả thực đa tầng với ghim tương tác */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <LayerCanvas
              costume={costume}
              modelGender={modelGender}
              selectedColor={selectedColor}
              selectedMaterial={selectedMaterial}
              selectedAccessories={selectedAccessories}
              selectedBackground={selectedBackground}
              remixStyle={remixStyle}
              visibleLayers={visibleLayers}
              onToggleLayer={handleToggleLayer}
              onCanvasReady={(exportFn) => {
                canvasExporterRef.current = exportFn;
              }}
              onGenerateAI={handleGenerateAI}
            />

            {/* Quy chuẩn điển chế */}
            <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#F4C2CE] text-xs text-[#57534E] space-y-2 shadow-2xs">
              <div className="font-serif font-bold text-[#1C1917] flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#C84B69]" />
                Mẫu phối & cách sử dụng Studio
              </div>
              <p className="font-light leading-relaxed">
                • Bấm vào các nút tròn bên lề trái để bật/tắt hiển thị Áo hoặc Quần. Toàn bộ phụ kiện (đầu và tóc, mắt và tai, cổ, tay, chân) được chọn và hiển thị trực tiếp thông qua các hộp chọn bên phải.
              </p>
              <p className="font-light leading-relaxed">
                • {isFemaleOnly ? 'Mẫu hiện tại minh họa trang phục nữ; xem trang chi tiết để biết bối cảnh lịch sử.' : 'Chọn người mẫu và phụ kiện phù hợp bộ trang phục, dịp sử dụng và phong cách của bạn.'}
              </p>
            </div>
          </div>

          {/* Cột Phải: Bảng điều khiển tùy chỉnh người mẫu & kiểu dáng */}
          <div className="lg:col-span-5 bg-[#FFFFFF] border border-[#F4C2CE] rounded-3xl p-6 sm:p-7 flex flex-col gap-6 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE3]">
              <div className="flex items-center gap-2 text-[#1C1917] font-serif font-bold text-base">
                <Sliders className="w-4 h-4 text-[#C84B69]" />
                <span>Tùy biến hình mẫu</span>
              </div>
              <span className="text-[11px] text-[#78716C] font-serif italic">{costume.era}</span>
            </div>

            {/* =======================================================
                🌟 BỘ ĐÔI DROP DOWN TÙY BIẾN NHANH: CỔ PHỤC & DỊP LỄ
                - Muốn chọn thì click vào hộp thả xuống là xong ngay
                - Tự động nạp bộ cổ phục và tính điểm tương thích sự kiện
               ======================================================= */}
            <div className="space-y-3.5 p-4 rounded-2xl bg-[#FFF5F7] border border-[#F4C2CE] shadow-2xs">
              {/* 1. HỘP DROP DOWN CHỌN CỔ PHỤC */}
              {costumes && costumes.length > 0 && (
                <div className="space-y-1.5 relative" ref={costumeDropdownRef}>
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-serif font-bold text-[#1C1917] flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-[#C84B69]" />
                      Cổ phục đang phối:
                    </label>
                    <span className="text-[10px] font-serif font-medium text-[#78716C] bg-white/80 px-2 py-0.5 rounded-full border border-[#F4C2CE]">
                      {costume.era} • {costume.gender === 'female' ? 'Nữ' : costume.gender === 'male' ? 'Nam' : 'Nam & Nữ'}
                    </span>
                  </div>

                  {/* Nút bấm mở Dropdown Cổ Phục */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsCostumeDropdownOpen(!isCostumeDropdownOpen);
                      setIsEventDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl bg-white border transition-all text-left shadow-2xs cursor-pointer group ${
                      isCostumeDropdownOpen
                        ? 'border-[#C84B69] ring-2 ring-[#C84B69]/15'
                        : 'border-[#F4C2CE] hover:border-[#C84B69]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={costume.coverImage || '/assets/costumes/ao-tac-bat-bao.jpeg'}
                        alt={costume.name}
                        className="w-8 h-8 rounded-lg object-cover border border-[#F4C2CE] shrink-0 shadow-2xs"
                        onError={(e) => {
                          e.currentTarget.src = '/assets/costumes/ao-tac-bat-bao.jpeg';
                        }}
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-serif font-bold text-[#1C1917] group-hover:text-[#C84B69] transition-colors truncate">
                          {costume.name}
                        </div>
                        <div className="text-[10px] text-[#78716C] truncate">
                          {costume.shortDescription || `${costume.era} • Y phục di sản`}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 pl-2 text-[#78716C] group-hover:text-[#C84B69] shrink-0">
                      <span className="text-[11px] font-serif hidden sm:inline text-[#C84B69]/80 font-medium">Đổi</span>
                      {isCostumeDropdownOpen ? (
                        <ChevronUp className="w-4 h-4 text-[#C84B69]" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </button>

                  {/* Menu thả xuống chọn Cổ Phục */}
                  {isCostumeDropdownOpen && (
                    <div className="absolute left-0 right-0 top-full mt-1.5 z-40 bg-white border border-[#F4C2CE] rounded-2xl shadow-xl p-2 max-h-72 overflow-y-auto space-y-1">
                      <div className="px-2 py-1 text-[10px] font-serif font-bold text-[#78716C] uppercase tracking-wider border-b border-[#F4C2CE]/60 mb-1 flex items-center justify-between">
                        <span>Danh mục cổ phục ({costumes.length} bộ)</span>
                        <span className="text-[9px] text-[#C84B69] font-normal normal-case">Nhấn để nạp vào Studio</span>
                      </div>
                      {costumes.map((c) => {
                        const isSelected = c.id === costume.id;
                        return (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => {
                              if (onSelectCostume) onSelectCostume(c);
                              setIsCostumeDropdownOpen(false);
                            }}
                            className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#FFF5F7] border border-[#C84B69]/40 text-[#C84B69]'
                                : 'hover:bg-[#FFF5F7]/60 text-[#1C1917] border border-transparent'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <img
                                src={c.coverImage || '/assets/costumes/ao-tac-bat-bao.jpeg'}
                                alt={c.name}
                                className="w-9 h-9 rounded-lg object-cover border border-[#F4C2CE] shrink-0"
                                onError={(e) => {
                                  e.currentTarget.src = '/assets/costumes/ao-tac-bat-bao.jpeg';
                                }}
                              />
                              <div className="min-w-0">
                                <div className="text-xs font-serif font-bold truncate">
                                  {c.name}
                                </div>
                                <div className="text-[10px] text-[#78716C] truncate flex items-center gap-1.5">
                                  <span>{c.era}</span>
                                  <span>•</span>
                                  <span>{c.gender === 'female' ? 'Nữ' : c.gender === 'male' ? 'Nam' : 'Nam & Nữ'}</span>
                                </div>
                              </div>
                            </div>
                            {isSelected && (
                              <CheckCircle2 className="w-4 h-4 text-[#C84B69] shrink-0 ml-2" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* 2. HỘP DROP DOWN CHỌN DỊP LỄ & SỰ KIỆN */}
              {events && events.length > 0 && (
                <div className="space-y-1.5 relative" ref={eventDropdownRef}>
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-serif font-bold text-[#1C1917] flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#C84B69]" />
                      Dịp lễ & Sự kiện mặc:
                    </label>
                    {suitabilityForEvent && (
                      <span className="text-[10px] font-medium text-[#C84B69] bg-[#C84B69]/10 px-2 py-0.5 rounded-full font-serif">
                        {suitabilityForEvent.score}/100 • {suitabilityForEvent.label}
                      </span>
                    )}
                  </div>

                  {/* Nút bấm mở Dropdown Sự Kiện */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsEventDropdownOpen(!isEventDropdownOpen);
                      setIsCostumeDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl bg-white border transition-all text-left shadow-2xs cursor-pointer group ${
                      isEventDropdownOpen
                        ? 'border-[#C84B69] ring-2 ring-[#C84B69]/15'
                        : 'border-[#F4C2CE] hover:border-[#C84B69]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-[#FFF5F7] border border-[#F4C2CE] flex items-center justify-center shrink-0 text-[#C84B69]">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-serif font-bold text-[#1C1917] group-hover:text-[#C84B69] transition-colors truncate">
                          {selectedEventItem?.name || 'Chọn dịp lễ & sự kiện'}
                        </div>
                        <div className="text-[10px] text-[#78716C] truncate">
                          {selectedEventItem?.formalityLevel || selectedEventItem?.category || 'Ngữ cảnh văn hóa'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 pl-2 text-[#78716C] group-hover:text-[#C84B69] shrink-0">
                      <span className="text-[11px] font-serif hidden sm:inline text-[#C84B69]/80 font-medium">Chọn</span>
                      {isEventDropdownOpen ? (
                        <ChevronUp className="w-4 h-4 text-[#C84B69]" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </button>

                  {/* Menu thả xuống chọn Sự Kiện */}
                  {isEventDropdownOpen && (
                    <div className="absolute left-0 right-0 top-full mt-1.5 z-40 bg-white border border-[#F4C2CE] rounded-2xl shadow-xl p-2 max-h-72 overflow-y-auto space-y-1">
                      <div className="px-2 py-1 text-[10px] font-serif font-bold text-[#78716C] uppercase tracking-wider border-b border-[#F4C2CE]/60 mb-1 flex items-center justify-between">
                        <span>Danh mục lễ hội & sự kiện ({events.length})</span>
                        <span className="text-[9px] text-[#C84B69] font-normal normal-case">Điểm độ phù hợp</span>
                      </div>
                      {events.map((evt) => {
                        const isSelected = selectedEventItem?.id === evt.id;
                        const suit = costume.suitability?.find((s) => s.eventId === evt.id);
                        return (
                          <button
                            key={evt.id}
                            type="button"
                            onClick={() => {
                              handleSelectEvent(evt);
                              setIsEventDropdownOpen(false);
                            }}
                            className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#FFF5F7] border border-[#C84B69]/40 text-[#C84B69]'
                                : 'hover:bg-[#FFF5F7]/60 text-[#1C1917] border border-transparent'
                            }`}
                          >
                            <div className="min-w-0 pr-2">
                              <div className="text-xs font-serif font-bold truncate">
                                {evt.name}
                              </div>
                              <div className="text-[10px] text-[#78716C] truncate">
                                {evt.formalityLevel || evt.category}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              {suit && (
                                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full font-serif ${
                                  suit.score >= 90
                                    ? 'bg-[#C84B69]/10 text-[#C84B69]'
                                    : 'bg-[#C29B38]/15 text-[#9E6B15]'
                                }`}>
                                  {suit.score}/100
                                </span>
                              )}
                              {isSelected && (
                                <CheckCircle2 className="w-4 h-4 text-[#C84B69]" />
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Lý giải văn hóa về sự tương thích */}
                  {suitabilityForEvent && (
                    <div className="p-2.5 rounded-xl bg-white border border-[#F4C2CE]/80 text-[11px] text-[#57534E] space-y-1">
                      <div className="flex items-center gap-1.5 font-serif font-semibold text-[#C84B69]">
                        <span>✦ Đánh giá ngữ cảnh:</span>
                        <span>{suitabilityForEvent.label}</span>
                      </div>
                      <p className="font-light italic leading-tight text-[#78716C]">
                        {suitabilityForEvent.reason}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 1. ĐỊNH HƯỚNG PHONG CÁCH (ĐẶT LÊN ĐẦU TIÊN!) */}
            <div className="p-4 rounded-2xl bg-[#FFF5F7] border border-[#C29B38]/40 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-serif font-bold text-[#1C1917] flex items-center gap-1.5">
                  <Sparkle className="w-3.5 h-3.5 text-[#C84B69]" />
                  1. Định hướng phong cách:
                </label>
                <span className="text-[10px] uppercase font-serif font-bold text-[#C84B69] bg-[#C84B69]/10 px-2 py-0.5 rounded-full">
                  Ưu tiên số 1
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleSelectRemixStyle('traditional')}
                  className={`py-2 px-1 rounded-xl border text-[11px] font-serif font-medium transition-all text-center cursor-pointer ${
                    remixStyle === 'traditional'
                      ? 'bg-[#C84B69] text-white border-[#C84B69] font-bold shadow-xs'
                      : 'bg-white border-[#F4C2CE] text-[#57534E] hover:text-[#1C1917]'
                  }`}
                >
                  Truyền thống
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectRemixStyle('subtle_modern')}
                  className={`py-2 px-1 rounded-xl border text-[11px] font-serif font-medium transition-all text-center cursor-pointer ${
                    remixStyle === 'subtle_modern'
                      ? 'bg-[#C84B69] text-white border-[#C84B69] font-bold shadow-xs'
                      : 'bg-white border-[#F4C2CE] text-[#57534E] hover:text-[#1C1917]'
                  }`}
                >
                  Cách tân nhẹ
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectRemixStyle('remix_fusion')}
                  className={`py-2 px-1 rounded-xl border text-[11px] font-serif font-medium transition-all text-center cursor-pointer ${
                    remixStyle === 'remix_fusion'
                      ? 'bg-[#C84B69] text-white border-[#C84B69] font-bold shadow-xs'
                      : 'bg-white border-[#F4C2CE] text-[#57534E] hover:text-[#1C1917]'
                  }`}
                >
                  Remix hiện đại
                </button>
              </div>

              <p className="text-[11px] text-[#78716C] font-light leading-relaxed">
                {remixStyle === 'traditional' && '✨ Gợi ý phối truyền thống: giữ đặc điểm nhận diện của áo và chọn phụ kiện theo nhu cầu.'}
                {remixStyle === 'subtle_modern' && '✨ Tinh giản đương đại: đường may thanh thoát, tóc búi nhẹ nhàng, giảm bớt hoa văn rườm rà.'}
                {remixStyle === 'remix_fusion' && '✨ Đương đại phá cách: phối màu tương phản cao, phong thái street-fusion và phụ kiện ấn tượng.'}
              </p>
            </div>

            {/* 2. NGƯỜI MẪU (CHỈ CHỌN GIỚI TÍNH - DÁNG ĐỨNG CHUẨN THỜI TRANG) */}
            <div className="space-y-2">
              <label className="block text-xs font-serif font-bold text-[#1C1917] flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#C84B69]" />
                2. Người mẫu:
              </label>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setModelGender('female')}
                  className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                    modelGender === 'female'
                      ? 'bg-[#C84B69]/10 border-[#C84B69] text-[#C84B69] font-semibold shadow-2xs'
                      : 'bg-[#FFF5F7] border-[#F4C2CE] text-[#57534E] hover:text-[#1C1917]'
                  }`}
                >
                  Nữ
                </button>
                <button
                  type="button"
                  onClick={() => !isFemaleOnly && setModelGender('male')}
                  disabled={isFemaleOnly}
                  className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                    isFemaleOnly
                      ? 'bg-stone-100 border-stone-200 text-stone-400 cursor-not-allowed opacity-50'
                      : modelGender === 'male'
                      ? 'bg-[#C84B69]/10 border-[#C84B69] text-[#C84B69] font-semibold shadow-2xs cursor-pointer'
                      : 'bg-[#FFF5F7] border-[#F4C2CE] text-[#57534E] hover:text-[#1C1917] cursor-pointer'
                  }`}
                  title={isFemaleOnly ? 'Mẫu minh họa này dành cho người mẫu nữ' : 'Chọn người mẫu Nam'}
                >
                  Nam {isFemaleOnly && '(Chỉ áp dụng nữ)'}
                </button>
              </div>
            </div>

            {/* 3. BIẾN THỂ MÀU SẮC */}
            <div>
              <label className="block text-xs font-serif font-bold text-[#1C1917] mb-2 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-[#C84B69]" />
                3. Biến thể màu sắc {remixStyle === 'traditional' ? '(4 màu truyền thống)' : '(2 màu cách tân)'}:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {availableColors.map((col: ColorVariant) => {
                  const isSelected = selectedColor.id === col.id;
                  return (
                    <button
                      key={col.id}
                      type="button"
                      onClick={() => setSelectedColor(col)}
                      className={`flex items-center gap-2.5 p-2 rounded-xl border text-xs transition-all text-left cursor-pointer ${
                        isSelected
                          ? 'bg-[#FFF5F7] border-[#C84B69] shadow-2xs'
                          : 'bg-[#FFFFFF] border-[#F4C2CE] hover:border-[#C29B38]'
                      }`}
                    >
                      <span
                        className="w-5 h-5 rounded-full border border-black/10 shrink-0 shadow-2xs"
                        style={{ backgroundColor: col.hex }}
                      />
                      <div className="truncate">
                        <div className="font-semibold text-[#1C1917] truncate">{col.name}</div>
                        <div className="text-[10px] text-[#78716C] font-light truncate">{col.meaning}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. PHỤ KIỆN PHỐI THEO TỪNG BỘ PHẬN (HỘP DROP DOWN TỐI GIẢN) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between pb-1">
                <label className="text-xs font-serif font-bold text-[#1C1917] flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#C84B69]" />
                  4. Phụ kiện phối ({remixStyle === 'traditional' ? 'Cổ truyền' : remixStyle === 'subtle_modern' ? 'Cách tân nhẹ' : 'Remix hiện đại'}):
                </label>
                {selectedAccessories.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedAccessories([])}
                    className="text-[11px] text-[#C84B69] hover:underline cursor-pointer font-serif font-medium"
                  >
                    Bỏ chọn ({selectedAccessories.length})
                  </button>
                )}
              </div>

              <p className="text-[11px] leading-relaxed text-[#78716C]">{STYLING_CONTEXT}</p>
              {/* Danh sách các Hộp Drop Down theo thứ tự bộ phận (Tối giản & Sang trọng) */}
              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {accessoryCategories(remixStyle).map((category) => {
                  const isOpen = !!openCategories[category.id];
                  const selectedInCat = category.items.filter((item) =>
                    selectedAccessories.includes(item)
                  );
                  const hasSelection = selectedInCat.length > 0;

                  return (
                    <div
                      key={category.id}
                      className={`border rounded-xl transition-all overflow-hidden ${
                        hasSelection
                          ? 'border-[#C84B69]/30 bg-[#FFF5F7]/60'
                          : 'border-[#F4C2CE] bg-[#FFFFFF]'
                      }`}
                    >
                      {/* Thanh tiêu đề Drop Down */}
                      <button
                        type="button"
                        onClick={() => toggleCategoryOpen(category.id)}
                        className="w-full px-3.5 py-2.5 flex items-center justify-between text-left cursor-pointer hover:bg-stone-50 transition-colors"
                      >
                        <span className="font-serif font-semibold text-xs text-[#1C1917]">
                          {category.name}
                        </span>

                        <div className="flex items-center gap-2 shrink-0">
                          {hasSelection && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#C84B69]/10 text-[#C84B69] truncate max-w-[150px]">
                              {selectedInCat.length === 1 ? getAccessoryDisplayLabel(selectedInCat[0]) : `${selectedInCat.length} món`}
                            </span>
                          )}
                          <div className="text-[#78716C]">
                            {isOpen ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </div>
                        </div>
                      </button>

                      {/* Danh sách chọn bên trong khi Drop Down mở */}
                      {isOpen && (
                        <div className="p-2.5 pt-1 border-t border-[#F4C2CE]/60 bg-white/70">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                            {category.items.map((accName, idx) => {
                              const isChecked = selectedAccessories.includes(accName);
                              return (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => handleToggleAccessory(accName)}
                                  className={`flex items-center justify-between gap-2 p-2 rounded-lg border text-xs text-left transition-all cursor-pointer ${
                                    isChecked
                                      ? 'bg-[#C84B69]/10 border-[#C84B69] text-[#C84B69] font-semibold'
                                      : 'bg-[#FFFFFF] border-[#F4C2CE] text-[#57534E] hover:border-[#C29B38] hover:bg-[#FFF5F7]'
                                  }`}
                                >
                                  <span className="truncate pr-1 text-[11px]">{getAccessoryDisplayLabel(accName)}</span>
                                  <div
                                    className={`w-3.5 h-3.5 rounded flex items-center justify-center shrink-0 border transition-colors ${
                                      isChecked
                                        ? 'bg-[#C84B69] border-[#C84B69] text-white'
                                        : 'border-[#D8D1C7] bg-[#FFF5F7]'
                                    }`}
                                  >
                                    {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* PHẦN 2: XƯỞNG CHẾ TÁC CHẤT LIỆU VẢI, BỐI CẢNH & TẠO ẢNH AI */}
      {/* ========================================================================= */}
      <section className="space-y-6 pt-4 border-t border-[#F4C2CE]">
        <div className="flex items-center justify-between border-b border-[#F4C2CE] pb-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#C29B38] text-white text-xs font-bold flex items-center justify-center font-serif">
              2
            </span>
            <h2 className="text-lg font-serif font-bold text-[#1C1917]">
              Phần 2: Xưởng Chế Tác Chất Liệu Vải, Không Gian Bối Cảnh & Tạo Ảnh AI
            </h2>
          </div>
          <span className="text-xs text-[#78716C] font-serif italic">
            Chất liệu dệt truyền thống, Bối cảnh di sản & Sinh ảnh AI
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* CỘT 1: Chất liệu dệt di sản + Không gian bối cảnh + Tư thế tạo hình (6 cols) */}
          <div className="lg:col-span-6 bg-[#FFFFFF] border border-[#F4C2CE] rounded-3xl p-6 sm:p-7 space-y-6 shadow-xs">
            {/* 1. Chất liệu dệt di sản */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#F0EBE3] pb-3">
                <h3 className="font-serif font-bold text-sm text-[#1C1917] flex items-center gap-2">
                  <Wand2 className="w-4 h-4 text-[#C84B69]" />
                  Chất liệu dệt & Độ bắt sáng của vải
                </h3>
                <span className="text-[11px] text-[#78716C] font-serif">Làng nghề truyền thống</span>
              </div>

              <div className="space-y-2.5">
                {costume.materials.map((mat) => {
                  const isSelected = selectedMaterial.id === mat.id;
                  return (
                    <button
                      key={mat.id}
                      type="button"
                      onClick={() => setSelectedMaterial(mat)}
                      className={`w-full p-3.5 rounded-2xl border text-xs text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#FFF5F7] border-[#C84B69] shadow-xs ring-1 ring-[#C84B69]/20'
                          : 'bg-[#FFFFFF] border-[#F4C2CE] text-[#57534E] hover:border-[#C29B38]'
                      }`}
                    >
                      <div className="flex items-center justify-between font-serif font-bold text-[#1C1917] mb-1">
                        <span className="flex items-center gap-2">
                          {isSelected && <span className="w-2 h-2 rounded-full bg-[#C84B69]" />}
                          {mat.name}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-[#FFF5F7] text-[#C84B69] font-mono border border-[#F4C2CE]">
                          {mat.origin}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#78716C] font-light leading-relaxed">
                        {mat.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Không gian bối cảnh di sản */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between border-b border-[#F0EBE3] pb-3">
                <h3 className="font-serif font-bold text-sm text-[#1C1917] flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#C84B69]" />
                  Không gian bối cảnh di sản
                </h3>
                <span className="text-[11px] text-[#78716C] font-serif">{backgrounds.length} bối cảnh</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {backgrounds.map((bg) => {
                  const isSelected = selectedBackground.id === bg.id;
                  return (
                    <button
                      key={bg.id}
                      type="button"
                      onClick={() => setSelectedBackground(bg)}
                      className={`p-3 rounded-2xl border text-xs text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#FFF5F7] border-[#C84B69] text-[#1C1917] font-semibold shadow-xs ring-1 ring-[#C84B69]/20'
                          : 'bg-white border-[#F4C2CE] text-[#57534E] hover:border-[#C29B38]'
                      }`}
                    >
                      <div className="font-serif font-bold text-[#1C1917] flex items-center justify-between">
                        <span className="truncate pr-1">{bg.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#C84B69] shrink-0" />}
                      </div>
                      <div className="text-[10px] text-[#C84B69] font-serif mt-0.5">{bg.aesthetic}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Tư thế tạo hình khi AI sinh ảnh */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between border-b border-[#F0EBE3] pb-2">
                <label className="text-xs font-serif font-bold text-[#1C1917] flex items-center gap-1.5">
                  <Armchair className="w-3.5 h-3.5 text-[#C84B69]" />
                  Tư thế tạo hình khi AI sinh ảnh:
                </label>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setAiPose('standing_formal')}
                  className={`py-2 px-2.5 rounded-xl border text-xs font-medium transition-all text-center cursor-pointer ${
                    aiPose === 'standing_formal'
                      ? 'bg-[#C84B69] text-white border-[#C84B69] font-semibold shadow-2xs'
                      : 'bg-white border-[#F4C2CE] text-[#57534E] hover:text-[#1C1917]'
                  }`}
                >
                  Dáng đứng thủ lễ
                </button>
                <button
                  type="button"
                  onClick={() => setAiPose('seated_regal')}
                  className={`py-2 px-2.5 rounded-xl border text-xs font-medium transition-all text-center cursor-pointer ${
                    aiPose === 'seated_regal'
                      ? 'bg-[#C84B69] text-white border-[#C84B69] font-semibold shadow-2xs'
                      : 'bg-white border-[#F4C2CE] text-[#57534E] hover:text-[#1C1917]'
                  }`}
                >
                  Dáng ngồi trường kỷ quyền quý
                </button>
              </div>
            </div>
          </div>

          {/* CỘT 2: Chỉ dẫn thêm + Tư liệu tham chiếu + Tổng hợp thiết lập AI (6 cols) */}
          <div className="lg:col-span-6 bg-[#FFFFFF] border border-[#F4C2CE] rounded-3xl p-6 sm:p-7 space-y-5 shadow-xs">
            {/* 1. Chỉ dẫn sáng tạo thêm cho AI */}
            <div>
              <label className="block text-xs font-serif font-bold text-[#1C1917] mb-1.5">
                Chỉ dẫn sáng tạo thêm cho AI (Tùy chọn):
              </label>
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Ví dụ: Ánh nắng chiều hoàng hôn Cố đô Huế rọi qua tán ngọc lan, màu sắc gấm óng ánh..."
                rows={2}
                className="w-full bg-[#FFF5F7] border border-[#F4C2CE] rounded-xl p-3 text-xs text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#C84B69]"
              />
            </div>

            {/* 2. Ảnh tư liệu tham chiếu (Mỏ neo thị giác cho AI) */}
            <div className="p-3.5 rounded-2xl bg-[#FFF5F7] border border-[#C29B38]/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-serif font-bold text-xs text-[#1C1917]">
                  <ImageIcon className="w-3.5 h-3.5 text-[#C84B69]" />
                  <span>Ảnh tư liệu tham chiếu (Mỏ neo thị giác cho AI):</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#C84B69]/10 text-[#C84B69] font-semibold">
                  Tăng độ chuẩn xác
                </span>
              </div>

              {/* Chế độ chọn ảnh tham chiếu */}
              <div className="grid grid-cols-3 gap-1.5 bg-white p-1 rounded-xl border border-[#F4C2CE] text-[11px] font-serif">
                <button
                  type="button"
                  onClick={() => {
                    setReferenceMode('preset');
                    setReferenceImageUrl(costume.coverImage || '');
                  }}
                  className={`py-1.5 px-2 rounded-lg text-center transition-all cursor-pointer ${
                    referenceMode === 'preset'
                      ? 'bg-[#C84B69] text-white font-bold shadow-2xs'
                      : 'text-[#57534E] hover:text-[#1C1917]'
                  }`}
                >
                  Ảnh minh họa
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setReferenceMode('upload');
                    fileInputRef.current?.click();
                  }}
                  className={`py-1.5 px-2 rounded-lg text-center transition-all flex items-center justify-center gap-1 cursor-pointer ${
                    referenceMode === 'upload'
                      ? 'bg-[#C84B69] text-white font-bold shadow-2xs'
                      : 'text-[#57534E] hover:text-[#1C1917]'
                  }`}
                >
                  <Upload className="w-3 h-3" />
                  <span>Tải ảnh lên</span>
                </button>
                <button
                  type="button"
                  onClick={() => setReferenceMode('url')}
                  className={`py-1.5 px-2 rounded-lg text-center transition-all flex items-center justify-center gap-1 cursor-pointer ${
                    referenceMode === 'url'
                      ? 'bg-[#C84B69] text-white font-bold shadow-2xs'
                      : 'text-[#57534E] hover:text-[#1C1917]'
                  }`}
                >
                  <LinkIcon className="w-3 h-3" />
                  <span>Link ảnh</span>
                </button>
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              {/* URL Input Form */}
              {referenceMode === 'url' && (
                <div className="flex gap-1.5">
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="Dán link ảnh web (https://...jpg/png)"
                    className="flex-1 bg-white border border-[#F4C2CE] rounded-lg px-2.5 py-1.5 text-xs text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#C84B69]"
                  />
                  <button
                    type="button"
                    onClick={handleApplyUrl}
                    className="px-3 py-1.5 bg-[#C84B69] hover:bg-[#B33B58] text-white text-xs font-serif font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    Gắn link
                  </button>
                </div>
              )}

              {/* Thumbnail Preview */}
              {referenceImageUrl && (
                <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-[#F4C2CE]">
                  <img
                    src={referenceImageUrl}
                    alt="Ảnh tư liệu tham chiếu"
                    className="w-14 h-16 object-cover rounded-lg border border-[#F4C2CE] shadow-2xs shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-serif font-bold text-[#1C1917] truncate">
                      {referenceMode === 'preset'
                        ? `Ảnh minh họa: ${costume.name}`
                        : referenceMode === 'upload'
                        ? 'Ảnh tải lên từ thiết bị'
                        : 'Ảnh từ liên kết trực tuyến'}
                    </div>
                    <div className="text-[10px] text-[#166534] font-medium flex items-center gap-1 mt-0.5">
                      <CheckCircle2 className="w-3 h-3 text-[#166534]" />
                      <span>AI sẽ bám sát chi tiết ảnh này</span>
                    </div>
                  </div>
                  {referenceMode !== 'preset' && (
                    <button
                      type="button"
                      onClick={() => {
                        setReferenceMode('preset');
                        setReferenceImageUrl(costume.coverImage || '');
                      }}
                      className="p-1.5 text-[#78716C] hover:text-[#C84B69] transition-colors"
                      title="Hủy ảnh tùy biến, dùng ảnh gốc"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* 3. Tổng hợp thiết lập phục dựng AI (đầy đủ Sự kiện & Định hướng phong cách) */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#FFF5F7] to-[#F5ECE0] border border-[#C29B38]/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-serif font-bold text-[#1C1917] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#C84B69]" />
                  Tổng hợp thiết lập phục dựng AI
                </span>
                <span className="text-[10px] font-mono text-[#C84B69] font-semibold">
                  8K Cinematic
                </span>
              </div>

              <div className="text-[11px] text-[#57534E] font-light space-y-1.5">
                <p>• <strong>Trang phục:</strong> {costume.name} ({selectedColor.name}, {selectedMaterial.name})</p>
                <p>• <strong>Dịp lễ & Sự kiện:</strong> {selectedEventItem ? `${selectedEventItem.name} (${selectedEventItem.formalityLevel || selectedEventItem.category})` : 'Tự do'}</p>
                <p>• <strong>Định hướng phong cách:</strong> {remixStyle === 'traditional' ? 'Phong cách truyền thống (Traditional)' : remixStyle === 'subtle_modern' ? 'Cách tân nhẹ (Subtle Modern)' : 'Remix Fusion đương đại'}</p>
                <p>• <strong>Người mẫu & Tư thế AI:</strong> {modelGender === 'male' ? 'Nam' : 'Nữ'} • {aiPose === 'seated_regal' ? 'Dáng ngồi trường kỷ quyền quý' : 'Dáng đứng thủ lễ'}</p>
                <p>• <strong>Bối cảnh:</strong> {selectedBackground.name} ({selectedBackground.aesthetic})</p>
                <p>• <strong>Phụ kiện:</strong> {selectedAccessories.map(getAccessoryDisplayLabel).join(', ') || 'Không chọn thêm'}</p>
              </div>

              <button
                type="button"
                onClick={handleGenerateAI}
                disabled={aiLoading}
                className="w-full py-3 rounded-xl bg-[#C84B69] hover:bg-[#B33B58] text-white text-xs font-semibold tracking-wide flex items-center justify-center gap-2 shadow-md transition-all hover:shadow-lg disabled:opacity-50 cursor-pointer"
              >
                {aiLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>AI đang phục dựng...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-white" />
                    <span>Xuất ảnh phục dựng nghệ thuật bằng AI</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Modal (Before/After) */}
      {showComparison && aiJob && (
        <ComparisonModal
          job={aiJob}
          onClose={() => setShowComparison(false)}
          onReopenStudio={() => setShowComparison(false)}
        />
      )}
    </div>
  );
};
