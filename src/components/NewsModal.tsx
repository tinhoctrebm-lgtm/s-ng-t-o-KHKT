import { NewsItem } from '../types/index.ts';
import { X, Calendar, User, Eye, Share2 } from 'lucide-react';
import { useState } from 'react';

interface NewsModalProps {
  news: NewsItem | null;
  onClose: () => void;
}

export function NewsModal({ news, onClose }: NewsModalProps) {
  if (!news) return null;
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header Image */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-900">
          <img
            src={news.coverImage}
            alt={news.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-black/50 hover:bg-black/80 text-white transition-colors backdrop-blur-sm"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Category & Title */}
          <div className="absolute bottom-4 left-6 right-6 text-white space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-600/90 text-white uppercase tracking-wider backdrop-blur-sm">
              {news.category}
            </span>
            <h2 className="text-lg sm:text-2xl font-bold leading-tight drop-shadow">
              {news.title}
            </h2>
          </div>
        </div>

        {/* Article Meta Bar */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {new Date(news.publishedAt).toLocaleDateString('vi-VN')}
            </span>
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-slate-400" />
              {news.author}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-slate-400" />
              {news.views} lượt xem
            </span>
          </div>

          <button
            onClick={handleShare}
            className="flex items-center gap-1 text-slate-600 hover:text-blue-600 font-semibold"
          >
            <Share2 className="w-3.5 h-3.5" />
            {copied ? 'Đã sao chép!' : 'Chia sẻ'}
          </button>
        </div>

        {/* Article Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed">
          <p className="font-semibold text-slate-900 text-base sm:text-lg border-l-4 border-blue-600 pl-4 italic bg-blue-50/50 py-2 rounded-r-xl">
            {news.summary}
          </p>

          <div className="whitespace-pre-line space-y-4 leading-loose pt-2">
            {news.content}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-colors"
          >
            Đóng bài viết
          </button>
        </div>
      </div>
    </div>
  );
}
