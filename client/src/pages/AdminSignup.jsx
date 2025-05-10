import React, { useState } from 'react';
import axios from 'axios';

const AdminSignup = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [errors, setErrors] = useState({ username: '', email: '', password: '' });

  const { username, email, password } = formData;

 
  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' }); 
  };

 
  const validate = () => {
    let valid = true;
    const newErrors = { username: '', email: '', password: '' };

    if (!username) {
      newErrors.username = 'Username is required';
      valid = false;
    }
    if (!email) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email format is invalid';
      valid = false;
    }
    if (!password) {
      newErrors.password = 'Password is required';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

 
  const onSubmit = async e => {
    e.preventDefault();
    if (validate()) {
      try {
        const res = await axios.post('/api/admin/signup', formData);
        console.log(res.data);
      } catch (err) {
        console.error(err.response.data.msg);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-300 to-purple-300 flex items-start justify-center">
      <div className="bg-white bg-opacity-90 shadow-xl rounded-lg p-8 max-w-md w-full mt-16">
        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-8">Admin Signup</h2>
        
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <input
              type='text'
              name="username"
              value={username}
              onChange={onChange}
              placeholder="Username"
              className="p-3 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
          </div>
          <div>
            <input
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              placeholder="Email"
              className="p-3 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>
          <div>
            <input
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              placeholder="Password"
              className="p-3 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white p-3 rounded w-full hover:bg-blue-600 transition duration-300"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminSignup;
