export type SkillCategory = 'FRONTEND' | 'BACKEND' | 'DATABASE' | 'DEVOPS_CLOUD' | 'TOOLS_ARCHITECTURE';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'USER';
  createdAt: string;
  updatedAt: string;
}

export interface Profile {
  id: string;
  name: string;
  title: string;
  tagline?: string | null;
  bio: string;
  aboutSnippet?: string | null;
  location: string;
  email: string;
  phone?: string | null;
  avatarUrl?: string | null;
  heroHeadline: string;
  heroSubheadline: string;
  yearsExperience: number;
  completedProjects: number;
  satisfiedClients: number;
  codeCommits: number;
  resumeUrl?: string | null;
  isAvailable: boolean;
  availabilityStatus: string;
  createdAt: string;
  updatedAt: string;
}

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  proficiency: number;
  icon?: string | null;
  order: number;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  priceHint?: string | null;
  isFeatured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  category: string;
  tags: string[];
  imageUrl: string;
  galleryImages: string[];
  demoUrl?: string | null;
  githubUrl?: string | null;
  isFeatured: boolean;
  order: number;
  clientName?: string | null;
  completionDate?: string | null;
  metrics?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  companyUrl?: string | null;
  location: string;
  employmentType: string;
  startDate: string;
  endDate?: string | null;
  isCurrent: boolean;
  description: string;
  achievements: string[];
  technologies: string[];
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Education {
  id: string;
  degree: string;
  fieldOfStudy: string;
  institution: string;
  institutionUrl?: string | null;
  location: string;
  startDate: string;
  endDate?: string | null;
  isCurrent: boolean;
  grade?: string | null;
  activities?: string | null;
  description?: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string | null;
  credentialId?: string | null;
  credentialUrl?: string | null;
  badgeUrl?: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Testimonial {
  id: string;
  clientName: string;
  clientRole: string;
  clientCompany: string;
  clientAvatar?: string | null;
  content: string;
  rating: number;
  isFeatured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImage: string;
  tags: string[];
  category: string;
  readingTime: string;
  isPublished: boolean;
  publishedAt?: string | null;
  viewsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  replySent: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
  username?: string | null;
  isVisible: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  errors?: any;
  timestamp: string;
}

export interface DashboardStats {
  metrics: {
    totalProjects: number;
    totalSkills: number;
    totalServices: number;
    totalExperiences: number;
    totalBlogPosts: number;
    publishedBlogPosts: number;
    totalMessages: number;
    unreadMessages: number;
    totalTestimonials: number;
    totalFAQs: number;
  };
  recentMessages: ContactMessage[];
  recentProjects: {
    id: string;
    title: string;
    category: string;
    isFeatured: boolean;
    createdAt: string;
  }[];
}
