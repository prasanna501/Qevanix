import React from 'react';
import { Link } from 'react-router-dom';
import { Profile } from '../../types';
import { SectionHeading } from '../common/SectionHeading';
import {
  Download,
  FileText,
  Printer,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface ResumeSectionProps {
  profile: Profile | null;
}

export const ResumeSection: React.FC<ResumeSectionProps> = ({ profile }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <section id="resume" className="py-24 relative bg-slate-100/50 dark:bg-[#090d16] border-t border-slate-200/60 dark:border-slate-800/60">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Curriculum Vitae"
          title="Interactive"
          highlightText="Resume & Profile"
          subtitle="Explore the complete snapshot of professional leadership, technical milestones, and academic qualifications."
        />

        {/* Action Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
            <FileText className="w-5 h-5 text-indigo-500" />
            <span>Updated for 2026 Opportunities</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/resume"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
            >
              <span>View Full Page</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-500 shadow-md shadow-indigo-500/20 transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
          </div>
        </div>

        {/* Resume Preview Card */}
        <div className="glass-card rounded-3xl p-8 sm:p-12 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-8">
          {/* Resume Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-8 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {profile?.name || 'Qevanix'}
              </h3>
              <p className="text-base font-semibold text-indigo-600 dark:text-indigo-400 mt-1">
                {profile?.title || 'Senior Full-Stack Engineer & Cloud Architect'}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                📍 {profile?.location || 'San Francisco, CA'} • ✉️ {profile?.email || 'contact@qevanix.dev'}
              </p>
            </div>

            <div className="text-right sm:text-right">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                {profile?.availabilityStatus || 'Available for Work'}
              </span>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Executive Summary
            </h4>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {profile?.bio ||
                'Full-stack engineer with 6+ years of production experience building high-throughput SaaS platforms, distributed systems, and modern React interfaces.'}
            </p>
          </div>

          {/* Core Technical Proficiencies */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Core Technical Competencies
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <span className="font-bold text-indigo-600 dark:text-indigo-400 block mb-1">Frontend:</span>
                <span className="text-slate-600 dark:text-slate-300">React, Next.js, TypeScript, Tailwind CSS, Redux, Zustand</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <span className="font-bold text-purple-600 dark:text-purple-400 block mb-1">Backend & APIs:</span>
                <span className="text-slate-600 dark:text-slate-300">Node.js, Express, REST APIs, GraphQL, Microservices, Python</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <span className="font-bold text-emerald-600 dark:text-emerald-400 block mb-1">Data & Cloud:</span>
                <span className="text-slate-600 dark:text-slate-300">PostgreSQL, Prisma, Redis, Docker, AWS, CI/CD, Kubernetes</span>
              </div>
            </div>
          </div>

          {/* Quick CTA to Full Resume Page */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Want the unformatted print version with all detailed bullet points?
            </span>
            <Link
              to="/resume"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              <span>Open Dedicated Resume Page</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
