import React, { useState, useEffect } from 'react';
import { Experience } from '../../types';
import { SectionHeading } from '../common/SectionHeading';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { api } from '../../services/api';
import {
  Briefcase,
  Calendar,
  MapPin,
  ExternalLink,
  CheckCircle2,
  Building2,
} from 'lucide-react';

interface ExperienceSectionProps {
  initialExperiences?: Experience[];
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ initialExperiences }) => {
  const [experiences, setExperiences] = useState<Experience[]>(initialExperiences || []);
  const [loading, setLoading] = useState(!initialExperiences || initialExperiences.length === 0);

  useEffect(() => {
    if (!initialExperiences || initialExperiences.length === 0) {
      api.getExperiences().then((res) => {
        if (res.data.success) setExperiences(res.data.data);
      }).finally(() => setLoading(false));
    }
  }, [initialExperiences]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <section id="experience" className="py-24 scroll-mt-20 relative bg-slate-50/70 dark:bg-[#070b14] border-t border-slate-200/60 dark:border-slate-800/60">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Career Journey"
          title="Professional"
          highlightText="Work Experience"
          subtitle="Track record of architectural leadership and high-scale full-stack execution across top tech organizations."
        />

        {loading ? (
          <LoadingSpinner text="Loading career timeline..." />
        ) : (
          <div className="relative border-l-2 border-indigo-500/30 dark:border-indigo-500/20 ml-4 md:ml-32 space-y-12 mt-12">
            {experiences.map((exp, idx) => (
              <div key={exp.id || idx} className="relative pl-8 md:pl-10 group">
                {/* Timeline node icon */}
                <div className="absolute -left-[17px] top-1.5 w-8 h-8 rounded-full bg-white dark:bg-slate-900 border-2 border-indigo-500 flex items-center justify-center text-indigo-500 shadow-md group-hover:scale-110 transition-transform">
                  <Briefcase className="w-4 h-4" />
                </div>

                {/* Left Date Label for Desktop */}
                <div className="hidden md:block absolute -left-36 top-2 text-right w-28 text-xs font-bold text-slate-500 dark:text-slate-400">
                  {formatDate(exp.startDate)} — {exp.isCurrent ? 'Present' : exp.endDate ? formatDate(exp.endDate) : ''}
                </div>

                {/* Card */}
                <div className="glass-card p-7 sm:p-8 rounded-3xl space-y-5 shadow-lg hover:border-indigo-500/50 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                        {exp.role}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-4 h-4" />
                          {exp.company}
                        </span>
                        {exp.companyUrl && (
                          <a
                            href={exp.companyUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-slate-400 hover:text-indigo-500"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                        <span className="text-slate-400">•</span>
                        <span className="text-xs font-normal text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {exp.location}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="md:hidden text-xs font-semibold text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(exp.startDate)} — {exp.isCurrent ? 'Present' : exp.endDate ? formatDate(exp.endDate) : ''}
                      </span>
                      {exp.isCurrent && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          Current
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {exp.description}
                  </p>

                  {/* Achievements */}
                  {exp.achievements && exp.achievements.length > 0 && (
                    <div className="space-y-2 pt-1">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Key Accomplishments
                      </h4>
                      <div className="space-y-2">
                        {exp.achievements.map((ach, aIdx) => (
                          <div key={aIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                            <CheckCircle2 className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                            <span>{ach}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Technologies */}
                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap gap-1.5">
                      {exp.technologies.map((tech, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2.5 py-0.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/80"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
