import React, { useState } from 'react';
import axios from 'axios';

const AdminSignin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');

  const { email, password } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage(''); 
  };

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/admin/signin', formData);
      localStorage.setItem('token', res.data.token);
      window.location = '/admin/dashboard';
    } catch (err) {
      setErrorMessage(err.response?.data?.msg || 'Invalid credentials. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-300 to-purple-300 flex items-start justify-center">
      <div className="bg-white bg-opacity-90 shadow-xl rounded-lg p-8 max-w-md w-full mt-16">
        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-8">Admin Signin</h2>
        
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            value={email}
            onChange={onChange}
            placeholder="Email"
            className="p-3 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            name="password"
            value={password}
            onChange={onChange}
            placeholder="Password"
            className="p-3 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errorMessage && (
            <p className="bg-red-100 text-red-600 border border-red-400 rounded p-2 text-center mt-4">
              {errorMessage}
            </p>
          )}
          <button
            type="submit"
            className="bg-blue-500 text-white p-3 rounded w-full hover:bg-blue-600 transition duration-300"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminSignin;
