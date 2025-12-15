import React, { useState, useEffect } from 'react';
import CategoryCard from '../components/product/CategoryCard';
import { categoriesAPI } from '../services/api';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoriesAPI.getAll();
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-400 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
            Jewelry Categories
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Explore our diverse collection of fine jewelry, carefully organized by category to help you find the perfect piece for any occasion.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {categories.map((category: any) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>

        {/* Additional Info Section */}
        <div className="mt-16 bg-primary-50 rounded-2xl p-8">
          <div className="text-center">
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">
              Can't Find What You're Looking For?
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Our expert jewelry consultants are here to help you find the perfect piece or create a custom design just for you.
            </p>
            <button className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors">
              Contact Our Experts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}