import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import UserForm from './components/UserForm';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col font-sans">
        <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg p-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white tracking-wide">User Management</h1>
            <span className="text-blue-100 text-sm">Admin Portal</span>
          </div>
        </nav>

        <div className="flex-grow container mx-auto p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/users/new" element={<UserForm />} />
            <Route path="/users/:id/edit" element={<UserForm />} />
          </Routes>
        </div>

        <footer className="bg-white border-t py-4 text-center text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} User Management System
        </footer>
      </div>
    </Router>
  );
}

export default App;
