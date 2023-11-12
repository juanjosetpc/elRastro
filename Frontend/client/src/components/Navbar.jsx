import React from 'react';
import { Navbar as BootstrapNavbar, Nav, NavDropdown, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ isAuthenticated, onLogout }) => {
  const navigate = useNavigate();

  return (
    <BootstrapNavbar bg="light" expand="lg">
      <BootstrapNavbar.Brand as={Link} to="/">
        elRastro
      </BootstrapNavbar.Brand>
      <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
      <BootstrapNavbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link as={Link} to="/home">
            Inicio
          </Nav.Link>
        </Nav>
        {isAuthenticated ? (
          <Nav>
            <Nav.Link as={Link} to="/crear-anuncio">
              Crear Anuncio
            </Nav.Link>
            <Nav.Link as={Link} to="/perfil">
              <img
                src=""
                alt="Perfil"
                style={{ width: "30px", borderRadius: "50%" }}
              />
            </Nav.Link>
            <NavDropdown title="Opciones" id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/perfil">
                Perfil
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={onLogout}>
                Cerrar Sesión
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        ) : (
          <Nav>
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
