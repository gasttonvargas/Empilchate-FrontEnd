import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { FaUsers, FaBox, FaUserEdit, FaArrowLeft } from 'react-icons/fa';
import '../assets/NavbarAdmin.css'

const NavbarAdmin = ({ onSwitchToUser }) => {
  const navigate = useNavigate();

  const handleSwitchToUser = () => {
    onSwitchToUser();
    navigate('/'); // Navega a la página principal
  };

  return (
    <>
      <Navbar expand="lg" className="dashboard-navbar">
        <Container>
          <Navbar.Brand as={Link} to="/admin-dashboard">Panel de Administración</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/admin-dashboard/products">
                <FaBox className="me-2" /> Productos
              </Nav.Link>
              <Nav.Link as={Link} to="/admin-dashboard/users">
                <FaUserEdit className="me-2" /> Usuarios
              </Nav.Link>
              <Nav.Link as={Link} to="/admin-dashboard/manage">
                <FaUsers className="me-2" /> Gestionar Admins
              </Nav.Link>
            </Nav>
            <Button variant="outline-light" onClick={handleSwitchToUser}>
              <FaArrowLeft className="me-2" /> Volver a Usuario
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Outlet />
    </>
  );
};

export default NavbarAdmin;