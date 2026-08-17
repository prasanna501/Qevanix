import React from 'react';
import { Profile } from '../../types';
import {
  ArrowRight,
  Download,
  Github,
  Linkedin,
  Mail,
  Sparkles,
  Terminal,
  Code2,
  Database,
  Layers,
  CheckCircle2,
} from 'lucide-react';

interface HeroSectionProps {
  profile: Profile | null;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ profile }) => {
  const scrollTo = (id: string) => {
    const elem = document.getElementById(id);
    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-20 overflow-hidden bg-grid-pattern"
    >
      {/* Background radial glowing ambient orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-indigo-500/15 dark:bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-purple-500/10 dark:bg-purple-600/15 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Main Hero Text Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Availability Pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-850 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-xs font-semibold shadow-sm">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-slate-800 dark:text-slate-200">
                {profile?.availabilityStatus || 'Available for high-impact projects & engineering roles'}
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
              Architecting{' '}
              <span className="gradient-text">Resilient Systems</span> & Modern Digital Experiences.
            </h1>

            {/* Subheadline & Bio snippet */}
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              {profile?.heroSubheadline ||
                'Senior Full-Stack Engineer specializing in React, TypeScript, Node.js, and PostgreSQL cloud architectures.'}
            </p>

            {/* Quick Tech Highlights */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1 text-xs font-medium text-slate-600 dark:text-slate-400">
              <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-indigo-500" /> React & Next.js
              </span>
              <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-purple-500" /> Node.js / TypeScript
              </span>
              <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-emerald-500" /> PostgreSQL & Prisma
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
              <button
                onClick={() => scrollTo('projects')}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/35 transition-all hover:scale-[1.02]"
              >
                <span>Explore Projects</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => scrollTo('contact')}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm transition-all hover:scale-[1.02]"
              >
                <Mail className="w-4 h-4 text-indigo-500" />
                <span>Contact Me</span>
              </button>

              <a
                href="/resume"
                className="inline-flex items-center gap-2 px-4 py-3.5 rounded-xl font-medium text-sm text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Resume</span>
              </a>
            </div>

            {/* Metric counters */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200/80 dark:border-slate-800/80 max-w-md mx-auto lg:mx-0">
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                  {profile?.yearsExperience || 6}+
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Years Experience</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                  {profile?.completedProjects || 40}+
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Projects Shipped</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                  {profile?.satisfiedClients || 25}+
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Happy Clients</div>
              </div>
            </div>
          </div>

          {/* Right Visual Card Column */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md">
              {/* Decorative background gradient ring */}
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl blur-xl opacity-30 animate-pulse-slow"></div>

              {/* Glass Profile & Code Terminal Card */}
              <div className="relative rounded-3xl glass-card p-6 shadow-2xl space-y-5">
                {/* Terminal Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80"></span>
                    <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
                  </div>
                  <span className="text-xs font-mono text-slate-400">qevanix.engineer.ts</span>
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                </div>

                {/* Avatar and title */}
                <div className="flex items-center gap-4">
                  <img
                    src={
                      profile?.avatarUrl ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
                    }
                    alt={profile?.name || 'Qevanix'}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-500/40 shadow-md"
                  />
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {profile?.name || 'Qevanix'}
                    </h3>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                      {profile?.title || 'Senior Full-Stack Engineer'}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {profile?.location || 'San Francisco, CA'}
                    </p>
                  </div>
                </div>

                {/* Simulated interactive code block */}
                <div className="bg-slate-900 text-slate-200 p-4 rounded-2xl font-mono text-xs space-y-1.5 shadow-inner border border-slate-800 overflow-x-auto">
                  <div className="text-slate-500">// Engineering Profile Contract</div>
                  <div>
                    <span className="text-purple-400">const</span>{' '}
                    <span className="text-blue-300">architect</span> = {'{'}
                  </div>
                  <div className="pl-4">
                    <span className="text-slate-400">name:</span>{' '}
                    <span className="text-emerald-300">&apos;{profile?.name || 'Qevanix'}&apos;</span>,
                  </div>
                  <div className="pl-4">
                    <span className="text-slate-400">status:</span>{' '}
                    <span className="text-emerald-300">&apos;Open for Innovation&apos;</span>,
                  </div>
                  <div className="pl-4">
                    <span className="text-slate-400">focus:</span> [
                    <span className="text-amber-300">&apos;React&apos;</span>,{' '}
                    <span className="text-amber-300">&apos;Node.js&apos;</span>,{' '}
                    <span className="text-amber-300">&apos;Postgres&apos;</span>],
                  </div>
                  <div className="pl-4">
                    <span className="text-slate-400">uptime:</span>{' '}
                    <span className="text-indigo-300">99.99</span>,
                  </div>
                  <div>{'};'}</div>
                </div>

                {/* Floating Status Badges */}
                <div className="flex items-center justify-between text-xs font-medium pt-2">
                  <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    Clean Architecture
                  </span>
                  <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
                    <Layers className="w-4 h-4" />
                    Distributed Systems
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
