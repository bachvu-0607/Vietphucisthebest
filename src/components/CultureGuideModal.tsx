import React from 'react';
import type { Costume } from '../types';
import { TrienSonSeal } from './VietnameseMotifs';
import { X, BookOpen } from 'lucide-react';
import { CULTURE_GUIDE } from '../../content/guides/culture-guide.ts';
import { ContentSources } from './ContentSources';

interface CultureGuideModalProps {
  isOpen: boolean;
  costumes: Costume[];
  onClose: () => void;
}

export const CultureGuideModal: React.FC<CultureGuideModalProps> = ({ isOpen, onClose, costumes }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#1C1917]/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl bg-[#FFF5F7] border border-[#F4C2CE] shadow-2xl p-6 sm:p-8 my-8 text-[#1C1917] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#F4C2CE]">
          <div className="flex items-center gap-3">
            <TrienSonSeal text="Điển Lệ" size="sm" />
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1C1917]">
                Sổ tay trang phục Việt
              </h2>
              <p className="text-xs text-[#78716C] font-light">
                Phân biệt thông tin lịch sử và gợi ý phối đồ hiện nay
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Đóng sổ tay trang phục"
            className="p-2 rounded-md text-[#78716C] hover:text-[#1C1917] hover:bg-[#F4C2CE]/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="my-6 space-y-6 text-xs text-[#57534E] leading-relaxed overflow-y-auto max-h-[70vh] pr-2">
          {CULTURE_GUIDE.map((section) => (
            <section key={section.id} className="p-5 rounded-xl bg-white border border-[#F4C2CE] shadow-xs space-y-3">
              <h3 className="font-serif font-bold text-[#C84B69] text-sm flex items-center gap-2">
                <BookOpen className="w-4 h-4" />{section.title}
              </h3>
              {section.costumeIds.map(id => costumes.find(c => c.id === id)).filter((c): c is Costume => !!c).map((costume) => (
                <div key={costume.id} className="space-y-2">
                  <h4 className="font-medium text-[#1C1917]">{costume.name}</h4>
                  <p>{costume.historicalContext}</p>
                  <p>{costume.research?.modernUse}</p>
                  <details>
                    <summary className="cursor-pointer text-[#9E2A47]">Nguồn và phạm vi tham khảo</summary>
                    <div className="pt-2"><ContentSources references={costume.research?.sources || []} /></div>
                  </details>
                </div>
              ))}
              <p className="pt-2 border-t border-[#F4C2CE]">{section.note}</p>
            </section>
          ))}
          <p className="p-4 rounded-xl bg-white border border-[#C29B38]/40">
            Lịch sử có nguồn tham khảo theo từng phạm vi. Gợi ý phối màu, phụ kiện và hình ảnh của ứng dụng phục vụ khám phá, không chứng nhận độ chính xác của một bộ phục dựng.
          </p>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-[#F4C2CE] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-sm bg-[#C84B69] hover:bg-[#832424] text-[#FFF5F7] text-xs font-semibold transition-colors"
          >
            Đã hiểu
          </button>
        </div>
      </div>
    </div>
  );
};
