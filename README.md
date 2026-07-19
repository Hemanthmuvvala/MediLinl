# Book a Doctor — MediLinl (MERN Web App)

A full-stack MERN web application for booking doctor appointments online.  
Live Demo: [medilinl.vercel.app](https://medilinl.vercel.app)

---

## 📁 Repository Structure

```
skillwallet/
│
├── 1. Ideation Phase/
├── 2. Requirement Analysis/
├── 3. Project Design Phase/
├── 4. Project Planning Phase/
├── 5. Project Development Phase/
├── 6. Project Documentation/
│
└── 7. Project Demonstration/
    ├── backend/          ← Node.js + Express.js REST API
    └── frontend/         ← React.js + Vite SPA
```

---

## 🛠️ Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React.js, Vite, Vanilla CSS       |
| Backend    | Node.js, Express.js               |
| Database   | MongoDB (via Mongoose)            |
| Deployment | Vercel (frontend), Render/Railway (backend) |

---

## ⚙️ Setup & Run Locally

> All source code lives inside `7. Project Demonstration/`.

### Prerequisites
- Node.js (v18+)
- MongoDB URI (local or MongoDB Atlas)

---

### 1. Backend

```bash
cd "7. Project Demonstration/backend"
npm install
```

Create a `.env` file inside the `backend` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

```bash
node seedAdmin.js     # Run ONCE to seed the default admin account
npm run dev           # Starts backend on http://localhost:5000
```

---

### 2. Frontend

Open a **new terminal**:

```bash
cd "7. Project Demonstration/frontend"
npm install
npm run dev           # Starts frontend on http://localhost:5173
```

Open **http://localhost:5173** in your browser.

---

## 🔑 Default Credentials

| Role    | Email                    | Password |
|---------|--------------------------|----------|
| Admin   | admin@bookadoctor.com    | admin123 |
| Patient | Register via `/register` | —        |
| Doctor  | Set by Admin             | —        |

---

## ✨ Features

### 👤 Patient
- Browse and search available doctors
- Book appointments with preferred date & time
- View, track, and cancel bookings

### 🩺 Doctor
- Dedicated dashboard to view incoming appointments
- Confirm or cancel appointments

### 🛡️ Admin
- Full management dashboard
- Add / remove doctors
- View all patients and appointments
- Monitor platform activity

---

## 🗂️ API Endpoints (Backend)

| Method | Endpoint                     | Description                  |
|--------|------------------------------|------------------------------|
| POST   | `/api/auth/register`         | Register new patient         |
| POST   | `/api/auth/login`            | Login (patient / admin)      |
| POST   | `/api/auth/doctor-login`     | Login (doctor)               |
| GET    | `/api/doctors`               | List all doctors             |
| POST   | `/api/appointments`          | Book appointment             |
| GET    | `/api/appointments/my`       | Patient's appointments       |
| PATCH  | `/api/appointments/:id`      | Update appointment status    |
| DELETE | `/api/appointments/:id`      | Cancel appointment           |
| GET    | `/api/admin/doctors`         | Admin — manage doctors       |
| GET    | `/api/admin/patients`        | Admin — manage patients      |
| GET    | `/api/admin/appointments`    | Admin — all appointments     |

---

## 🗄️ Database Models

### User (Patient / Admin)
| Field    | Type    | Notes               |
|----------|---------|---------------------|
| name     | String  | Required            |
| email    | String  | Unique, lowercase   |
| password | String  | Required            |
| phone    | String  | Optional            |
| role     | String  | `patient` / `admin` |

### Doctor
| Field           | Type    | Notes             |
|-----------------|---------|-------------------|
| name            | String  | Required          |
| specialty       | String  | Required          |
| experience      | Number  | Years             |
| consultationFee | Number  | In ₹              |
| email           | String  | Unique, lowercase |
| password        | String  | Required          |
| phone           | String  | Optional          |
| available       | Boolean | Default: true     |

### Appointment
| Field     | Type     | Notes                              |
|-----------|----------|------------------------------------|
| patientId | ObjectId | Ref: User                          |
| doctorId  | ObjectId | Ref: Doctor                        |
| date      | String   | Appointment date                   |
| time      | String   | Appointment time slot              |
| status    | String   | `Pending` / `Confirmed` / `Cancelled` |
| notes     | String   | Optional patient notes             |

---

## 📝 License
This project is built for educational purposes.
