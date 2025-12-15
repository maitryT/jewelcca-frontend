package com.jewelcca.service;

import com.jewelcca.entity.Product;
import com.jewelcca.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public Page<Product> getAllProducts(Pageable pageable) {
        return productRepository.findAll(pageable);
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    public Page<Product> getProductsByCategory(String categorySlug, Pageable pageable) {
        return productRepository.findByCategorySlug(categorySlug, pageable);
    }

    public Page<Product> searchProducts(String keyword, Pageable pageable) {
        return productRepository.findByKeyword(keyword, pageable);
    }

    public Page<Product> getProductsByPriceRange(BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable) {
        return productRepository.findByPriceRange(minPrice, maxPrice, pageable);
    }

    public List<Product> getFeaturedProducts() {
        return productRepository.findTop8ByOrderByCreatedAtDesc();
    }

    public List<Product> getTopRatedProducts() {
        return productRepository.findTop8ByOrderByRatingDesc();
    }

    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    public Product updateProduct(Long id, Product productUpdate) {
        Product product = getProductById(id);
        
        if (productUpdate.getName() != null) {
            product.setName(productUpdate.getName());
        }
        if (productUpdate.getDescription() != null) {
            product.setDescription(productUpdate.getDescription());
        }
        if (productUpdate.getPrice() != null) {
            product.setPrice(productUpdate.getPrice());
        }
        if (productUpdate.getOriginalPrice() != null) {
            product.setOriginalPrice(productUpdate.getOriginalPrice());
        }
        if (productUpdate.getImageUrls() != null) {
            product.setImageUrls(productUpdate.getImageUrls());
        }
        if (productUpdate.getMaterials() != null) {
            product.setMaterials(productUpdate.getMaterials());
        }
        if (productUpdate.getTags() != null) {
            product.setTags(productUpdate.getTags());
        }
        if (productUpdate.getWeight() != null) {
            product.setWeight(productUpdate.getWeight());
        }
        if (productUpdate.getDimensions() != null) {
            product.setDimensions(productUpdate.getDimensions());
        }
        if (productUpdate.getStockQuantity() != null) {
            product.setStockQuantity(productUpdate.getStockQuantity());
        }
        if (productUpdate.getCategory() != null) {
            product.setCategory(productUpdate.getCategory());
        }
        
        product.setInStock(productUpdate.getStockQuantity() != null ? productUpdate.getStockQuantity() > 0 : product.isInStock());
        product.setUpdatedAt(LocalDateTime.now());
        
        return productRepository.save(product);
    }

    public void deleteProduct(Long id) {
        Product product = getProductById(id);
        productRepository.delete(product);
    }
}