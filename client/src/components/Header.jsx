import { FaSearch } from 'react-icons/fa'; 
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import logo from '../assets/logo.png';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  return (
    <header className="bg-gradient-to-r from-blue-500 to-purple-700 shadow-lg">
      <div className="flex justify-between items-center max-w-7xl mx-auto p-4">
        <div className="flex items-center space-x-2">
          <Link to="/">
            <motion.img
              src={logo}
              alt="HomeSage Logo"
              className="h-24 w-28 object-contain cursor-pointer" 
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              whileHover={{ scale: 1, rotate: 1.5 }}
            />
          </Link>
          <Link to="/">
            <motion.h1
              className="text-4xl sm:text-6xl font-extrabold text-white tracking-wider transform hover:scale-110 transition-transform duration-300"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              whileHover={{ scale: 1, rotate: 1.5 }}
              style={{
                
                textShadow: '5px 5px 10px rgba(0, 0, 0, 0.8)',
                fontFamily: "'Cinzel', serif",
              }}
            >
              HomeSage
            </motion.h1>
          </Link>
        </div>
        
        <form
          onSubmit={handleSubmit}
          className="bg-slate-100 p-3 rounded-lg flex items-center shadow-md"
        >
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>
            <FaSearch className="text-slate-600" />
          </button>
        </form>
        
        <ul className="flex gap-4">
          <Link to="/">
            <li className="hidden sm:inline text-white font-semibold text-lg hover:text-yellow-400 transition-colors duration-300">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className="hidden sm:inline text-white font-semibold text-lg hover:text-yellow-400 transition-colors duration-300">
              About
            </li>
          </Link>
          <Link to="/profile">
            {currentUser ? (
              <img
                className="rounded-full h-8 w-8 object-cover border-2 border-yellow-500"
                src={currentUser.avatar}
                alt="profile"
              />
            ) : (
              <li className="text-white font-semibold text-lg hover:text-yellow-400 transition-colors duration-300">
                Sign in
              </li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}
