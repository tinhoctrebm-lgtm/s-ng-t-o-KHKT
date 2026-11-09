import { useState, useEffect } from 'react';
import { Place } from '../types/index.ts';
import { useAIAudio } from '../hooks/useAIAudio.ts';
import {
  X,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Languages,
  MapPin,
  Clock,
  Compass,
  Heart,
  Share2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Sparkles,
  Info,
  Navigation as NavigationIcon
} from 'lucide-react';
import { likePlace, recordListen } from '../services/api.ts';

interface PlaceDetailModalProps {
  place: Place | null;
  onClose: () => void;
  onPlaceUpdated?: (updated: Place) => void;
}

export function PlaceDetailModal({ place, onClose, onPlaceUpdated }: PlaceDetailModalProps) {
  if (!place) return null;

  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'culture' | 'experiences' | 'tips'>('overview');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(place.likes || 0);
  const [showCopiedNotice, setShowCopiedNotice] = useState(false);

  // All images: cover + gallery
  const allImages = [
    { url: place.coverImage, caption: `${place.name} - Ảnh đại diện` },
    ...(place.gallery || [])
  ];

  // Initialize AI Audio hook
  const {
    isPlaying,
    isPaused,
    language,
    gender,
    rate,
    volume,
    activeSentenceIndex,
    sentences,
    play,
    pause,
    resume,
    stop,
    replay,
    setLanguage,
    setGender,
    setRate,
    setVolume
  } = useAIAudio({
    vietnameseText: place.audioVietnamese?.text || place.overview,
    englishText: place.audioEnglish?.text || place.shortDesc,
    onStarted: () => {
      recordListen(place.id);
    }
  });

  // Stop audio on close
  const handleClose = () => {
    stop();
    onClose();
  };

  // Like action
  const handleLike = async () => {
    if (hasLiked) return;
    try {
      const res = await likePlace(place.id);
      setLikesCount(res.likes);
      setHasLiked(true);
      if (onPlaceUpdated) {
        onPlaceUpdated({ ...place, likes: res.likes });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Share link
  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setShowCopiedNotice(true);
      setTimeout(() => setShowCopiedNotice(false), 2000);
    }
  };

  // Switch image in gallery
  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % allImages.length);
  };
  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  // Keyboard navigation & escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white z-10">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 text-xs font-bold uppercase rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {place.category === 'sinh-thai' && '🌿 Sinh thái'}
              {place.category === 'lich-su-van-hoa' && '🏛️ Lịch sử - Văn hóa'}
              {place.category === 'tam-linh' && '🛕 Tâm linh'}
              {place.category === 'lang-nghe' && '🏺 Làng nghề gốm'}
            </span>
            <h2 className="text-lg sm:text-2xl font-bold truncate max-w-md sm:max-w-xl">
              {place.name}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                hasLiked
                  ? 'bg-rose-500 text-white'
                  : 'bg-white/10 hover:bg-white/20 text-rose-200'
              }`}
              title="Yêu thích địa điểm này"
            >
              <Heart className={`w-4 h-4 ${hasLiked ? 'fill-white' : ''}`} />
              <span>{likesCount}</span>
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Chia sẻ liên kết"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={handleClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-rose-600 text-white transition-colors"
              title="Đóng cửa sổ"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Copied toast notification */}
        {showCopiedNotice && (
          <div className="absolute top-16 right-6 z-20 bg-emerald-600 text-white text-xs px-3 py-1.5 rounded-lg shadow-lg">
            Đã sao chép liên kết vào bộ nhớ tạm!
          </div>
        )}

        {/* Scrollable Body */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-6">
          {/* Top Grid: Gallery & AI Audio Player */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Gallery Column (7 cols) */}
            <div className="lg:col-span-7 space-y-3">
              {/* Main Image Viewport */}
              <div className="relative h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden bg-slate-900 group shadow-md">
                <img
                  src={allImages[selectedImageIndex]?.url}
                  alt={allImages[selectedImageIndex]?.caption || place.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

                {/* Caption */}
                <div className="absolute bottom-3 left-4 right-4 text-white text-xs sm:text-sm font-medium drop-shadow">
                  {allImages[selectedImageIndex]?.caption}
                </div>

                {/* Left/Right Buttons */}
                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white hover:bg-black/70 transition-all backdrop-blur-sm"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white hover:bg-black/70 transition-all backdrop-blur-sm"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Badge image count */}
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-black/60 text-white text-xs font-semibold backdrop-blur-sm">
                  {selectedImageIndex + 1} / {allImages.length} ảnh
                </div>
              </div>

              {/* Thumbnails row */}
              {allImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                        selectedImageIndex === idx
                          ? 'border-emerald-600 scale-105 shadow-md'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img.url} alt={img.caption || ''} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* AI Audio Narration Panel (5 cols) */}
            <div className="lg:col-span-5 bg-gradient-to-br from-slate-50 via-emerald-50/40 to-teal-50/50 p-5 rounded-2xl border border-emerald-200/80 shadow-sm flex flex-col justify-between">
              <div>
                {/* Header of AI Player */}
                <div className="flex items-center justify-between pb-3 border-b border-emerald-200">
                  <div className="flex items-center gap-2">
                    <span className="p-2 bg-emerald-600 text-white rounded-xl shadow-md shadow-emerald-600/30">
                      <Volume2 className="w-5 h-5 animate-pulse" />
                    </span>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Thuyết Minh Tự Động AI</h4>
                      <p className="text-[11px] text-slate-500">Giọng nói thông minh chuẩn Unicode</p>
                    </div>
                  </div>

                  {/* Language switch */}
                  <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-sm text-xs font-semibold">
                    <button
                      onClick={() => setLanguage('vi')}
                      className={`px-2.5 py-1 rounded-lg transition-all ${
                        language === 'vi'
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Tiếng Việt
                    </button>
                    <button
                      onClick={() => setLanguage('en')}
                      className={`px-2.5 py-1 rounded-lg transition-all ${
                        language === 'en'
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      English
                    </button>
                  </div>
                </div>

                {/* Voice Gender & Settings */}
                <div className="flex items-center justify-between mt-3 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-slate-700">Chất giọng:</span>
                    <button
                      onClick={() => setGender('female')}
                      className={`px-2 py-0.5 rounded-md border text-[11px] font-medium transition-all ${
                        gender === 'female'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold'
                          : 'bg-white border-slate-200 text-slate-600'
                      }`}
                    >
                      Giọng Nữ
                    </button>
                    <button
                      onClick={() => setGender('male')}
                      className={`px-2 py-0.5 rounded-md border text-[11px] font-medium transition-all ${
                        gender === 'male'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold'
                          : 'bg-white border-slate-200 text-slate-600'
                      }`}
                    >
                      Giọng Nam
                    </button>
                  </div>

                  {/* Speed Rate */}
                  <div className="flex items-center gap-1">
                    <span className="text-[11px] text-slate-500">Tốc độ:</span>
                    <select
                      value={rate}
                      onChange={(e) => setRate(parseFloat(e.target.value))}
                      className="bg-white border border-slate-200 rounded px-1.5 py-0.5 text-[11px] font-semibold text-slate-700"
                    >
                      <option value="0.75">0.75x</option>
                      <option value="1.0">1.0x Chuẩn</option>
                      <option value="1.25">1.25x</option>
                      <option value="1.5">1.5x</option>
                    </select>
                  </div>
                </div>

                {/* Live Synchronized Highlighting Box */}
                <div className="mt-3 p-3 bg-white rounded-xl border border-slate-200 max-h-48 overflow-y-auto text-xs leading-relaxed text-slate-700 scrollbar-thin shadow-inner">
                  {sentences.map((sent, idx) => (
                    <span
                      key={idx}
                      onClick={() => play(idx)}
                      className={`cursor-pointer transition-all inline mr-1 rounded px-1 py-0.5 ${
                        activeSentenceIndex === idx
                          ? 'bg-emerald-200/90 text-emerald-950 font-bold shadow-sm ring-1 ring-emerald-400'
                          : 'hover:bg-slate-100'
                      }`}
                      title="Nhấn để nghe từ câu này"
                    >
                      {sent}{' '}
                    </span>
                  ))}
                </div>
              </div>

              {/* Audio Controls Bar */}
              <div className="mt-4 pt-3 border-t border-emerald-200 flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  {/* Play / Pause / Replay Buttons */}
                  <div className="flex items-center gap-2">
                    {!isPlaying ? (
                      <button
                        onClick={() => play(0)}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-600/30 transition-all hover:scale-105"
                      >
                        <Play className="w-4 h-4 fill-white" />
                        Nghe thuyết minh
                      </button>
                    ) : isPaused ? (
                      <button
                        onClick={resume}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-600/30 transition-all"
                      >
                        <Play className="w-4 h-4 fill-white" />
                        Tiếp tục
                      </button>
                    ) : (
                      <button
                        onClick={pause}
                        className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs shadow-md shadow-amber-600/30 transition-all"
                      >
                        <Pause className="w-4 h-4 fill-white" />
                        Tạm dừng
                      </button>
                    )}

                    <button
                      onClick={replay}
                      className="p-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-200 shadow-sm transition-colors"
                      title="Nghe lại từ đầu"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>

                    {isPlaying && (
                      <button
                        onClick={stop}
                        className="p-2 bg-white hover:bg-rose-50 text-rose-600 rounded-xl border border-slate-200 shadow-sm transition-colors"
                        title="Dừng hẳn"
                      >
                        <VolumeX className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Volume Slider */}
                  <div className="flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-slate-500" />
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={volume}
                      onChange={(e) => setVolume(parseFloat(e.target.value))}
                      className="w-16 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                      title={`Âm lượng: ${Math.round(volume * 100)}%`}
                    />
                  </div>
                </div>

                {/* Status indicator */}
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    {isPlaying
                      ? isPaused
                        ? 'Đang tạm dừng'
                        : `Đang phát câu ${activeSentenceIndex + 1}/${sentences.length}`
                      : 'Sẵn sàng thuyết minh'}
                  </span>
                  <span>{language === 'vi' ? place.audioVietnamese?.durationEstimate : place.audioEnglish?.durationEstimate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Location & Nav Row */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center gap-3">
              <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl">
                <MapPin className="w-5 h-5 flex-shrink-0" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-500">Địa chỉ cụ thể:</div>
                <div className="text-sm font-bold text-slate-900">{place.address}</div>
                <div className="text-xs text-slate-500">Khu vực: {place.district} | Tọa độ: {place.coordinates.lat.toFixed(4)}, {place.coordinates.lng.toFixed(4)}</div>
              </div>
            </div>

            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${place.coordinates.lat},${place.coordinates.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/30 transition-all flex-shrink-0"
            >
              <NavigationIcon className="w-4 h-4" />
              Chỉ đường bằng Google Maps
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Tab Navigation for Detailed Information */}
          <div>
            <div className="flex border-b border-slate-200 gap-2 sm:gap-4 overflow-x-auto pb-1 text-xs sm:text-sm font-semibold">
              {[
                { id: 'overview', label: '📖 Giới thiệu tổng quan' },
                { id: 'history', label: '⏳ Lịch sử hình thành' },
                { id: 'culture', label: '✨ Giá trị văn hóa - lịch sử' },
                { id: 'experiences', label: '🚣 Hoạt động trải nghiệm' },
                { id: 'tips', label: '🕒 Thời gian & Lưu ý' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`pb-3 px-2 border-b-2 whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? 'border-emerald-600 text-emerald-700 font-bold'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div className="pt-4 text-sm leading-relaxed text-slate-700">
              {activeTab === 'overview' && (
                <div className="space-y-3">
                  <p className="text-base text-slate-900 font-medium leading-relaxed">
                    {place.overview}
                  </p>
                  <p className="text-slate-600">{place.shortDesc}</p>
                </div>
              )}

              {activeTab === 'history' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                    <BookOpen className="w-4 h-4" />
                    Cội nguồn và các cột mốc lịch sử
                  </div>
                  <p className="whitespace-pre-line leading-relaxed">{place.history}</p>
                </div>
              )}

              {activeTab === 'culture' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                    <Sparkles className="w-4 h-4" />
                    Ý nghĩa văn hóa, tinh thần và di sản phương Nam
                  </div>
                  <p className="whitespace-pre-line leading-relaxed">{place.culturalValue}</p>
                </div>
              )}

              {activeTab === 'experiences' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                    <Compass className="w-4 h-4" />
                    Những trải nghiệm không thể bỏ lỡ tại điểm đến
                  </div>
                  <p className="whitespace-pre-line leading-relaxed">{place.experiences}</p>
                </div>
              )}

              {activeTab === 'tips' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                    <Clock className="w-4 h-4" />
                    Thời điểm tham quan phù hợp & Lời khuyên du lịch
                  </div>
                  <p className="whitespace-pre-line leading-relaxed">{place.suitableTime}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div>
            Lượt xem: <strong className="text-slate-800">{place.views}</strong> | Lượt yêu thích: <strong className="text-slate-800">{likesCount}</strong>
          </div>
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl transition-colors"
          >
            Đóng lại
          </button>
        </div>
      </div>
    </div>
  );
}
