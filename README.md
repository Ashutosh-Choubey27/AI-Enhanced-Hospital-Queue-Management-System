# AI-Enhanced Hospital Queue Management System

Full-stack MERN + FastAPI project with:
- JWT authentication
- Appointment booking
- Doctor-wise slot queue with token + priority + no-show skip
- Socket.io live queue updates
- ML wait-time and crowd prediction service

## Quick start

1. **MongoDB** must be running locally (or update `MONGO_URI`).
2. Copy env files:
   - `backend/.env.example` -> `backend/.env`
   - `frontend/.env.example` -> `frontend/.env`
3. Install deps:
   - root: `npm install`
   - backend: `npm install --prefix backend`
   - frontend: `npm install --prefix frontend`
4. Seed realistic data:
   - `npm run seed`
5. Start all services:
   - `npm run dev`

This starts:
- backend API: `http://localhost:5000`
- frontend: `http://localhost:5173`
- ML service: `http://localhost:8001`

## Demo accounts after seed

- Patient: `patient1@hospital-seed.demo` / `Password@123`
- Doctor: `doctor1@hospital-seed.demo` / `Password@123`
- Admin: `admin@hospital-seed.demo` / `Password@123`
- Receptionist: `reception@hospital-seed.demo` / `Password@123`
