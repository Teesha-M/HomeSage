import { useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { Link } from 'react-router-dom';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
} from '../redux/user/userSlice';

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

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
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }

      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };
 
  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listings/${listingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="p-10 relative min-h-screen bg-gray-100">
      
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 opacity-40"></div>

      <div className="relative p-6 max-w-3xl mx-auto bg-white rounded-lg shadow-2xl z-10 backdrop-blur-lg border border-gray-200">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-6">Profile</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            onChange={(e) => setFile(e.target.files[0])}
            type="file"
            ref={fileRef}
            hidden
            accept="image/*"
          />
          <img
            onClick={() => fileRef.current.click()}
            src={formData.avatar || currentUser.avatar}
            alt="profile"
            className="rounded-full h-32 w-32 object-cover cursor-pointer self-center mb-4 border-4 border-gray-200 shadow-lg hover:border-blue-400 transition-all"
          />
          <p className="text-sm text-center">
            {fileUploadError ? (
              <span className="text-red-600">Error uploading image (image must be less than 2 MB)</span>
            ) : filePerc > 0 && filePerc < 100 ? (
              <span className="text-gray-600">{`Uploading ${filePerc}%`}</span>
            ) : filePerc === 100 ? (
              <span className="text-green-600">Image successfully uploaded!</span>
            ) : (
              ''
            )}
          </p>
          <input
            type="text"
            placeholder="Username"
            defaultValue={currentUser.username}
            id="username"
            className="border border-gray-300 p-3 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
          />
          <input
            type="email"
            placeholder="Email"
            id="email"
            defaultValue={currentUser.email}
            className="border border-gray-300 p-3 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="Password"
            id="password"
            className="border border-gray-300 p-3 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
          />
          <button
            disabled={loading}
            className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-3 uppercase hover:bg-gradient-to-l disabled:opacity-80 transition duration-300"
          >
            {loading ? 'Loading...' : 'Update'}
          </button>
          <Link
            className="bg-green-600 text-white p-3 rounded-lg uppercase text-center hover:bg-green-500 transition duration-300"
            to={'/create-listing'}
          >
            Create Listing
          </Link>
        </form>
        <div className="flex justify-between mt-6">
          <span
            onClick={handleDeleteUser}
            className="text-red-600 cursor-pointer hover:text-red-500 transition duration-300"
          >
            Delete Account
          </span>
          <span
            onClick={handleSignOut}
            className="text-red-600 cursor-pointer hover:text-red-500 transition duration-300"
          >
            Sign Out
          </span>
        </div>
        <p className="text-red-600 mt-4">{error ? error : ''}</p>
        <p className="text-green-600 mt-4">{updateSuccess ? 'Profile updated successfully!' : ''}</p>
        <button
          onClick={handleShowListings}
          className="text-green-600 w-full bg-white p-3 rounded-lg shadow-md hover:bg-gray-100 transition duration-300"
        >
          Show Listings
        </button>
        <p className="text-red-600 mt-4">{showListingsError ? 'Cannot retrieve your listings' : ''}</p>

        {userListings.length > 0 && (
          <div className="mt-8 space-y-4">
            {userListings.map((listing) => (
              <div
                key={listing._id}
                className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105"
              >
                <Link to={`/listing/${listing._id}`} className="flex-shrink-0">
                <img
                  src={listing.imageUrls[0]}
                  alt='listing cover'
                  className='h-16 w-16 object-contain'
                />
                </Link>
                <Link
                  className="text-gray-800 font-semibold hover:underline truncate flex-1 ml-4"
                  to={`/listing/${listing._id}`}
                >
                  <p>{listing.name}</p>
                </Link>
                <div className="flex flex-col items-center ml-4 space-y-2">
                  <button
                    onClick={() => handleListingDelete(listing._id)}
                    className="text-red-600 uppercase hover:text-red-500 transition duration-300"
                  >
                    Delete
                  </button>
                  <Link to={`/update-listing/${listing._id}`}>
                    <button className="text-green-600 uppercase hover:text-green-500 transition duration-300">
                      Edit
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
