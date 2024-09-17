import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Form, Modal, Image, Spinner, Toast, ToastContainer } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus, FaEye, FaEyeSlash } from 'react-icons/fa';

// Configuración de Axios
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Asegúrate de que esta URL es la correcta
});

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
      const response = await api.get('/products');
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (error) {
      showToastMessage(`Error al cargar los productos: ${error.message}`);
    }
  };

  const handlePublishToggle = async (product) => {
    try {
      await api.patch(`/products/${product._id}`, { isPublished: !product.isPublished });
      showToastMessage(`Producto ${product.isPublished ? 'despublicado' : 'publicado'} con éxito`);
      fetchProducts();
    } catch (error) {
      showToastMessage(`Error al cambiar el estado de publicación del producto: ${error.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (isEditing) {
        await api.put(`/products/${currentProduct._id}`, currentProduct);
        showToastMessage("Producto actualizado con éxito");
      } else {
        await api.post('/products', currentProduct);
        showToastMessage("Producto agregado con éxito");
      }
      fetchProducts();
      handleCloseModal();
    } catch (error) {
      showToastMessage(`Error al guardar el producto: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este producto?")) {
      try {
        await api.delete(`/products/${productId}`);
        fetchProducts();
        showToastMessage("Producto eliminado con éxito");
      } catch (error) {
        showToastMessage(`Error al eliminar el producto: ${error.message}`);
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
    setCurrentProduct(prevState => ({ ...prevState, [name]: value }));
  };

  const handleCategoryFilterChange = (e) => {
    const selected = e.target.value;
    setSelectedCategory(selected);
    setFilteredProducts(selected === 'Todas' ? products : products.filter(product => product.category === selected));
  };

  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
  };

  return (
    <div className="products-admin">
      <h2>Gestión de Productos</h2>
      <Button variant="primary" onClick={() => handleShowModal()} className="mb-3">
        <FaPlus /> Agregar Producto
      </Button>
      <Form.Group className="mb-3">
        <Form.Label>Filtrar por categoría:</Form.Label>
        <Form.Select onChange={handleCategoryFilterChange} value={selectedCategory}>
          <option value="Todas">Todas</option>
          <option value="Buzos">Buzos</option>
          <option value="Remerones">Remerones</option>
          <option value="Remeras y Boxy">Remeras y Boxy</option>
          <option value="Crop">Crop</option>
          <option value="Camisas">Camisas</option>
          <option value="Camperas">Camperas</option>
          <option value="Pantalones">Pantalones</option>
        </Form.Select>
      </Form.Group>
      <Table striped bordered hover>
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
          {filteredProducts.map(product => (
            <tr key={product._id}>
              <td>{product._id}</td>
              <td><Image src={product.image} alt={product.name} thumbnail width={50} height={50} /></td>
              <td>{product.name}</td>
              <td>${product.price}</td>
              <td>{product.category}</td>
              <td>{product.isPublished ? 'Publicado' : 'No publicado'}</td>
              <td>
                <Button variant="warning" onClick={() => handleShowModal(product)} className="me-2">
                  <FaEdit />
                </Button>
                <Button variant="danger" onClick={() => handleDeleteProduct(product._id)} className="me-2">
                  <FaTrash />
                </Button>
                <Button variant={product.isPublished ? "secondary" : "success"} onClick={() => handlePublishToggle(product)}>
                  {product.isPublished ? <FaEyeSlash /> : <FaEye />}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Editar Producto' : 'Agregar Producto'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control type="text" name="name" value={currentProduct.name} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Precio</Form.Label>
              <Form.Control type="number" name="price" value={currentProduct.price} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>URL de la Imagen</Form.Label>
              <Form.Control type="text" name="image" value={currentProduct.image} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Categoría</Form.Label>
              <Form.Select name="category" value={currentProduct.category} onChange={handleInputChange} required>
                <option value="">Seleccione una categoría</option>
                <option value="Buzos">Buzos</option>
                <option value="Remerones">Remerones</option>
                <option value="Remeras y Boxy">Remeras y Boxy</option>
                <option value="Crop">Crop</option>
                <option value="Camisas">Camisas</option>
                <option value="Camperas">Camperas</option>
                <option value="Pantalones">Pantalones</option>
              </Form.Select>
            </Form.Group>
            <Button variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Spinner as="span" animation="border" size="sm" /> : isEditing ? 'Actualizar' : 'Agregar'}
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
