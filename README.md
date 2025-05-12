# Teams & Products Management App 🛠️

A **collaborative platform** for managing **teams** and their **products**, built with **Next.js**, **Supabase**, and **ShadCN**. Users can **sign up**, **join or create teams**, and **collaborate on product management** — all handled via **Supabase services** including **Edge Functions**, **Storage**, and **Realtime** features.

## 🔍 Description

This app enables users to:
- **Authenticate** via Email/Password or Google
- **Create or join** a single team using a unique slug
- **Manage products** (CRUD) within their team
- **Track product status**: Draft, Active, or Deleted
- **Search, filter**, and **paginate** product listings
- **View online/offline** teammates in real time

## 📁 Project Structure

```
.
├── client/   # Next.js frontend (ShadCN, TailwindCSS)
└── server/ # Supabase Edge Functions, Database, Storage
```

## 🚀 Features

- **Email/Password and Google Auth**
- **Slug-based team joining**
- **Supabase Realtime** for online users
- **Supabase Edge Functions** for backend logic
- **Soft deletion** + **Cron task** to permanently remove after 2 days
- **Full-text search** + filtering by status and author
- **Row-Level Security** for product access control

## 🛠️ Tech Stack

### Frontend

- **Next.js 15**
- **React 19**
- **TailwindCSS**
- **ShadCN**
- **Framer Motion**
- **React Hook Form** + **Zod**
- **React Query** (`@tanstack/react-query`)
- **Supabase Auth Helpers**

### Backend

- **Supabase Edge Functions** (Deno)
- **Supabase Database** with **Row-Level Security**
- **Supabase Storage**, **Secrets**, **Realtime**, and **Cron**
- **Supabase JS**

## ⚙️ Setup

### 1. Clone the Repo

```bash
git clone https://github.com/andrew-dev-p/supabase-teams-products-management
cd supabase-teams-products-management
```

### 2. Setup Client

```bash
cd client
npm install
```

### 3. Setup Supabase

- Create a project on [Supabase](https://supabase.com)
- Configure your environment variables
- Deploy Edge Functions via Supabase CLI

## 🧪 Running Locally

### Client

```bash
cd client
npm run dev
```

### Supabase Functions

```bash
supabase functions serve
```

## 🔐 Environment Variables

### 📦 Client (`client/.env.local`)

```env
NEXT_PUBLIC_APP_URL=your-app-url

NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

NEXT_PUBLIC_API_URL=https://your-project-id.supabase.co/functions/v1/
```

### 🔧 Supabase

Use **Supabase Secrets** to store secrets securely.

## 📬 Deployment

- **Frontend**: Deployed via **Vercel**
- **Backend**: Deployed using **Supabase Edge Functions**