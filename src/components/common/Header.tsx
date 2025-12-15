import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  ShoppingCart, 
  Heart, 
  User, 
  Menu, 
  X,
  Crown,
  LogOut,
  Settings,
  Package,
  BarChart3
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { getTotalItems } = useCart();
  const { items: wishlistItems } = useWishlist();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-light-gray">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Crown className="h-8 w-8 text-text-primary" />
            <span className="text-2xl font-serif font-bold text-text-primary">Jewelcca</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-text-primary hover:text-text-secondary transition-colors font-medium">
              Home
            </Link>
            <Link to="/categories" className="text-text-primary hover:text-text-secondary transition-colors font-medium">
              Categories
            </Link>
            <Link to="/offers" className="text-text-primary hover:text-text-secondary transition-colors font-medium">
              Offers
            </Link>
            <Link to="/about" className="text-text-primary hover:text-text-secondary transition-colors font-medium">
              About Us
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-light h-4 w-4" />
              <input
                type="text"
                placeholder="Search jewelry..."
                className="w-full pl-10 pr-4 py-2 border border-light-gray rounded-lg focus:ring-2 focus:ring-text-primary focus:border-transparent bg-gray-50"
              />
            </div>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {/* Wishlist */}
            <Link to="/wishlist" className="relative p-2 text-text-primary hover:text-text-secondary transition-colors">
              <Heart className="h-6 w-6" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-text-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative p-2 text-text-primary hover:text-text-secondary transition-colors">
              <ShoppingCart className="h-6 w-6" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-text-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </Link>

            {/* User Menu */}
            <div className="relative">
              {user ? (
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 text-text-primary hover:text-text-secondary transition-colors"
                >
                  <User className="h-6 w-6" />
                  <span className="hidden md:block">{user.firstName}</span>
                </button>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center space-x-2 p-2 text-text-primary hover:text-text-secondary transition-colors"
                >
                  <User className="h-6 w-6" />
                  <span className="hidden md:block">Login</span>
                </Link>
              )}

              {/* User Dropdown */}
              {isUserMenuOpen && user && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-light-gray">
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-2 text-sm text-text-primary hover:bg-gray-50"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Profile Settings
                  </Link>
                  <Link
                    to="/orders"
                    className="flex items-center px-4 py-2 text-sm text-text-primary hover:bg-gray-50"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <Package className="h-4 w-4 mr-2" />
                    My Orders
                  </Link>
                  {user.isAdmin && (
                    <Link
                      to="/admin"
                      className="flex items-center px-4 py-2 text-sm text-text-primary hover:bg-gray-50"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-text-primary hover:bg-gray-50"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-text-primary hover:text-text-secondary"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-light-gray py-4 bg-gray-50">
            <div className="flex flex-col space-y-2">
              <Link
                to="/"
                className="px-2 py-2 text-text-primary hover:text-text-secondary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/categories"
                className="px-2 py-2 text-text-primary hover:text-text-secondary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Categories
              </Link>
              <Link
                to="/offers"
                className="px-2 py-2 text-text-primary hover:text-text-secondary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Offers
              </Link>
              <Link
                to="/about"
                className="px-2 py-2 text-text-primary hover:text-text-secondary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </Link>
              
              {/* Mobile Search */}
              <div className="relative mt-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-light h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search jewelry..."
                  className="w-full pl-10 pr-4 py-2 border border-light-gray rounded-lg focus:ring-2 focus:ring-text-primary focus:border-transparent bg-white"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}