import React, { useState, useEffect } from 'react';
import { EventItem, Costume, BackgroundSetting, FittingDraft, AIJob } from './types';
import { api, UserProfile as UserProfileType } from './services/api';
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
import { AuthModal } from './components/AuthModal';
import { ChatAssistant } from './components/ChatAssistant';
import { TrienSonSeal, ChimLacIcon, HoaSenDivider, PubSeal } from './components/VietnameseMotifs';
import { Loader2, AlertCircle, Sparkles } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'costumes' | 'costume-detail' | 'studio' | 'profile' | 'aodai-recommender'>('home');

  // Authentication State & User Wardrobe
  const [currentUser, setCurrentUser] = useState<UserProfileType | null>(null);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [authPromptMessage, setAuthPromptMessage] = useState<string | null>(null);

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

        // 1. Authenticate user session
        let me: UserProfileType | null = null;
        try {
          me = await api.getMe();
          setCurrentUser(me);
        } catch {
          setCurrentUser(null);
        }

        // 2. Fetch public cultural data
        const [evts, costs, bgs] = await Promise.all([
          api.getEvents(),
          api.getCostumes(),
          api.getBackgrounds()
        ]);
        setEvents(evts);
        setCostumes(costs);
        setBackgrounds(bgs);

        // 3. If logged in, fetch user's private wardrobe drafts and AI jobs
        if (me) {
          try {
            const [drfts, jobs] = await Promise.all([
              api.getDrafts(),
              api.getAIJobs()
            ]);
            setDrafts(drfts);
            setAIJobs(jobs);
          } catch {
            setDrafts([]);
            setAIJobs([]);
          }
        } else {
          setDrafts([]);
          setAIJobs([]);
        }

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
        id: `preset-${Date.now()}`,
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

  const hasActiveJobs = aiJobs.some(job => job.status === 'queued' || job.status === 'processing');
  useEffect(() => {
    if (!currentUser || currentView !== 'profile' || !hasActiveJobs) return;
    let cancelled = false;
    const timer = window.setInterval(async () => {
      try {
        const jobs = await api.getAIJobs();
        if (!cancelled) setAIJobs(jobs);
      } catch {}
    }, 2000);
    return () => { cancelled = true; window.clearInterval(timer); };
  }, [currentUser?.id, currentView, hasActiveJobs]);

  const handleOpenAuth = (mode: 'login' | 'register' = 'login', prompt?: string) => {
    setAuthModalMode(mode);
    setAuthPromptMessage(prompt || null);
    setShowAuthModal(true);
  };

  const handleAuthSuccess = async (user: UserProfileType) => {
    setCurrentUser(user);
    try {
      const [drfts, jobs] = await Promise.all([
        api.getDrafts(),
        api.getAIJobs()
      ]);
      setDrafts(drfts);
      setAIJobs(jobs);
    } catch {}
  };

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch (err: any) { alert(err.message || 'Chưa đăng xuất được.'); return; }
    setCurrentUser(null);
    setDrafts([]);
    setAIJobs([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF5F7] via-[#FDF0F3] to-[#FFF5F7] text-[#1C1917] flex flex-col font-sans selection:bg-[#C84B69]/20 selection:text-[#C84B69]">
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
        user={currentUser}
        onOpenAuth={() => handleOpenAuth('login')}
        onLogout={handleLogout}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <div className="w-14 h-14 rounded-full bg-[#FFF0F4] border border-[#F4C2CE] flex items-center justify-center shadow-xs">
              <Loader2 className="w-7 h-7 text-[#C84B69] animate-spin" />
            </div>
            <p className="text-sm font-serif italic text-[#6E2E3E]">
              Đang mở tàng thư điển lệ cổ phục Việt...
            </p>
          </div>
        ) : error ? (
          <div className="max-w-md mx-auto my-20 p-8 rounded-2xl bg-white border border-[#F4C2CE] text-center shadow-sm">
            <AlertCircle className="w-10 h-10 text-[#C84B69] mx-auto mb-3" />
            <h3 className="font-serif font-bold text-lg text-[#1C1917] mb-2">{error}</h3>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 bg-[#C84B69] hover:bg-[#B33B58] text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              Tải lại trang
            </button>
          </div>
        ) : (
          <>
            {/* 1. HOME VIEW: COMPLETE HOMEPAGE (Giới thiệu, Sự kiện, Kho cổ phục dàn trải) */}
            {currentView === 'home' && (
              <HomePage
                events={events}
                costumes={costumes}
                selectedEvent={selectedEvent}
                onSelectEvent={(evt) => setSelectedEvent(evt)}
                onSelectCostume={handleSelectCostume}
                onOpenCostumes={() => {
                  setCurrentView('costumes');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onStartStudio={() => {
                  if (costumes.length > 0) {
                    setSelectedCostume(selectedCostume || costumes[0]);
                  }
                  setCurrentView('studio');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {/* 2. COSTUMES LIST VIEW: SƠ ĐỒ TRỐNG ĐỒNG + LỌC NAM NỮ + THẺ CỔ PHỤC */}
            {currentView === 'costumes' && (
              <CostumeList
                costumes={costumes}
                selectedEvent={selectedEvent}
                onSelectCostume={handleSelectCostume}
                onTryRemix={handleStartRemix}
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
                  costumes={costumes}
                  onSelectCostume={(newCostume) => {
                    setSelectedCostume(newCostume);
                  }}
                  event={selectedEvent}
                  events={events}
                  onSelectEvent={setSelectedEvent}
                  backgrounds={backgrounds}
                  existingDraft={activeDraft}
                  onDraftSaved={handleDraftSaved}
                  onJobCompleted={handleJobCompleted}
                  currentUser={currentUser}
                  onRequestAuth={(prompt) => handleOpenAuth('login', prompt)}
                />
              ) : (
                <div className="py-24 text-center">
                  <p className="text-[#57534E] text-sm mb-4 font-light">
                    Vui lòng chọn một bộ trang phục trước khi vào Studio phối thử.
                  </p>
                  <button
                    onClick={() => setCurrentView('costumes')}
                    className="px-6 py-2.5 rounded-xl bg-[#C84B69] hover:bg-[#B33B58] text-white font-medium text-xs shadow-xs cursor-pointer"
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
                currentUser={currentUser}
                onOpenAuth={() => handleOpenAuth('login')}
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

      {/* Editorial Heritage Footer - Unified Pink Palette */}
      <footer className="border-t border-[#F7D6DE] bg-gradient-to-r from-[#FFF5F7] via-[#FFFFFF] to-[#FFF5F7] py-10 text-xs text-[#78716C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <PubSeal size="sm" />
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-[#1C1917] text-sm">
                  PUB
                </span>
                <span className="text-[11px] font-mono text-[#991B1B] font-semibold bg-[#991B1B]/10 px-2 py-0.5 rounded-sm border border-[#991B1B]/25">
                  PTIT • UET • BKA
                </span>
              </div>
              <span className="text-[11px] text-[#78716C] font-light mt-0.5">
                Liên minh sinh viên PTIT - UET - BKA sáng tạo & phục dựng y phục cổ truyền Việt Nam
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-serif text-[#57534E]">
            <span className="hover:text-[#C84B69] transition-colors">Khám phá</span>
            <span className="text-[#F4C2CE]">•</span>
            <span className="hover:text-[#C84B69] transition-colors">Phối đồ</span>
            <span className="text-[#F4C2CE]">•</span>
            <span className="hover:text-[#C84B69] transition-colors">Định hình phong cách</span>
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
        costumes={costumes}
        isOpen={showCultureModal}
        onClose={() => setShowCultureModal(false)}
      />

      {/* Floating chat assistant; knows the costume open in detail or Studio */}
      <ChatAssistant
        currentCostume={currentView === 'costume-detail' || currentView === 'studio' ? selectedCostume : null}
        userId={currentUser?.id}
      />

      {/* User Authentication Modal (Register, Login, Forgot Password, Reset) */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
        initialMode={authModalMode}
        promptMessage={authPromptMessage}
      />
    </div>
  );
}
