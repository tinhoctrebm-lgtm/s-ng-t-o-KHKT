import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import multer from 'multer';
import dotenv from 'dotenv';
import { initialPlaces, initialNews, initialUsers, initialStats } from './src/data/initialData.ts';
import { Place, NewsItem, User, DashboardStats } from './src/types/index.ts';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Ensure data directories exist
const dataDir = path.resolve(process.cwd(), 'data');
const uploadsDir = path.resolve(process.cwd(), 'uploads');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// File paths for persistence
const placesFilePath = path.join(dataDir, 'places.json');
const newsFilePath = path.join(dataDir, 'news.json');
const usersFilePath = path.join(dataDir, 'users.json');
const authFilePath = path.join(dataDir, 'auth.json');
const statsFilePath = path.join(dataDir, 'stats.json');

// Helper to hash passwords
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + '_vinhlong_salt_2026').digest('hex');
}

// Initialize seed data if not present
if (!fs.existsSync(placesFilePath)) {
  fs.writeFileSync(placesFilePath, JSON.stringify(initialPlaces, null, 2), 'utf-8');
}
if (!fs.existsSync(newsFilePath)) {
  fs.writeFileSync(newsFilePath, JSON.stringify(initialNews, null, 2), 'utf-8');
}
if (!fs.existsSync(usersFilePath)) {
  fs.writeFileSync(usersFilePath, JSON.stringify(initialUsers, null, 2), 'utf-8');
}
if (!fs.existsSync(statsFilePath)) {
  fs.writeFileSync(statsFilePath, JSON.stringify(initialStats, null, 2), 'utf-8');
}
if (!fs.existsSync(authFilePath)) {
  // Pre-seed credentials for admin
  const defaultAuth = {
    'admin': {
      passwordHash: hashPassword('vinhlong2026!'),
      email: 'admin@vinhlongtour.vn'
    },
    'bientapvien': {
      passwordHash: hashPassword('vinhlong2026!'),
      email: 'bientap@vinhlongtour.vn'
    }
  };
  fs.writeFileSync(authFilePath, JSON.stringify(defaultAuth, null, 2), 'utf-8');
}

// Helpers for reading/writing persistent data
function readData<T>(filePath: string, fallback: T): T {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as T;
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return fallback;
  }
}

function writeData<T>(filePath: string, data: T): void {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
  }
}

// Express middlewares
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve uploaded files statically
app.use('/uploads', express.static(uploadsDir));

// Helper for Unicode NFC text normalization
function normalizeString(val: any): string {
  if (typeof val !== 'string') return '';
  return val.normalize('NFC').trim();
}

// Multer storage setup for image uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeBase = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e6);
    cb(null, `${safeBase}-${uniqueSuffix}${ext || '.jpg'}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 } // 25MB max per image
});

// Secret for signing tokens
const TOKEN_SECRET = process.env.TOKEN_SECRET || 'smart_tourism_vinhlong_secret_key_2026';

function generateToken(user: User): string {
  const payload = {
    id: user.id,
    username: user.username,
    role: user.role,
    email: user.email,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
  };
  const str = Buffer.from(JSON.stringify(payload)).toString('base64');
  const signature = crypto.createHmac('sha256', TOKEN_SECRET).update(str).digest('hex');
  return `${str}.${signature}`;
}

function verifyToken(token: string): User | null {
  try {
    const [payloadStr, signature] = token.split('.');
    if (!payloadStr || !signature) return null;
    const expectedSignature = crypto.createHmac('sha256', TOKEN_SECRET).update(payloadStr).digest('hex');
    if (signature !== expectedSignature) return null;
    const payload = JSON.parse(Buffer.from(payloadStr, 'base64').toString('utf-8'));
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

// Authentication middleware
interface AuthenticatedRequest extends Request {
  user?: User;
}

function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Chưa đăng nhập. Vui lòng đăng nhập với tài khoản Quản trị viên.' });
  }
  const token = authHeader.substring(7);
  const user = verifyToken(token);
  if (!user) {
    return res.status(401).json({ error: 'Phiên đăng nhập đã hết hạn hoặc không hợp lệ.' });
  }
  req.user = user;
  next();
}

// ==========================================
// API ROUTES
// ==========================================

// --- Auth Routes ---
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.' });
  }

  const authRecords = readData<Record<string, { passwordHash: string; email: string }>>(authFilePath, {});
  const users = readData<User[]>(usersFilePath, initialUsers);

  // Match by username or email
  let matchedUsername = Object.keys(authRecords).find(
    u => u.toLowerCase() === username.toLowerCase() || authRecords[u].email.toLowerCase() === username.toLowerCase()
  );

  if (!matchedUsername) {
    return res.status(401).json({ error: 'Tên đăng nhập hoặc mật khẩu không chính xác.' });
  }

  const userCreds = authRecords[matchedUsername];
  if (userCreds.passwordHash !== hashPassword(password)) {
    return res.status(401).json({ error: 'Mật khẩu không chính xác.' });
  }

  const userObj = users.find(u => u.username.toLowerCase() === matchedUsername.toLowerCase()) || {
    id: `user-${matchedUsername}`,
    username: matchedUsername,
    email: userCreds.email,
    fullName: 'Quản trị viên ' + matchedUsername,
    role: 'admin' as const,
    createdAt: new Date().toISOString()
  };

  const token = generateToken(userObj);
  return res.json({
    token,
    user: userObj
  });
});

app.get('/api/auth/me', (req: AuthenticatedRequest, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Chưa xác thực' });
  }
  const token = authHeader.substring(7);
  const user = verifyToken(token);
  if (!user) {
    return res.status(401).json({ error: 'Token không hợp lệ' });
  }
  return res.json({ user });
});

app.post('/api/auth/change-password', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  const username = req.user?.username;

  if (!username || !currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Vui lòng điền đầy đủ mật khẩu cũ và mới.' });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'Mật khẩu mới phải có ít nhất 6 ký tự.' });
  }

  const authRecords = readData<Record<string, { passwordHash: string; email: string }>>(authFilePath, {});
  if (!authRecords[username] || authRecords[username].passwordHash !== hashPassword(currentPassword)) {
    return res.status(400).json({ error: 'Mật khẩu hiện tại không đúng.' });
  }

  authRecords[username].passwordHash = hashPassword(newPassword);
  writeData(authFilePath, authRecords);
  return res.json({ success: true, message: 'Đổi mật khẩu thành công!' });
});

app.get('/api/auth/users', requireAuth, (_req: AuthenticatedRequest, res: Response) => {
  const users = readData<User[]>(usersFilePath, initialUsers);
  return res.json(users);
});

app.post('/api/auth/users', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Chỉ Admin mới có quyền tạo thêm tài khoản quản trị.' });
  }
  const { username, password, email, fullName, role } = req.body;
  if (!username || !password || !email || !fullName) {
    return res.status(400).json({ error: 'Vui lòng cung cấp đầy đủ thông tin.' });
  }

  const authRecords = readData<Record<string, { passwordHash: string; email: string }>>(authFilePath, {});
  if (authRecords[username]) {
    return res.status(400).json({ error: 'Tên đăng nhập này đã tồn tại.' });
  }

  const users = readData<User[]>(usersFilePath, initialUsers);
  const newUser: User = {
    id: `user-${Date.now()}`,
    username,
    email,
    fullName,
    role: role === 'editor' ? 'editor' : 'admin',
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  authRecords[username] = {
    passwordHash: hashPassword(password),
    email
  };

  writeData(usersFilePath, users);
  writeData(authFilePath, authRecords);
  return res.status(201).json(newUser);
});

// --- File Upload Routes ---
app.post('/api/upload', requireAuth, upload.single('image'), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Chưa có file hình ảnh nào được tải lên.' });
  }
  const fileUrl = `/uploads/${req.file.filename}`;
  return res.json({
    url: fileUrl,
    filename: req.file.filename,
    size: req.file.size
  });
});

app.post('/api/upload-multiple', requireAuth, upload.array('images', 12), (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[];
  if (!files || files.length === 0) {
    return res.status(400).json({ error: 'Không tìm thấy file tải lên.' });
  }
  const results = files.map(f => ({
    url: `/uploads/${f.filename}`,
    filename: f.filename,
    size: f.size
  }));
  return res.json({ files: results });
});

// --- Places Routes ---
app.get('/api/places', (_req: Request, res: Response) => {
  const places = readData<Place[]>(placesFilePath, initialPlaces);
  return res.json(places);
});

app.get('/api/places/:id', (req: Request, res: Response) => {
  const places = readData<Place[]>(placesFilePath, initialPlaces);
  const index = places.findIndex(p => p.id === req.params.id || p.slug === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Không tìm thấy địa điểm du lịch.' });
  }

  // Increment view counter
  places[index].views = (places[index].views || 0) + 1;
  writeData(placesFilePath, places);

  // Update total stats
  const stats = readData<DashboardStats>(statsFilePath, initialStats);
  stats.totalViews = (stats.totalViews || 0) + 1;
  writeData(statsFilePath, stats);

  return res.json(places[index]);
});

app.post('/api/places', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const data = req.body;
  if (!data.name || !data.shortDesc) {
    return res.status(400).json({ error: 'Tên địa điểm và mô tả ngắn là bắt buộc.' });
  }

  const places = readData<Place[]>(placesFilePath, initialPlaces);
  const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
  const newPlace: Place = {
    ...data,
    id: data.id || `place-${Date.now()}`,
    slug,
    name: normalizeString(data.name),
    category: data.category || 'sinh-thai',
    district: normalizeString(data.district),
    address: normalizeString(data.address),
    shortDesc: normalizeString(data.shortDesc),
    overview: normalizeString(data.overview),
    history: normalizeString(data.history),
    culturalValue: normalizeString(data.culturalValue),
    experiences: normalizeString(data.experiences),
    suitableTime: normalizeString(data.suitableTime),
    audioVietnamese: {
      text: normalizeString(data.audioVietnamese?.text),
      durationEstimate: normalizeString(data.audioVietnamese?.durationEstimate) || '1 phút 30 giây'
    },
    audioEnglish: {
      text: normalizeString(data.audioEnglish?.text),
      durationEstimate: normalizeString(data.audioEnglish?.durationEstimate) || '1 minute 15 seconds'
    },
    coordinates: data.coordinates || { lat: 10.25, lng: 105.97 },
    gallery: Array.isArray(data.gallery) ? data.gallery : [],
    views: 0,
    likes: 0,
    featured: Boolean(data.featured),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  places.unshift(newPlace);
  writeData(placesFilePath, places);

  // Update stats
  const stats = readData<DashboardStats>(statsFilePath, initialStats);
  stats.totalPlaces = places.length;
  stats.totalImages = places.reduce((sum, p) => sum + (p.gallery?.length || 0) + 1, 0);
  writeData(statsFilePath, stats);

  return res.status(201).json(newPlace);
});

app.put('/api/places/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const places = readData<Place[]>(placesFilePath, initialPlaces);
  const index = places.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Không tìm thấy địa điểm cần chỉnh sửa.' });
  }

  const existing = places[index];
  const data = req.body;
  const updated: Place = {
    ...existing,
    ...data,
    id: existing.id, // prevent changing id
    name: data.name ? normalizeString(data.name) : existing.name,
    category: data.category || existing.category,
    district: data.district ? normalizeString(data.district) : existing.district,
    address: data.address ? normalizeString(data.address) : existing.address,
    shortDesc: data.shortDesc ? normalizeString(data.shortDesc) : existing.shortDesc,
    overview: data.overview !== undefined ? normalizeString(data.overview) : existing.overview,
    history: data.history !== undefined ? normalizeString(data.history) : existing.history,
    culturalValue: data.culturalValue !== undefined ? normalizeString(data.culturalValue) : existing.culturalValue,
    experiences: data.experiences !== undefined ? normalizeString(data.experiences) : existing.experiences,
    suitableTime: data.suitableTime !== undefined ? normalizeString(data.suitableTime) : existing.suitableTime,
    audioVietnamese: data.audioVietnamese ? {
      text: normalizeString(data.audioVietnamese.text),
      durationEstimate: normalizeString(data.audioVietnamese.durationEstimate) || existing.audioVietnamese?.durationEstimate
    } : existing.audioVietnamese,
    audioEnglish: data.audioEnglish ? {
      text: normalizeString(data.audioEnglish.text),
      durationEstimate: normalizeString(data.audioEnglish.durationEstimate) || existing.audioEnglish?.durationEstimate
    } : existing.audioEnglish,
    updatedAt: new Date().toISOString()
  };

  places[index] = updated;
  writeData(placesFilePath, places);

  // Update image count stat
  const stats = readData<DashboardStats>(statsFilePath, initialStats);
  stats.totalImages = places.reduce((sum, p) => sum + (p.gallery?.length || 0) + 1, 0);
  writeData(statsFilePath, stats);

  return res.json(updated);
});

app.delete('/api/places/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const places = readData<Place[]>(placesFilePath, initialPlaces);
  const filtered = places.filter(p => p.id !== req.params.id);
  if (filtered.length === places.length) {
    return res.status(404).json({ error: 'Không tìm thấy địa điểm để xóa.' });
  }

  writeData(placesFilePath, filtered);

  // Update stats
  const stats = readData<DashboardStats>(statsFilePath, initialStats);
  stats.totalPlaces = filtered.length;
  stats.totalImages = filtered.reduce((sum, p) => sum + (p.gallery?.length || 0) + 1, 0);
  writeData(statsFilePath, stats);

  return res.json({ success: true, message: 'Đã xóa địa điểm thành công.' });
});

// Like place
app.post('/api/places/:id/like', (req: Request, res: Response) => {
  const places = readData<Place[]>(placesFilePath, initialPlaces);
  const place = places.find(p => p.id === req.params.id);
  if (!place) {
    return res.status(404).json({ error: 'Không tìm thấy địa điểm.' });
  }
  place.likes = (place.likes || 0) + 1;
  writeData(placesFilePath, places);
  return res.json({ likes: place.likes });
});

// Record audio listen
app.post('/api/places/:id/listen', (req: Request, res: Response) => {
  const stats = readData<DashboardStats>(statsFilePath, initialStats);
  stats.totalAudioListens = (stats.totalAudioListens || 0) + 1;
  writeData(statsFilePath, stats);
  return res.json({ totalAudioListens: stats.totalAudioListens });
});

// --- News Routes ---
app.get('/api/news', (_req: Request, res: Response) => {
  const news = readData<NewsItem[]>(newsFilePath, initialNews);
  return res.json(news);
});

app.get('/api/news/:id', (req: Request, res: Response) => {
  const news = readData<NewsItem[]>(newsFilePath, initialNews);
  const item = news.find(n => n.id === req.params.id || n.slug === req.params.id);
  if (!item) {
    return res.status(404).json({ error: 'Không tìm thấy bài viết.' });
  }
  item.views = (item.views || 0) + 1;
  writeData(newsFilePath, news);
  return res.json(item);
});

app.post('/api/news', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const data = req.body;
  if (!data.title || !data.content) {
    return res.status(400).json({ error: 'Tiêu đề và nội dung bài viết là bắt buộc.' });
  }
  const news = readData<NewsItem[]>(newsFilePath, initialNews);
  const slug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
  const newItem: NewsItem = {
    ...data,
    id: data.id || `news-${Date.now()}`,
    slug,
    status: data.status || 'published',
    views: 0,
    publishedAt: data.publishedAt || new Date().toISOString()
  };
  news.unshift(newItem);
  writeData(newsFilePath, news);

  const stats = readData<DashboardStats>(statsFilePath, initialStats);
  stats.totalNews = news.length;
  writeData(statsFilePath, stats);

  return res.status(201).json(newItem);
});

app.put('/api/news/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const news = readData<NewsItem[]>(newsFilePath, initialNews);
  const index = news.findIndex(n => n.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Không tìm thấy bài viết.' });
  }
  const updated: NewsItem = {
    ...news[index],
    ...req.body,
    id: news[index].id
  };
  news[index] = updated;
  writeData(newsFilePath, news);
  return res.json(updated);
});

app.delete('/api/news/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const news = readData<NewsItem[]>(newsFilePath, initialNews);
  const filtered = news.filter(n => n.id !== req.params.id);
  if (filtered.length === news.length) {
    return res.status(404).json({ error: 'Không tìm thấy bài viết.' });
  }
  writeData(newsFilePath, filtered);

  const stats = readData<DashboardStats>(statsFilePath, initialStats);
  stats.totalNews = filtered.length;
  writeData(statsFilePath, stats);

  return res.json({ success: true, message: 'Đã xóa bài viết thành công.' });
});

// --- Dashboard Stats Route ---
app.get('/api/stats', (_req: Request, res: Response) => {
  const stats = readData<DashboardStats>(statsFilePath, initialStats);
  const places = readData<Place[]>(placesFilePath, initialPlaces);
  const news = readData<NewsItem[]>(newsFilePath, initialNews);

  stats.totalPlaces = places.length;
  stats.totalNews = news.length;
  stats.totalImages = places.reduce((sum, p) => sum + (p.gallery?.length || 0) + 1, 0);

  return res.json(stats);
});

// ==========================================
// STATIC ASSETS & VITE INTEGRATION
// ==========================================
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Smart Tourism Vinh Long server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
