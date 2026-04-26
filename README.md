Full-Stack E-Commerce Platform

SparkTech is a production-ready, full-stack e-commerce platform designed to address gaps in Nepal’s local electronics market. It delivers a seamless, localized shopping experience for customers while providing a powerful, data-driven administrative system for efficient business management.

Key Features & Modules by Role

1. Admin Portal (Business Management)
* Analytics Dashboard: Real-time overview of sales, revenue, and store performance utilizing Recharts.
* Product Management: Dynamic inventory control, category organization, and detailed product listings.
* Order Management: End-to-end real-time tracking from pending to delivered, with automated document generation.
* Customer Oversight: Comprehensive management of user accounts and purchase histories.
* Support Ticketing: Dedicated system to handle customer inquiries and resolve issues efficiently.
* Settings Management: Configure global shop settings and administrative features.

2. Customer Portal (Storefront & Self-Service)
* Storefront & Catalog: Browse electronics by categories, utilize powerful search, and view immersive product pages.
* Shopping Cart & Wishlist: Dynamic cart management and the ability to save items for later.
* Account Dashboard: View complete order history, track current deliveries, and manage personal profile details.
* EMI & Warranty: Built-in tools for Equated Monthly Installment (EMI) planning and warranty claim submissions.
* Support & Services: Raise support tickets, find store locations, and access direct customer service.

Payment & Financial Integrations
* Localized Payment Gateways: Seamlessly integrated with eSewa and Khalti tailored specifically for the Nepalese market.
* Cash on Delivery (COD): Standardized option for local, physical payment upon delivery.

Automated Document & Notification Systems
* Real-time PDF Generation: Uses jsPDF for automated invoice and receipt generation, immediately triggered after successful transactions.
* Email Automation: Nodemailer integration for critical alerts (e.g., order confirmations, password resets, ticket updates).
* Bidirectional Ticketing: Real-time status updates on support issues between customers and administrators.

UI/UX Highlights
* Clean, non-italicized, premium responsive design utilizing Tailwind CSS and Radix UI.
* Fluid animations and page transitions powered by Framer Motion.
* Toast notifications via Sonner and Radix Toast for instant feedback.
* Modular, accessible component architecture featuring Embla Carousel.

Tech Stack
Frontend
* Framework: Next.js (React, TypeScript)
* Routing: Next.js App Router
* Styling & UI: Tailwind CSS, Radix UI, Lucide React, Framer Motion
* Data Management: React Hook Form, SWR, Zod

Backend & Database
* Runtime & Framework: Node.js, Next.js API Routes (TypeScript)
* Database: MongoDB with Mongoose ODM
* Authentication: JSON Web Tokens (jose) & bcryptjs
* File Management: Multer for secure file uploads

Third-Party Utilities & Integrations
* eSewa (Nepalese Local Payments)
* Khalti (Nepalese Local Payments)
* Nodemailer (SMTP Emails)
* jsPDF (Document Generation)

Technical Highlights
* Dual-Interface Architecture: Highly scalable separation of a modern customer-facing storefront and a data-driven administrative dashboard.
* Type Safety: End-to-end type safety using TypeScript, reducing runtime errors and improving maintainability.
* Advanced Analytics: Implemented dynamic data visualization dashboards for admin oversight using Recharts.
