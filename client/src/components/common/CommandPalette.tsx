import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Hash, FolderGit2, BookOpen, ExternalLink, X, ArrowRight } from 'lucide-react';
import { Project, BlogPost } from '../../types';
import { api } from '../../services/api';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      api.getProjects().then((res) => {
        if (res.data.success) setProjects(res.data.data);
      });
      api.getBlogPosts().then((res) => {
        if (res.data.success) setPosts(res.data.data);
      });
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent handles toggling
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const navItems = [
    { label: 'Home', href: '/#home', icon: Hash },
    { label: 'About', href: '/#about', icon: Hash },
    { label: 'Skills', href: '/#skills', icon: Hash },
    { label: 'Services', href: '/#services', icon: Hash },
    { label: 'Projects', href: '/#projects', icon: FolderGit2 },
    { label: 'Experience', href: '/#experience', icon: Hash },
    { label: 'Education', href: '/#education', icon: Hash },
    { label: 'Certifications', href: '/#certifications', icon: Hash },
    { label: 'Resume', href: '/resume', icon: Hash },
    { label: 'Testimonials', href: '/#testimonials', icon: Hash },
    { label: 'Blog Articles', href: '/blog', icon: BookOpen },
    { label: 'FAQs', href: '/#faq', icon: Hash },
    { label: 'Contact', href: '/#contact', icon: Hash },
    { label: 'Admin Dashboard', href: '/admin', icon: ExternalLink },
  ];

  const filteredNav = navItems.filter((i) =>
    i.label.toLowerCase().includes(query.toLowerCase())
  );

  const filteredProjects = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.summary.toLowerCase().includes(query.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
  );

  const filteredPosts = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.summary.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (href: string) => {
    onClose();
    if (href.startsWith('/#')) {
      navigate('/');
      setTimeout(() => {
        const id = href.replace('/#', '');
        const elem = document.getElementById(id);
        if (elem) elem.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      navigate(href);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400 mr-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search sections, projects, blog articles... (e.g. React, Skills, Contact)"
            className="flex-1 bg-transparent border-none text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none text-base"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4 text-sm">
          {/* Navigation Section */}
          {filteredNav.length > 0 && (
            <div>
              <div className="px-3 py-1 text-xs font-bold text-slate-400 uppercase tracking-wider">
                Quick Navigation
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 mt-1">
                {filteredNav.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => handleSelect(item.href)}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-indigo-500/10 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left"
                  >
                    <span className="flex items-center gap-2 font-medium">
                      <item.icon className="w-4 h-4 text-slate-400" />
                      {item.label}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-40" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Projects Section */}
          {filteredProjects.length > 0 && (
            <div>
              <div className="px-3 py-1 text-xs font-bold text-slate-400 uppercase tracking-wider">
                Projects
              </div>
              <div className="space-y-1 mt-1">
                {filteredProjects.slice(0, 3).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleSelect(`/projects/${p.slug}`)}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-indigo-500/10 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left"
                  >
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">{p.title}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                        {p.summary}
                      </div>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                      {p.category}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Blog Articles */}
          {filteredPosts.length > 0 && (
            <div>
              <div className="px-3 py-1 text-xs font-bold text-slate-400 uppercase tracking-wider">
                Articles & Insights
              </div>
              <div className="space-y-1 mt-1">
                {filteredPosts.slice(0, 3).map((post) => (
                  <button
                    key={post.id}
                    onClick={() => handleSelect(`/blog/${post.slug}`)}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-indigo-500/10 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left"
                  >
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">{post.title}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                        {post.summary}
                      </div>
                    </div>
                    <span className="text-xs text-slate-400">{post.readingTime}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredNav.length === 0 && filteredProjects.length === 0 && filteredPosts.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              No matching sections or content found for &quot;{query}&quot;
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Tip: Press ESC to close</span>
          <span>Navigation Palette</span>
        </div>
      </div>
    </div>
  );
};
