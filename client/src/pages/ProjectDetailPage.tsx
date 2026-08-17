import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Project } from '../types';
import { api } from '../services/api';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import {
  ExternalLink,
  Github,
  ArrowLeft,
  Calendar,
  Layers,
  Building2,
  TrendingUp,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

export const ProjectDetailPage: React.FC = () => {
  const { idOrSlug } = useParams<{ idOrSlug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    if (idOrSlug) {
      setLoading(true);
      api.getProject(idOrSlug)
        .then((res) => {
          if (res.data.success) {
            setProject(res.data.data);
            setSelectedImage(res.data.data.imageUrl);
          }
        })
        .catch(() => {
          setProject(null);
        })
        .finally(() => setLoading(false));
    }
  }, [idOrSlug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <LoadingSpinner size="lg" text="Loading project case study..." />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20 px-4 text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Project Not Found</h2>
        <p className="text-slate-500 mt-2">The requested project could not be found.</p>
        <Link
          to="/#projects"
          className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Projects</span>
        </Link>
      </div>
    );
  }

  const gallery = [project.imageUrl, ...(project.galleryImages || [])].filter(
    (val, idx, self) => self.indexOf(val) === idx && !!val
  );

  return (
    <div className="pt-28 pb-24 min-h-screen bg-slate-50/50 dark:bg-[#090d16]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to previous page</span>
          </button>
        </div>

        {/* Project Header */}
        <div className="space-y-4 mb-10">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              {project.category}
            </span>
            {project.isFeatured && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                <Sparkles className="w-3.5 h-3.5" />
                Featured Project
              </span>
            )}
            {project.clientName && (
              <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
                <Building2 className="w-3.5 h-3.5" /> Client: {project.clientName}
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight">
            {project.title}
          </h1>

          <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
            {project.summary}
          </p>

          {/* Action Links */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/20 hover:scale-[1.02] transition-all"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Visit Live Application</span>
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>View Source Code</span>
              </a>
            )}
          </div>
        </div>

        {/* Gallery & Showcase */}
        <div className="space-y-4 mb-12">
          <div className="relative h-[320px] sm:h-[480px] w-full rounded-3xl overflow-hidden glass-card border border-slate-200 dark:border-slate-800 shadow-2xl">
            <img
              src={selectedImage || project.imageUrl}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </div>

          {gallery.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-28 h-20 rounded-2xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                    selectedImage === img
                      ? 'border-indigo-500 scale-105 shadow-md'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Project Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Description */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card rounded-3xl p-8 space-y-4 shadow-xl">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Project Overview & Architecture
              </h2>
              <div className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line space-y-3">
                {project.description}
              </div>
            </div>
          </div>

          {/* Sidebar Metadata */}
          <div className="space-y-6">
            {/* Metrics */}
            {project.metrics && (
              <div className="glass-card rounded-3xl p-6 space-y-3 shadow-lg border-emerald-500/30 bg-emerald-500/5">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                  <TrendingUp className="w-4 h-4" />
                  <span>Performance & Impact</span>
                </div>
                <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {project.metrics}
                </div>
              </div>
            )}

            {/* Stack Tags */}
            <div className="glass-card rounded-3xl p-6 space-y-4 shadow-lg">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Technology Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-xl text-xs font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Inquire CTA */}
            <div className="glass-card rounded-3xl p-6 space-y-4 shadow-lg text-center">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                Need a similar system built?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Let&apos;s discuss requirements, timeline, and architectural approach.
              </p>
              <Link
                to="/#contact"
                className="inline-block w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-500 transition-colors shadow-md"
              >
                Schedule Consultation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
