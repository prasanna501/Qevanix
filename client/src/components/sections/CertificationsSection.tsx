import React, { useState, useEffect } from 'react';
import { Certification } from '../../types';
import { SectionHeading } from '../common/SectionHeading';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { api } from '../../services/api';
import { Award, ExternalLink, ShieldCheck, Calendar } from 'lucide-react';

interface CertificationsSectionProps {
  initialCertifications?: Certification[];
}

export const CertificationsSection: React.FC<CertificationsSectionProps> = ({ initialCertifications }) => {
  const [certs, setCerts] = useState<Certification[]>(initialCertifications || []);
  const [loading, setLoading] = useState(!initialCertifications || initialCertifications.length === 0);

  useEffect(() => {
    if (!initialCertifications || initialCertifications.length === 0) {
      api.getCertifications().then((res) => {
        if (res.data.success) setCerts(res.data.data);
      }).finally(() => setLoading(false));
    }
  }, [initialCertifications]);

  const formatDate = (dStr: string) => {
    const d = new Date(dStr);
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <section id="certifications" className="py-24 relative bg-slate-50/70 dark:bg-[#070b14] border-t border-slate-200/60 dark:border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Verified Credentials"
          title="Industry"
          highlightText="Certifications & Badges"
          subtitle="Validated proficiencies in cloud architecture, container orchestration, and modern engineering standards."
        />

        {loading ? (
          <LoadingSpinner text="Loading certifications..." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {certs.map((cert) => (
              <div
                key={cert.id}
                className="glass-card p-6 rounded-3xl space-y-4 hover:border-indigo-500/50 hover:-translate-y-1 transition-all duration-300 shadow-lg flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center shadow-md">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Issued {formatDate(cert.issueDate)}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                    {cert.name}
                  </h3>
                  <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                    {cert.issuer}
                  </p>

                  {cert.credentialId && (
                    <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                      ID: {cert.credentialId}
                    </div>
                  )}
                </div>

                {cert.credentialUrl && (
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-colors"
                    >
                      <span>Verify Credential</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
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
