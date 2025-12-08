export interface Article {
  _id?: {
    $oid: string;
  } | string;
  id?: string | number;
  title: string;
  content: string;
  url: string;
  source: string;
  published_at: string;
  summary: string;
  img_url: string | null;
  metadata?: Record<string, unknown>;
}

export interface ArticleFormData extends Omit<Article, 'id' | 'published_at'> {
  published_at?: string;
}
