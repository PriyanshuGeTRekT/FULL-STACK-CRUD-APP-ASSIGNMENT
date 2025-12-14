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

## Author Notes (for interviewer)
- Author: Priyanshu Yadav
- I implemented the backend routes, schema, and analytics logic. The frontend is a lightweight React app that consumes these endpoints.
- Design choices:
	- `mailService` is intentionally mocked to console output for demo and offline testing; see `backend/src/services/mailService.js` for an example provider stub.
	- Analytics mixes Mongo aggregation and light node-side parsing for clarity in the demo; production would push heavier aggregation to the DB or precompute/cache results.
	- Error handling is centralized in `backend/src/middleware/error.js`. Async helpers available in `backend/src/middleware/asyncHandler.js`.
- Improvements planned: add JWT auth, formal input validation middleware, unit/integration tests, and Docker + CI.

If you'd like, I can walk through any file or demo the app live during the interview.

## What I learned
- Building a small CRUD app highlights how to structure routes, controllers, and models for clarity.
- Centralizing error handling and using async wrappers improves maintainability.
- Mocking external services (like email) is useful for offline demos; tests should mock or stub these in CI.
- Small performance gains can be obtained by using DB-side aggregation instead of pulling large datasets into Node.