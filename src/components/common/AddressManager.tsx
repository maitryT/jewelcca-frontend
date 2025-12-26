import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CheckCircle, MapPin } from 'lucide-react';
import { addressesAPI } from '../../services/api';

interface Address {
  id?: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault?: boolean;
}

export default function AddressManager() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Address>({
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India'
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await addressesAPI.getAll();
      setAddresses(response.data);
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        await addressesAPI.update(editingId, formData);
      } else {
        await addressesAPI.create(formData);
      }

      await fetchAddresses();
      resetForm();
    } catch (error) {
      console.error('Error saving address:', error);
      alert('Failed to save address');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await addressesAPI.delete(id);
        await fetchAddresses();
      } catch (error) {
        console.error('Error deleting address:', error);
        alert('Failed to delete address');
      }
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await addressesAPI.setDefault(id);
      await fetchAddresses();
    } catch (error) {
      console.error('Error setting default address:', error);
    }
  };

  const handleEdit = (address: Address) => {
    setFormData(address);
    setEditingId(address.id || null);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      streetAddress: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India'
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-text-primary flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          My Addresses
        </h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-text-primary text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Address
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-light-gray rounded-lg p-6 mb-6">
          <h4 className="text-lg font-semibold text-text-primary mb-4">
            {editingId ? 'Edit Address' : 'Add New Address'}
          </h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="streetAddress"
                placeholder="Street Address"
                value={formData.streetAddress}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-light-gray rounded-lg focus:ring-2 focus:ring-text-primary focus:border-transparent"
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-light-gray rounded-lg focus:ring-2 focus:ring-text-primary focus:border-transparent"
              />
              <input
                type="text"
                name="state"
                placeholder="State/Province"
                value={formData.state}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-light-gray rounded-lg focus:ring-2 focus:ring-text-primary focus:border-transparent"
              />
              <input
                type="text"
                name="zipCode"
                placeholder="ZIP/Postal Code"
                value={formData.zipCode}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-light-gray rounded-lg focus:ring-2 focus:ring-text-primary focus:border-transparent"
              />
              <select
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-light-gray rounded-lg focus:ring-2 focus:ring-text-primary focus:border-transparent"
              >
                <option value="India">India</option>
                <option value="United States">United States</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-text-primary text-white py-2 rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                {editingId ? 'Update Address' : 'Save Address'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 border-2 border-text-primary text-text-primary py-2 rounded-lg hover:bg-light-gray transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Address List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-text-primary mx-auto"></div>
        </div>
      ) : addresses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map(address => (
            <div
              key={address.id}
              className="bg-white border-2 border-light-gray rounded-lg p-4 relative hover:border-text-primary transition-colors"
            >
              {address.isDefault && (
                <div className="absolute top-2 right-2 flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">
                  <CheckCircle className="h-3 w-3" />
                  Default
                </div>
              )}

              <p className="font-semibold text-text-primary mb-2">
                {address.streetAddress}
              </p>
              <p className="text-sm text-text-secondary">
                {address.city}, {address.state} {address.zipCode}
              </p>
              <p className="text-sm text-text-secondary">
                {address.country}
              </p>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleEdit(address)}
                  className="flex-1 flex items-center justify-center gap-1 text-text-primary hover:bg-light-gray py-2 rounded transition-colors"
                >
                  <Edit2 className="h-4 w-4" />
                  <span className="text-sm">Edit</span>
                </button>
                {!address.isDefault && (
                  <button
                    onClick={() => handleSetDefault(address.id!)}
                    className="flex-1 flex items-center justify-center gap-1 text-gray-600 hover:bg-light-gray py-2 rounded transition-colors"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">Set Default</span>
                  </button>
                )}
                <button
                  onClick={() => handleDelete(address.id!)}
                  className="flex items-center justify-center gap-1 text-red-600 hover:bg-red-50 px-3 py-2 rounded transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-light-gray rounded-lg">
          <MapPin className="h-12 w-12 text-text-light mx-auto mb-3" />
          <p className="text-text-secondary mb-4">No addresses saved yet</p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 bg-text-primary text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Your First Address
          </button>
        </div>
      )}
    </div>
  );
}
