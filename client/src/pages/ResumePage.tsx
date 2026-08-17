import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Profile, Experience, Education, Certification, Skill } from '../types';
import { api } from '../services/api';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import {
  Printer,
  ArrowLeft,
  Mail,
  MapPin,
  Globe,
  Briefcase,
  GraduationCap,
  Award,
  CheckCircle2,
} from 'lucide-react';

export const ResumePage: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getProfile(),
      api.getExperiences(),
      api.getEducations(),
      api.getCertifications(),
      api.getSkills(),
    ])
      .then(([pRes, eRes, eduRes, cRes, sRes]) => {
        if (pRes.data.success) setProfile(pRes.data.data);
        if (eRes.data.success) setExperiences(eRes.data.data);
        if (eduRes.data.success) setEducations(eduRes.data.data);
        if (cRes.data.success) setCertifications(cRes.data.data);
        if (sRes.data.success) setSkills(sRes.data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <LoadingSpinner size="lg" text="Generating printable resume..." />
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24 min-h-screen bg-slate-100/60 dark:bg-[#090d16]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation / Action bar */}
        <div className="no-print mb-8 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Portfolio</span>
          </Link>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-indigo-600 text-white hover:bg-indigo-500 shadow-md shadow-indigo-500/20 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print or Save PDF</span>
          </button>
        </div>

        {/* Printable Resume Sheet */}
        <div className="glass-card bg-white dark:bg-[#0f172a] rounded-3xl p-8 sm:p-14 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-10">
          {/* Header */}
          <div className="border-b border-slate-200 dark:border-slate-800 pb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                {profile?.name || 'Qevanix'}
              </h1>
              <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400 mt-1">
                {profile?.title || 'Senior Full-Stack Engineer & Cloud Architect'}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-3 font-medium">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> {profile?.location || 'San Francisco, CA'}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" /> {profile?.email || 'contact@qevanix.dev'}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5" /> https://qevanix.dev
                </span>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="space-y-3">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-400">
              Professional Summary
            </h2>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {profile?.bio}
            </p>
          </div>

          {/* Technical Skills Categorized */}
          <div className="space-y-4">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-400">
              Technical Proficiencies
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <div className="font-bold text-slate-900 dark:text-white mb-1.5">Frontend & State</div>
                <div className="text-slate-600 dark:text-slate-300 leading-normal">
                  {skills
                    .filter((s) => s.category === 'FRONTEND')
                    .map((s) => s.name)
                    .join(', ')}
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <div className="font-bold text-slate-900 dark:text-white mb-1.5">Backend, APIs & Databases</div>
                <div className="text-slate-600 dark:text-slate-300 leading-normal">
                  {skills
                    .filter((s) => s.category === 'BACKEND' || s.category === 'DATABASE')
                    .map((s) => s.name)
                    .join(', ')}
                </div>
              </div>
            </div>
          </div>

          {/* Experience */}
          <div className="space-y-6">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-400">
              Work Experience
            </h2>
            <div className="space-y-8">
              {experiences.map((exp) => (
                <div key={exp.id} className="space-y-2.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-base">
                        {exp.role}
                      </h3>
                      <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                        {exp.company} — {exp.location}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {formatDate(exp.startDate)} — {exp.isCurrent ? 'Present' : exp.endDate ? formatDate(exp.endDate) : ''}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {exp.description}
                  </p>

                  {exp.achievements && exp.achievements.length > 0 && (
                    <ul className="space-y-1.5 pt-1 pl-4 list-disc text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                      {exp.achievements.map((ach, aIdx) => (
                        <li key={aIdx}>{ach}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Education & Certifications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-slate-200 dark:border-slate-800">
            {/* Education */}
            <div className="space-y-4">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-400">
                Education
              </h2>
              {educations.map((edu) => (
                <div key={edu.id} className="space-y-1">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    {edu.degree}
                  </h4>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                    {edu.institution}
                  </p>
                  {edu.grade && (
                    <p className="text-xs text-slate-500 dark:text-slate-400">{edu.grade}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Certifications */}
            <div className="space-y-4">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-400">
                Certifications
              </h2>
              {certifications.map((c) => (
                <div key={c.id} className="space-y-0.5">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">{c.name}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {c.issuer} • Issued {formatDate(c.issueDate)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
