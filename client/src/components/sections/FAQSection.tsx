import React, { useState, useEffect } from 'react';
import { FAQ } from '../../types';
import { SectionHeading } from '../common/SectionHeading';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { api } from '../../services/api';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';

interface FAQSectionProps {
  initialFAQs?: FAQ[];
}

export const FAQSection: React.FC<FAQSectionProps> = ({ initialFAQs }) => {
  const [faqs, setFaqs] = useState<FAQ[]>(initialFAQs || []);
  const [openId, setOpenId] = useState<string | null>(null);
  const [loading, setLoading] = useState(!initialFAQs || initialFAQs.length === 0);

  useEffect(() => {
    if (!initialFAQs || initialFAQs.length === 0) {
      api.getFAQs().then((res) => {
        if (res.data.success) {
          setFaqs(res.data.data);
          if (res.data.data.length > 0) {
            setOpenId(res.data.data[0].id);
          }
        }
      }).finally(() => setLoading(false));
    } else if (initialFAQs.length > 0) {
      setOpenId(initialFAQs[0].id);
    }
  }, [initialFAQs]);

  const toggleFAQ = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="py-24 relative bg-slate-50/70 dark:bg-[#070b14] border-t border-slate-200/60 dark:border-slate-800/60">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Frequently Asked Questions"
          title="Common Questions &"
          highlightText="Clarifications"
          subtitle="Everything you need to know about working together, project onboarding, and technical capabilities."
        />

        {loading ? (
          <LoadingSpinner text="Loading FAQs..." />
        ) : (
          <div className="space-y-4 mt-8">
            {faqs.map((faq) => {
              const isOpen = openId === faq.id;
              return (
                <div
                  key={faq.id}
                  className={`rounded-3xl border transition-all duration-300 overflow-hidden ${
                    isOpen
                      ? 'glass-card border-indigo-500/40 shadow-xl'
                      : 'bg-white/70 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left transition-colors"
                  >
                    <span className="font-bold text-base sm:text-lg text-slate-900 dark:text-white flex items-center gap-3">
                      <HelpCircle className={`w-5 h-5 flex-shrink-0 ${isOpen ? 'text-indigo-500' : 'text-slate-400'}`} />
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-indigo-500' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-1 text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 animate-fade-in">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
