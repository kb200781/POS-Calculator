// HomeScreen.js

import React from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import DataTable from './components/DataTable.js';
import LastEntry from './components/LastEntry';

const HomeScreen = () => {
  return (
    <div className="home-container">
      <nav>
        <ul>
          <li><Link to="/data-table">All Data</Link></li>
          <li><Link to="/last-entry">Last Entry</Link></li>
        </ul>
      </nav>
      <div className="content">
        <Routes>
          <Route path="/data-table" element={<DataTable />} />
          <Route path="/last-entry" element={<LastEntry />} />
        </Routes>
      </div>
    </div>
  );
};

export default HomeScreen;
