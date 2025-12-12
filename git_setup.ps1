git init
git add .gitignore
git commit -m "Initial commit"

git add backend/package.json backend/.env.example
git commit -m "Scaffold backend project"

git add backend/src/db.js backend/src/app.js
git commit -m "Setup Express server and Database connection"

git add backend/src/models backend/seed.js
git commit -m "Add User model and seeder script"

git add backend/src/controllers backend/src/routes
git commit -m "Implement User CRUD API and Analytics endpoint"

git add backend/src/services
git commit -m "Add MailService with Nodemailer integration"

git add frontend/package.json frontend/vite.config.js frontend/index.html
git commit -m "Initialize Frontend with Vite + React"

git add frontend/tailwind.config.js frontend/src/index.css
git commit -m "Configure Tailwind CSS"

git add frontend/src/services
git commit -m "Add API service using Axios"

git add frontend/src/components
git commit -m "Create UserList and UserForm components"

git add frontend/src/pages frontend/src/App.jsx frontend/src/main.jsx
git commit -m "Implement Dashboard, Routing and Charts"

git add .
git commit -m "Final polish: README, cleanup and error handling"
