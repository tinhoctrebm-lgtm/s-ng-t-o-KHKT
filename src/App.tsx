import { useState, useEffect } from 'react';
import { Place, NewsItem, PlaceCategory } from './types/index.ts';
import { fetchPlaces, fetchNews, likePlace } from './services/api.ts';
import { Navbar } from './components/Navbar.tsx';
import { HeroBanner } from './components/HeroBanner.tsx';
import { SmartMap } from './components/SmartMap.tsx';
import { PlaceDetailModal } from './components/PlaceDetailModal.tsx';
import { NewsModal } from './components/NewsModal.tsx';
import { ProjectIntroModal } from './components/ProjectIntroModal.tsx';
import { AdminDashboard } from './components/AdminDashboard.tsx';
import { Footer } from './components/Footer.tsx';
import {
  Compass,
  MapPin,
  Volume2,
  Heart,
  Eye,
  ArrowRight,
  Sparkles,
  Newspaper,
  Calendar,
  Filter,
  CheckCircle2,
  Flame,
  Award
} from 'lucide-react';

export default function App() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Modals & Panels
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isProjectIntroOpen, setIsProjectIntroOpen] = useState<boolean>(false);

  // Browser history sync for /admin
  const handleOpenAdmin = () => {
    setIsAdminOpen(true);
    if (!window.location.pathname.startsWith('/admin')) {
      window.history.pushState({ admin: true }, '', '/admin');
    }
  };

  const handleCloseAdmin = () => {
    setIsAdminOpen(false);
    if (window.location.pathname.startsWith('/admin') || window.location.hash === '#admin') {
      window.history.pushState(null, '', '/');
    }
  };

  // Check URL path on mount & listen to browser popstate (back/forward)
  useEffect(() => {
    const checkRoute = () => {
      const isAdminRoute = window.location.pathname.startsWith('/admin') || window.location.hash === '#admin';
      setIsAdminOpen(isAdminRoute);
    };

    checkRoute();
    window.addEventListener('popstate', checkRoute);
    return () => window.removeEventListener('popstate', checkRoute);
  }, []);

  // Fetch initial data
  const loadData = async () => {
    try {
      setLoading(true);
      const [placesData, newsData] = await Promise.all([
        fetchPlaces(),
        fetchNews()
      ]);
      setPlaces(placesData);
      setNews(newsData);
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Không thể kết nối với máy chủ dữ liệu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered places
  const filteredPlaces = places.filter((place) => {
    const matchesCategory = selectedCategory === 'all' || place.category === selectedCategory;
    const matchesSearch = !searchQuery.trim() ||
      place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Featured and top liked places
  const featuredPlaces = places.filter(p => p.featured);
  const popularPlaces = [...places].sort((a, b) => (b.likes || 0) - (a.likes || 0)).slice(0, 4);

  // Smooth scroll
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Place update callback (e.g. likes)
  const handlePlaceUpdated = (updatedPlace: Place) => {
    setPlaces(prev => prev.map(p => p.id === updatedPlace.id ? updatedPlace : p));
    if (selectedPlace?.id === updatedPlace.id) {
      setSelectedPlace(updatedPlace);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-emerald-500 selection:text-white flex flex-col">
      {/* Top Navigation */}
      <Navbar
        onNavigate={scrollToSection}
        onOpenAdmin={handleOpenAdmin}
        onOpenProjectIntro={() => setIsProjectIntroOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Hero Banner Section */}
      <section id="hero">
        <HeroBanner
          onSearch={(q) => {
            setSearchQuery(q);
            scrollToSection('places');
          }}
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
            scrollToSection('places');
          }}
          activeCategory={selectedCategory}
          onExploreClick={() => scrollToSection('places')}
          onOpenProjectIntro={() => setIsProjectIntroOpen(true)}
        />
      </section>

      {/* Main Content Area */}
      <main className="flex-1 space-y-16 sm:space-y-24 py-12">
        {/* ========================================== */}
        {/* SECTION 1: KHÁM PHÁ ĐỊA ĐIỂM DU LỊCH        */}
        {/* ========================================== */}
        <section id="places" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold uppercase tracking-wider mb-2">
                <Compass className="w-3.5 h-3.5" /> Khám phá Vĩnh Long
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Danh Sách Địa Điểm Du Lịch Nổi Bật
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
                Khám phá các thắng cảnh sinh thái miệt vườn, di tích lịch sử cách mạng, ngôi chùa cổ kính và làng nghề truyền thống với thuyết minh giọng nói AI.
              </p>
            </div>

            {/* Category Filter Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs">
              {[
                { id: 'all', label: 'Tất cả' },
                { id: 'sinh-thai', label: '🌿 Sinh thái' },
                { id: 'lich-su-van-hoa', label: '🏛️ Lịch sử' },
                { id: 'tam-linh', label: '🛕 Tâm linh' },
                { id: 'lang-nghe', label: '🏺 Làng nghề' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedCategory === tab.id
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Places Grid */}
          {loading ? (
            <div className="text-center py-20 text-slate-500 font-medium text-sm">
              <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              Đang tải danh sách địa điểm du lịch...
            </div>
          ) : filteredPlaces.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 p-8">
              <Compass className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <h4 className="font-bold text-slate-700 text-base">Không tìm thấy địa điểm phù hợp</h4>
              <p className="text-xs text-slate-500 mt-1">
                Hãy thử tìm kiếm với từ khóa khác hoặc chuyển sang danh mục "Tất cả".
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow"
              >
                Đặt lại bộ lọc
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredPlaces.map((place) => (
                <div
                  key={place.id}
                  onClick={() => setSelectedPlace(place)}
                  className="group bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    {/* Image with Tag & AI Audio Badge */}
                    <div className="relative h-56 sm:h-64 overflow-hidden bg-slate-900">
                      <img
                        src={place.coverImage}
                        alt={place.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />

                      {/* Category Badge */}
                      <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-bold bg-white/90 text-slate-900 backdrop-blur-md shadow">
                        {place.category === 'sinh-thai' && '🌿 Sinh thái'}
                        {place.category === 'lich-su-van-hoa' && '🏛️ Lịch sử - Văn hóa'}
                        {place.category === 'tam-linh' && '🛕 Tâm linh'}
                        {place.category === 'lang-nghe' && '🏺 Làng nghề gốm'}
                      </span>

                      {/* AI Voice Badge */}
                      <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-600/90 text-white backdrop-blur-md flex items-center gap-1 shadow">
                        <Volume2 className="w-3 h-3" /> Thuyết minh AI
                      </span>

                      {/* Title over image */}
                      <div className="absolute bottom-3 left-4 right-4 text-white">
                        <h3 className="text-base sm:text-lg font-bold drop-shadow leading-snug group-hover:text-emerald-300 transition-colors">
                          {place.name}
                        </h3>
                        <div className="flex items-center gap-1 text-[11px] text-slate-200/90 mt-1">
                          <MapPin className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                          <span className="truncate">{place.district}</span>
                        </div>
                      </div>
                    </div>

                    {/* Short Description */}
                    <div className="p-5 space-y-3">
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                        {place.shortDesc}
                      </p>
                    </div>
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        {place.views?.toLocaleString('vi-VN')}
                      </span>
                      <span className="flex items-center gap-1 text-rose-500">
                        <Heart className="w-3.5 h-3.5 fill-rose-500" />
                        {place.likes}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPlace(place);
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white rounded-xl text-xs font-bold transition-all"
                    >
                      <span>Xem chi tiết</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ========================================== */}
        {/* SECTION 2: ĐỊA ĐIỂM ĐƯỢC YÊU THÍCH NHẤT    */}
        {/* ========================================== */}
        <section className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 py-16 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-extrabold uppercase tracking-wider mb-2 border border-amber-400/30">
                  <Flame className="w-3.5 h-3.5 text-amber-400" /> Điểm đến yêu thích
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Được Du Khách Bình Chọn Nhiều Nhất
                </h2>
                <p className="text-xs sm:text-sm text-emerald-100/80 mt-1 max-w-xl">
                  Những địa danh biểu tượng của quê hương Vĩnh Long được du khách trong và ngoài nước yêu thích, chia sẻ và lắng nghe thuyết minh nhiều nhất.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {popularPlaces.map((place, idx) => (
                <div
                  key={place.id}
                  onClick={() => setSelectedPlace(place)}
                  className="bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-2xl border border-white/20 p-3.5 cursor-pointer transition-all hover:scale-102 flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="relative h-40 rounded-xl overflow-hidden bg-slate-800">
                      <img src={place.coverImage} alt={place.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <div className="absolute top-2 left-2 w-7 h-7 rounded-full bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center shadow-md">
                        #{idx + 1}
                      </div>
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/60 text-[10px] text-white flex items-center gap-1 backdrop-blur-sm">
                        <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
                        {place.likes}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
                        {place.name}
                      </h4>
                      <p className="text-[11px] text-slate-300 line-clamp-2 mt-1">
                        {place.shortDesc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-emerald-300 font-semibold">
                    <span className="flex items-center gap-1">
                      <Volume2 className="w-3.5 h-3.5" />
                      Nghe AI
                    </span>
                    <span className="group-hover:translate-x-1 transition-transform">
                      Khám phá →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================== */}
        {/* SECTION 3: BẢN ĐỒ DU LỊCH THÔNG MINH       */}
        {/* ========================================== */}
        <section id="map" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SmartMap
            places={places}
            onSelectPlace={(place) => setSelectedPlace(place)}
          />
        </section>

        {/* ========================================== */}
        {/* SECTION 4: TIN TỨC & SỰ KIỆN DU LỊCH       */}
        {/* ========================================== */}
        <section id="news" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-extrabold uppercase tracking-wider mb-2">
                <Newspaper className="w-3.5 h-3.5" /> Bản tin văn hóa
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Tin Tức & Sự Kiện Du Lịch Vĩnh Long
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
                Cập nhật các chương trình ngày hội văn hóa, lễ hội truyền thống, tour sinh thái miệt vườn và các đề tài sáng tạo của học sinh.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {news.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedNews(item)}
                className="group bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 overflow-hidden bg-slate-900">
                    <img
                      src={item.coverImage}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold bg-blue-600 text-white shadow">
                      {item.category}
                    </div>
                  </div>

                  <div className="p-5 space-y-2.5">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(item.publishedAt).toLocaleDateString('vi-VN')}</span>
                      <span>•</span>
                      <span>{item.author}</span>
                    </div>

                    <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                      {item.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {item.summary}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600">
                  <span>Đọc tiếp nội dung</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================== */}
        {/* SECTION 5: THÔNG TIN DỰ ÁN KHKT HOÀNG THÁI HIẾU */}
        {/* ========================================== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 rounded-3xl text-white p-8 sm:p-12 shadow-xl relative overflow-hidden">
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/5 rounded-full blur-2xl pointer-events-none" />

            <div className="relative max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
                <Award className="w-4 h-4" /> Hội Thi Sáng Tạo Khoa Học Kỹ Thuật Dành Cho Học Sinh THCS
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                Dự Án Nghiên Cứu: Nền Tảng Du Lịch Thông Minh Vĩnh Long
              </h2>

              <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
                Được nghiên cứu và phát triển bởi hai học sinh <strong>Trần Nguyễn Quốc Thắng</strong> và <strong>Chung Phước Duyên</strong> (Lớp 9A8, Trường THCS và THPT Hoàng Thái Hiếu). Dự án hướng đến việc số hóa di sản, ứng dụng trí tuệ nhân tạo thuyết minh đa ngôn ngữ và quảng bá du lịch quê hương Vĩnh Long.
              </p>

              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  onClick={() => setIsProjectIntroOpen(true)}
                  className="px-6 py-3 bg-white text-emerald-900 hover:bg-emerald-50 rounded-2xl text-xs font-extrabold shadow-lg transition-all flex items-center gap-2"
                >
                  <span>Xem thuyết minh chi tiết đề tài</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={handleOpenAdmin}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-xs font-extrabold border border-white/20 transition-all"
                >
                  Đăng nhập trang quản trị (/admin)
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer
        onNavigate={scrollToSection}
        onOpenAdmin={handleOpenAdmin}
        onOpenProjectIntro={() => setIsProjectIntroOpen(true)}
      />

      {/* ========================================== */}
      {/* MODALS                                     */}
      {/* ========================================== */}

      {/* Place Detail Modal */}
      {selectedPlace && (
        <PlaceDetailModal
          place={selectedPlace}
          onClose={() => setSelectedPlace(null)}
          onPlaceUpdated={handlePlaceUpdated}
        />
      )}

      {/* News Detail Modal */}
      {selectedNews && (
        <NewsModal
          news={selectedNews}
          onClose={() => setSelectedNews(null)}
        />
      )}

      {/* Project KHKT Info Modal */}
      {isProjectIntroOpen && (
        <ProjectIntroModal
          onClose={() => setIsProjectIntroOpen(false)}
        />
      )}

      {/* Admin Dashboard */}
      {isAdminOpen && (
        <AdminDashboard
          onClose={handleCloseAdmin}
          onDataChanged={loadData}
        />
      )}
    </div>
  );
}
