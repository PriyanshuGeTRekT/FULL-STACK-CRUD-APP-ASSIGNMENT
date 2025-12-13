# User Management System

This is a simple full-stack User Management application built to demonstrate CRUD operations, email notifications, and detailed analytics.

## Tech Stack
- **Frontend**: React, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB


## Requirements
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
5. Create a new user.
6. View the Dashboard analytics chart updating.



## Email Notification

- No external internet connection or accounts required.
- When you create a user, the email details will be printed in the terminal window.



## API Testing
You can test the API using postman