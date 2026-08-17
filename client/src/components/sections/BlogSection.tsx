import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BlogPost } from '../../types';
import { SectionHeading } from '../common/SectionHeading';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { api } from '../../services/api';
import { BookOpen, Calendar, Clock, ArrowRight, Sparkles } from 'lucide-react';

interface BlogSectionProps {
  initialPosts?: BlogPost[];
}

export const BlogSection: React.FC<BlogSectionProps> = ({ initialPosts }) => {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts || []);
  const [loading, setLoading] = useState(!initialPosts || initialPosts.length === 0);

  useEffect(() => {
    if (!initialPosts || initialPosts.length === 0) {
      api.getBlogPosts().then((res) => {
        if (res.data.success) setPosts(res.data.data);
      }).finally(() => setLoading(false));
    }
  }, [initialPosts]);

  const formatDate = (dStr?: string | null) => {
    if (!dStr) return 'Recently';
    const d = new Date(dStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <section id="blog" className="py-24 scroll-mt-20 relative bg-slate-100/50 dark:bg-[#090d16] border-t border-slate-200/60 dark:border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full text-xs font-semibold uppercase tracking-wider bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
              Engineering Journal
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Articles & <span className="gradient-text">Insights</span>
            </h2>
            <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-xl">
              Deep dives on distributed systems, TypeScript design patterns, and database scaling strategies.
            </p>
          </div>

          <div className="mt-6 md:mt-0">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 shadow-sm transition-all"
            >
              <span>View All Articles</span>
              <ArrowRight className="w-4 h-4 text-indigo-500" />
            </Link>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner text="Loading articles..." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.slice(0, 3).map((post) => (
              <article
                key={post.id}
                className="glass-card rounded-3xl overflow-hidden hover:border-indigo-500/40 hover:-translate-y-1.5 transition-all duration-300 shadow-xl flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-xs font-semibold text-slate-200 border border-slate-700">
                      {post.category}
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(post.publishedAt)}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {post.readingTime}
                      </span>
                    </div>

                    <Link to={`/blog/${post.slug}`}>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                    </Link>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {post.summary}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2">
                  <Link
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-500 transition-colors"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
