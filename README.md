# Luqman Fabrics — Luxury Pakistani Unstitched Textiles Boutique 🧵✨

An end-to-end luxury e-commerce web application built for **Luqman Fabrics** (Shewa, Khyber Pakhtunkhwa, Pakistan).

---

## 🌟 Key Features

- **Luxury Brand Aesthetics**: High-end minimalist design with soft ivory, deep charcoal, and warm metallic gold color schemes.
- **Frictionless Guest Checkout**: Customers place orders in seconds without mandatory login or account creation.
- **Direct WhatsApp Order Confirmations**: 1-click WhatsApp message generation directly linked to store manager (+92 340 9797271).
- **Interactive Track Order Modal**: Search by WhatsApp / phone number or Order ID to inspect live 4-stage delivery progression, order items, and print receipts.
- **Firebase Firestore Cloud Integration**: Real-time cloud sync for products catalog, customer orders, and store settings.
- **Full Admin Dashboard**:
  - Secure PIN protection (`9797`)
  - Order status management & 1-click customer WhatsApp verification
  - 1-click order deletion from both dashboard and Cloud Firestore database
  - Product catalog CRUD (Add / Edit / Stock counts)
  - Real-time revenue & order analytics

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create `.env.local` with your Firebase project credentials:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAEYfjM9wPLoABq_9lPmoJLHePlXUWFgcE
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=luqman-fabrics.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=luqman-fabrics
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=luqman-fabrics.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=363299998275
NEXT_PUBLIC_FIREBASE_APP_ID=1:363299998275:web:a0db6bffeaf809c85422f6
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-DZC95CJZTR
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Admin Dashboard Access
- URL: `/admin`
- Default Security PIN: `9797`

---

## 📦 Tech Stack
- **Framework**: Next.js 14 (App Router, React 18, TypeScript)
- **Styling**: Tailwind CSS & Lucide Icons
- **Database & Cloud**: Firebase Firestore & Firebase Analytics
- **Order Notifications**: Direct WhatsApp API Integration
