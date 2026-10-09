import React, { useState } from 'react';
import { FittingDraft, AIJob, Costume } from '../types';
import { TrienSonSeal, ChimLacIcon, TrongDongWatermark } from './VietnameseMotifs';
import {
  Bookmark,
  Sparkles,
  Clock,
  Trash2,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Eye,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';

interface UserProfileProps {
  drafts: FittingDraft[];
  aiJobs: AIJob[];
  costumes: Costume[];
  onOpenDraft: (draft: FittingDraft) => void;
  onDeleteDraft: (draftId: string) => void;
  onRetryJob: (job: AIJob) => void;
  onViewJobResult: (job: AIJob) => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  drafts,
  aiJobs,
  costumes,
  onOpenDraft,
  onDeleteDraft,
  onRetryJob,
  onViewJobResult
}) => {
  const [activeTab, setActiveTab] = useState<'drafts' | 'completed' | 'processing'>('drafts');

  const completedJobs = aiJobs.filter((j) => j.status === 'completed');
  const pendingJobs = aiJobs.filter(
    (j) => j.status === 'queued' || j.status === 'processing' || j.status === 'failed'
  );

  const formatDate = (isoString?: string) => {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="py-8 sm:py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in-50 duration-300">
      {/* Editorial Header - Pink Heritage Theme */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#FFF5F7] via-white to-[#FCE7EC] border border-[#F4C2CE] p-6 sm:p-8 md:p-10 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF0F4] border border-[#F4C2CE] text-[#C84B69] text-xs font-serif font-bold">
            <ChimLacIcon className="w-3.5 h-3 text-[#C84B69]" />
            <span>Không Gian Sáng Tạo Cá Nhân</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#1C1917] tracking-tight">
            Tủ Đồ Của Tôi
          </h1>
          <p className="text-xs sm:text-sm text-[#57534E] font-light leading-relaxed">
            Lưu trữ bản phác thảo y phục, quản lý tác phẩm hoàn thiện AI và theo dõi các tiến trình sáng tạo.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1.5 bg-[#FFF0F4] border border-[#F4C2CE] rounded-2xl text-xs shadow-inner shrink-0">
          <button
            onClick={() => setActiveTab('drafts')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all font-serif cursor-pointer ${
              activeTab === 'drafts'
                ? 'bg-[#C84B69] text-white font-bold shadow-xs'
                : 'text-[#6E2E3E] hover:text-[#C84B69] hover:bg-white/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Phác thảo ({drafts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('completed')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all font-serif cursor-pointer ${
              activeTab === 'completed'
                ? 'bg-[#C84B69] text-white font-bold shadow-xs'
                : 'text-[#6E2E3E] hover:text-[#C84B69] hover:bg-white/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tác phẩm AI ({completedJobs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('processing')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all font-serif cursor-pointer ${
              activeTab === 'processing'
                ? 'bg-[#C84B69] text-white font-bold shadow-xs'
                : 'text-[#6E2E3E] hover:text-[#C84B69] hover:bg-white/60'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Tiến trình ({pendingJobs.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: SAVED DRAFTS */}
      {activeTab === 'drafts' && (
        <div>
          {drafts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-[#F4C2CE] p-8 shadow-xs space-y-3">
              <div className="w-14 h-14 rounded-full bg-[#FFF0F4] border border-[#F4C2CE] text-[#C84B69] mx-auto flex items-center justify-center">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-base font-serif font-bold text-[#1C1917]">
                Chưa có bản phác thảo nào
              </h3>
              <p className="text-xs text-[#78716C] max-w-md mx-auto font-light leading-relaxed">
                Hãy vào một bộ trang phục, chọn "Phối thử bộ này" và bấm "Lưu phác thảo" để lưu giữ cấu trúc y phục của bạn.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {drafts.map((draft) => {
                const costume = costumes.find((c) => c.id === draft.costumeId);
                return (
                  <div
                    key={draft.id}
                    className="group rounded-3xl bg-white border border-[#F4C2CE] overflow-hidden flex flex-col justify-between hover:border-[#C84B69] hover:shadow-lg transition-all duration-300 shadow-xs"
                  >
                    {/* Sketch Thumbnail */}
                    <div className="relative h-60 bg-gradient-to-b from-[#FAF7F2] via-[#FFF5F7] to-white flex items-center justify-center overflow-hidden border-b border-[#F4C2CE] p-3">
                      {draft.sketchDataUrl ? (
                        <img
                          src={draft.sketchDataUrl}
                          alt={draft.title}
                          className="h-full w-auto object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-sm"
                        />
                      ) : (
                        <div className="text-[#A8A29E] text-xs flex flex-col items-center gap-1">
                          <Layers className="w-6 h-6 text-[#C84B69]" />
                          <span>Bản phác thảo phẳng</span>
                        </div>
                      )}

                      <span className="absolute top-3 left-3 text-[10px] px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-xs text-[#C84B69] border border-[#F4C2CE] font-serif font-semibold shadow-2xs">
                        {costume?.name || 'Việt phục'}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <h4 className="font-serif font-bold text-[#1C1917] text-base group-hover:text-[#C84B69] transition-colors leading-snug">
                          {draft.title}
                        </h4>
                        <div className="text-xs text-[#78716C] space-y-1 mt-2 font-light">
                          <div className="flex items-center gap-1.5 text-[11px]">
                            <Calendar className="w-3 h-3 text-[#C84B69]" />
                            <span>Cập nhật: {formatDate(draft.updatedAt)}</span>
                          </div>
                          <div className="text-[11px]">
                            Phong cách: {draft.remixStyle === 'traditional' ? 'Truyền thống' : draft.remixStyle === 'subtle_modern' ? 'Cách tân nhẹ' : 'Remix hiện đại'}
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center justify-between pt-3 border-t border-[#F8E5EB] text-xs">
                        <button
                          onClick={() => onDeleteDraft(draft.id)}
                          className="text-[#A8A29E] hover:text-[#991B1B] p-2 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Xóa phác thảo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onOpenDraft(draft)}
                          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FFF0F4] hover:bg-[#C84B69] text-[#C84B69] hover:text-white font-serif font-bold transition-all border border-[#F4C2CE] cursor-pointer shadow-2xs"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Mở lại chỉnh sửa</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: COMPLETED AI DESIGNS */}
      {activeTab === 'completed' && (
        <div>
          {completedJobs.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-[#F4C2CE] p-8 shadow-xs space-y-3">
              <div className="w-14 h-14 rounded-full bg-[#FFF0F4] border border-[#F4C2CE] text-[#C84B69] mx-auto flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-serif font-bold text-[#1C1917]">
                Chưa có tác phẩm AI nào hoàn thành
              </h3>
              <p className="text-xs text-[#78716C] max-w-md mx-auto font-light leading-relaxed">
                Hãy vào Studio, phối thử trang phục và bấm "Hoàn thiện bằng AI" để hệ thống tạo ra tác phẩm nghệ thuật.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedJobs.map((job) => (
                <div
                  key={job.id}
                  className="group rounded-3xl bg-white border border-[#F4C2CE] overflow-hidden flex flex-col justify-between hover:border-[#C84B69] hover:shadow-lg transition-all duration-300 shadow-xs"
                >
                  <div className="relative h-64 bg-gradient-to-b from-[#FAF7F2] to-[#FFF5F7] overflow-hidden">
                    <img
                      src={job.resultImageUrl || job.sketchDataUrl}
                      alt={job.costumeName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/80 via-transparent to-transparent" />

                    <span className="absolute top-3 right-3 text-[10px] px-2.5 py-1 rounded-full bg-white/95 text-[#C84B69] border border-[#F4C2CE] flex items-center gap-1 font-serif font-semibold shadow-2xs">
                      <CheckCircle2 className="w-3 h-3 text-[#C84B69]" />
                      Hoàn thành
                    </span>

                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <h4 className="font-serif font-bold text-lg drop-shadow-sm">
                        {job.costumeName}
                      </h4>
                      <p className="text-[11px] text-stone-200 font-light">
                        {job.eventName}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 flex items-center justify-between text-xs border-t border-[#F8E5EB]">
                    <span className="text-[11px] text-[#78716C] font-light">
                      {formatDate(job.completedAt || job.createdAt)}
                    </span>

                    <button
                      onClick={() => onViewJobResult(job)}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#C84B69] hover:bg-[#B33B58] text-white font-medium transition-all shadow-xs cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Xem & So sánh</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PROCESSING & FAILED JOBS */}
      {activeTab === 'processing' && (
        <div className="space-y-4">
          {pendingJobs.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-[#F4C2CE] p-8 shadow-xs space-y-3">
              <div className="w-14 h-14 rounded-full bg-[#FFF0F4] border border-[#F4C2CE] text-[#C84B69] mx-auto flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-serif font-bold text-[#1C1917]">
                Không có tác vụ nào đang chờ
              </h3>
              <p className="text-xs text-[#78716C] max-w-md mx-auto font-light">
                Mọi tác vụ hoàn thiện AI đều đã hoàn thành tốt đẹp.
              </p>
            </div>
          ) : (
            pendingJobs.map((job) => (
              <div
                key={job.id}
                className="p-5 rounded-2xl bg-white border border-[#F4C2CE] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#FFF0F4] border border-[#F4C2CE] flex items-center justify-center shrink-0">
                    {job.status === 'failed' ? (
                      <AlertCircle className="w-6 h-6 text-[#991B1B]" />
                    ) : (
                      <Loader2 className="w-6 h-6 text-[#C84B69] animate-spin" />
                    )}
                  </div>
                  <div>
                    <div className="font-serif font-bold text-[#1C1917] flex items-center gap-2">
                      <span>{job.costumeName}</span>
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-[#FFF0F4] text-[#C84B69] border border-[#F4C2CE]">
                        {job.id}
                      </span>
                    </div>
                    <div className="text-xs text-[#57534E] mt-0.5 font-light">
                      Sự kiện: {job.eventName} • Trạng thái:{' '}
                      <span className="font-serif font-semibold text-[#C84B69]">{job.status}</span>
                    </div>
                    {job.errorMessage && (
                      <div className="text-xs text-[#991B1B] mt-1 font-light">
                        Lỗi: {job.errorMessage}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  {job.status === 'failed' ? (
                    <button
                      onClick={() => onRetryJob(job)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FEF2F2] hover:bg-[#FEE2E2] text-[#991B1B] text-xs font-serif font-semibold border border-[#FCA5A5]/60 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Thử tạo lại</span>
                    </button>
                  ) : (
                    <div className="text-xs text-[#C84B69] font-mono font-semibold">
                      Tiến độ: {job.progress}%
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
