import React, { useState } from 'react';
import { FittingDraft, AIJob, Costume } from '../types';
import { TrienSonSeal, ChimLacIcon } from './VietnameseMotifs';
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
    <div className="py-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Editorial Header */}
      <div className="mb-10 pb-6 border-b border-[#E8E2D8] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-serif text-[#9B2C2C] font-semibold tracking-wider uppercase mb-1">
            <ChimLacIcon className="w-3.5 h-3 text-[#9B2C2C]" />
            Không Gian Sáng Tạo Cá Nhân
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-[#1C1917] flex items-center gap-3">
            Tủ Đồ Của Tôi
          </h1>
          <p className="text-xs sm:text-sm text-[#57534E] font-light mt-1">
            Quản lý những bản phác thảo đã lưu, các tác phẩm AI đã hoàn thiện và theo dõi tiến trình xử lý.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-[#FFFFFF] border border-[#E8E2D8] rounded-md text-xs shadow-xs">
          <button
            onClick={() => setActiveTab('drafts')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xs transition-colors font-serif ${
              activeTab === 'drafts'
                ? 'bg-[#9B2C2C] text-white font-bold'
                : 'text-[#57534E] hover:text-[#1C1917]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Phác thảo ({drafts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('completed')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xs transition-colors font-serif ${
              activeTab === 'completed'
                ? 'bg-[#9B2C2C] text-white font-bold'
                : 'text-[#57534E] hover:text-[#1C1917]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tác phẩm AI ({completedJobs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('processing')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xs transition-colors font-serif ${
              activeTab === 'processing'
                ? 'bg-[#9B2C2C] text-white font-bold'
                : 'text-[#57534E] hover:text-[#1C1917]'
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
            <div className="text-center py-20 bg-[#FFFFFF] rounded-2xl border border-[#E8E2D8] p-8 shadow-xs">
              <Layers className="w-10 h-10 text-[#C29B38] mx-auto mb-3 opacity-60" />
              <h3 className="text-base font-serif font-bold text-[#1C1917] mb-1">
                Chưa có bản phác thảo nào
              </h3>
              <p className="text-xs text-[#78716C] max-w-md mx-auto font-light">
                Hãy vào một bộ trang phục, chọn "Phối thử bộ này" và bấm "Lưu bản phác thảo" để lưu giữ cấu trúc y phục của bạn.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {drafts.map((draft) => {
                const costume = costumes.find((c) => c.id === draft.costumeId);
                return (
                  <div
                    key={draft.id}
                    className="group rounded-2xl bg-[#FFFFFF] border border-[#E8E2D8] overflow-hidden flex flex-col justify-between hover:border-[#9B2C2C]/50 hover:shadow-md transition-all shadow-xs"
                  >
                    {/* Sketch Thumbnail */}
                    <div className="relative h-60 bg-[#FAF7F2] flex items-center justify-center overflow-hidden border-b border-[#E8E2D8]">
                      {draft.sketchDataUrl ? (
                        <img
                          src={draft.sketchDataUrl}
                          alt={draft.title}
                          className="h-full w-auto object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="text-[#A8A29E] text-xs flex flex-col items-center gap-1">
                          <Layers className="w-6 h-6" />
                          <span>Bản phác thảo phẳng</span>
                        </div>
                      )}

                      <span className="absolute top-3 left-3 text-[10px] px-2 py-0.5 rounded-xs bg-[#FFFFFF]/90 backdrop-blur-xs text-[#9B2C2C] border border-[#E8E2D8] font-serif font-semibold">
                        {costume?.name || 'Việt phục'}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-serif font-bold text-[#1C1917] text-base mb-1 group-hover:text-[#9B2C2C] transition-colors">
                          {draft.title}
                        </h4>
                        <div className="text-xs text-[#78716C] space-y-1 mb-4 font-light">
                          <div className="flex items-center gap-1.5 text-[11px]">
                            <Calendar className="w-3 h-3 text-[#C29B38]" />
                            <span>Cập nhật: {formatDate(draft.updatedAt)}</span>
                          </div>
                          <div className="text-[11px]">
                            Phong cách: {draft.remixStyle === 'traditional' ? 'Truyền thống' : draft.remixStyle === 'subtle_modern' ? 'Cách tân nhẹ' : 'Remix hiện đại'}
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center justify-between pt-3 border-t border-[#F0EBE3] text-xs">
                        <button
                          onClick={() => onDeleteDraft(draft.id)}
                          className="text-[#A8A29E] hover:text-[#991B1B] p-1.5 rounded transition-colors"
                          title="Xóa phác thảo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onOpenDraft(draft)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-[#FAF7F2] hover:bg-[#9B2C2C] text-[#9B2C2C] hover:text-white font-serif font-semibold transition-all border border-[#E8E2D8]"
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
            <div className="text-center py-20 bg-[#FFFFFF] rounded-2xl border border-[#E8E2D8] p-8 shadow-xs">
              <Sparkles className="w-10 h-10 text-[#C29B38] mx-auto mb-3 opacity-60" />
              <h3 className="text-base font-serif font-bold text-[#1C1917] mb-1">
                Chưa có tác phẩm AI nào hoàn thành
              </h3>
              <p className="text-xs text-[#78716C] max-w-md mx-auto font-light">
                Hãy vào Studio, phối thử trang phục và bấm "Hoàn thiện bằng AI" để hệ thống tạo ra tác phẩm nghệ thuật.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedJobs.map((job) => (
                <div
                  key={job.id}
                  className="group rounded-2xl bg-[#FFFFFF] border border-[#E8E2D8] overflow-hidden flex flex-col justify-between hover:border-[#9B2C2C]/50 hover:shadow-md transition-all shadow-xs"
                >
                  <div className="relative h-64 bg-[#FAF7F2] overflow-hidden">
                    <img
                      src={job.resultImageUrl || job.sketchDataUrl}
                      alt={job.costumeName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/75 via-transparent to-transparent" />

                    <span className="absolute top-3 right-3 text-[10px] px-2.5 py-0.5 rounded-xs bg-[#FFFFFF]/95 text-[#9B2C2C] border border-[#E8E2D8] flex items-center gap-1 font-serif font-semibold">
                      <CheckCircle2 className="w-3 h-3 text-[#9B2C2C]" />
                      Hoàn thành
                    </span>

                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <h4 className="font-serif font-bold text-lg drop-shadow-sm">
                        {job.costumeName}
                      </h4>
                      <p className="text-[11px] text-[#FAF7F2]/90 font-light">
                        {job.eventName}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 flex items-center justify-between text-xs border-t border-[#E8E2D8]">
                    <span className="text-[11px] text-[#78716C] font-light">
                      {formatDate(job.completedAt || job.createdAt)}
                    </span>

                    <button
                      onClick={() => onViewJobResult(job)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-sm bg-[#9B2C2C] hover:bg-[#832424] text-white font-medium transition-all"
                    >
                      <Eye className="w-3 h-3" />
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
            <div className="text-center py-20 bg-[#FFFFFF] rounded-2xl border border-[#E8E2D8] p-8 shadow-xs">
              <Clock className="w-10 h-10 text-[#C29B38] mx-auto mb-3 opacity-60" />
              <h3 className="text-base font-serif font-bold text-[#1C1917] mb-1">
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
                className="p-5 rounded-xl bg-[#FFFFFF] border border-[#E8E2D8] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] flex items-center justify-center shrink-0">
                    {job.status === 'failed' ? (
                      <AlertCircle className="w-6 h-6 text-[#991B1B]" />
                    ) : (
                      <Loader2 className="w-6 h-6 text-[#9B2C2C] animate-spin" />
                    )}
                  </div>
                  <div>
                    <div className="font-serif font-bold text-[#1C1917] flex items-center gap-2">
                      {job.costumeName}
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#FAF7F2] text-[#78716C] border border-[#E8E2D8]">
                        {job.id}
                      </span>
                    </div>
                    <div className="text-xs text-[#57534E] mt-0.5 font-light">
                      Sự kiện: {job.eventName} • Trạng thái:{' '}
                      <span className="font-serif font-semibold text-[#9B2C2C]">{job.status}</span>
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
                      className="flex items-center gap-1.5 px-4 py-2 rounded-sm bg-[#FEF2F2] hover:bg-[#FEE2E2] text-[#991B1B] text-xs font-serif font-semibold border border-[#FCA5A5]/60 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Thử tạo lại</span>
                    </button>
                  ) : (
                    <div className="text-xs text-[#9B2C2C] font-mono font-semibold">
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
