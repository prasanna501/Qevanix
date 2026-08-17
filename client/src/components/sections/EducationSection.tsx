import React, { useState, useEffect } from 'react';
import { Education } from '../../types';
import { SectionHeading } from '../common/SectionHeading';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { api } from '../../services/api';
import { GraduationCap, MapPin, Calendar, Award, BookOpen } from 'lucide-react';

interface EducationSectionProps {
  initialEducations?: Education[];
}

export const EducationSection: React.FC<EducationSectionProps> = ({ initialEducations }) => {
  const [educations, setEducations] = useState<Education[]>(initialEducations || []);
  const [loading, setLoading] = useState(!initialEducations || initialEducations.length === 0);

  useEffect(() => {
    if (!initialEducations || initialEducations.length === 0) {
      api.getEducations().then((res) => {
        if (res.data.success) setEducations(res.data.data);
      }).finally(() => setLoading(false));
    }
  }, [initialEducations]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { year: 'numeric' });
  };

  return (
    <section id="education" className="py-24 relative bg-slate-100/40 dark:bg-[#090d16] border-t border-slate-200/60 dark:border-slate-800/60">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Academic Background"
          title="Education &"
          highlightText="Foundations"
          subtitle="Formal computer science foundation and rigorous academic training in distributed algorithms and software engineering."
        />

        {loading ? (
          <LoadingSpinner text="Loading academic history..." />
        ) : (
          <div className="grid grid-cols-1 gap-6 mt-8">
            {educations.map((edu) => (
              <div
                key={edu.id}
                className="glass-card p-8 rounded-3xl space-y-4 hover:border-indigo-500/40 transition-all shadow-lg"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold shadow-inner">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                        {edu.degree}
                      </h3>
                      <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                        {edu.institution} — {edu.fieldOfStudy}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      {formatDate(edu.startDate)} — {edu.isCurrent ? 'Present' : edu.endDate ? formatDate(edu.endDate) : ''}
                    </span>
                    {edu.location && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" /> {edu.location}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {edu.grade && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 text-xs font-bold">
                    <Award className="w-3.5 h-3.5" />
                    <span>{edu.grade}</span>
                  </div>
                )}

                {edu.description && (
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
                    {edu.description}
                  </p>
                )}

                {edu.activities && (
                  <div className="text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800">
                    <strong className="text-slate-700 dark:text-slate-300">Activities & Honors:</strong>{' '}
                    {edu.activities}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
