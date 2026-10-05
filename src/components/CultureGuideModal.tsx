import React from 'react';
import { TrienSonSeal, HoaSenDivider, ChimLacIcon } from './VietnameseMotifs';
import { X, BookOpen, Sparkles, ShieldCheck, Quote } from 'lucide-react';

interface CultureGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CultureGuideModal: React.FC<CultureGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#1C1917]/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl bg-[#FAF7F2] border border-[#E8E2D8] shadow-2xl p-6 sm:p-8 my-8 text-[#1C1917] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D8]">
          <div className="flex items-center gap-3">
            <TrienSonSeal text="Điển Lệ" size="sm" />
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1C1917]">
                Sổ Tay Điển Cứu Cổ Phục Việt
              </h2>
              <p className="text-xs text-[#78716C] font-light">
                Tìm hiểu cấu trúc, triết lý Ngũ Thường và quy cách y phục truyền thống
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-md text-[#78716C] hover:text-[#1C1917] hover:bg-[#E8E2D8]/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="my-6 space-y-6 text-xs text-[#57534E] leading-relaxed overflow-y-auto max-h-[70vh] pr-2">
          {/* Section 1 */}
          <div className="p-5 rounded-xl bg-[#FFFFFF] border border-[#E8E2D8] shadow-xs">
            <h3 className="font-serif font-bold text-[#9B2C2C] text-sm mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C29B38]" />
              1. Triết lý Áo Ngũ Thân & Đạo Đức Ngũ Thường
            </h3>
            <p className="mb-2 font-light text-justify">
              Áo Ngũ Thân (bao gồm cả Áo Tấc lễ phục tay thụng và Áo Tay Chẽn thường phục) được định chế từ thời chúa Nguyễn Phúc Khoát (1744) và chính thức chuẩn hóa trên toàn cõi Đại Nam dưới triều vua Minh Mạng (1827).
            </p>
            <p className="font-light text-justify">
              • <strong>Năm thân áo:</strong> Bốn thân ngoài tượng trưng cho "Tứ thân phụ mẫu" (cha mẹ ruột và cha mẹ chồng/vợ), thân con nhỏ bên trong tượng trưng cho chính người mặc được che chở nâng niu.<br />
              • <strong>Năm cúc áo:</strong> Biểu trưng cho Ngũ Thường của đạo Nho: Nhân, Lễ, Nghĩa, Trí, Tín - chuẩn mực đạo đức cốt lõi của người quân tử.
            </p>
          </div>

          {/* Section 2 */}
          <div className="p-5 rounded-xl bg-[#FFFFFF] border border-[#E8E2D8] shadow-xs">
            <h3 className="font-serif font-bold text-[#9B2C2C] text-sm mb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#246A5E]" />
              2. Áo Nhật Bình Cung Đình Triều Nguyễn
            </h3>
            <p className="mb-2 font-light text-justify">
              Áo Nhật Bình là thường phục tôn quý của bậc Hậu phi, Công chúa và Cung tần triều Nguyễn. Đặc trưng cốt lõi là cổ áo hình chữ nhật viền thêu kim tuyến trước ngực và dải ngũ sắc ngũ hành ở cổ tay áo.
            </p>
            <p className="font-light text-justify">
              Khi mặc Nhật Bình trong hôn lễ hoặc ngày trọng đại, người mặc cần giữ tư thế đoan trang, bước chân nhẹ nhàng, không xắn tay áo làm lộ đường may lót bên trong.
            </p>
          </div>

          {/* Section 3 */}
          <div className="p-5 rounded-xl bg-[#FFFFFF] border border-[#E8E2D8] shadow-xs">
            <h3 className="font-serif font-bold text-[#9B2C2C] text-sm mb-2 flex items-center gap-2">
              <Quote className="w-4 h-4 text-[#C29B38]" />
              3. Phân biệt Áo Giao Lĩnh & Áo Đối Khâm Thời Lý - Trần - Lê
            </h3>
            <p className="mb-2 font-light text-justify">
              Trước khi định chế Ngũ Thân cổ đứng trở thành quy chuẩn dưới thời Nguyễn, y phục Đại Việt thời Lý, Trần, Lê phổ biến với cổ bẻ chéo (Giao Lĩnh) hoặc hai vạt song song buông thẳng (Đối Khâm).
            </p>
            <p className="font-light text-justify">
              • <strong>Quy tắc Giao Lĩnh:</strong> Bắt buộc vạt bên Trái đè lên vạt bên Phải (tượng trưng cho Dương chế ngự Âm, ánh sáng và sự sống).<br />
              • <strong>Áo Đối Khâm:</strong> Là lớp áo khoác ngoài phô diễn hoa văn yếm lót bên trong, tạo dáng thoát tục, thanh tao.
            </p>
          </div>

          {/* Heritage Commitment */}
          <div className="p-5 rounded-xl bg-[#FAF7F2] border border-[#C29B38]/40">
            <h3 className="font-serif font-bold text-[#9B2C2C] text-sm mb-1.5">
              Cam kết tính chính xác của tư liệu
            </h3>
            <p className="text-[11px] leading-relaxed text-[#57534E] font-light text-justify">
              Mọi dữ liệu trang phục trong ứng dụng Việt Phục Remix đều có trường thông tin ghi rõ tình trạng kiểm chứng (đối chiếu qua Khâm Định Đại Nam Hội Điển Sự Lệ, hiện vật bảo tàng, tranh tượng cổ Đại Việt) hoặc đánh dấu là dữ liệu mẫu biên tập, tuyệt đối không tạo dựng lịch sử giả mạo.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-[#E8E2D8] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-sm bg-[#9B2C2C] hover:bg-[#832424] text-[#FAF7F2] text-xs font-semibold transition-colors"
          >
            Đã hiểu
          </button>
        </div>
      </div>
    </div>
  );
};
