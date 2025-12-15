import React from 'react';
import { Link } from 'react-router-dom';
import { Category } from '../../types';

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      to={`/products/${category.slug}`}
      className="group block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-light-gray"
    >
      <div className="aspect-square overflow-hidden rounded-t-lg">
        <img
          src={category.imageUrl}
          alt={category.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-text-primary mb-2 group-hover:text-text-secondary transition-colors">
          {category.name}
        </h3>
        <p className="text-text-secondary mb-3">{category.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-light">{category.products?.length || 0} items</span>
          <span className="text-text-primary font-medium group-hover:text-text-secondary">
            Explore →
          </span>
        </div>
      </div>
    </Link>
  );
}