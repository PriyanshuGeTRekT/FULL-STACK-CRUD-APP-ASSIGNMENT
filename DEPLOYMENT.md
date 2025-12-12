# Deployment Guide

To show this to an interviewer via a link, you need to deploy it. Localhost only works on your own computer.

Here is the "Junior Dev" standard way to deploy this (Free Tiers):

## 1. Database (MongoDB Atlas)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free account.
2. Create a free cluster.
3. In "Database Access", create a user (save username/password).
4. In "Network Access", allow access from anywhere (`0.0.0.0/0`).
5. Get your connection string (e.g., `mongodb+srv://<username>:<password>@cluster0.mongodb.net/junior-crud-db`).

## 2. Backend (Render.com)
1. Push your code to GitHub.
2. Sign up for [Render](https://render.com/).
3. Create a **New Web Service**.
4. Connect your GitHub repo.
5. Settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node src/app.js`
6. **Environment Variables**:
   - `MONGO_URI`: (Paste your Atlas connection string)
   - `NODE_ENV`: `production`

## 3. Frontend (Vercel)
1. Sign up for [Vercel](https://vercel.com/).
2. "Add New Project" -> Import from GitHub.
3. Select your repo.
4. Settings:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite
5. **Environment Variables**:
   - `VITE_API_URL`: (The URL of your deployed Render backend, e.g., `https://my-api.onrender.com/api`)
6. Deploy.

## Verification
- Visit your Vercel URL.
- Try creating a user. It should save to MongoDB Atlas and trigger the backend on Render.
