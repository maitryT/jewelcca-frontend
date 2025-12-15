import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Tag, ArrowRight } from 'lucide-react';
import { offersAPI } from '../services/api';

export default function Offers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await offersAPI.getAll();
        setOffers(response.data);
      } catch (error) {
        console.error('Error fetching offers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  if (loading) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-400 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading offers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
            Special Offers
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover amazing deals on our exquisite jewelry collection. Limited time offers on premium pieces.
          </p>
        </div>

        {/* Featured Offer */}
        <div className="mb-12">
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-8 md:p-12 text-white relative overflow-hidden">
            <div className="relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="inline-flex items-center bg-white/20 rounded-full px-4 py-2 mb-4">
                    <Tag className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">LIMITED TIME</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
                    Holiday Special
                  </h2>
                  <p className="text-xl mb-2 text-primary-100">
                    Up to 25% off on all diamond jewelry
                  </p>
                  <p className="text-primary-200 mb-6">
                    Use code: HOLIDAY25 at checkout
                  </p>
                  <Link
                    to="/categories"
                    className="inline-flex items-center bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
                  >
                    Shop Now
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Link>
                </div>
                <div className="text-center">
                  <img
                    src="https://images.pexels.com/photos/691046/pexels-photo-691046.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="Featured Offer"
                    className="rounded-lg shadow-2xl max-w-sm mx-auto"
                  />
                </div>
              </div>
            </div>
            <div className="absolute inset-0 bg-black/10"></div>
          </div>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {offers.map((offer: any) => (
            <div key={offer.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={offer.imageUrl}
                  alt={offer.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    {offer.discountPercentage}% OFF
                  </span>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>Limited Time</span>
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {offer.title}
                </h3>
                
                <p className="text-gray-600 mb-4">
                  {offer.description}
                </p>
                
                {offer.code && (
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Promo Code:</span>
                      <span className="font-mono font-semibold text-primary-600">
                        {offer.code}
                      </span>
                    </div>
                  </div>
                )}
                
                <Link
                  to="/categories"
                  className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors text-center block"
                >
                  Shop This Offer
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16 bg-primary-50 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">
            Never Miss an Offer
          </h2>
          <p className="text-gray-600 mb-6">
            Subscribe to our newsletter and be the first to know about exclusive deals and new arrivals.
          </p>
          <div className="max-w-md mx-auto flex gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <button className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}