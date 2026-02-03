import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Hero = () => {
    return (
        <div className="relative bg-gray-900 text-white overflow-hidden h-screen flex flex-col justify-center items-center">
            {/* Background Image - Animated */}
            <div className="absolute inset-0 z-0">
                <motion.img
                    src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2568&auto=format&fit=crop"
                    alt="Luxury Eco Architecture"
                    className="w-full h-full object-cover"
                    initial={{ scale: 1 }}
                    animate={{ scale: 1.05 }}
                    transition={{ duration: 20, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
                />
                {/* Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/60 z-10"></div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-6 relative z-20 text-center mt-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="max-w-4xl mx-auto"
                >
                    <motion.h1
                        className="text-6xl md:text-7xl font-bold mb-6 leading-tight font-serif tracking-tight cursor-default inline-block"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                        <span>Jaguar</span>
                        <motion.span
                            className="text-green-500 italic inline-block"
                            whileHover={{
                                rotate: [0, -10, 10, -5, 5, 0],
                                transition: { duration: 0.5 }
                            }}
                        >
                            Eco
                        </motion.span>
                    </motion.h1>
                </motion.div>
            </div>

            {/* Search/Filter Bar (Vesta Style) */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="absolute bottom-20 z-30 w-full px-6"
            >
                <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center shadow-2xl">
                    <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                        <div className="bg-white/90 p-3 rounded-lg px-4 cursor-pointer hover:bg-white transition-colors">
                            <span className="block text-xs text-gray-500 uppercase font-bold">Location</span>
                            <span className="block text-gray-900 font-medium">New York, NY</span>
                        </div>
                        <div className="bg-white/90 p-3 rounded-lg px-4 cursor-pointer hover:bg-white transition-colors">
                            <span className="block text-xs text-gray-500 uppercase font-bold">Property Type</span>
                            <span className="block text-gray-900 font-medium">Solar Villa</span>
                        </div>
                        <div className="bg-white/90 p-3 rounded-lg px-4 cursor-pointer hover:bg-white transition-colors">
                            <span className="block text-xs text-gray-500 uppercase font-bold">Price Range</span>
                            <span className="block text-gray-900 font-medium">$500k - $1M</span>
                        </div>
                    </div>
                    <button className="w-full md:w-auto px-8 py-4 bg-gray-900 hover:bg-black text-white font-bold rounded-xl transition-all shadow-lg text-sm tracking-wide uppercase">
                        Search Now
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default Hero;
