import { useState, useEffect } from 'react';
import { Place, NewsItem, User, DashboardStats, PlaceCategory } from '../types/index.ts';
import {
  fetchPlaces,
  createPlace,
  updatePlace,
  deletePlace,
  fetchNews,
  createNews,
  updateNews,
  deleteNews,
  fetchStats,
  login,
  changePassword,
  fetchUsers,
  createUser,
  uploadImage,
  uploadMultipleImages
} from '../services/api.ts';
import {
  LayoutDashboard,
  MapPin,
  Newspaper,
  Image as ImageIcon,
  Users,
  Settings,
  Plus,
  Trash2,
  Edit,
  Eye,
  LogOut,
  Save,
  Upload,
  CheckCircle,
  AlertCircle,
  KeyRound,
  ShieldCheck,
  TrendingUp,
  Volume2,
  X,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

interface AdminDashboardProps {
  onClose: () => void;
  onDataChanged: () => void;
}

export function AdminDashboard({ onClose, onDataChanged }: AdminDashboardProps) {
  // Auth state
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('vinhlong_admin_token'));
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('vinhlong_admin_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Login form state
  const [loginUsername, setLoginUsername] = useState('admin');
  const [loginPassword, setLoginPassword] = useState('vinhlong2026!');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Active tab in Admin
  const [adminTab, setAdminTab] = useState<'overview' | 'places' | 'news' | 'gallery' | 'users' | 'settings'>('overview');

  // Data states
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Place form state (Modal for add/edit)
  const [editingPlace, setEditingPlace] = useState<Partial<Place> | null>(null);
  const [isPlaceModalOpen, setIsPlaceModalOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // News form state
  const [editingNews, setEditingNews] = useState<Partial<NewsItem> | null>(null);
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);

  // Password change state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Add user state
  const [newUsername, setNewUsername] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserFullName, setNewUserFullName] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState<'admin' | 'editor'>('admin');

  // Auto clear feedback after 4 seconds
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  // Load dashboard data if logged in
  const loadDashboardData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [s, p, n] = await Promise.all([
        fetchStats(),
        fetchPlaces(),
        fetchNews()
      ]);
      setStats(s);
      setPlaces(p);
      setNews(n);

      if (currentUser?.role === 'admin') {
        const u = await fetchUsers(token);
        setUsersList(u);
      }
    } catch (err: any) {
      console.error(err);
      setFeedback({ type: 'error', message: err.message || 'Lỗi khi tải dữ liệu quản trị.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadDashboardData();
    }
  }, [token]);

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    try {
      const res = await login(loginUsername, loginPassword);
      setToken(res.token);
      setCurrentUser(res.user);
      localStorage.setItem('vinhlong_admin_token', res.token);
      localStorage.setItem('vinhlong_admin_user', JSON.stringify(res.user));
      setFeedback({ type: 'success', message: `Chào mừng ${res.user.fullName} đã đăng nhập thành công!` });
    } catch (err: any) {
      setLoginError(err.message || 'Tên đăng nhập hoặc mật khẩu không chính xác.');
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    setToken(null);
    setCurrentUser(null);
    localStorage.removeItem('vinhlong_admin_token');
    localStorage.removeItem('vinhlong_admin_user');
    setFeedback({ type: 'success', message: 'Đã đăng xuất an toàn khỏi hệ thống.' });
  };

  // ==========================================
  // PLACE ACTIONS
  // ==========================================
  const handleOpenAddPlace = () => {
    setEditingPlace({
      name: '',
      slug: '',
      category: 'sinh-thai',
      district: 'Huyện Long Hồ, Vĩnh Long',
      address: '',
      coordinates: { lat: 10.25, lng: 105.97 },
      coverImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
      gallery: [],
      shortDesc: '',
      overview: '',
      history: '',
      culturalValue: '',
      experiences: '',
      suitableTime: 'Quanh năm, đẹp nhất từ tháng 5 đến tháng 9',
      audioVietnamese: { text: '', durationEstimate: '1 phút 30 giây' },
      audioEnglish: { text: '', durationEstimate: '1 phút 15 giây' },
      featured: false
    });
    setIsPlaceModalOpen(true);
  };

  const handleOpenEditPlace = (place: Place) => {
    setEditingPlace({ ...place });
    setIsPlaceModalOpen(true);
  };

  const handleSavePlace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !editingPlace) return;

    if (!editingPlace.name || !editingPlace.shortDesc) {
      setFeedback({ type: 'error', message: 'Vui lòng nhập tên địa điểm và mô tả ngắn.' });
      return;
    }

    try {
      if (editingPlace.id) {
        await updatePlace(editingPlace.id, editingPlace, token);
        setFeedback({ type: 'success', message: `Đã cập nhật thành công: ${editingPlace.name}` });
      } else {
        await createPlace(editingPlace, token);
        setFeedback({ type: 'success', message: `Đã thêm địa điểm mới: ${editingPlace.name}` });
      }
      setIsPlaceModalOpen(false);
      setEditingPlace(null);
      await loadDashboardData();
      onDataChanged();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Lỗi khi lưu thông tin địa điểm.' });
    }
  };

  const handleDeletePlace = async (id: string, name: string) => {
    if (!token) return;
    if (!window.confirm(`Bạn có chắc chắn muốn xóa địa điểm "${name}" không? Thao tác này không thể hoàn tác.`)) {
      return;
    }

    try {
      await deletePlace(id, token);
      setFeedback({ type: 'success', message: `Đã xóa thành công địa điểm "${name}".` });
      await loadDashboardData();
      onDataChanged();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Lỗi khi xóa địa điểm.' });
    }
  };

  // Image Upload handler for Place Cover
  const handleUploadCover = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!token || !e.target.files || e.target.files.length === 0) return;
    setUploadingImage(true);
    try {
      const res = await uploadImage(e.target.files[0], token);
      setEditingPlace(prev => prev ? { ...prev, coverImage: res.url } : null);
      setFeedback({ type: 'success', message: 'Đã tải ảnh đại diện lên thành công!' });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Lỗi khi tải ảnh lên.' });
    } finally {
      setUploadingImage(false);
    }
  };

  // Multi Image Upload handler for Place Gallery
  const handleUploadGallery = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!token || !e.target.files || e.target.files.length === 0) return;
    setUploadingImage(true);
    try {
      const res = await uploadMultipleImages(e.target.files, token);
      const newItems = res.files.map(f => ({ url: f.url, caption: 'Hình ảnh thực tế' }));
      setEditingPlace(prev => prev ? {
        ...prev,
        gallery: [...(prev.gallery || []), ...newItems]
      } : null);
      setFeedback({ type: 'success', message: `Đã tải lên ${res.files.length} ảnh vào bộ sưu tập!` });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Lỗi khi tải nhiều ảnh.' });
    } finally {
      setUploadingImage(false);
    }
  };

  // ==========================================
  // NEWS ACTIONS
  // ==========================================
  const handleOpenAddNews = () => {
    setEditingNews({
      title: '',
      slug: '',
      summary: '',
      content: '',
      coverImage: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
      author: currentUser?.fullName || 'Ban Quản trị',
      category: 'Sự kiện du lịch',
      status: 'published'
    });
    setIsNewsModalOpen(true);
  };

  const handleOpenEditNews = (item: NewsItem) => {
    setEditingNews({ ...item });
    setIsNewsModalOpen(true);
  };

  const handleSaveNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !editingNews) return;

    if (!editingNews.title || !editingNews.content) {
      setFeedback({ type: 'error', message: 'Vui lòng nhập tiêu đề và nội dung bài viết.' });
      return;
    }

    try {
      if (editingNews.id) {
        await updateNews(editingNews.id, editingNews, token);
        setFeedback({ type: 'success', message: `Đã cập nhật bài viết: ${editingNews.title}` });
      } else {
        await createNews(editingNews, token);
        setFeedback({ type: 'success', message: `Đã đăng bài viết mới: ${editingNews.title}` });
      }
      setIsNewsModalOpen(false);
      setEditingNews(null);
      await loadDashboardData();
      onDataChanged();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Lỗi khi lưu bài viết.' });
    }
  };

  const handleDeleteNews = async (id: string, title: string) => {
    if (!token) return;
    if (!window.confirm(`Bạn có chắc chắn muốn xóa bài viết "${title}" không?`)) return;

    try {
      await deleteNews(id, token);
      setFeedback({ type: 'success', message: 'Đã xóa bài viết thành công.' });
      await loadDashboardData();
      onDataChanged();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Lỗi khi xóa bài viết.' });
    }
  };

  // ==========================================
  // ACCOUNT ACTIONS
  // ==========================================
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (newPassword !== confirmPassword) {
      setFeedback({ type: 'error', message: 'Mật khẩu xác nhận không khớp.' });
      return;
    }
    try {
      await changePassword(oldPassword, newPassword, token);
      setFeedback({ type: 'success', message: 'Đổi mật khẩu thành công!' });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Không thể đổi mật khẩu.' });
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      await createUser({
        username: newUsername,
        email: newUserEmail,
        fullName: newUserFullName,
        password: newUserPassword,
        role: newUserRole
      }, token);
      setFeedback({ type: 'success', message: `Đã thêm tài khoản "${newUsername}" thành công!` });
      setNewUsername('');
      setNewUserEmail('');
      setNewUserFullName('');
      setNewUserPassword('');
      await loadDashboardData();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Lỗi khi tạo tài khoản.' });
    }
  };

  // If NOT logged in, show Login Form
  if (!token) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-emerald-800 to-teal-800 text-white text-center relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-white/80 hover:text-white rounded-xl hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-3 backdrop-blur-sm border border-white/20">
              <ShieldCheck className="w-8 h-8 text-emerald-300" />
            </div>
            <h3 className="text-xl font-bold">Hệ Thống Quản Trị Viên</h3>
            <p className="text-xs text-emerald-100/90 mt-1">
              Smart Tourism Vĩnh Long – Quản trị cơ sở dữ liệu
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="p-6 space-y-4">
            {loginError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Tên đăng nhập hoặc Email
              </label>
              <input
                type="text"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="admin hoặc admin@vinhlongtour.vn"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Mật khẩu quản trị
              </label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-[11px] text-emerald-800 space-y-1">
              <div className="font-bold flex items-center gap-1">
                <KeyRound className="w-3.5 h-3.5" /> Thông tin tài khoản mặc định:
              </div>
              <div>• Tên đăng nhập: <code className="font-mono font-bold bg-white px-1 rounded">admin</code></div>
              <div>• Mật khẩu: <code className="font-mono font-bold bg-white px-1 rounded">vinhlong2026!</code></div>
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={loginLoading}
                className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition-all flex items-center justify-center gap-1.5"
              >
                {loginLoading ? 'Đang xác thực...' : 'Đăng nhập Admin'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // LOGGED IN DASHBOARD
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 bg-slate-900/80 backdrop-blur-md overflow-hidden">
      <div className="w-full max-w-7xl h-[95vh] bg-slate-100 rounded-3xl shadow-2xl border border-slate-300 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <div className="px-6 py-3.5 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white flex items-center justify-between z-10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base">Trang Quản Trị Hệ Thống – Smart Tourism Vĩnh Long</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-white uppercase">
                  {currentUser?.role === 'admin' ? 'Quản Trị Viên' : 'Biên Tập Viên'}
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                Đang đăng nhập: <strong>{currentUser?.fullName}</strong> ({currentUser?.email})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadDashboardData}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Làm mới dữ liệu"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-semibold transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Đăng xuất
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Quay lại giao diện người dùng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Global Feedback Banner */}
        {feedback && (
          <div
            className={`px-6 py-2.5 text-xs font-medium flex items-center justify-between ${
              feedback.type === 'success'
                ? 'bg-emerald-600 text-white'
                : 'bg-rose-600 text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              {feedback.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              <span>{feedback.message}</span>
            </div>
            <button onClick={() => setFeedback(null)} className="text-white/80 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Main Body with Sidebar + Workspace */}
        <div className="flex-1 flex flex-col sm:flex-row overflow-hidden">
          {/* Sidebar / Mobile Nav Bar */}
          <aside className="w-full sm:w-60 bg-white border-b sm:border-b-0 sm:border-r border-slate-200 flex flex-row sm:flex-col justify-between p-2 sm:p-3 flex-shrink-0 overflow-x-auto sm:overflow-x-visible">
            <nav className="flex flex-row sm:flex-col gap-1 sm:space-y-1 w-full overflow-x-auto sm:overflow-x-visible pb-1 sm:pb-0 scrollbar-none">
              {[
                { id: 'overview', label: 'Tổng quan', icon: LayoutDashboard },
                { id: 'places', label: 'Quản lý địa điểm', icon: MapPin, count: places.length },
                { id: 'news', label: 'Tin tức & Sự kiện', icon: Newspaper, count: news.length },
                { id: 'gallery', label: 'Kho ảnh', icon: ImageIcon },
                ...(currentUser?.role === 'admin'
                  ? [{ id: 'users', label: 'Tài khoản', icon: Users, count: usersList.length }]
                  : []),
                { id: 'settings', label: 'Bảo mật', icon: KeyRound }
              ].map((item) => {
                const Icon = item.icon;
                const active = adminTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setAdminTab(item.id as any)}
                    className={`whitespace-nowrap flex-shrink-0 sm:w-full flex items-center justify-between px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      active
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span>{item.label}</span>
                    </div>
                    {item.count !== undefined && (
                      <span
                        className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                          active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Quick System Info in Sidebar */}
            <div className="hidden sm:block p-3 bg-slate-50 rounded-2xl border border-slate-200 text-[11px] text-slate-500 space-y-1">
              <div className="font-bold text-slate-700">Dữ liệu lưu trữ:</div>
              <div>• Trạng thái: <span className="text-emerald-600 font-bold">Hoạt động (Real)</span></div>
              <div>• Phương thức: File JSON Server + Multi-file Uploads</div>
              <div className="text-[10px] text-slate-400 mt-2">Dự án KHKT Trường THCS & THPT Hoàng Thái Hiếu</div>
            </div>
          </aside>

          {/* Workspace Area */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50">
            {/* TAB 1: OVERVIEW */}
            {adminTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Bảng Điều Khiển Tổng Quan</h3>
                  <p className="text-xs text-slate-500">Số liệu thống kê thời gian thực từ hệ thống du lịch thông minh</p>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                      <span>Địa điểm du lịch</span>
                      <MapPin className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="text-2xl font-black text-slate-900 mt-2">
                      {stats?.totalPlaces || places.length}
                    </div>
                    <div className="text-[11px] text-emerald-600 font-medium mt-1">Đã kiểm duyệt</div>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                      <span>Hình ảnh di sản</span>
                      <ImageIcon className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="text-2xl font-black text-slate-900 mt-2">
                      {stats?.totalImages || 0}
                    </div>
                    <div className="text-[11px] text-blue-600 font-medium mt-1">Lưu trữ máy chủ</div>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                      <span>Tin tức bài viết</span>
                      <Newspaper className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="text-2xl font-black text-slate-900 mt-2">
                      {stats?.totalNews || news.length}
                    </div>
                    <div className="text-[11px] text-purple-600 font-medium mt-1">Đã xuất bản</div>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                      <span>Lượt truy cập</span>
                      <TrendingUp className="w-4 h-4 text-amber-600" />
                    </div>
                    <div className="text-2xl font-black text-slate-900 mt-2">
                      {stats?.totalViews?.toLocaleString('vi-VN') || 0}
                    </div>
                    <div className="text-[11px] text-amber-600 font-medium mt-1">Lượt xem chi tiết</div>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm col-span-2 lg:col-span-1">
                    <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                      <span>Lượt nghe AI</span>
                      <Volume2 className="w-4 h-4 text-rose-600" />
                    </div>
                    <div className="text-2xl font-black text-slate-900 mt-2">
                      {stats?.totalAudioListens?.toLocaleString('vi-VN') || 0}
                    </div>
                    <div className="text-[11px] text-rose-600 font-medium mt-1">Thuyết minh tự động</div>
                  </div>
                </div>

                {/* Quick Actions Bar */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                  <h4 className="font-bold text-sm text-slate-800">Thao tác nhanh cho Quản trị viên:</h4>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={handleOpenAddPlace}
                      className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/30 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      Thêm địa điểm du lịch mới
                    </button>
                    <button
                      onClick={handleOpenAddNews}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/30 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      Đăng bài viết / Tin tức mới
                    </button>
                    <button
                      onClick={() => setAdminTab('gallery')}
                      className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-all"
                    >
                      <Upload className="w-4 h-4" />
                      Tải lên hình ảnh di sản
                    </button>
                  </div>
                </div>

                {/* Recent Places List */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-slate-800">Danh sách địa điểm du lịch gần đây ({places.length})</h4>
                    <button
                      onClick={() => setAdminTab('places')}
                      className="text-xs font-bold text-emerald-600 hover:underline"
                    >
                      Xem tất cả →
                    </button>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {places.slice(0, 5).map((place) => (
                      <div key={place.id} className="py-3 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <img src={place.coverImage} alt={place.name} className="w-12 h-12 rounded-xl object-cover" />
                          <div>
                            <div className="font-bold text-xs text-slate-900">{place.name}</div>
                            <div className="text-[11px] text-slate-500">{place.address}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenEditPlace(place)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="Chỉnh sửa"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeletePlace(place.id, place.name)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
                            title="Xóa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: PLACES MANAGEMENT */}
            {adminTab === 'places' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Quản Lý Địa Điểm Du Lịch</h3>
                    <p className="text-xs text-slate-500">Thêm mới, cập nhật nội dung lịch sử, văn hóa, tọa độ và thuyết minh giọng đọc AI</p>
                  </div>
                  <button
                    onClick={handleOpenAddPlace}
                    className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/30 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    Thêm địa điểm mới
                  </button>
                </div>

                {/* Table of Places */}
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-600 uppercase font-bold border-b border-slate-200">
                        <tr>
                          <th className="p-3.5">Hình ảnh</th>
                          <th className="p-3.5">Tên địa điểm</th>
                          <th className="p-3.5">Phân loại</th>
                          <th className="p-3.5">Khu vực / Tọa độ</th>
                          <th className="p-3.5">Thuyết minh AI</th>
                          <th className="p-3.5">Lượt xem</th>
                          <th className="p-3.5 text-right">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {places.map((place) => (
                          <tr key={place.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="p-3.5">
                              <img src={place.coverImage} alt={place.name} className="w-14 h-11 object-cover rounded-lg shadow-sm" />
                            </td>
                            <td className="p-3.5">
                              <div className="font-bold text-slate-900">{place.name}</div>
                              <div className="text-[11px] text-slate-500 line-clamp-1">{place.shortDesc}</div>
                            </td>
                            <td className="p-3.5">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                                {place.category}
                              </span>
                            </td>
                            <td className="p-3.5">
                              <div className="font-medium text-slate-700">{place.district}</div>
                              <div className="text-[10px] text-slate-400 font-mono">
                                {place.coordinates.lat.toFixed(4)}, {place.coordinates.lng.toFixed(4)}
                              </div>
                            </td>
                            <td className="p-3.5">
                              <div className="flex items-center gap-1 text-emerald-700 font-medium">
                                <Volume2 className="w-3.5 h-3.5" />
                                <span>{place.audioVietnamese?.durationEstimate || 'Đã có giọng đọc'}</span>
                              </div>
                            </td>
                            <td className="p-3.5 font-bold text-slate-800">
                              {place.views?.toLocaleString('vi-VN')}
                            </td>
                            <td className="p-3.5 text-right space-x-1 whitespace-nowrap">
                              <button
                                onClick={() => handleOpenEditPlace(place)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Chỉnh sửa chi tiết"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeletePlace(place.id, place.name)}
                                className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                title="Xóa địa điểm"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: NEWS MANAGEMENT */}
            {adminTab === 'news' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Quản Lý Tin Tức & Sự Kiện Du Lịch</h3>
                    <p className="text-xs text-slate-500">Đăng tải thông tin ngày hội du lịch, sự kiện văn hóa và thông tin dự án KHKT</p>
                  </div>
                  <button
                    onClick={handleOpenAddNews}
                    className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/30 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    Đăng tin mới
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {news.map((item) => (
                    <div key={item.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between">
                      <div>
                        <img src={item.coverImage} alt={item.title} className="w-full h-44 object-cover" />
                        <div className="p-4 space-y-2">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="px-2 py-0.5 rounded-full font-bold bg-blue-50 text-blue-700">
                              {item.category}
                            </span>
                            <span className="text-slate-400">
                              {new Date(item.publishedAt).toLocaleDateString('vi-VN')}
                            </span>
                          </div>
                          <h4 className="font-bold text-sm text-slate-900 line-clamp-2">{item.title}</h4>
                          <p className="text-xs text-slate-600 line-clamp-3">{item.summary}</p>
                        </div>
                      </div>

                      <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-medium">Bởi: {item.author}</span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleOpenEditNews(item)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="Sửa"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteNews(item.id, item.title)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
                            title="Xóa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: GALLERY MANAGEMENT */}
            {adminTab === 'gallery' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Kho Lưu Trữ Hình Ảnh Du Lịch Vĩnh Long</h3>
                  <p className="text-xs text-slate-500">Tải nhiều ảnh trực tuyến lên máy chủ để sử dụng cho các địa điểm di tích</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
                  <div className="max-w-md mx-auto space-y-3">
                    <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto text-emerald-600">
                      <Upload className="w-8 h-8" />
                    </div>
                    <h4 className="font-bold text-slate-800 text-sm">Tải lên nhiều hình ảnh cùng lúc</h4>
                    <p className="text-xs text-slate-500">
                      Hỗ trợ định dạng JPG, PNG, WEBP. Ảnh được lưu trữ trực tiếp trên máy chủ lâu dài.
                    </p>
                    <label className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer shadow-md shadow-emerald-600/30 transition-all">
                      <Upload className="w-4 h-4" />
                      {uploadingImage ? 'Đang tải lên...' : 'Chọn các file ảnh để tải lên'}
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleUploadGallery}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* All images in system */}
                <div className="space-y-3">
                  <h4 className="font-bold text-sm text-slate-800">Tất cả hình ảnh đang được sử dụng ({places.reduce((s, p) => s + p.gallery.length + 1, 0)} ảnh)</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {places.flatMap((p) => [
                      { url: p.coverImage, name: `${p.name} (Ảnh bìa)` },
                      ...p.gallery.map(g => ({ url: g.url, name: `${p.name} - ${g.caption || 'Chi tiết'}` }))
                    ]).map((img, idx) => (
                      <div key={idx} className="group relative rounded-xl overflow-hidden bg-slate-900 border border-slate-200 aspect-square">
                        <img src={img.url} alt={img.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-between text-white text-[10px]">
                          <span className="line-clamp-2">{img.name}</span>
                          <a
                            href={img.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-400 hover:underline flex items-center gap-1"
                          >
                            Xem ảnh gốc <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: USERS & RBAC (Admin only) */}
            {adminTab === 'users' && currentUser?.role === 'admin' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Phân Quyền & Quản Lý Tài Khoản</h3>
                  <p className="text-xs text-slate-500">Quản lý danh sách tài khoản quản trị viên và biên tập viên</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Create New Admin User Form */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <h4 className="font-bold text-sm text-slate-800">Thêm tài khoản quản trị mới</h4>
                    <form onSubmit={handleCreateUser} className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Tên đăng nhập</label>
                        <input
                          type="text"
                          value={newUsername}
                          onChange={(e) => setNewUsername(e.target.value)}
                          required
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          placeholder="vd: giaovien_thcs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Họ và tên</label>
                        <input
                          type="text"
                          value={newUserFullName}
                          onChange={(e) => setNewUserFullName(e.target.value)}
                          required
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          placeholder="vd: Thầy Nguyễn Văn A"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
                        <input
                          type="email"
                          value={newUserEmail}
                          onChange={(e) => setNewUserEmail(e.target.value)}
                          required
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          placeholder="email@hoangthaihieu.edu.vn"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Mật khẩu</label>
                        <input
                          type="password"
                          value={newUserPassword}
                          onChange={(e) => setNewUserPassword(e.target.value)}
                          required
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          placeholder="Ít nhất 6 ký tự"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Vai trò</label>
                        <select
                          value={newUserRole}
                          onChange={(e) => setNewUserRole(e.target.value as any)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        >
                          <option value="admin">Quản trị viên (Toàn quyền)</option>
                          <option value="editor">Biên tập viên (Soạn bài)</option>
                        </select>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/30 transition-all mt-2"
                      >
                        Tạo tài khoản mới
                      </button>
                    </form>
                  </div>

                  {/* Users List */}
                  <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                    <h4 className="font-bold text-sm text-slate-800">Danh sách tài khoản ({usersList.length})</h4>
                    <div className="divide-y divide-slate-100">
                      {usersList.map((u) => (
                        <div key={u.id} className="py-3 flex items-center justify-between">
                          <div>
                            <div className="font-bold text-xs text-slate-900">{u.fullName}</div>
                            <div className="text-[11px] text-slate-500">
                              @{u.username} • {u.email}
                            </div>
                          </div>
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                              u.role === 'admin'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {u.role === 'admin' ? 'Quản trị viên' : 'Biên tập viên'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: SETTINGS & CHANGE PASSWORD */}
            {adminTab === 'settings' && (
              <div className="space-y-6 max-w-xl">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Bảo Mật & Đổi Mật Khẩu</h3>
                  <p className="text-xs text-slate-500">Thay đổi mật khẩu cho tài khoản {currentUser?.username}</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Mật khẩu hiện tại</label>
                      <input
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Mật khẩu mới (ít nhất 6 ký tự)</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Xác nhận mật khẩu mới</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/30 transition-all"
                    >
                      Cập nhật mật khẩu mới
                    </button>
                  </form>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ========================================== */}
      {/* PLACE EDIT/ADD MODAL                       */}
      {/* ========================================== */}
      {isPlaceModalOpen && editingPlace && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
            <div className="px-6 py-4 bg-emerald-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-base sm:text-lg">
                {editingPlace.id ? `Chỉnh sửa: ${editingPlace.name}` : 'Thêm Địa Điểm Du Lịch Mới'}
              </h3>
              <button
                onClick={() => setIsPlaceModalOpen(false)}
                className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePlace} className="overflow-y-auto p-6 space-y-4 flex-1 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tên địa điểm *</label>
                  <input
                    type="text"
                    value={editingPlace.name || ''}
                    onChange={(e) => setEditingPlace({ ...editingPlace, name: e.target.value })}
                    required
                    placeholder="vd: Cù lao An Bình"
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phân loại danh mục</label>
                  <select
                    value={editingPlace.category || 'sinh-thai'}
                    onChange={(e) => setEditingPlace({ ...editingPlace, category: e.target.value as PlaceCategory })}
                    className="w-full px-3 py-2 border rounded-xl"
                  >
                    <option value="sinh-thai">🌿 Sinh thái miệt vườn</option>
                    <option value="lich-su-van-hoa">🏛️ Lịch sử - Văn hóa</option>
                    <option value="tam-linh">🛕 Tâm linh - Tôn giáo</option>
                    <option value="lang-nghe">🏺 Làng nghề truyền thống</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Khu vực / Huyện / Thị xã</label>
                  <input
                    type="text"
                    value={editingPlace.district || ''}
                    onChange={(e) => setEditingPlace({ ...editingPlace, district: e.target.value })}
                    placeholder="vd: Huyện Long Hồ, Tỉnh Vĩnh Long"
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Địa chỉ chi tiết</label>
                  <input
                    type="text"
                    value={editingPlace.address || ''}
                    onChange={(e) => setEditingPlace({ ...editingPlace, address: e.target.value })}
                    placeholder="vd: Xã An Bình, Long Hồ, Vĩnh Long"
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tọa độ Vĩ độ (Latitude GPS)</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={editingPlace.coordinates?.lat || 10.25}
                    onChange={(e) => setEditingPlace({
                      ...editingPlace,
                      coordinates: {
                        lat: parseFloat(e.target.value) || 10.25,
                        lng: editingPlace.coordinates?.lng || 105.97
                      }
                    })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tọa độ Kinh độ (Longitude GPS)</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={editingPlace.coordinates?.lng || 105.97}
                    onChange={(e) => setEditingPlace({
                      ...editingPlace,
                      coordinates: {
                        lat: editingPlace.coordinates?.lat || 10.25,
                        lng: parseFloat(e.target.value) || 105.97
                      }
                    })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              {/* Cover Image */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Ảnh đại diện chính (URL hoặc Tải lên máy chủ)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editingPlace.coverImage || ''}
                    onChange={(e) => setEditingPlace({ ...editingPlace, coverImage: e.target.value })}
                    placeholder="https://... hoặc /uploads/..."
                    className="flex-1 px-3 py-2 border rounded-xl"
                  />
                  <label className="px-3 py-2 bg-slate-800 text-white rounded-xl cursor-pointer hover:bg-slate-900 flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5" />
                    Tải file ảnh
                    <input type="file" accept="image/*" onChange={handleUploadCover} className="hidden" />
                  </label>
                </div>
                {editingPlace.coverImage && (
                  <img src={editingPlace.coverImage} alt="Preview" className="w-24 h-16 object-cover rounded-lg mt-2 border" />
                )}
              </div>

              {/* Multi-images gallery upload */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Bộ sưu tập hình ảnh ({editingPlace.gallery?.length || 0} ảnh)
                </label>
                <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl cursor-pointer hover:bg-emerald-100">
                  <Upload className="w-3.5 h-3.5" />
                  Tải thêm nhiều ảnh vào gallery
                  <input type="file" multiple accept="image/*" onChange={handleUploadGallery} className="hidden" />
                </label>
              </div>

              {/* Descriptions */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Mô tả ngắn hiển thị ở trang chủ *</label>
                <textarea
                  rows={2}
                  value={editingPlace.shortDesc || ''}
                  onChange={(e) => setEditingPlace({ ...editingPlace, shortDesc: e.target.value })}
                  required
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Giới thiệu tổng quan</label>
                <textarea
                  rows={3}
                  value={editingPlace.overview || ''}
                  onChange={(e) => setEditingPlace({ ...editingPlace, overview: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Lịch sử hình thành</label>
                <textarea
                  rows={3}
                  value={editingPlace.history || ''}
                  onChange={(e) => setEditingPlace({ ...editingPlace, history: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Giá trị văn hóa - lịch sử</label>
                <textarea
                  rows={3}
                  value={editingPlace.culturalValue || ''}
                  onChange={(e) => setEditingPlace({ ...editingPlace, culturalValue: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Hoạt động trải nghiệm</label>
                <textarea
                  rows={2}
                  value={editingPlace.experiences || ''}
                  onChange={(e) => setEditingPlace({ ...editingPlace, experiences: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              {/* AI TTS Text */}
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-3">
                <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4" />
                  Nội dung Thuyết minh Giọng đọc AI (Tiếng Việt & Tiếng Anh)
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Văn bản thuyết minh Tiếng Việt (Unicode chuẩn)
                  </label>
                  <textarea
                    rows={4}
                    value={editingPlace.audioVietnamese?.text || ''}
                    onChange={(e) => setEditingPlace({
                      ...editingPlace,
                      audioVietnamese: {
                        text: e.target.value,
                        durationEstimate: editingPlace.audioVietnamese?.durationEstimate || '1 phút 30 giây'
                      }
                    })}
                    placeholder="Nhập nội dung đầy đủ để AI đọc thuyết minh cho du khách..."
                    className="w-full px-3 py-2 border rounded-xl bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Văn bản thuyết minh Tiếng Anh (English Narration)
                  </label>
                  <textarea
                    rows={3}
                    value={editingPlace.audioEnglish?.text || ''}
                    onChange={(e) => setEditingPlace({
                      ...editingPlace,
                      audioEnglish: {
                        text: e.target.value,
                        durationEstimate: editingPlace.audioEnglish?.durationEstimate || '1 minute 15 seconds'
                      }
                    })}
                    placeholder="Enter English speech narration for international visitors..."
                    className="w-full px-3 py-2 border rounded-xl bg-white"
                  />
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="pt-3 border-t flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsPlaceModalOpen(false)}
                  className="px-4 py-2 border rounded-xl text-slate-700 font-bold hover:bg-slate-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-2 shadow-md shadow-emerald-600/30"
                >
                  <Save className="w-4 h-4" />
                  Lưu địa điểm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* NEWS EDIT/ADD MODAL                        */}
      {/* ========================================== */}
      {isNewsModalOpen && editingNews && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col">
            <div className="px-6 py-4 bg-blue-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-base">
                {editingNews.id ? 'Chỉnh sửa bài viết' : 'Đăng Tin Tức Mới'}
              </h3>
              <button onClick={() => setIsNewsModalOpen(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNews} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tiêu đề bài viết *</label>
                <input
                  type="text"
                  value={editingNews.title || ''}
                  onChange={(e) => setEditingNews({ ...editingNews, title: e.target.value })}
                  required
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Chuyên mục</label>
                  <input
                    type="text"
                    value={editingNews.category || 'Sự kiện du lịch'}
                    onChange={(e) => setEditingNews({ ...editingNews, category: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tác giả</label>
                  <input
                    type="text"
                    value={editingNews.author || ''}
                    onChange={(e) => setEditingNews({ ...editingNews, author: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Ảnh minh họa (URL)</label>
                <input
                  type="text"
                  value={editingNews.coverImage || ''}
                  onChange={(e) => setEditingNews({ ...editingNews, coverImage: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tóm tắt ngắn</label>
                <textarea
                  rows={2}
                  value={editingNews.summary || ''}
                  onChange={(e) => setEditingNews({ ...editingNews, summary: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nội dung chi tiết *</label>
                <textarea
                  rows={6}
                  value={editingNews.content || ''}
                  onChange={(e) => setEditingNews({ ...editingNews, content: e.target.value })}
                  required
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="pt-2 border-t flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsNewsModalOpen(false)}
                  className="px-4 py-2 border rounded-xl text-slate-700 font-bold hover:bg-slate-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-2 shadow-md shadow-blue-600/30"
                >
                  <Save className="w-4 h-4" />
                  Đăng bài
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
