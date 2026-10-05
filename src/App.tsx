import React, { useState, useEffect } from 'react';
import { EventItem, Costume, BackgroundSetting, FittingDraft, AIJob } from './types';
import { api } from './services/api';
import { Navbar } from './components/Navbar';
import { EventSelector } from './components/EventSelector';
import { CostumeList } from './components/CostumeList';
import { CostumeDetail } from './components/CostumeDetail';
import { StudioRemix } from './components/StudioRemix';
import { UserProfile } from './components/UserProfile';
import { ComparisonModal } from './components/ComparisonModal';
import { CultureGuideModal } from './components/CultureGuideModal';
import { AoDaiRecommender } from './components/AoDaiRecommender';
import { HomePage } from './components/HomePage';
import { TrienSonSeal, ChimLacIcon, HoaSenDivider } from './components/VietnameseMotifs';
import { Loader2, AlertCircle, Sparkles } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'costumes' | 'costume-detail' | 'studio' | 'profile' | 'aodai-recommender'>('home');

  const [events, setEvents] = useState<EventItem[]>([]);
  const [costumes, setCostumes] = useState<Costume[]>([]);
  const [backgrounds, setBackgrounds] = useState<BackgroundSetting[]>([]);
  const [drafts, setDrafts] = useState<FittingDraft[]>([]);
  const [aiJobs, setAIJobs] = useState<AIJob[]>([]);

  const [selectedEvent, setSelectedEvent] = useState<EventItem | undefined>();
  const [selectedCostume, setSelectedCostume] = useState<Costume | null>(null);
  const [activeDraft, setActiveDraft] = useState<FittingDraft | null>(null);

  const [inspectJob, setInspectJob] = useState<AIJob | null>(null);
  const [showCultureModal, setShowCultureModal] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadInitialData() {
      try {
        setLoading(true);
        const [evts, costs, bgs, drfts, jobs] = await Promise.all([
          api.getEvents(),
          api.getCostumes(),
          api.getBackgrounds(),
          api.getDrafts(),
          api.getAIJobs()
        ]);
        setEvents(evts);
        setCostumes(costs);
        setBackgrounds(bgs);
        setDrafts(drfts);
        setAIJobs(jobs);

        if (evts.length > 0) setSelectedEvent(evts[0]);
        if (costs.length > 0) setSelectedCostume(costs[0]);
      } catch (err: any) {
        console.error('Failed to load application data:', err);
        setError('Không thể kết nối đến máy chủ dữ liệu. Vui lòng tải lại trang.');
      } finally {
        setLoading(false);
      }
    }

    loadInitialData();
  }, []);

  const handleSelectEvent = (evt: EventItem) => {
    setSelectedEvent(evt);
    setCurrentView('costumes');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCostume = (costume: Costume) => {
    setSelectedCostume(costume);
    setActiveDraft(null);
    setCurrentView('costume-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartRemix = (costume: Costume) => {
    setSelectedCostume(costume);
    setActiveDraft(null);
    setCurrentView('studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartAoDaiRemix = (costume: Costume, preset?: Partial<FittingDraft>) => {
    setSelectedCostume(costume);
    if (preset) {
      const newDraft: FittingDraft = {
        id: `draft-${Date.now()}`,
        title: preset.customPrompt || 'Bản phối Áo Dài Đề Xuất',
        eventId: selectedEvent?.id || 'evt-tet',
        costumeId: costume.id,
        modelGender: 'female',
        modelPose: 'thủ lễ cung đình',
        selectedColorId: preset.selectedColorId || costume.colorVariants[0]?.hex || '#ffffff',
        selectedMaterialId: costume.materials[0]?.id || '',
        selectedAccessories: costume.accessories.map((a) => a.name).slice(0, 2),
        selectedHairstyle: 'Búi tóc đội khăn',
        selectedFootwear: 'Guốc mộc truyền thống',
        selectedDetails: {},
        selectedBackgroundId: backgrounds[0]?.id || '',
        remixStyle: preset.remixStyle || 'traditional',
        customPrompt: preset.customPrompt || '',
        visibleLayers: {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setActiveDraft(newDraft);
    } else {
      setActiveDraft(null);
    }
    setCurrentView('studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDraftSaved = (draft: FittingDraft) => {
    setDrafts((prev) => {
      const idx = prev.findIndex((d) => d.id === draft.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = draft;
        return copy;
      }
      return [draft, ...prev];
    });
  };

  const handleJobCompleted = (job: AIJob) => {
    setAIJobs((prev) => {
      const idx = prev.findIndex((j) => j.id === job.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = job;
        return copy;
      }
      return [job, ...prev];
    });
  };

  const handleOpenDraft = (draft: FittingDraft) => {
    const costume = costumes.find((c) => c.id === draft.costumeId);
    if (costume) setSelectedCostume(costume);
    const evt = events.find((e) => e.id === draft.eventId);
    if (evt) setSelectedEvent(evt);
    setActiveDraft(draft);
    setCurrentView('studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteDraft = async (draftId: string) => {
    try {
      await api.deleteDraft(draftId);
      setDrafts((prev) => prev.filter((d) => d.id !== draftId));
    } catch (err: any) {
      alert(err.message || 'Lỗi khi xóa bản phác thảo');
    }
  };

  const handleRetryJob = async (job: AIJob) => {
    try {
      const retried = await api.retryAIJob(job.id);
      setAIJobs((prev) => prev.map((j) => (j.id === retried.id ? retried : j)));
      setCurrentView('profile');
    } catch (err: any) {
      alert(err.message || 'Không thể thử lại yêu cầu');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1917] flex flex-col font-sans selection:bg-[#9B2C2C]/20 selection:text-[#9B2C2C]">
      {/* Top Editorial Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => {
          if (view === 'home') setCurrentView('home');
          else if (view === 'costumes') setCurrentView('costumes');
          else if (view === 'studio') {
            if (!selectedCostume && costumes.length > 0) {
              setSelectedCostume(costumes[0]);
            }
            setCurrentView('studio');
          } else if (view === 'profile') setCurrentView('profile');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        draftsCount={drafts.length}
        onOpenCultureGuide={() => setShowCultureModal(true)}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <div className="w-12 h-12 rounded-full bg-[#9B2C2C]/10 flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-[#9B2C2C] animate-spin" />
            </div>
            <p className="text-sm font-serif italic text-[#78716C]">
              Đang mở tàng thư điển lệ cổ phục Việt...
            </p>
          </div>
        ) : error ? (
          <div className="max-w-md mx-auto my-20 p-8 rounded-2xl bg-[#FFFFFF] border border-[#E8E2D8] text-center shadow-xs">
            <AlertCircle className="w-10 h-10 text-[#991B1B] mx-auto mb-3" />
            <h3 className="font-serif font-bold text-lg text-[#1C1917] mb-2">{error}</h3>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 bg-[#9B2C2C] hover:bg-[#832424] text-white rounded-sm text-xs font-semibold"
            >
              Tải lại trang
            </button>
          </div>
        ) : (
          <>
            {/* 1. HOME VIEW: COMPLETE HOMEPAGE (Giới thiệu, Sự kiện, Kho cổ phục) */}
            {currentView === 'home' && (
              <HomePage
                events={events}
                costumes={costumes}
                selectedEvent={selectedEvent}
                onSelectEvent={(evt) => setSelectedEvent(evt)}
                onSelectCostume={handleSelectCostume}
                onStartStudio={() => {
                  if (costumes.length > 0) {
                    setSelectedCostume(selectedCostume || costumes[0]);
                  }
                  setCurrentView('studio');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {/* 2. COSTUMES LIST VIEW: RECOMMENDED BASED ON EVENT */}
            {currentView === 'costumes' && (
              <CostumeList
                costumes={costumes}
                selectedEvent={selectedEvent}
                onSelectCostume={handleSelectCostume}
                onChangeEvent={() => setCurrentView('home')}
              />
            )}

            {/* 3. COSTUME DETAIL VIEW (Editorial monograph in same tab) */}
            {currentView === 'costume-detail' && selectedCostume && (
              <CostumeDetail
                costume={selectedCostume}
                selectedEvent={selectedEvent}
                onBack={() => setCurrentView('costumes')}
                onTryRemix={handleStartRemix}
              />
            )}

            {/* 4. STUDIO REMIX VIEW ("Phối thử bộ này") */}
            {currentView === 'studio' &&
              (selectedCostume ? (
                <StudioRemix
                  costume={selectedCostume}
                  event={selectedEvent}
                  backgrounds={backgrounds}
                  existingDraft={activeDraft}
                  onDraftSaved={handleDraftSaved}
                  onJobCompleted={handleJobCompleted}
                />
              ) : (
                <div className="py-24 text-center">
                  <p className="text-[#57534E] text-sm mb-4 font-light">
                    Vui lòng chọn một bộ trang phục trước khi vào Studio phối thử.
                  </p>
                  <button
                    onClick={() => setCurrentView('costumes')}
                    className="px-6 py-2.5 rounded-sm bg-[#9B2C2C] text-white font-medium text-xs"
                  >
                    Xem kho trang phục
                  </button>
                </div>
              ))}

            {/* 5. USER PROFILE VIEW (Saved drafts & Completed designs) */}
            {currentView === 'profile' && (
              <UserProfile
                drafts={drafts}
                aiJobs={aiJobs}
                costumes={costumes}
                onOpenDraft={handleOpenDraft}
                onDeleteDraft={handleDeleteDraft}
                onRetryJob={handleRetryJob}
                onViewJobResult={(job) => setInspectJob(job)}
              />
            )}

            {/* 6. ÁO DÀI SMART RECOMMENDER VIEW */}
            {currentView === 'aodai-recommender' && (
              <AoDaiRecommender
                onStartRemix={handleStartAoDaiRemix}
                aoDaiCostume={costumes.find((c) => c.slug.includes('ao-dai')) || costumes[0]}
              />
            )}
          </>
        )}
      </main>

      {/* Editorial Heritage Footer */}
      <footer className="border-t border-[#E8E2D8] bg-[#FFFFFF] py-10 text-xs text-[#78716C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <TrienSonSeal text="Remix" size="sm" />
            <div className="flex flex-col">
              <span className="font-serif font-bold text-[#1C1917] text-sm">
                Việt Phục Remix
              </span>
              <span className="text-[11px] text-[#A8A29E] font-light">
                Nền tảng sáng tạo & Phục dựng y phục cổ truyền Việt Nam
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-[#57534E]">
            <button
              onClick={() => setShowCultureModal(true)}
              className="hover:text-[#9B2C2C] transition-colors font-serif"
            >
              Quy chế Ngũ Thường & Y phục
            </button>
            <span>•</span>
            <span className="font-serif">Đối chiếu Đại Nam Hội Điển</span>
            <span>•</span>
            <span className="font-serif">Bảo tàng Cố đô Huế</span>
          </div>
        </div>
      </footer>

      {/* Comparison Modal when reviewing completed AI result */}
      {inspectJob && (
        <ComparisonModal
          job={inspectJob}
          onClose={() => setInspectJob(null)}
          onReopenStudio={() => {
            const costume = costumes.find((c) => c.id === inspectJob.costumeId);
            if (costume) setSelectedCostume(costume);
            setInspectJob(null);
            setCurrentView('studio');
          }}
        />
      )}

      {/* Culture Guide Handbook Modal */}
      <CultureGuideModal
        isOpen={showCultureModal}
        onClose={() => setShowCultureModal(false)}
      />
    </div>
  );
}
