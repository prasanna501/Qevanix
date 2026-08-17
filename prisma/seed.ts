import { PrismaClient, SkillCategory } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding for Qevanix Portfolio...');

  // 1. Admin User
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@qevanix.dev';
  const rawPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const hashedPassword = await bcrypt.hash(rawPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedPassword,
      name: process.env.ADMIN_NAME || 'Qevanix Admin',
    },
    create: {
      email: adminEmail,
      password: hashedPassword,
      name: process.env.ADMIN_NAME || 'Qevanix Admin',
      role: 'ADMIN',
    },
  });
  console.log(`✅ Admin user seeded: ${admin.email}`);

  // 2. Profile Info
  await prisma.profile.deleteMany();
  await prisma.profile.create({
    data: {
      name: 'Qevanix',
      title: 'Senior Full-Stack Engineer & Cloud Solutions Architect',
      tagline: 'Designing resilient distributed systems, elegant frontends, and high-performance digital architectures.',
      bio: 'I am a Full-Stack Engineer with 6+ years of experience building mission-critical SaaS platforms, distributed real-time systems, and high-conversion web applications. I bridge the gap between pixel-perfect intuitive UX design and bulletproof, scalable cloud backends.',
      aboutSnippet: 'Specialized in TypeScript, modern React ecosystems, Node.js, Next.js, GraphQL, PostgreSQL, and AWS/GCP cloud environments. Passionate about clean code craftsmanship, system observability, and developer ergonomics.',
      location: 'San Francisco, CA (Open to Worldwide Remote & Hybrid)',
      email: 'contact@qevanix.dev',
      phone: '+1 (555) 019-2834',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      heroHeadline: 'Engineering Scalable Systems & Crafted Digital Experiences.',
      heroSubheadline: 'I build modern full-stack web applications with uncompromising performance, clean architecture, and intuitive user interfaces.',
      yearsExperience: 6,
      completedProjects: 42,
      satisfiedClients: 28,
      codeCommits: 5200,
      resumeUrl: '/sample-resume.pdf',
      isAvailable: true,
      availabilityStatus: 'Available for high-impact roles & engineering leadership',
    },
  });
  console.log('✅ Profile information seeded.');

  // 3. Skills
  await prisma.skill.deleteMany();
  const skillsData = [
    // Frontend
    { name: 'React / Next.js', category: SkillCategory.FRONTEND, proficiency: 96, icon: 'Atom', isFeatured: true, order: 1 },
    { name: 'TypeScript', category: SkillCategory.FRONTEND, proficiency: 95, icon: 'Code2', isFeatured: true, order: 2 },
    { name: 'Tailwind CSS', category: SkillCategory.FRONTEND, proficiency: 98, icon: 'Palette', isFeatured: true, order: 3 },
    { name: 'Vue.js / Nuxt', category: SkillCategory.FRONTEND, proficiency: 84, icon: 'Layers', isFeatured: false, order: 4 },
    { name: 'State Management (Zustand/Redux)', category: SkillCategory.FRONTEND, proficiency: 90, icon: 'Cpu', isFeatured: false, order: 5 },
    { name: 'Web Performance & Accessibility', category: SkillCategory.FRONTEND, proficiency: 92, icon: 'Gauge', isFeatured: true, order: 6 },

    // Backend
    { name: 'Node.js & Express', category: SkillCategory.BACKEND, proficiency: 94, icon: 'Server', isFeatured: true, order: 1 },
    { name: 'NestJS / Fastify', category: SkillCategory.BACKEND, proficiency: 88, icon: 'Zap', isFeatured: false, order: 2 },
    { name: 'RESTful API & GraphQL Design', category: SkillCategory.BACKEND, proficiency: 95, icon: 'Network', isFeatured: true, order: 3 },
    { name: 'Microservices & Event-Driven (Kafka/RabbitMQ)', category: SkillCategory.BACKEND, proficiency: 86, icon: 'Share2', isFeatured: true, order: 4 },
    { name: 'Python / FastAPI', category: SkillCategory.BACKEND, proficiency: 82, icon: 'Terminal', isFeatured: false, order: 5 },

    // Database
    { name: 'PostgreSQL & Prisma ORM', category: SkillCategory.DATABASE, proficiency: 95, icon: 'Database', isFeatured: true, order: 1 },
    { name: 'Redis (Caching & PubSub)', category: SkillCategory.DATABASE, proficiency: 90, icon: 'HardDrive', isFeatured: true, order: 2 },
    { name: 'MongoDB / Document Stores', category: SkillCategory.DATABASE, proficiency: 85, icon: 'FolderArchive', isFeatured: false, order: 3 },
    { name: 'Query Optimization & Indexing', category: SkillCategory.DATABASE, proficiency: 89, icon: 'SearchCheck', isFeatured: false, order: 4 },

    // Cloud & DevOps
    { name: 'Docker & Containerization', category: SkillCategory.DEVOPS_CLOUD, proficiency: 92, icon: 'Box', isFeatured: true, order: 1 },
    { name: 'Kubernetes (K8s)', category: SkillCategory.DEVOPS_CLOUD, proficiency: 80, icon: 'Boxes', isFeatured: false, order: 2 },
    { name: 'AWS (ECS, S3, Lambda, CloudFront)', category: SkillCategory.DEVOPS_CLOUD, proficiency: 90, icon: 'Cloud', isFeatured: true, order: 3 },
    { name: 'CI/CD Pipelines (GitHub Actions)', category: SkillCategory.DEVOPS_CLOUD, proficiency: 93, icon: 'GitBranch', isFeatured: true, order: 4 },
    { name: 'Monitoring & Telemetry (Prometheus/Grafana)', category: SkillCategory.DEVOPS_CLOUD, proficiency: 84, icon: 'Activity', isFeatured: false, order: 5 },

    // Tools & Architecture
    { name: 'Git & Trunk-Based Development', category: SkillCategory.TOOLS_ARCHITECTURE, proficiency: 96, icon: 'GitCommit', isFeatured: false, order: 1 },
    { name: 'System Design & Architecture', category: SkillCategory.TOOLS_ARCHITECTURE, proficiency: 92, icon: 'Compass', isFeatured: true, order: 2 },
    { name: 'Test-Driven Development (Jest/Vitest/Playwright)', category: SkillCategory.TOOLS_ARCHITECTURE, proficiency: 88, icon: 'CheckCircle2', isFeatured: true, order: 3 },
    { name: 'Figma & UI/UX Prototyping', category: SkillCategory.TOOLS_ARCHITECTURE, proficiency: 85, icon: 'Figma', isFeatured: false, order: 4 },
  ];

  await prisma.skill.createMany({ data: skillsData });
  console.log(`✅ Seeded ${skillsData.length} skills.`);

  // 4. Services
  await prisma.service.deleteMany();
  const servicesData = [
    {
      title: 'Full-Stack Web Development',
      description: 'End-to-end web application development using React, Next.js, Node.js, TypeScript, and modern relational databases with clean domain-driven architecture.',
      icon: 'LayoutGrid',
      features: [
        'Responsive, mobile-first design with Tailwind CSS',
        'Robust state management and real-time synchronization',
        'High-performance server-side rendering and static optimization',
        'Complete integration with backend REST/GraphQL APIs',
      ],
      priceHint: 'Custom Scope / Milestone Based',
      isFeatured: true,
      order: 1,
    },
    {
      title: 'API & Backend Architecture',
      description: 'Design and implementation of highly scalable, secure, and well-documented RESTful & GraphQL APIs with automated validation, rate limiting, and RBAC authentication.',
      icon: 'Server',
      features: [
        'PostgreSQL schema modeling and optimized Prisma migrations',
        'Redis caching for sub-millisecond data retrieval',
        'Comprehensive automated testing (Unit, Integration, E2E)',
        'Swagger / OpenAPI interactive documentation',
      ],
      priceHint: 'Retainer or Fixed Sprint',
      isFeatured: true,
      order: 2,
    },
    {
      title: 'Cloud & DevOps Automation',
      description: 'Setting up automated deployment pipelines, containerizing workloads with Docker, and orchestrating scalable cloud infrastructure on AWS, GCP, or Vercel.',
      icon: 'CloudLightning',
      features: [
        'GitHub Actions continuous integration & zero-downtime CD',
        'Production infrastructure as code & secrets management',
        'Centralized logging, error monitoring & Prometheus telemetry',
        'Cost optimization and performance profiling',
      ],
      priceHint: 'Per Project / Infrastructure Review',
      isFeatured: true,
      order: 3,
    },
    {
      title: 'UI/UX & Design Systems',
      description: 'Building accessible, maintainable component libraries and design tokens that empower engineering teams to ship cohesive digital products at velocity.',
      icon: 'Wand2',
      features: [
        'WCAG AA accessible component systems',
        'Dark mode and multi-theme design architecture',
        'Interactive Figma to React code translation',
        'Micro-interactions, animations, and fluid state transitions',
      ],
      priceHint: 'Design Sprint or Component Library',
      isFeatured: false,
      order: 4,
    },
  ];

  await prisma.service.createMany({ data: servicesData });
  console.log(`✅ Seeded ${servicesData.length} services.`);

  // 5. Projects
  await prisma.project.deleteMany();
  const projectsData = [
    {
      title: 'AuraCloud - AI-Powered Cloud Observability Platform',
      slug: 'auracloud-observability-platform',
      summary: 'Real-time telemetry and anomaly detection dashboard processing over 500,000 metrics per second with sub-second alert latency.',
      description: 'AuraCloud is an enterprise-grade cloud observability and telemetry monitoring platform. Built to handle millions of real-time logs and metric events, it features dynamic query builders, automated root-cause analysis via machine learning models, custom dashboard layouts, and webhook integration with Slack, PagerDuty, and Discord.',
      category: 'Full Stack',
      tags: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Redis', 'Docker', 'Tailwind CSS'],
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
      galleryImages: [
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1200&q=80',
      ],
      demoUrl: 'https://auracloud-demo.qevanix.dev',
      githubUrl: 'https://github.com/qevanix/auracloud-platform',
      isFeatured: true,
      order: 1,
      clientName: 'CloudScale Technologies',
      completionDate: new Date('2025-11-15'),
      metrics: '500k+ events/sec, 99.99% uptime, 40% incident resolution speedup',
    },
    {
      title: 'NexusPay - Next-Gen Fintech Treasury & Escrow Engine',
      slug: 'nexuspay-fintech-engine',
      summary: 'Multi-currency settlement portal handling high-volume cross-border transactions with ISO 20022 compliance and fraud detection.',
      description: 'NexusPay is an institutional payment workflow solution offering automated invoice reconciliation, multi-signature transaction approval flows, and instant international wire settlements. Architected with strict ACID compliance, encrypted audit logs, and PCI-DSS readiness.',
      category: 'Fintech & Backend',
      tags: ['TypeScript', 'Express', 'PostgreSQL', 'Prisma', 'Next.js', 'Stripe API', 'Tailwind CSS'],
      imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80',
      galleryImages: [
        'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
      ],
      demoUrl: 'https://nexuspay.qevanix.dev',
      githubUrl: 'https://github.com/qevanix/nexuspay-core',
      isFeatured: true,
      order: 2,
      clientName: 'FinNova Labs',
      completionDate: new Date('2025-08-20'),
      metrics: '$12M+ monthly volume, 0 ledger discrepancies, 350ms settlement latency',
    },
    {
      title: 'DevPulse - Collaborative Developer Knowledge Mesh',
      slug: 'devpulse-knowledge-mesh',
      summary: 'Real-time collaborative documentation and architectural decision records (ADR) system for engineering organizations.',
      description: 'DevPulse unifies markdown documentation, dynamic interactive architecture diagrams, pull request context, and internal API catalogs into a single fast, searchable knowledge graph with AI-assisted search and live multiplayer editing.',
      category: 'Web App',
      tags: ['React', 'TypeScript', 'WebSockets', 'Tailwind CSS', 'Node.js', 'PostgreSQL'],
      imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
      galleryImages: [
        'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
      ],
      demoUrl: 'https://devpulse.qevanix.dev',
      githubUrl: 'https://github.com/qevanix/devpulse-app',
      isFeatured: true,
      order: 3,
      clientName: 'Synthetix Org',
      completionDate: new Date('2025-04-10'),
      metrics: 'Used by 1,200+ engineers daily, 85ms median search speed',
    },
    {
      title: 'HyperStore - Headless E-Commerce & Inventory Matrix',
      slug: 'hyperstore-headless-ecommerce',
      summary: 'Ultra-fast modular headless shopping experience with predictive search, sub-second cart checkout, and real-time inventory tracking.',
      description: 'A headless e-commerce store with high conversion rates and Core Web Vitals score of 99. Includes customizable theme templates, tiered customer loyalty management, and automated supplier inventory syncing.',
      category: 'E-Commerce',
      tags: ['Next.js', 'Tailwind CSS', 'GraphQL', 'PostgreSQL', 'Redis'],
      imageUrl: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=1200&q=80',
      galleryImages: [
        'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=1200&q=80',
      ],
      demoUrl: 'https://hyperstore.qevanix.dev',
      githubUrl: 'https://github.com/qevanix/hyperstore-web',
      isFeatured: false,
      order: 4,
      clientName: 'Aero Retail Goods',
      completionDate: new Date('2025-01-18'),
      metrics: '32% conversion rate increase, 0.4s First Contentful Paint',
    },
  ];

  await prisma.project.createMany({ data: projectsData });
  console.log(`✅ Seeded ${projectsData.length} projects.`);

  // 6. Experience
  await prisma.experience.deleteMany();
  const experienceData = [
    {
      role: 'Lead Full-Stack Engineer & Architect',
      company: 'Vanguard Systems',
      companyUrl: 'https://vanguard.example.com',
      location: 'San Francisco, CA (Remote)',
      employmentType: 'Full-time',
      startDate: new Date('2023-03-01'),
      endDate: null,
      isCurrent: true,
      description: 'Directing the architecture and implementation of core SaaS products. Mentoring a distributed team of 10 engineers, standardizing frontend component systems, and optimizing high-load PostgreSQL database pipelines.',
      achievements: [
        'Engineered micro-frontend design system reducing new feature time-to-market by 45%',
        'Scaled PostgreSQL query pipelines from 1,200 QPS to 14,000 QPS with zero downtime migration',
        'Implemented end-to-end CI/CD workflows and automated preview deployments via GitHub Actions',
      ],
      technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Prisma', 'AWS', 'Docker', 'Tailwind CSS'],
      order: 1,
    },
    {
      role: 'Senior Backend & Cloud Engineer',
      company: 'Apex Data Labs',
      companyUrl: 'https://apexdata.example.com',
      location: 'Austin, TX',
      employmentType: 'Full-time',
      startDate: new Date('2021-06-01'),
      endDate: new Date('2023-02-28'),
      isCurrent: false,
      description: 'Built distributed ingestion pipelines and REST/GraphQL microservices handling millions of daily customer records. Designed data schemas and caching layers.',
      achievements: [
        'Designed high-throughput Kafka streaming pipelines processing 20M+ events daily',
        'Cut infrastructure cloud spend by 30% through container rightsizing and Redis cluster caching',
        'Maintained 99.98% platform service SLA across peak global shopping events',
      ],
      technologies: ['Node.js', 'Express', 'TypeScript', 'PostgreSQL', 'Redis', 'Docker', 'Kubernetes'],
      order: 2,
    },
    {
      role: 'Full-Stack Developer',
      company: 'PixelWave Studios',
      companyUrl: 'https://pixelwave.example.com',
      location: 'Seattle, WA',
      employmentType: 'Full-time',
      startDate: new Date('2019-08-01'),
      endDate: new Date('2021-05-31'),
      isCurrent: false,
      description: 'Developed responsive client-facing web applications, client dashboards, and integrated third-party payment and CRM APIs.',
      achievements: [
        'Delivered 18+ high-performance client web portals with 95+ Google Lighthouse scores',
        'Collaborated directly with UI/UX designers to implement pixel-perfect accessible designs',
      ],
      technologies: ['React', 'JavaScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'REST APIs'],
      order: 3,
    },
  ];

  await prisma.experience.createMany({ data: experienceData });
  console.log(`✅ Seeded ${experienceData.length} experiences.`);

  // 7. Education
  await prisma.education.deleteMany();
  const educationData = [
    {
      degree: 'Bachelor of Science in Computer Science',
      fieldOfStudy: 'Software Engineering & Distributed Computing',
      institution: 'University of California, Berkeley',
      institutionUrl: 'https://berkeley.edu',
      location: 'Berkeley, CA',
      startDate: new Date('2015-09-01'),
      endDate: new Date('2019-05-30'),
      isCurrent: false,
      grade: '3.88 GPA - Magna Cum Laude',
      activities: 'ACM Chapter Vice-President, Hackathon Organizer, Algorithms Teaching Assistant',
      description: 'Coursework emphasis on Distributed Systems, Advanced Algorithms, Database Architecture, Computer Networks, and Human-Computer Interaction.',
      order: 1,
    },
  ];

  await prisma.education.createMany({ data: educationData });
  console.log(`✅ Seeded ${educationData.length} educations.`);

  // 8. Certifications
  await prisma.certification.deleteMany();
  const certData = [
    {
      name: 'AWS Certified Solutions Architect - Professional',
      issuer: 'Amazon Web Services (AWS)',
      issueDate: new Date('2024-02-15'),
      expiryDate: new Date('2027-02-15'),
      credentialId: 'AWS-PSA-948271',
      credentialUrl: 'https://aws.amazon.com/verification',
      badgeUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80',
      order: 1,
    },
    {
      name: 'Certified Kubernetes Administrator (CKA)',
      issuer: 'Cloud Native Computing Foundation (CNCF)',
      issueDate: new Date('2023-09-10'),
      expiryDate: new Date('2026-09-10'),
      credentialId: 'CKA-8273910',
      credentialUrl: 'https://www.cncf.io/certification/cka/',
      badgeUrl: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=400&q=80',
      order: 2,
    },
    {
      name: 'Meta Front-End Developer Professional Certificate',
      issuer: 'Meta / Coursera',
      issueDate: new Date('2022-11-20'),
      expiryDate: null,
      credentialId: 'META-FED-38291',
      credentialUrl: 'https://coursera.org/verify/professional-cert',
      badgeUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=400&q=80',
      order: 3,
    },
  ];

  await prisma.certification.createMany({ data: certData });
  console.log(`✅ Seeded ${certData.length} certifications.`);

  // 9. Testimonials
  await prisma.testimonial.deleteMany();
  const testimonialData = [
    {
      clientName: 'Elena Rostova',
      clientRole: 'VP of Engineering',
      clientCompany: 'CloudScale Technologies',
      clientAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      content: 'Qevanix transformed our core platform. His deep command of distributed architecture, PostgreSQL optimization, and modern React development helped us launch 2 months ahead of schedule with remarkable reliability.',
      rating: 5,
      isFeatured: true,
      order: 1,
    },
    {
      clientName: 'Marcus Vance',
      clientRole: 'Co-Founder & CEO',
      clientCompany: 'FinNova Labs',
      clientAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
      content: 'An extraordinary engineer. The attention to security, precision in financial ledger architecture, and the polished, intuitive user dashboard blew away our executive team and investors.',
      rating: 5,
      isFeatured: true,
      order: 2,
    },
    {
      clientName: 'Sarah Lin',
      clientRole: 'Head of Product',
      clientCompany: 'Synthetix Org',
      clientAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
      content: 'Qevanix has that rare ability to think simultaneously about technical depth and exquisite user experience. Our internal developer documentation tool went from clunky to beloved across 1,000+ engineers.',
      rating: 5,
      isFeatured: true,
      order: 3,
    },
  ];

  await prisma.testimonial.createMany({ data: testimonialData });
  console.log(`✅ Seeded ${testimonialData.length} testimonials.`);

  // 10. Blog Posts
  await prisma.blogPost.deleteMany();
  const blogPostsData = [
    {
      title: 'Architecting Resilient Full-Stack Systems: From PostgreSQL to React',
      slug: 'architecting-resilient-fullstack-systems',
      summary: 'A deep dive into building fault-tolerant modern web applications with connection pooling, optimistic frontend updates, and robust schema migrations.',
      content: `
# Architecting Resilient Full-Stack Systems: From PostgreSQL to React

When scaling modern web applications, the friction between client-side responsiveness and database reliability is one of the most common pitfalls engineering teams face.

In this article, we explore the architectural patterns that ensure continuous uptime, sub-100ms response times, and an exceptional developer experience.

## 1. Relational Integrity and Schema Evolution with Prisma
Database schemas are not static artifacts. In high-velocity teams, migrations must be non-destructive and backward-compatible.

Key strategies include:
- **Zero-downtime column additions**: Never rename or drop columns in a single deploy step.
- **Connection pooling**: Utilizing tools like PgBouncer or serverless connection pooling to prevent connection exhaustion.
- **Appropriate Indexing**: Using composite B-tree indexes for multi-column query filters and GiST/GIN indexes for full-text search.

\`\`\`typescript
// Example: Safe transactional queries with Prisma
const [user, updatedProfile] = await prisma.$transaction([
  prisma.user.findUnique({ where: { id: userId } }),
  prisma.profile.update({
    where: { userId },
    data: { lastLogin: new Date() }
  })
]);
\`\`\`

## 2. Optimistic UI Updates & Error Boundaries in React
Users expect instant feedback. By pairing React state hooks with deterministic rollback capabilities, applications feel blazing fast even on high-latency mobile networks.

## 3. Telemetry and Observability
Resilience is impossible without visibility. Instrumenting every Express route with structured JSON logs, response time percentiles (p95/p99), and active database health checks ensures you catch regressions before your users notice them.
      `,
      coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
      tags: ['Architecture', 'PostgreSQL', 'React', 'Node.js', 'Performance'],
      category: 'Engineering',
      readingTime: '6 min read',
      isPublished: true,
      publishedAt: new Date('2026-01-12'),
      viewsCount: 1420,
    },
    {
      title: 'Mastering TypeScript: Advanced Generic Types & API Contracts',
      slug: 'mastering-typescript-advanced-generic-types',
      summary: 'Learn how to leverage TypeScript utility types, conditional types, and end-to-end schema validation to eliminate runtime surprises.',
      content: `
# Mastering TypeScript: Advanced Generic Types & API Contracts

TypeScript's type system is Turing complete, offering immense power to developers who know how to tap into its structural typing capabilities.

## Why End-to-End Type Safety Matters
In a full-stack JavaScript/TypeScript application, contract drift between the backend API payload and frontend consumer code is the #1 source of runtime bugs.

### Inferring API Return Types
By creating strongly typed API service wrappers, our React components automatically inherit compile-time guarantees:

\`\`\`typescript
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

export type ProjectWithTags = Project & {
  formattedTags: string[];
};
\`\`\`

## Conclusion
Investing time into clean TypeScript domain models pays massive dividends as your application scales from a simple portfolio to an enterprise SaaS product.
      `,
      coverImage: 'https://images.unsplash.com/photo-1516116211227-bbc14bd541ec?auto=format&fit=crop&w=1200&q=80',
      tags: ['TypeScript', 'Best Practices', 'Frontend', 'Backend'],
      category: 'Tutorials',
      readingTime: '5 min read',
      isPublished: true,
      publishedAt: new Date('2025-12-05'),
      viewsCount: 980,
    },
    {
      title: 'Designing Accessible & Modern Dark/Light Mode Systems',
      slug: 'designing-accessible-modern-theme-systems',
      summary: 'A practical guide to building CSS custom property color tokens, smooth transitions, and respecting OS color preferences with Tailwind CSS.',
      content: `
# Designing Accessible & Modern Dark/Light Mode Systems

A truly premium web application provides users with seamless color schemes that respect system preferences while offering intuitive manual overrides.

## Key Design Principles
1. **Never use pure #000000**: Deep zinc/slate hues provide richer contrast and less eye strain.
2. **Elevated Surface Hierarchy**: Use subtle borders and translucent surface layers (glassmorphism) for cards and modals.
3. **WCAG AA Contrast**: Ensure text elements maintain at least a 4.5:1 contrast ratio against their immediate background.
      `,
      coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      tags: ['UI/UX', 'CSS', 'Tailwind', 'Accessibility'],
      category: 'Design',
      readingTime: '4 min read',
      isPublished: true,
      publishedAt: new Date('2025-10-22'),
      viewsCount: 750,
    },
  ];

  await prisma.blogPost.createMany({ data: blogPostsData });
  console.log(`✅ Seeded ${blogPostsData.length} blog posts.`);

  // 11. FAQs
  await prisma.fAQ.deleteMany();
  const faqsData = [
    {
      question: 'What types of projects and roles are you available for?',
      answer: 'I am available for full-time senior engineering roles, technical lead positions, and selected high-impact consulting contracts. My primary focus is on full-stack web applications, scalable API design, cloud migrations, and design system engineering.',
      category: 'General',
      order: 1,
      isFeatured: true,
    },
    {
      question: 'What is your typical development and architecture workflow?',
      answer: 'I believe in rapid iterative delivery with strong fundamentals: gathering core requirements, designing robust PostgreSQL data models, writing clear TypeScript types, building accessible responsive UI components with Tailwind, and establishing automated testing & CI/CD pipelines.',
      category: 'Engineering',
      order: 2,
      isFeatured: true,
    },
    {
      question: 'Can you assist with legacy codebase modernization and database migrations?',
      answer: 'Yes! I have extensive experience refactoring monolithic codebases into modular architectures, upgrading JavaScript apps to TypeScript, and executing zero-downtime PostgreSQL migrations.',
      category: 'Services',
      order: 3,
      isFeatured: true,
    },
    {
      question: 'How do you handle project communication and time zones?',
      answer: 'I work with global teams across US, European, and Asian time zones with strong asynchronous communication habits, structured daily updates, transparent GitHub PR workflows, and regular milestone demo syncs.',
      category: 'Collaboration',
      order: 4,
      isFeatured: true,
    },
    {
      question: 'How can I get in touch or request a consultation?',
      answer: 'You can submit a message through the Contact form on this website, send an email directly to contact@qevanix.dev, or connect with me on LinkedIn and GitHub. I typically respond within 24 business hours.',
      category: 'General',
      order: 5,
      isFeatured: true,
    },
  ];

  await prisma.fAQ.createMany({ data: faqsData });
  console.log(`✅ Seeded ${faqsData.length} FAQs.`);

  // 12. Social Links
  await prisma.socialLink.deleteMany();
  const socialLinksData = [
    { platform: 'GitHub', url: 'https://github.com/qevanix', icon: 'Github', username: 'qevanix', isVisible: true, order: 1 },
    { platform: 'LinkedIn', url: 'https://linkedin.com/in/qevanix', icon: 'Linkedin', username: 'qevanix', isVisible: true, order: 2 },
    { platform: 'Twitter / X', url: 'https://twitter.com/qevanix', icon: 'Twitter', username: '@qevanix', isVisible: true, order: 3 },
    { platform: 'Discord', url: 'https://discord.com/users/qevanix', icon: 'MessageSquare', username: 'qevanix#0001', isVisible: true, order: 4 },
  ];

  await prisma.socialLink.createMany({ data: socialLinksData });
  console.log(`✅ Seeded ${socialLinksData.length} social links.`);

  // 13. Contact Messages Sample
  await prisma.contactMessage.deleteMany();
  await prisma.contactMessage.createMany({
    data: [
      {
        name: 'Sarah Connor',
        email: 's.connor@cyberdyne.io',
        subject: 'Project Collaboration: Real-Time Fleet Telemetry Portal',
        message: 'Hi Qevanix! We loved your AuraCloud observability project and want to build a similar dashboard for our EV fleet analytics. Would love to discuss availability and timeline for Q3.',
        isRead: false,
        replySent: false,
      },
      {
        name: 'Alex Rivera',
        email: 'alex@fintechventures.co',
        subject: 'Senior Technical Lead Inquiry',
        message: 'Hello! I am reaching out from FinTech Ventures regarding our upcoming multi-tenant payment platform. Your background in PostgreSQL and TypeScript aligns perfectly with our stack.',
        isRead: true,
        replySent: true,
      },
    ],
  });
  console.log('✅ Seeded sample contact inquiries.');

  console.log('🎉 Database seeding completed successfully for Qevanix!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
