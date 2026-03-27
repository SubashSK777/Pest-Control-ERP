# 🧪 Pest-Control-ERP: The Modern Pest Management Solution

A comprehensive, cloud-native Enterprise Resource Planning (ERP) platform designed specifically for the pest control industry. Built with high performance and visual excellence to empower businesses with real-time operations, scheduling, and customer management.

---

## 🚀 Key Features

*   **📅 Intelligent Scheduling & Dispatch**: Optimize technician routes and manage appointments with a drag-and-drop calendar interface.
*   **📊 Dynamic Dashboards**: Real-time analytics for revenue, active jobs, and technician performance.
*   **🧪 Inventory & Chemical Tracking**: Track usage of controlled substances and maintain compliance with digital logbooks.
*   **💳 Automated Invoicing & Payments**: Streamlined billing with support for digital payments and recurring service contracts.
*   **📱 Technician-First Mobile UI**: Fully responsive interface optimized for field technicians to record findings and upload photos on-site.
*   **📁 Customer Service History**: Centralized database for inspection reports, service records, and property maps.
*   **🌙 Dark Mode Support**: Premium, accessible design that looks great in any environment.

---

## 🛠️ Tech Stack

Built using the most modern and performant web technologies:

*   **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
*   **Logic**: [React 19](https://react.dev/)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [Tailwind CSS V4](https://tailwindcss.com/)
*   **Charts**: [ApexCharts](https://apexcharts.com/)
*   **Maps**: [JSVectormap](https://jvm-hub.com/)

---

## 📦 Installation

### Frontend Setup (Next.js)
1.  **Navigate to Frontend**: `cd frontend`
2.  **Install Dependencies**: `npm install`
3.  **Launch Dev Server**: `npm run dev`

### Backend Setup (Django)
1.  **Navigate to Backend**: `cd backend`
2.  **Install Requirements**: `pip install -r requirements.txt`
3.  **Run Migrations**: `python manage.py migrate`
4.  **Start Server**: `python manage.py runserver`

---

## 📂 Project Structure

### ⚛️ Frontend (`/frontend`)
*   `/app` - Next.js App Router (pages and layouts)
*   `/components` - Generic reusable UI components
*   `/features` - Feature-based grouping (Auth, User, Dashboard)
*   `/lib` - Utility functions and helpers
*   `/styles` - Global CSS and design tokens
*   `/hooks` - Custom React hooks

### 🐍 Backend (`/backend`)
*   `/config` - Django project settings and base URLs
*   `/apps` - Modular Django applications (authentication, crm)
*   `/services` - Pure business logic (separation from views)
*   `/api` - DRF views and REST endpoints

### 🐘 Database (`/db`)
*   `/migrations` - SQL schema migrations
*   `crm_schema.sql` - Initial database schema
*   `seed.sql` - Demo data seed scripts

---

## 🛡️ License

This project is licensed under the **MIT License**.

---

## 📩 Support & Contributions

If you're interested in contributing or need professional support for your pest control business, please reach out via the repository's issue tracker.

---

*Made with ❤️ for the Pest Control Industry.*
