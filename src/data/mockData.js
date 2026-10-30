// Comprehensive Mock Data for CoderHarbor Marketplace
// Ensures zero-failure offline and Vercel standalone preview

export const mockCategories = [
  {
    id: 'cat-1',
    name: 'Web Applications',
    slug: 'web-applications',
    description: 'Full-stack cloud ready SaaS platforms and production web suites',
    productCount: 14,
  },
  {
    id: 'cat-2',
    name: 'E-commerce',
    slug: 'e-commerce',
    description: 'Modern digital storefronts, multi-vendor marketplaces, and catalog engines',
    productCount: 9,
  },
  {
    id: 'cat-3',
    name: 'Business Management',
    slug: 'business-management',
    description: 'Operational automation, team collaboration, and workflow suites',
    productCount: 11,
  },
  {
    id: 'cat-4',
    name: 'ERP and CRM',
    slug: 'erp-and-crm',
    description: 'Enterprise resource planning and customer relationship management systems',
    productCount: 8,
  },
  {
    id: 'cat-5',
    name: 'Billing Software',
    slug: 'billing-software',
    description: 'Invoicing, recurring subscriptions, tax computation, and POS backends',
    productCount: 7,
  },
  {
    id: 'cat-6',
    name: 'Education and LMS',
    slug: 'education-and-lms',
    description: 'Learning management portals, video courses, and student tracking hubs',
    productCount: 6,
  },
  {
    id: 'cat-7',
    name: 'Job Portals',
    slug: 'job-portals',
    description: 'Talent recruitment, resume parsers, and candidate evaluation portals',
    productCount: 5,
  },
  {
    id: 'cat-8',
    name: 'Mobile Applications',
    slug: 'mobile-applications',
    description: 'Cross-platform React Native and Flutter native app templates',
    productCount: 8,
  },
  {
    id: 'cat-9',
    name: 'Portfolio Websites',
    slug: 'portfolio-websites',
    description: 'Stunning showcase templates for software engineers and digital studios',
    productCount: 12,
  },
  {
    id: 'cat-10',
    name: 'Developer Templates',
    slug: 'developer-templates',
    description: 'Modular starter kits, boilerplate architectures, and API frameworks',
    productCount: 16,
  },
];

export const mockTechnologies = [
  { id: 'tech-1', name: 'React', slug: 'react' },
  { id: 'tech-2', name: 'Node.js', slug: 'nodejs' },
  { id: 'tech-3', name: 'Express.js', slug: 'express' },
  { id: 'tech-4', name: 'PostgreSQL', slug: 'postgresql' },
  { id: 'tech-5', name: 'Next.js', slug: 'nextjs' },
  { id: 'tech-6', name: 'Tailwind CSS', slug: 'tailwind-css' },
  { id: 'tech-7', name: 'TypeScript', slug: 'typescript' },
  { id: 'tech-8', name: 'Docker', slug: 'docker' },
  { id: 'tech-9', name: 'Redis', slug: 'redis' },
  { id: 'tech-10', name: 'GraphQL', slug: 'graphql' },
  { id: 'tech-11', name: 'Flutter', slug: 'flutter' },
  { id: 'tech-12', name: 'Prisma ORM', slug: 'prisma' },
];

export const mockProjects = [
  {
    id: 'proj-1',
    title: 'HarborFlow – Multi-Tenant SaaS Workspace',
    slug: 'harborflow-multi-tenant-saas-workspace',
    shortDescription: 'Production-ready enterprise SaaS starter with workspaces, RBAC, analytics, and webhook pipelines.',
    fullDescription: `### Overview
HarborFlow is a complete, production-hardened multi-tenant SaaS workspace engineered for developer-first productivity. It features robust tenant isolation, modular RBAC permissions, audit logging, and lightning-fast database interactions.

### Key Capabilities
- **Multi-Tenant Architecture**: Schema and tenant separation with zero data leakage.
- **Role-Based Authorization**: Granular roles (Owner, Admin, Member, Guest) with permission matrix.
- **Webhook Dispatch Engine**: High-throughput asynchronous event triggers with retry policies.
- **Audit Trails**: Immutable activity logs tracking every user and system event.
- **REST & GraphQL APIs**: Fully documented OpenAPI 3.0 specification included.`,
    categoryId: 'cat-1',
    category: { id: 'cat-1', name: 'Web Applications', slug: 'web-applications' },
    technologies: [
      { id: 'tech-1', name: 'React', slug: 'react' },
      { id: 'tech-2', name: 'Node.js', slug: 'nodejs' },
      { id: 'tech-4', name: 'PostgreSQL', slug: 'postgresql' },
      { id: 'tech-12', name: 'Prisma ORM', slug: 'prisma' },
      { id: 'tech-6', name: 'Tailwind CSS', slug: 'tailwind-css' },
    ],
    productType: 'FULL_APPLICATION',
    price: 149.00,
    isFree: false,
    isFeatured: true,
    status: 'PUBLISHED',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=75',
    demoUrl: 'https://demo.harborflow.example.com',
    licenseText: 'Single Commercial License: Grants buyer rights to deploy unlimited end-user instances. Resale of raw source code prohibited.',
    supportInformation: '6 months dedicated priority email and issue tracker support included with architecture advisory.',
    installationRequirements: 'Node.js 18+, PostgreSQL 14+, 2GB RAM minimum, NPM or Yarn package manager.',
    deliverables: 'Full frontend source code, backend Express API, Prisma schema with migrations, Docker compose files, comprehensive documentation PDF.',
    documentationAvailable: true,
    downloadAllowed: false,
    files: [{ id: 'f-1', originalName: 'harborflow_v2.5_source.zip', fileSize: 18500000 }],
    images: [
      { id: 'img-1', imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80', altText: 'Dashboard' },
      { id: 'img-2', imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80', altText: 'Analytics' }
    ]
  },
  {
    id: 'proj-2',
    title: 'DevHarbor React Starter Kit & Design System',
    slug: 'devharbor-react-starter-kit',
    shortDescription: 'Free modern developer starter kit featuring Tailwind CSS, accessible components, and clean architecture.',
    fullDescription: `### Overview
DevHarbor Starter Kit is an open-source, beautifully structured React boilerplate tailored for modern digital applications. It comes packed with pre-built accessible UI components, dark mode presets, Lucide icons integration, and clean folder structures.

### What's Inside
- **Clean Architecture**: Decoupled presentation, hooks, and services.
- **Component Showcase**: Over 40+ accessible UI components (dialogs, tables, drawers, buttons).
- **Theme Switcher**: Instant light/dark mode with CSS variable mappings.
- **Responsive Layouts**: 100% mobile-first design crafted with Tailwind CSS.`,
    categoryId: 'cat-10',
    category: { id: 'cat-10', name: 'Developer Templates', slug: 'developer-templates' },
    technologies: [
      { id: 'tech-1', name: 'React', slug: 'react' },
      { id: 'tech-6', name: 'Tailwind CSS', slug: 'tailwind-css' },
      { id: 'tech-7', name: 'TypeScript', slug: 'typescript' },
    ],
    productType: 'TEMPLATE',
    price: 0.00,
    isFree: true,
    isFeatured: true,
    status: 'PUBLISHED',
    thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=75',
    demoUrl: 'https://starterkit.coderharbor.example.com',
    licenseText: 'MIT Open-Source License: Free to use for personal and commercial applications with proper attribution.',
    supportInformation: 'Community GitHub discussion support and regular maintenance releases.',
    installationRequirements: 'Node.js 18+, modern browser supporting ES6 modules.',
    deliverables: 'Complete Vite + React 18 template repository, Tailwind CSS config, 40+ accessible UI components.',
    documentationAvailable: true,
    downloadAllowed: true,
    files: [{ id: 'f-2', originalName: 'devharbor_starter_kit.zip', fileSize: 4200000 }],
    images: [
      { id: 'img-3', imageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1000&q=80', altText: 'Starter Code' }
    ]
  },
  {
    id: 'proj-3',
    title: 'OmniBill Pro – Enterprise Invoicing & Tax Platform',
    slug: 'omnibill-pro-invoicing-tax-platform',
    shortDescription: 'Full-fledged billing system with GST/VAT compliance, recurring subscriptions, and multi-currency PDF generation.',
    fullDescription: `### Overview
OmniBill Pro is an advanced billing, accounting, and recurring invoice automation platform designed for modern consulting firms, agencies, and SaaS businesses.

### Features
- **Automated Recurring Invoices**: Scheduled PDF generation and customer notifications.
- **Multi-Currency & Tax Engine**: Pre-configured support for GST, VAT, and US Sales tax.
- **Client Self-Service Portal**: Customers can log in, view unpaid invoices, and download receipts.
- **Financial Analytics**: Real-time revenue run rate, accounts receivable aging, and expense tracking.`,
    categoryId: 'cat-5',
    category: { id: 'cat-5', name: 'Billing Software', slug: 'billing-software' },
    technologies: [
      { id: 'tech-2', name: 'Node.js', slug: 'nodejs' },
      { id: 'tech-3', name: 'Express.js', slug: 'express' },
      { id: 'tech-4', name: 'PostgreSQL', slug: 'postgresql' },
      { id: 'tech-12', name: 'Prisma ORM', slug: 'prisma' },
      { id: 'tech-1', name: 'React', slug: 'react' },
    ],
    productType: 'FULL_APPLICATION',
    price: 199.00,
    isFree: false,
    isFeatured: true,
    status: 'PUBLISHED',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=75',
    demoUrl: 'https://omnibill.coderharbor.example.com',
    licenseText: 'Standard Extended License for business deployment within your organization.',
    supportInformation: '12 months priority security updates and email ticket resolution.',
    installationRequirements: 'Node.js 18+, PostgreSQL 15, Chromium for PDF rendering service.',
    deliverables: 'Node/Express API, React Admin SPA, PDF render worker microservice, database migration scripts.',
    documentationAvailable: true,
    downloadAllowed: false,
    files: [{ id: 'f-3', originalName: 'omnibill_pro_source.zip', fileSize: 24000000 }],
    images: [
      { id: 'img-4', imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80', altText: 'Invoice Engine' }
    ]
  },
  {
    id: 'proj-4',
    title: 'EduHarbor LMS – Modern Course & Academy Portal',
    slug: 'eduharbor-lms-course-academy-portal',
    shortDescription: 'Feature-packed learning management system with video streaming, interactive quizzes, and student certificates.',
    fullDescription: `### Overview
EduHarbor LMS empowers educators, academies, and internal corporate training teams to deploy a branded digital university in minutes.

### Features
- **Video Lesson Player**: Adaptive bitrate streaming support with resume-playback.
- **Quiz & Examination Engine**: Multiple choice, code evaluation, and automated scoring.
- **Certificate Generation**: Automated SVG/PDF certificate issuance on course completion.
- **Instructor Dashboard**: Course authoring, student engagement heatmaps, and feedback.`,
    categoryId: 'cat-6',
    category: { id: 'cat-6', name: 'Education and LMS', slug: 'education-and-lms' },
    technologies: [
      { id: 'tech-1', name: 'React', slug: 'react' },
      { id: 'tech-5', name: 'Next.js', slug: 'nextjs' },
      { id: 'tech-2', name: 'Node.js', slug: 'nodejs' },
      { id: 'tech-4', name: 'PostgreSQL', slug: 'postgresql' },
      { id: 'tech-6', name: 'Tailwind CSS', slug: 'tailwind-css' },
    ],
    productType: 'FULL_APPLICATION',
    price: 249.00,
    isFree: false,
    isFeatured: true,
    status: 'PUBLISHED',
    thumbnail: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=600&q=75',
    demoUrl: 'https://eduharbor.demo.example.com',
    licenseText: 'Educational Commercial License: Single institution deployment.',
    supportInformation: '6 months technical setup assistance and Discord developer channel access.',
    installationRequirements: 'Node.js 20+, PostgreSQL 15, S3-compatible object storage for video assets.',
    deliverables: 'Full Next.js frontend, Express backend, Prisma schema, Certificate templates.',
    documentationAvailable: true,
    downloadAllowed: false,
    files: [{ id: 'f-4', originalName: 'eduharbor_lms.zip', fileSize: 32000000 }],
    images: [
      { id: 'img-5', imageUrl: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=1000&q=80', altText: 'Course Player' }
    ]
  },
  {
    id: 'proj-5',
    title: 'CoreERP Suite – Supply Chain & Inventory Manager',
    slug: 'coreerp-suite-inventory-manager',
    shortDescription: 'Industrial-grade ERP solution for warehouse management, supplier coordination, and asset tracking.',
    fullDescription: `### Overview
CoreERP Suite delivers end-to-end supply chain visibility for manufacturing, retail, and wholesale distribution businesses.

### Features
- **Warehouse Barcode & Bin Tracking**: Real-time stock level monitoring across multiple depots.
- **Purchase Order Workflow**: Approval workflows from requisition to supplier dispatch.
- **Vendor Rating Matrix**: Historical quality and delivery timeliness evaluation.
- **Stock Alert Triggers**: Automated alerts when safety thresholds are breached.`,
    categoryId: 'cat-4',
    category: { id: 'cat-4', name: 'ERP and CRM', slug: 'erp-and-crm' },
    technologies: [
      { id: 'tech-1', name: 'React', slug: 'react' },
      { id: 'tech-2', name: 'Node.js', slug: 'nodejs' },
      { id: 'tech-4', name: 'PostgreSQL', slug: 'postgresql' },
      { id: 'tech-8', name: 'Docker', slug: 'docker' },
    ],
    productType: 'FULL_APPLICATION',
    price: 389.00,
    isFree: false,
    isFeatured: false,
    status: 'PUBLISHED',
    thumbnail: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=75',
    demoUrl: 'https://coreerp.demo.example.com',
    licenseText: 'Enterprise Commercial License for on-premise or private cloud infrastructure.',
    supportInformation: 'Dedicated onboarding engineer consultation and 1 year updates.',
    installationRequirements: 'Docker and Docker Compose, 4GB RAM minimum, PostgreSQL 14+.',
    deliverables: 'Docker containers, seed datasets, complete microservices source code, Postman collection.',
    documentationAvailable: true,
    downloadAllowed: false,
    files: [{ id: 'f-5', originalName: 'coreerp_suite.zip', fileSize: 45000000 }],
    images: [
      { id: 'img-6', imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=80', altText: 'Warehouse Matrix' }
    ]
  },
  {
    id: 'proj-6',
    title: 'HarborCareer – Tech Talent & Job Portal Engine',
    slug: 'harborcareer-tech-job-portal-engine',
    shortDescription: 'Clean job board platform with applicant tracking, employer subscriptions, and resume parsing.',
    fullDescription: `### Overview
HarborCareer is a specialized job board and candidate management platform designed for niche tech communities and recruiters.

### Features
- **Employer Company Profiles**: Branded career pages with active openings.
- **Resume Search & Filter**: Filter candidates by tech stack, experience, and location.
- **Application Pipeline (Kanban)**: Drag-and-drop candidates through hiring stages.
- **Email Notification Automation**: Interview invitations and status update alerts.`,
    categoryId: 'cat-7',
    category: { id: 'cat-7', name: 'Job Portals', slug: 'job-portals' },
    technologies: [
      { id: 'tech-1', name: 'React', slug: 'react' },
      { id: 'tech-2', name: 'Node.js', slug: 'nodejs' },
      { id: 'tech-3', name: 'Express.js', slug: 'express' },
      { id: 'tech-4', name: 'PostgreSQL', slug: 'postgresql' },
      { id: 'tech-6', name: 'Tailwind CSS', slug: 'tailwind-css' },
    ],
    productType: 'FULL_APPLICATION',
    price: 179.00,
    isFree: false,
    isFeatured: false,
    status: 'PUBLISHED',
    thumbnail: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=600&q=75',
    demoUrl: 'https://careers.coderharbor.example.com',
    licenseText: 'Standard Single Domain Commercial License.',
    supportInformation: '6 months technical assistance and bug fix updates.',
    installationRequirements: 'Node.js 18+, PostgreSQL 14+, SMTP credentials for transactional emails.',
    deliverables: 'Frontend React app, backend API, database schema, email HTML templates.',
    documentationAvailable: true,
    downloadAllowed: false,
    files: [{ id: 'f-6', originalName: 'harborcareer_engine.zip', fileSize: 19000000 }],
    images: [
      { id: 'img-7', imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1000&q=80', altText: 'Talent Pipeline' }
    ]
  },
  {
    id: 'proj-7',
    title: 'ApexStore – Next.js High-Performance Marketplace',
    slug: 'apexstore-nextjs-marketplace',
    shortDescription: 'Modern e-commerce engine with headless cart, server-rendered product catalog, and instant search.',
    fullDescription: `### Overview
ApexStore is a high-speed headless eCommerce solution built with Next.js App Router, Tailwind CSS, and PostgreSQL backend.

### Key Features
- **Server Components & Edge Caching**: Sub-100ms page transitions and instant product lookups.
- **Cart & Wishlist Engine**: Stateful localStorage synchronization and guest checkout readiness.
- **Admin Order & Inventory Desk**: Real-time stock alerts and shipment management.
- **Ready for Payment Gateways**: Structured for Stripe/Razorpay hook connection in Phase 2.`,
    categoryId: 'cat-2',
    category: { id: 'cat-2', name: 'E-commerce', slug: 'e-commerce' },
    technologies: [
      { id: 'tech-1', name: 'React', slug: 'react' },
      { id: 'tech-5', name: 'Next.js', slug: 'nextjs' },
      { id: 'tech-4', name: 'PostgreSQL', slug: 'postgresql' },
      { id: 'tech-6', name: 'Tailwind CSS', slug: 'tailwind-css' },
      { id: 'tech-7', name: 'TypeScript', slug: 'typescript' },
    ],
    productType: 'FULL_APPLICATION',
    price: 189.00,
    isFree: false,
    isFeatured: true,
    status: 'PUBLISHED',
    thumbnail: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=600&q=75',
    demoUrl: 'https://apexstore.demo.example.com',
    licenseText: 'Single Commercial Production License.',
    supportInformation: '6 months technical bug assistance and deployment guide.',
    installationRequirements: 'Node.js 18+, PostgreSQL 14+.',
    deliverables: 'Next.js 14 App Router codebase, Tailwind components, Prisma database schema.',
    documentationAvailable: true,
    downloadAllowed: false,
    files: [{ id: 'f-7', originalName: 'apexstore_marketplace.zip', fileSize: 22000000 }],
    images: [
      { id: 'img-8', imageUrl: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=1000&q=80', altText: 'Storefront' }
    ]
  },
  {
    id: 'proj-8',
    title: 'CodeFolio – 3D Developer Portfolio & Studio Showcase',
    slug: 'codefolio-developer-portfolio-showcase',
    shortDescription: 'Free stunning personal portfolio template for software engineers, freelancers, and design studios.',
    fullDescription: `### Overview
CodeFolio is an open-source, ultra-slick personal showcase template engineered for developers who want to stand out to global clients and tech recruiters.

### Highlights
- **Interactive Project Showcases**: Filter projects by stack, live preview links, and GitHub integrations.
- **Contact Form with Webhooks**: Direct Telegram / Discord / Email dispatch.
- **Lighthouse 100/100 Score**: Optimized SEO metadata and zero-dependency animations.`,
    categoryId: 'cat-9',
    category: { id: 'cat-9', name: 'Portfolio Websites', slug: 'portfolio-websites' },
    technologies: [
      { id: 'tech-1', name: 'React', slug: 'react' },
      { id: 'tech-6', name: 'Tailwind CSS', slug: 'tailwind-css' },
      { id: 'tech-7', name: 'TypeScript', slug: 'typescript' },
    ],
    productType: 'TEMPLATE',
    price: 0.00,
    isFree: true,
    isFeatured: false,
    status: 'PUBLISHED',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=75',
    demoUrl: 'https://codefolio.demo.example.com',
    licenseText: 'MIT Open-Source License: Free to adapt and deploy for your personal portfolio.',
    supportInformation: 'Community GitHub issue tracker support.',
    installationRequirements: 'Node.js 18+, modern web browser.',
    deliverables: 'React source code, Tailwind configuration, responsive layouts.',
    documentationAvailable: true,
    downloadAllowed: true,
    files: [{ id: 'f-8', originalName: 'codefolio_portfolio.zip', fileSize: 3500000 }],
    images: [
      { id: 'img-9', imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1000&q=80', altText: 'Portfolio Grid' }
    ]
  }
];

export const mockSettings = {
  site_title: 'CoderHarbor – Digital Project Marketplace',
  site_tagline: 'Your Projects. Your Possibilities.',
  contact_email: 'support@coderharbor.com',
  contact_phone: '+1 (800) 555-0199',
  contact_address: '742 Harbor Way, Suite 400, San Francisco, CA 94107',
  purchasing_notice: 'Online purchasing is coming soon. Please check back later.',
};

export const mockUser = {
  id: 'usr-alex',
  name: 'Alex Morgan',
  email: 'alex@example.com',
  role: 'CUSTOMER',
  status: 'ACTIVE',
  company: 'Apex Digital Labs',
  phone: '+1 (555) 234-5678',
};
