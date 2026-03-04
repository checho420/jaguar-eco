import React, { useState, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faArrowRight, faStar, faCartPlus } from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatters';

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [imageLoaded, setImageLoaded] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="group relative flex flex-col bg-white dark:bg-[#151718] rounded-[3rem] overflow-hidden transition-all duration-700 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] border border-brand-charcoal/[0.03] dark:border-white/[0.03] cursor-pointer h-full"
            onClick={() => navigate(`/product/${product.id}`)}
        >
            {/* Image Canvas */}
            <div className="relative aspect-square overflow-hidden bg-brand-cream/5 dark:bg-black/10 transition-colors duration-700 group-hover:bg-brand-green/5">
                {!imageLoaded && (
                    <div className="absolute inset-0 bg-brand-cream/5 animate-pulse" />
                )}

                {/* Product Image with dynamic scaling */}
                <motion.img
                    src={product.images[0]}
                    alt={product.name}
                    onLoad={() => setImageLoaded(true)}
                    animate={{
                        scale: isHovered ? 1.15 : 1,
                        y: isHovered ? -10 : 0
                    }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full h-full object-contain p-12 transition-all"
                />

                {/* Status Badges */}
                <div className="absolute top-8 left-8 flex flex-col gap-2">
                    {product.new && (
                        <span className="bg-brand-green text-brand-cream text-[8px] font-black uppercase tracking-[0.3em] px-5 py-2 rounded-2xl shadow-2xl backdrop-blur-md">
                            Inédito
                        </span>
                    )}
                </div>

                {/* Quick Add Button - Premium Floating Style */}
                <div className="absolute bottom-8 right-8 overflow-hidden rounded-3xl shadow-2xl">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                        className="bg-brand-green text-white p-5 flex items-center justify-center transition-all duration-500 hover:bg-brand-forest group/btn"
                    >
                        <FontAwesomeIcon icon={faCartPlus} className="text-xl group-hover/btn:rotate-12 transition-transform" />
                    </motion.button>
                </div>
            </div>

            {/* Information Matrix */}
            <div className="p-10 flex flex-col flex-grow">
                <div className="flex flex-col gap-2 mb-8">
                    <div className="flex items-center gap-3">
                        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-brand-green italic">
                            {product.brand}
                        </span>
                        <div className="h-[1px] flex-grow bg-brand-charcoal/[0.05] dark:bg-white/[0.05]" />
                    </div>
                    <h3 className="text-2xl font-black text-brand-charcoal dark:text-brand-cream tracking-tighter italic leading-tight group-hover:text-brand-green transition-colors duration-500">
                        {product.name}
                    </h3>
                </div>

                <div className="mt-auto flex items-end justify-between">
                    <div className="flex flex-col">
                        <span className="text-[8px] font-black text-brand-charcoal/30 dark:text-brand-cream/30 uppercase tracking-[0.3em] mb-2 leading-none">Inversión Recomendada</span>
                        <span className="text-4xl font-black text-brand-charcoal dark:text-brand-cream italic tracking-tighter leading-none">
                            {formatCurrency(product.price)}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 bg-brand-green/5 dark:bg-brand-green/10 px-4 py-2 rounded-2xl border border-brand-green/10">
                        <FontAwesomeIcon icon={faStar} className="text-brand-green text-[9px]" />
                        <span className="text-[10px] font-black text-brand-green">Elite</span>
                    </div>
                </div>
            </div>

            {/* Decoration Glow */}
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-brand-green/20 rounded-[3rem] transition-all duration-700 pointer-events-none" />
        </motion.div>
    );
};

export default memo(ProductCard);
