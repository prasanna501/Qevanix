import React, { useState } from 'react';
import { Profile } from '../../types';
import { SectionHeading } from '../common/SectionHeading';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';
import {
  Mail,
  Send,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Phone,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';

interface ContactSectionProps {
  profile: Profile | null;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ profile }) => {
  const { success, error } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errs.name = 'Please enter your name (at least 2 characters).';
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!formData.subject.trim() || formData.subject.trim().length < 3) {
      errs.subject = 'Please enter a subject (at least 3 characters).';
    }
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      errs.message = 'Please provide a detailed message (at least 10 characters).';
    }
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const res = await api.submitContact(formData);
      if (res.data.success) {
        setSubmitted(true);
        success('Thank you! Your message was sent and saved to PostgreSQL.', 'Message Sent');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        error(res.data.message || 'Failed to submit message.', 'Submission Error');
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || 'An error occurred while sending your message. Please try again.';
      error(msg, 'Network Error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 scroll-mt-20 relative bg-slate-100/40 dark:bg-[#090d16] border-t border-slate-200/60 dark:border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Get In Touch"
          title="Let&apos;s Build Something"
          highlightText="Extraordinary"
          subtitle="Have a project in mind, an engineering leadership role, or need architectural consultation? Send a message below."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-12 items-start">
          {/* Left Column: Direct Contact Details & Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-card rounded-3xl p-8 space-y-6 shadow-xl">
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-indigo-500" />
                Contact Information
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                I am actively considering high-impact full-stack software engineering roles, distributed systems consulting, and technical advisory contracts.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</div>
                    <a
                      href={`mailto:${profile?.email || 'contact@qevanix.dev'}`}
                      className="text-sm font-semibold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                      {profile?.email || 'contact@qevanix.dev'}
                    </a>
                  </div>
                </div>

                {profile?.phone && (
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phone / Direct</div>
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">
                        {profile.phone}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Primary Location</div>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                      {profile?.location || 'San Francisco, CA (Open to Remote)'}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Response SLA</div>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                      Typically within 24 business hours
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-850 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300">
                <ShieldCheck className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <span>All submissions are encrypted and stored safely in our PostgreSQL database.</span>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="glass-card rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6">
              {submitted ? (
                <div className="text-center py-12 space-y-4 animate-fade-in">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                    Thank you for reaching out. Your inquiry has been stored in PostgreSQL and notification has been dispatched. I will review and reply promptly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-500 shadow-md"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Name */}
                    <div className="space-y-1.5">
                      <label htmlFor="contact-name" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        Your Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => {
                          setFormData({ ...formData, name: e.target.value });
                          if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: '' });
                        }}
                        placeholder="e.g. Alex Morgan"
                        className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border text-slate-900 dark:text-white text-sm focus:outline-none transition-colors ${
                          fieldErrors.name
                            ? 'border-rose-500 focus:border-rose-500'
                            : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500'
                        }`}
                      />
                      {fieldErrors.name && (
                        <p className="text-xs text-rose-500 flex items-center gap-1 mt-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {fieldErrors.name}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <label htmlFor="contact-email" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });
                          if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: '' });
                        }}
                        placeholder="e.g. alex@company.com"
                        className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border text-slate-900 dark:text-white text-sm focus:outline-none transition-colors ${
                          fieldErrors.email
                            ? 'border-rose-500 focus:border-rose-500'
                            : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500'
                        }`}
                      />
                      {fieldErrors.email && (
                        <p className="text-xs text-rose-500 flex items-center gap-1 mt-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {fieldErrors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="space-y-1.5">
                    <label htmlFor="contact-subject" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Subject <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="contact-subject"
                      type="text"
                      value={formData.subject}
                      onChange={(e) => {
                        setFormData({ ...formData, subject: e.target.value });
                        if (fieldErrors.subject) setFieldErrors({ ...fieldErrors, subject: '' });
                      }}
                      placeholder="e.g. Project Inquiry / Full-Stack Technical Consultation"
                      className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border text-slate-900 dark:text-white text-sm focus:outline-none transition-colors ${
                        fieldErrors.subject
                          ? 'border-rose-500 focus:border-rose-500'
                          : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500'
                      }`}
                    />
                    {fieldErrors.subject && (
                      <p className="text-xs text-rose-500 flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {fieldErrors.subject}
                      </p>
                    )}
                  </div>

                  {/* Message */}
                  <div className="space-y-1.5">
                    <label htmlFor="contact-message" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Detailed Message <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      rows={5}
                      value={formData.message}
                      onChange={(e) => {
                        setFormData({ ...formData, message: e.target.value });
                        if (fieldErrors.message) setFieldErrors({ ...fieldErrors, message: '' });
                      }}
                      placeholder="Describe your project, timeline, stack preferences, or goals..."
                      className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border text-slate-900 dark:text-white text-sm focus:outline-none transition-colors resize-y ${
                        fieldErrors.message
                          ? 'border-rose-500 focus:border-rose-500'
                          : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500'
                      }`}
                    />
                    {fieldErrors.message && (
                      <p className="text-xs text-rose-500 flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {fieldErrors.message}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/35 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01]"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Transmitting to PostgreSQL...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Direct Inquiry</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
