import React, { useState, useEffect } from 'react';
import './profile.css';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [showAddAddress, setShowAddAddress] = useState(false);

    useEffect(() => {
        // Fetch user profile and addresses
        fetch('/api/users/profile')
            .then(response => response.json())
            .then(data => setUser(data))
            .catch(error => console.error('Error fetching user profile:', error));

        fetch(`/api/users/${user.id}/addresses`)
            .then(response => response.json())
            .then(data => setAddresses(data))
            .catch(error => console.error('Error fetching addresses:', error));
    }, [user.id]);

    const handleUpdateProfile = (e) => {
        e.preventDefault();
        // Logic to update user profile
    };

    const handleChangePassword = (e) => {
        e.preventDefault();
        // Logic to change password
    };

    const handleAddAddress = (e) => {
        e.preventDefault();
        // Logic to add a new address
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="profile-container">
            <h1>Your Profile</h1>
            <form onSubmit={handleUpdateProfile} className="profile-form">
                {/* Form fields for updating profile */}
                <button type="submit">Update Profile</button>
            </form>

            <form onSubmit={handleChangePassword} className="password-form">
                {/* Form fields for changing password */}
                <button type="submit">Change Password</button>
            </form>

            <div className="addresses-section">
                <h2>Your Addresses</h2>
                {addresses.map(address => (
                    <div key={address.id} className="address-card">
                        {/* Display address details */}
                    </div>
                ))}
                <button onClick={() => setShowAddAddress(!showAddAddress)}>
                    {showAddAddress ? 'Cancel' : 'Add New Address'}
                </button>
                {showAddAddress && (
                    <form onSubmit={handleAddAddress} className="add-address-form">
                        {/* Form fields for adding a new address */}
                        <button type="submit">Save Address</button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Profile;
