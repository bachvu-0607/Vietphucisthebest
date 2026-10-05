import React from 'react';
import { AIJob } from '../types';
import { TrienSonSeal, ChimLacIcon } from './VietnameseMotifs';
import { X, Download, RotateCcw, Sparkles, CheckCircle2, BookmarkCheck } from 'lucide-react';

interface ComparisonModalProps {
  job: AIJob;
  onClose: () => void;
  onReopenStudio: () => void;
}

export const ComparisonModal: React.FC<ComparisonModalProps> = ({
  job,
  onClose,
  onReopenStudio
}) => {
  const handleDownload = (dataUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#1C1917]/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-2xl bg-[#FAF7F2] border border-[#E8E2D8] shadow-2xl p-6 sm:p-8 my-8 text-[#1C1917] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D8]">
          <div className="flex items-center gap-3">
            <TrienSonSeal text="Remix" size="sm" />
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1C1917] flex items-center gap-2">
                So Sánh Phác Thảo & Tác Phẩm Hoàn Thiện
                <CheckCircle2 className="w-5 h-5 text-[#9B2C2C]" />
              </h2>
              <p className="text-xs text-[#78716C] font-light">
                {job.costumeName} • {job.eventName} • Phong cách:{' '}
                {job.remixStyle === 'traditional'
                  ? 'Truyền thống'
                  : job.remixStyle === 'subtle_modern'
                  ? 'Cách tân nhẹ'
                  : 'Remix đương đại'}
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

        {/* Side by side comparison container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          {/* Left: Instant Layered Flat Sketch */}
          <div className="flex flex-col rounded-xl overflow-hidden border border-[#E8E2D8] bg-[#FFFFFF] shadow-xs">
            <div className="px-4 py-2.5 bg-[#F5F2EB] border-b border-[#E8E2D8] flex items-center justify-between text-xs">
              <span className="font-serif font-bold text-[#1C1917]">
                1. Bản phác thảo phẳng tức thời
              </span>
              <button
                onClick={() =>
                  handleDownload(
                    job.sketchDataUrl,
                    `phac-thao-${job.costumeName.toLowerCase().replace(/\s+/g, '-')}.png`
                  )
                }
                className="text-[#78716C] hover:text-[#9B2C2C] flex items-center gap-1 font-medium"
                title="Tải ảnh phác thảo"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Tải PNG</span>
              </button>
            </div>

            <div className="p-3 sm:p-4 flex items-center justify-center bg-[#FAF7F2] min-h-[440px] md:min-h-[560px]">
              <img
                src={job.sketchDataUrl}
                alt="Bản phác thảo phẳng"
                className="max-h-[520px] md:max-h-[600px] w-auto max-w-full object-contain rounded-md shadow-xs border border-[#E8E2D8]"
              />
            </div>

            <div className="p-3 bg-[#FFFFFF] border-t border-[#E8E2D8] text-[11px] text-[#78716C] font-light">
              Kết xuất trực tiếp từ các tầng layer trên trình duyệt: người mẫu, vạt áo, nẹp cổ, hài thêu.
            </div>
          </div>

          {/* Right: AI Rendered Masterpiece */}
          <div className="flex flex-col rounded-xl overflow-hidden border border-[#9B2C2C]/40 bg-[#FFFFFF] shadow-sm">
            <div className="px-4 py-2.5 bg-[#9B2C2C]/8 border-b border-[#9B2C2C]/20 flex items-center justify-between text-xs">
              <span className="font-serif font-bold text-[#9B2C2C] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#C29B38]" />
                2. Tác phẩm di sản độc bản (Theo thiết kế của bạn)
              </span>
              {job.resultImageUrl && (
                <button
                  onClick={() =>
                    handleDownload(
                      job.resultImageUrl!,
                      `vietphuc-remix-${job.costumeName.toLowerCase().replace(/\s+/g, '-')}.jpg`
                    )
                  }
                  className="text-[#9B2C2C] hover:text-[#7A2121] flex items-center gap-1 font-semibold"
                  title="Tải ảnh tác phẩm độc bản"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Tải ảnh HD</span>
                </button>
              )}
            </div>

            <div className="p-3 sm:p-4 flex items-center justify-center bg-[#FAF7F2] min-h-[440px] md:min-h-[560px]">
              {job.resultImageUrl ? (
                <img
                  src={job.resultImageUrl}
                  alt="Tác phẩm di sản hoàn thiện"
                  className="max-h-[520px] md:max-h-[600px] w-auto max-w-full object-contain rounded-md shadow-md border border-[#E8E2D8]"
                />
              ) : (
                <div className="text-[#A8A29E] text-xs">Chưa có kết quả ảnh</div>
              )}
            </div>

            <div className="p-3 bg-[#FFFFFF] border-t border-[#E8E2D8] text-[11px] text-[#57534E] flex items-center justify-between">
              <span className="font-light">Đã hòa trộn sắc màu tùy biến, đóng Triện Son hoàng gia và bảng chú giải bảo tàng.</span>
              <span className="font-mono text-[#9B2C2C] text-[10px] font-semibold">Trạng thái: Hoàn tất</span>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#E8E2D8]">
          <div className="flex items-center gap-2 text-xs text-[#57534E]">
            <BookmarkCheck className="w-4 h-4 text-[#9B2C2C]" />
            <span>Thiết kế đã được lưu tự động vào Bộ sưu tập cá nhân của bạn.</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onReopenStudio}
              className="flex items-center gap-1.5 px-4 py-2 rounded-sm bg-[#FAF7F2] hover:bg-[#E8E2D8] text-[#1C1917] text-xs font-serif font-semibold border border-[#E8E2D8] transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#9B2C2C]" />
              <span>Tiếp tục chỉnh sửa trong Studio</span>
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-sm bg-[#9B2C2C] hover:bg-[#832424] text-[#FAF7F2] text-xs font-semibold transition-colors"
            >
              Đóng cửa sổ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
