# Local Development Guide - Collabstr

## Prerequisites
- Node.js (LTS)
- MongoDB (local install and running on default port 27017)
- npm/yarn

## Quick Start

### Backend
```bash
cd backend
npm install
# Copy .env.example to .env and update:
# MONGODB_URI=mongodb://127.0.0.1:27017/collabstr
# EMAIL_USER=your_gmail@gmail.com
# EMAIL_PASS=your_gmail_app_password
npm start
```
Backend runs on http://localhost:5001

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on http://localhost:5173 (proxies /api to backend)

## Test Flow
1. Frontend → Register (name,email,pass) → Check email for OTP
2. Verify OTP → Login → Dashboard loads settings/projects
3. Create project → Add payment → Charts update

## MongoDB Setup
```
mongosh
use collabstr
// No need for manual DB setup - Mongoose auto-creates
```

## Troubleshooting
- CORS? Check vite.config.js proxy
- Email? Verify Gmail app password
- Mongo? Check mongod service/MongoDB Compass

Fully local - no cloud deploys needed!
