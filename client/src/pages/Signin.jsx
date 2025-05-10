import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../redux/user/userSlice';
import OAuth from '../components/OAuth';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div
      className="p-24 relative min-h-screen bg-cover bg-center bg-no-repeat bg-[url('/src/assets/modern-skyline-abstract-style-skyscraper-buildings-on-white-background-city-skyline-and-water-reflection-panama-city-MDH9XJ.jpg')]"
    >
     
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-600 opacity-30"></div>
      <div className="absolute inset-0 bg-radial-gradient from-gray-900 to-transparent opacity-20"></div>

      <div className="relative p-6 max-w-md mx-auto bg-white rounded-lg shadow-2xl z-10 backdrop-blur-md">
        <h1 className="text-4xl font-semibold text-center my-7 text-gray-900">Sign In</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            id="email"
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          />
          <input
            type="password"
            placeholder="Password"
            id="password"
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-3 rounded-lg uppercase hover:bg-gradient-to-l disabled:opacity-80 transition duration-300"
          >
            {loading ? 'Loading...' : 'Sign In'}
          </button>
          <p className="text-center font-semibold mx-4">OR</p>
          <OAuth />
        </form>

        <div className="flex flex-col items-center mt-5 gap-2">
          <div className="flex gap-2 justify-center items-center">
            <p className="text-gray-700">Don't have an account?</p>
            <Link to={'/sign-up'}>
              <span className="text-blue-600 font-semibold hover:underline transition duration-300">Sign Up</span>
            </Link>
          </div>
          <Link
            to="/forgot-password"
            className="text-blue-600 font-semibold hover:underline transition duration-300"
          >
            Forgot password ?
          </Link>
          <div className='flex gap-2 mt-5'>
          <p>If You are Admin!! </p>
        <Link to={'/signin'}>
          <span className="text-blue-600 font-semibold hover:underline transition duration-300">Sign In Here</span>
        </Link>
        </div>
        </div>

        {error && <p className="text-red-500 mt-5 text-center">{error}</p>}
      </div>
    </div>
  );
}
