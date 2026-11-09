import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Place, PlaceCategory } from '../types/index.ts';
import { Navigation, MapPin, Volume2, Search, Filter, Compass, ExternalLink } from 'lucide-react';

interface SmartMapProps {
  places: Place[];
  onSelectPlace: (place: Place) => void;
  onPlayAudioForPlace?: (place: Place) => void;
}

export function SmartMap({ places, onSelectPlace, onPlayAudioForPlace }: SmartMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');

  // Filtered places
  const filteredPlaces = places.filter(place => {
    const matchesCategory = selectedCategory === 'all' || place.category === selectedCategory;
    const matchesDistrict = selectedDistrict === 'all' || place.district.toLowerCase().includes(selectedDistrict.toLowerCase());
    const matchesQuery = !searchQuery.trim() ||
      place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.district.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesDistrict && matchesQuery;
  });

  // Extract unique districts
  const districts = Array.from(new Set(places.map(p => p.district.split(',')[0].trim())));

  // Get category color
  const getCategoryTheme = (category: PlaceCategory) => {
    switch (category) {
      case 'sinh-thai':
        return { bg: '#10b981', label: 'Sinh thái' };
      case 'lich-su-van-hoa':
        return { bg: '#3b82f6', label: 'Lịch sử - Văn hóa' };
      case 'tam-linh':
        return { bg: '#8b5cf6', label: 'Tâm linh' };
      case 'lang-nghe':
        return { bg: '#f97316', label: 'Làng nghề gốm' };
      default:
        return { bg: '#059669', label: 'Địa điểm' };
    }
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Vĩnh Long province center: 10.24°N, 105.97°E
      const map = L.map(mapContainerRef.current, {
        center: [10.23, 105.98],
        zoom: 11,
        zoomControl: true,
        scrollWheelZoom: true
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear old markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    // Add markers for filtered places
    filteredPlaces.forEach(place => {
      const theme = getCategoryTheme(place.category);

      // Custom SVG DivIcon
      const customIcon = L.divIcon({
        className: 'custom-map-marker',
        html: `
          <div style="
            background-color: ${theme.bg};
            width: 38px;
            height: 38px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            border: 3px solid white;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            cursor: pointer;
            transition: transform 0.2s ease;
          ">
            <div style="
              transform: rotate(45deg);
              color: white;
              font-size: 13px;
              font-weight: bold;
              display: flex;
              align-items: center;
              justify-content: center;
            ">
              ★
            </div>
          </div>
        `,
        iconSize: [38, 38],
        iconAnchor: [19, 38],
        popupAnchor: [0, -38]
      });

      const marker = L.marker([place.coordinates.lat, place.coordinates.lng], { icon: customIcon }).addTo(map);

      // Popup Content
      const popupHtml = `
        <div style="width: 250px; font-family: 'Be Vietnam Pro', sans-serif;">
          <img src="${place.coverImage}" alt="${place.name}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;" />
          <span style="font-size: 10px; font-weight: 600; text-transform: uppercase; color: ${theme.bg}; background: ${theme.bg}15; padding: 2px 6px; border-radius: 4px; display: inline-block; margin-bottom: 4px;">
            ${theme.label}
          </span>
          <h4 style="font-weight: 700; font-size: 14px; margin: 0 0 4px 0; color: #0f172a; line-height: 1.3;">
            ${place.name}
          </h4>
          <p style="font-size: 11px; color: #64748b; margin: 0 0 8px 0; line-height: 1.4;">
            📍 ${place.address}
          </p>
          <div style="display: flex; gap: 6px;">
            <button id="btn-view-${place.id}" style="flex: 1; background: #059669; color: white; border: none; padding: 6px 8px; border-radius: 6px; font-size: 11px; font-weight: 600; cursor: pointer;">
              Xem chi tiết
            </button>
            <a href="https://www.google.com/maps/dir/?api=1&destination=${place.coordinates.lat},${place.coordinates.lng}" target="_blank" rel="noopener noreferrer" style="background: #2563eb; color: white; border: none; padding: 6px 8px; border-radius: 6px; font-size: 11px; font-weight: 600; display: flex; align-items: center; justify-content: center; text-decoration: none;">
              Chỉ đường
            </a>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('popupopen', () => {
        const btnView = document.getElementById(`btn-view-${place.id}`);
        if (btnView) {
          btnView.onclick = () => {
            onSelectPlace(place);
          };
        }
      });

      markersRef.current.push(marker);
    });

    // Fit bounds if markers exist
    if (markersRef.current.length > 0 && mapInstanceRef.current) {
      const group = L.featureGroup(markersRef.current);
      mapInstanceRef.current.fitBounds(group.getBounds().pad(0.15));
      setTimeout(() => {
        mapInstanceRef.current?.invalidateSize();
      }, 250);
    }
  }, [filteredPlaces, onSelectPlace]);

  // Clean up
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      {/* Top Filter Bar */}
      <div className="p-4 sm:p-6 bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border-b border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm tracking-wide uppercase">
              <Compass className="w-5 h-5" />
              Bản đồ du lịch tương tác Vĩnh Long
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
              Khám Phá Tọa Độ & Chỉ Đường Thông Minh
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Chọn điểm đến trên bản đồ để xem hình ảnh, nghe thuyết minh AI và chỉ đường trực tiếp qua Google Maps.
            </p>
          </div>

          {/* Search box */}
          <div className="relative min-w-[240px] sm:min-w-[300px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm địa điểm, khu vực..."
              className="w-full pl-9 pr-4 py-2 bg-white rounded-xl text-sm border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Categories & Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-slate-200/80">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mr-2">
            <Filter className="w-3.5 h-3.5 text-emerald-600" />
            Phân loại:
          </div>
          {[
            { id: 'all', label: 'Tất cả (' + places.length + ')' },
            { id: 'sinh-thai', label: '🌿 Sinh thái' },
            { id: 'lich-su-van-hoa', label: '🏛️ Lịch sử - Văn hóa' },
            { id: 'tam-linh', label: '🛕 Tâm linh' },
            { id: 'lang-nghe', label: '🏺 Làng nghề gốm' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === tab.id
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30 font-semibold'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}

          {/* District Select */}
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-slate-500 hidden sm:inline">Khu vực:</span>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="px-2.5 py-1.5 bg-white text-xs rounded-lg border border-slate-200 text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="all">Toàn tỉnh Vĩnh Long</option>
              {districts.map((d, i) => (
                <option key={i} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Map Canvas */}
      <div className="relative">
        <div ref={mapContainerRef} className="w-full h-[520px] z-0" />

        {/* Floating Quick Legend */}
        <div className="absolute bottom-4 left-4 z-[400] bg-white/95 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-slate-200 text-xs hidden sm:block">
          <div className="font-bold text-slate-800 mb-1.5">Chú giải bản đồ:</div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
              <span className="text-slate-600">Sinh thái miệt vườn</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-blue-500 inline-block"></span>
              <span className="text-slate-600">Lịch sử - Văn hóa</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-purple-500 inline-block"></span>
              <span className="text-slate-600">Tâm linh - Tôn giáo</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
              <span className="text-slate-600">Làng nghề truyền thống</span>
            </div>
          </div>
        </div>

        {/* Found count indicator */}
        <div className="absolute top-4 right-4 z-[400] bg-slate-900/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg shadow text-xs font-medium">
          Hiển thị: <strong className="text-emerald-400">{filteredPlaces.length}</strong> địa điểm
        </div>
      </div>

      {/* Quick Place Bar at Bottom of Map */}
      <div className="p-4 bg-slate-50 border-t border-slate-200">
        <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Địa điểm gợi ý quanh khu vực ({filteredPlaces.length}):
        </div>
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {filteredPlaces.map(place => (
            <div
              key={place.id}
              onClick={() => onSelectPlace(place)}
              className="flex-shrink-0 flex items-center gap-2.5 p-2 bg-white rounded-xl border border-slate-200 hover:border-emerald-500 hover:shadow-md cursor-pointer transition-all w-64 group"
            >
              <img
                src={place.coverImage}
                alt={place.name}
                className="w-12 h-12 rounded-lg object-cover group-hover:scale-105 transition-transform"
              />
              <div className="overflow-hidden flex-1">
                <div className="font-semibold text-xs text-slate-900 truncate group-hover:text-emerald-700 transition-colors">
                  {place.name}
                </div>
                <div className="text-[11px] text-slate-500 truncate flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                  {place.district}
                </div>
                <div className="mt-1 flex items-center justify-between text-[10px]">
                  <span className="text-emerald-700 font-medium flex items-center gap-0.5">
                    <Volume2 className="w-3 h-3" /> Thuyết minh AI
                  </span>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${place.coordinates.lat},${place.coordinates.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-blue-600 hover:underline flex items-center gap-0.5"
                    title="Chỉ đường Google Maps"
                  >
                    Chỉ đường <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
