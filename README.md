# Qevanix - Production-Ready Full-Stack Personal Portfolio

A modern, high-performance full-stack personal portfolio and content management system engineered for **Qevanix** (Senior Full-Stack Engineer & Cloud Solutions Architect).

Built with **React 18 + TypeScript + Tailwind CSS** on the frontend, **Node.js + Express + TypeScript** on the backend, and **PostgreSQL** with **Prisma ORM**.

---

## 🌟 Highlights & Features

### 🖥️ Public Portfolio Sections (13 Dynamic Modules)
1. **Home / Hero**: Animated gradient headline, interactive terminal mock, live availability pill, quick stats counters, and primary action CTAs.
2. **About**: Engineering philosophy tabs (Core Principles, Tech Stack, 4-Sprint Workflow) and bio narrative.
3. **Skills**: Categorized technology catalog (Frontend, Backend, Database, Cloud & DevOps, Architecture) with animated proficiency percentage meters.
4. **Services**: Service offerings with deliverable checklist and pricing models.
5. **Projects**: Real-time search by keywords and technology tags, category filters, interactive preview modals, and full case study routes (`/projects/:slug`).
6. **Experience**: Chronological career timeline with role highlights, metric milestones, and tech tags.
7. **Education**: Formal academic credentials, honors, coursework, and activities.
8. **Certifications**: Industry badges (AWS, Kubernetes CNCF, Meta) with credential verification links.
9. **Interactive Resume**: Dynamic formatted web resume with instant print/save PDF stylesheet support.
10. **Testimonials**: Endorsements from engineering leaders, VP of Engineering, and startup founders with star ratings.
11. **Blog & Knowledge Hub**: Technical articles with reading time estimates, categories, tags, view tracking, and full markdown article viewer (`/blog/:slug`).
12. **FAQ**: Accordion grouping with smooth expandable question answers.
13. **Contact Module**: Real-time validated contact form persisting messages directly into PostgreSQL with automated Nodemailer email notification dispatching.

### 🛡️ Protected Admin Dashboard (`/admin`)
- **JWT & Bcrypt Authentication**: Secure login gate with token-based session verification.
- **System Overview**: Live metric counters (Total projects, blog posts, skills, unread messages, page views).
- **Interactive Inbox**: Read incoming contact inquiries, toggle read/unread status, delete messages, and direct email replies.
- **Full CRUD Management**: Create, edit, and delete Projects, Skills, Services, Experiences, Educations, Certifications, Testimonials, Blog Posts, FAQs, Social Links, and Profile Bio information.

### 🎨 Design System & Accessibility
- **Dark & Light Mode**: Smooth CSS transitions with persistent local storage and system preference detection.
- **Command Palette (`Ctrl+K` / `⌘K`)**: Instant keyboard navigation and global search across all portfolio sections, projects, and articles.
- **Glassmorphic Aesthetics**: Modern backdrop-filter blur surfaces, glowing radial accents, tailored typography (Plus Jakarta Sans & JetBrains Mono), and WCAG AA contrast compliance.

---

## 🏗️ Architecture & Tech Stack

```
Qevanix/
├── client/                     # Frontend (React 18 + TypeScript + Vite + Tailwind CSS)
│   ├── src/
│   │   ├── components/         # Reusable common UI & 13 section components
│   │   ├── context/            # ThemeContext, AuthContext, ToastContext
│   │   ├── pages/              # HomePage, ProjectDetailPage, BlogListing, BlogPost, Resume, Admin
│   │   ├── services/           # Axios API client with typed responses
│   │   └── types/              # Unified TypeScript definitions
│   └── vite.config.ts          # Vite configuration with backend proxy
│
├── server/                     # Backend (Node.js + Express + TypeScript)
│   ├── src/
│   │   ├── config/             # Prisma client & typed environment config
│   │   ├── controllers/        # REST CRUD controllers for all entities
│   │   ├── middleware/         # Auth guard, Zod validator, centralized error handler
│   │   ├── routes/             # Express API routes
│   │   ├── services/           # Nodemailer email notification dispatcher
│   │   └── index.ts            # Server entry point with health check
│
├── prisma/                     # Database layer (PostgreSQL + Prisma)
│   ├── schema.prisma           # Relational schema (13 models with indexes & constraints)
│   └── seed.ts                 # Realistic development seed dataset
│
├── .env.example                # Environment variables template
├── .env                        # Local environment configuration
└── package.json                # Root package with concurrently & lifecycle scripts
```

---

## 🚀 Getting Started Locally

### Prerequisites
- **Node.js** (v18.x or v20.x LTS)
- **PostgreSQL** running locally on port `5432` with database `portfolio_db`

### 1. Clone & Install Dependencies
```bash
# Install all root, server, and client dependencies
npm run install:all
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and configure your environment variables:
```bash
cp .env.example .env
```

Ensure you update the variables in `.env` with your secure configuration:
```env
# Server & Database Settings
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# PostgreSQL Connection
DATABASE_URL="your-production-database-url"

# Auth Secrets
JWT_SECRET=your-secure-random-secret
JWT_EXPIRES_IN=7d

# Admin Credentials
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your-secure-admin-password
ADMIN_NAME="Admin Qevanix"

# Frontend API URL
VITE_API_URL=http://localhost:5000/api
```

### 3. Database Migration & Seeding
```bash
# Push Prisma schema to PostgreSQL
npm run prisma:push

# Seed database with sample projects, skills, services, blog posts, etc.
npm run prisma:seed
```

### 4. Run Both Client & Server Concurrently
```bash
npm run dev
```
- **Frontend App**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000/api`
- **API Health Check**: `http://localhost:5000/api/health`
- **Admin Dashboard**: `http://localhost:5173/admin`

---

## 🔑 Default Admin Credentials

Use the admin credentials configured in the environment variables.

---

## 📡 REST API Endpoint Documentation

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/health` | Public | System and PostgreSQL connectivity status |
| `POST` | `/api/auth/login` | Public | Authenticate admin and receive JWT token |
| `GET` | `/api/auth/me` | Protected | Get current authenticated user details |
| `GET` | `/api/profile` | Public | Fetch portfolio profile information |
| `PUT` | `/api/profile` | Protected | Update portfolio profile and hero text |
| `GET` | `/api/projects` | Public | List all projects (supports `?category=`, `?search=`) |
| `GET` | `/api/projects/:idOrSlug` | Public | Fetch project case study details |
| `POST` | `/api/projects` | Protected | Create new portfolio project |
| `PUT` | `/api/projects/:id` | Protected | Update existing project |
| `DELETE` | `/api/projects/:id` | Protected | Delete project |
| `GET` | `/api/skills` | Public | List technical skills |
| `POST` | `/api/skills` | Protected | Add new skill |
| `GET` | `/api/services` | Public | List service offerings |
| `GET` | `/api/experience` | Public | List career experience timeline |
| `GET` | `/api/education` | Public | List academic education history |
| `GET` | `/api/certifications`| Public | List verified certifications |
| `GET` | `/api/testimonials` | Public | List client testimonials |
| `GET` | `/api/blog` | Public | List blog articles (supports `?category=`, `?search=`) |
| `GET` | `/api/blog/:slug` | Public | Fetch article detail and increment view count |
| `GET` | `/api/faqs` | Public | List frequently asked questions |
| `POST` | `/api/contact` | Public | Submit contact message (persists in DB + email dispatch) |
| `GET` | `/api/contact` | Protected | View all contact form submissions |
| `PATCH`| `/api/contact/:id` | Protected | Toggle message read status |
| `DELETE`|`/api/contact/:id`| Protected | Delete contact message |
| `GET` | `/api/admin/stats` | Protected | Aggregate dashboard metrics and recent inquiries |

---

## 🛠️ Build & Production Deployment

```bash
# Build both TypeScript backend and Vite frontend
npm run build

# Start production backend server
npm run start
```
