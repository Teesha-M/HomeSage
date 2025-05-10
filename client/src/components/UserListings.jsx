import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const UserListings = () => {
  const { id } = useParams(); 
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await axios.get(`/api/user/listings/${id}`);
        setListings(res.data);
      } catch (error) {
        console.error('Error fetching listings:', error);
      }
    };

    fetchListings();
  }, [id]);

  return (
    <div>
      <h1>Listings for User ID: {id}</h1>
      <ul>
        {listings.map((listing) => (
          <li key={listing._id}>{listing.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserListings;
