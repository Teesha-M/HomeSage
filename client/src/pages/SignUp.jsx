import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      setError(null);
      navigate('/sign-in');
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <div className="relative min-h-screen bg-[url('/src/assets/real-estate.png')] bg-center bg-no-repeat bg-[length:80%]">
      
      <div className="absolute top-14 right-16 z-30">
        <Link to="/">
          <img
            src="/src/assets/homesage-high-resolution-logo-transparent (4).png"
            alt="HomeSage Logo"
            className="h-64 w-auto hover:opacity-80 transition duration-300"
          />
        </Link>
      </div>

      
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-600 opacity-30 pointer-events-none z-10"></div>

      
      <div className="flex items-start justify-center min-h-screen pt-20">
        <div className="relative p-6 max-w-lg w-full bg-white rounded-2xl shadow-lg z-20 backdrop-blur-md">
          <h1 className="text-3xl font-semibold text-center my-7 text-gray-900">Sign Up</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <input
              type="text"
              placeholder="Username"
              id="username"
              onChange={handleChange}
              className="border border-gray-300 p-4 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            />
            <input
              type="email"
              placeholder="Email"
              id="email"
              onChange={handleChange}
              className="border border-gray-300 p-4 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            />
            <input
              type="password"
              placeholder="Password"
              id="password"
              onChange={handleChange}
              className="border border-gray-300 p-4 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            />

            <button
              disabled={loading}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-lg uppercase hover:opacity-90 disabled:opacity-80 transition duration-300 shadow-lg"
            >
              {loading ? 'Loading...' : 'Sign Up'}
            </button>
            <p className="text-center font-semibold mx-4">OR</p>
            <OAuth />
          </form>
          <div className="flex gap-2 mt-5 justify-center items-center">
            <p className="text-gray-700">Already have an account?</p>
            <Link to="/sign-in">
              <span className="text-blue-600 hover:underline">Sign In</span>
            </Link>
          </div>
          {error && <p className="text-red-500 mt-5 text-center">{error}</p>}
        </div>
      </div>
    </div>
  );
}
