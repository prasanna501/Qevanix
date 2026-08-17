import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { Modal } from '../components/common/Modal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import {
  Profile,
  Project,
  Skill,
  Service,
  Experience,
  Education,
  Certification,
  Testimonial,
  BlogPost,
  FAQ,
  ContactMessage,
  SocialLink,
  DashboardStats,
  SkillCategory,
} from '../types';
import {
  LayoutDashboard,
  User,
  FolderGit2,
  Cpu,
  Wrench,
  Briefcase,
  GraduationCap,
  Award,
  MessageSquare,
  BookOpen,
  HelpCircle,
  Mail,
  Share2,
  LogOut,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Eye,
  ExternalLink,
  RefreshCw,
  Save,
  Check,
  X,
} from 'lucide-react';

type Tab =
  | 'overview'
  | 'profile'
  | 'projects'
  | 'skills'
  | 'services'
  | 'experience'
  | 'education'
  | 'certifications'
  | 'testimonials'
  | 'blog'
  | 'faqs'
  | 'messages'
  | 'socials';

export const AdminDashboardPage: React.FC = () => {
  const { user, isAuthenticated, logout, isLoading: authLoading } = useAuth();
  const { success, error, info } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [loading, setLoading] = useState(true);

  // Data States
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  // Modal / Form States
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [itemType, setItemType] = useState<string>('');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [
        stRes,
        profRes,
        projRes,
        skRes,
        srvRes,
        expRes,
        eduRes,
        certRes,
        testRes,
        blogRes,
        faqRes,
        msgRes,
        socRes,
      ] = await Promise.all([
        api.getAdminStats(),
        api.getProfile(),
        api.getProjects(),
        api.getSkills(),
        api.getServices(),
        api.getExperiences(),
        api.getEducations(),
        api.getCertifications(),
        api.getTestimonials(),
        api.getBlogPosts({ publishedOnly: false }),
        api.getFAQs(),
        api.getContactMessages(),
        api.getSocialLinks(),
      ]);

      if (stRes.data.success) setStats(stRes.data.data);
      if (profRes.data.success) setProfile(profRes.data.data);
      if (projRes.data.success) setProjects(projRes.data.data);
      if (skRes.data.success) setSkills(skRes.data.data);
      if (srvRes.data.success) setServices(srvRes.data.data);
      if (expRes.data.success) setExperiences(expRes.data.data);
      if (eduRes.data.success) setEducations(eduRes.data.data);
      if (certRes.data.success) setCertifications(certRes.data.data);
      if (testRes.data.success) setTestimonials(testRes.data.data);
      if (blogRes.data.success) setBlogPosts(blogRes.data.data);
      if (faqRes.data.success) setFaqs(faqRes.data.data);
      if (msgRes.data.success) setMessages(msgRes.data.data);
      if (socRes.data.success) setSocialLinks(socRes.data.data);
    } catch (err: any) {
      console.error('Error loading admin data:', err);
      error('Failed to load some data. Verify backend connection.', 'Data Error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    info('You have been logged out.');
    navigate('/admin/login');
  };

  // CRUD Helpers
  const openCreateModal = (type: string, title: string, defaultData: any = {}) => {
    setItemType(type);
    setModalTitle(title);
    setEditingItem(defaultData);
    setModalOpen(true);
  };

  const openEditModal = (type: string, title: string, item: any) => {
    setItemType(type);
    setModalTitle(title);
    setEditingItem({ ...item });
    setModalOpen(true);
  };

  const handleDelete = async (type: string, id: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      if (type === 'project') await api.deleteProject(id);
      if (type === 'skill') await api.deleteSkill(id);
      if (type === 'service') await api.deleteService(id);
      if (type === 'experience') await api.deleteExperience(id);
      if (type === 'education') await api.deleteEducation(id);
      if (type === 'certification') await api.deleteCertification(id);
      if (type === 'testimonial') await api.deleteTestimonial(id);
      if (type === 'blog') await api.deleteBlogPost(id);
      if (type === 'faq') await api.deleteFAQ(id);
      if (type === 'message') await api.deleteContactMessage(id);
      if (type === 'social') await api.deleteSocialLink(id);

      success('Item deleted successfully.');
      loadAllData();
    } catch (err: any) {
      error(err?.response?.data?.message || 'Delete operation failed.');
    }
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isEdit = !!editingItem.id;
      if (itemType === 'project') {
        const payload = {
          ...editingItem,
          tags: typeof editingItem.tags === 'string' ? editingItem.tags.split(',').map((t: string) => t.trim()) : editingItem.tags,
        };
        if (isEdit) await api.updateProject(editingItem.id, payload);
        else await api.createProject(payload);
      } else if (itemType === 'skill') {
        const payload = { ...editingItem, proficiency: Number(editingItem.proficiency) };
        if (isEdit) await api.updateSkill(editingItem.id, payload);
        else await api.createSkill(payload);
      } else if (itemType === 'service') {
        const payload = {
          ...editingItem,
          features: typeof editingItem.features === 'string' ? editingItem.features.split('\n').filter(Boolean) : editingItem.features,
        };
        if (isEdit) await api.updateService(editingItem.id, payload);
        else await api.createService(payload);
      } else if (itemType === 'experience') {
        const payload = {
          ...editingItem,
          achievements: typeof editingItem.achievements === 'string' ? editingItem.achievements.split('\n').filter(Boolean) : editingItem.achievements,
          technologies: typeof editingItem.technologies === 'string' ? editingItem.technologies.split(',').map((t: string) => t.trim()) : editingItem.technologies,
        };
        if (isEdit) await api.updateExperience(editingItem.id, payload);
        else await api.createExperience(payload);
      } else if (itemType === 'education') {
        if (isEdit) await api.updateEducation(editingItem.id, editingItem);
        else await api.createEducation(editingItem);
      } else if (itemType === 'certification') {
        if (isEdit) await api.updateCertification(editingItem.id, editingItem);
        else await api.createCertification(editingItem);
      } else if (itemType === 'testimonial') {
        const payload = { ...editingItem, rating: Number(editingItem.rating) };
        if (isEdit) await api.updateTestimonial(editingItem.id, payload);
        else await api.createTestimonial(payload);
      } else if (itemType === 'blog') {
        const payload = {
          ...editingItem,
          tags: typeof editingItem.tags === 'string' ? editingItem.tags.split(',').map((t: string) => t.trim()) : editingItem.tags,
        };
        if (isEdit) await api.updateBlogPost(editingItem.id, payload);
        else await api.createBlogPost(payload);
      } else if (itemType === 'faq') {
        if (isEdit) await api.updateFAQ(editingItem.id, editingItem);
        else await api.createFAQ(editingItem);
      } else if (itemType === 'social') {
        if (isEdit) await api.updateSocialLink(editingItem.id, editingItem);
        else await api.createSocialLink(editingItem);
      }

      success('Saved changes successfully!');
      setModalOpen(false);
      loadAllData();
    } catch (err: any) {
      error(err?.response?.data?.message || 'Failed to save changes.');
    }
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    try {
      const payload = {
        ...profile,
        yearsExperience: Number(profile.yearsExperience),
        completedProjects: Number(profile.completedProjects),
        satisfiedClients: Number(profile.satisfiedClients),
        codeCommits: Number(profile.codeCommits),
      };
      await api.updateProfile(payload);
      success('Profile updated successfully!');
      loadAllData();
    } catch (err: any) {
      error(err?.response?.data?.message || 'Failed to update profile.');
    }
  };

  const toggleMessageRead = async (msg: ContactMessage) => {
    try {
      await api.updateContactMessageStatus(msg.id, { isRead: !msg.isRead });
      loadAllData();
    } catch (err: any) {
      error('Failed to update message status');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <LoadingSpinner size="lg" text="Loading Admin Control Center..." />
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'messages', label: `Inbox (${messages.filter((m) => !m.isRead).length})`, icon: Mail },
    { id: 'profile', label: 'Profile Bio & Hero', icon: User },
    { id: 'projects', label: 'Projects', icon: FolderGit2 },
    { id: 'skills', label: 'Skills', icon: Cpu },
    { id: 'services', label: 'Services', icon: Wrench },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'certifications', label: 'Certifications', icon: Award },
    { id: 'testimonials', label: 'Testimonials', icon: MessageSquare },
    { id: 'blog', label: 'Blog Posts', icon: BookOpen },
    { id: 'faqs', label: 'FAQs', icon: HelpCircle },
    { id: 'socials', label: 'Social Links', icon: Share2 },
  ];

  return (
    <div className="pt-24 pb-20 min-h-screen bg-slate-100/60 dark:bg-[#070b14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                Qevanix Admin Control
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Live PostgreSQL Connected
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Logged in as <strong className="text-slate-700 dark:text-slate-300">{user?.email}</strong> ({user?.name})
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadAllData}
              className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <Link
              to="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-indigo-500" />
              <span>View Live Site</span>
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-3 space-y-1">
            <div className="glass-card rounded-2xl p-2 space-y-1 shadow-lg">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as Tab)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Workspace Area */}
          <div className="lg:col-span-9">
            {/* 1. OVERVIEW */}
            {activeTab === 'overview' && stats && (
              <div className="space-y-8 animate-fade-in">
                {/* Metric Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="glass-card p-5 rounded-2xl shadow-md">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Projects</span>
                    <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                      {stats.metrics.totalProjects}
                    </div>
                  </div>
                  <div className="glass-card p-5 rounded-2xl shadow-md">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Unread Messages</span>
                    <div className="text-2xl font-black text-rose-500 mt-1">
                      {stats.metrics.unreadMessages}
                    </div>
                  </div>
                  <div className="glass-card p-5 rounded-2xl shadow-md">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Published Articles</span>
                    <div className="text-2xl font-black text-indigo-500 mt-1">
                      {stats.metrics.publishedBlogPosts}
                    </div>
                  </div>
                  <div className="glass-card p-5 rounded-2xl shadow-md">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Skills</span>
                    <div className="text-2xl font-black text-purple-500 mt-1">
                      {stats.metrics.totalSkills}
                    </div>
                  </div>
                </div>

                {/* Recent Inquiries Preview */}
                <div className="glass-card rounded-3xl p-6 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Mail className="w-5 h-5 text-indigo-500" />
                      Recent Inquiries
                    </h3>
                    <button
                      onClick={() => setActiveTab('messages')}
                      className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      View All ({messages.length}) →
                    </button>
                  </div>

                  <div className="space-y-3">
                    {messages.slice(0, 3).map((m) => (
                      <div
                        key={m.id}
                        className={`p-4 rounded-2xl border transition-all ${
                          m.isRead
                            ? 'bg-slate-50/50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800'
                            : 'bg-indigo-500/5 dark:bg-indigo-500/10 border-indigo-500/30'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="font-bold text-slate-900 dark:text-white text-sm">
                            {m.name} ({m.email})
                          </div>
                          <span className="text-xs text-slate-400">
                            {new Date(m.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-1">
                          {m.subject}
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                          {m.message}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 2. MESSAGES INBOX */}
            {activeTab === 'messages' && (
              <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-6 animate-fade-in shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      Contact Messages Inbox
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Submissions received via the contact form and persisted in PostgreSQL.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {messages.length === 0 ? (
                    <p className="text-center py-12 text-slate-500">No contact messages yet.</p>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`p-6 rounded-2xl border space-y-3 transition-all ${
                          msg.isRead
                            ? 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
                            : 'bg-indigo-500/5 dark:bg-indigo-500/10 border-indigo-500/40 shadow-md'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white text-base">
                              {msg.name}
                            </span>{' '}
                            <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                              &lt;{msg.email}&gt;
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleMessageRead(msg)}
                              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-colors ${
                                msg.isRead
                                  ? 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                                  : 'bg-emerald-500 text-white'
                              }`}
                            >
                              {msg.isRead ? 'Mark Unread' : 'Mark as Read'}
                            </button>
                            <a
                              href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                              className="px-3 py-1 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500"
                            >
                              Reply via Email
                            </a>
                            <button
                              onClick={() => handleDelete('message', msg.id)}
                              className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                          Subject: {msg.subject}
                        </div>

                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/50 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                          {msg.message}
                        </div>

                        <div className="text-[11px] text-slate-400">
                          Received: {new Date(msg.createdAt).toLocaleString()}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* 3. PROFILE EDITOR */}
            {activeTab === 'profile' && profile && (
              <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-6 animate-fade-in shadow-xl">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Edit Profile Information
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Update your portfolio bio, hero headline, stats counters, and availability badge.
                  </p>
                </div>

                <form onSubmit={handleProfileSave} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase">Display Name</label>
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        className="w-full mt-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase">Professional Title</label>
                      <input
                        type="text"
                        value={profile.title}
                        onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                        className="w-full mt-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase">Hero Headline</label>
                    <input
                      type="text"
                      value={profile.heroHeadline}
                      onChange={(e) => setProfile({ ...profile, heroHeadline: e.target.value })}
                      className="w-full mt-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase">Hero Subheadline</label>
                    <input
                      type="text"
                      value={profile.heroSubheadline}
                      onChange={(e) => setProfile({ ...profile, heroSubheadline: e.target.value })}
                      className="w-full mt-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase">Bio / About Narrative</label>
                    <textarea
                      rows={4}
                      value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      className="w-full mt-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase">Years Exp</label>
                      <input
                        type="number"
                        value={profile.yearsExperience}
                        onChange={(e) => setProfile({ ...profile, yearsExperience: parseInt(e.target.value) || 0 })}
                        className="w-full mt-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase">Projects</label>
                      <input
                        type="number"
                        value={profile.completedProjects}
                        onChange={(e) => setProfile({ ...profile, completedProjects: parseInt(e.target.value) || 0 })}
                        className="w-full mt-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase">Clients</label>
                      <input
                        type="number"
                        value={profile.satisfiedClients}
                        onChange={(e) => setProfile({ ...profile, satisfiedClients: parseInt(e.target.value) || 0 })}
                        className="w-full mt-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase">Commits</label>
                      <input
                        type="number"
                        value={profile.codeCommits}
                        onChange={(e) => setProfile({ ...profile, codeCommits: parseInt(e.target.value) || 0 })}
                        className="w-full mt-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase">Location</label>
                      <input
                        type="text"
                        value={profile.location}
                        onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                        className="w-full mt-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase">Contact Email</label>
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        className="w-full mt-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase">Availability Status Pill</label>
                    <input
                      type="text"
                      value={profile.availabilityStatus}
                      onChange={(e) => setProfile({ ...profile, availabilityStatus: e.target.value })}
                      className="w-full mt-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm"
                    />
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs bg-indigo-600 text-white hover:bg-indigo-500 shadow-md"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Profile Changes</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* 4. PROJECTS CRUD */}
            {activeTab === 'projects' && (
              <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-6 animate-fade-in shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Projects Manager</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Manage portfolio projects and case studies.</p>
                  </div>
                  <button
                    onClick={() =>
                      openCreateModal('project', 'Add New Project', {
                        title: '',
                        slug: '',
                        summary: '',
                        description: '',
                        category: 'Full Stack',
                        tags: 'React, TypeScript, Node.js',
                        imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
                        demoUrl: '',
                        githubUrl: '',
                        isFeatured: false,
                      })
                    }
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-500"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Project</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {projects.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800"
                    >
                      <div className="flex items-center gap-4">
                        <img src={p.imageUrl} alt={p.title} className="w-12 h-12 rounded-xl object-cover" />
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white text-sm">{p.title}</h4>
                          <span className="text-xs text-indigo-500 font-semibold">{p.category}</span>
                          {p.isFeatured && (
                            <span className="ml-2 text-[10px] bg-amber-500/20 text-amber-500 px-2 py-0.5 rounded font-bold">
                              Featured
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal('project', 'Edit Project', p)}
                          className="p-2 text-indigo-500 hover:bg-indigo-500/10 rounded-lg"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete('project', p.id)}
                          className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. SKILLS CRUD */}
            {activeTab === 'skills' && (
              <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-6 animate-fade-in shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Skills Catalog</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Manage categorized technical competencies.</p>
                  </div>
                  <button
                    onClick={() =>
                      openCreateModal('skill', 'Add New Skill', {
                        name: '',
                        category: 'FRONTEND',
                        proficiency: 85,
                        isFeatured: true,
                      })
                    }
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-500"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Skill</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {skills.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800"
                    >
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white text-sm">{s.name}</div>
                        <div className="text-xs text-slate-400">
                          {s.category} • {s.proficiency}%
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditModal('skill', 'Edit Skill', s)}
                          className="p-2 text-indigo-500 hover:bg-indigo-500/10 rounded-lg"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete('skill', s.id)}
                          className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. SERVICES CRUD */}
            {activeTab === 'services' && (
              <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-6 animate-fade-in shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Services Offerings</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Manage consulting & engineering services.</p>
                  </div>
                  <button
                    onClick={() =>
                      openCreateModal('service', 'Add Service', {
                        title: '',
                        description: '',
                        features: 'Deliverable 1\nDeliverable 2',
                        priceHint: 'Custom Scope',
                      })
                    }
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-500"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Service</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {services.map((srv) => (
                    <div
                      key={srv.id}
                      className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                    >
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">{srv.title}</h4>
                        <p className="text-xs text-slate-500 line-clamp-1">{srv.description}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditModal('service', 'Edit Service', srv)}
                          className="p-2 text-indigo-500 hover:bg-indigo-500/10 rounded-lg"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete('service', srv.id)}
                          className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 7. EXPERIENCE CRUD */}
            {activeTab === 'experience' && (
              <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-6 animate-fade-in shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Career Experience</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Manage work roles and timeline milestones.</p>
                  </div>
                  <button
                    onClick={() =>
                      openCreateModal('experience', 'Add Experience', {
                        role: '',
                        company: '',
                        location: 'San Francisco, CA',
                        startDate: '2023-01-01',
                        isCurrent: false,
                        description: '',
                        achievements: 'Key milestone 1\nKey milestone 2',
                        technologies: 'React, Node.js, PostgreSQL',
                      })
                    }
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-500"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Experience</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {experiences.map((exp) => (
                    <div
                      key={exp.id}
                      className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                    >
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                          {exp.role} @ {exp.company}
                        </h4>
                        <p className="text-xs text-slate-500">{exp.location}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditModal('experience', 'Edit Experience', exp)}
                          className="p-2 text-indigo-500 hover:bg-indigo-500/10 rounded-lg"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete('experience', exp.id)}
                          className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 8. EDUCATION CRUD */}
            {activeTab === 'education' && (
              <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-6 animate-fade-in shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Education History</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Manage degrees and academic foundations.</p>
                  </div>
                  <button
                    onClick={() =>
                      openCreateModal('education', 'Add Education', {
                        degree: 'Bachelor of Science in Computer Science',
                        fieldOfStudy: 'Software Engineering',
                        institution: 'UC Berkeley',
                        location: 'Berkeley, CA',
                        startDate: '2015-09-01',
                        endDate: '2019-05-30',
                      })
                    }
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-500"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Education</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {educations.map((edu) => (
                    <div
                      key={edu.id}
                      className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                    >
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">{edu.degree}</h4>
                        <p className="text-xs text-slate-500">{edu.institution}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditModal('education', 'Edit Education', edu)}
                          className="p-2 text-indigo-500 hover:bg-indigo-500/10 rounded-lg"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete('education', edu.id)}
                          className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 9. CERTIFICATIONS CRUD */}
            {activeTab === 'certifications' && (
              <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-6 animate-fade-in shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Certifications</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Manage professional badges and verification credentials.</p>
                  </div>
                  <button
                    onClick={() =>
                      openCreateModal('certification', 'Add Certification', {
                        name: '',
                        issuer: '',
                        issueDate: '2024-01-01',
                        credentialUrl: '',
                      })
                    }
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-500"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Certification</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {certifications.map((c) => (
                    <div
                      key={c.id}
                      className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                    >
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">{c.name}</h4>
                        <p className="text-xs text-slate-500">{c.issuer}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditModal('certification', 'Edit Certification', c)}
                          className="p-2 text-indigo-500 hover:bg-indigo-500/10 rounded-lg"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete('certification', c.id)}
                          className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 10. TESTIMONIALS CRUD */}
            {activeTab === 'testimonials' && (
              <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-6 animate-fade-in shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Client Testimonials</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Manage client reviews and ratings.</p>
                  </div>
                  <button
                    onClick={() =>
                      openCreateModal('testimonial', 'Add Testimonial', {
                        clientName: '',
                        clientRole: 'VP of Engineering',
                        clientCompany: 'Tech Corp',
                        content: '',
                        rating: 5,
                      })
                    }
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-500"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Testimonial</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {testimonials.map((t) => (
                    <div
                      key={t.id}
                      className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                    >
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                          {t.clientName} ({t.clientRole}, {t.clientCompany})
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-1">&quot;{t.content}&quot;</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditModal('testimonial', 'Edit Testimonial', t)}
                          className="p-2 text-indigo-500 hover:bg-indigo-500/10 rounded-lg"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete('testimonial', t.id)}
                          className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 11. BLOG POSTS CRUD */}
            {activeTab === 'blog' && (
              <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-6 animate-fade-in shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Blog & Articles</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Manage published articles and drafts.</p>
                  </div>
                  <button
                    onClick={() =>
                      openCreateModal('blog', 'Write New Blog Post', {
                        title: '',
                        slug: '',
                        summary: '',
                        content: '# Article Heading\n\nWrite your content here...',
                        coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
                        category: 'Engineering',
                        readingTime: '5 min read',
                        tags: 'Architecture, TypeScript',
                        isPublished: true,
                      })
                    }
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-500"
                  >
                    <Plus className="w-4 h-4" />
                    <span>New Article</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {blogPosts.map((post) => (
                    <div
                      key={post.id}
                      className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                    >
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">{post.title}</h4>
                        <div className="text-xs text-slate-400">
                          {post.category} • {post.viewsCount} views •{' '}
                          <span className={post.isPublished ? 'text-emerald-500' : 'text-amber-500'}>
                            {post.isPublished ? 'Published' : 'Draft'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditModal('blog', 'Edit Blog Post', post)}
                          className="p-2 text-indigo-500 hover:bg-indigo-500/10 rounded-lg"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete('blog', post.id)}
                          className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 12. FAQS CRUD */}
            {activeTab === 'faqs' && (
              <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-6 animate-fade-in shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">FAQs Manager</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Manage accordion questions and answers.</p>
                  </div>
                  <button
                    onClick={() =>
                      openCreateModal('faq', 'Add FAQ', {
                        question: '',
                        answer: '',
                        category: 'General',
                      })
                    }
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-500"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add FAQ</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {faqs.map((faq) => (
                    <div
                      key={faq.id}
                      className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                    >
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">{faq.question}</h4>
                        <p className="text-xs text-slate-500 line-clamp-1">{faq.answer}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditModal('faq', 'Edit FAQ', faq)}
                          className="p-2 text-indigo-500 hover:bg-indigo-500/10 rounded-lg"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete('faq', faq.id)}
                          className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 13. SOCIAL LINKS */}
            {activeTab === 'socials' && (
              <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-6 animate-fade-in shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Social Media Links</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Manage external links and profile icons.</p>
                  </div>
                  <button
                    onClick={() =>
                      openCreateModal('social', 'Add Social Link', {
                        platform: 'GitHub',
                        url: 'https://github.com/qevanix',
                        username: 'qevanix',
                      })
                    }
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-500"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Link</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {socialLinks.map((soc) => (
                    <div
                      key={soc.id}
                      className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                    >
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">{soc.platform}</h4>
                        <a href={soc.url} target="_blank" rel="noreferrer" className="text-xs text-indigo-500 hover:underline">
                          {soc.url}
                        </a>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditModal('social', 'Edit Social Link', soc)}
                          className="p-2 text-indigo-500 hover:bg-indigo-500/10 rounded-lg"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete('social', soc.id)}
                          className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dynamic Item Form Modal */}
      {modalOpen && editingItem && (
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={modalTitle} maxWidth="lg">
          <form onSubmit={handleSaveModal} className="space-y-4">
            {/* Generic fields renderer */}
            {Object.keys(editingItem)
              .filter((k) => !['id', 'createdAt', 'updatedAt', 'galleryImages', 'viewsCount'].includes(k))
              .map((key) => {
                const val = editingItem[key];
                const isBool = typeof val === 'boolean';
                const isLong = ['description', 'summary', 'content', 'features', 'achievements', 'answer'].includes(key);

                if (isBool) {
                  return (
                    <div key={key} className="flex items-center gap-2 pt-2">
                      <input
                        type="checkbox"
                        id={key}
                        checked={val}
                        onChange={(e) => setEditingItem({ ...editingItem, [key]: e.target.checked })}
                        className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                      />
                      <label htmlFor={key} className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                        {key}
                      </label>
                    </div>
                  );
                }

                if (isLong) {
                  return (
                    <div key={key} className="space-y-1">
                      <label className="block text-xs font-bold text-slate-400 uppercase">{key}</label>
                      <textarea
                        rows={key === 'content' ? 8 : 3}
                        value={Array.isArray(val) ? val.join('\n') : val || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, [key]: e.target.value })}
                        className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  );
                }

                return (
                  <div key={key} className="space-y-1">
                    <label className="block text-xs font-bold text-slate-400 uppercase">{key}</label>
                    <input
                      type="text"
                      value={Array.isArray(val) ? val.join(', ') : val !== null && val !== undefined ? String(val) : ''}
                      onChange={(e) => setEditingItem({ ...editingItem, [key]: e.target.value })}
                      className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                );
              })}

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-500 shadow-md"
              >
                Save
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
