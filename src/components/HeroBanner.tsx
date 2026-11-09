import { useState } from 'react';
import {
  Compass,
  Volume2,
  Sparkles,
  MapPin,
  Search,
  BookOpen,
  ArrowRight,
  Award,
  Navigation
} from 'lucide-react';
import { PlaceCategory } from '../types/index.ts';

interface HeroBannerProps {
  onSearch: (q: string) => void;
  onSelectCategory: (cat: PlaceCategory | 'all') => void;
  activeCategory: string;
  onExploreClick: () => void;
  onOpenProjectIntro: () => void;
}

export function HeroBanner({
  onSearch,
  onSelectCategory,
  activeCategory,
  onExploreClick,
  onOpenProjectIntro
}: HeroBannerProps) {
  const [localQuery, setLocalQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(localQuery);
    onExploreClick();
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-teal-900 to-slate-900 text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      {/* Background Graphic Accents */}
      <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay">
        <img
          src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=2000&q=80"
          alt="Vĩnh Long scenery"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto text-center space-y-6">
        {/* Project Authors & School Badge */}
        <div
          onClick={onOpenProjectIntro}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-semibold cursor-pointer transition-all hover:scale-105 shadow-lg mx-auto"
        >
          <Award className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span className="text-emerald-300 font-bold">Dự án KHKT Trường THCS & THPT Hoàng Thái Hiếu</span>
          <span className="text-white/60 hidden sm:inline">•</span>
          <span className="text-white hidden sm:inline">
            Tác giả: <strong>Trần Nguyễn Quốc Thắng</strong> & <strong>Chung Phước Duyên</strong> (Lớp 9A8)
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-white/70" />
        </div>

        {/* Main Title */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            DU LỊCH THÔNG MINH <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-300 bg-clip-text text-transparent">
              VĨNH LONG – SMART TOURISM
            </span>
          </h1>
          <p className="text-sm sm:text-lg text-emerald-100/90 max-w-3xl mx-auto font-normal leading-relaxed">
            Hệ thống thuyết minh tự động bằng AI đa ngôn ngữ (Việt - Anh), bản đồ số tương tác và kho tư liệu lịch sử - văn hóa - sinh thái miệt vườn Vĩnh Long.
          </p>
        </div>

        {/* Search Bar in Hero */}
        <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto relative pt-2">
          <div className="relative flex items-center shadow-2xl rounded-2xl overflow-hidden bg-white/95 backdrop-blur-md p-1.5 border border-white/40">
            <Search className="w-5 h-5 text-slate-400 ml-3" />
            <input
              type="text"
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              placeholder="Nhập tên địa điểm du lịch (vd: Cù lao An Bình, Ao Bà Om, Vinh Sang...)"
              className="w-full px-3 py-3 text-slate-800 text-xs sm:text-sm placeholder-slate-400 focus:outline-none bg-transparent"
            />
            <button
              type="submit"
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all flex-shrink-0"
            >
              <Compass className="w-4 h-4" />
              <span>Khám phá ngay</span>
            </button>
          </div>
        </form>

        {/* Category Quick Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {[
            { id: 'all', label: 'Tất cả địa điểm' },
            { id: 'sinh-thai', label: '🌿 Sinh thái miệt vườn' },
            { id: 'lich-su-van-hoa', label: '🏛️ Lịch sử - Cách mạng' },
            { id: 'tam-linh', label: '🛕 Danh thắng - Tâm linh' },
            { id: 'lang-nghe', label: '🏺 Làng nghề gốm đỏ' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                onSelectCategory(cat.id as any);
                onExploreClick();
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeCategory === cat.id
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                  : 'bg-white/10 hover:bg-white/20 text-white/90 border border-white/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Feature Highlights Banner */}
        <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
          <div className="p-3 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 text-left">
            <Volume2 className="w-5 h-5 text-emerald-400 mb-1.5" />
            <div className="font-bold text-xs sm:text-sm">Thuyết minh AI</div>
            <div className="text-[11px] text-white/70">Song ngữ Tiếng Việt & Anh</div>
          </div>
          <div className="p-3 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 text-left">
            <Navigation className="w-5 h-5 text-blue-400 mb-1.5" />
            <div className="font-bold text-xs sm:text-sm">Bản đồ số thông minh</div>
            <div className="text-[11px] text-white/70">Chỉ đường GPS vệ tinh</div>
          </div>
          <div className="p-3 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 text-left">
            <BookOpen className="w-5 h-5 text-purple-400 mb-1.5" />
            <div className="font-bold text-xs sm:text-sm">Tư liệu lịch sử chuẩn</div>
            <div className="text-[11px] text-white/70">Di sản văn hóa Nam Bộ</div>
          </div>
          <div className="p-3 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 text-left">
            <Sparkles className="w-5 h-5 text-amber-400 mb-1.5" />
            <div className="font-bold text-xs sm:text-sm">Lưu trữ máy chủ thật</div>
            <div className="text-[11px] text-white/70">Cập nhật tức thời 24/7</div>
          </div>
        </div>
      </div>
    </div>
  );
}
