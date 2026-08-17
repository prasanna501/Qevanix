import React, { useState, useEffect } from 'react';
import { Service } from '../../types';
import { SectionHeading } from '../common/SectionHeading';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { api } from '../../services/api';
import {
  LayoutGrid,
  Server,
  CloudLightning,
  Wand2,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Zap,
} from 'lucide-react';

interface ServicesSectionProps {
  initialServices?: Service[];
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ initialServices }) => {
  const [services, setServices] = useState<Service[]>(initialServices || []);
  const [loading, setLoading] = useState(!initialServices || initialServices.length === 0);

  useEffect(() => {
    if (!initialServices || initialServices.length === 0) {
      api.getServices().then((res) => {
        if (res.data.success) setServices(res.data.data);
      }).finally(() => setLoading(false));
    }
  }, [initialServices]);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'LayoutGrid':
        return LayoutGrid;
      case 'Server':
        return Server;
      case 'CloudLightning':
        return CloudLightning;
      default:
        return Wand2;
    }
  };

  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="services" className="py-24 relative bg-slate-50/70 dark:bg-[#070b14] border-t border-slate-200/60 dark:border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="What I Offer"
          title="Specialized Services &"
          highlightText="Engineering Solutions"
          subtitle="From high-performance greenfield application development to enterprise cloud and database modernizations."
        />

        {loading ? (
          <LoadingSpinner text="Loading services catalog..." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((srv, idx) => {
              const Icon = getIcon(srv.icon);
              return (
                <div
                  key={srv.id || idx}
                  className="glass-card p-8 rounded-3xl space-y-6 hover:border-indigo-500/50 hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                        <Icon className="w-6 h-6" />
                      </div>
                      {srv.priceHint && (
                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                          {srv.priceHint}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      {srv.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {srv.description}
                    </p>

                    {/* Features list */}
                    <div className="pt-3 space-y-2.5">
                      {srv.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <button
                      onClick={scrollToContact}
                      className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-500 transition-colors"
                    >
                      <span>Inquire about this service</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
