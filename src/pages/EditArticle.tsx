import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getArticles } from '../api/articles';
import { useToast } from '../context/ToastContext';
import type { Article } from '../types';

export function EditArticle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    summary: '',
    url: '',
    source: '',
    published_at: new Date().toISOString().split('T')[0],
    img_url: '',
  });

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const articles = await getArticles();
        const article = articles.find((a: Article) => {
          const articleId = typeof a._id === 'string' ? a._id : a._id?.$oid || a.id;
          return articleId === id;
        });
        if (article) {
          setFormData({
            title: article.title,
            content: article.content,
            summary: article.summary || '',
            url: article.url,
            source: article.source || '',
            published_at: article.published_at ? new Date(article.published_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            img_url: article.img_url || '',
          });
          setError(null);
        } else {
          setError('Article not found');
        }
      } catch (err) {
        const errorMessage = 'Failed to fetch article';
        setError(errorMessage);
        showToast(errorMessage, 'error');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id, showToast]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);

      const article: Partial<Article> = {
        ...formData,
        published_at: formData.published_at + 'T00:00:00Z',
        metadata: {
          base_url: new URL(formData.url).origin,
        },
      };

      await axios.put(`http://localhost:8000/articles/${id}`, article);
      showToast('Article updated successfully!', 'success');
      navigate(`/articles/${id}`);
    } catch (err) {
      const errorMessage = 'Failed to update article';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

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

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={() => navigate(`/articles/${id}`)}
        className="mb-6 text-blue-400 hover:text-blue-300 font-medium transition-colors text-sm sm:text-base"
      >
        ← Back to Article
      </button>

      <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 sm:p-8">
        <h1 className="text-xl sm:text-2xl font-bold text-white mb-6">Edit Article</h1>

        {error && (
          <div className="rounded-lg bg-red-900/20 border border-red-700/50 p-4 mb-6">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2.5 sm:py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              placeholder="Article title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              URL <span className="text-red-400">*</span>
            </label>
            <input
              type="url"
              name="url"
              value={formData.url}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2.5 sm:py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              placeholder="https://example.com/article"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Source
            </label>
            <input
              type="text"
              name="source"
              value={formData.source}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 sm:py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              placeholder="news-outlet"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Summary
            </label>
            <textarea
              name="summary"
              value={formData.summary}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-2.5 sm:py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base resize-none"
              placeholder="Brief summary of the article"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Content <span className="text-red-400">*</span>
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              rows={8}
              required
              className="w-full px-4 py-2.5 sm:py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base resize-none"
              placeholder="Full article content"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Image URL
            </label>
            <input
              type="url"
              name="img_url"
              value={formData.img_url}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 sm:py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Published Date
            </label>
            <input
              type="date"
              name="published_at"
              value={formData.published_at}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 sm:py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors text-sm sm:text-base active:scale-95"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => navigate(`/articles/${id}`)}
              disabled={saving}
              className="w-full sm:flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 text-white font-medium rounded-lg transition-colors text-sm sm:text-base active:scale-95"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
