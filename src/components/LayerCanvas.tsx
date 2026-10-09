import React, { useEffect, useRef, useState } from 'react';
import { Costume, ColorVariant, MaterialOption, BackgroundSetting } from '../types';
import { Eye, EyeOff, Sparkles, Sliders, Info, ShieldCheck } from 'lucide-react';

interface LayerCanvasProps {
  costume: Costume;
  modelGender: 'male' | 'female';
  selectedColor?: ColorVariant;
  selectedMaterial?: MaterialOption;
  selectedAccessories: string[];
  selectedBackground?: BackgroundSetting;
  remixStyle?: 'traditional' | 'subtle_modern' | 'remix_fusion';
  visibleLayers: Record<string, boolean>;
  onToggleLayer: (layerId: string) => void;
  onCanvasReady?: (exportFn: () => string) => void;
  onGenerateAI?: () => void;
}

export const LayerCanvas: React.FC<LayerCanvasProps> = ({
  costume,
  modelGender,
  selectedColor,
  selectedMaterial,
  selectedAccessories,
  selectedBackground,
  remixStyle = 'traditional',
  visibleLayers,
  onToggleLayer,
  onCanvasReady,
  onGenerateAI
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [displayMode, setDisplayMode] = useState<'croquis' | 'realistic'>('croquis');

  // Helper to adjust hex brightness
  function adjustBrightness(col: string, amt: number): string {
    let usePound = false;
    if (col[0] === '#') {
      col = col.slice(1);
      usePound = true;
    }
    const num = parseInt(col, 16);
    let r = (num >> 16) + amt;
    if (r > 255) r = 255;
    else if (r < 0) r = 0;
    let b = ((num >> 8) & 0x00ff) + amt;
    if (b > 255) b = 255;
    else if (b < 0) b = 0;
    let g = (num & 0x0000ff) + amt;
    if (g > 255) g = 255;
    else if (g < 0) g = 0;
    return (usePound ? '#' : '') + (g | (b << 8) | (r << 16)).toString(16).padStart(6, '0');
  }

  const renderCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 600;
    const height = 800;
    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);

    const isMale = modelGender === 'male';
    const slug = costume.slug.toLowerCase();
    const isNhatBinh = slug.includes('nhat-binh');
    const isAoDai = slug.includes('ao-dai');
    const isNguThan = slug.includes('ngu-than');
    const isAoTac = slug.includes('ao-tac');
    const isTuThan = slug.includes('tu-than');
    const isBaBa = slug.includes('ba-ba');

    // Phụ kiện cầm tay: CHỈ kích hoạt khi chọn đúng Búp sen trắng tươi / sen tươi cầm tay, tuyệt đối không bị trâm hay hài kích hoạt
    const hasLotusHandheld = selectedAccessories.some((a) => {
      const n = a.toLowerCase();
      return (n.includes('búp sen') || n.includes('sen tươi') || (n.includes('sen') && n.includes('trắng'))) && !n.includes('trâm') && !n.includes('hài') && !n.includes('dù');
    });
    // Trâm cài tóc: Cài trên đầu / búi tóc
    const hasHairpin = selectedAccessories.some((a) => a.toLowerCase().includes('trâm'));
    // Cúc áo / khuy cài cổ phong
    const hasCuc = selectedAccessories.some((a) => {
      const n = a.toLowerCase();
      return n.includes('cúc') || n.includes('khuy');
    });
    // Dải thao / Kim bội / Ấn tua rua đỏ hoàng cung
    const hasThao = selectedAccessories.some((a) => {
      const n = a.toLowerCase();
      return n.includes('kim bội') || n.includes('thao') || n.includes('tua rua') || n.includes('ấn');
    });
    const hasKimBoi = hasThao;
    const hasAnyCucOrThao = hasCuc || hasThao;
    // Kiềng cổ
    const hasKieng = selectedAccessories.some((a) => a.toLowerCase().includes('kiềng'));
    // Quạt cầm tay (Quạt tròn đoàn phiến vs Quạt xếp nan ngà)
    const hasFoldingFan = selectedAccessories.some((a) => a.toLowerCase().includes('quạt xếp'));
    const hasRoundFan = selectedAccessories.some((a) => (a.toLowerCase().includes('quạt đoàn phiến') || a.toLowerCase().includes('quạt tròn') || a.toLowerCase().includes('quạt lụa')) && !a.toLowerCase().includes('quạt xếp'));
    const hasFan = hasFoldingFan || hasRoundFan || selectedAccessories.some((a) => a.toLowerCase().includes('quạt'));
    // Thẻ bài gỗ mun
    const hasTheBai = selectedAccessories.some((a) => a.toLowerCase().includes('thẻ bài'));
    // Chuỗi ngọc trai cổ
    const hasPearls = selectedAccessories.some((a) => {
      const n = a.toLowerCase();
      return n.includes('ngọc trai') && !n.includes('khuyên') && !n.includes('hoa tai');
    });
    // Khuyên tai ngọc trai
    const hasEarrings = selectedAccessories.some((a) => a.toLowerCase().includes('khuyên') || a.toLowerCase().includes('hoa tai'));
    // Khăn lụa quàng cổ
    const hasScarf = selectedAccessories.some((a) => a.toLowerCase().includes('khăn lụa') || a.toLowerCase().includes('twilly'));
    // Kính mắt mèo / kính râm
    const hasSunglasses = selectedAccessories.some((a) => a.toLowerCase().includes('mắt mèo') || (a.toLowerCase().includes('kính') && a.toLowerCase().includes('râm')));
    // Kính gọng vàng
    const hasGlasses = selectedAccessories.some((a) => a.toLowerCase().includes('gọng vàng') || (a.toLowerCase().includes('kính') && !a.toLowerCase().includes('mắt mèo') && !a.toLowerCase().includes('râm')));
    // Tai nghe headphone
    const hasHeadphones = selectedAccessories.some((a) => a.toLowerCase().includes('tai nghe') || a.toLowerCase().includes('headphone'));
    // Vòng choker
    const hasChoker = selectedAccessories.some((a) => a.toLowerCase().includes('choker'));
    // Dù lụa hoa sen che nắng
    const hasUmbrella = selectedAccessories.some((a) => a.toLowerCase().includes('dù') || a.toLowerCase().includes('ô che'));
    // Túi xách
    const hasBag = selectedAccessories.some((a) => a.toLowerCase().includes('túi'));
    // Đồng hồ
    const hasWatch = selectedAccessories.some((a) => a.toLowerCase().includes('đồng hồ'));
    // Vòng xích streetwear
    const hasChain = selectedAccessories.some((a) => a.toLowerCase().includes('xích') || a.toLowerCase().includes('streetwear'));
    // Giày dép
    const hasHai = selectedAccessories.some((a) => a.toLowerCase().includes('hài'));
    const hasGuoc = selectedAccessories.some((a) => a.toLowerCase().includes('guốc'));
    const hasModernShoes = selectedAccessories.some((a) => a.toLowerCase().includes('cao gót') || a.toLowerCase().includes('sneaker') || a.toLowerCase().includes('thể thao') || a.toLowerCase().includes('boot'));

    // Mũ & Nón & Đầu tóc
    const hasQuaiThao = selectedAccessories.some((a) => a.toLowerCase().includes('quai thao') || a.toLowerCase().includes('ba tầm'));
    const hasNonLa = selectedAccessories.some((a) => (a.toLowerCase().includes('nón lá') || a.toLowerCase().includes('bài thơ')) && !a.toLowerCase().includes('quai thao'));
    const hasMuPhacDau = selectedAccessories.some((a) => a.toLowerCase().includes('phác đầu') || a.toLowerCase().includes('ô sa'));
    const hasKhanDong = selectedAccessories.some((a) => a.toLowerCase().includes('khăn đóng'));
    const hasKhanVanh = selectedAccessories.some((a) => a.toLowerCase().includes('khăn vành') || a.toLowerCase().includes('vành dây'));
    const hasBeret = selectedAccessories.some((a) => a.toLowerCase().includes('beret'));
    const hasHeadband = selectedAccessories.some((a) => a.toLowerCase().includes('băng đô'));

    // =========================================================================
    // 0. BACKGROUND & ENVIRONMENT
    // =========================================================================
    const bgDesc = selectedBackground?.promptDescription?.toLowerCase() || '';
    if (bgDesc.includes('studio') || selectedBackground?.id?.includes('studio')) {
      const studioGrad = ctx.createLinearGradient(0, 0, 0, height);
      studioGrad.addColorStop(0, '#FAF7F2');
      studioGrad.addColorStop(1, '#EDE5D8');
      ctx.fillStyle = studioGrad;
      ctx.fillRect(0, 0, width, height);
    } else if (bgDesc.includes('palace') || bgDesc.includes('cung') || isNhatBinh) {
      const palaceGrad = ctx.createRadialGradient(300, 280, 50, 300, 400, 480);
      palaceGrad.addColorStop(0, '#FEFDF8');
      palaceGrad.addColorStop(0.7, '#F5EDE0');
      palaceGrad.addColorStop(1, '#E8DCB8');
      ctx.fillStyle = palaceGrad;
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      ctx.strokeStyle = 'rgba(194, 155, 56, 0.12)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(300, 240, 210, 0, Math.PI * 2);
      ctx.arc(300, 240, 185, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    } else {
      const defaultGrad = ctx.createLinearGradient(0, 0, width, height);
      defaultGrad.addColorStop(0, '#FAF6F0');
      defaultGrad.addColorStop(1, '#EFE8DC');
      ctx.fillStyle = defaultGrad;
      ctx.fillRect(0, 0, width, height);
    }

    // Shadow under feet
    ctx.save();
    const shadowGrad = ctx.createRadialGradient(300, 758, 20, 300, 758, 140);
    shadowGrad.addColorStop(0, 'rgba(40, 25, 20, 0.28)');
    shadowGrad.addColorStop(1, 'rgba(40, 25, 20, 0)');
    ctx.fillStyle = shadowGrad;
    ctx.beginPath();
    ctx.ellipse(300, 758, 140, 16, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    const mainActive = visibleLayers['cmp-main'] !== false;

    // =========================================================================
    // 1. LAYER: HEADWEAR BACKGROUND (ĐỂ MŨ/NÓN RA ĐẰNG SAU, KHÔNG CHE MẶT)
    // =========================================================================
    // Phụ kiện đầu tóc hiển thị trực tiếp theo lựa chọn từ hộp chọn
    if (hasKhanVanh || hasQuaiThao) {
      ctx.save();
      const isThao = hasQuaiThao;
      const isBlue = selectedAccessories.some(a => a.toLowerCase().includes('lam') || a.toLowerCase().includes('xanh'));

        // 🌟 KHĂN VÀNH SA PHỐI CẢNH 3D: NỬA DƯỚI (LỚP NỀN SAU ĐẦU, CẮT THEO TRỤC NGANG Y=150, RỖNG Ở GIỮA)
        if (isThao) {
          ctx.beginPath();
          ctx.ellipse(300, 150, 72, 50, 0, 0, Math.PI * 2);
          ctx.closePath();
          const thaoGrad = ctx.createRadialGradient(300, 150, 20, 300, 150, 72);
          thaoGrad.addColorStop(0, '#FEF08A');
          thaoGrad.addColorStop(0.7, '#FACC15');
          thaoGrad.addColorStop(1, '#B45309');
          ctx.fillStyle = thaoGrad;
          ctx.fill();
          ctx.strokeStyle = '#FACC15';
          ctx.lineWidth = 1.8;
          ctx.stroke();
        } else {
          // NỬA DƯỚI CỦA KHĂN VÀNH SA (RỖNG RUỘT Ở GIỮA, NẰM Ở LỚP NỀN PHÍA SAU ĐẦU)
          ctx.beginPath();
          // Cung ngoài nửa dưới: từ 0 (phải) sang Math.PI (trái)
          ctx.ellipse(300, 150, 72, 52, 0, 0, Math.PI, false);
          // Nối sang vành trong bên trái
          ctx.lineTo(300 - 39, 150);
          // Cung trong nửa dưới: từ Math.PI (trái) về 0 (phải) ngược chiều kim đồng hồ
          ctx.ellipse(300, 150, 39, 28, 0, Math.PI, 0, true);
          ctx.closePath();

          // Màu xanh lam hoàng gia mượt mà óng ả chuẩn triều Nguyễn
          const saGrad = ctx.createRadialGradient(300, 146, 15, 300, 150, 72);
          if (isBlue || (!isBlue && !selectedAccessories.some(a => a.toLowerCase().includes('đỏ')))) {
            saGrad.addColorStop(0, '#2563EB');
            saGrad.addColorStop(0.5, '#1D4ED8');
            saGrad.addColorStop(0.85, '#1E40AF');
            saGrad.addColorStop(1, '#172554');
          } else {
            saGrad.addColorStop(0, '#F43F5E');
            saGrad.addColorStop(0.5, '#E11D48');
            saGrad.addColorStop(0.85, '#BE123C');
            saGrad.addColorStop(1, '#881337');
          }
          ctx.fillStyle = saGrad;
          ctx.fill();

          // Viền kim tuyến vàng thanh lịch ở mép ngoài và trong
          ctx.strokeStyle = '#FACC15';
          ctx.lineWidth = 1.8;
          ctx.stroke();

          // Các vòng elip ánh kim tuyến nhẹ tạo chiều sâu nếp gấp khăn ở nửa dưới
          ctx.strokeStyle = 'rgba(250, 204, 21, 0.4)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.ellipse(300, 150, 64, 44, 0, 0, Math.PI, false);
          ctx.stroke();
          ctx.beginPath();
          ctx.ellipse(300, 150, 56, 38, 0, 0, Math.PI, false);
          ctx.stroke();
          ctx.beginPath();
          ctx.ellipse(300, 150, 48, 32, 0, 0, Math.PI, false);
          ctx.stroke();
        }

        ctx.restore();

        // Nếu là Nón quai thao: có thêm hai dải quai thao tím Kinh Bắc rủ mềm qua hai vai
        if (isThao) {
          ctx.save();
          ctx.strokeStyle = '#701A75';
          ctx.lineWidth = 3.6;
          ctx.beginPath();
          ctx.moveTo(246, 185);
          ctx.quadraticCurveTo(235, 290, 250, 395);
          ctx.moveTo(354, 185);
          ctx.quadraticCurveTo(365, 290, 350, 395);
          ctx.stroke();
          ctx.restore();
        }
      }

      // 1.2 NÓN LÁ BÀI THƠ (ĐẶT SAU VAI, NGHIÊNG NHẸ TĂNG SỨC GỢI HÌNH)
      if (hasNonLa) {
        ctx.save();
        ctx.translate(335, 172);
        ctx.rotate(0.22); // Nghiêng ~12 độ
        const hatGrad = ctx.createLinearGradient(-80, -20, 80, 50);
        hatGrad.addColorStop(0, '#FEF9C3');
        hatGrad.addColorStop(0.5, '#FEF08A');
        hatGrad.addColorStop(1, '#EAB308');
        ctx.fillStyle = hatGrad;
        ctx.beginPath();
        ctx.moveTo(0, -60);
        ctx.lineTo(85, 28);
        ctx.quadraticCurveTo(0, 44, -85, 28);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#A16207';
        ctx.lineWidth = 1.3;
        ctx.stroke();
        ctx.restore();

        // Quai lụa đỏ thắm rủ mềm
        ctx.save();
        ctx.strokeStyle = '#DC2626';
        ctx.lineWidth = 2.6;
        ctx.beginPath();
        ctx.moveTo(260, 195);
        ctx.quadraticCurveTo(250, 260, 272, 310);
        ctx.moveTo(340, 195);
        ctx.quadraticCurveTo(350, 260, 328, 310);
        ctx.stroke();
        ctx.restore();
      }

      // 1.2 MŨ PHÁC ĐẦU / MŨ Ô SA (ĐẶT CAO SAU ĐẦU, CÁNH CHUỒN VƯƠN RỘNG NGHỆ THUẬT)
      if (hasMuPhacDau) {
        ctx.save();
        ctx.translate(300, 118);
        ctx.rotate(-0.05);
        // Thân mũ ô sa đen
        ctx.fillStyle = '#09090B';
        ctx.beginPath();
        ctx.ellipse(0, 0, 36, 22, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#D4AF37';
        ctx.lineWidth = 1.6;
        ctx.stroke();

        // Hai cánh chuồn vươn rộng ra hai bên
        ctx.strokeStyle = '#18181B';
        ctx.lineWidth = 5.5;
        ctx.beginPath();
        ctx.moveTo(-25, 0);
        ctx.quadraticCurveTo(-95, -12, -155, 6);
        ctx.moveTo(25, 0);
        ctx.quadraticCurveTo(95, -12, 155, 6);
        ctx.stroke();

        ctx.strokeStyle = '#FACC15';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.ellipse(-155, 6, 12, 4, 0.2, 0, Math.PI * 2);
        ctx.ellipse(155, 6, 12, 4, -0.2, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

    // =========================================================================
    // 2. LAYER: MODEL ANATOMY (NGƯỜI MẪU CÂN ĐỐI CÓ DA CÓ THỊT, CÙNG MÀU DA VỚI MẶT)
    // =========================================================================
    const modelActive = visibleLayers['cmp-model'] !== false;
    if (modelActive) {
      ctx.save();

      // 🌟 TÔNG DA TRẮNG HỒNG TỰ NHIÊN Á ĐÔNG THANH TÚ ĐỒNG NHẤT 100% GIỮA MẶT VÀ CƠ THỂ
      const skinGrad = ctx.createLinearGradient(280, 140, 320, 250);
      skinGrad.addColorStop(0, '#FFF9F5');
      skinGrad.addColorStop(0.5, '#FDEEE6');
      skinGrad.addColorStop(1, '#F8D8C5');

      const bodySkinGrad = ctx.createLinearGradient(250, 240, 350, 755);
      bodySkinGrad.addColorStop(0, '#FFF9F5');
      bodySkinGrad.addColorStop(0.25, '#FDEEE6');
      bodySkinGrad.addColorStop(0.65, '#F7D4BF');
      bodySkinGrad.addColorStop(1, '#EBBFA4');

      if (isMale) {
        // =====================================================================
        // MANNEQUIN NAM: CƠ THỂ NAM TÍNH PHONG ĐỘ, CÙNG MÀU DA VỚI MẶT
        // =====================================================================
        // Đế đỡ ma-nơ-canh hình bầu dục ở chân
        ctx.fillStyle = '#CBD5E1';
        ctx.beginPath();
        ctx.ellipse(300, 758, 52, 13, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#F8FAFC';
        ctx.beginPath();
        ctx.ellipse(300, 755, 49, 11, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#94A3B8';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = bodySkinGrad;

        // Đôi chân nam
        ctx.beginPath();
        ctx.moveTo(265, 520);
        ctx.lineTo(262, 635);
        ctx.lineTo(268, 735);
        ctx.lineTo(260, 754);
        ctx.quadraticCurveTo(275, 758, 288, 754);
        ctx.lineTo(285, 735);
        ctx.lineTo(288, 635);
        ctx.lineTo(296, 525);
        ctx.lineTo(304, 525);
        ctx.lineTo(312, 635);
        ctx.lineTo(315, 735);
        ctx.lineTo(312, 754);
        ctx.quadraticCurveTo(325, 758, 340, 754);
        ctx.lineTo(332, 735);
        ctx.lineTo(338, 635);
        ctx.lineTo(335, 520);
        ctx.closePath();
        ctx.fill();

        // Thân trên & vai nam
        ctx.beginPath();
        ctx.moveTo(280, 256);
        ctx.lineTo(225, 276); // Vai trái rộng
        ctx.lineTo(238, 385); // Khuỷu tay
        ctx.lineTo(264, 442); // Cổ tay
        ctx.lineTo(270, 435); // Eo trái
        ctx.lineTo(265, 520); // Hông trái
        ctx.lineTo(335, 520); // Hông phải
        ctx.lineTo(330, 435); // Eo phải
        ctx.lineTo(336, 442); // Cổ tay phải
        ctx.lineTo(362, 385); // Khuỷu tay phải
        ctx.lineTo(375, 276); // Vai phải rộng
        ctx.lineTo(320, 256);
        ctx.closePath();
        ctx.fill();

        // Quần đùi nam màu xám thanh lịch
        ctx.fillStyle = '#E2E8F0';
        ctx.beginPath();
        ctx.rect(266, 440, 68, 85);
        ctx.fill();
        ctx.strokeStyle = '#CBD5E1';
        ctx.lineWidth = 1;
        ctx.strokeRect(266, 440, 68, 85);

        // Cổ nam vững chãi
        ctx.fillStyle = skinGrad;
        ctx.beginPath();
        ctx.moveTo(284, 218);
        ctx.lineTo(280, 258);
        ctx.lineTo(320, 258);
        ctx.lineTo(316, 218);
        ctx.closePath();
        ctx.fill();

        // Tóc nam & khuôn mặt nam tính
        ctx.fillStyle = '#18181B';
        ctx.beginPath();
        ctx.arc(300, 154, 34, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = skinGrad;
        ctx.beginPath();
        ctx.moveTo(272, 166);
        ctx.quadraticCurveTo(272, 145, 300, 145);
        ctx.quadraticCurveTo(328, 145, 328, 166);
        ctx.lineTo(325, 196);
        ctx.quadraticCurveTo(322, 216, 310, 222);
        ctx.lineTo(290, 222);
        ctx.quadraticCurveTo(278, 216, 275, 196);
        ctx.closePath();
        ctx.fill();

        // Mày kiếm mi & mắt
        ctx.strokeStyle = '#18181B';
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(278, 170);
        ctx.lineTo(295, 166);
        ctx.moveTo(305, 166);
        ctx.lineTo(322, 170);
        ctx.stroke();

        ctx.fillStyle = '#18181B';
        ctx.beginPath();
        ctx.ellipse(287, 176, 4.8, 2.5, -0.05, 0, Math.PI * 2);
        ctx.ellipse(313, 176, 4.8, 2.5, 0.05, 0, Math.PI * 2);
        ctx.fill();

        // Mũi & môi
        ctx.strokeStyle = 'rgba(150, 90, 50, 0.45)';
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(300, 173);
        ctx.lineTo(298, 194);
        ctx.lineTo(304, 196);
        ctx.stroke();

        ctx.fillStyle = '#C48A76';
        ctx.beginPath();
        ctx.moveTo(293, 206);
        ctx.lineTo(307, 206);
        ctx.quadraticCurveTo(300, 211, 293, 206);
        ctx.fill();

      } else {
        // =====================================================================
        // MANNEQUIN NỮ: CHUẨN TỈ LỆ SIÊU MẪU 8 ĐẦU (THÂN THỂ CÓ DA CÓ THỊT, TRỤC CHÂN THẲNG TẮP)
        // DÁNG A-POSE DANG TAY KHỚP TAY ÁO THỤNG, VAI NẰM TRỌN DƯỚI ÁO, LỘ BÚI TÓC & MÁI TÓC MAI
        // =====================================================================

        // 🌟 1. ĐÔI CHÂN THẲNG TẮP SONG SONG CHUẨN SIÊU MẪU (LOẠI BỎ HOÀN TOÀN TẬT VÒNG KIỀNG)
        ctx.fillStyle = bodySkinGrad;

        // Chân trái (Trục chân thẳng tắp x = 278)
        ctx.beginPath();
        ctx.moveTo(266, 456); // Đùi trên từ gấu quần
        ctx.quadraticCurveTo(258, 510, 266, 565); // Đùi ngoài lượn mềm có da có thịt xuống đầu gối ngoài
        ctx.quadraticCurveTo(265, 620, 270, 715); // Bắp chân ngoài thuôn dài xuống mắt cá ngoài
        ctx.lineTo(268, 745); // Gót chân
        ctx.quadraticCurveTo(278, 748, 288, 745); // Mũi bàn chân thẳng
        ctx.lineTo(284, 715); // Mắt cá trong
        ctx.quadraticCurveTo(289, 620, 288, 565); // Khớp gối trong
        ctx.quadraticCurveTo(286, 510, 294, 456); // Đùi trong thẳng khép nhẹ
        ctx.closePath();
        ctx.fill();

        // Chân phải (Trục chân thẳng tắp x = 322)
        ctx.beginPath();
        ctx.moveTo(334, 456); // Đùi trên từ gấu quần
        ctx.quadraticCurveTo(342, 510, 334, 565); // Đùi ngoài lượn mềm có da có thịt xuống đầu gối ngoài
        ctx.quadraticCurveTo(335, 620, 330, 715); // Bắp chân ngoài thuôn dài xuống mắt cá ngoài
        ctx.lineTo(332, 745); // Gót chân
        ctx.quadraticCurveTo(322, 748, 312, 745); // Mũi bàn chân thẳng
        ctx.lineTo(316, 715); // Mắt cá trong
        ctx.quadraticCurveTo(311, 620, 312, 565); // Khớp gối trong
        ctx.quadraticCurveTo(314, 510, 306, 456); // Đùi trong thẳng khép nhẹ
        ctx.closePath();
        ctx.fill();

        // Khối xương bánh chè & khớp gối thẳng hàng tự nhiên (khoảng cách 46px song song chuẩn tỉ lệ vàng)
        ctx.strokeStyle = 'rgba(210, 140, 110, 0.28)';
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.arc(277, 565, 4.5, 0, Math.PI);
        ctx.arc(323, 565, 4.5, 0, Math.PI);
        ctx.stroke();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.beginPath();
        ctx.ellipse(277, 563, 2.5, 3.5, 0, 0, Math.PI * 2);
        ctx.ellipse(323, 563, 2.5, 3.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // 🌟 2. THÂN MÌNH (CHÂN CỔ VÀ VAI ĐỒNG BỘ Y=252, NẰM GỌN TRỌN VẸN BÊN TRONG ÁO CỔ PHỤC)
        ctx.fillStyle = bodySkinGrad;
        ctx.beginPath();
        ctx.moveTo(284, 252); // Chân cổ trái hạ xuống y=252 khớp đường viền vai áo Nhật Bình
        ctx.quadraticCurveTo(262, 256, 246, 260); // Bờ vai trái dốc êm nữ tính
        ctx.quadraticCurveTo(252, 305, 256, 335); // Sườn ngực trái đầy đặn
        ctx.quadraticCurveTo(262, 365, 264, 375); // Vòng eo mềm mại thon nhỏ
        ctx.quadraticCurveTo(250, 420, 248, 456); // Hông nở trái tròn trịa
        ctx.lineTo(352, 456); // Hông nở phải
        ctx.quadraticCurveTo(350, 420, 336, 375); // Vòng eo phải
        ctx.quadraticCurveTo(338, 365, 344, 335); // Sườn ngực phải đầy đặn
        ctx.quadraticCurveTo(348, 305, 354, 260); // Bờ vai phải dốc êm
        ctx.quadraticCurveTo(338, 256, 316, 252); // Chân cổ phải
        ctx.closePath();
        ctx.fill();

        // 🌟 3. ÁO CROPTOP TRƠN MỊN MÀU XÁM NGỌC TRAI (ÔM KHÍT TỰ NHIÊN, KHÔNG HỌA TIẾT NẾP)
        const cropGrad = ctx.createLinearGradient(300, 252, 300, 348);
        cropGrad.addColorStop(0, '#E2E8F0');
        cropGrad.addColorStop(0.5, '#CBD5E1');
        cropGrad.addColorStop(1, '#94A3B8');

        ctx.fillStyle = cropGrad;
        ctx.beginPath();
        ctx.moveTo(280, 254); // Cổ áo tròn thanh lịch bên trái
        ctx.quadraticCurveTo(300, 264, 320, 254); // Cổ áo khoét nhẹ khoe xương quai xanh
        ctx.lineTo(248, 262); // Nách áo bên trái
        ctx.quadraticCurveTo(254, 305, 258, 335); // Ôm khuôn ngực mềm mại
        ctx.quadraticCurveTo(260, 344, 263, 348); // Gấu áo bên trái trên rốn
        ctx.quadraticCurveTo(300, 352, 337, 348); // Gấu áo lượn cong mềm mại
        ctx.quadraticCurveTo(340, 344, 342, 335);
        ctx.quadraticCurveTo(346, 305, 352, 262);
        ctx.lineTo(320, 254);
        ctx.closePath();
        ctx.fill();

        // Đổ bóng 3D khuôn ngực tự nhiên mượt mà (bề mặt vải trơn sạch sẽ, không có đường sọc)
        const cropHighlight = ctx.createRadialGradient(300, 304, 10, 300, 304, 45);
        cropHighlight.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
        cropHighlight.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = cropHighlight;
        ctx.fill();

        // Viền nẹp trắng tinh khôi ở cổ và gấu áo croptop (mịn màng, trang nhã)
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(280, 254);
        ctx.quadraticCurveTo(300, 264, 320, 254);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(263, 348);
        ctx.quadraticCurveTo(300, 352, 337, 348);
        ctx.stroke();

        // Khoảng hở eo thon phẳng và rốn nhỏ xinh cùng màu da mặt
        ctx.fillStyle = 'rgba(190, 120, 90, 0.45)';
        ctx.beginPath();
        ctx.ellipse(300, 362, 1.8, 2.4, 0, 0, Math.PI * 2);
        ctx.fill();

        // 🌟 4. QUẦN ĐÙI MÀU XÁM TRẮNG CẠP CAO (LIỀN MẠCH, KÍN ĐÁO, KHÔNG BỊ RÁCH ĐŨNG, KHÔNG ĐAI HỘP VUÔNG)
        ctx.fillStyle = cropGrad;
        ctx.beginPath();
        ctx.moveTo(262, 374); // Cạp quần trái
        ctx.quadraticCurveTo(300, 376, 338, 374); // Cạp quần cong nhẹ ôm sát eo
        ctx.quadraticCurveTo(352, 415, 348, 456); // Ống ngoài bên phải
        ctx.quadraticCurveTo(326, 460, 306, 452); // Gấu ống phải
        ctx.quadraticCurveTo(300, 448, 294, 452); // Đũng quần liền mạch cong tròn chữ U (kín đáo 100%, không rách)
        ctx.quadraticCurveTo(274, 460, 252, 456); // Gấu ống trái
        ctx.quadraticCurveTo(248, 415, 262, 374); // Ống ngoài bên trái
        ctx.closePath();
        ctx.fill();

        // Viền nẹp trắng tinh tế ở cạp quần và gấu quần đồng bộ với croptop
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        // Nẹp cạp quần
        ctx.moveTo(262, 374);
        ctx.quadraticCurveTo(300, 376, 338, 374);
        // Nẹp gấu ống trái
        ctx.moveTo(252, 456);
        ctx.quadraticCurveTo(274, 460, 294, 452);
        // Nẹp gấu ống phải
        ctx.moveTo(306, 452);
        ctx.quadraticCurveTo(326, 460, 348, 456);
        ctx.stroke();

        // 🌟 5. ĐÔI CÁNH TAY DANG RỘNG TỰ NHIÊN (A-POSE) ĐẦY ĐẶN, THON THẢ VÀ CÂN ĐỐI
        // Khi không mặc áo (chỉ mặc đồ lót croptop & quần đùi), cánh tay và bàn tay hiển thị đầy đủ, to và đẫy đà hơn
        // Khi mặc áo truyền thống (mainActive = true), tay áo thụng che kín hoàn toàn bàn tay ("áo che hết r")
        if (!mainActive) {
          ctx.fillStyle = bodySkinGrad;

          // Cánh tay trái dang A-pose tự nhiên đầy đặn hơn
          ctx.beginPath();
          ctx.moveTo(246, 258); // Khớp vai trái
          ctx.quadraticCurveTo(222, 305, 210, 345); // Bắp tay đầy đặn hơn
          ctx.quadraticCurveTo(198, 385, 186, 415); // Cẳng tay thon thả
          ctx.lineTo(168, 445); // Cổ tay ngoài
          ctx.lineTo(158, 470); // Đầu ngón tay búp măng
          ctx.quadraticCurveTo(165, 476, 172, 470);
          ctx.lineTo(180, 442); // Cổ tay trong
          ctx.quadraticCurveTo(210, 400, 230, 355); // Cẳng tay trong
          ctx.quadraticCurveTo(240, 310, 254, 268); // Nách và bắp tay trong
          ctx.closePath();
          ctx.fill();

          // Rãnh ngón tay trái
          ctx.strokeStyle = 'rgba(190, 120, 90, 0.32)';
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(164, 458);
          ctx.lineTo(163, 471);
          ctx.moveTo(168, 459);
          ctx.lineTo(168, 472);
          ctx.stroke();

          // Cánh tay phải dang A-pose tự nhiên đầy đặn hơn
          ctx.beginPath();
          ctx.moveTo(354, 258); // Khớp vai phải
          ctx.quadraticCurveTo(378, 305, 390, 345); // Bắp tay đầy đặn hơn
          ctx.quadraticCurveTo(402, 385, 414, 415); // Cẳng tay thon thả
          ctx.lineTo(432, 445); // Cổ tay ngoài
          ctx.lineTo(442, 470); // Đầu ngón tay búp măng
          ctx.quadraticCurveTo(435, 476, 428, 470);
          ctx.lineTo(420, 442); // Cổ tay trong
          ctx.quadraticCurveTo(390, 400, 370, 355); // Cẳng tay trong
          ctx.quadraticCurveTo(360, 310, 346, 268); // Nách và bắp tay trong
          ctx.closePath();
          ctx.fill();

          // Rãnh ngón tay phải
          ctx.strokeStyle = 'rgba(190, 120, 90, 0.32)';
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(436, 458);
          ctx.lineTo(437, 471);
          ctx.moveTo(432, 459);
          ctx.lineTo(432, 472);
          ctx.stroke();
        }

        // 🌟 6. CỔ THIÊN NGA THON GỌN VÀ HÕM CỔ ĐỒNG BỘ Y=252 (KHÔNG BỊ NHÔ LÊN SO VỚI ÁO)
        ctx.fillStyle = skinGrad;
        ctx.beginPath();
        ctx.moveTo(287, 214); // Dưới hàm trái
        ctx.quadraticCurveTo(287, 232, 285, 252); // Chân cổ trái nối êm vào vai áo ở y=252
        ctx.lineTo(315, 252); // Chân cổ phải
        ctx.quadraticCurveTo(313, 232, 313, 214); // Dưới hàm phải
        ctx.closePath();
        ctx.fill();

        // Hõm cổ & nét gầy xương quai xanh quý phái (đặt vừa vặn bên trong cổ áo)
        ctx.strokeStyle = 'rgba(180, 110, 80, 0.28)';
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.arc(300, 252, 2, 0, Math.PI);
        ctx.moveTo(286, 254);
        ctx.quadraticCurveTo(266, 258, 250, 262);
        ctx.moveTo(314, 254);
        ctx.quadraticCurveTo(334, 258, 350, 262);
        ctx.stroke();

        // 🌟 7. ĐẦU, BÚI TÓC CUNG ĐÌNH TRÒN ĐẦY VÀ LỌN TÓC MAI (KHÔNG ẨN HOÀN TOÀN BÚI TÓC, LỘ MAI TÓC)
        // Vòm tóc đen tròn trịa tự nhiên bao trọn sọ đầu
        ctx.fillStyle = '#18181B';
        ctx.beginPath();
        ctx.ellipse(300, 146, 38, 36, 0, 0, Math.PI * 2);
        ctx.fill();

        // Búi tóc cung đình tròn trịa ở đỉnh sau đầu (không ẩn hoàn toàn, lộ tròn đầy tự nhiên)
        ctx.fillStyle = '#1C1917';
        ctx.beginPath();
        ctx.ellipse(300, 122, 19, 13, 0, 0, Math.PI * 2);
        ctx.fill();

        // Ánh tóc mượt mà trên búi tóc
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(300, 121, 14, -Math.PI * 0.8, -Math.PI * 0.2);
        ctx.stroke();

        // Đôi tai nhỏ xinh hai bên
        ctx.fillStyle = skinGrad;
        ctx.beginPath();
        ctx.ellipse(268, 180, 4.5, 7.5, -0.1, 0, Math.PI * 2);
        ctx.ellipse(332, 180, 4.5, 7.5, 0.1, 0, Math.PI * 2);
        ctx.fill();

        // Khuyên ngọc trai nhỏ rơi từ tai
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(268, 188, 2, 0, Math.PI * 2);
        ctx.arc(332, 188, 2, 0, Math.PI * 2);
        ctx.fill();

        // 🌟 8. KHUÔN MẶT TRÁI XOAN THANH TÚ TRẮNG HỒNG (TỈ LỆ CHUẨN MỸ THUẬT)
        ctx.fillStyle = skinGrad;
        ctx.beginPath();
        ctx.moveTo(270, 164);
        ctx.quadraticCurveTo(270, 142, 300, 142); // Vầng trán cao thanh tú
        ctx.quadraticCurveTo(330, 142, 330, 164);
        ctx.lineTo(326, 188);
        ctx.quadraticCurveTo(322, 210, 300, 214); // Cằm trái xoan V-line thon mềm thanh tú
        ctx.quadraticCurveTo(278, 210, 274, 188);
        ctx.closePath();
        ctx.fill();

        // 🌟 9. MÁI TÓC RẼ NGÔI CUNG ĐÌNH CONG CHỮ M & LỌN TÓC MAI THANH TÚ LỘ RÕ TRƯỚC MŨ
        // Mái tóc đen mun uốn lượn hình cánh cung ôm trán, nối mềm vào vòm sọ
        ctx.fillStyle = '#18181B';
        ctx.beginPath();
        // Bắt đầu từ chân tóc thái dương trái
        ctx.moveTo(270, 164);
        // Đường chân tóc dưới uốn lượn mềm mại hình chữ M qua đường ngôi giữa
        ctx.quadraticCurveTo(285, 148, 300, 154); // Nửa mái trái
        ctx.quadraticCurveTo(315, 148, 330, 164); // Nửa mái phải
        // Đường viền trên ôm theo vòm sọ tự nhiên (HOÀN TOÀN UỐN CONG, KHÔNG CÓ ĐƯỜNG CẮT NGANG)
        ctx.quadraticCurveTo(336, 136, 300, 134);
        ctx.quadraticCurveTo(264, 136, 270, 164);
        ctx.closePath();
        ctx.fill();

        // Lọn tóc mai thanh tú rủ nhẹ hai bên trước mang tai (lộ rõ nét kiêu sa khi chụp mẫu)
        ctx.strokeStyle = '#18181B';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(270, 164);
        ctx.quadraticCurveTo(265, 173, 267, 182);
        ctx.moveTo(330, 164);
        ctx.quadraticCurveTo(335, 173, 333, 182);
        ctx.stroke();

        // Chân mày lá liễu thanh mảnh
        ctx.strokeStyle = '#27272A';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(280, 168);
        ctx.quadraticCurveTo(288, 161, 296, 163);
        ctx.moveTo(320, 168);
        ctx.quadraticCurveTo(312, 161, 304, 163);
        ctx.stroke();

        // Đôi mắt phượng đen láy to tròn long lanh & đốm sáng
        ctx.fillStyle = '#18181B';
        ctx.beginPath();
        ctx.ellipse(287, 173, 4.4, 2.4, -0.06, 0, Math.PI * 2);
        ctx.ellipse(313, 173, 4.4, 2.4, 0.06, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(288, 172, 1.2, 0, Math.PI * 2);
        ctx.arc(314, 172, 1.2, 0, Math.PI * 2);
        ctx.fill();

        // Sống mũi cao thanh mảnh
        ctx.strokeStyle = 'rgba(180, 110, 80, 0.35)';
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.moveTo(300, 169);
        ctx.lineTo(299, 187);
        ctx.lineTo(303, 189);
        ctx.stroke();

        // Môi son hồng đào chúm chím
        ctx.fillStyle = '#F43F5E';
        ctx.beginPath();
        ctx.moveTo(293, 201);
        ctx.quadraticCurveTo(300, 198, 307, 201);
        ctx.quadraticCurveTo(300, 206, 293, 201);
        ctx.fill();

        // Đốm sáng môi son
        ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
        ctx.beginPath();
        ctx.arc(300, 200, 1.2, 0, Math.PI * 2);
        ctx.fill();

        // Đôi gò má ửng hồng phấn
        ctx.fillStyle = 'rgba(244, 63, 94, 0.12)';
        ctx.beginPath();
        ctx.arc(282, 184, 6.5, 0, Math.PI * 2);
        ctx.arc(318, 184, 6.5, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }

    // =========================================================================
    // 3. LAYER: KHĂN VÀNH SA / KHĂN ĐÓNG / MŨ BERET / BĂNG ĐÔ
    // =========================================================================
    if (hasKhanVanh) {
      ctx.save();
      const isBlue = selectedAccessories.some(a => a.toLowerCase().includes('lam') || a.toLowerCase().includes('xanh'));

      // 🌟 KHĂN VÀNH SA PHỐI CẢNH 3D: NỬA TRÊN (LỚP PHÍA TRƯỚC, TRÙM QUA ĐỈNH ĐẦU CHE BÚI TÓC, RỖNG Ở GIỮA)
      ctx.beginPath();
      // Cung ngoài nửa trên: từ Math.PI (trái) lên đỉnh vòm sọ rồi sang 0 (phải)
      ctx.ellipse(300, 150, 72, 52, 0, Math.PI, 0, false);
      // Nối vào vành trong bên phải
      ctx.lineTo(300 + 39, 150);
      // Cung trong nửa trên: từ 0 (phải) lên đỉnh vòm sọ rồi sang Math.PI (trái) ngược chiều kim đồng hồ
      ctx.ellipse(300, 150, 39, 28, 0, 0, Math.PI, true);
      ctx.closePath();

      // Màu gradient nửa trên đồng bộ 100% với nửa dưới ở Layer 1
      const saUpperGrad = ctx.createRadialGradient(300, 146, 15, 300, 150, 72);
      if (isBlue || (!isBlue && !selectedAccessories.some(a => a.toLowerCase().includes('đỏ')))) {
        saUpperGrad.addColorStop(0, '#2563EB');
        saUpperGrad.addColorStop(0.5, '#1D4ED8');
        saUpperGrad.addColorStop(0.85, '#1E40AF');
        saUpperGrad.addColorStop(1, '#172554');
      } else {
        saUpperGrad.addColorStop(0, '#F43F5E');
        saUpperGrad.addColorStop(0.5, '#E11D48');
        saUpperGrad.addColorStop(0.85, '#BE123C');
        saUpperGrad.addColorStop(1, '#881337');
      }
      ctx.fillStyle = saUpperGrad;
      ctx.fill();

      // Viền kim tuyến vàng thanh lịch mép ngoài và mép trong
      ctx.strokeStyle = '#FACC15';
      ctx.lineWidth = 1.8;
      ctx.stroke();

      // Các vòng elip ánh kim tuyến tạo chiều sâu nếp gấp khăn ở nửa trên
      ctx.strokeStyle = 'rgba(250, 204, 21, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(300, 150, 64, 44, 0, Math.PI, 0, false);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(300, 150, 56, 38, 0, Math.PI, 0, false);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(300, 150, 48, 32, 0, Math.PI, 0, false);
      ctx.stroke();

      // Bác sơn cài vàng hoàng gia lấp lánh ở đỉnh chân trán
      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.arc(300, 150, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.restore();

    } else if (hasKhanDong) {
      ctx.save();
      const kdX = 300;
      const kdY = 142; // Khăn đóng đội cao sát chân tóc
      ctx.fillStyle = '#09090B';
      ctx.beginPath();
      ctx.ellipse(kdX, kdY, 32, 12, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#3F3F46';
      ctx.lineWidth = 1.3;
      for (let i = 0; i < 6; i++) {
        ctx.beginPath();
        ctx.ellipse(kdX, kdY - i * 2.2, 30 - i * 0.8, 11 - i * 0.5, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();

    } else if (hasBeret) {
      // Mũ beret dạ cổ điển phong cách remix
      ctx.save();
      ctx.fillStyle = '#1C1917';
      ctx.beginPath();
      ctx.ellipse(305, 140, 42, 20, -0.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#27272A';
      ctx.beginPath();
      ctx.arc(314, 124, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

    } else if (hasHeadband) {
      // Băng đô lụa tơ tằm thêu tay cách tân
      ctx.save();
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 5.5;
      ctx.beginPath();
      ctx.arc(300, 158, 29, Math.PI * 1.15, Math.PI * 1.85);
      ctx.stroke();
      ctx.restore();
    }

    // =========================================================================
    // 4. LAYER: INNER SILK PANTS (QUẦN LỤA BẠCH CUNG ĐÌNH MẶC FULL CHÂN TỪ THẮT LƯNG ĐẾN GÓT)
    // =========================================================================
    const innerActive = visibleLayers['cmp-inner'] !== false;
    if (innerActive) {
      ctx.save();
      const pantsGrad = ctx.createLinearGradient(250, 370, 350, 755);
      pantsGrad.addColorStop(0, '#FFFFFF');
      pantsGrad.addColorStop(0.3, '#FAF5EF');
      pantsGrad.addColorStop(0.7, '#F1F5F9');
      pantsGrad.addColorStop(1, '#E2E8F0');
      ctx.fillStyle = pantsGrad;

      // Quần lụa bạch cung đình mặc Full chân từ thắt lưng (y = 370) phủ kín mu bàn chân (y = 750)
      ctx.beginPath();
      ctx.moveTo(260, 370); // Cạp quần trái
      ctx.quadraticCurveTo(300, 374, 340, 370); // Cạp quần phải ôm ngang thắt lưng
      ctx.quadraticCurveTo(356, 430, 354, 520); // Hông nở phải
      ctx.quadraticCurveTo(350, 620, 356, 750); // Ống quần ngoài bên phải buông xòe rộng phủ kín chân
      ctx.lineTo(306, 750); // Gấu ống phải
      ctx.quadraticCurveTo(302, 590, 300, 480); // Đáy đũng quần thụng mềm mại
      ctx.quadraticCurveTo(298, 590, 294, 750); // Gấu ống trái
      ctx.lineTo(244, 750); // Ống quần ngoài bên trái buông xòe rộng phủ kín chân
      ctx.quadraticCurveTo(250, 620, 246, 520); // Sườn ống ngoài trái
      ctx.quadraticCurveTo(244, 430, 260, 370); // Hông trái
      ctx.closePath();
      ctx.fill();

      // Nếp gấp lụa bạch rủ mềm mại tạo chiều sâu chất liệu gấm lụa cung đình
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      // Nếp rủ ống trái
      ctx.moveTo(270, 440);
      ctx.quadraticCurveTo(266, 580, 268, 748);
      ctx.moveTo(284, 500);
      ctx.quadraticCurveTo(286, 610, 282, 748);
      // Nếp rủ ống phải
      ctx.moveTo(330, 440);
      ctx.quadraticCurveTo(334, 580, 332, 748);
      ctx.moveTo(316, 500);
      ctx.quadraticCurveTo(314, 610, 318, 748);
      ctx.stroke();

      // Nẹp gấu quần lụa hai bên
      ctx.strokeStyle = 'rgba(203, 213, 225, 0.8)';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(244, 748);
      ctx.lineTo(294, 748);
      ctx.moveTo(306, 748);
      ctx.lineTo(356, 748);
      ctx.stroke();

      ctx.restore();
    }

    // =========================================================================
    // 5. LAYER: MAIN ROBE BODY (HAI VẠT ĐỐI KHÂM CHỮ NHẬT & TAY ÁO NGŨ SẮC TOÀN PHẦN)
    // =========================================================================
    let robeBaseColor = selectedColor?.hex || '#9B2C2C';
    const colId = selectedColor?.id || '';
    const colName = (selectedColor?.name || '').toLowerCase();
    const colHex = (selectedColor?.hex || '').toLowerCase();
    const isPink = colId.includes('pink') || colName.includes('hồng') || colHex === '#fbcfe8';
    const isIvory = colId.includes('ivory') || colName.includes('trắng') || colName.includes('bạch') || colHex === '#faf7f0';

    if (mainActive) {
      ctx.save();
      const robeGrad = ctx.createLinearGradient(200, 260, 420, 730);
      robeGrad.addColorStop(0, robeBaseColor);
      robeGrad.addColorStop(0.3, adjustBrightness(robeBaseColor, 20));
      robeGrad.addColorStop(0.65, robeBaseColor);
      robeGrad.addColorStop(1, adjustBrightness(robeBaseColor, -25));
      ctx.fillStyle = robeGrad;

      if (isNhatBinh) {
        // 🌟 TOÀN BỘ THÂN ÁO, VẠT ÁO VÀ HAI TAY THỤNG LIỀN MẠCH TỪ CHÂN CỔ SUỐT RA CỬA TAY
        ctx.fillStyle = robeGrad;
        ctx.beginPath();
        // Bắt đầu từ chân cổ bên trái
        ctx.moveTo(284, 248);
        // Sườn vai trái và mép trên tay áo thụng lượn cong mềm mại, liền mạch ra tận cửa tay áo
        ctx.quadraticCurveTo(195, 266, 115, 380);
        // Cửa tay áo thụng bên trái
        ctx.lineTo(180, 500);
        // Nách và sườn trong tay áo trái nối vào eo
        ctx.lineTo(238, 455);
        // Sườn áo trái buông thẳng xuống gấu áo
        ctx.lineTo(232, 725);
        // Gấu áo dưới đáy buông ngang
        ctx.lineTo(368, 725);
        // Sườn áo phải lên nách
        ctx.lineTo(362, 455);
        // Nách và sườn trong tay áo phải ra cửa tay phải
        ctx.lineTo(420, 500);
        // Cửa tay áo thụng bên phải
        ctx.lineTo(485, 380);
        // Mép trên tay áo thụng và sườn vai phải lượn cong mềm mại, liền mạch về chân cổ bên phải
        ctx.quadraticCurveTo(405, 266, 316, 248);
        // Vòng chân cổ nối liền hai bên vai áo
        ctx.quadraticCurveTo(300, 252, 284, 248);
        ctx.closePath();
        ctx.fill();

        // Đường may nối cánh tay thụng truyền thống (nếp gập tay áo mềm mại tự nhiên)
        ctx.strokeStyle = adjustBrightness(robeBaseColor, -20);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(244, 305);
        ctx.lineTo(238, 455);
        ctx.moveTo(356, 305);
        ctx.lineTo(362, 455);
        ctx.stroke();

        // Đường chỉ may đối khâm thẳng chính giữa hai vạt áo từ chân cổ xuống gấu
        ctx.strokeStyle = adjustBrightness(robeBaseColor, -35);
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(300, 252);
        ctx.lineTo(300, 725);
        ctx.stroke();

        // 🌟 ĐỒ ÁN HOA VĂN TRÒN PHƯỢNG Ổ / LOAN Ổ NHỎ XINH RẢI ĐỀU TRÊN THÂN VÀ VAI ÁO (CHUẨN HÌNH 3, BỎ Ổ BỊ CHE Ở CỔ TAY)
        const phoenixRoundels = [
          // Hai bên ngực ngoài nẹp áo
          { x: 236, y: 350, r: 10.5 },
          { x: 364, y: 350, r: 10.5 },
          // Hai bên vai áo
          { x: 205, y: 315, r: 11 },
          { x: 395, y: 315, r: 11 },
          // Dọc thân áo dưới
          { x: 255, y: 510, r: 10.5 },
          { x: 345, y: 510, r: 10.5 },
          { x: 250, y: 620, r: 11 },
          { x: 350, y: 620, r: 11 }
        ];

        phoenixRoundels.forEach(({ x, y, r }) => {
          ctx.save();
          // Nền tròn gấm vàng hoàng gia
          ctx.fillStyle = 'rgba(254, 243, 199, 0.95)';
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#D4AF37';
          ctx.lineWidth = 1.3;
          ctx.stroke();

          // Họa tiết phượng hoàng / loan phụng uốn tròn
          ctx.fillStyle = '#DC2626';
          ctx.beginPath();
          ctx.arc(x, y, r * 0.65, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = '#FACC15';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(x, y, r * 0.38, 0, Math.PI * 1.5);
          ctx.stroke();

          // Tâm ngọc xanh lam
          ctx.fillStyle = '#0284C7';
          ctx.beginPath();
          ctx.arc(x + 1.2, y - 1, 1.8, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });

        // 🌟 4. CỬA TAY ÁO:
        // - Khi là Áo Hồng Phấn: Cửa tay dùng các dải màu PASTEL dịu mắt (Tím lavender, Xanh lơ nhạt, Vàng bơ, Hồng phấn, Trắng kem) - Chuẩn 100% Ảnh 2!
        // - Khi là Áo Trắng Ngà: Cửa tay dùng dải màu Trắng ngà - Vàng kim champagne thanh nhã đồng điệu - Chuẩn 100% Ảnh 1!
        // - Khi là Áo Truyền Thống: Cửa tay dùng 5 màu ngũ sắc cung đình (Đỏ, Trắng, Lam, Vàng, Lục)
        let cuffColors = ['#DC2626', '#FFFFFF', '#1D4ED8', '#FACC15', '#15803D'];
        if (isPink) {
          cuffColors = ['#C4B5FD', '#BAE6FD', '#FEF08A', '#FBCFE8', '#FFF7ED'];
        } else if (isIvory) {
          cuffColors = ['#D4AF37', '#FFFDF5', '#FEF08A', '#FAF7F0', '#E2E8F0'];
        }
        const stripeW = 7.5; // Mỏng gọn theo yêu cầu

        // Véc-tơ hướng dốc mép trên và mép dưới tay áo trái
        const lTopVx = 0.574, lTopVy = -0.818;
        const lBotVx = 0.790, lBotVy = -0.613;

        // Cửa tay áo bên trái (5 dải ngũ sắc ôm khít mép ngoài tay áo, không viền vàng thừa)
        for (let i = 0; i < 5; i++) {
          const s0 = i * stripeW;
          const s1 = (i + 1) * stripeW;
          const p1x = 115 + s0 * lTopVx;
          const p1y = 380 + s0 * lTopVy;
          const p2x = 180 + s0 * lBotVx;
          const p2y = 500 + s0 * lBotVy;
          const p3x = 180 + s1 * lBotVx;
          const p3y = 500 + s1 * lBotVy;
          const p4x = 115 + s1 * lTopVx;
          const p4y = 380 + s1 * lTopVy;

          ctx.fillStyle = cuffColors[i];
          ctx.beginPath();
          ctx.moveTo(p1x, p1y);
          ctx.lineTo(p2x, p2y);
          ctx.lineTo(p3x, p3y);
          ctx.lineTo(p4x, p4y);
          ctx.closePath();
          ctx.fill();
        }

        // Véc-tơ hướng dốc mép trên và mép dưới tay áo phải (đối xứng)
        const rTopVx = -0.574, rTopVy = -0.818;
        const rBotVx = -0.790, rBotVy = -0.613;

        // Cửa tay áo bên phải (5 dải ngũ sắc ôm khít mép ngoài tay áo, không viền vàng thừa)
        for (let i = 0; i < 5; i++) {
          const s0 = i * stripeW;
          const s1 = (i + 1) * stripeW;
          const p1x = 485 + s0 * rTopVx;
          const p1y = 380 + s0 * rTopVy;
          const p2x = 420 + s0 * rBotVx;
          const p2y = 500 + s0 * rBotVy;
          const p3x = 420 + s1 * rBotVx;
          const p3y = 500 + s1 * rBotVy;
          const p4x = 485 + s1 * rTopVx;
          const p4y = 380 + s1 * rTopVy;

          ctx.fillStyle = cuffColors[i];
          ctx.beginPath();
          ctx.moveTo(p1x, p1y);
          ctx.lineTo(p2x, p2y);
          ctx.lineTo(p3x, p3y);
          ctx.lineTo(p4x, p4y);
          ctx.closePath();
          ctx.fill();
        }

      } else if (isAoDai) {
        ctx.beginPath();
        ctx.moveTo(275, 255);
        ctx.quadraticCurveTo(240, 275, 205, 360);
        ctx.lineTo(225, 460);
        ctx.quadraticCurveTo(255, 450, 272, 420);
        ctx.lineTo(252, 735);
        ctx.quadraticCurveTo(300, 742, 348, 735);
        ctx.lineTo(328, 420);
        ctx.quadraticCurveTo(345, 450, 375, 460);
        ctx.lineTo(395, 360);
        ctx.quadraticCurveTo(360, 275, 325, 255);
        ctx.closePath();
        ctx.fill();

      } else if (isNguThan) {
        ctx.beginPath();
        ctx.moveTo(isMale ? 255 : 265, 258);
        ctx.lineTo(isMale ? 200 : 215, 310);
        ctx.lineTo(190, 410);
        ctx.lineTo(230, 475);
        ctx.lineTo(252, 440);
        ctx.lineTo(240, 665);
        ctx.quadraticCurveTo(300, 678, 360, 665);
        ctx.lineTo(348, 440);
        ctx.lineTo(370, 475);
        ctx.lineTo(410, 410);
        ctx.lineTo(isMale ? 400 : 385, 310);
        ctx.lineTo(isMale ? 345 : 335, 258);
        ctx.closePath();
        ctx.fill();

      } else if (isAoTac) {
        ctx.beginPath();
        ctx.moveTo(isMale ? 255 : 265, 258);
        ctx.quadraticCurveTo(185, 280, 110, 370);
        ctx.quadraticCurveTo(95, 520, 180, 555);
        ctx.lineTo(235, 455);
        ctx.lineTo(228, 715);
        ctx.quadraticCurveTo(300, 728, 372, 715);
        ctx.lineTo(365, 455);
        ctx.lineTo(420, 555);
        ctx.quadraticCurveTo(505, 520, 490, 370);
        ctx.quadraticCurveTo(415, 280, isMale ? 345 : 335, 258);
        ctx.closePath();
        ctx.fill();

      } else if (isTuThan) {
        ctx.beginPath();
        ctx.moveTo(268, 258);
        ctx.quadraticCurveTo(220, 290, 195, 390);
        ctx.lineTo(230, 460);
        ctx.lineTo(250, 420);
        ctx.lineTo(240, 700);
        ctx.quadraticCurveTo(300, 710, 360, 700);
        ctx.lineTo(350, 420);
        ctx.lineTo(370, 460);
        ctx.lineTo(405, 390);
        ctx.quadraticCurveTo(380, 290, 332, 258);
        ctx.closePath();
        ctx.fill();

      } else if (isBaBa) {
        ctx.beginPath();
        ctx.moveTo(272, 255);
        ctx.lineTo(isMale ? 210 : 220, 305);
        ctx.lineTo(205, 415);
        ctx.lineTo(235, 470);
        ctx.lineTo(256, 440);
        ctx.lineTo(250, 515);
        ctx.lineTo(350, 515);
        ctx.lineTo(344, 440);
        ctx.lineTo(365, 470);
        ctx.lineTo(395, 415);
        ctx.lineTo(isMale ? 390 : 380, 305);
        ctx.lineTo(328, 255);
        ctx.closePath();
        ctx.fill();
      }

      // Khi mặc áo truyền thống, tay áo thụng dài che kín hoàn toàn bàn tay ("áo che hết r"), không vẽ bàn tay thò ra ngoài
      ctx.restore();
    }

    // =========================================================================
    // 6. LAYER: COLLAR & EMBELLISHMENTS (GẮN LIỀN VỚI THÂN ÁO)
    // =========================================================================
    if (mainActive) {
      ctx.save();
      if (isNhatBinh) {
        // =====================================================================
        // ÁO NHẬT BÌNH: NẸP CỔ VÁT XUÔI THEO VAI, MỞ VẠT CHỮ V ĐỂ LỘ VẠCH TIM ÁO LÓT TRẮNG
        // NẸP TRẮNG MỞ RỘNG NHÔ LÊN CHE KÍN ÁO ĐỎ, VẠT HÌNH CHỮ NHẬT MỎNG THANH THOÁT (24PX)
        // =====================================================================
        const bottomY = 398;

        // 🌟 1. ÁO LÓT TRẮNG CỔ ĐỨNG (BẠCH Y) LỘ RA Ở VẠCH TIM ÁO GIỮA HAI VẠT CỔ (CHE KÍN PHẦN NỀN CỔ)
        ctx.save();
        const innerWhiteGrad = ctx.createLinearGradient(290, 230, 310, 294);
        innerWhiteGrad.addColorStop(0, '#FFFFFF');
        innerWhiteGrad.addColorStop(0.65, '#F8FAFC');
        innerWhiteGrad.addColorStop(1, '#E2E8F0');
        ctx.fillStyle = innerWhiteGrad;

        // Vạt áo lót trắng bên trong hình thang phủ từ chân cổ xuống điểm gặp nhau của hai vạt cổ (y=292)
        ctx.beginPath();
        ctx.moveTo(284, 230); // Chân cổ trái
        ctx.quadraticCurveTo(288, 264, 296, 292); // Mép V áo lót trái
        ctx.lineTo(304, 292); // Đáy chữ V
        ctx.quadraticCurveTo(312, 264, 316, 230); // Mép V áo lót phải
        ctx.quadraticCurveTo(300, 234, 284, 230);
        ctx.closePath();
        ctx.fill();

        // Cổ đứng áo lót trắng ôm sát chân cổ (y=230 đến y=244)
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.moveTo(284, 230);
        ctx.quadraticCurveTo(300, 236, 316, 230);
        ctx.lineTo(315, 244);
        ctx.quadraticCurveTo(300, 250, 285, 244);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = 'rgba(203, 213, 225, 0.9)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Vạch tim áo chính giữa (khe xẻ cổ đứng áo lót trắng)
        ctx.strokeStyle = '#94A3B8';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(300, 230);
        ctx.lineTo(300, 290);
        ctx.stroke();

        // Cúc ngọc nhỏ cài cổ đứng áo lót trắng
        ctx.fillStyle = '#F8FAFC';
        ctx.beginPath();
        ctx.arc(300, 238, 2.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#CBD5E1';
        ctx.lineWidth = 0.8;
        ctx.stroke();
        ctx.restore();

        // 🌟 2. HAI VẠT NẸP CỔ ÁO NHẬT BÌNH:
        // - Khi là Áo Hồng Phấn (Chuẩn Ảnh 1): Cổ áo mang dải viền ngoài màu hồng đào pastel (#F472B6) phối chân nẹp tím pastel (#818CF8), dải trong trắng kem
        // - Khi là Áo Trắng Ngà (Chuẩn Ảnh cô gái mặc áo trắng): Cổ áo mang tone trắng ngà (#FAF7F0) viền vàng kim champagne (#D4AF37)
        // - Khi là Áo Truyền Thống: Cổ áo mang dải ngoài màu xanh dương hoàng gia (#1E3A8A), dải trong trắng bạch ngà (#FFFDF5)
        let collarOuterColor = '#1E3A8A';
        let collarInnerColor = '#FFFDF5';
        let collarOuterBorderColor = '#0F172A';
        let collarDetailColor1 = '#F59E0B';
        let collarDetailColor2 = '#DC2626';

        if (isPink) {
          collarOuterColor = '#F472B6'; // Hồng đào pastel đồng điệu với thân áo (chuẩn ảnh 1)
          collarInnerColor = '#FFFDF7'; // Trắng kem
          collarOuterBorderColor = '#DB2777'; // Viền hồng sẫm
          collarDetailColor1 = '#818CF8'; // Chân nẹp tím lavender pastel (chuẩn ảnh 1)
          collarDetailColor2 = '#FB7185'; // Hoa văn hồng phấn
        } else if (isIvory) {
          collarOuterColor = '#FAF7F0'; // Trắng ngà đồng điệu tone-sur-tone (chuẩn ảnh áo trắng)
          collarInnerColor = '#FFFFFF'; // Trắng ngọc
          collarOuterBorderColor = '#D4AF37'; // Viền vàng kim champagne
          collarDetailColor1 = '#D4AF37';
          collarDetailColor2 = '#FDE047';
        }

        // VẠT NẸP TRÁI (VÁT XUÔI THEO VAI TRÁI, MỞ RÃNH TIM CỔ)
        ctx.save();
        
        // 2.1 LỚP NỀN DẢI NGOÀI (PHỦ TOÀN BỘ KHUNG FORM CỔ TRÁI)
        ctx.fillStyle = collarOuterColor;
        ctx.beginPath();
        ctx.moveTo(284, 236);
        ctx.quadraticCurveTo(266, 238, 256, 256);
        ctx.quadraticCurveTo(254, 276, 274, 302);
        ctx.lineTo(274, bottomY);
        ctx.lineTo(298, bottomY);
        ctx.lineTo(298, 292);
        ctx.quadraticCurveTo(290, 264, 284, 236);
        ctx.closePath();
        ctx.fill();

        // Viền mép ngoài cùng của dải ngoài
        ctx.strokeStyle = collarOuterBorderColor;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // 2.2 DẢI TRONG MÀU TRẮNG BẠCH NGÀ (CHIẾM NỬA TRONG CỦA BẢN NẸP)
        ctx.fillStyle = collarInnerColor;
        ctx.beginPath();
        ctx.moveTo(284, 236);
        // Đường phân chia giữa dải ngoài và dải trong uốn dọc theo nẹp (x ~ 286)
        ctx.quadraticCurveTo(278, 260, 286, 302);
        ctx.lineTo(286, bottomY);
        ctx.lineTo(298, bottomY);
        ctx.lineTo(298, 292);
        ctx.quadraticCurveTo(290, 264, 284, 236);
        ctx.closePath();
        ctx.fill();

        // Đường chỉ vàng viền phân cách tinh tế giữa dải ngoài và dải trong
        ctx.strokeStyle = isPink ? '#F472B6' : '#D4AF37';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(284, 236);
        ctx.quadraticCurveTo(278, 260, 286, 302);
        ctx.lineTo(286, bottomY);
        ctx.stroke();

        // Viền chỉ vàng mép trong ôm lấy đường vạt tim
        ctx.strokeStyle = isPink ? '#F472B6' : '#D4AF37';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(284, 236);
        ctx.quadraticCurveTo(290, 264, 298, 292);
        ctx.lineTo(298, bottomY);
        ctx.stroke();

        // Điểm xuyết hoa văn nhẹ nhàng trên dải ngoài và dải trong bên trái
        [322, 356, 386].forEach((yPos) => {
          // Họa tiết dải ngoài
          ctx.fillStyle = collarDetailColor1;
          ctx.beginPath();
          ctx.arc(280, yPos, 2, 0, Math.PI * 2);
          ctx.fill();

          // Họa tiết dải trong
          ctx.fillStyle = collarDetailColor2;
          ctx.beginPath();
          ctx.arc(292, yPos, 1.6, 0, Math.PI * 2);
          ctx.fill();
        });

        // VẠT NẸP PHẢI (ĐỐI XỨNG HOÀN TOÀN QUA TRỤC X=300)
        // 2.3 LỚP NỀN DẢI NGOÀI (PHỦ TOÀN BỘ KHUNG FORM CỔ PHẢI)
        ctx.fillStyle = collarOuterColor;
        ctx.beginPath();
        ctx.moveTo(316, 236);
        ctx.quadraticCurveTo(334, 238, 344, 256);
        ctx.quadraticCurveTo(346, 276, 326, 302);
        ctx.lineTo(326, bottomY);
        ctx.lineTo(302, bottomY);
        ctx.lineTo(302, 292);
        ctx.quadraticCurveTo(310, 264, 316, 236);
        ctx.closePath();
        ctx.fill();

        // Viền mép ngoài cùng của dải ngoài bên phải
        ctx.strokeStyle = collarOuterBorderColor;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // 2.4 DẢI TRONG MÀU TRẮNG BÊN PHẢI (CHIẾM NỬA TRONG CỦA BẢN NẸP)
        ctx.fillStyle = collarInnerColor;
        ctx.beginPath();
        ctx.moveTo(316, 236);
        // Đường phân chia giữa dải ngoài và dải trong bên phải (x ~ 314)
        ctx.quadraticCurveTo(322, 260, 314, 302);
        ctx.lineTo(314, bottomY);
        ctx.lineTo(302, bottomY);
        ctx.lineTo(302, 292);
        ctx.quadraticCurveTo(310, 264, 316, 236);
        ctx.closePath();
        ctx.fill();

        // Đường chỉ vàng viền phân cách giữa dải ngoài và dải trong bên phải
        ctx.strokeStyle = isPink ? '#F472B6' : '#D4AF37';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(316, 236);
        ctx.quadraticCurveTo(322, 260, 314, 302);
        ctx.lineTo(314, bottomY);
        ctx.stroke();

        // Viền chỉ vàng mép trong bên phải ôm lấy đường vạt tim
        ctx.strokeStyle = isPink ? '#F472B6' : '#D4AF37';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(316, 236);
        ctx.quadraticCurveTo(310, 264, 302, 292);
        ctx.lineTo(302, bottomY);
        ctx.stroke();

        // Điểm xuyết hoa văn nhẹ nhàng trên dải ngoài và dải trong bên phải
        [322, 356, 386].forEach((yPos) => {
          // Họa tiết dải ngoài bên phải
          ctx.fillStyle = collarDetailColor1;
          ctx.beginPath();
          ctx.arc(320, yPos, 2, 0, Math.PI * 2);
          ctx.fill();

          // Họa tiết dải trong bên phải
          ctx.fillStyle = collarDetailColor2;
          ctx.beginPath();
          ctx.arc(308, yPos, 1.6, 0, Math.PI * 2);
          ctx.fill();
        });

        // 🌟 4. CÚC CÀI KIM BỘI / BẠCH NGỌC & DẢI TUA RUA (TÙY CHỌN TRONG PHẦN PHỤ KIỆN)
        // Chỉ vẽ khi người dùng chọn phụ kiện Cúc áo hoặc Kim Bội / Dải thao
        if (hasAnyCucOrThao && visibleLayers['cmp-acc'] !== false) {
          const buttonY = 302; // Cài ngay điểm giao nhau của vạt chữ V
          // Đế hoa ngọc bội (Áo hồng: bạch ngọc viền đồng cổ hoa mai như ảnh 1; Áo trắng: bạch ngọc viền vàng kim; Truyền thống: kim bội vàng)
          ctx.fillStyle = isPink ? '#E2E8F0' : isIvory ? '#FFFFFF' : '#F59E0B';
          ctx.beginPath();
          ctx.arc(300, buttonY, 6.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = isPink ? '#94A3B8' : isIvory ? '#D4AF37' : '#B45309';
          ctx.lineWidth = 1.3;
          ctx.stroke();

          // Nhụy ngọc
          ctx.fillStyle = isPink ? '#FB7185' : isIvory ? '#F59E0B' : '#DC2626';
          ctx.beginPath();
          ctx.arc(300, buttonY, 2.8, 0, Math.PI * 2);
          ctx.fill();
          // Ánh ngọc bắt sáng
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(299, buttonY - 1, 1, 0, Math.PI * 2);
          ctx.fill();

          // Dải thao buông rủ có đính ngọc/ấn (Chỉ vẽ khi người dùng chọn phụ kiện có Dải thao / Kim bội / Ấn)
          if (hasThao) {
            // Khóa ngọc chặn dải tua rua ở đáy nẹp cổ (y = 398)
            ctx.fillStyle = '#FDE047';
            ctx.beginPath();
            ctx.roundRect(296, bottomY - 2, 8, 10, 2);
            ctx.fill();
            ctx.strokeStyle = '#78350F';
            ctx.lineWidth = 1;
            ctx.stroke();

            // Hai dải tua rua đỏ thắm buông dài từ cúc áo kim bội qua đáy nẹp cổ
            ctx.strokeStyle = '#DC2626';
            ctx.lineWidth = 2.4;
            ctx.beginPath();
            ctx.moveTo(298, buttonY + 7);
            ctx.lineTo(296, bottomY + 50);
            ctx.moveTo(302, buttonY + 7);
            ctx.lineTo(304, bottomY + 50);
            ctx.stroke();

            // Hạt ngọc chặn tua rua
            ctx.fillStyle = '#FACC15';
            ctx.beginPath();
            ctx.arc(296, bottomY + 50, 2.6, 0, Math.PI * 2);
            ctx.arc(304, bottomY + 50, 2.6, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.restore();

      } else if (isAoDai) {
        ctx.fillStyle = robeBaseColor;
        ctx.beginPath();
        ctx.moveTo(287, 238);
        ctx.lineTo(313, 238);
        ctx.lineTo(316, 262);
        ctx.lineTo(284, 262);
        ctx.closePath();
        ctx.fill();

      } else if (isNguThan || isAoTac) {
        ctx.fillStyle = adjustBrightness(robeBaseColor, 15);
        ctx.beginPath();
        ctx.arc(300, 252, 17, 0, Math.PI);
        ctx.lineTo(283, 238);
        ctx.lineTo(317, 238);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#D4AF37';
        ctx.lineWidth = 2.2;
        ctx.stroke();

        [
          { x: 300, y: 246 },
          { x: 318, y: 275 },
          { x: 326, y: 310 },
          { x: 330, y: 350 },
          { x: 332, y: 395 }
        ].forEach((b) => {
          ctx.fillStyle = '#F59E0B';
          ctx.beginPath();
          ctx.arc(b.x, b.y, 3.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#78350F';
          ctx.lineWidth = 0.8;
          ctx.stroke();
        });

      } else if (isTuThan) {
        ctx.fillStyle = '#DC2626';
        ctx.beginPath();
        ctx.moveTo(284, 256);
        ctx.lineTo(316, 256);
        ctx.lineTo(320, 310);
        ctx.lineTo(300, 335);
        ctx.lineTo(280, 310);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    }

    // =========================================================================
    // 7. LAYER: THỦY BA SÓNG NƯỚC & TAM SƠN (THÊU LIỀN TRÊN NỀN GẤU ÁO)
    // =========================================================================
    if (mainActive && isNhatBinh) {
      ctx.save();
      const hemY = 665;
      const hemBottom = 725;

      // 1. CÁC TIA SÓNG THỦY BA NGŨ SẮC NGHIÊNG (THỦY BA LẬP THỂ NGUYÊN BẢN CUNG ĐÌNH)
      const rayColors = ['#1D4ED8', '#EA580C', '#15803D', '#FACC15', '#7E22CE', '#DC2626', '#38BDF8', '#FFFFFF'];
      for (let i = 0; i < 22; i++) {
        const col = rayColors[i % rayColors.length];
        ctx.strokeStyle = col;
        ctx.lineWidth = 3.2;
        ctx.beginPath();
        const startX = 232 + i * 6.4;
        ctx.moveTo(startX, hemBottom);
        ctx.lineTo(startX + (i < 11 ? 10 : -10), hemY + 22);
        ctx.stroke();
      }

      // 2. CÁC CUỘN BỌT SÓNG ĐẦU GẬY NHƯ Ý TRẮNG & KIM TUYẾN
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      for (let wx = 234; wx < 366; wx += 22) {
        ctx.arc(wx + 11, hemY + 20, 10, Math.PI, 0, false);
      }
      ctx.stroke();

      ctx.strokeStyle = '#FACC15';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      for (let wx = 234; wx < 366; wx += 22) {
        ctx.arc(wx + 11, hemY + 22, 7, Math.PI, 0, false);
      }
      ctx.stroke();

      // 3. TƯỜNG VÂN NGŨ SẮC (MÂY CUNG ĐÌNH UỐN LƯỢN TRÊN SÓNG)
      const cloudColors = ['#F59E0B', '#10B981', '#EC4899', '#38BDF8'];
      cloudColors.forEach((cc, cIdx) => {
        ctx.strokeStyle = cc;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        const cx = 248 + cIdx * 34;
        ctx.arc(cx, hemY + 12, 5.5, 0, Math.PI * 2);
        ctx.arc(cx + 7, hemY + 10, 7.5, 0, Math.PI * 2);
        ctx.stroke();
      });

      // 4. NGỌN NÚI TAM SƠN VÀNG ÓNG Ở CHÍNH GIỮA (TAM SƠN ĐỨNG TRÊN SÓNG NƯỚC)
      ctx.fillStyle = '#D97706';
      ctx.beginPath();
      ctx.moveTo(284, hemBottom - 2);
      ctx.lineTo(291, hemY + 8);
      ctx.lineTo(300, hemY - 14); // Đỉnh núi chính
      ctx.lineTo(309, hemY + 8);
      ctx.lineTo(316, hemBottom - 2);
      ctx.closePath();
      ctx.fill();

      // Viền vàng tam sơn
      ctx.strokeStyle = '#FEF08A';
      ctx.lineWidth = 1.8;
      ctx.stroke();

      // Vòng tròn thái cực / ngọc minh châu trong lòng tam sơn
      ctx.fillStyle = '#0284C7';
      ctx.beginPath();
      ctx.arc(300, hemY + 16, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(300, hemY + 16, 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    // =========================================================================
    // 8. LAYER: ACCESSORIES (RENDER TRỰC TIẾP LÊN MẪU)
    // =========================================================================
    const accActive = visibleLayers['cmp-acc'] !== false;
    if (accActive) {
      ctx.save();

      // 8.1 TRÂM BẠC CÀI HOA SEN CẨN NGỌC (CÀI NGANG SAU BÚI TÓC, GIẤU THÂN TRÂM CHỈ LỘ ĐẦU TRÂM VÀ TUA RUA)
      if (hasHairpin) {
        ctx.save();

        // 1. Thân trâm thanh mảnh cài ngang qua búi tóc sau đầu
        // Búi tóc ở x: 300, y: 122. Thân trâm luồn ngang ẩn sau búi tóc:
        const pinY = 122;
        const pinLeftX = 276; // Đuôi trâm kim loại hơi nhú nhẹ bên trái búi tóc
        const pinRightX = 328; // Đầu trâm vươn ra bên phải búi tóc

        // Thân trâm vàng ánh kim luồn ngang phía sau búi tóc
        ctx.strokeStyle = '#D4AF37';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(pinLeftX, pinY);
        ctx.lineTo(pinRightX, pinY);
        ctx.stroke();

        // Điểm đầu nhỏ đuôi trâm bên trái
        ctx.fillStyle = '#E2E8F0';
        ctx.beginPath();
        ctx.arc(pinLeftX, pinY, 1.8, 0, Math.PI * 2);
        ctx.fill();

        // 2. Đầu trâm hoa sen / hoa ngọc cẩn ngọc thanh nhã bên phải búi tóc (x: 328 -> 350, y: 115 -> 126)
        const flowerX = 336;
        const flowerY = 120;

        // Vầng sáng ngọc thanh tao
        ctx.strokeStyle = 'rgba(254, 240, 138, 0.4)';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(flowerX + 4, flowerY - 1, 9, 0, Math.PI * 2);
        ctx.stroke();

        // Cành vàng kết nối các đóa ngọc
        ctx.strokeStyle = '#D4AF37';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(pinRightX, pinY);
        ctx.quadraticCurveTo(flowerX + 2, flowerY - 3, flowerX + 10, flowerY - 4);
        ctx.stroke();

        // Nhánh ngọc / lá ngọc bích xanh non trong suốt ôm lấy hoa (như ảnh mẫu)
        ctx.fillStyle = 'rgba(134, 239, 172, 0.9)'; // Xanh ngọc bích non
        ctx.strokeStyle = '#15803D';
        ctx.lineWidth = 0.8;
        // Chiếc lá ngọc trên
        ctx.beginPath();
        ctx.ellipse(flowerX - 2, flowerY - 7, 5, 2.5, -0.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        // Chiếc lá ngọc dưới
        ctx.beginPath();
        ctx.ellipse(flowerX + 2, flowerY + 6, 5, 2.5, 0.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Đóa hoa sen ngọc bích / hoa ngọc trắng ngà 5 cánh thanh khiết
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#FDE047';
        ctx.lineWidth = 0.8;
        for (let i = 0; i < 5; i++) {
          const a = (i * (Math.PI * 2)) / 5 - 0.2;
          const px = flowerX + 4 + Math.cos(a) * 5.5;
          const py = flowerY - 1 + Math.sin(a) * 5.5;
          ctx.beginPath();
          ctx.arc(px, py, 3.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }

        // Nhụy hoa ngọc vàng ánh kim & đính ruby đỏ nhỏ ở giữa
        ctx.fillStyle = '#F59E0B';
        ctx.beginPath();
        ctx.arc(flowerX + 4, flowerY - 1, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#DC2626';
        ctx.beginPath();
        ctx.arc(flowerX + 4, flowerY - 1, 1.4, 0, Math.PI * 2);
        ctx.fill();

        // Búp hoa phụ nhỏ vươn chếch lên trên
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.ellipse(flowerX + 12, flowerY - 5, 3.5, 2.2, -0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#FDE047';
        ctx.lineWidth = 0.7;
        ctx.stroke();

        // 3. Chuỗi tua rua ngọc và chuông ngọc buông rủ thanh thoát đung đưa bên cạnh búi tóc
        // (3 dải dây chuyền vàng đính hạt ngọc và hoa chuông ngọc rủ xuống như ảnh mẫu)
        const tasselStartX = flowerX + 6;
        const tasselStartY = flowerY + 4;

        // Dải tua rua 1 (ngắn ở trong)
        ctx.strokeStyle = '#D4AF37';
        ctx.lineWidth = 0.9;
        ctx.beginPath();
        ctx.moveTo(tasselStartX - 2, tasselStartY);
        ctx.lineTo(tasselStartX - 2, tasselStartY + 16);
        ctx.stroke();
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(tasselStartX - 2, tasselStartY + 8, 1.5, 0, Math.PI * 2);
        ctx.fill();
        // Hoa chuông ngọc ở đuôi
        ctx.fillStyle = '#FFFDF5';
        ctx.beginPath();
        ctx.moveTo(tasselStartX - 4, tasselStartY + 16);
        ctx.lineTo(tasselStartX, tasselStartY + 16);
        ctx.lineTo(tasselStartX - 2, tasselStartY + 20);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#FDE047';
        ctx.stroke();

        // Dải tua rua 2 (dài nhất ở giữa, rủ mềm mại bên tai)
        ctx.strokeStyle = '#D4AF37';
        ctx.lineWidth = 0.9;
        ctx.beginPath();
        ctx.moveTo(tasselStartX + 2, tasselStartY + 1);
        ctx.lineTo(tasselStartX + 2, tasselStartY + 30);
        ctx.stroke();
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(tasselStartX + 2, tasselStartY + 10, 1.6, 0, Math.PI * 2);
        ctx.arc(tasselStartX + 2, tasselStartY + 20, 1.6, 0, Math.PI * 2);
        ctx.fill();
        // Hạt ngọc chuông ở đuôi
        ctx.fillStyle = '#FFFDF5';
        ctx.beginPath();
        ctx.moveTo(tasselStartX, tasselStartY + 30);
        ctx.lineTo(tasselStartX + 4, tasselStartY + 30);
        ctx.lineTo(tasselStartX + 2, tasselStartY + 35);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#FDE047';
        ctx.stroke();

        // Dải tua rua 3 (vừa ở ngoài)
        ctx.strokeStyle = '#D4AF37';
        ctx.lineWidth = 0.9;
        ctx.beginPath();
        ctx.moveTo(tasselStartX + 6, tasselStartY);
        ctx.lineTo(tasselStartX + 6, tasselStartY + 22);
        ctx.stroke();
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(tasselStartX + 6, tasselStartY + 11, 1.5, 0, Math.PI * 2);
        ctx.fill();
        // Hoa chuông ngọc ở đuôi
        ctx.fillStyle = '#FFFDF5';
        ctx.beginPath();
        ctx.moveTo(tasselStartX + 4, tasselStartY + 22);
        ctx.lineTo(tasselStartX + 8, tasselStartY + 22);
        ctx.lineTo(tasselStartX + 6, tasselStartY + 27);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#FDE047';
        ctx.stroke();

        ctx.restore();
      }

      // 8.2 BÚP SEN TRẮNG TƯƠI CẦM TAY (GẮN CHUẨN XÁC VÀO TAY MẪU)
      if (hasLotusHandheld) {
        ctx.save();
        // Cuống sen xanh ngọc vươn từ bàn tay (x: 430, y: 445) lên cao
        ctx.strokeStyle = '#15803D';
        ctx.lineWidth = 3.2;
        ctx.beginPath();
        ctx.moveTo(432, 470);
        ctx.quadraticCurveTo(426, 442, 416, 390);
        ctx.stroke();

        // Búp sen trắng tươi thanh khiết
        const lotusX = 414;
        const lotusY = 372;

        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.moveTo(lotusX, lotusY + 16);
        ctx.quadraticCurveTo(lotusX - 15, lotusY - 10, lotusX, lotusY - 24);
        ctx.quadraticCurveTo(lotusX + 15, lotusY - 10, lotusX, lotusY + 16);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#86EFAC';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Đầu búp sen ửng hồng phấn nhẹ
        ctx.fillStyle = '#FCE7F3';
        ctx.beginPath();
        ctx.moveTo(lotusX, lotusY + 8);
        ctx.quadraticCurveTo(lotusX - 7, lotusY - 6, lotusX, lotusY - 16);
        ctx.quadraticCurveTo(lotusX + 7, lotusY - 6, lotusX, lotusY + 8);
        ctx.fill();

        // Bàn tay búp măng cầm cuống sen
        ctx.fillStyle = '#FED7AA';
        ctx.beginPath();
        ctx.moveTo(436, 436);
        ctx.quadraticCurveTo(440, 446, 432, 454);
        ctx.quadraticCurveTo(424, 456, 422, 448);
        ctx.quadraticCurveTo(424, 438, 432, 434);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = 'rgba(190, 120, 90, 0.35)';
        ctx.lineWidth = 0.8;
        ctx.stroke();
        ctx.restore();
      }

      // 8.3 KIM BỘI HOÀNG GIA CHẠM HOA MAI RỦ TUA RUA ĐỎ
      if (hasKimBoi) {
        const kbX = 300;
        const kbY = 265;

        ctx.fillStyle = '#F59E0B';
        ctx.beginPath();
        ctx.moveTo(kbX - 16, kbY);
        ctx.lineTo(kbX + 16, kbY);
        ctx.lineTo(kbX + 12, kbY + 14);
        ctx.lineTo(kbX - 12, kbY + 14);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#B45309';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = '#DC2626';
        ctx.beginPath();
        ctx.arc(kbX, kbY + 7, 3.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#DC2626';
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(kbX - 5, kbY + 14);
        ctx.lineTo(kbX - 5, kbY + 85);
        ctx.moveTo(kbX + 5, kbY + 14);
        ctx.lineTo(kbX + 5, kbY + 85);
        ctx.stroke();
      }

      // 8.4 KIỀNG BẠC ÔM CỔ
      if (hasKieng) {
        ctx.strokeStyle = '#E2E8F0';
        ctx.lineWidth = 3.6;
        ctx.beginPath();
        ctx.arc(300, 268, 22, 0.1 * Math.PI, 0.9 * Math.PI);
        ctx.stroke();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      // 8.5 CHUỖI NGỌC TRAI TỰ NHIÊN
      if (hasPearls) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(300, 275, 26, 0.08 * Math.PI, 0.92 * Math.PI);
        ctx.stroke();
        for (let a = 0.12 * Math.PI; a <= 0.88 * Math.PI; a += 0.09 * Math.PI) {
          const px = 300 + 26 * Math.cos(a);
          const py = 275 + 26 * Math.sin(a);
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(px, py, 2.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 8.6 KHUYÊN TAI NGỌC TRAI RƠI
      if (hasEarrings) {
        [273, 327].forEach((earX) => {
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(earX, 192, 2.6, 0, Math.PI * 2);
          ctx.arc(earX, 202, 3.4, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#D4AF37';
          ctx.lineWidth = 0.8;
          ctx.stroke();
        });
      }

      // 8.7 KHĂN LỤA TƠ TẰM QUÀNG CỔ (TWILLY)
      if (hasScarf) {
        ctx.strokeStyle = '#F43F5E';
        ctx.lineWidth = 4.5;
        ctx.beginPath();
        ctx.arc(300, 262, 20, 0.15 * Math.PI, 0.85 * Math.PI);
        ctx.stroke();
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(300, 282);
        ctx.lineTo(294, 335);
        ctx.moveTo(303, 282);
        ctx.lineTo(312, 330);
        ctx.stroke();
      }

      // 8.8 VÒNG CHOKER KIM LOẠI
      if (hasChoker) {
        ctx.fillStyle = '#D4AF37';
        ctx.strokeStyle = '#18181B';
        ctx.lineWidth = 1.2;
        ctx.fillRect(285, 235, 30, 8);
        ctx.strokeRect(285, 235, 30, 8);
      }

      // 8.9 KÍNH MẮT MÈO RETRO HOẶC GỌNG VÀNG
      if (hasSunglasses) {
        ctx.fillStyle = '#09090B';
        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(278, 172);
        ctx.lineTo(297, 174);
        ctx.quadraticCurveTo(294, 186, 281, 184);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(322, 172);
        ctx.lineTo(303, 174);
        ctx.quadraticCurveTo(306, 186, 319, 184);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else if (hasGlasses) {
        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.arc(288, 176, 7, 0, Math.PI * 2);
        ctx.arc(312, 176, 7, 0, Math.PI * 2);
        ctx.moveTo(295, 176);
        ctx.lineTo(305, 176);
        ctx.stroke();
      }

      // 8.10 TAI NGHE HEADPHONE RETRO
      if (hasHeadphones) {
        ctx.strokeStyle = '#CBD5E1';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.arc(300, 168, 34, Math.PI * 0.95, Math.PI * 0.05, false);
        ctx.stroke();
        ctx.fillStyle = '#0F172A';
        ctx.beginPath();
        ctx.ellipse(266, 182, 6, 12, 0.1, 0, Math.PI * 2);
        ctx.ellipse(334, 182, 6, 12, -0.1, 0, Math.PI * 2);
        ctx.fill();
      }

      // 8.11 DÙ LỤA HOA SEN CHE NẮNG (DÁNG DÙ LỤA TRUYỀN THỐNG CHUẨN XÁC, TÁN NÓN VÒM THANH THOÁT)
      if (hasUmbrella) {
        ctx.save();

        const handX = 432;
        const handY = 445;
        const apexX = 488;
        const apexY = 145; // Đỉnh chóp dù vút cao tạo dáng nón vòm thanh thoát
        const bottomHandleX = 422;
        const bottomHandleY = 492;

        // 1. CÁN DÙ TRÚC GIÀ (Thân trúc thanh mảnh, đốt trúc tinh xảo)
        // Cán dù nghiêng góc tự nhiên ~21 độ, vươn từ tay cầm lên thẳng tâm đỉnh dù
        ctx.strokeStyle = '#5C381E'; // Màu tre trúc già ngả nâu ấm
        ctx.lineWidth = 3.2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(bottomHandleX, bottomHandleY);
        ctx.lineTo(apexX, apexY);
        ctx.stroke();

        // Chỉ vàng kim thanh thoát viền sống cán trúc
        ctx.strokeStyle = '#D4AF37';
        ctx.lineWidth = 0.9;
        ctx.beginPath();
        ctx.moveTo(bottomHandleX, bottomHandleY);
        ctx.lineTo(apexX, apexY);
        ctx.stroke();

        // Các ngấn đốt trúc mảnh mai trên cán
        const bambooNodes = [0.18, 0.32, 0.48, 0.65, 0.82];
        bambooNodes.forEach((t) => {
          const nx = bottomHandleX + (apexX - bottomHandleX) * t;
          const ny = bottomHandleY + (apexY - bottomHandleY) * t;
          ctx.strokeStyle = '#A16207';
          ctx.lineWidth = 2.2;
          ctx.beginPath();
          ctx.moveTo(nx - 2, ny + 1);
          ctx.lineTo(nx + 2, ny - 1);
          ctx.stroke();
        });

        // Chuôi cán dù phía dưới: Hạt ngọc bội xanh và tua rua chỉ đỏ rủ
        ctx.fillStyle = '#047857'; // Ngọc bích chuôi cán
        ctx.beginPath();
        ctx.arc(bottomHandleX, bottomHandleY, 3.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#BE123C'; // Dải tua rua đỏ thắm
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(bottomHandleX, bottomHandleY + 3);
        ctx.quadraticCurveTo(bottomHandleX - 1, bottomHandleY + 18, bottomHandleX + 1, bottomHandleY + 30);
        ctx.stroke();

        // 2. KẾT CẤU TÁN DÙ LỤA (DÁNG NÓN VÒM PAGODA THANH NHÃ, KHÔNG PHẢI HÌNH TRÒN PHẲNG)
        // Vành dù nghiêng không gian 3 chiều:
        const rimPoints = [
          { x: 370, y: 242 }, // Mép ngoài cùng bên trái
          { x: 395, y: 254 },
          { x: 422, y: 263 },
          { x: 452, y: 268 },
          { x: 485, y: 270 }, // Điểm thấp nhất vành trước
          { x: 518, y: 266 },
          { x: 548, y: 256 },
          { x: 574, y: 240 },
          { x: 596, y: 220 }  // Mép ngoài cùng bên phải (lùi xa hơn tạo góc nhìn 3D)
        ];

        // 2.1 LÒNG DÙ PHÍA DƯỚI & HỆ KÈO NAN DÙ TRE (Đặc trưng không thể nhầm lẫn của cây dù thật)
        // Lòng dù bên trong nhìn thấy nhẹ dưới vành trước:
        ctx.fillStyle = '#9F1239'; // Màu lòng lụa trong bóng tối
        ctx.beginPath();
        ctx.moveTo(rimPoints[0].x, rimPoints[0].y);
        // Đường vành sau của lòng dù
        ctx.quadraticCurveTo(482, 218, rimPoints[rimPoints.length - 1].x, rimPoints[rimPoints.length - 1].y);
        // Men theo vành trước
        for (let i = rimPoints.length - 1; i >= 0; i--) {
          ctx.lineTo(rimPoints[i].x, rimPoints[i].y);
        }
        ctx.closePath();
        ctx.fill();

        // Các kèo dù tre (bộ nan đỡ xòe bung ra từ cán đỡ lòng dù)
        const runnerX = apexX - 14;
        const runnerY = apexY + 48; // Con trượt dù trên cán
        ctx.strokeStyle = '#D4AF37'; // Nan kèo tre thếp vàng
        ctx.lineWidth = 1;
        [1, 2, 3, 4, 5, 6, 7].forEach((i) => {
          ctx.beginPath();
          ctx.moveTo(runnerX, runnerY);
          ctx.lineTo(rimPoints[i].x, rimPoints[i].y - 4);
          ctx.stroke();
        });

        // Vòng đai con trượt (runner ring) bọc quanh cán
        ctx.fillStyle = '#78350F';
        ctx.beginPath();
        ctx.ellipse(runnerX, runnerY, 3.5, 2.5, -0.4, 0, Math.PI * 2);
        ctx.fill();

        // 2.2 TÁN DÙ CHÍNH BẰNG LỤA TƠ TẰM HỒNG ĐÀO (Dáng nón vòm pagoda duyên dáng)
        // Gradient phủ dọc theo độ dốc mái nón dù: Sáng từ chóp lướt xuống vành ngoài
        const silkGrad = ctx.createLinearGradient(apexX, apexY, 480, 270);
        silkGrad.addColorStop(0, '#FFF1F2');   // Đỉnh chóp lụa trắng ngà phớt ánh kim
        silkGrad.addColorStop(0.2, '#FFE4E6'); // Hồng phấn thanh khiết
        silkGrad.addColorStop(0.6, '#FDA4AF'); // Hồng đào tơ tằm
        silkGrad.addColorStop(0.9, '#F43F5E'); // Hồng sen thắm
        silkGrad.addColorStop(1, '#BE123C');   // Viền son thắm mép dù

        ctx.fillStyle = silkGrad;
        ctx.beginPath();
        // Mép trái tán dù: Cong thoai thoải hình mái vòm pagoda từ chóp xuống mép trái
        ctx.moveTo(apexX, apexY);
        ctx.quadraticCurveTo(405, 172, rimPoints[0].x, rimPoints[0].y);

        // Mép dưới vành dù: Uốn cong theo từng múi nan lụa căng (Scalloped silk gore edges)
        for (let i = 0; i < rimPoints.length - 1; i++) {
          const p1 = rimPoints[i];
          const p2 = rimPoints[i + 1];
          const midX = (p1.x + p2.x) / 2;
          const midY = (p1.y + p2.y) / 2 + 2.8; // Độ võng nhẹ của mép vải lụa căng giữa 2 nan
          ctx.quadraticCurveTo(midX, midY, p2.x, p2.y);
        }

        // Mép phải tán dù: Vút lên đỉnh chóp
        ctx.quadraticCurveTo(558, 162, apexX, apexY);
        ctx.closePath();
        ctx.fill();

        // 2.3 CÁC MÚI NAN TRÚC DÁT VÀNG PHỦ TRÊN TÁN DÙ (TẠO CẤU TRÚC 12 NAN CHUẨN MỰC)
        rimPoints.forEach((pt, idx) => {
          // Đường nan tre chính
          ctx.strokeStyle = 'rgba(212, 175, 55, 0.85)'; // Màu chỉ vàng kim
          ctx.lineWidth = 1.3;
          ctx.beginPath();
          ctx.moveTo(apexX, apexY);
          // Đường nan dù cong nhẹ theo sườn mái nón
          const cx = (apexX + pt.x) / 2 - (idx < 4 ? 6 : -3);
          const cy = (apexY + pt.y) / 2 - 4;
          ctx.quadraticCurveTo(cx, cy, pt.x, pt.y);
          ctx.stroke();

          // Bóng nếp gấp vải lụa căng hai bên nan (tạo múi lụa 3 chiều chân thực)
          ctx.strokeStyle = 'rgba(159, 18, 57, 0.22)';
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(apexX, apexY);
          ctx.quadraticCurveTo(cx + 1.2, cy + 1, pt.x, pt.y);
          ctx.stroke();
        });

        // 3. HỌA TIẾT CÀNH SEN THỦY MẶC VẼ TRÊN MẶT LỤA (KHÔNG PHẢI MỘT HÌNH TRÒN GIỮA DÙ)
        // Nhành sen uốn lượn mềm mại nghiêng theo sườn tán dù bên trái
        // Thân cành sen uốn cong duyên dáng
        ctx.strokeStyle = 'rgba(4, 120, 87, 0.75)'; // Xanh ngọc lục bảo thanh nhã
        ctx.lineWidth = 1.6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(436, 252);
        ctx.quadraticCurveTo(442, 215, 464, 192);
        ctx.stroke();

        // Lá sen non xanh ngọc mờ ảo đệm dưới cành
        ctx.fillStyle = 'rgba(16, 185, 129, 0.38)';
        ctx.beginPath();
        ctx.ellipse(438, 236, 14, 7, -0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(5, 150, 105, 0.6)';
        ctx.lineWidth = 0.8;
        ctx.stroke();

        // ĐÓA SEN HỒNG NỞ E ẤP NGHIÊNG BÓNG TRÊN TÁN LỤA
        const flowerX = 462;
        const flowerY = 196;

        // Lớp cánh sen ngoài phớt hồng
        ctx.fillStyle = '#FB7185';
        ctx.beginPath();
        ctx.moveTo(flowerX - 10, flowerY + 6);
        ctx.quadraticCurveTo(flowerX - 18, flowerY - 4, flowerX - 6, flowerY - 12);
        ctx.quadraticCurveTo(flowerX - 2, flowerY, flowerX - 10, flowerY + 6);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(flowerX + 8, flowerY + 6);
        ctx.quadraticCurveTo(flowerX + 16, flowerY - 4, flowerX + 6, flowerY - 12);
        ctx.quadraticCurveTo(flowerX + 2, flowerY, flowerX + 8, flowerY + 6);
        ctx.fill();

        // Cánh sen chính ở giữa nở thon cao vút
        ctx.fillStyle = '#FFF1F2'; // Trắng ngà cánh sen
        ctx.beginPath();
        ctx.moveTo(flowerX - 7, flowerY + 5);
        ctx.quadraticCurveTo(flowerX - 8, flowerY - 16, flowerX, flowerY - 22);
        ctx.quadraticCurveTo(flowerX + 8, flowerY - 16, flowerX + 7, flowerY + 5);
        ctx.closePath();
        ctx.fill();

        // Đầu cánh sen điểm hồng son thắm
        ctx.fillStyle = '#E11D48';
        ctx.beginPath();
        ctx.moveTo(flowerX - 4, flowerY - 14);
        ctx.quadraticCurveTo(flowerX, flowerY - 22, flowerX + 4, flowerY - 14);
        ctx.quadraticCurveTo(flowerX, flowerY - 17, flowerX - 4, flowerY - 14);
        ctx.fill();

        // Nhụy hoa sen vàng kim
        ctx.fillStyle = '#EAB308';
        ctx.beginPath();
        ctx.ellipse(flowerX, flowerY + 1, 3.5, 2.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Gân cánh sen vẽ nét bút lông mảnh
        ctx.strokeStyle = '#BE123C';
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        ctx.moveTo(flowerX, flowerY + 1);
        ctx.lineTo(flowerX, flowerY - 19);
        ctx.stroke();

        // BÚP SEN NON THANH MẢNH NGHIÊNG BÊN CẠNH
        ctx.strokeStyle = 'rgba(4, 120, 87, 0.75)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(452, 218);
        ctx.quadraticCurveTo(472, 216, 484, 206);
        ctx.stroke();

        ctx.fillStyle = '#F43F5E';
        ctx.beginPath();
        ctx.moveTo(482, 207);
        ctx.quadraticCurveTo(484, 198, 492, 196);
        ctx.quadraticCurveTo(490, 205, 484, 209);
        ctx.closePath();
        ctx.fill();

        // Cánh sen lụa rơi bay nhẹ theo gió
        ctx.fillStyle = '#FDA4AF';
        ctx.beginPath();
        ctx.ellipse(506, 224, 5, 2.5, 0.5, 0, Math.PI * 2);
        ctx.fill();

        // 4. VIỀN VÀNG KIM CHẠY DỌC VÀNH DÙ VÀ DẢI TUA RUA LỤA
        ctx.strokeStyle = '#D4AF37'; // Viền vàng dát
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(rimPoints[0].x, rimPoints[0].y);
        for (let i = 0; i < rimPoints.length - 1; i++) {
          const p1 = rimPoints[i];
          const p2 = rimPoints[i + 1];
          const midX = (p1.x + p2.x) / 2;
          const midY = (p1.y + p2.y) / 2 + 2.8;
          ctx.quadraticCurveTo(midX, midY, p2.x, p2.y);
        }
        ctx.stroke();

        // Dải tua rua lụa hồng buông rủ thẳng đứng theo trọng lực ở các múi phía trước
        [2, 3, 4, 5, 6].forEach((idx) => {
          const pt = rimPoints[idx];

          // Hạt ngọc vàng nhỏ đính ở đầu nan dù
          ctx.fillStyle = '#FACC15';
          ctx.beginPath();
          ctx.arc(pt.x, pt.y + 1, 1.8, 0, Math.PI * 2);
          ctx.fill();

          // Dải tua rua lụa rủ thẳng buông mềm
          ctx.strokeStyle = '#FB7185';
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(pt.x, pt.y + 2);
          ctx.lineTo(pt.x, pt.y + 16);
          ctx.stroke();

          // Hạt ngọc trắng châu nhỏ ở đuôi tua rua
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(pt.x, pt.y + 16, 1.2, 0, Math.PI * 2);
          ctx.fill();
        });

        // 5. CHÓP BÚP SEN THẾP VÀNG TẠI ĐỈNH DÙ (FINIAL / FERRULE)
        // Chóp búp sen vút nhọn đặc trưng của dù cung đình Việt Nam
        ctx.fillStyle = '#EAB308';
        ctx.beginPath();
        ctx.moveTo(apexX - 4, apexY + 1);
        ctx.lineTo(apexX + 4, apexY + 1);
        ctx.lineTo(apexX + 1.5, apexY - 14);
        ctx.quadraticCurveTo(apexX, apexY - 20, apexX - 1.5, apexY - 14);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#A16207';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Ánh sáng lấp lánh đỉnh chóp
        ctx.fillStyle = '#FEF08A';
        ctx.beginPath();
        ctx.arc(apexX, apexY - 12, 1.5, 0, Math.PI * 2);
        ctx.fill();

        // 6. BÀN TAY BÚP MĂNG CẦM CÁN DÙ (Vẽ phủ lên cán dù tạo cảm giác cầm nắm thật)
        ctx.fillStyle = '#FED7AA';
        ctx.beginPath();
        ctx.moveTo(handX + 4, handY - 9);
        ctx.quadraticCurveTo(handX + 8, handY + 1, handX, handY + 9);
        ctx.quadraticCurveTo(handX - 8, handY + 11, handX - 10, handY + 3);
        ctx.quadraticCurveTo(handX - 8, handY - 7, handX, handY - 11);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = 'rgba(190, 120, 90, 0.4)';
        ctx.lineWidth = 0.8;
        ctx.stroke();

        // Ngón tay thon búp măng ôm quanh cán
        ctx.strokeStyle = 'rgba(190, 120, 90, 0.45)';
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        ctx.moveTo(handX + 2, handY - 4);
        ctx.lineTo(handX + 4, handY + 4);
        ctx.moveTo(handX - 2, handY - 2);
        ctx.lineTo(handX, handY + 6);
        ctx.stroke();

        ctx.restore();
      }

      // 8.12 QUẠT CẦM TAY (QUẠT ĐOÀN PHIẾN TRÒN vs QUẠT XẾP NAN NGÀ)
      if (hasFan && !hasLotusHandheld) {
        ctx.save();

        if (hasFoldingFan) {
          // === QUẠT XẾP NAN NGÀ THẾP VÀNG (DÁNG QUẠT NAN GẤP CÁNH CUNG) ===
          const pivotX = 432;
          const pivotY = 464;

          // Nan quạt mở hình cánh cung
          ctx.fillStyle = '#FEF3C7'; // Màu ngà voi / lụa dát vàng
          ctx.beginPath();
          ctx.moveTo(pivotX, pivotY);
          ctx.arc(pivotX, pivotY, 68, -0.85 * Math.PI, -0.35 * Math.PI, false);
          ctx.closePath();
          ctx.fill();

          // Viền dát vàng mép quạt
          ctx.strokeStyle = '#D4AF37';
          ctx.lineWidth = 2.4;
          ctx.stroke();

          // Các nan quạt ngà chạm lộng tỏa ra từ tâm
          ctx.strokeStyle = '#92400E';
          ctx.lineWidth = 1.1;
          for (let a = -0.85 * Math.PI; a <= -0.35 * Math.PI; a += 0.08 * Math.PI) {
            ctx.beginPath();
            ctx.moveTo(pivotX, pivotY);
            ctx.lineTo(pivotX + 68 * Math.cos(a), pivotY + 68 * Math.sin(a));
            ctx.stroke();
          }

          // Điểm xuyết hoa văn rồng phượng thếp vàng trên phiến quạt xếp
          ctx.fillStyle = '#DC2626';
          ctx.beginPath();
          ctx.arc(pivotX - 32, pivotY - 48, 5, 0, Math.PI * 2);
          ctx.fill();

          // Dải tua rua đỏ đính ngọc rủ dưới chuôi quạt
          ctx.strokeStyle = '#DC2626';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(pivotX, pivotY);
          ctx.lineTo(pivotX + 2, pivotY + 28);
          ctx.stroke();

          // Hạt ngọc cẩm thạch xanh ở chuôi quạt
          ctx.fillStyle = '#10B981';
          ctx.beginPath();
          ctx.arc(pivotX, pivotY + 8, 3.2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // === QUẠT ĐOÀN PHIẾN CUNG ĐÌNH LỤA THÊU MẪU ĐƠN CẨN NGỌC (DÁNG TRÒN) ===
          // Cán quạt gỗ mun/trúc thanh mảnh nối dài qua tay cầm
          ctx.strokeStyle = '#451A03';
          ctx.lineWidth = 2.6;
          ctx.beginPath();
          ctx.moveTo(432, 474);
          ctx.lineTo(416, 405);
          ctx.stroke();

          // Dải tua rua đỏ rủ dưới chuôi quạt
          ctx.strokeStyle = '#DC2626';
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.moveTo(432, 474);
          ctx.lineTo(434, 502);
          ctx.stroke();

          // Hạt ngọc bích đính ở chuôi cán quạt
          ctx.fillStyle = '#059669';
          ctx.beginPath();
          ctx.arc(432, 476, 3, 0, Math.PI * 2);
          ctx.fill();

          // Phiến quạt lụa tròn hoàng gia
          const fanX = 412;
          const fanY = 382;
          ctx.fillStyle = isMale ? '#18181B' : '#FFFDF5';
          ctx.beginPath();
          ctx.arc(fanX, fanY, 34, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#D4AF37';
          ctx.lineWidth = 2.4;
          ctx.stroke();

          // Đóa hoa mẫu đơn quý phái thêu giữa phiến quạt
          ctx.fillStyle = '#F43F5E';
          ctx.beginPath();
          ctx.arc(fanX, fanY, 8.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#FB7185';
          ctx.beginPath();
          ctx.arc(fanX - 2, fanY - 2, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#FDE047';
          ctx.beginPath();
          ctx.arc(fanX, fanY, 3, 0, Math.PI * 2);
          ctx.fill();
        }

        // Bàn tay búp măng cầm cán quạt
        ctx.fillStyle = '#FED7AA';
        ctx.beginPath();
        ctx.moveTo(436, 436);
        ctx.quadraticCurveTo(440, 446, 432, 454);
        ctx.quadraticCurveTo(424, 456, 422, 448);
        ctx.quadraticCurveTo(424, 438, 432, 434);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = 'rgba(190, 120, 90, 0.35)';
        ctx.lineWidth = 0.8;
        ctx.stroke();
        ctx.restore();
      }

      // 8.13 THẺ BÀI GỖ MUN
      if (hasTheBai) {
        const tagX = 352;
        const tagY = 460;
        ctx.fillStyle = '#18181B';
        ctx.fillRect(tagX, tagY, 15, 42);
        ctx.strokeStyle = '#D4AF37';
        ctx.lineWidth = 1.2;
        ctx.strokeRect(tagX, tagY, 15, 42);
        ctx.fillStyle = '#F59E0B';
        ctx.font = 'bold 8px serif';
        ctx.textAlign = 'center';
        ctx.fillText('禄', tagX + 7.5, tagY + 16);
        ctx.fillText('寿', tagX + 7.5, tagY + 30);
      }

      // 8.14 TÚI XÁCH / TÚI MÂY / TÚI MINI
      if (hasBag) {
        ctx.save();
        const bagX = 414;
        const bagY = 464;
        // Quai túi móc vào tay
        ctx.strokeStyle = '#78350F';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(430, 448);
        ctx.quadraticCurveTo(418, 454, bagX + 15, bagY);
        ctx.stroke();

        ctx.fillStyle = '#D97706';
        ctx.fillRect(bagX, bagY, 28, 36);
        ctx.strokeStyle = '#78350F';
        ctx.lineWidth = 1.4;
        ctx.strokeRect(bagX, bagY, 28, 36);
        ctx.restore();
      }

      // 8.15 ĐỒNG HỒ & VÒNG TAY STREETWEAR (ĐEO CỔ TAY PHẢI)
      if (hasWatch) {
        ctx.save();
        ctx.fillStyle = '#78350F';
        ctx.fillRect(432, 438, 7, 10);
        ctx.fillStyle = '#F59E0B';
        ctx.beginPath();
        ctx.arc(435, 443, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      if (hasChain) {
        ctx.save();
        ctx.strokeStyle = '#CBD5E1';
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.arc(435, 442, 6, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
      ctx.restore();
    }

    // =========================================================================
    // 9. LAYER: FEET & FOOTWEAR (CHÂN LUÔN HIỆN DIỆN, BỎ HÀI KHÔNG MẤT CHÂN!)
    // =========================================================================
    // 1. ĐÔI CHÂN MẪU / TẤT LỤA TRẮNG CUNG ĐÌNH (LUÔN XUẤT HIỆN DƯỚI GẤU QUẦN)
    if (visibleLayers['cmp-model'] !== false) {
      ctx.save();
      const footY = 753;
      ctx.fillStyle = '#F8FAFC'; // Tất lụa trắng cung đình trang nhã
      // Bàn chân trái
      ctx.beginPath();
      ctx.ellipse(280, footY, 13, 6, -0.05, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Bàn chân phải
      ctx.beginPath();
      ctx.ellipse(320, footY, 13, 6, 0.05, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    // 2. GIÀY DÉP & HÀI THÊU (HIỂN THỊ TRỰC TIẾP KHI ĐƯỢC CHỌN TỪ HỘP CHỌN CHÂN)
    if (hasHai || hasGuoc || hasModernShoes) {
      ctx.save();
      const shoeY = 753;

      if (hasHai) {
        // HÀI THÊU HOA SEN CUNG ĐÌNH MŨI CONG VÚT
        ctx.fillStyle = '#991B1B';
        // Chiếc trái
        ctx.beginPath();
        ctx.moveTo(268, shoeY + 4);
        ctx.lineTo(290, shoeY + 4);
        ctx.quadraticCurveTo(296, shoeY - 4, 292, shoeY - 7);
        ctx.lineTo(270, shoeY - 3);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#FACC15';
        ctx.lineWidth = 1.3;
        ctx.stroke();
        ctx.fillStyle = '#FDE047';
        ctx.beginPath();
        ctx.arc(292, shoeY - 4, 2.2, 0, Math.PI * 2);
        ctx.fill();

        // Chiếc phải
        ctx.fillStyle = '#991B1B';
        ctx.beginPath();
        ctx.moveTo(310, shoeY + 4);
        ctx.lineTo(332, shoeY + 4);
        ctx.quadraticCurveTo(338, shoeY - 4, 334, shoeY - 7);
        ctx.lineTo(312, shoeY - 3);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#FACC15';
        ctx.lineWidth = 1.3;
        ctx.stroke();
        ctx.fillStyle = '#FDE047';
        ctx.beginPath();
        ctx.arc(334, shoeY - 4, 2.2, 0, Math.PI * 2);
        ctx.fill();

      } else if (hasGuoc || isBaBa) {
        // GUỐC MỘC QUAI NHUNG ĐỎ
        ctx.fillStyle = '#A16207';
        ctx.fillRect(268, shoeY + 2, 24, 7);
        ctx.fillRect(308, shoeY + 2, 24, 7);
        ctx.fillStyle = '#DC2626';
        ctx.beginPath();
        ctx.ellipse(280, shoeY + 1, 10, 3.5, 0, 0, Math.PI * 2);
        ctx.ellipse(320, shoeY + 1, 10, 3.5, 0, 0, Math.PI * 2);
        ctx.fill();

      } else if (hasModernShoes) {
        // GIÀY HIỆN ĐẠI (CAO GÓT / SNEAKER)
        const isSneaker = selectedAccessories.some(a => a.toLowerCase().includes('sneaker') || a.toLowerCase().includes('thể thao'));
        ctx.fillStyle = isSneaker ? '#FFFFFF' : '#0F172A';
        ctx.beginPath();
        ctx.ellipse(280, shoeY + 2, 13, 6, 0, 0, Math.PI * 2);
        ctx.ellipse(320, shoeY + 2, 13, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#D4AF37';
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
      ctx.restore();
    }

    // Watermark
    ctx.font = 'bold 11px "Cinzel", Georgia, serif';
    ctx.fillStyle = 'rgba(155, 44, 44, 0.65)';
    ctx.textAlign = 'right';
    ctx.fillText('VIỆT PHỤC REMIX • BẢN PHÁC THẢO CHUẨN ĐIỂN CHẾ', width - 24, height - 24);
  };

  useEffect(() => {
    renderCanvas();
  }, [costume, modelGender, selectedColor, selectedMaterial, selectedAccessories, selectedBackground, remixStyle, visibleLayers]);

  useEffect(() => {
    if (onCanvasReady) {
      onCanvasReady(() => {
        const canvas = canvasRef.current;
        if (!canvas) return '';
        return canvas.toDataURL('image/png');
      });
    }
  }, [onCanvasReady]);

  const isAoVisible = visibleLayers['cmp-main'] !== false;
  const isQuanVisible = visibleLayers['cmp-inner'] !== false;

  return (
    <div className="w-full bg-[#FFFFFF] border border-[#E8E2D8] rounded-3xl p-4 sm:p-6 shadow-sm flex flex-col items-center">
      {/* Top Controls: Mode Toggle */}
      <div className="w-full flex items-center justify-between pb-3.5 mb-3 border-b border-[#F0EBE3] gap-2">
        <div className="flex items-center gap-1.5 bg-[#FAF7F2] p-1 rounded-xl border border-[#E8E2D8]">
          <button
            onClick={() => setDisplayMode('croquis')}
            className={`px-3 py-1.5 rounded-lg text-xs font-serif transition-colors flex items-center gap-1.5 cursor-pointer ${
              displayMode === 'croquis'
                ? 'bg-[#9B2C2C] text-white font-bold shadow-xs'
                : 'text-[#57534E] hover:text-[#1C1917]'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Phác thảo chi tiết</span>
          </button>
          <button
            onClick={() => setDisplayMode('realistic')}
            className={`px-3 py-1.5 rounded-lg text-xs font-serif transition-colors flex items-center gap-1.5 cursor-pointer ${
              displayMode === 'realistic'
                ? 'bg-[#9B2C2C] text-white font-bold shadow-xs'
                : 'text-[#57534E] hover:text-[#1C1917]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Mô tả ảnh thật</span>
          </button>
        </div>
      </div>

      {/* Main Silk Paper Viewport Frame */}
      <div className="relative w-full max-w-[500px] aspect-[3/4] rounded-2xl overflow-hidden border border-[#E8E2D8] shadow-md bg-[#FAF7F2] flex items-center justify-center">
        <canvas
          ref={canvasRef}
          className={`w-full h-full object-contain ${displayMode === 'croquis' ? 'block' : 'hidden'}`}
        />

        {displayMode === 'realistic' && (
          <div className="relative w-full h-full overflow-hidden flex flex-col justify-end">
            <img
              src={costume.coverImage}
              alt={costume.name}
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            <div
              className="absolute inset-0 mix-blend-color opacity-30 pointer-events-none"
              style={{ backgroundColor: selectedColor?.hex || '#9B2C2C' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/90 via-[#1C1917]/25 to-transparent pointer-events-none" />
            <div className="relative z-10 p-5 text-white space-y-2">
              <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-[#9B2C2C] font-serif font-bold text-white shadow-xs">
                Ảnh mẫu thực tế
              </span>
              <h4 className="font-serif font-bold text-xl drop-shadow-md">{costume.name}</h4>
              <p className="text-xs text-[#FAF7F2]/90 font-light">
                {modelGender === 'male' ? 'Người mẫu Nam' : 'Người mẫu Nữ'} • Màu {selectedColor?.name}.
              </p>
              {onGenerateAI && (
                <button
                  onClick={onGenerateAI}
                  className="w-full mt-2 py-2.5 rounded-xl bg-[#9B2C2C] hover:bg-[#832424] text-white text-xs font-semibold tracking-wide flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-98 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Tạo ảnh chân dung AI với thiết lập này</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* NÚT BẬT/TẮT ẨN/HIỆN ÁO VÀ QUẦN NẰM HẲN RA NGOÀI LỀ TRÁI THEO CHIỀU DỌC */}
        {displayMode === 'croquis' && (
          <div className="absolute left-3 sm:left-4 top-[48%] -translate-y-1/2 flex flex-col items-center gap-6 z-20 pointer-events-auto">
            {/* Nút Ẩn/Hiện Áo */}
            <div className="group relative flex items-center">
              <button
                type="button"
                onClick={() => onToggleLayer('cmp-main')}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border shadow-md flex items-center justify-center transition-all cursor-pointer hover:scale-110 ${
                  isAoVisible
                    ? 'bg-[#9B2C2C] border-white text-white shadow-[#9B2C2C]/30'
                    : 'bg-white/95 border-[#D8D1C7] text-[#A8A29E]'
                }`}
                title={isAoVisible ? 'Bấm để ẩn Áo' : 'Bấm để hiện Áo'}
              >
                {isAoVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>
              <div className="absolute left-full ml-2 px-2.5 py-1 rounded-lg bg-white/95 backdrop-blur-md border border-[#E8E2D8] shadow-md text-[11px] font-serif font-medium text-[#1C1917] whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity">
                {isAoVisible ? 'Ẩn Áo' : 'Hiện Áo'}
              </div>
            </div>

            {/* Nút Ẩn/Hiện Quần */}
            <div className="group relative flex items-center">
              <button
                type="button"
                onClick={() => onToggleLayer('cmp-inner')}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border shadow-md flex items-center justify-center transition-all cursor-pointer hover:scale-110 ${
                  isQuanVisible
                    ? 'bg-[#475569] border-white text-white shadow-[#475569]/30'
                    : 'bg-white/95 border-[#D8D1C7] text-[#A8A29E]'
                }`}
                title={isQuanVisible ? 'Bấm để ẩn Quần' : 'Bấm để hiện Quần'}
              >
                {isQuanVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>
              <div className="absolute left-full ml-2 px-2.5 py-1 rounded-lg bg-white/95 backdrop-blur-md border border-[#E8E2D8] shadow-md text-[11px] font-serif font-medium text-[#1C1917] whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity">
                {isQuanVisible ? 'Ẩn Quần' : 'Hiện Quần'}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
