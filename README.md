# College Event Management System

A full-stack intermediate web development project for managing college events, student registrations, faculty organizers, and admin operations.

## Tech Stack

- Frontend: HTML5, CSS3, JavaScript
- Backend: Node.js, Express.js
- Database: MongoDB
- Authentication: JWT + bcrypt
- QR attendance: ready for integration
- Charts: Chart.js
- Deployment: Vercel/Netlify + Render/Railway + MongoDB Atlas

## Features

- Landing page with upcoming events
- Student, faculty, and admin roles
- Registration and login
- JWT authentication
- Event CRUD APIs
- Event search and category filtering
- Student event registration
- Registration capacity checks
- Student dashboard
- Admin/faculty dashboard
- Registration and attendance models
- Responsive UI
- Dashboard analytics UI

## Project Structure

```text
college-event-management/
├── frontend/
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── events.html
│   ├── event-details.html
│   ├── dashboard.html
│   ├── admin.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── api.js
│       ├── auth.js
│       ├── events.js
│       └── dashboard.js
├── backend/
│   ├── server.js
│   ├── .env.example
│   ├── config/db.js
│   ├── middleware/auth.js
│   ├── models/User.js
│   ├── models/Event.js
│   ├── models/Registration.js
│   ├── routes/authRoutes.js
│   ├── routes/eventRoutes.js
│   └── routes/registrationRoutes.js
└── README.md
```

## Setup

### 1. Backend

```bash
cd backend
npm install
```

Copy `.env.example` to `.env` and add your MongoDB URI and JWT secret.

```bash
npm run dev
```

Backend runs at `http://localhost:5000`.

### 2. Frontend

Open `frontend/index.html` using VS Code Live Server, or serve the frontend from any static server.

The frontend expects the API at:

```text
http://localhost:5000/api
```

Change `frontend/js/api.js` if your backend uses another URL.

## Demo accounts

Create accounts through the registration page. For role testing, use the API or manually change a user's role in MongoDB to `admin` or `faculty`.

## Important

Never commit `.env`, passwords, JWT secrets, or MongoDB credentials to GitHub.
