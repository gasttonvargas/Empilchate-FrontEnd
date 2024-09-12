import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Modal, Image, Spinner, Toast, ToastContainer } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus, FaEye, FaEyeSlash } from 'react-icons/fa';

const API_URL = 'https://proyectofinalrolling-backend-production.up.railway.app/api';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({ name: '', price: '', image: '', category: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/products`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Datos recibidos de la API:", data);
      setProducts(Array.isArray(data) ? data : []);
      setFilteredProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching products:", error);
      showToastMessage(`Error al cargar los productos: ${error.message}`);
    }
  };

  const handlePublishToggle = async (product) => {
    try {
      const response = await fetch(`${API_URL}/products/${product._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !product.isPublished })
      });
      if (!response.ok) throw new Error('Error al cambiar el estado de publicación');
      showToastMessage(`Producto ${product.isPublished ? 'despublicado' : 'publicado'} con éxito`);
      fetchProducts();
    } catch (error) {
      showToastMessage("Error al cambiar el estado de publicación del producto");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing ? `${API_URL}/products/${currentProduct._id}` : `${API_URL}/products`;
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentProduct)
      });
      if (!response.ok) throw new Error('Error al guardar el producto');
      showToastMessage(isEditing ? "Producto actualizado con éxito" : "Producto agregado con éxito");
      fetchProducts();
      handleCloseModal();
    } catch (error) {
      showToastMessage("Error al guardar el producto");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este producto?")) {
      try {
        const response = await fetch(`${API_URL}/products/${productId}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Error al eliminar el producto');
        fetchProducts();
        showToastMessage("Producto eliminado con éxito");
      } catch (error) {
        showToastMessage("Error al eliminar el producto");
      }
    }
  };

  const handleShowModal = (product = null) => {
    if (product) {
      setCurrentProduct(product);
      setIsEditing(true);
    } else {
      setCurrentProduct({ name: '', price: '', image: '', category: '' });
      setIsEditing(false);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentProduct({ name: '', price: '', image: '', category: '' });
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct({ ...currentProduct, [name]: value });
  };

  const handleCategoryFilterChange = (e) => {
    const selected = e.target.value;
    setSelectedCategory(selected);
    if (selected === 'Todas') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(product => product.category === selected));
    }
  };

  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
  };

  return (
    <div className="products-container">
      <Button onClick={() => handleShowModal()} className="mb-3"><FaPlus /> Agregar Producto</Button>
      <Form.Group controlId="categoryFilter" className="mb-3">
        <Form.Label>Filtrar por categoría</Form.Label>
        <Form.Control as="select" value={selectedCategory} onChange={handleCategoryFilterChange}>
          <option value="Todas">Todas</option>
          {/* Agrega aquí más opciones de categorías si es necesario */}
        </Form.Control>
      </Form.Group>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Imagen</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Categoría</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(filteredProducts) && filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <tr key={product._id}>
                <td>{product._id}</td>
                <td><Image src={product.image} thumbnail width={100} /></td>
                <td>{product.name}</td>
                <td>${product.price}</td>
                <td>{product.category}</td>
                <td>{product.isPublished ? 'Publicado' : 'No publicado'}</td>
                <td>
                  <Button variant="warning" onClick={() => handleShowModal(product)} className="me-2"><FaEdit /></Button>
                  <Button variant="danger" onClick={() => handleDeleteProduct(product._id)} className="me-2"><FaTrash /></Button>
                  <Button 
                    variant={product.isPublished ? 'secondary' : 'success'} 
                    onClick={() => handlePublishToggle(product)}
                  >
                    {product.isPublished ? <FaEyeSlash /> : <FaEye />}
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No hay productos disponibles</td>
            </tr>
          )}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Editar Producto' : 'Agregar Producto'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formProductName" className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control 
                type="text" 
                name="name" 
                value={currentProduct.name} 
                onChange={handleInputChange} 
                required 
              />
            </Form.Group>
            <Form.Group controlId="formProductPrice" className="mb-3">
              <Form.Label>Precio</Form.Label>
              <Form.Control 
                type="number" 
                name="price" 
                value={currentProduct.price} 
                onChange={handleInputChange} 
                required 
              />
            </Form.Group>
            <Form.Group controlId="formProductImage" className="mb-3">
              <Form.Label>Imagen URL</Form.Label>
              <Form.Control 
                type="url" 
                name="image" 
                value={currentProduct.image} 
                onChange={handleInputChange} 
                required 
              />
            </Form.Group>
            <Form.Group controlId="formProductCategory" className="mb-3">
              <Form.Label>Categoría</Form.Label>
              <Form.Control 
                type="text" 
                name="category" 
                value={currentProduct.category} 
                onChange={handleInputChange} 
                required 
              />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Spinner animation="border" size="sm" /> : 'Guardar'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <ToastContainer position="top-end" className="p-3">
        <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};

export default Products;