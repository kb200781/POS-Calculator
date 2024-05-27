import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import DataTable from './components/DataTable';
import LastEntry from './components/LastEntry';
import LoginScreen from './components/LoginScreen';
import './styles.css'; // Import the CSS file

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };
  const handleLogout = () => {
    setIsLoggedIn(false);
  };
  
  return (
    <Router>
      <div>
        <nav className="navbar navbar-expand-lg navbar-light">
          <Link className="navbar-brand" to="/"> &nbsp;Inventory System</Link>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item"><Link className="nav-link" to="/data">All Data</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/lastEntry">Last Entry</Link></li>
            </ul>
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
              <Link className="nav-link" onClick={handleLogout} to="/" style={{ paddingLeft: '1050px' }}>Log Out</Link>

              </li>
            </ul>
          </div>
        </nav>
        <div className="container">
          <Routes>
            <Route path="/" element={isLoggedIn ? <Navigate to="/data" /> : <LoginScreen onLogin={handleLogin} />} />
            <Route path="/data" element={isLoggedIn ? <DataTable /> : <Navigate to="/" />} />
            <Route path="/lastEntry" element={isLoggedIn ? <LastEntry /> : <Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
