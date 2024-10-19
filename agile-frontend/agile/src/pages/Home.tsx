import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

const Home = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800">
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(156,163,175,0.2) 0%, rgba(156,163,175,0) 50%)`,
        }}
      />
      
      <motion.h1 
        className="text-6xl font-bold mb-6 relative z-10"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        Welcome to <span className="font-thin text-gray-600">A G I L E</span>
        <motion.span
          className="absolute -top-6 -right-6"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="w-12 h-12 text-gray-400" />
        </motion.span>
      </motion.h1>

      <motion.p 
        className="text-2xl mb-12 max-w-md text-center text-gray-600"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
      >
        Boost your productivity and workflow with our elegant task management system
      </motion.p>

      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link 
          to="/tasks" 
          className="group relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-bold rounded-full bg-gray-800 text-white shadow-2xl transition-all duration-300 ease-out hover:pl-14 hover:pr-6"
        >
          <span className="absolute left-0 inset-y-0 flex items-center justify-center w-10 h-full text-white duration-300 -translate-x-full group-hover:translate-x-4 ease">
            <ArrowRight className="w-5 h-5" />
          </span>
          <span className="relative w-full text-left transition-colors duration-300 ease-in-out">
            Get Started
          </span>
          <span className="absolute inset-0 w-full h-full -mt-1 rounded-full opacity-30 bg-gradient-to-b from-transparent via-transparent to-gray-600"></span>
        </Link>
      </motion.div>

      <motion.div 
        className="absolute bottom-0 left-0 w-full h-20 bg-gray-200 opacity-30"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
      />

      <div className="absolute bottom-4 left-4 text-sm text-gray-500">
        © 2023 Agile. All rights reserved.
      </div>
    </div>
  );
};

export default Home;