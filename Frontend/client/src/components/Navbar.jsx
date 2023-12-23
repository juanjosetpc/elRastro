import React from 'react';
import { Navbar as BootstrapNavbar, Nav, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ userEmail, logout }) => {
  const navigate = useNavigate();

  return (
    <BootstrapNavbar sticky="top" bg="dark" variant="dark" expand="lg">
      <BootstrapNavbar.Brand as={Link} to="/">
        elRastro
      </BootstrapNavbar.Brand>
      <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
      <BootstrapNavbar.Collapse id="basic-navbar-nav">
        {userEmail ? (
          <>
            <Nav className="ml-auto">
              <div className="d-flex align-items-center">
                <Nav.Link as={Link} to="/crear-producto">
                  Crear Anuncio
                </Nav.Link>
                <Nav.Link as={Link} to="/perfil">
                  <div className="d-flex align-items-center">
                    <img
                      src={userEmail.picture}
                      alt="Perfil"
                      style={{
                        width: "30px",
                        borderRadius: "50%",
                        marginRight: "8px",
                      }}
                    />
                    <p style={{ margin: 0 }}>{userEmail.email}</p>
                  </div>
                </Nav.Link>
              </div>
            </Nav>

            <div className="ms-auto">
              <Button variant="outline-danger" onClick={logout}>
                Cerrar Sesión
              </Button>
            </div>
          </>
        ) : (
          <Nav className="ms-auto">
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
