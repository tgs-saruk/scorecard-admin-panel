import React from 'react';
import { Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { 
  FaTachometerAlt, 
  FaUsers, 
  FaChartBar, 
  FaCog,
  FaClipboardList
} from 'react-icons/fa';

const Sidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-brand">
        Admin Panel
      </div>
      <Nav className="flex-column sidebar-nav">
        <Nav.Link as={NavLink} to="/" end>
          <FaTachometerAlt /> Dashboard
        </Nav.Link>
        <Nav.Link as={NavLink} to="/users">
          <FaUsers /> Users
        </Nav.Link>
        <Nav.Link as={NavLink} to="/reports">
          <FaChartBar /> Reports
        </Nav.Link>
        <Nav.Link as={NavLink} to="/scorecards">
          <FaClipboardList /> Scorecards
        </Nav.Link>
        <Nav.Link as={NavLink} to="/settings">
          <FaCog /> Settings
        </Nav.Link>
      </Nav>
    </div>
  );
};

export default Sidebar; 