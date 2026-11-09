import { Compass, MapPin, Mail, Phone, Award, Shield, ExternalLink, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenAdmin: () => void;
  onOpenProjectIntro: () => void;
}

export function Footer({ onNavigate, onOpenAdmin, onOpenProjectIntro }: FooterProps) {
  return (
    <footer className="bg-slate-900 text-white border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: Brand & Project */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-md">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-bold tracking-wider text-emerald-400 uppercase">
                  Vĩnh Long Tourism
                </div>
                <h3 className="font-extrabold text-sm text-white">DU LỊCH THÔNG MINH</h3>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Website du lịch thông minh Vĩnh Long tích hợp trí tuệ nhân tạo (AI) thuyết minh tự động, bản đồ số di tích và hệ thống quản trị dữ liệu thực tế.
            </p>
            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80 text-xs space-y-1">
              <div className="text-amber-400 font-bold flex items-center gap-1.5 text-[11px]">
                <Award className="w-3.5 h-3.5" /> Dự án KHKT cấp tỉnh
              </div>
              <div className="text-slate-300">Trường THCS và THPT Hoàng Thái Hiếu</div>
              <div className="text-slate-400 text-[11px]">
                Tác giả: <strong>Trần Nguyễn Quốc Thắng</strong> & <strong>Chung Phước Duyên</strong> (Lớp 9A8)
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-400">
              Khám Phá Nhanh
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <button onClick={() => onNavigate('hero')} className="hover:text-emerald-400 transition-colors">
                  Trang chủ
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('places')} className="hover:text-emerald-400 transition-colors">
                  Danh mục địa điểm nổi bật
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('map')} className="hover:text-emerald-400 transition-colors">
                  Bản đồ du lịch tương tác
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('news')} className="hover:text-emerald-400 transition-colors">
                  Tin tức & Lễ hội du lịch
                </button>
              </li>
              <li>
                <button onClick={onOpenProjectIntro} className="hover:text-emerald-400 transition-colors">
                  Giới thiệu dự án KHKT (Lớp 9A8)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Prominent Vĩnh Long Destinations */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-400">
              Điểm Đến Tiêu Biểu
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li>• Cù lao An Bình - Miệt vườn sinh thái</li>
              <li>• Đền thờ Chủ tịch HĐBT Phạm Hùng</li>
              <li>• Vương quốc gốm đỏ Mang Thít</li>
              <li>• Danh thắng Ao Bà Om & Chùa Âng</li>
              <li>• Khu du lịch sinh thái Vinh Sang</li>
              <li>• Văn Thánh Miếu Vĩnh Long</li>
              <li>• Khu lưu niệm Thủ tướng Võ Văn Kiệt</li>
            </ul>
          </div>

          {/* Col 4: Contact & Administration */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-400">
              Liên Hệ & Quản Trị
            </h4>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Trường THCS và THPT Hoàng Thái Hiếu, Tỉnh Vĩnh Long</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>vinhlongtour.smart@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Đường dây nóng hỗ trợ du lịch Vĩnh Long</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenAdmin}
                className="w-full py-2 px-3 bg-emerald-700/60 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border border-emerald-500/40"
              >
                <Shield className="w-3.5 h-3.5" />
                Đăng nhập Quản trị viên
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 DU LỊCH THÔNG MINH VĨNH LONG – SMART TOURISM VĨNH LONG. Bản quyền thuộc về Nhóm nghiên cứu KHKT Lớp 9A8.
          </div>
          <div className="flex items-center gap-1">
            <span>Thiết kế vì tình yêu quê hương Vĩnh Long</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </div>
        </div>
      </div>
    </footer>
  );
}
