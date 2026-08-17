import axios from 'axios';
import {
  ApiResponse,
  Profile,
  Skill,
  Service,
  Project,
  Experience,
  Education,
  Certification,
  Testimonial,
  BlogPost,
  FAQ,
  ContactMessage,
  SocialLink,
  DashboardStats,
  User,
} from '../types';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token automatically to every request if present
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('qevanix_auth_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API Helper Service
export const api = {
  // Auth
  login: (data: any) => apiClient.post<ApiResponse<{ token: string; user: User }>>('/auth/login', data),
  getMe: () => apiClient.get<ApiResponse<User>>('/auth/me'),
  updatePassword: (data: any) => apiClient.post<ApiResponse<null>>('/auth/password', data),

  // Profile
  getProfile: () => apiClient.get<ApiResponse<Profile>>('/profile'),
  updateProfile: (data: Partial<Profile>) => apiClient.put<ApiResponse<Profile>>('/profile', data),

  // Projects
  getProjects: (params?: { category?: string; featured?: boolean; search?: string }) =>
    apiClient.get<ApiResponse<Project[]>>('/projects', { params }),
  getProject: (idOrSlug: string) => apiClient.get<ApiResponse<Project>>(`/projects/${idOrSlug}`),
  createProject: (data: Partial<Project>) => apiClient.post<ApiResponse<Project>>('/projects', data),
  updateProject: (id: string, data: Partial<Project>) => apiClient.put<ApiResponse<Project>>(`/projects/${id}`, data),
  deleteProject: (id: string) => apiClient.delete<ApiResponse<null>>(`/projects/${id}`),

  // Skills
  getSkills: (params?: { category?: string; featured?: boolean }) =>
    apiClient.get<ApiResponse<Skill[]>>('/skills', { params }),
  createSkill: (data: Partial<Skill>) => apiClient.post<ApiResponse<Skill>>('/skills', data),
  updateSkill: (id: string, data: Partial<Skill>) => apiClient.put<ApiResponse<Skill>>(`/skills/${id}`, data),
  deleteSkill: (id: string) => apiClient.delete<ApiResponse<null>>(`/skills/${id}`),

  // Services
  getServices: () => apiClient.get<ApiResponse<Service[]>>('/services'),
  createService: (data: Partial<Service>) => apiClient.post<ApiResponse<Service>>('/services', data),
  updateService: (id: string, data: Partial<Service>) => apiClient.put<ApiResponse<Service>>(`/services/${id}`, data),
  deleteService: (id: string) => apiClient.delete<ApiResponse<null>>(`/services/${id}`),

  // Experience
  getExperiences: () => apiClient.get<ApiResponse<Experience[]>>('/experience'),
  createExperience: (data: Partial<Experience>) => apiClient.post<ApiResponse<Experience>>('/experience', data),
  updateExperience: (id: string, data: Partial<Experience>) => apiClient.put<ApiResponse<Experience>>(`/experience/${id}`, data),
  deleteExperience: (id: string) => apiClient.delete<ApiResponse<null>>(`/experience/${id}`),

  // Education
  getEducations: () => apiClient.get<ApiResponse<Education[]>>('/education'),
  createEducation: (data: Partial<Education>) => apiClient.post<ApiResponse<Education>>('/education', data),
  updateEducation: (id: string, data: Partial<Education>) => apiClient.put<ApiResponse<Education>>(`/education/${id}`, data),
  deleteEducation: (id: string) => apiClient.delete<ApiResponse<null>>(`/education/${id}`),

  // Certifications
  getCertifications: () => apiClient.get<ApiResponse<Certification[]>>('/certifications'),
  createCertification: (data: Partial<Certification>) => apiClient.post<ApiResponse<Certification>>('/certifications', data),
  updateCertification: (id: string, data: Partial<Certification>) => apiClient.put<ApiResponse<Certification>>(`/certifications/${id}`, data),
  deleteCertification: (id: string) => apiClient.delete<ApiResponse<null>>(`/certifications/${id}`),

  // Testimonials & Reviews
  getTestimonials: () => apiClient.get<ApiResponse<Testimonial[]>>('/testimonials'),
  submitPublicReview: (data: {
    clientName: string;
    clientRole?: string;
    clientCompany?: string;
    clientAvatar?: string;
    content: string;
    rating: number;
  }) => apiClient.post<ApiResponse<Testimonial>>('/testimonials/public', data),
  createTestimonial: (data: Partial<Testimonial>) => apiClient.post<ApiResponse<Testimonial>>('/testimonials', data),
  updateTestimonial: (id: string, data: Partial<Testimonial>) => apiClient.put<ApiResponse<Testimonial>>(`/testimonials/${id}`, data),
  deleteTestimonial: (id: string) => apiClient.delete<ApiResponse<null>>(`/testimonials/${id}`),

  // Realtime Visitors & Analytics
  pingVisitor: (visitorId: string) =>
    apiClient.post<ApiResponse<{ activeVisitors: number; totalVisits: number; timestamp: string }>>('/visitors/ping', { visitorId }),
  getVisitorStats: () =>
    apiClient.get<ApiResponse<{ activeVisitors: number; totalVisits: number; timestamp: string }>>('/visitors/stats'),

  // Blog Posts
  getBlogPosts: (params?: { category?: string; tag?: string; search?: string; publishedOnly?: boolean }) =>
    apiClient.get<ApiResponse<BlogPost[]>>('/blog', { params }),
  getBlogPost: (slug: string) => apiClient.get<ApiResponse<BlogPost>>(`/blog/${slug}`),
  createBlogPost: (data: Partial<BlogPost>) => apiClient.post<ApiResponse<BlogPost>>('/blog', data),
  updateBlogPost: (id: string, data: Partial<BlogPost>) => apiClient.put<ApiResponse<BlogPost>>(`/blog/${id}`, data),
  deleteBlogPost: (id: string) => apiClient.delete<ApiResponse<null>>(`/blog/${id}`),

  // FAQs
  getFAQs: (params?: { category?: string }) => apiClient.get<ApiResponse<FAQ[]>>('/faqs', { params }),
  createFAQ: (data: Partial<FAQ>) => apiClient.post<ApiResponse<FAQ>>('/faqs', data),
  updateFAQ: (id: string, data: Partial<FAQ>) => apiClient.put<ApiResponse<FAQ>>(`/faqs/${id}`, data),
  deleteFAQ: (id: string) => apiClient.delete<ApiResponse<null>>(`/faqs/${id}`),

  // Contact
  submitContact: (data: { name: string; email: string; subject: string; message: string }) =>
    apiClient.post<ApiResponse<{ id: string; createdAt: string }>>('/contact', data),
  getContactMessages: (params?: { isRead?: boolean }) =>
    apiClient.get<ApiResponse<ContactMessage[]>>('/contact', { params }),
  updateContactMessageStatus: (id: string, data: { isRead?: boolean; replySent?: boolean }) =>
    apiClient.patch<ApiResponse<ContactMessage>>(`/contact/${id}`, data),
  deleteContactMessage: (id: string) => apiClient.delete<ApiResponse<null>>(`/contact/${id}`),

  // Social Links
  getSocialLinks: () => apiClient.get<ApiResponse<SocialLink[]>>('/social-links'),
  createSocialLink: (data: Partial<SocialLink>) => apiClient.post<ApiResponse<SocialLink>>('/social-links', data),
  updateSocialLink: (id: string, data: Partial<SocialLink>) => apiClient.put<ApiResponse<SocialLink>>(`/social-links/${id}`, data),
  deleteSocialLink: (id: string) => apiClient.delete<ApiResponse<null>>(`/social-links/${id}`),

  // Admin Stats
  getAdminStats: () => apiClient.get<ApiResponse<DashboardStats>>('/admin/stats'),
};
