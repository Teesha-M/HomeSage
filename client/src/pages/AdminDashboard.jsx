import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link,  } from 'react-router-dom';
import mitt from 'mitt';
import { deleteUserFailure, deleteUserSuccess, signOutUserStart } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';

const emitter = mitt();


const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);
  const [activeSection, setActiveSection] = useState('users');
  const [usersWithListingCount, setUsersWithListingCount] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  
  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
      window.location = '/sign-in';

    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

    
  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const fetchListings = async () => {
    try {
      const res = await axios.get('/api/listing/get', {
        params: { limit: 100 }
      });
  
      const listingsWithOwner = res.data.map(listing => {
        const creator = users.find(user => user._id === listing.creatorId);
        return {
          ...listing,
          creatorName: creator ? creator.username : 'Unknown Creator',
        };
      });
  
      setListings(listingsWithOwner);
    } catch (err) {
      console.error('Error fetching listings:', err);
    }
  };
  
  
  const deleteUser = async (userId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user?');
    if (!confirmDelete) return;
    try {
      await axios.delete(`/api/users/${userId}`);
      setUsers(users.filter(user => user._id !== userId));
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };


  const deleteListing = async (listingId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this listing?');
    if (!confirmDelete) return;
    try {
      await axios.delete(`/api/listings/${listingId}`);
      setListings(listings.filter(listing => listing._id !== listingId));
    } catch (err) {
      console.error('Error deleting listing:', err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchUsers(); 
      await fetchListings(); 
    };
    fetchData();
  }, [activeSection]);  

  useEffect(() => {
    if (activeSection === 'users') {
      fetchUsers();
    } else {
      fetchListings();
    }


    const handleCustomEvent = (data) => {
      console.log('Received data:', data);
    };

    emitter.on('my-event', handleCustomEvent);

    return () => {
      emitter.off('my-event', handleCustomEvent);
    };
  }, [activeSection]);



  useEffect(() => {
    const fetchListingsWithContactClicks = async () => {
      try {
        const res = await axios.get('/api/listing/get'); 
        setListings(res.data.listings);
        setUsersWithListingCount(res.data.usersWithListingCount);
      } catch (err) {
        console.error('Error fetching listings:', err);
      }
    };

    fetchListingsWithContactClicks();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/listing/get');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setListings(data.listings); 
        setUsersWithListingCount(data.usersWithListingCount);  
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;




  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 to-purple-500">
      <div className="container mx-auto py-16">
        <div className="bg-white bg-opacity-90 shadow-xl rounded-lg p-8">
          <h1 className="text-5xl font-extrabold text-center text-gray-800 mb-6 tracking-wide">
            Admin Dashboard
          </h1><button
                onClick={handleSignOut}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300 mt-2"
              >
                Sign Out
              </button>

          <div className="flex justify-center mb-6 space-x-4">
            <button
              onClick={() => setActiveSection('users')}
              className={`px-4 py-2 rounded-lg ${activeSection === 'users' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-blue-400`}
            >
              Manage Users
            </button>
            <button
              onClick={() => setActiveSection('listings')}
              className={`px-4 py-2 rounded-lg ${activeSection === 'listings' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-blue-400`}
            >
              Manage Listings
            </button>
          </div>

         
          {activeSection === 'users' && (
  <div>
    <h2 className="text-3xl font-semibold text-gray-700 mb-4 border-b pb-2 border-gray-300">
      Manage Users
    </h2>
    <table className="table-auto w-full text-left border-collapse">
      <thead>
        <tr className="bg-gray-200">
          <th className="px-6 py-3 text-gray-700 text-lg">Avatar</th>
          <th className="px-6 py-3 text-gray-700 text-lg">Name</th>
          <th className="px-6 py-3 text-gray-700 text-lg">Email</th>
          <th className="px-6 py-3 text-gray-700 text-lg">Created At</th>
          <th className="px-6 py-3 text-gray-700 text-lg">Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user._id} className="border-b last:border-none hover:bg-gray-50">
            <td className="px-6 py-4">
              <img
                src={user.avatar || 'https://via.placeholder.com/50'}
                alt="user avatar"
                className="h-12 w-12 rounded-full object-cover"
              />
            </td>
            <td className="px-6 py-4 text-gray-800">{user.username}</td>
            <td className="px-6 py-4 text-gray-800">{user.email}</td>
            <td className="px-6 py-4 text-gray-800">{new Date(user.createdAt).toLocaleString()}</td>
            <td className="px-6 py-4 space-x-4">
              <button
                onClick={() => deleteUser(user._id)}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    {users.length === 0 && <p className="text-center text-gray-500 mt-6">No users found.</p>}
  </div>
)}

         

         
          {activeSection === 'listings' && (
  <div>
    <h2 className="text-3xl font-semibold text-gray-700 mb-4 border-b pb-2 border-gray-300">
      Manage Listings
    </h2>
    <table className="table-auto w-full text-left border-collapse">
      <thead>
        <tr className="bg-gray-200 ">
          <th className="px-6 py-3 text-gray-700 text-lg">Image</th>
          <th className="px-6 py-3 text-gray-700 text-lg">Name</th>
          <th className="px-6 py-3 text-gray-700 text-lg">For</th>
          <th className="px-6 py-3 text-gray-700 text-lg">Price</th>
          <th className="px-6 py-3 text-gray-700 text-lg">No. of Interested Users</th>
          <th className="px-6 py-3 text-gray-700 text-lg">Actions</th>
        </tr>
      </thead>
      <tbody>
        {listings.map((listing) => (
          <tr key={listing._id} className="border-b last:border-none hover:bg-gray-50">
            <td className="px-6 py-4">
              <img
                src={listing.imageUrls[0]}
                alt='listing cover'
                className='h-16 w-16 object-contain'
              />
            </td>
            <td className="px-6 py-4 text-gray-800">{listing.name}</td>
            <td className="px-6 py-4 text-gray-800">{listing.type === 'rent' ? 'Rent' : 'For Sale'}</td>
            <td className="px-6 py-4 text-gray-800">Rs. {listing.regularPrice}</td>
            <td className="px-6 py-4 text-gray-800">{listing.contactCount}</td>
            <td className="px-6 py-4 space-x-4">
              <Link
                to={`/listing/${listing._id}`}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
              >
                View
              </Link>
              <button
                onClick={() => deleteListing(listing._id)}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    {listings.length === 0 && <p className="text-center text-gray-500 mt-6">No listings found.</p>}
  </div>
)}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
