import { motion } from 'framer-motion';
import logo from '../assets/homesage-high-resolution-logo-transparent (4).png';

export default function About() {
  return (
    <div className="relative min-h-screen bg-gradient-to-r from-blue-400 via-purple-500 to-pink-600 overflow-hidden">
      
      <div className="absolute inset-0 z-[-1]">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-600 opacity-80"></div>
        <div className="absolute inset-0 bg-[url('')] bg-cover bg-fixed mix-blend-multiply opacity-50"></div>
        <motion.div
          className="absolute inset-0"
          animate={{ y: ['-10%', '10%'] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        >
          <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 200 200" preserveAspectRatio="none">
            <circle cx="100" cy="100" r="60" fill="#fff" opacity="0.2" />
            <circle cx="150" cy="50" r="40" fill="#fff" opacity="0.15" />
            <circle cx="50" cy="150" r="50" fill="#fff" opacity="0.1" />
          </svg>
        </motion.div>
      </div>

      <div className="relative z-10 py-20 px-6 max-w-6xl mx-auto text-center text-white">
        
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <img src={logo} alt="HOMESAGE Logo" className="mx-auto h-96 w-auto" /> 
        </motion.div>

        
        <motion.div
          className="my-8 border-t border-white opacity-40"
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 0.5 }}
        />

        
        <motion.p className="text-lg sm:text-xl mb-6" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.5 }}>
        HOMESAGE is an innovative web application designed to connect property owners and potential buyers. Users can effortlessly list their properties for sale, showcasing essential details and images to attract interest. Meanwhile, prospective buyers can browse a wide range of available properties, compare options, and directly contact owners to inquire about listings. Our platform aims to streamline the buying and selling process, making it easier for everyone involved in real estate transactions.
        </motion.p>

        
        <motion.div className="mt-12 pt-12 border-t border-gray-200" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1.1 }}>
          <h2 className="text-3xl lg:text-4xl font-semibold mb-4">Contact Us</h2>
          <p className="text-lg sm:text-xl mb-4">We would love to hear from you! Please reach out to us at:</p>
          
          
          <motion.a
            href="mailto:mahajanvkrishna@gmail.com"
            className="text-2xl text-white font-bold hover:text-gray-300 transition-colors duration-300 block mb-2"
            whileHover={{ scale: 1.05, textShadow: "0px 0px 20px rgba(255, 255, 255, 0.6)" }}
          >
            <span className="mr-2">📧</span> mahajanvkrishna@gmail.com
          </motion.a>

          
          <motion.a
            href="mailto:anotheremail@example.com"
            className="text-2xl text-white font-bold hover:text-gray-300 transition-colors duration-300 block"
            whileHover={{ scale: 1.05, textShadow: "0px 0px 20px rgba(255, 255, 255, 0.6)" }}
          >
            <span className="mr-2">📧</span> malkaniteesha@gmail.com
          </motion.a>

          
          <motion.div
            className="mt-8 p-6 bg-white bg-opacity-20 rounded-lg shadow-lg transition-transform duration-300 transform hover:scale-105"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 1.5 }}
          >
            <h3 className="text-xl text-white mb-3">Connect with us on social media!</h3>
            <div className="flex justify-center space-x-4">
              <a href="https://facebook.com" className="text-white hover:text-blue-400 transition duration-300">Facebook</a>
              <a href="https://twitter.com" className="text-white hover:text-blue-400 transition duration-300">Twitter</a>
              <a href="https://instagram.com" className="text-white hover:text-blue-400 transition duration-300">Instagram</a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
