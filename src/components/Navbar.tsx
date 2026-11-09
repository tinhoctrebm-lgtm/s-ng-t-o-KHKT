import { useState } from 'react';
import {
  Compass,
  MapPin,
  Newspaper,
  Info,
  Shield,
  Search,
  Menu,
  X,
  Volume2,
  Sparkles
} from 'lucide-react';

interface NavbarProps {
  onNavigate: (sectionId: string) => void;
  onOpenAdmin: () => void;
  onOpenProjectIntro: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function Navbar({
  onNavigate,
  onOpenAdmin,
  onOpenProjectIntro,
  searchQuery,
  onSearchChange
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'hero', label: 'Trang chủ' },
    { id: 'places', label: 'Khám phá' },
    { id: 'map', label: 'Bản đồ du lịch' },
    { id: 'news', label: 'Tin tức - Sự kiện' },
  ];

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Logo & Branding */}
          <div
            onClick={() => handleLinkClick('hero')}
            className="flex items-center gap-3 cursor-pointer group flex-shrink-0"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-600 to-blue-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/30 group-hover:scale-105 transition-transform">
              <Compass className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  Vĩnh Long
                </span>
                <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded-md hidden sm:inline-flex items-center gap-0.5">
                  <Sparkles className="w-2.5 h-2.5" /> AI Tourism
                </span>
              </div>
              <h1 className="font-extrabold text-sm sm:text-base text-slate-900 group-hover:text-emerald-700 transition-colors tracking-tight">
                DU LỊCH THÔNG MINH
              </h1>
            </div>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-xs mx-4">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Tìm địa danh, di tích..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-100 hover:bg-slate-200/70 focus:bg-white rounded-full text-xs border border-transparent focus:border-emerald-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className="px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 transition-all"
              >
                {link.label}
              </button>
            ))}

            <button
              onClick={onOpenProjectIntro}
              className="px-3 py-2 rounded-xl text-xs font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200/60 transition-all flex items-center gap-1.5"
            >
              <Info className="w-3.5 h-3.5" />
              Dự án KHKT (Lớp 9A8)
            </button>
          </nav>

          {/* Admin Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-emerald-800 text-white text-xs font-bold shadow-sm transition-all hover:scale-105"
            >
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Quản trị viên</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-200 space-y-3">
            {/* Mobile Search */}
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Tìm kiếm địa điểm du lịch..."
                className="w-full pl-9 pr-3 py-2 bg-slate-100 rounded-xl text-xs border border-transparent focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className="px-3 py-2.5 rounded-xl text-left text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                >
                  {link.label}
                </button>
              ))}

              <button
                onClick={() => {
                  onOpenProjectIntro();
                  setMobileMenuOpen(false);
                }}
                className="px-3 py-2.5 rounded-xl text-left text-xs font-bold text-teal-800 bg-teal-50 flex items-center gap-2"
              >
                <Info className="w-4 h-4" />
                Giới thiệu Dự án KHKT (Lớp 9A8)
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
