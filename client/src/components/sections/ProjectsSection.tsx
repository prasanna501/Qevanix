import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Project } from '../../types';
import { SectionHeading } from '../common/SectionHeading';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { Modal } from '../common/Modal';
import { api } from '../../services/api';
import {
  ExternalLink,
  Github,
  Search,
  Layers,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Eye,
} from 'lucide-react';

interface ProjectsSectionProps {
  initialProjects?: Project[];
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ initialProjects }) => {
  const [projects, setProjects] = useState<Project[]>(initialProjects || []);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(!initialProjects || initialProjects.length === 0);
  const [previewProject, setPreviewProject] = useState<Project | null>(null);

  useEffect(() => {
    if (!initialProjects || initialProjects.length === 0) {
      api.getProjects().then((res) => {
        if (res.data.success) setProjects(res.data.data);
      }).finally(() => setLoading(false));
    }
  }, [initialProjects]);

  const categories = ['All', 'Full Stack', 'Fintech & Backend', 'Web App', 'E-Commerce'];

  const filteredProjects = projects.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <section id="projects" className="py-24 scroll-mt-20 relative bg-slate-100/50 dark:bg-[#090d16] border-t border-slate-200/60 dark:border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Featured Portfolio"
          title="Engineered for"
          highlightText="Impact & Scale"
          subtitle="Explore selected full-stack systems, platforms, and developer tools built with high-availability architectures."
        />

        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by tech or title..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors shadow-sm"
            />
          </div>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <LoadingSpinner text="Fetching projects..." />
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-16 glass-card rounded-3xl p-8">
            <p className="text-slate-500 dark:text-slate-400">
              No projects found matching the filter criteria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="glass-card rounded-3xl overflow-hidden hover:border-indigo-500/40 hover:-translate-y-1.5 transition-all duration-300 shadow-xl flex flex-col group"
              >
                {/* Project Image Header */}
                <div className="relative h-60 w-full overflow-hidden bg-slate-900">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                  {/* Featured Badge */}
                  {project.isFeatured && (
                    <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-600/90 text-white text-xs font-bold shadow-lg backdrop-blur-md">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>Featured</span>
                    </div>
                  )}

                  {/* Category Pill */}
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-slate-900/80 text-slate-200 text-xs font-semibold backdrop-blur-md border border-slate-700">
                    {project.category}
                  </div>

                  {/* Quick View Button */}
                  <button
                    onClick={() => setPreviewProject(project)}
                    className="absolute bottom-4 right-4 p-2.5 rounded-xl bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white backdrop-blur-md hover:scale-105 transition-transform shadow-md"
                    title="Quick Preview"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>

                {/* Content Body */}
                <div className="p-7 flex-1 flex flex-col justify-between space-y-5">
                  <div className="space-y-3">
                    <Link to={`/projects/${project.slug}`}>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors flex items-center justify-between">
                        <span>{project.title}</span>
                      </h3>
                    </Link>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                      {project.summary}
                    </p>

                    {/* Performance Metric Pill */}
                    {project.metrics && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>{project.metrics}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {project.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2.5 py-0.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/80"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Action Links */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-3">
                        {project.demoUrl && (
                          <a
                            href={project.demoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Live Demo</span>
                          </a>
                        )}
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                          >
                            <Github className="w-3.5 h-3.5" />
                            <span>Repository</span>
                          </a>
                        )}
                      </div>

                      <Link
                        to={`/projects/${project.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                      >
                        <span>Case Study</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Project Preview Modal */}
      {previewProject && (
        <Modal
          isOpen={!!previewProject}
          onClose={() => setPreviewProject(null)}
          title={previewProject.title}
          maxWidth="2xl"
        >
          <div className="space-y-6">
            <img
              src={previewProject.imageUrl}
              alt={previewProject.title}
              className="w-full h-64 object-cover rounded-2xl border border-slate-200 dark:border-slate-800"
            />
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  {previewProject.category}
                </span>
                {previewProject.metrics && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    {previewProject.metrics}
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {previewProject.description}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Technologies Used
              </h4>
              <div className="flex flex-wrap gap-2">
                {previewProject.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-xl text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-4">
                {previewProject.demoUrl && (
                  <a
                    href={previewProject.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-500"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Launch Demo</span>
                  </a>
                )}
                {previewProject.githubUrl && (
                  <a
                    href={previewProject.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>Source Code</span>
                  </a>
                )}
              </div>
              <Link
                to={`/projects/${previewProject.slug}`}
                onClick={() => setPreviewProject(null)}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Read Full Case Study →
              </Link>
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
};
