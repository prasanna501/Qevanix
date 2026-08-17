import React, { useState } from 'react';
import { Profile } from '../../types';
import { SectionHeading } from '../common/SectionHeading';
import {
  Code2,
  Terminal,
  Database,
  Cpu,
  Layers,
  Sparkles,
  Shield,
  Zap,
  Globe,
  Award,
  CheckCircle,
} from 'lucide-react';

interface AboutSectionProps {
  profile: Profile | null;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ profile }) => {
  const [activeTab, setActiveTab] = useState<'principles' | 'stack' | 'story'>('principles');

  const principles = [
    {
      icon: Zap,
      title: 'Performance-First Engineering',
      desc: 'Obsessed with sub-second page loads, minimal DOM redraws, zero-overhead bundle footprints, and sub-millisecond database queries.',
    },
    {
      icon: Shield,
      title: 'Bulletproof Reliability & Security',
      desc: 'Designing strict TypeScript contracts, PostgreSQL constraints, automated regression tests, and role-based access control from day zero.',
    },
    {
      icon: Layers,
      title: 'Clean Modular Architecture',
      desc: 'Domain-driven code structure that scales smoothly from rapid MVP validation to multi-team enterprise feature velocity.',
    },
    {
      icon: Globe,
      title: 'Accessibility & User Empathy',
      desc: 'Ensuring seamless keyboard navigation, WCAG contrast compliance, responsive fluidity, and delight at every user interaction.',
    },
  ];

  return (
    <section id="about" className="py-24 relative bg-slate-50/50 dark:bg-[#070b14] border-t border-slate-200/60 dark:border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="About The Architect"
          title="Crafting Digital Products with"
          highlightText="Technical Mastery."
          subtitle="A full-stack engineer blending rigorous computer science fundamentals with modern product intuition."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mt-12">
          {/* Left Column: Bio & Core Narrative */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-card rounded-3xl p-8 space-y-6 shadow-xl">
              <div className="flex items-center gap-4">
                <img
                  src={
                    profile?.avatarUrl ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
                  }
                  alt={profile?.name || 'Qevanix'}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-indigo-500 shadow-md"
                />
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                    {profile?.name || 'Qevanix'}
                  </h3>
                  <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                    {profile?.title || 'Senior Full-Stack Engineer'}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    📍 {profile?.location || 'San Francisco, CA'}
                  </p>
                </div>
              </div>

              <div className="text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed space-y-3">
                <p>
                  {profile?.bio ||
                    'I am a Full-Stack Engineer with 6+ years of experience building mission-critical SaaS platforms, distributed real-time systems, and high-conversion web applications.'}
                </p>
                {profile?.aboutSnippet && (
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {profile.aboutSnippet}
                  </p>
                )}
              </div>

              {/* Stat Highlights */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="p-3.5 rounded-2xl bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/15">
                  <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                    {profile?.codeCommits || 4500}+
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Git Commits</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-purple-500/5 dark:bg-purple-500/10 border border-purple-500/15">
                  <div className="text-2xl font-black text-purple-600 dark:text-purple-400">
                    {profile?.completedProjects || 38}+
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Production Apps</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Tabbed Deep Dive */}
          <div className="lg:col-span-7 space-y-6">
            {/* Tab Selector */}
            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-200/70 dark:bg-slate-800/80 border border-slate-300/60 dark:border-slate-700/60">
              <button
                onClick={() => setActiveTab('principles')}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeTab === 'principles'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Core Principles
              </button>
              <button
                onClick={() => setActiveTab('stack')}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeTab === 'stack'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Tech Philosophy
              </button>
              <button
                onClick={() => setActiveTab('story')}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeTab === 'story'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Workflow & Process
              </button>
            </div>

            {/* Tab 1: Core Principles */}
            {activeTab === 'principles' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
                {principles.map((item, idx) => (
                  <div
                    key={idx}
                    className="glass-card p-6 rounded-3xl space-y-3 hover:border-indigo-500/40 transition-colors shadow-lg"
                  >
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      {item.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 2: Tech Philosophy */}
            {activeTab === 'stack' && (
              <div className="glass-card p-8 rounded-3xl space-y-5 animate-fade-in shadow-lg text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                <h4 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-500" />
                  Pragmatic, Modern & Resilient Stack Choices
                </h4>
                <p>
                  I believe in picking technologies that offer excellent developer ergonomics without compromising raw execution speed and observability.
                </p>
                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 dark:text-white">TypeScript Everywhere:</strong> Shared contracts between Express REST endpoints and React client state eliminate entire classes of runtime errors.
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 dark:text-white">PostgreSQL & Prisma ORM:</strong> Strong relational data integrity, automated migration rollouts, and optimized index structures for zero-downtime scaling.
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 dark:text-white">Tailwind CSS & Component Tokens:</strong> Clean utility classes for unified spacing, accessible color contrasts, and seamless dark/light mode switching.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Story / Workflow */}
            {activeTab === 'story' && (
              <div className="glass-card p-8 rounded-3xl space-y-4 animate-fade-in shadow-lg text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                <h4 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-purple-500" />
                  From Spec to Production in 4 Sprints
                </h4>
                <div className="space-y-4 pt-2">
                  <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase">Phase 1: Architecture & Data Schema</span>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Entity-relationship modeling, API contract definition, and database indexing strategies.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase">Phase 2: Core Backend & Auth Security</span>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">REST API endpoints, JWT token guards, validation middleware, and automated test suites.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase">Phase 3: Frontend UX & State Orchestration</span>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Pixel-perfect React component assembly, optimistic UI updates, responsive layouts, and animations.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase">Phase 4: CI/CD & Production Observability</span>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Docker containerization, health checks, error logging, and performance telemetry.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
