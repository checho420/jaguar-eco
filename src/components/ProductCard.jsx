import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faHeart, faStar, faPlus } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    // Calculate mock discount price for display if promo exists
    const discount = product.promocion ? 15 : 0;
    const originalPrice = discount > 0 ? (product.precio * 1.15).toFixed(2) : null;

    return (
        <motion.div
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="group relative bg-white dark:bg-[#121212] rounded-[24px] overflow-hidden shadow-md hover:shadow-2xl border border-gray-100 dark:border-gray-800 cursor-pointer flex flex-col"
        >
            {/* Top Bar (Floating) */}
            <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-start">
                {/* Badge */}
                {discount > 0 ? (
                    <span className="bg-yellow-300 text-black text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                        Sale {discount}%
                    </span>
                ) : (
                    <span className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                        {product.nuevo ? 'New' : 'Hot'}
                    </span>
                )}

                {/* Heart Button */}
                <button className="w-9 h-9 flex items-center justify-center rounded-full bg-white/80 dark:bg-black/40 backdrop-blur-sm border border-gray-100 dark:border-gray-700 text-gray-400 hover:text-red-500 hover:bg-white transition-all">
                    <FontAwesomeIcon icon={faHeartRegular} className="text-sm" />
                </button>
            </div>

            {/* Image Section */}
            <Link to={`/product/${product.id}`} className="relative h-72 w-full bg-gray-50 dark:bg-[#1a1a1a] overflow-hidden block">
                <motion.img
                    src={product.imagenes[0]}
                    alt={product.nombre}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                />
            </Link>

            {/* Content Section */}
            <div className="p-5 flex flex-col flex-grow bg-white dark:bg-[#0f0f0f]">
                {/* Brand & Rating */}
                <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{product.marca}</span>
                    <div className="flex items-center gap-1 text-yellow-400">
                        <FontAwesomeIcon icon={faStar} className="text-xs" />
                        <span className="text-xs font-bold text-gray-500 dark:text-gray-400">5.0</span>
                    </div>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-3 mb-1">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">${product.precio}</span>
                    {originalPrice && (
                        <span className="text-sm text-gray-400 line-through decoration-gray-500">${originalPrice}</span>
                    )}
                </div>

                {/* Name */}
                <Link to={`/product/${product.id}`} className="mb-4">
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 line-clamp-1 group-hover:text-green-500 transition-colors">
                        {product.nombre}
                    </h3>
                </Link>

                {/* Add to Cart Button (Bottom) */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        addToCart(product);
                    }}
                    className="mt-auto w-full py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold text-sm hover:bg-green-500 hover:text-white dark:hover:bg-green-600 transition-all flex items-center justify-center gap-2 group/btn"
                >
                    <FontAwesomeIcon icon={faShoppingCart} className="transition-transform group-hover/btn:scale-110" />
                    <span>Add to Cart</span>
                </button>
            </div>
        </motion.div>
    );
};

export default ProductCard;
