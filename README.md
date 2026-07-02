# Book a Doctor — MERN MVP

A full-stack MERN web application for booking doctor appointments.

## Tech Stack
- **Frontend**: React.js + Vite
- **Backend**: Node.js + Express.js
- **Database**: MongoDB (Mongoose)
- **Styling**: Vanilla CSS

## Setup & Run

### 1. Backend
```bash
cd backend
npm install
# Create .env file with:
# PORT=5000
# MONGO_URI=your_mongodb_connection_string
node seedAdmin.js   # Run once to create admin account
npm run dev         # or: node server.js
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173**

## Default Credentials
| Role   | Email                    | Password |
|--------|--------------------------|----------|
| Admin  | admin@bookadoctor.com    | admin123 |
| Patient| Register via /register   | —        |
| Doctor | Set by Admin when adding | —        |

## Features
- **Patient**: Browse doctors, book appointments, view/cancel bookings
- **Doctor**: Dashboard to confirm or cancel appointments
- **Admin**: Full dashboard — manage doctors, patients, all appointments
