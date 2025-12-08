import { useState } from 'react';
import type { Article } from '../../types';

interface ArticleCardProps {
  article: Article;
  onView: () => void;
  onDelete?: () => void;
}

export function ArticleCard({ article, onView, onDelete }: ArticleCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const hasValidImage = Boolean(article.img_url && !imageError);
  
  const articleId = typeof article._id === 'string' 
    ? article._id 
    : article._id?.$oid || article.id;

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this article?')) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`http://localhost:8000/articles/${articleId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Call parent's onDelete callback for optimistic UI update
        onDelete?.();
      } else {
        throw new Error('Failed to delete');
      }
    } catch (error) {
      console.error('Failed to delete article:', error);
      alert('Failed to delete article');
      setIsDeleting(false);
    }
  };

  return (
    <div
      className={`group flex h-full flex-col overflow-hidden rounded-lg border border-slate-700 bg-slate-800/90 transition-all hover:border-slate-600 ${
        isDeleting ? 'opacity-50 pointer-events-none' : ''
      }`}
    >
      <div className="relative aspect-video overflow-hidden bg-slate-700">
        {hasValidImage ? (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-800/60">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-400" aria-label="Loading image" />
              </div>
            )}
            <img
              src={article.img_url ?? undefined}
              alt={article.title || 'News image'}
              className={`h-full w-full object-cover transition-transform duration-300 ${
                imageLoaded ? 'opacity-100 group-hover:scale-105' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-slate-700 via-slate-800 to-slate-900">
            <div className="flex flex-col items-center gap-2 text-slate-200">
              <span aria-hidden="true" className="text-3xl">📰</span>
              <span className="text-[11px] uppercase tracking-[0.25em] text-slate-300">News</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex h-full flex-col gap-3 p-4 sm:p-5">
        <div className="flex items-start gap-2">
          <div className="min-w-0 flex-1 space-y-1">
            {article.source && (
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                {article.source}
              </p>
            )}
            <h3 className="text-base font-semibold text-white line-clamp-2 sm:text-lg">
              {article.title}
            </h3>
          </div>
        </div>

        <p className="min-h-[3.6em] text-sm leading-relaxed text-slate-300 line-clamp-3">
          {article.summary || 'No summary available.'}
        </p>

        {article.published_at && (
          <p className="text-xs font-medium text-slate-500">
            {new Date(article.published_at).toLocaleDateString()}
          </p>
        )}

        <div className="mt-auto flex items-center gap-2">
          <button
            onClick={onView}
            className="flex-1 inline-flex items-center justify-center rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition active:scale-[0.98] hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
          >
            View
          </button>

          <a
            href={`/articles/${articleId}/edit`}
            className="inline-flex items-center justify-center rounded-lg border border-slate-500/70 px-3 py-2 text-sm font-semibold text-slate-100 transition active:scale-[0.98] hover:border-slate-400 hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            title="Edit"
          >
            ✏️
            <span className="sr-only">Edit</span>
          </a>

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="inline-flex items-center justify-center rounded-lg border border-red-500/70 px-3 py-2 text-sm font-semibold text-red-100 transition active:scale-[0.98] hover:bg-red-600/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:opacity-60"
            title="Delete"
            aria-busy={isDeleting}
          >
            {isDeleting ? '⏳' : '🗑️'}
            <span className="sr-only">Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}
