# 📈 Pulse Analytics Platform
> **E-commerce Insights, Automated.** — Get actionable metrics in 5 minutes, not 5 weeks. No data team required.

---

## 🚀 Welcome to Pulse

**Pulse** is a high-fidelity, launch-ready B2B SaaS analytics platform designed specifically for small-to-midsize e-commerce brands (3–50 employees) on **Shopify** and **WooCommerce**. 

Spreadsheets are great for accounting, but terrible for running an e-commerce business. Pulse connects to your storefront in under 5 minutes to deliver real-time metrics, cohort retention heatmaps, order stream logs, and automated growth highlights — empowering merchants to double-down on what is driving revenue.

### 🌟 Value Proposition & Core Benefits:
*   **Plug-and-Play Integration:** Instant connection to Shopify and WooCommerce stores.
*   **Real-time Revenue Monitoring:** Automated charts, graphs, and transaction streams mapping exact store performance.
*   **Customer Cohort Matrix:** High-performance retention analytics displaying relative cohort decay to map customer lifetime value (LTV).
*   **Zero Complex Configs:** Designed for busy founders and operators. Pure clarity, zero bloat, and no SQL needed.

---

## 🎨 Visual Identity & Brand System

Our brand is designed to look modern, high-tech, data-driven, yet highly encouraging, approachable, and trustworthy.

*   **Primary (Pulse Indigo):** `#4F46E5` (Trust, intelligence, and modern stability)
*   **Secondary (Growth Teal):** `#0D9488` (Cash flow, health, and positive upward growth)
*   **Accent (Vibrant Coral):** `#F97316` (Urgency, alerts, and automated insight notifications)

### Product Design Artifacts:
You can find our vector logo files, dashboard screen mockups, and guidelines under:
*   `Brand Book Guidelines` $\rightarrow$ `/home/team/shared/designs/brand-guidelines.md`
*   `Vector SVG Logotypes` $\rightarrow$ `/home/team/shared/designs/svg/`
*   `Pre-Login Marketing Assets` $\rightarrow$ `/home/team/shared/designs/landing-hero.png`
*   `Post-Login Authenticated Mockups` $\rightarrow$ `/home/team/shared/designs/dashboard-screens/`

---

## 💻 Product Features & Walkthrough

### 1. Unified Post-Login Revenue Dashboard
A centralized, real-time command center showing Total Revenue (with growth trends), Average Order Value, Conversion Rates, and an interactive dual spline area chart. Includes a sidebar listing real-time purchase feeds with customer avatars.
> *Mockup File:* `/home/team/shared/designs/dashboard-screens/revenue-dashboard.png`

### 2. Orders Management Table
Granular transactional search and filters (*All Orders, Fulfilled, Processing, Cancelled*). Integrates custom platform-origin badges (Shopify/WooCommerce) and status pills.
> *Mockup File:* `/home/team/shared/designs/dashboard-screens/order-management.png`

### 3. Customer Cohort Retention Matrix
A professional heatmap grid highlighting cohort retention decay and average customer LTV, allowing store owners to analyze repurchase behaviors.
> *Mockup File:* `/home/team/shared/designs/dashboard-screens/cohort-retention.png`

### 4. Settings & Store Connections
Seamless onboarding panel enabling merchants to manage active Shopify storefronts, input API keys for WooCommerce stores, and handle billing tiers.
> *Mockup File:* `/home/team/shared/designs/dashboard-screens/integration-settings.png`

---

## 📦 Project Structure (Monorepo)

Pulse is organized as a clean single-origin monorepo:
*   `frontend/` - High-performance React client application compiled with Vite, Tailwind CSS, TypeScript, and Recharts.
*   `backend/` - Node.js Express server acting as the secure REST API and static asset host.
*   `shared/` - Roster configs, brand assets, mockups, and deployment guides.

---

## ⚡ Quick Start & Implementation

### 1. Install Dependencies
Run the unified installer script from the root workspace directory:
```bash
npm run install-all
```

### 2. Run Database Migrations
Pulse uses SQLite/Turso as its core coordination layer. Apply our optimized schemas:
```bash
# Apply schema
team-db "SELECT name FROM sqlite_master WHERE type='table'"
```

### 3. Build & Run (Single-Origin Production)
Only **port 3000** is exposed publicly. Express serves the compiled React application directly.
```bash
# Build the React static bundles
npm run frontend:build

# Run the single-origin server
npm run start
```
The application will bind to `0.0.0.0:3000` on all interfaces, serving both the API and client files.

---

## 📈 Platform Pricing Tiers

Pulse is priced to scale alongside growing stores:
1.  **Starter Plan ($99/mo):** Up to 1K orders/mo, basic real-time dashboards.
2.  **Growth Plan ($299/mo):** Up to 10K orders/mo, detailed customer cohort analysis, and LTV charts.
3.  **Scale Plan ($799/mo):** Unlimited volume, custom report exports, and full API access.
