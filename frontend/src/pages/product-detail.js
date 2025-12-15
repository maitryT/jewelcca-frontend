import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './product-detail.css';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);

    useEffect(() => {
        // Fetch product details from the backend
        fetch(`/api/products/${id}`)
            .then(response => response.json())
            .then(data => setProduct(data))
            .catch(error => console.error('Error fetching product details:', error));
    }, [id]);

    if (!product) {
        return <div>Loading...</div>;
    }

    return (
        <div className="product-detail-container">
            <div className="product-images">
                <div className="main-image">
                    <img src={product.imageUrls[selectedImage]} alt={product.name} />
                </div>
                <div className="thumbnail-images">
                    {product.imageUrls.map((imageUrl, index) => (
                        <img
                            key={index}
                            src={imageUrl}
                            alt={`${product.name} - thumbnail ${index}`}
                            className={selectedImage === index ? 'active' : ''}
                            onClick={() => setSelectedImage(index)}
                        />
                    ))}
                </div>
            </div>
            <div className="product-info">
                <h1>{product.name}</h1>
                <p className="price">${product.price}</p>
                <p className="description">{product.description}</p>
                <button className="add-to-cart-btn">Add to Cart</button>
            </div>
        </div>
    );
};

export default ProductDetail;
