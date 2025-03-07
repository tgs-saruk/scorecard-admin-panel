import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './pages/Dashboard';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="admin-panel">
      <Sidebar />
      <div className="main-content">
        <Header />
        <Container fluid className="p-4">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            {/* Add more routes here */}
          </Routes>
        </Container>
      </div>
    </div>
  );
};

export default App; 