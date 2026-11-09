import { X, Award, CheckCircle2, Cpu, Globe, Users, BookOpen, Layers } from 'lucide-react';

interface ProjectIntroModalProps {
  onClose: () => void;
}

export function ProjectIntroModal({ onClose }: ProjectIntroModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-300/30 flex items-center justify-center text-amber-300">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
                Hội Thi Sáng Tạo Khoa Học Kỹ Thuật Dành Cho Học Sinh THCS
              </span>
              <h2 className="text-lg sm:text-2xl font-black">
                DỰ ÁN: DU LỊCH THÔNG MINH VĨNH LONG
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
          {/* Team and School Box */}
          <div className="p-4 sm:p-5 bg-emerald-50 rounded-2xl border border-emerald-200 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="font-bold text-xs text-emerald-800 uppercase tracking-wide flex items-center gap-1.5">
                <Users className="w-4 h-4" /> Nhóm tác giả thực hiện:
              </div>
              <div className="text-sm sm:text-base font-extrabold text-slate-900">
                Trần Nguyễn Quốc Thắng & Chung Phước Duyên
              </div>
              <div className="text-xs text-slate-600 font-medium">
                Học sinh <strong>Lớp 9A8</strong>
              </div>
            </div>

            <div className="space-y-1">
              <div className="font-bold text-xs text-emerald-800 uppercase tracking-wide flex items-center gap-1.5">
                <Globe className="w-4 h-4" /> Đơn vị dự thi:
              </div>
              <div className="text-sm sm:text-base font-extrabold text-slate-900">
                Trường THCS và THPT Hoàng Thái Hiếu
              </div>
              <div className="text-xs text-slate-600 font-medium">
                Tham gia Hội thi Sáng tạo Khoa học Kỹ thuật cấp tỉnh
              </div>
            </div>
          </div>

          {/* Section: Project Purpose */}
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              1. Mục tiêu và Ý nghĩa của Đề tài
            </h3>
            <p>
              Vĩnh Long là vùng đất "địa linh nhân kiệt", giàu truyền thống cách mạng và văn hóa miệt vườn trù phú với các địa danh lịch sử nổi tiếng như Khu tưởng niệm Chủ tịch HĐBT Phạm Hùng, Khu lưu niệm Thủ tướng Võ Văn Kiệt, Văn Thánh Miếu, Danh thắng Ao Bà Om, Vương quốc đỏ Mang Thít và Cù lao An Bình.
            </p>
            <p>
              Dự án <strong>"Du Lịch Thông Minh Vĩnh Long – Smart Tourism Vĩnh Long"</strong> được nhóm nghiên cứu xây dựng nhằm ứng dụng chuyển đổi số và trí tuệ nhân tạo (AI) vào việc bảo tồn, giới thiệu và quảng bá nét đẹp quê hương đến khách du lịch trong và ngoài nước, cũng như phục vụ công tác học tập lịch sử địa phương cho học sinh các trường THCS và THPT.
            </p>
          </div>

          {/* Section: Technological Highlights */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-600" />
              2. Các Điểm Sáng Tạo và Tính Năng Nổi Bật
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5 text-emerald-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Thuyết minh AI thông minh (Text-to-Speech)
                </div>
                <div className="text-xs text-slate-600">
                  Phát âm tiếng Việt có dấu chuẩn Unicode và tiếng Anh, hỗ trợ chọn giọng đọc Nam/Nữ, điều chỉnh tốc độ, âm lượng và đồng bộ sáng từng câu (live highlighting) giúp du khách vừa nghe vừa theo dõi văn bản.
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5 text-blue-700">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  Bản đồ số tương tác & Chỉ đường Google Maps
                </div>
                <div className="text-xs text-slate-600">
                  Tích hợp bản đồ trực quan với tọa độ GPS chính xác cho từng địa điểm, lọc theo khu vực địa giới hành chính và hỗ trợ mở Google Maps dẫn đường trong tích tắc.
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5 text-purple-700">
                  <CheckCircle2 className="w-4 h-4 text-purple-600" />
                  Lưu trữ lâu dài & Cập nhật tức thời
                </div>
                <div className="text-xs text-slate-600">
                  Không sử dụng dữ liệu tĩnh hay mô phỏng cục bộ. Hệ thống backend Express và cơ sở dữ liệu máy chủ lưu trữ lâu dài. Khi Quản trị viên thêm/sửa địa điểm, trang chủ lập tức cập nhật thông tin mới.
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5 text-amber-700">
                  <CheckCircle2 className="w-4 h-4 text-amber-600" />
                  Phân quyền Quản trị viên (Admin CMS)
                </div>
                <div className="text-xs text-slate-600">
                  Trang quản trị bảo mật riêng biệt tại <code>/admin</code> với chức năng tải nhiều hình ảnh lên máy chủ, quản lý bài viết tin tức và thống kê thời gian thực số lượt nghe thuyết minh và lượt xem.
                </div>
              </div>
            </div>
          </div>

          {/* Section: Tech Stack */}
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              3. Công Nghệ Xây Dựng
            </h3>
            <div className="flex flex-wrap gap-2 pt-1 text-xs font-semibold">
              <span className="px-3 py-1 bg-slate-100 rounded-lg text-slate-800">React 19</span>
              <span className="px-3 py-1 bg-slate-100 rounded-lg text-slate-800">TypeScript</span>
              <span className="px-3 py-1 bg-slate-100 rounded-lg text-slate-800">Tailwind CSS</span>
              <span className="px-3 py-1 bg-slate-100 rounded-lg text-slate-800">Node.js Express</span>
              <span className="px-3 py-1 bg-slate-100 rounded-lg text-slate-800">Web Speech API / AI TTS</span>
              <span className="px-3 py-1 bg-slate-100 rounded-lg text-slate-800">Leaflet Maps & Google Maps</span>
              <span className="px-3 py-1 bg-slate-100 rounded-lg text-slate-800">Multer File Storage</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Trường THCS và THPT Hoàng Thái Hiếu • Năm học 2025 - 2026
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/30"
          >
            Đóng thông tin
          </button>
        </div>
      </div>
    </div>
  );
}
