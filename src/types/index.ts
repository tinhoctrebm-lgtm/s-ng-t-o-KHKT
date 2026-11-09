export type PlaceCategory = 'sinh-thai' | 'lich-su-van-hoa' | 'tam-linh' | 'lang-nghe';

export interface PlaceGalleryItem {
  url: string;
  caption?: string;
}

export interface Place {
  id: string;
  name: string;
  slug: string;
  category: PlaceCategory;
  district: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  coverImage: string;
  gallery: PlaceGalleryItem[];
  shortDesc: string;
  overview: string;
  history: string;
  culturalValue: string;
  experiences: string;
  suitableTime: string;
  audioVietnamese: {
    text: string;
    durationEstimate?: string;
  };
  audioEnglish: {
    text: string;
    durationEstimate?: string;
  };
  views: number;
  likes: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImage: string;
  author: string;
  publishedAt: string;
  category: string;
  status: 'published' | 'draft';
  views: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: 'admin' | 'editor';
  createdAt: string;
}

export interface DashboardStats {
  totalPlaces: number;
  totalImages: number;
  totalNews: number;
  totalViews: number;
  totalAudioListens: number;
}
