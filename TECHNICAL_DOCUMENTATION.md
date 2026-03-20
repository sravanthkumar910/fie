# Technical Documentation: Collabstr (Local Development)

## 1. Project Overview

**Project Name:** Collabstr  
**Project Type:** Full-stack Web Application (Creator Collaboration Platform)  
**Core Functionality:** Platform for brands to discover creators, manage projects, track payments, analyze performance.  
**Target Users:** Brands/Marketers for influencer collaborations

## 2. Technology Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.x | UI Framework |
| Vite | Latest | Build Tool |
| React Router DOM | 6.x | Routing |
| Recharts | 2.x | Charts |
| Axios | 1.x | HTTP Client |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | LTS | Runtime |
| Express.js | 4.x | Web Framework |
| MongoDB | Latest | Database |
| Mongoose | 6.x | ODM |
| Nodemailer | Latest | Email |
| Bcryptjs | 2.x | Password Hashing |

## 3. Project Structure
```
.
├── backend/
│   ├── controllers/ [auth, payment, project, settings]
│   ├── models/ [Payment, Project, settings, User]
│   ├── routes/ [auth, payment, project, setting]
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/ [dashboard, payments, projects, etc.]
│   │   ├── pages/ [Login, Register, VerifyOTP]
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vite.config.js
│   ├── .env  (VITE_API_URL=http://localhost:5001)
│   └── package.json
└── [docs]
```

## 4. API Endpoints (/api prefix)
**Auth:** POST /auth/register, /verify-otp, /login  
**Projects:** GET/POST/PUT /projects, GET /project-names  
**Payments:** GET/POST /payments  
**Settings:** GET/PUT /settings  

## 5. Local Setup & Run

### Backend (port 5001)
```bash
cd backend
npm install
# backend/.env:
# MONGODB_URI=mongodb://127.0.0.1:27017/collabstr
# PORT=5001
# EMAIL_USER=your@gmail.com
# EMAIL_PASS=app_password
npm start
```

### Frontend (port 5173)
```bash
cd frontend
npm install
npm run dev
```
Vite proxies /api → localhost:5001

## 6. Access
- Frontend: http://localhost:5173
- Backend API: http://localhost:5001/api

## 7. Test Flow
1. http://localhost:5173 → Register → Email OTP
2. Verify → Login → Dashboard (fetches local data)
3. Projects/Payments update DB live

## 8. Key Features
- Email OTP auth
- Project CRUD with status/progress
- Payment tracking
- Recharts dashboard analytics
- Brand settings/profile

Fully local - no deployment required. All deployed URLs removed.
