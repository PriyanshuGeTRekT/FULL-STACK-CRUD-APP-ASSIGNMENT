# Junior Developer CRUD App

This is a simple full-stack User Management application built to demonstrate CRUD operations, email notifications, and basic analytics.

## Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, Axios, Chart.js
- **Backend**: Node.js, Express, MongoDB (Mongoose), Nodemailer

## Project Structure
- `backend/`: API server, database models, and email service.
  - `controllers/`: Request handlers (keep routes clean).
  - `services/`: External integrations (email).
- `frontend/`: React UI.
  - `components/`: Reusable UI parts (Forms, Lists).
  - `pages/`: Main views (Dashboard).

## Prerequisites
- Node.js (v14+)
- MongoDB (Local or Atlas URI)

## Setup & Run

### 1. Backend
```bash
cd backend
npm install
npm run dev
# Server starts on http://localhost:5000
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
# Client starts on http://localhost:5173
```

## Running the Demo
To record a demo of this application:
1. Open two terminal windows.
2. Terminal 1 (Backend): `cd backend && npm run dev`
3. Terminal 2 (Frontend): `cd frontend && npm run dev`
4. Open your browser to `http://localhost:5173`.
5. Create a new user (check terminal for the "fake" email link).
6. View the Dashboard analytics chart updating.


## Configuration (.env)
Copy `backend/.env.example` to `backend/.env`:
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/junior-crud-db
```

## Email
By default, the app uses **Ethereal Email** (a fake SMTP service). 
- When you create a user, check the server console for the "Preview URL" to see the sent email.
- To use real email, uncomment the SMTP settings in `.env` and add your SendGrid/AWS credentials.

## Seeding Data
To populate the database with sample users for the analytics chart:
```bash
cd backend
node seed.js
```

## API Testing
You can test the API using curl or Postman:

**Get Users**
```bash
curl http://localhost:5000/api/users
```

**Create User**
```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Test User", "email": "test@test.com", "city": "NYC", "state": "NY"}'
```
