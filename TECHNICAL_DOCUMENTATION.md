# Technical Documentation: Email-OTP-Pro (Collabstr)

## 1. Project Overview

**Project Name:** Collabstr  
**Project Type:** Full-stack Web Application (Creator Collaboration Platform)  
**Core Functionality:** A platform for brands to discover creators, manage influencer marketing projects, track payments, and analyze campaign performance.  
**Target Users:** Brands/Marketers looking to collaborate with social media creators

---

## 2. Technology Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.x | UI Framework |
| Vite | Latest | Build Tool & Dev Server |
| React Router DOM | 6.x | Client-side Routing |
| Recharts | 2.x | Data Visualization/Charts |
| Axios | 1.x | HTTP Client |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | LTS | Runtime Environment |
| Express.js | 4.x | Web Framework |
| MongoDB | Latest | NoSQL Database |
| Mongoose | 6.x | ODM (Object Data Modeling) |
| Nodemailer | Latest | Email Service |
| Bcryptjs | 2.x | Password Hashing |

### Development Tools
- **Code Editor:** VS Code
- **API Testing:** Postman/Thunder Client
- **Package Management:** npm

---

## 3. Project Structure

```
Email-OTP-Pro/
├── backend/
│   ├── controllers/
│   │   ├── authController.js       # Authentication logic
│   │   ├── paymentController.js    # Payment management
│   │   ├── projectController.js    # Project CRUD operations
│   │   └── settings.controller.js  # Settings management
│   ├── models/
│   │   ├── Payment.js               # Payment schema
│   │   ├── Project.js              # Project schema
│   │   ├── settings.js             # Settings schema
│   │   └── User.js                 # User schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── paymentRoutes.js
│   │   ├── projectRoutes.js
│   │   └── settingRoutes.js
│   ├── server.js                   # Server entry point
│   ├── package.json
│   └── .env                        # Environment variables
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── brandProfile.jsx   # Brand profile page
│   │   │   ├── dashboard.jsx     # Main dashboard
│   │   │   ├── discoverCreators.jsx
│   │   │   ├── helpCenter.jsx
│   │   │   ├── messages.jsx
│   │   │   ├── payments.jsx       # Payment management
│   │   │   ├── performance.jsx    # Analytics page
│   │   │   ├── projects.jsx       # Project management
│   │   │   └── settings.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── VerifyOTP.jsx
│   │   ├── App.jsx                 # Main app with routing
│   │   ├── main.jsx                # React entry point
│   │   └── index.css               # Global styles
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── TECHNICAL_DOCUMENTATION.md
```

---

## 4. API Endpoints

### Authentication API (`/api/auth`)
| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| POST | `/register` | Register new user | `{name, email, password}` |
| POST | `/verify-otp` | Verify email with OTP | `{email, otp}` |
| POST | `/login` | User login | `{email, password}` |

**Response:** Returns user object `{_id, name, email}`

### Projects API (`/api/projects`)
| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| GET | `/` | Get all projects | - |
| POST | `/new-project` | Create new project | `{name, platforms, budget, deadline, description, deliverables, creators}` |
| PUT | `/:id` | Update project | `{status, progress, deliverables, creators}` |
| GET | `/project-names` | Get project names only | - |

### Payments API (`/api/payments`)
| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| GET | `/` | Get all payments | - |
| POST | `/` | Create payment | `{creator, project, amount, method, status, note}` |

### Settings API (`/api/settings`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get settings |
| PUT | `/` | Update settings |

---

## 5. Database Schemas

### User Schema
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (hashed),
  isVerified: Boolean (default: false),
  otp: String,
  otpExpires: Date
}
```

### Project Schema
```javascript
{
  name: String (required),
  status: String (enum: ['Planning', 'Draft', 'Live', 'Review', 'Completed']),
  platforms: String,
  progress: Number (0-100),
  budget: String,
  deadline: String,
  description: String,
  deliverables: [String],
  creators: [{ name: String, email: String }],
  isDeleted: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

### Payment Schema
```javascript
{
  creator: String (required),
  creatorEmail: String,
  project: String (required),
  amount: Number (required),
  status: String (enum: ['Completed', 'Pending', 'Processing', 'Failed']),
  method: String (enum: ['Bank Transfer', 'PayPal']),
  note: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Settings Schema
```javascript
{
  brandProfile: {
    name: String,
    industry: String,
    website: String,
    description: String,
    plan: String
  },
  account: {
    email: String
  },
  notifications: {
    email: Boolean,
    push: Boolean
  }
}
```

---

## 6. Frontend Components

### Authentication Flow
```
Login → (unverified) → VerifyOTP → Login (verified) → Dashboard
```

### Main Application Pages
| Component | Route | Description |
|-----------|-------|-------------|
| Login | `/` | User login page |
| Register | `/register` | User registration |
| VerifyOTP | `/verify-otp` | Email OTP verification |
| MainApp | `/dashboard` | Protected dashboard layout |

### Dashboard Features
- **KPI Cards:** Total projects, creators, budgets
- **Line Chart:** Payment transactions by day (Sun-Sat)
- **Pie Chart:** Budget split (Total vs Paid to Creators)
- **Active Projects List:** Shows project name, status, creators, budget
- **Top Creators List:** Shows creator details
- **Recent Payouts:** Shows payment transactions

### Projects Features
- **Project Cards:** Grid view with status, progress, budget
- **Create Project Modal:** Form to add new projects
- **Project Details Modal:** Full project information
- **Manage Project Modal:** Edit status, progress, creators, deliverables
- **Status Filters:** All, Live, Review, Draft, Planning

### Payments Features
- **Stats Cards:** Total, Completed, Pending, Failed amounts
- **Bar Chart:** Daily spending (Sun-Sat)
- **Pie Chart:** Payment status breakdown
- **Transaction Table:** Filterable by status
- **Send Payment Modal:** Create new payments

### Performance Features
- **Stats Cards:** Projects, Budget, Platforms, Revenue
- **Area Chart:** Impressions over time
- **Bar Chart:** Weekly performance
- **Pie Chart:** Payment status
- **Platform Performance:** Dynamic data from projects
- **Project Cards:** Project-wise performance metrics

---

## 7. Authentication Flow

### Registration Process
1. User fills registration form (name, email, password)
2. Backend creates user with hashed password
3. Backend generates 6-digit OTP
4. OTP sent to user's email via Nodemailer
5. User redirected to OTP verification page

### OTP Verification
1. User enters 6-digit OTP
2. Backend validates OTP and expiration time (5 minutes)
3. If valid, `isVerified` flag set to true
4. User redirected to login page

### Login Process
1. User enters email and password
2. Backend verifies credentials and `isVerified` status
3. On success, returns user object
4. Frontend stores user in localStorage
5. User redirected to dashboard

---

## 8. State Management

### Frontend State
- **React useState:** Local component state
- **React useEffect:** Side effects and data fetching
- **localStorage:** User session persistence

### API Integration
```javascript
// Example fetch call
fetch('http://localhost:5001/api/projects')
  .then(res => res.json())
  .then(data => setProjects(data))
  .catch(err => console.error(err));
```

---

## 9. Running the Application

### Prerequisites
- Node.js installed
- MongoDB installed and running

### Backend Setup
```bash
cd backend
npm install
# Create .env file with:
# MONGODB_URI=your_mongodb_connection_string
# PORT=5001
npm start
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Access URLs
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5001`

---

## 10. Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb://127.0.0.1:27017/email-otp-pro
PORT=5001
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

---

## 11. Key Features Summary

| Feature | Description |
|---------|-------------|
| **Email OTP Authentication** | Secure user registration and login flow with 6-digit OTPs sent via email. |
| **Project Management** | Create, edit, and track the status and progress of influencer campaigns. |
| **Payment Tracking** | Log and monitor payments made to creators with status updates. |
| **Analytics Dashboard** | Visualize key performance indicators and data trends with interactive charts. |
| **Platform Tracking** | Monitor campaigns across various social media platforms. |
| **Creator Management** | Add creators to projects and manage their involvement. |
| **Brand Profile & Settings** | A centralized area for users to customize their brand information, notifications, and security settings. |


## 12. Security Considerations

1. **Password Hashing:** Using bcryptjs for secure password storage
2. **OTP Expiration:** OTP valid for 5 minutes only
3. **Protected Routes:** Dashboard and inner pages are only accessible after successful login.
4. **Environment Variables:** Sensitive data stored in .env
5. **CORS:** Enabled for frontend-backend communication

---

## 13. Dependencies List

### Backend Dependencies
- express
- mongoose
- nodemailer
- bcryptjs
- cors
- dotenv

### Frontend Dependencies
- react
- react-dom
- react-router-dom
- recharts
- axios

---

## 14. Future Enhancements

1. Real-time messaging between brands and creators
2. Social media API integrations for automatic metrics
3. Invoice generation
4. Multi-user team collaboration
5. Mobile responsive design improvements
6. Dark/Light theme toggle
7. Export reports functionality (e.g., as CSV or PDF).


**Document Version:** 1.1
**Last Updated:** October 26, 2023
**Author:** Gemini Code Assist
