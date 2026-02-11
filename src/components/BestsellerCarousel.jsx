import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faShoppingCart, faStar } from '@fortawesome/free-solid-svg-icons';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/formatters';

const BestsellerCarousel = ({ products }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const { addToCart } = useCart();

    const nextSlide = useCallback(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
    }, [products.length]);

    const prevSlide = useCallback(() => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + products.length) % products.length);
    }, [products.length]);

    useEffect(() => {
        const timer = setInterval(() => {
            nextSlide();
        }, 5000);
        return () => clearInterval(timer);
    }, [nextSlide]);

    if (!products || products.length === 0) return null;

    // We want to show 3 cards: prev, current, next
    const getCardIndex = (offset) => {
        return (currentIndex + offset + products.length) % products.length;
    };

    const visibleIndices = [-1, 0, 1];

    return (
        <div className="relative w-full overflow-hidden py-12 px-4">
            <div className="relative h-[500px] flex items-center justify-center">
                <AnimatePresence initial={false}>
                    {visibleIndices.map((offset) => {
                        const index = getCardIndex(offset);
                        const product = products[index];
                        const isActive = offset === 0;

                        return (
                            <motion.div
                                key={`${product.id}-${offset}`}
                                initial={{
                                    opacity: 0,
                                    scale: 0.8,
                                    x: offset * 300,
                                    zIndex: 0
                                }}
                                animate={{
                                    opacity: isActive ? 1 : 0.6,
                                    scale: isActive ? 1.05 : 0.85,
                                    x: offset * (window.innerWidth < 768 ? 0 : 350),
                                    zIndex: isActive ? 30 : 10,
                                    filter: isActive ? 'blur(0px)' : 'blur(2px)',
                                }}
                                exit={{
                                    opacity: 0,
                                    scale: 0.8,
                                    x: offset * 300
                                }}
                                transition={{
                                    type: "spring",
                                    stiffness: 260,
                                    damping: 20
                                }}
                                className="absolute w-[320px] md:w-[380px]"
                            >
                                <div className={`
                                    relative bg-white dark:bg-[#1a1a1a] rounded-[32px] overflow-hidden 
                                    shadow-2xl border border-gray-100 dark:border-gray-800 
                                    transition-all duration-500 group
                                    ${isActive ? 'ring-2 ring-green-500/20' : ''}
                                `}>
                                    {/* Image Section */}
                                    <div className="relative h-64 overflow-hidden">
                                        <img
                                            src={product.imagenes[0]}
                                            alt={product.nombre}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                            <p className="text-white text-sm font-medium line-clamp-2">
                                                {product.descripcion || 'Calidad premium para un estilo de vida sostenible.'}
                                            </p>
                                        </div>
                                        {product.nuevo && (
                                            <span className="absolute top-4 left-4 bg-green-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                                Nuevo
                                            </span>
                                        )}
                                    </div>

                                    {/* Content Section */}
                                    <div className="p-8">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <span className="text-[10px] font-bold text-green-600 uppercase tracking-[0.2em] mb-1 block">
                                                    {product.marca}
                                                </span>
                                                <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-1">
                                                    {product.nombre}
                                                </h3>
                                            </div>
                                            <div className="flex items-center gap-1 bg-yellow-400/10 px-2 py-1 rounded-lg">
                                                <FontAwesomeIcon icon={faStar} className="text-yellow-400 text-xs" />
                                                <span className="text-xs font-bold text-yellow-600">5.0</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between mt-6">
                                            <span className="text-2xl font-black text-gray-900 dark:text-white">
                                                {formatCurrency(product.precio)}
                                            </span>
                                            <div className="flex gap-2">
                                                <Link
                                                    to={`/product/${product.id}`}
                                                    className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                                                >
                                                    Ver más
                                                </Link>
                                                <button
                                                    onClick={() => addToCart(product)}
                                                    className="bg-green-600 hover:bg-green-700 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-90"
                                                >
                                                    <FontAwesomeIcon icon={faShoppingCart} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="flex justify-center items-center gap-8 mt-4">
                <button
                    onClick={prevSlide}
                    className="w-12 h-12 rounded-full border border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-400 hover:text-green-500 hover:border-green-500 transition-all"
                >
                    <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                <div className="flex gap-2">
                    {products.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentIndex(i)}
                            className={`w-2 h-2 rounded-full transition-all ${i === currentIndex ? 'w-8 bg-green-500' : 'bg-gray-300 dark:bg-gray-700'}`}
                        />
                    ))}
                </div>
                <button
                    onClick={nextSlide}
                    className="w-12 h-12 rounded-full border border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-400 hover:text-green-500 hover:border-green-500 transition-all"
                >
                    <FontAwesomeIcon icon={faChevronRight} />
                </button>
            </div>
        </div>
    );
};

export default BestsellerCarousel;
