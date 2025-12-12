import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import UserForm from './components/UserForm';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 text-gray-900 pb-10">
        <nav className="bg-white shadow p-4 mb-6">
          <div className="container mx-auto">
            <h1 className="text-xl font-bold text-blue-600">Junior CRUD App</h1>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users/new" element={<UserForm />} />
          <Route path="/users/:id/edit" element={<UserForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
