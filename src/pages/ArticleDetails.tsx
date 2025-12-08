import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getArticles } from '../api/articles';
import type { Article } from '../types';

export function ArticleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const articles = await getArticles();
        const found = articles.find((a: Article) => {
          const articleId = typeof a._id === 'string' ? a._id : a._id?.$oid || a.id;
          return articleId === id;
        });
        if (found) {
          setArticle(found);
          setError(null);
        } else {
          setError('Article not found');
        }
      } catch (err) {
        setError('Failed to fetch article');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
          <p className="mt-4 text-slate-400">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="rounded-lg bg-red-900/20 border border-red-700/50 p-6">
        <h2 className="text-red-400 font-semibold mb-2">Error</h2>
        <p className="text-red-300">{error || 'Article not found'}</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => navigate('/')}
        className="mb-6 text-blue-400 hover:text-blue-300 font-medium transition-colors text-sm sm:text-base"
      >
        ← Back to Dashboard
      </button>

      <article className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
        {article.img_url && (
          <div className="relative w-full aspect-video sm:aspect-21/9 bg-slate-700">
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
              </div>
            )}
            <img
              src={article.img_url}
              alt={article.title}
              className={`w-full h-full object-cover ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImageLoaded(true)}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}

        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
            <div className="flex-1">
              <p className="text-sm text-slate-400 mb-2">
                {article.source && `From ${article.source.toUpperCase()}`}
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">{article.title}</h1>
            </div>
            <button
              onClick={() => {
                const articleId = typeof article._id === 'string' ? article._id : article._id?.$oid || article.id;
                navigate(`/articles/${articleId}/edit`);
              }}
              className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm"
            >
              Edit Article
            </button>
          </div>

          {article.published_at && (
            <p className="text-sm text-slate-400 mb-6">
              Published: {new Date(article.published_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          )}

          <div className="prose prose-invert max-w-none">
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed whitespace-pre-wrap">
              {article.content}
            </p>
          </div>

          {typeof article.metadata?.base_url === 'string' && (
            <div className="mt-8 pt-6 border-t border-slate-700">
              <p className="text-sm text-slate-400 break-all">
                Source:{' '}
                <a
                  href={article.metadata.base_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  {article.metadata.base_url}
                </a>
              </p>
            </div>
          )}
        </div>
      </article>
    </div>
  );
}
