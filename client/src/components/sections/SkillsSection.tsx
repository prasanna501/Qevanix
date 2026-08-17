import React, { useState, useEffect } from 'react';
import { Skill, SkillCategory } from '../../types';
import { SectionHeading } from '../common/SectionHeading';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { api } from '../../services/api';
import {
  Code2,
  Server,
  Database,
  Cloud,
  Wrench,
  CheckCircle2,
  Flame,
  Layers,
  Sparkles,
} from 'lucide-react';

interface SkillsSectionProps {
  initialSkills?: Skill[];
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ initialSkills }) => {
  const [skills, setSkills] = useState<Skill[]>(initialSkills || []);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [loading, setLoading] = useState(!initialSkills || initialSkills.length === 0);

  useEffect(() => {
    if (!initialSkills || initialSkills.length === 0) {
      api.getSkills().then((res) => {
        if (res.data.success) {
          setSkills(res.data.data);
        }
      }).finally(() => setLoading(false));
    }
  }, [initialSkills]);

  const categories = [
    { label: 'All Technologies', value: 'ALL', icon: Layers },
    { label: 'Frontend', value: 'FRONTEND', icon: Code2 },
    { label: 'Backend & APIs', value: 'BACKEND', icon: Server },
    { label: 'Database & Caching', value: 'DATABASE', icon: Database },
    { label: 'DevOps & Cloud', value: 'DEVOPS_CLOUD', icon: Cloud },
    { label: 'Architecture & Tools', value: 'TOOLS_ARCHITECTURE', icon: Wrench },
  ];

  const filteredSkills = skills.filter((s) => {
    if (selectedCategory === 'ALL') return true;
    return s.category === selectedCategory;
  });

  const getCategoryBadge = (cat: SkillCategory) => {
    switch (cat) {
      case 'FRONTEND':
        return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'BACKEND':
        return 'text-purple-500 bg-purple-500/10 border-purple-500/20';
      case 'DATABASE':
        return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'DEVOPS_CLOUD':
        return 'text-sky-500 bg-sky-500/10 border-sky-500/20';
      default:
        return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    }
  };

  const getProficiencyLabel = (pct: number) => {
    if (pct >= 90) return 'Expert';
    if (pct >= 80) return 'Advanced';
    return 'Proficient';
  };

  return (
    <section id="skills" className="py-24 scroll-mt-20 relative bg-slate-100/40 dark:bg-[#090d16] border-t border-slate-200/60 dark:border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Technical Arsenal"
          title="Skills &"
          highlightText="Engineering Stack"
          subtitle="A comprehensive overview of programming languages, frameworks, cloud tooling, and databases I use in production."
        />

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((c) => {
            const Icon = c.icon;
            const isSelected = selectedCategory === c.value;
            return (
              <button
                key={c.value}
                onClick={() => setSelectedCategory(c.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 scale-[1.02]'
                    : 'bg-white dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/40'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{c.label}</span>
              </button>
            );
          })}
        </div>

        {/* Skills Cards Grid */}
        {loading ? (
          <LoadingSpinner text="Loading skills catalog..." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSkills.map((skill) => (
              <div
                key={skill.id}
                className="glass-card p-6 rounded-3xl space-y-4 hover:border-indigo-500/40 hover:-translate-y-1 transition-all duration-300 shadow-md group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm shadow-inner group-hover:scale-105 transition-transform">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-base">
                        {skill.name}
                      </h4>
                      <span
                        className={`inline-block px-2 py-0.5 mt-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border ${getCategoryBadge(
                          skill.category
                        )}`}
                      >
                        {skill.category.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400">
                      {skill.proficiency}%
                    </span>
                    <div className="text-[10px] font-medium text-slate-400">
                      {getProficiencyLabel(skill.proficiency)}
                    </div>
                  </div>
                </div>

                {/* Animated Progress Bar */}
                <div className="w-full bg-slate-200 dark:bg-slate-800/80 rounded-full h-2 overflow-hidden p-0.5">
                  <div
                    className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-full rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${skill.proficiency}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
