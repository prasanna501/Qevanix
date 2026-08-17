import React, { useState, useEffect } from 'react';
import { Testimonial } from '../../types';
import { SectionHeading } from '../common/SectionHeading';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { api } from '../../services/api';
import { Star, MessageSquarePlus, Sparkles } from 'lucide-react';

interface TestimonialsSectionProps {
  initialTestimonials?: Testimonial[];
  onOpenReviewModal?: () => void;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ initialTestimonials, onOpenReviewModal }) => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials || []);
  const [loading, setLoading] = useState(!initialTestimonials || initialTestimonials.length === 0);

  const fetchTestimonials = () => {
    api.getTestimonials().then((res) => {
      if (res.data.success) setTestimonials(res.data.data);
    }).finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!initialTestimonials || initialTestimonials.length === 0) {
      fetchTestimonials();
    }
  }, [initialTestimonials]);

  return (
    <section id="testimonials" className="py-24 scroll-mt-20 relative bg-slate-50/70 dark:bg-[#070b14] border-t border-slate-200/60 dark:border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <SectionHeading
            badge="Endorsements & Reviews"
            title="What Visitors & Clients"
            highlightText="Say About My Work"
            subtitle="Genuine reviews and feedback from recruiters, engineering leaders, peers, and collaborators."
          />

          {onOpenReviewModal && (
            <button
              onClick={onOpenReviewModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-600 hover:to-indigo-700 text-white text-xs font-semibold shadow-lg hover:shadow-indigo-500/25 transition-all self-start md:self-auto mb-4 md:mb-12"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Add Your Review</span>
            </button>
          )}
        </div>

        {loading ? (
          <LoadingSpinner text="Loading testimonials & reviews..." />
        ) : testimonials.length === 0 ? (
          <div className="text-center py-12 glass-card rounded-3xl mt-8">
            <p className="text-slate-400 text-sm">No reviews yet. Be the first to leave one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
            {testimonials.map((item) => (
              <div
                key={item.id}
                className="glass-card p-8 rounded-3xl space-y-6 hover:border-indigo-500/40 hover:-translate-y-1 transition-all duration-300 shadow-xl flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>

                  {/* Quote Content */}
                  <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed italic">
                    &quot;{item.content}&quot;
                  </p>
                </div>

                {/* Client Profile */}
                <div className="flex items-center gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <img
                    src={
                      item.clientAvatar ||
                      `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(item.clientName)}`
                    }
                    alt={item.clientName}
                    className="w-12 h-12 rounded-full object-cover border border-indigo-500/30 bg-slate-800"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                      {item.clientName}
                    </h4>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                      {item.clientRole}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {item.clientCompany}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
