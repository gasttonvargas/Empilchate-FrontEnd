import axios from 'axios';

const handlePublishToggle = async (productId, isPublished) => {
  try {
    await axios.patch(`http://localhost:5000/api/products/${productId}`, {
      isPublished: isPublished
    });
    // Actualiza el estado o realiza otras acciones aquí
  } catch (error) {
    console.error('Error updating product:', error);
  }
};
