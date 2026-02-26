import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faStar, faCartPlus } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import { formatCurrency } from '../utils/formatters';

const NewArrivalCard = ({ product }) => {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { toggleLike } = useProducts();
    const [isHovered, setIsHovered] = useState(false);

    const discount = product.promotion ? (product.discountPercentage || 15) : 0;
    const originalPrice = discount > 0 ? (product.price / (1 - discount / 100)) : null;

    return (
        <motion.div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => navigate(`/product/${product.id}`)}
            className="flex flex-col w-full cursor-pointer group"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
            {/* Image Container - Square Aspect Ratio */}
            <div className="relative aspect-square w-full bg-gray-50 dark:bg-[#111111] rounded-[2.5rem] overflow-hidden mb-6 flex items-center justify-center transition-all duration-700 group-hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] dark:group-hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.6)] border border-gray-100 dark:border-white/5">

                {/* Sale Badge - Positioned with more style */}
                {discount > 0 && (
                    <div className="absolute top-6 left-6 z-10">
                        <span className="bg-[#E5FF00] text-black text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-tighter shadow-xl shadow-[#E5FF00]/20">
                            -{discount}%
                        </span>
                    </div>
                )}

                {/* Like Button - Minimalist and Floating */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleLike(product.id);
                    }}
                    className="absolute top-6 right-6 z-20 w-12 h-12 rounded-full bg-white/80 dark:bg-black/20 backdrop-blur-xl border border-gray-100 dark:border-white/10 flex items-center justify-center text-gray-400 dark:text-white/40 hover:text-red-500 dark:hover:text-red-500 hover:scale-110 transition-all duration-300"
                >
                    <FontAwesomeIcon
                        icon={product.isLiked ? faHeart : faHeartRegular}
                        className={`text-lg ${product.isLiked ? 'text-red-500' : ''}`}
                    />
                </button>

                {/* Product Image Stage */}
                <motion.div
                    className="w-full h-full p-10 sm:p-12 lg:p-16 flex items-center justify-center"
                    animate={{
                        scale: isHovered ? 1.08 : 1,
                        y: isHovered ? -10 : 0
                    }}
                    transition={{ duration: 1, ease: [0.33, 1, 0.68, 1] }}
                >
                    {/* Subtle glow behind the image in dark mode */}
                    <div className={`absolute inset-0 bg-white/[0.03] blur-[80px] rounded-full transition-opacity duration-700 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />

                    <img
                        src={product.images[0]}
                        alt={product.name}
                        className="max-w-full max-h-full object-contain filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative z-10"
                    />
                </motion.div>

                {/* Floating Add to Cart Button - Always Visible & Elegant */}
                <div className="absolute bottom-6 right-6 z-30">
                    <motion.button
                        whileHover={{ scale: 1.1, backgroundColor: '#E5FF00', color: '#000000' }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product);
                        }}
                        className="w-14 h-14 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-black flex items-center justify-center shadow-2xl transition-colors duration-300 border border-white/10 dark:border-black/10"
                    >
                        <FontAwesomeIcon icon={faCartPlus} className="text-xl" />
                    </motion.button>
                </div>

                {/* Dark Gradient Overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/[0.02] dark:from-black/40 to-transparent pointer-events-none" />
            </div>

            {/* Content Area - Clean Typography & Hierarchy */}
            <div className="flex flex-col gap-3 px-1">
                <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase font-black tracking-[0.2em] text-gray-400 dark:text-gray-500">
                        {product.brand || 'Eco-Friendly'}
                    </span>
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                        <FontAwesomeIcon icon={faStar} className="text-[#E5FF00] text-[10px]" />
                        <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400">
                            {product.rating || '5.0'}
                        </span>
                    </div>
                </div>

                <div className="flex flex-col gap-1">
                    <div className="flex items-baseline gap-3">
                        <span className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">
                            {formatCurrency(product.price)}
                        </span>
                        {originalPrice && (
                            <span className="text-base text-gray-400 line-through decoration-1 font-medium italic">
                                {formatCurrency(originalPrice)}
                            </span>
                        )}
                    </div>
                    <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-500 line-clamp-1">
                        {product.name}
                    </h3>
                </div>
            </div>
        </motion.div>
    );
};

export default NewArrivalCard;
