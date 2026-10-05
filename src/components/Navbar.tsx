import React from 'react';
import { ChimLacIcon, TrienSonSeal } from './VietnameseMotifs';
import { Bookmark, Compass, BookOpen, Layers, Home, Sparkles } from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  draftsCount: number;
  onOpenCultureGuide: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  draftsCount,
  onOpenCultureGuide
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#FFF5F7]/95 border-b border-[#F7D6DE] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand with [PUB] Logo & Typography as drawn in sketch */}
        <div
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          {/* [PUB] Stamp Badge as drawn in sketch */}
          <div className="px-2.5 py-1 border-2 border-[#C84B69] rounded-md font-serif font-black text-xs text-[#C84B69] bg-white shadow-xs tracking-wider group-hover:scale-105 transition-transform">
            PUB
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-[#1C1917] font-serif font-bold text-xl tracking-tight group-hover:text-[#C84B69] transition-colors">
                Việt Phục Remix
              </span>
              <span className="hidden sm:inline-flex text-[10px] uppercase font-semibold px-2 py-0.5 rounded-xs bg-[#C84B69]/10 text-[#C84B69] border border-[#C84B69]/25 tracking-wider">
                Di Sản
              </span>
            </div>
            <span className="text-[11px] text-[#78716C] font-normal tracking-wide">
              Khám phá • Phối đồ • Định hình phong cách
            </span>
          </div>
        </div>

        {/* Desktop Navigation Items */}
        <nav className="hidden md:flex items-center gap-2">
          {/* TAB 1: Trang chủ (With distinct red underline when active as drawn in sketch) */}
          <button
            onClick={() => onNavigate('home')}
            className={`relative flex items-center gap-1.5 px-3.5 py-2.5 text-sm font-medium transition-all ${
              currentView === 'home'
                ? 'text-[#C84B69] font-bold'
                : 'text-[#57534E] hover:text-[#C84B69]'
            }`}
          >
            <Home className="w-4 h-4 text-[#C84B69]" />
            <span className="font-serif">Trang chủ</span>
            {currentView === 'home' && (
              <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#C84B69] rounded-full shadow-xs" />
            )}
          </button>

          {/* TAB 2: Cổ phục (Cùng mức với Trang chủ) */}
          <button
            onClick={() => onNavigate('costumes')}
            className={`relative flex items-center gap-1.5 px-3.5 py-2.5 text-sm font-medium transition-all ${
              currentView === 'costumes' || currentView === 'costume-detail'
                ? 'text-[#C84B69] font-bold'
                : 'text-[#57534E] hover:text-[#C84B69]'
            }`}
          >
            <Compass className="w-4 h-4 text-[#C84B69]" />
            <span className="font-serif">Cổ phục</span>
            {(currentView === 'costumes' || currentView === 'costume-detail') && (
              <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#C84B69] rounded-full shadow-xs" />
            )}
          </button>

          {/* TAB 3: Phối Thử Studio */}
          <button
            onClick={() => onNavigate('studio')}
            className={`relative flex items-center gap-1.5 px-3.5 py-2.5 text-sm font-medium transition-all ${
              currentView === 'studio'
                ? 'text-[#C84B69] font-bold'
                : 'text-[#57534E] hover:text-[#C84B69]'
            }`}
          >
            <Layers className="w-4 h-4 text-[#C29B38]" />
            <span className="font-serif">Phối Thử Studio</span>
            {currentView === 'studio' && (
              <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#C84B69] rounded-full shadow-xs" />
            )}
          </button>

          {/* TAB 4: Bộ Sưu Tập */}
          <button
            onClick={() => onNavigate('profile')}
            className={`relative flex items-center gap-1.5 px-3.5 py-2.5 text-sm font-medium transition-all ${
              currentView === 'profile'
                ? 'text-[#C84B69] font-bold'
                : 'text-[#57534E] hover:text-[#C84B69]'
            }`}
          >
            <Bookmark className="w-4 h-4 text-[#C84B69]" />
            <span className="font-serif">Bộ Sưu Tập</span>
            {draftsCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#C84B69] text-white text-[10px] font-bold flex items-center justify-center">
                {draftsCount}
              </span>
            )}
            {currentView === 'profile' && (
              <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#C84B69] rounded-full shadow-xs" />
            )}
          </button>

          {/* Điển cứu văn hóa */}
          <button
            onClick={onOpenCultureGuide}
            className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs text-[#78716C] hover:text-[#C84B69] transition-colors ml-2 border border-transparent hover:border-[#F4C2CE]"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Điển cứu</span>
          </button>
        </nav>

        {/* Action Button: "Phối Thử Ngay" */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('studio')}
            className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-md bg-[#C84B69] hover:bg-[#B33B57] text-[#FFFFFF] font-medium text-xs sm:text-sm tracking-wide shadow-xs transition-all hover:shadow-md active:scale-[0.98]"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Phối Thử Ngay</span>
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden flex items-center justify-around py-2.5 border-t border-[#F7D6DE] bg-[#FFF5F7] text-xs">
        <button
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center gap-1 ${
            currentView === 'home' ? 'text-[#C84B69] font-bold' : 'text-[#78716C]'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>Trang chủ</span>
        </button>
        <button
          onClick={() => onNavigate('costumes')}
          className={`flex flex-col items-center gap-1 ${
            currentView === 'costumes' || currentView === 'costume-detail' ? 'text-[#C84B69] font-bold' : 'text-[#78716C]'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Cổ phục</span>
        </button>
        <button
          onClick={() => onNavigate('studio')}
          className={`flex flex-col items-center gap-1 ${
            currentView === 'studio' ? 'text-[#C84B69] font-bold' : 'text-[#78716C]'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Studio</span>
        </button>
        <button
          onClick={() => onNavigate('profile')}
          className={`flex flex-col items-center gap-1 relative ${
            currentView === 'profile' ? 'text-[#C84B69] font-bold' : 'text-[#78716C]'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Bộ sưu tập</span>
          {draftsCount > 0 && (
            <span className="absolute -top-1 -right-2 w-3.5 h-3.5 rounded-full bg-[#C84B69] text-white text-[9px] flex items-center justify-center font-bold">
              {draftsCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
