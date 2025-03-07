import React from 'react';
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import { FaUserCircle, FaBell } from 'react-icons/fa';

const Header: React.FC = () => {
  return (
    <Navbar bg="white" expand="lg" className="header">
      <Container fluid>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Nav className="ms-auto">
          <Nav.Link href="#" className="d-flex align-items-center">
            <FaBell className="me-2" />
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              3
            </span>
          </Nav.Link>
          <NavDropdown 
            title={
              <span className="d-flex align-items-center">
                <FaUserCircle className="me-2" />
                Admin User
              </span>
            } 
            id="basic-nav-dropdown"
          >
            <NavDropdown.Item href="#">Profile</NavDropdown.Item>
            <NavDropdown.Item href="#">Settings</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="#">Logout</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Header; 