import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, Search } from 'lucide-react';
import { productsAPI } from '../../services/api';

interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
}

interface SearchResultsProps {
  isOpen: boolean;
  onClose: () => void;
  query: string;
}

export default function SearchResults({ isOpen, onClose, query }: SearchResultsProps) {
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim() || !isOpen) {
      setResults([]);
      return;
    }

    const searchProducts = async () => {
      setLoading(true);
      try {
        const response = await productsAPI.search(query);
        setResults(response.data.content || response.data);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchProducts, 300);
    return () => clearTimeout(debounceTimer);
  }, [query, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose}>
      <div
        className="fixed top-20 left-0 right-0 mx-auto max-w-2xl bg-white rounded-lg shadow-2xl z-50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-text-primary">Search Results</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-light-gray rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-text-secondary" />
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-text-primary"></div>
            </div>
          ) : results.length > 0 ? (
            <div className="max-h-96 overflow-y-auto">
              <div className="space-y-3">
                {results.map((product) => (
                  <Link
                    key={product.id}
                    to={`/product/${product.id}`}
                    onClick={onClose}
                    className="flex items-center space-x-4 p-3 hover:bg-light-gray rounded-lg transition-colors"
                  >
                    {product.image && (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-12 w-12 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-text-primary line-clamp-1">
                        {product.name}
                      </p>
                      <p className="text-sm text-text-secondary">
                        ₹{product.price?.toLocaleString()}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-text-light mx-auto mb-3" />
              <p className="text-text-secondary">No products found for "{query}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
