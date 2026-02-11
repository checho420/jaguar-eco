import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faHeart, faStar, faEye, faShoppingBag, faPlus } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [isLiked, setIsLiked] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const discount = product.promocion ? 15 : 0;
    const originalPrice = discount > 0 ? (product.precio * 1.15).toFixed(2) : null;
    const whatsappUrl = `https://wa.me/1234567890?text=Hola, estoy interesado en: ${product.nombre}`;

    return (
        <motion.div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => navigate(`/product/${product.id}`)}
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ y: -8 }}
            className="group relative h-[520px] bg-white dark:bg-[#0f0f0f] rounded-[40px] p-4 flex flex-col transition-all duration-700 hover:shadow-[0_40px_100px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_40px_100px_rgba(0,0,0,0.4)] border border-gray-100 dark:border-white/5 overflow-hidden cursor-pointer"
        >
            {/* Image Vessel */}
            <div className="relative h-64 w-full rounded-[30px] overflow-hidden bg-gray-50 dark:bg-white/5">
                <motion.img
                    src={product.imagenes[0]}
                    alt={product.nombre}
                    loading="lazy"
                    onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80'; // Fallback image
                        e.target.onerror = null; // Prevent infinite loop
                    }}
                    animate={{ scale: isHovered ? 1.05 : 1 }}
                    transition={{ duration: 1.2, ease: [0.33, 1, 0.68, 1] }}
                    className="w-full h-full object-cover"
                />

                {/* Floating Status Badge */}
                <AnimatePresence>
                    {(discount > 0 || product.nuevo) && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="absolute top-5 left-5 z-10"
                        >
                            <span className="bg-white/90 dark:bg-black/80 backdrop-blur-md text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm dark:text-jaguar-gold">
                                {discount > 0 ? `-${discount}%` : 'Novedad'}
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Aesthetic Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </div>

            {/* Information Space */}
            <div className="px-3 pt-6 flex flex-col flex-grow">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold text-blue-500/80 uppercase tracking-[0.2em]">
                        {product.marca}
                    </span>
                    <div className="h-px flex-grow bg-gray-100 dark:bg-white/5" />
                </div>

                <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight leading-tight line-clamp-1 mb-2 group-hover:text-blue-500 transition-colors duration-300">
                    {product.nombre}
                </h3>

                <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center text-yellow-400 text-[10px] gap-0.5">
                        <FontAwesomeIcon icon={faStar} />
                        <FontAwesomeIcon icon={faStar} />
                        <FontAwesomeIcon icon={faStar} />
                        <FontAwesomeIcon icon={faStar} />
                        <FontAwesomeIcon icon={faStar} className="text-gray-200 dark:text-white/10" />
                    </div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">4.5 (12 reseñas)</span>
                </div>

                {/* Interactive Action Belt - Pure Minimalist Icons */}
                <div className="flex items-center gap-6 mb-6">
                    <motion.button
                        whileHover={{ scale: 1.25, y: -4 }}
                        whileTap={{ scale: 0.9 }}
                        animate={{
                            color: isLiked ? "#ef4444" : isHovered ? "#ef4444" : "",
                            scale: isLiked ? 1.2 : 1
                        }}
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsLiked(!isLiked);
                        }}
                        className={`transition-colors duration-400 ${!isLiked ? 'text-gray-400 dark:text-gray-500' : ''}`}
                        title="Me gusta"
                    >
                        <FontAwesomeIcon icon={isLiked ? faHeart : faHeartRegular} className="text-xl" />
                    </motion.button>

                    <div className="text-gray-400 dark:text-gray-500 transition-colors duration-400 hover:text-blue-500">
                        <motion.div
                            whileHover={{ scale: 1.25, y: -4 }}
                            whileTap={{ scale: 0.9 }}
                            title="Ver detalles"
                        >
                            <FontAwesomeIcon icon={faEye} className="text-xl" />
                        </motion.div>
                    </div>

                    <motion.a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.25, y: -4, color: "#25D366" }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => e.stopPropagation()}
                        className="text-gray-400 dark:text-gray-500 transition-colors duration-400"
                        title="WhatsApp"
                    >
                        <FontAwesomeIcon icon={faWhatsapp} className="text-2xl" />
                    </motion.a>
                </div>

                {/* Footer Engagement Area */}
                <div className="mt-auto flex items-end justify-between pb-2">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] text-blue-500/60 font-black uppercase tracking-[0.2em]">Comprar</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">
                                ${product.precio}
                            </span>
                            {originalPrice && (
                                <span className="text-sm text-gray-400 line-through font-medium tracking-tight">${originalPrice}</span>
                            )}
                        </div>
                    </div>

                    {/* Prominent Cart Icon Button */}
                    <motion.button
                        whileHover="hover"
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            addToCart(product);
                        }}
                        className="relative p-4 group/cart outline-none"
                    >
                        <motion.div
                            className="relative z-10 text-gray-400 dark:text-gray-500"
                            variants={{
                                hover: {
                                    scale: 1.3,
                                    y: -2,
                                    color: "#22c55e",
                                    filter: "drop-shadow(0 0 15px rgba(34, 197, 94, 0.3))"
                                }
                            }}
                            transition={{ type: "spring", stiffness: 400, damping: 12 }}
                        >
                            {/* Floating Plus Indicator */}
                            <motion.div
                                className="absolute -top-5 left-1/2 -translate-x-1/2 text-green-500"
                                initial={{ opacity: 0, y: 10, scale: 0.5 }}
                                variants={{
                                    hover: {
                                        opacity: 1,
                                        y: -10,
                                        scale: 1,
                                        transition: { type: "spring", stiffness: 500, damping: 15 }
                                    }
                                }}
                            >
                                <FontAwesomeIcon icon={faPlus} className="text-sm" />
                            </motion.div>

                            <FontAwesomeIcon icon={faShoppingCart} className="text-3xl" />
                        </motion.div>
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;
