import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faStar, faCartPlus, faEye } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
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

    // Contact via WhatsApp for specific product
    const handleWhatsApp = (e) => {
        e.stopPropagation();
        const message = encodeURIComponent(`Hola! Me interesa este producto: ${product.name}. Me podrías dar más información?`);
        window.open(`https://wa.me/573123456789?text=${message}`, '_blank');
    };

    return (
        <motion.div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="group relative flex flex-col w-full h-full cursor-pointer bg-white dark:bg-[#0A0A0A] rounded-[2rem] overflow-hidden transition-all duration-500 border border-gray-100 dark:border-white/5 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
        >
            {/* Image Container with Dynamic Stage */}
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#F9F9F9] dark:bg-[#111111] flex items-center justify-center p-8 transition-colors duration-500 group-hover:bg-white dark:group-hover:bg-[#151515]">

                {/* Visual Accent - Dynamic Glow */}
                <div className={`absolute inset-0 bg-gradient-to-tr from-[#E5FF00]/5 to-transparent transition-opacity duration-700 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />

                {/* Sale Badge */}
                {discount > 0 && (
                    <div className="absolute top-6 left-6 z-10">
                        <motion.span
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="bg-black dark:bg-[#E5FF00] text-white dark:text-black text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-lg"
                        >
                            -{discount}%
                        </motion.span>
                    </div>
                )}

                {/* Quick Action Side Bar (Glassmorphic) */}
                <div className="absolute top-6 right-6 z-20 flex flex-col gap-3">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleLike(product.id);
                        }}
                        className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-xl border transition-all duration-300 ${product.isLiked
                            ? 'bg-red-500 border-red-500 text-white shadow-lg shadow-red-500/30'
                            : 'bg-white/80 dark:bg-black/40 border-gray-200 dark:border-white/10 text-gray-400 dark:text-white/40 hover:text-red-500'
                            }`}
                    >
                        <FontAwesomeIcon icon={product.isLiked ? faHeart : faHeartRegular} />
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleWhatsApp}
                        className="w-10 h-10 rounded-full bg-white/80 dark:bg-black/40 backdrop-blur-xl border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-400 dark:text-white/40 hover:text-green-500 transition-all duration-300"
                    >
                        <FontAwesomeIcon icon={faWhatsapp} />
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => navigate(`/product/${product.id}`)}
                        className="w-10 h-10 rounded-full bg-white/80 dark:bg-black/40 backdrop-blur-xl border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-400 dark:text-white/40 hover:text-[#E5FF00] transition-all duration-300"
                    >
                        <FontAwesomeIcon icon={faEye} />
                    </motion.button>
                </div>

                {/* Product Image */}
                <motion.div
                    animate={{
                        scale: isHovered ? 1.1 : 1,
                        y: isHovered ? -15 : 0
                    }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="relative z-10 w-full h-full flex items-center justify-center"
                >
                    <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.05)] dark:drop-shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
                    />
                </motion.div>

                {/* Add To Cart - Primary CTA Always Visible & Elegant */}
                <div className="absolute bottom-6 left-0 w-full px-6 z-30">
                    <motion.button
                        whileHover={{ scale: 1.02, backgroundColor: '#E5FF00', color: '#000000' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product);
                        }}
                        className={`w-full py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl flex items-center justify-center gap-3 transition-all duration-300 ${isHovered
                            ? 'bg-[#E5FF00] text-black shadow-[#E5FF00]/20'
                            : 'bg-black/80 dark:bg-white/90 text-white dark:text-black backdrop-blur-md'
                            }`}
                    >
                        <FontAwesomeIcon icon={faCartPlus} />
                        <span className={isHovered ? 'block' : 'hidden sm:block'}>Agregar al Carrito</span>
                    </motion.button>
                </div>
            </div>

            {/* Info Area */}
            <div className="flex flex-col p-6 pt-7 bg-white dark:bg-[#0A0A0A]">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-col gap-1.5 flex-1">
                        <span className="text-[10px] font-black text-[#E5FF00] uppercase tracking-[0.2em]">
                            {product.brand || 'Eco Selection'}
                        </span>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight line-clamp-1 group-hover:text-[#E5FF00] transition-colors duration-300">
                            {product.name}
                        </h3>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">
                                {formatCurrency(product.price)}
                            </span>
                            {originalPrice && (
                                <span className="text-sm text-gray-400 line-through font-medium">
                                    {formatCurrency(originalPrice)}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                                <FontAwesomeIcon
                                    key={i}
                                    icon={faStar}
                                    className={`text-[8px] ${i < Math.floor(product.rating || 5) ? 'text-[#E5FF00]' : 'text-gray-200 dark:text-gray-800'}`}
                                />
                            ))}
                            <span className="text-[10px] text-gray-400 ml-1 font-bold">({product.reviews || 0})</span>
                        </div>
                    </div>

                    {/* Tiny visual detail for minimalist look */}
                    <div className="w-8 h-[2px] bg-gray-100 dark:bg-white/5 rounded-full" />
                </div>
            </div>
        </motion.div>
    );
};

export default NewArrivalCard;
