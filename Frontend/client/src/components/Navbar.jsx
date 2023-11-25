import React from 'react';
import { Navbar as BootstrapNavbar, Nav, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ isAuthenticated, userEmail, logout }) => {
  const navigate = useNavigate();

  return (
    <BootstrapNavbar sticky="top" bg="dark" variant="dark" expand="lg">
      <BootstrapNavbar.Brand as={Link} to="/">
        elRastro
      </BootstrapNavbar.Brand>
      <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
      <BootstrapNavbar.Collapse id="basic-navbar-nav">
        {isAuthenticated ? (
          <Nav className="ml-auto">
            <Nav.Link as={Link} to="/crear-producto">
              Crear Anuncio
            </Nav.Link>
            <Nav.Link as={Link} to="/perfil">
              <img
                src=""
                alt="Perfil"
                style={{ width: "30px", borderRadius: "50%" }}
              />
            </Nav.Link>
            <Button variant="outline-danger" onClick={logout}>
              Logout
            </Button>
          </Nav>
        ) : (
          <Nav className="ml-auto">
            <Button
              variant="outline-success"
              onClick={() => navigate("/login")}
            >
              Iniciar Sesión
            </Button>
          </Nav>
        )}
      </BootstrapNavbar.Collapse>
    </BootstrapNavbar>
  );
};

export default Navbar;
