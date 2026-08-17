import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Star, X, MessageSquareHeart, Sparkles, Send, CheckCircle2, User, Building, Award } from 'lucide-react';

interface ReviewSuggestionModalProps {
  onReviewSubmitted?: () => void;
}

const PRESET_TAGS = [
  '⚡ Modern UI & Animations',
  '🚀 Clean Code & Structure',
  '🎯 Great Project Demos',
  '💼 Strong Hiring Potential',
  '🌟 Impressive BCA Developer',
];

export const ReviewSuggestionModal: React.FC<ReviewSuggestionModalProps> = ({ onReviewSubmitted }) => {
  const { success, error, info } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isPromptBannerVisible, setIsPromptBannerVisible] = useState(false);
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Trigger auto-suggestion after time or scroll depth
  useEffect(() => {
    const isDismissed = localStorage.getItem('qevanix_review_dismissed');
    const isAlreadyReviewed = localStorage.getItem('qevanix_review_submitted');

    if (isDismissed || isAlreadyReviewed) return;

    let triggered = false;

    const triggerSuggestion = () => {
      if (triggered) return;
      triggered = true;
      setIsPromptBannerVisible(true);
    };

    // 1. Timer trigger: 18 seconds
    const timer = setTimeout(triggerSuggestion, 18000);

    // 2. Scroll trigger: scrolled 35% of page
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0 && scrollY / docHeight > 0.35) {
        triggerSuggestion();
        window.removeEventListener('scroll', handleScroll);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleDismissBanner = () => {
    setIsPromptBannerVisible(false);
    // Don't auto pop up again for 3 days
    localStorage.setItem('qevanix_review_dismissed', Date.now().toString());
  };

  const handleOpenFullModal = () => {
    setIsPromptBannerVisible(false);
    setIsOpen(true);
  };

  const handleAddTag = (tag: string) => {
    if (content.includes(tag)) return;
    setContent((prev) => (prev ? `${prev} | ${tag}` : tag));
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      error('Please enter your name');
      return;
    }
    if (!content.trim() || content.trim().length < 5) {
      error('Please write a brief review (at least 5 characters)');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.submitPublicReview({
        clientName: name.trim(),
        clientRole: role.trim() || 'Visitor / Tech Enthusiast',
        clientCompany: company.trim() || 'Tech Community',
        content: content.trim(),
        rating,
        clientAvatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name.trim())}`,
      });

      if (res.data.success) {
        setIsSubmitted(true);
        localStorage.setItem('qevanix_review_submitted', 'true');
        success('Thank you! Your review is now live on the site.', 'Review Published 🎉');
        if (onReviewSubmitted) onReviewSubmitted();
      }
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRatingLabel = (r: number) => {
    switch (r) {
      case 1:
        return 'Needs Work';
      case 2:
        return 'Fair';
      case 3:
        return 'Good';
      case 4:
        return 'Very Impressive!';
      case 5:
        return 'Outstanding & Ready to Hire! 🔥';
      default:
        return 'Rate Experience';
    }
  };

  return (
    <>
      {/* 1. Permanent Floating Review Button (Bottom Right) */}
      <div className="fixed bottom-5 right-5 z-40">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-amber-500 via-indigo-600 to-indigo-700 text-white font-semibold text-xs shadow-xl hover:shadow-amber-500/25 hover:scale-105 transition-all duration-300 border border-amber-300/40"
          aria-label="Leave a review"
        >
          <Star className="w-4 h-4 fill-amber-300 text-amber-200 animate-spin-slow" />
          <span>Leave a Review</span>
        </button>
      </div>

      {/* 2. Automatic Smart Suggestion Slide-in Card (Auto-pops up) */}
      {isPromptBannerVisible && !isOpen && (
        <div className="fixed bottom-20 right-5 z-40 max-w-sm w-[90vw] p-5 rounded-2xl bg-slate-900/95 dark:bg-[#0c1222]/95 backdrop-blur-xl border border-amber-500/40 shadow-2xl text-white animate-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5 text-amber-400">
              <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/30">
                <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">Enjoying the Portfolio?</h4>
                <p className="text-[11px] text-slate-300">Share quick feedback or rate this work!</p>
              </div>
            </div>
            <button
              onClick={handleDismissBanner}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              aria-label="Close review suggestion"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-4 flex items-center justify-between gap-2">
            <div className="flex gap-1 text-amber-400">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => {
                    setRating(star);
                    handleOpenFullModal();
                  }}
                  className="hover:scale-125 transition-transform"
                >
                  <Star className="w-5 h-5 fill-amber-400" />
                </button>
              ))}
            </div>

            <button
              onClick={handleOpenFullModal}
              className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition"
            >
              Write Review
            </button>
          </div>
        </div>
      )}

      {/* 3. Full Review & Feedback Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-lg rounded-3xl bg-slate-900 dark:bg-[#0b101e] border border-slate-700/80 dark:border-indigo-500/30 shadow-2xl p-6 sm:p-8 text-white max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {isSubmitted ? (
              <div className="py-8 text-center space-y-4 animate-in zoom-in-95">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-white">Review Submitted!</h3>
                <p className="text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
                  Thank you for taking the time to share your review and feedback. Your endorsement is now published in the portfolio endorsements section!
                </p>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setIsOpen(false);
                  }}
                  className="mt-4 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition shadow-lg"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-5">
                {/* Header */}
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold">
                    <MessageSquareHeart className="w-3.5 h-3.5" />
                    <span>Community Review & Feedback</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                    Rate Your Experience
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400">
                    Your feedback helps me grow as a BCA full-stack developer.
                  </p>
                </div>

                {/* Interactive Star Rating Selector */}
                <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 text-center space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 text-amber-400 hover:scale-125 transition-transform"
                      >
                        <Star
                          className={`w-7 h-7 sm:w-8 sm:h-8 ${
                            star <= (hoverRating || rating)
                              ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                              : 'text-slate-600'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <div className="text-xs font-semibold text-amber-300">
                    {getRatingLabel(hoverRating || rating)}
                  </div>
                </div>

                {/* Quick Presets */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-indigo-400" />
                    <span>Quick Highlight Tags (Click to add):</span>
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {PRESET_TAGS.map((tag) => (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => handleAddTag(tag)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-indigo-600/30 border border-slate-700 hover:border-indigo-500/50 text-[11px] text-slate-300 transition"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Form Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-300">Your Name *</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Alex Rivera"
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500 transition"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-300">Role / Designation</label>
                    <div className="relative">
                      <Award className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        placeholder="e.g. Recruiter / Peer Dev"
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500 transition"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-300">Company / Organization / College</label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. TechCorp / Freelance / BCA Student"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500 transition"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-300">Your Review & Feedback *</label>
                  <textarea
                    required
                    rows={3}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write a few words about my projects, coding style, design, or overall portfolio..."
                    className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500 transition resize-none"
                  />
                </div>

                {/* Submit Action */}
                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-semibold shadow-lg hover:shadow-indigo-500/25 transition disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Publishing...</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Publish Review</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};
