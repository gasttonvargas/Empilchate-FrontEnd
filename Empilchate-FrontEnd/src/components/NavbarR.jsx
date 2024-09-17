import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, Container, Badge, Dropdown, Modal, Button, Form, FormControl } from 'react-bootstrap';
import { FaHome, FaShoppingCart, FaBars, FaUser, FaSearch, FaUserShield, FaHeart } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../assets/NavbarR.css';

const NavbarComponent = ({ onSwitchToAdmin }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const navigate = useNavigate();

  const [cartCount, setCartCount] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);

  useEffect(() => {
    checkAuth();
    if (user) {
      fetchCartCount();
      fetchFavoritesCount();
    }
  }, [user]);

  const checkAuth = async () => {
    try {
      const response = await axios.get('/api/auth/check');
      if (response.data.user) {
        setUser(response.data.user);
        setIsAdmin(response.data.user.isAdmin);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
    }
  };

  const fetchCartCount = async () => {
    try {
      const response = await axios.get('/api/cart/count');
      setCartCount(response.data.count);
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  };

  const fetchFavoritesCount = async () => {
    try {
      const response = await axios.get('/api/favorites/count');
      setFavoritesCount(response.data.count);
    } catch (error) {
      console.error('Error fetching favorites count:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout');
      setUser(null);
      setIsAdmin(false);
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleCartClick = () => {
    if (user) {
      navigate('/cart');
    } else {
      setShowCartModal(true);
    }
  };

  const handleFavoritesClick = () => {
    if (user) {
      navigate('/favorites');
    } else {
      setShowLoginModal(true);
    }
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    setIsSearching(true);
    setSearchError('');
    try {
      const response = await axios.get(`/api/products/search?term=${searchTerm}`);
      setIsSearching(false);
      navigate('/search-results', { state: { results: response.data } });
    } catch (error) {
      console.error('Error durante la búsqueda:', error);
      setSearchError('Ocurrió un error durante la búsqueda. Por favor, intenta de nuevo.');
      setIsSearching(false);
    }
  };

  const categories = [
    { name: 'Buzos', path: '/category/buzos' },
    { name: 'Remerones', path: '/category/remerones' },
    { name: 'Remeras y Boxy', path: '/category/remeras-y-boxy' },
    { name: 'Crop', path: '/category/crop' },
    { name: 'Camisas', path: '/category/camisas' },
    { name: 'Camperas', path: '/category/camperas' },
    { name: 'Pantalones', path: '/category/pantalones' },
  ];

  return (
    <>
      <Navbar bg="light" expand="lg" fixed="top">
        <Container>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/"><FaHome /> Inicio</Nav.Link>
              <Nav.Link as={Link} to="/contact"><FaBars /> Contacto</Nav.Link>
              <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                  Categorías
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {categories.map((category, index) => (
                    <Dropdown.Item key={index} as={Link} to={category.path}>
                      {category.name}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
            <Form className="d-flex" onSubmit={handleSearch}>
              <FormControl
                type="search"
                placeholder="Buscar productos..."
                className="me-2"
                aria-label="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={isSearching}
              />
              <Button variant="outline-success" type="submit" disabled={isSearching}>
                {isSearching ? 'Buscando...' : <FaSearch />}
              </Button>
            </Form>
            {searchError && <p className="text-danger">{searchError}</p>}
            <Nav>
              {user && (
                <Nav.Link onClick={handleFavoritesClick}>
                  <FaHeart />
                  {favoritesCount > 0 && <Badge bg="danger">{favoritesCount}</Badge>}
                </Nav.Link>
              )}
              <Nav.Link onClick={handleCartClick}>
                <FaShoppingCart />
                {cartCount > 0 && <Badge bg="danger">{cartCount}</Badge>}
              </Nav.Link>
              {isAdmin && (
                <Nav.Link onClick={onSwitchToAdmin}>
                  <FaUserShield /> Admin
                </Nav.Link>
              )}
              <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                  <FaUser /> {user ? (user.name || 'Usuario') : 'Iniciar Sesión'}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {user ? (
                    <>
                      <Dropdown.Item as={Link} to="/profile">Perfil</Dropdown.Item>
                      <Dropdown.Item onClick={handleLogout}>Cerrar Sesión</Dropdown.Item>
                    </>
                  ) : (
                    <>
                      <Dropdown.Item onClick={() => setShowLoginModal(true)}>Iniciar Sesión</Dropdown.Item>
                      <Dropdown.Item onClick={() => setShowRegisterModal(true)}>Registrarse</Dropdown.Item>
                    </>
                  )}
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Modal show={showCartModal} onHide={() => setShowCartModal(false)} className="cart-modal">
        <Modal.Header closeButton>
          <Modal.Title>Carrito</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {user ? (
            <p>Tu carrito de compras está vacío.</p>
          ) : (
            <p>No has iniciado sesión. ¡Compra ya!</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCartModal(false)}>
            Cerrar
          </Button>
          {!user && (
            <Button variant="primary" onClick={() => {
              setShowCartModal(false);
              setShowLoginModal(true);
            }}>
              Iniciar Sesión
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default NavbarComponent;