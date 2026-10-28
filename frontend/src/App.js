import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import BookManagement from './components/BookManagement';
import Transactions from './components/Transactions';
import UserManagement from './components/UserManagement';
import './App.css';

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <Router>
      <div className="app-container">
        {user && (
          <nav className="navbar">
            <h2>Library Admin</h2>
            <ul>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/books">Books</Link></li>
              <li><Link to="/transactions">Transactions</Link></li>
              <li><Link to="/users">Users</Link></li>
              <li><button onClick={handleLogout} className="logout-btn">Logout ({user.name})</button></li>
            </ul>
          </nav>
        )}
        <main className="main-content">
          <Routes>
            <Route path="/" element={user ? <Navigate to="/dashboard" /> : <UserManagement onLogin={handleLogin} isAdminView={false} />} />
            <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" />} />
            <Route path="/books" element={user ? <BookManagement /> : <Navigate to="/" />} />
            <Route path="/transactions" element={user ? <Transactions /> : <Navigate to="/" />} />
            <Route path="/users" element={user ? <UserManagement onLogin={handleLogin} isAdminView={true} /> : <Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;