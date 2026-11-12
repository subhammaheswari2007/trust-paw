# 🐾 TrustPaw — Premier Indian Pet Care & Clinic Directory Platform

[![Node.js](https://img.shields.io/badge/Node.js-18+-43853D?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.21-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![SQLite](https://img.shields.io/badge/SQLite-Embedded-003B57?style=flat&logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth%20%26%20Hosting-FFCA28?style=flat&logo=firebase&logoColor=black)](https://firebase.google.com/)

---

## 📌 Executive Summary

**TrustPaw** is an end-to-end, accessibility-first pet healthcare and companion animal services platform built specifically for Indian pet parents, veterinary clinics, independent groomers, and emergency animal hospitals.

Addressing the critical gap of fragmented pet healthcare in Indian metropolitan centers (Mumbai, Bengaluru, Delhi NCR, Pune, Ahmedabad), TrustPaw combines verified clinic discovery with two foundational innovations:
1. **Zero-Friction WhatsApp Booking Bridge**: Eliminates traditional payment-wall barriers and account fatigue by letting pet parents schedule appointments via automated web booking or dispatch a rich, pre-formatted appointment request directly to the veterinarian's WhatsApp (`wa.me`).
2. **सुगम सेवा (Easy Assist Mode)**: A dedicated accessibility layer tailored for senior citizens and low-tech pet parents featuring high-contrast editorial typography, bilingual Hindi-English interfaces, Web Speech API voice guidance (Text-to-Speech), and an intuitive 4-step booking flow.
3. **24/7 Trauma SOS & Real-time Distance Engine**: Instant emergency assistance utilizing client geolocation and the Haversine formula to compute road distances to the nearest open veterinary hospitals, backed by one-tap emergency calling and live navigation routing.

---

## 📋 Table of Contents
- [Executive Summary](#-executive-summary)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Project Directory Structure](#-project-directory-structure)
- [Database Schema](#-database-schema)
- [API Reference](#-api-reference)
- [Getting Started & Local Setup](#-getting-started--local-setup)
- [Environment Configuration](#-environment-configuration)
- [Admin Portal & Management](#-admin-portal--management)
- [Deployment Guide](#-deployment-guide)

---

## ✨ Key Features

### 🏥 1. Comprehensive Pet Services & Clinic Directory
- **Multi-Pet Support**: Dedicated filters and workflows for Dogs (कुत्ता), Cats (बिल्ली), Birds (पक्षी), Rabbits (खरगोश), and Exotic pets.
- **Service Categories**: Veterinary Care (पशु चिकित्सा), Grooming & Spa (ग्रूमिंग), Behavior & Training (प्रशिक्षण), and Supplies & Diet (सामान).
- **Location-Aware Filtering**: Instant multi-city lookup covering Mumbai, Bengaluru, Delhi NCR, Pune, and Ahmedabad, with distance calculations from the user's current GPS position.
- **Provider Profiles**: Verified doctor credentials, consultation pricing transparency, operating hours, real client reviews, address details, and direct slot availability.

### 🚨 2. 24/7 Emergency SOS Trauma Response
- One-click emergency trigger floating persistently across the application.
- Real-time Haversine distance calculation to all nearby 24/7 emergency veterinary clinics.
- One-tap phone dialing to on-duty trauma surgeons and instant emergency WhatsApp alert triggers.
- Live Google Maps navigation link generation with pre-populated clinic coordinates.

### 💬 3. Direct WhatsApp Appointment Bridge
- Overcomes booking friction by pairing automated slot scheduling with WhatsApp (`wa.me`) integration.
- Automatically generates pre-formatted multilingual appointment requests including pet name, breed, selected service, date, and preferred time slot sent straight to the clinic's reception desk.

### 🗣️ 4. सुगम सेवा (Easy Assist Mode)
- Specially crafted for older pet parents and accessibility needs.
- **High-Contrast Warm Editorial Palette**: Soothing, readable aesthetic with large interactive touch targets.
- **Bilingual Interface**: Seamless Hindi-English bilingual labels and instructions across the entire journey.
- **Speech Synthesis (TTS)**: Built-in voice narration utilizing the browser's Web Speech API for reading steps and doctor recommendations aloud.
- **Simplified 4-Step Flow**: Pet selection → Concern identification → Doctor matching → One-click confirmation.

### 🐾 5. Pet Health & Registry Management
- Store multiple pets per user account with breed, age, and medical history notes.
- Seamlessly associate specific pets with booking appointments and past consultation records.

### 🔐 6. Secure Multi-Tier Authentication
- **Email OTP Verification**: Passwordless or OTP-backed onboarding with Nodemailer integration (and automated dev fallback).
- **Google OAuth 2.0**: Native sign-in support via Firebase Auth / Google Auth Library.
- **JWT Session Security**: Secure HTTP-only cookies and Authorization header handling, rate-limited against brute-force attacks.

### 🛠️ 7. Dynamic Admin & Clinic Management Portal
- Passcode-protected administrative dashboard (`/admin`) for platform maintainers and clinic managers.
- In-place provider creation, catalog updates, and clinic deletion.
- Dynamic homepage hero banner management with instant preview and persistence.
- Real-time hotline and 24/7 emergency hospital coordinator phone configuration.

---

## 🏛️ System Architecture

TrustPaw is engineered as a decoupled monorepo featuring a high-performance React client and an Express REST API backend backed by persistent SQLite storage.

```
                              +------------------------------------------+
                              |         TrustPaw Web Platform            |
                              |  (Pet Care, Clinics, Grooming & Store)   |
                              +--------------------+---------------------+
                                                   |
                   +-------------------------------+-------------------------------+
                   |                               |                               |
                   v                               v                               v
        +----------------------+       +-----------------------+       +-----------------------+
        |  Pet Parents / Users |       | Emergency SOS Trauma  |       | Clinic Administrators |
        |  - Slot Booking      |       | - 24/7 Hospital Finder|       | - Directory Editing   |
        |  - WhatsApp Bridge   |       | - One-tap Phone Dial  |       | - Dynamic Hero & SOS  |
        |  - Easy Assist (TTS) |       | - Live GPS Routing    |       | - Doctor Schedules    |
        +----------+-----------+       +-----------+-----------+       +-----------+-----------+
                   |                               |                               |
                   +-------------------------------+-------------------------------+
                                                   |
                                                   v
                                      +-------------------------+
                                      |   Client-Side SPA       |
                                      |   Vite + React 18       |
                                      |   Contexts, TTS, Geonav |
                                      +------------+------------+
                                                   |  HTTP / REST API (CORS + JWT)
                                                   v
                                      +-------------------------+
                                      |   Express.js API Server |
                                      |   Rate Limiter & Helmet |
                                      +------------+------------+
                                                   |
                          +------------------------+------------------------+
                          |                                                 |
                          v                                                 v
             +--------------------------+                      +--------------------------+
             |   SQLite Persistence     |                      |   External Integrations  |
             |   (Users, Pets, Bookings,|                      |   - Firebase Google Auth |
             |    Providers, Settings)  |                      |   - Nodemailer SMTP      |
             +--------------------------+                      |   - WhatsApp API (wa.me) |
                                                               +--------------------------+
```

---

## 💻 Tech Stack

### Client (Frontend)
- **Framework:** React 18 (SPA)
- **Build Tool:** Vite 5
- **Routing:** React Router DOM v6
- **Authentication:** Firebase Client SDK v13 (Google OAuth) + Custom JWT Auth Context
- **Voice / Accessibility:** Web Speech Synthesis API (Bilingual Hindi-English TTS)
- **Geolocation:** Browser Geolocation API + Haversine Geodesic Distance Matrix
- **Styling:** Modular CSS3 with custom Editorial Healthcare design tokens

### Server (Backend)
- **Runtime:** Node.js (ES Modules, Node 18+)
- **Framework:** Express.js 4.21
- **Database:** Embedded SQLite with WAL mode (`node:sqlite` / `better-sqlite3` fallback)
- **Security:** Helmet (Content Security Policy), CORS, Express Rate Limit, Express Validator
- **Authentication:** JSON Web Tokens (`jsonwebtoken`), bcryptjs password hashing, Google Auth Library (`google-auth-library`)
- **Email Delivery:** Nodemailer (SMTP with Google App Passwords support)

### Hosting & Infrastructure
- **Web App / Client:** Vercel / Firebase App Hosting
- **Server / Backend:** Cloud Run / Node.js Process Manager

---

## 📂 Project Directory Structure

```text
pet-store/
├── client/                               # React + Vite Frontend Application
│   ├── public/                           # Static assets, SVG icons, manifests
│   ├── src/
│   │   ├── components/                   # Reusable UI Components
│   │   │   ├── BookingSlots.jsx          # Interactive time slot picker
│   │   │   ├── BottomNav.jsx             # Mobile bottom navigation bar
│   │   │   ├── DistanceTracker.jsx       # Geolocation distance display badge
│   │   │   ├── EasyAssistToggle.jsx      # Header accessibility mode switcher
│   │   │   ├── Header.jsx                # Main navigation header with city selector
│   │   │   ├── PetCategoryScroller.jsx   # Horizontal species selector (Dog, Cat, etc.)
│   │   │   ├── ProtectedRoute.jsx        # Route authorization guard
│   │   │   ├── ProviderCard.jsx          # Clinic and doctor catalog cards
│   │   │   ├── ProviderEditorModal.jsx   # Admin modal for adding/editing clinics
│   │   │   ├── SecretAdminModal.jsx      # Passcode modal for administrator unlock
│   │   │   ├── ServicesGrid.jsx          # Service category discovery grid
│   │   │   ├── Sidebar.jsx               # Desktop collapsible side menu
│   │   │   ├── SOSModal.jsx              # Emergency hospital trauma finder
│   │   │   ├── TTSButton.jsx             # Text-to-Speech audio readout button
│   │   │   └── WhatsAppBooking.jsx       # Direct WhatsApp message builder & button
│   │   ├── config/
│   │   │   └── firebase.js               # Firebase Client initialization & Auth
│   │   ├── contexts/
│   │   │   ├── AuthContext.jsx           # Global user authentication state
│   │   │   ├── EasyAssistContext.jsx     # High-contrast & bilingual state
│   │   │   └── LocationContext.jsx       # User coordinates & location state
│   │   ├── hooks/
│   │   │   ├── useAuth.js                # Auth context consumer hook
│   │   │   ├── useLocation.js            # Location context consumer hook
│   │   │   └── useSpeechSynthesis.js     # Web Speech synthesis wrapper
│   │   ├── pages/
│   │   │   ├── AdminPortalPage.jsx       # Platform & clinic management portal
│   │   │   ├── BookingsPage.jsx          # User appointment dashboard & history
│   │   │   ├── Dashboard.jsx             # Primary discovery homepage
│   │   │   ├── EasyAssistFlow.jsx        # 4-step accessible booking wizard
│   │   │   ├── LoginPage.jsx             # Multi-method login page (Email/OTP/Google)
│   │   │   ├── OTPVerifyPage.jsx         # 6-digit OTP verification screen
│   │   │   ├── ProfilePage.jsx           # User & pet registry management
│   │   │   ├── ProviderDetailPage.jsx    # Doctor profile, pricing & appointment booking
│   │   │   ├── ProviderListPage.jsx      # Filterable catalog with search & sorting
│   │   │   ├── SetPasswordPage.jsx       # Password setup for new accounts
│   │   │   └── VerificationLoader.jsx    # OAuth redirect state handler
│   │   ├── services/
│   │   │   └── api.js                    # Centralized REST API client
│   │   ├── utils/
│   │   │   ├── constants.js              # Categories, cities, and editorial palette
│   │   │   └── formatters.js             # Currency (INR), date, and phone formatters
│   │   ├── App.jsx                       # Application route definitions
│   │   ├── index.css                     # Global design tokens and reset styles
│   │   └── main.jsx                      # React entry point
│   ├── .env.example                      # Client environment template
│   ├── vite.config.js                    # Vite configuration & dev server proxy
│   └── package.json
├── server/                               # Node.js + Express REST API
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                     # SQLite connection manager with WAL mode
│   │   ├── controllers/
│   │   │   ├── authController.js         # Authentication, OTP & Google sign-in logic
│   │   │   ├── bookingController.js      # Appointment & pet management logic
│   │   │   └── providerController.js     # Provider catalog & admin controls
│   │   ├── data/
│   │   │   └── providers.js              # Seed database of 30+ real Indian clinics
│   │   ├── middleware/
│   │   │   ├── auth.js                   # JWT verification middleware
│   │   │   ├── rateLimiter.js            # Express rate limiting rules
│   │   │   └── validation.js             # Express-validator request sanitizers
│   │   ├── models/
│   │   │   └── schema.js                 # SQLite DDL tables, seed scripts & migrations
│   │   ├── routes/
│   │   │   ├── auth.js                   # Authentication endpoints
│   │   │   ├── bookings.js               # Booking & pet endpoints
│   │   │   └── providers.js              # Provider directory & admin endpoints
│   │   ├── utils/
│   │   │   ├── constants.js              # Server constants & default settings
│   │   │   ├── email.js                  # Nodemailer OTP email transporter
│   │   │   ├── haversine.js              # Geodesic distance calculation formula
│   │   │   ├── jwt.js                    # Token signing and cookie helpers
│   │   │   └── otp.js                    # Cryptographic 6-digit OTP generator
│   │   └── index.js                      # Express server entry point
│   ├── .env.example                      # Server environment template
│   ├── trustpaw.db                       # Local SQLite database file (auto-generated)
│   └── package.json
├── apphosting.yaml                       # Firebase App Hosting configuration
├── firebase.json                         # Firebase project configuration
├── vercel.json                           # Vercel deployment configuration
├── package.json                          # Monorepo root management scripts
└── README.md                             # Project documentation
```

---

## 🗄️ Database Schema

The platform uses an embedded SQLite database (`trustpaw.db`) initialized automatically upon server startup:

```
+--------------------+       +--------------------+       +---------------------+
|       users        |       |       pets         |       |      providers      |
+--------------------+       +--------------------+       +---------------------+
| id (PK)            | 1   * | id (PK)            |       | id (PK)             |
| email (UNIQUE)     +-------< user_id (FK)       |       | name                |
| phone              |       | name               |       | clinic_name         |
| password_hash      |       | category           |       | category            |
| name               |       | breed              |       | city / area         |
| avatar_url         |       | age                |       | lat / lng           |
| auth_provider      |       +---------+----------+       | phone / email       |
| google_id          |                 |                  | rating / reviews    |
| easy_assist_mode   |                 | 1                | specializations     |
+---------+----------+                 |                  | is_emergency / 24x7 |
          | 1                          |                  | pricing (JSON)      |
          |                            |                  | available_slots     |
          | *                          | *                +----------+----------+
+---------+----------+       +---------+----------+                  | 1
|        otps        |       |      bookings      |                  |
+--------------------+       +--------------------+                  |
| id (PK)            |       | id (PK)            |                  |
| email / phone      |       | user_id (FK)       |                  |
| otp_hash           |       | pet_id (FK)        |                  |
| expires_at         |       | provider_id (FK)   >------------------+ *
| verified           |       | service_type       |
+--------------------+       | booking_date       |
                             | time_slot          |
                             | status             |
                             +--------------------+
```

- **`site_settings`**: Key-value store holding runtime configurations like dynamic `heroImageUrl`, emergency hotline numbers (`sosPhone`), and trauma hospital names (`sosHospitalName`).

---

## 📡 API Reference

Base URL: `http://localhost:5000/api/v1`

### 1. Authentication (`/api/v1/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/email-otp` | Public | Generate and send a 6-digit OTP to the user's email. |
| `POST` | `/verify-otp-password` | Public | Verify OTP and set password for initial registration. |
| `POST` | `/login` | Public | Authenticate with email and password to receive JWT. |
| `POST` | `/google` | Public | Verify Google OAuth credential and issue JWT session. |
| `GET` | `/me` | Protected | Fetch current logged-in user profile and pet records. |
| `POST` | `/logout` | Public | Clear HTTP-only session cookies. |

### 2. Providers & Clinics (`/api/v1/providers`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/` | Public | Filter providers by category, city, search query, coordinates, and sort order. |
| `GET` | `/emergency` | Public | Fetch 24/7 emergency trauma hospitals sorted by distance. |
| `GET` | `/:id` | Public | Retrieve detailed clinic profile, pricing, and available slots. |
| `GET` | `/settings` | Public | Retrieve active site banner and emergency hotline settings. |
| `POST` | `/admin/verify` | Public | Verify administrator passcode (`ADMIN_SECRET`). |
| `POST` | `/admin/save` | Admin | Create or update a provider record in the catalog. |
| `DELETE` | `/admin/:id` | Admin | Delete a provider entry by ID. |
| `POST` | `/admin/settings` | Admin | Update dynamic hero banner, SOS hotline number, or hospital name. |

### 3. Bookings & Pets (`/api/v1/bookings`, `/api/v1/pets`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/bookings` | Protected | Create a new appointment booking for a registered pet. |
| `GET` | `/bookings` | Protected | List all appointments associated with the authenticated user. |
| `POST` | `/pets` | Protected | Register a new pet profile under the authenticated user. |
| `GET` | `/pets` | Protected | Retrieve all pets owned by the authenticated user. |

### 4. System Health
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/health` | Public | Returns API status and heart-beat (`{ success: true }`). |

---

## 🚀 Getting Started & Local Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- `npm` (v9 or higher)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/pet-store.git
cd pet-store
```

### 2. Install Dependencies
Run the root script to install dependencies for both client and server simultaneously:
```bash
npm run install:all
```
*(Or install individually inside `client` and `server` directories)*:
```bash
cd server && npm install
cd ../client && npm install
```

### 3. Setup Environment Variables
Create `.env` files for both server and client using the provided templates:

**Server Configuration (`server/.env`):**
```bash
cp server/.env.example server/.env
```
Ensure your `server/.env` contains:
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=super_secret_jwt_key_trustpaw_2026
JWT_EXPIRY=7d
ADMIN_SECRET=trustpaw2007
CORS_ORIGIN=http://localhost:5173

# Optional: Nodemailer SMTP for live email delivery
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=trustpaw.noreply@gmail.com
SMTP_PASS=your-google-app-password
```

**Client Configuration (`client/.env`):**
```bash
cp client/.env.example client/.env
```
Set the API URL and optional Firebase client keys:
```env
VITE_API_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=trust-paw
VITE_GOOGLE_CLIENT_ID=your-google-oauth-client-id
```

### 4. Run Development Servers
Open two terminal windows or run the monorepo scripts from the project root:

**Start the Server:**
```bash
npm run dev:server
```
*API will start on `http://localhost:5000` with the SQLite database initialized and seeded automatically.*

**Start the Client:**
```bash
npm run dev:client
```
*Vite dev server will start on `http://localhost:5173`.*

---

## 🔑 Admin Portal & Management

TrustPaw includes a built-in admin portal accessible at `/admin`.

- **Access Passcode**: Configured via `ADMIN_SECRET` in `server/.env` (Default: `trustpaw2007`).
- **Features Available to Admins**:
  - **Live Provider Catalog Editor**: Add new veterinarians, clinics, or groomers with coordinates, consultation fees, and available hours.
  - **Hero Banner Customization**: Update the home page hero image in real-time by pasting an image URL.
  - **National Emergency SOS Hotline**: Update the emergency phone number and emergency trauma hospital name reflected in user SOS modals across the platform.

---

## 🚢 Deployment Guide

### Deploying the Client (Vercel)
The root directory includes a `vercel.json` pointing to `client/`. To deploy via Vercel CLI:
```bash
vercel --prod
```
Ensure the environment variable `VITE_API_URL` is set to your deployed backend URL in the Vercel dashboard.

### Deploying with Firebase App Hosting
Configuration is provided in `apphosting.yaml` and `firebase.json`:
```bash
firebase deploy
```

---

## 📄 License & Attribution

Developed with ❤️ for pet parents, rescue caregivers, and companion animals across India.  
Open-source under the [MIT License](LICENSE).


---

## 🗄️ Database Schema

The platform uses an embedded SQLite database (`trustpaw.db`) initialized automatically upon server startup:

```
+--------------------+       +--------------------+       +---------------------+
|       users        |       |       pets         |       |      providers      |
+--------------------+       +--------------------+       +---------------------+
| id (PK)            | 1   * | id (PK)            |       | id (PK)             |
| email (UNIQUE)     +-------< user_id (FK)       |       | name                |
| phone              |       | name               |       | clinic_name         |
| password_hash      |       | category           |       | category            |
| name               |       | breed              |       | city / area         |
| avatar_url         |       | age                |       | lat / lng           |
| auth_provider      |       +---------+----------+       | phone / email       |
| google_id          |                 |                  | rating / reviews    |
| easy_assist_mode   |                 | 1                | specializations     |
+---------+----------+                 |                  | is_emergency / 24x7 |
          | 1                          |                  | pricing (JSON)      |
          |                            |                  | available_slots     |
          | *                          | *                +----------+----------+
+---------+----------+       +---------+----------+                  | 1
|        otps        |       |      bookings      |                  |
+--------------------+       +--------------------+                  |
| id (PK)            |       | id (PK)            |                  |
| email / phone      |       | user_id (FK)       |                  |
| otp_hash           |       | pet_id (FK)        |                  |
| expires_at         |       | provider_id (FK)   >------------------+ *
| verified           |       | service_type       |
+--------------------+       | booking_date       |
                             | time_slot          |
                             | status             |
                             +--------------------+
```

- **`site_settings`**: Key-value store holding runtime configurations like dynamic `heroImageUrl`, emergency hotline numbers (`sosPhone`), and trauma hospital names (`sosHospitalName`).

---

## 📡 API Reference

Base URL: `http://localhost:5000/api/v1`

### 1. Authentication (`/api/v1/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/email-otp` | Public | Generate and send a 6-digit OTP to the user's email. |
| `POST` | `/verify-otp-password` | Public | Verify OTP and set password for initial registration. |
| `POST` | `/login` | Public | Authenticate with email and password to receive JWT. |
| `POST` | `/google` | Public | Verify Google OAuth credential and issue JWT session. |
| `GET` | `/me` | Protected | Fetch current logged-in user profile and pet records. |
| `POST` | `/logout` | Public | Clear HTTP-only session cookies. |

### 2. Providers & Clinics (`/api/v1/providers`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/` | Public | Filter providers by category, city, search query, coordinates, and sort order. |
| `GET` | `/emergency` | Public | Fetch 24/7 emergency trauma hospitals sorted by distance. |
| `GET` | `/:id` | Public | Retrieve detailed clinic profile, pricing, and available slots. |
| `GET` | `/settings` | Public | Retrieve active site banner and emergency hotline settings. |
| `POST` | `/admin/verify` | Public | Verify administrator passcode (`ADMIN_SECRET`). |
| `POST` | `/admin/save` | Admin | Create or update a provider record in the catalog. |
| `DELETE` | `/admin/:id` | Admin | Delete a provider entry by ID. |
| `POST` | `/admin/settings` | Admin | Update dynamic hero banner, SOS hotline number, or hospital name. |

### 3. Bookings & Pets (`/api/v1/bookings`, `/api/v1/pets`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/bookings` | Protected | Create a new appointment booking for a registered pet. |
| `GET` | `/bookings` | Protected | List all appointments associated with the authenticated user. |
| `POST` | `/pets` | Protected | Register a new pet profile under the authenticated user. |
| `GET` | `/pets` | Protected | Retrieve all pets owned by the authenticated user. |

### 4. System Health
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/health` | Public | Returns API status and heart-beat (`{ success: true }`). |

---

## 🚀 Getting Started & Local Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- `npm` (v9 or higher)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/pet-store.git
cd pet-store
```

### 2. Install Dependencies
Run the root script to install dependencies for both client and server simultaneously:
```bash
npm run install:all
```
*(Or install individually inside `client` and `server` directories)*:
```bash
cd server && npm install
cd ../client && npm install
```

### 3. Setup Environment Variables
Create `.env` files for both server and client using the provided templates:

**Server Configuration (`server/.env`):**
```bash
cp server/.env.example server/.env
```
Ensure your `server/.env` contains:
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=super_secret_jwt_key_trustpaw_2026
JWT_EXPIRY=7d
ADMIN_SECRET=trustpaw2007
CORS_ORIGIN=http://localhost:5173

# Optional: Nodemailer SMTP for live email delivery
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=trustpaw.noreply@gmail.com
SMTP_PASS=your-google-app-password
```

**Client Configuration (`client/.env`):**
```bash
cp client/.env.example client/.env
```
Set the API URL and optional Firebase client keys:
```env
VITE_API_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=trust-paw
VITE_GOOGLE_CLIENT_ID=your-google-oauth-client-id
```

### 4. Run Development Servers
Open two terminal windows or run the monorepo scripts from the project root:

**Start the Server:**
```bash
npm run dev:server
```
*API will start on `http://localhost:5000` with the SQLite database initialized and seeded automatically.*

**Start the Client:**
```bash
npm run dev:client
```
*Vite dev server will start on `http://localhost:5173`.*

---

## 🔑 Admin Portal & Management

TrustPaw includes a built-in admin portal accessible at `/admin`.

- **Access Passcode**: Configured via `ADMIN_SECRET` in `server/.env` (Default: `trustpaw2007`).
- **Features Available to Admins**:
  - **Live Provider Catalog Editor**: Add new veterinarians, clinics, or groomers with coordinates, consultation fees, and available hours.
  - **Hero Banner Customization**: Update the home page hero image in real-time by pasting an image URL.
  - **National Emergency SOS Hotline**: Update the emergency phone number and emergency trauma hospital name reflected in user SOS modals across the platform.

---

## 🚢 Deployment Guide

### Deploying the Client (Vercel)
The root directory includes a `vercel.json` pointing to `client/`. To deploy via Vercel CLI:
```bash
vercel --prod
```
Ensure the environment variable `VITE_API_URL` is set to your deployed backend URL in the Vercel dashboard.

### Deploying with Firebase App Hosting
Configuration is provided in `apphosting.yaml` and `firebase.json`:
```bash
firebase deploy
```

---

## 📄 License & Attribution

Developed with ❤️ for pet parents, rescue caregivers, and companion animals across India.  
Open-source under the [MIT License](LICENSE).