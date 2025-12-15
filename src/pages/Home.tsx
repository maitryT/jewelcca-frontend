import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Crown, Shield, Truck, Award, Calendar, MapPin, Clock } from 'lucide-react';
import ProductCard from '../components/product/ProductCard';
import CategoryCard from '../components/product/CategoryCard';
import { categoriesAPI, productsAPI, offersAPI } from '../services/api';

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesResponse, productsResponse] = await Promise.all([
          categoriesAPI.getAll(),
          productsAPI.getFeatured()
        ]);

        setCategories(categoriesResponse.data);
        setFeaturedProducts(productsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Static events data (can be moved to API later)
  const upcomingEvents = [
    {
      id: '1',
      title: 'Valentine\'s Day Collection Launch',
      date: '2024-02-01',
      time: '10:00 AM',
      location: 'Jewelcca Flagship Store',
      description: 'Discover our exclusive Valentine\'s Day jewelry collection featuring romantic designs and special offers.',
      image: 'https://images.pexels.com/photos/691046/pexels-photo-691046.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '2',
      title: 'Spring Jewelry Workshop',
      date: '2024-03-15',
      time: '2:00 PM',
      location: 'Online Event',
      description: 'Join our master jewelers for an exclusive workshop on jewelry care and styling tips.',
      image: 'https://images.pexels.com/photos/1232166/pexels-photo-1232166.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '3',
      title: 'Mother\'s Day Special Preview',
      date: '2024-04-20',
      time: '11:00 AM',
      location: 'All Jewelcca Stores',
      description: 'Get an exclusive preview of our Mother\'s Day collection with special early bird discounts.',
      image: 'https://images.pexels.com/photos/1324732/pexels-photo-1324732.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-text-primary"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gray-50 py-20">
        <div className="container mx-auto px-4 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-serif font-bold text-text-primary mb-6">
                Exquisite Jewelry for Life's Special Moments
              </h1>
              <p className="text-lg text-text-secondary mb-8">
                Discover our handcrafted collection of fine jewelry, featuring timeless designs and premium materials that celebrate your unique style.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/categories"
                  className="bg-text-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-700 transform hover:-translate-y-0.5 transition-all duration-200 text-center"
                >
                  Shop Collection
                </Link>
                <Link
                  to="/offers"
                  className="border-2 border-text-primary text-text-primary px-8 py-3 rounded-lg font-semibold hover:bg-text-primary hover:text-white transition-colors text-center"
                >
                  View Offers
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/691046/pexels-photo-691046.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Featured Jewelry"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-light-gray w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="h-8 w-8 text-text-primary" />
              </div>
              <h3 className="font-semibold text-text-primary mb-2">Premium Quality</h3>
              <p className="text-text-secondary">Finest materials and expert craftsmanship</p>
            </div>
            <div className="text-center">
              <div className="bg-light-gray w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-text-primary" />
              </div>
              <h3 className="font-semibold text-text-primary mb-2">Lifetime Warranty</h3>
              <p className="text-text-secondary">Comprehensive coverage on all jewelry</p>
            </div>
            <div className="text-center">
              <div className="bg-light-gray w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-text-primary" />
              </div>
              <h3 className="font-semibold text-text-primary mb-2">Free Shipping</h3>
              <p className="text-text-secondary">Complimentary delivery on orders over $500</p>
            </div>
            <div className="text-center">
              <div className="bg-light-gray w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-text-primary" />
              </div>
              <h3 className="font-semibold text-text-primary mb-2">Expert Service</h3>
              <p className="text-text-secondary">Personalized consultation and care</p>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-16 bg-light-gray">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Calendar className="h-8 w-8 text-text-primary mr-3" />
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-text-primary">
                Upcoming Events
              </h2>
            </div>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Join us for exclusive events, workshops, and collection launches. Be the first to experience our latest creations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                <div className="p-6">
                  <div className="flex items-center text-sm text-text-secondary mb-2">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                    <Clock className="h-4 w-4 ml-4 mr-1" />
                    <span>{event.time}</span>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-text-primary mb-2">
                    {event.title}
                  </h3>
                  
                  <div className="flex items-center text-sm text-text-secondary mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{event.location}</span>
                  </div>
                  
                  <p className="text-text-secondary mb-4">
                    {event.description}
                  </p>
                  
                  <button className="w-full bg-text-primary text-white py-2 rounded-lg font-medium hover:bg-gray-700 transform hover:-translate-y-0.5 transition-all duration-200">
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button className="bg-white text-text-primary border-2 border-text-primary px-8 py-3 rounded-lg font-semibold hover:bg-text-primary hover:text-white transition-colors shadow-md">
              View All Events
            </button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-text-primary mb-4">
              Browse Our Collections
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Explore our carefully curated categories of fine jewelry, each piece tells a story of elegance and sophistication.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category: any) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-text-primary mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Discover our most popular pieces, loved by customers worldwide for their exceptional beauty and quality.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              to="/categories"
              className="bg-text-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-700 transform hover:-translate-y-0.5 transition-all duration-200"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-text-primary mb-4">
              What Our Customers Say
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                text: "Absolutely stunning jewelry! The quality exceeded my expectations and the customer service was exceptional.",
                rating: 5
              },
              {
                name: "Michael Chen",
                text: "Perfect engagement ring shopping experience. The team helped me find the perfect piece for my proposal.",
                rating: 5
              },
              {
                name: "Emily Davis",
                text: "Beautiful craftsmanship and attention to detail. I've received so many compliments on my necklace!",
                rating: 5
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-text-primary fill-current" />
                  ))}
                </div>
                <p className="text-text-secondary mb-4">"{testimonial.text}"</p>
                <p className="font-semibold text-text-primary">- {testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}