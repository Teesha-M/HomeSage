import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import User from '../../../api/models/user.model';

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [listings, setListings] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  const fetchUserData = async () => {
    try {
      const res = await axios.get(`/api/users/${User._id}`);
      setUser(res.data.user);
      setListings(res.data.listings);
      setFormData({ name: res.data.user.name, email: res.data.user.email });
    } catch (err) {
      console.error('Error fetching user data:', err.message);
      alert('Error fetching user data, please try again later');
      navigate(`/users/${id}`);
    }
  };

  const handleUpdateUser = async () => {
    try {
      await axios.put(`/api/users/${id}`, formData);
      alert('User updated');
    } catch (err) {
      console.error('Error updating user:', err);
    }
  };

  const handleDeleteListing = async (listingId) => {
    try {
      await axios.delete(`/api/listings/${listingId}`);
      setListings(listings.filter((listing) => listing._id !== listingId));
    } catch (err) {
      console.error('Error deleting listing:', err);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [id]);

  return (
    <div>
      {user ? (
        <>
          <h2>User Profile</h2>
          <form onSubmit={(e) => { e.preventDefault(); handleUpdateUser(); }}>
            <label>Name:</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <label>Email:</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <button type="submit">Update User</button>
          </form>

          <h3>User Listings</h3>
          <ul>
            {listings.map((listing) => (
              <li key={listing._id}>
                {listing.title} - ${listing.price}
                <button onClick={() => handleDeleteListing(listing._id)}>Delete</button>
              </li>
            ))}
          </ul>

          <button onClick={() => navigate('/admin/dashboard')}>Back to Dashboard</button>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default UserProfile;
