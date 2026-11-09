import { Place, NewsItem, User, DashboardStats } from '../types/index.ts';

const BASE_URL = '/api';

export async function fetchPlaces(): Promise<Place[]> {
  const res = await fetch(`${BASE_URL}/places`);
  if (!res.ok) throw new Error('Không thể tải danh sách địa điểm.');
  return res.json();
}

export async function fetchPlaceById(id: string): Promise<Place> {
  const res = await fetch(`${BASE_URL}/places/${id}`);
  if (!res.ok) throw new Error('Không thể tải thông tin địa điểm.');
  return res.json();
}

export async function createPlace(data: Partial<Place>, token: string): Promise<Place> {
  const res = await fetch(`${BASE_URL}/places`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Lỗi khi tạo địa điểm mới.');
  }
  return res.json();
}

export async function updatePlace(id: string, data: Partial<Place>, token: string): Promise<Place> {
  const res = await fetch(`${BASE_URL}/places/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Lỗi khi cập nhật địa điểm.');
  }
  return res.json();
}

export async function deletePlace(id: string, token: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/places/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Lỗi khi xóa địa điểm.');
  }
}

export async function likePlace(id: string): Promise<{ likes: number }> {
  const res = await fetch(`${BASE_URL}/places/${id}/like`, { method: 'POST' });
  if (!res.ok) throw new Error('Không thể thích địa điểm.');
  return res.json();
}

export async function recordListen(id: string): Promise<void> {
  try {
    await fetch(`${BASE_URL}/places/${id}/listen`, { method: 'POST' });
  } catch {
    // Ignore network glitch on counter
  }
}

export async function fetchNews(): Promise<NewsItem[]> {
  const res = await fetch(`${BASE_URL}/news`);
  if (!res.ok) throw new Error('Không thể tải tin tức.');
  return res.json();
}

export async function fetchNewsById(id: string): Promise<NewsItem> {
  const res = await fetch(`${BASE_URL}/news/${id}`);
  if (!res.ok) throw new Error('Không thể tải bài viết.');
  return res.json();
}

export async function createNews(data: Partial<NewsItem>, token: string): Promise<NewsItem> {
  const res = await fetch(`${BASE_URL}/news`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Lỗi khi đăng bài viết.');
  }
  return res.json();
}

export async function updateNews(id: string, data: Partial<NewsItem>, token: string): Promise<NewsItem> {
  const res = await fetch(`${BASE_URL}/news/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Lỗi khi cập nhật bài viết.');
  }
  return res.json();
}

export async function deleteNews(id: string, token: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/news/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Lỗi khi xóa bài viết.');
  }
}

export async function fetchStats(): Promise<DashboardStats> {
  const res = await fetch(`${BASE_URL}/stats`);
  if (!res.ok) throw new Error('Không thể tải số liệu thống kê.');
  return res.json();
}

export async function login(username: string, password: string): Promise<{ token: string; user: User }> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Đăng nhập không thành công.');
  }
  return res.json();
}

export async function getMe(token: string): Promise<{ user: User }> {
  const res = await fetch(`${BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Phiên đăng nhập hết hạn.');
  return res.json();
}

export async function changePassword(currentPassword: string, newPassword: string, token: string): Promise<{ message: string }> {
  const res = await fetch(`${BASE_URL}/auth/change-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ currentPassword, newPassword })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Không thể đổi mật khẩu.');
  }
  return res.json();
}

export async function fetchUsers(token: string): Promise<User[]> {
  const res = await fetch(`${BASE_URL}/auth/users`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Không thể lấy danh sách người dùng.');
  return res.json();
}

export async function createUser(data: { username: string; password: string; email: string; fullName: string; role?: string }, token: string): Promise<User> {
  const res = await fetch(`${BASE_URL}/auth/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Không thể tạo tài khoản mới.');
  }
  return res.json();
}

export async function uploadImage(file: File, token: string): Promise<{ url: string; filename: string }> {
  const formData = new FormData();
  formData.append('image', file);
  const res = await fetch(`${BASE_URL}/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: formData
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Tải ảnh lên thất bại.');
  }
  return res.json();
}

export async function uploadMultipleImages(files: FileList | File[], token: string): Promise<{ files: Array<{ url: string; filename: string }> }> {
  const formData = new FormData();
  Array.from(files).forEach(file => {
    formData.append('images', file);
  });
  const res = await fetch(`${BASE_URL}/upload-multiple`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: formData
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Tải nhiều ảnh thất bại.');
  }
  return res.json();
}
