package com.jewelcca.service;

import com.jewelcca.entity.Category;
import com.jewelcca.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Category getCategoryById(Long id) {
        System.out.println("fing by id");
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
    }

    public Category getCategoryBySlug(String slug) {
        return categoryRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Category not found"));
    }

    public Category createCategory(Category category) {
        if (categoryRepository.existsBySlug(category.getSlug())) {
            throw new RuntimeException("Category with this slug already exists");
        }
        return categoryRepository.save(category);
    }

    public Category updateCategory(Long id, Category categoryUpdate) {
        Category category = getCategoryById(id);
        
        if (categoryUpdate.getName() != null) {
            category.setName(categoryUpdate.getName());
        }
        if (categoryUpdate.getSlug() != null) {
            category.setSlug(categoryUpdate.getSlug());
        }
        if (categoryUpdate.getDescription() != null) {
            category.setDescription(categoryUpdate.getDescription());
        }
        if (categoryUpdate.getImageUrl() != null) {
            category.setImageUrl(categoryUpdate.getImageUrl());
        }
        
        category.setUpdatedAt(LocalDateTime.now());
        return categoryRepository.save(category);
    }

    public void deleteCategory(Long id) {
        Category category = getCategoryById(id);
        categoryRepository.delete(category);
    }
}