# MessageABCs — Project State & Handover Guide

> **Last Updated**: September 5, 2026  
> **Status**: MongoDB to Neon PostgreSQL Migration Completed & Verified

---

## 📌 1. Project Overview & Architecture

**MessageABCs** is a full-stack biblical topics content publishing, reading, and interactive community Q&A platform.

- **Frontend (`/`)**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Radix UI, TanStack Query, TipTap rich text editor.
- **Backend (`/messageabcs-server`)**: Express.js, TypeScript, PostgreSQL via **Prisma ORM** (formerly MongoDB/Mongoose), Socket.io, JWT authentication with refresh token families.
- **Database**: **Neon DB (Serverless PostgreSQL)**.
- **Production Deployments**:
  - Frontend: Vercel (`https://messageabcs.vercel.app`)
  - Backend: Render (`https://messageabcs-server.onrender.com/api`)
  - Database: Neon PostgreSQL

---

## 🚀 2. What Has Been Done

### A. Frontend Features & Components
- **Topic Exploration (`app/topics/page.tsx`)**: Filterable topic grid with search, responsive cards, and dynamic question counts.
- **Reader Interface (`app/reading/[slug]/page.tsx`)**: Article reader with TipTap formatted content, dynamic Table of Contents, scripture references, quote callouts, and "Other Topics" recommendations.
- **SEO & Social Previews**: OpenGraph dynamic metadata tags, Twitter cards, and favicon assets.
- **Q&A System (`app/qa/page.tsx`, `app/ask-question/page.tsx`)**: Community questions and answers with threaded discussions.
- **Admin Dashboard (`app/admin/page.tsx`, `components/adminDashboard/`)**: Modular dashboard for managing Topics, Questions, Answers, Activities, and system stats.
- **Authentication (`app/login/page.tsx`, `contexts/AuthContext.tsx`)**: Modernized login flow with JWT storage and automatic token refresh.

### B. MongoDB ➔ Neon (PostgreSQL) Migration (Completed)
We moved the entire backend database layer from MongoDB to Neon DB (PostgreSQL) using Prisma 6:
1. **Prisma Schema (`messageabcs-server/prisma/schema.prisma`)**:
   - `Topic`: Topics with rich text, scripture arrays, quote arrays.
   - `Question` & `Answer`: Normalized with cascading foreign keys (`onDelete: Cascade`).
   - `Message`: Threaded conversation tree with self-referencing hierarchy (`parent` / `replies`).
   - `Activity`: Admin activity logs with expiration tracking.
   - `RefreshToken`: Multi-device token family rotation with automatic reuse detection.
2. **Backend Route Handlers Refactored to Prisma**:
   - `src/routes/topics.ts`
   - `src/routes/questions.ts`
   - `src/routes/messages.ts`
   - `src/routes/auth.ts`
   - `src/routes/admin.ts`
   - `src/server.ts`
3. **Data Migration Script (`messageabcs-server/scripts/migrate-mongo-to-neon.ts`)**:
   - Transferred and verified 100% of records from MongoDB Atlas to Neon:
     - Topics: 9 / 9 migrated
     - Messages: 4 / 4 migrated
     - Refresh Tokens: 51 / 51 migrated
4. **Build & Validation**:
   - Both backend and root Next.js TypeScript typechecks pass with **0 errors**.
   - Live endpoints (`/api/topics`, `/api/topics/with-question-counts`, `/api/health`) tested and verified against Neon.

---

## 📁 3. Key File Locations

```
messageabcsv1/
├── app/                              # Next.js frontend routes
│   ├── admin/                        # Admin Dashboard page
│   ├── ask-question/                 # Ask question page
│   ├── login/                        # Login page
│   ├── qa/                           # Community Q&A page
│   ├── reading/[slug]/               # Topic reader article page
│   ├── topics/                       # Topic catalog grid page
│   ├── layout.tsx                    # Root layout with Vercel Analytics
│   └── page.tsx                      # Landing homepage
├── components/                       # Frontend UI components
│   ├── adminDashboard/               # Modularized admin components
│   ├── Reading/                      # Reader headers & OtherTopics
│   ├── Topics/                       # TopicCard & list components
│   ├── TiptapEditor.tsx              # Rich text content editor
│   └── FloatingWhatsApp.tsx          # Floating WhatsApp widget
├── services/
│   └── api.ts                        # Frontend API client service
└── messageabcs-server/               # Backend Express + Prisma API
    ├── prisma/
    │   └── schema.prisma             # PostgreSQL schema definition
    ├── scripts/
    │   └── migrate-mongo-to-neon.ts  # MongoDB -> Neon migration script
    ├── src/
    │   ├── db/
    │   │   └── prisma.ts             # Prisma client singleton
    │   ├── middleware/
    │   │   └── auth.ts               # JWT authentication middleware
    │   ├── routes/                   # Prisma-powered API endpoints
    │   │   ├── admin.ts
    │   │   ├── auth.ts
    │   │   ├── messages.ts
    │   │   ├── questions.ts
    │   │   └── topics.ts
    │   ├── utils/
    │   │   └── activity.ts           # Activity logging helper
    │   ├── types/                    # Shared TypeScript types
    │   └── server.ts                 # Express entrypoint & health check
    └── .env                          # Backend environment variables (DATABASE_URL, JWT_SECRET, etc.)
```

---

## ⚙️ 4. Useful Commands

### Backend (`messageabcs-server/`)
```bash
# Start backend server in dev mode
pnpm run dev:ts-node

# Push schema changes to Neon
pnpm run db:push

# Re-generate Prisma Client
pnpm run db:generate

# Run MongoDB to Neon data migration (if needed again)
pnpm run db:migrate-mongo

# Typecheck backend
pnpm exec tsc --noEmit
```

### Frontend (Root `/`)
```bash
# Start Next.js dev server
npm run dev

# Run frontend typecheck
npm run typecheck

# Build frontend for production
npm run build
```

---

## 🎯 5. Next Steps / Pending Opportunities

1. **Production Deployment**:
   - Update Render backend environment variables to include the new Neon `DATABASE_URL`.
   - Trigger backend redeploy on Render.
2. **Next.js Direct DB Option (Optional Future Architecture)**:
   - Since Neon supports serverless queries, Next.js Server Components and Server Actions can optionally query Neon directly without having to call the Express server for public GET queries, eliminating cold starts completely.
