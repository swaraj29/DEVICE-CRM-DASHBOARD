import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Sidebar from './components/Shared/Sidebar';
import Topbar from './components/Shared/Topbar';

import Dashboard from './containers/Dashboard';
import Installations from './containers/Installations';
import Services from './containers/Services';
import AMCContracts from './containers/AMCContracts';
import Alerts from './containers/Alerts';

import './App.css';

const App = () => {
  return (
    <Router>
      <Topbar />
    
        <Sidebar />
        <main style={{ flexGrow: 1, padding: '20px' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/installations" element={<Installations />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contracts" element={<AMCContracts />} />
            <Route path="/alerts" element={<Alerts />} />
          </Routes>
        </main>
    
    </Router>
  );
};

export default App;
