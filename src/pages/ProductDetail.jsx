import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faShoppingCart,
    faHeart,
    faShareAlt,
    faExchangeAlt,
    faStar,
    faStarHalfAlt,
    faChevronRight,
    faShieldAlt,
    faTruck
} from '@fortawesome/free-solid-svg-icons';
import { formatCurrency, formatNumber } from '../utils/formatters';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/ProductCard';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getProductById, getProductsByCategory, loading } = useProducts();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [activeImage, setActiveImage] = useState(0);
    const [activeTab, setActiveTab] = useState('descripción');
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        if (!loading) {
            const found = getProductById(id);
            if (found && !found.disabled) {
                setProduct(found);
                const related = getProductsByCategory(found.categoria)
                    .filter(p => p.id !== found.id && !p.disabled)
                    .slice(0, 4);
                setRelatedProducts(related);
            } else {
                setProduct(null);
            }
        }
    }, [id, loading, getProductById, getProductsByCategory]);

    const mockCharacteristics = useMemo(() => [
        { label: 'Tipo', value: product?.categoria || 'Dispositivo Eco' },
        { label: 'Modelo', value: `JG-${(product?.id || 0).toString().padStart(4, '0')}` },
        { label: 'Eficiencia', value: product?.nuevo ? 'Ultra Alta' : 'Alta Estándar' },
        { label: 'Garantía', value: '2 Años de Fábrica' },
        { label: 'Origen', value: 'Producido de forma Sostenible' }
    ], [product]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full" />
        </div>
    );

    if (!product) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-black text-gray-900 dark:text-white">
            <h2 className="text-3xl font-black mb-4 uppercase italic tracking-tighter">Producto no encontrado</h2>
            <button onClick={() => navigate('/catalog')} className="text-green-500 font-black uppercase tracking-widest text-xs hover:underline">Volver al Catálogo</button>
        </div>
    );

    return (
        <div className="min-h-screen bg-white dark:bg-[#0a0a0a] pb-24">
            {/* Top Navigation & Breadcrumbs */}
            <nav className="container mx-auto px-6 py-8">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center space-x-3 text-[10px] font-black uppercase tracking-widest text-gray-400">
                        <span className="hover:text-green-500 cursor-pointer transition-colors" onClick={() => navigate('/')}>Inicio</span>
                        <FontAwesomeIcon icon={faChevronRight} className="text-[8px]" />
                        <span className="hover:text-green-500 cursor-pointer transition-colors" onClick={() => navigate('/catalog')}>Catálogo</span>
                        <FontAwesomeIcon icon={faChevronRight} className="text-[8px]" />
                        <span className="text-gray-900 dark:text-white truncate max-w-[150px]">{product.nombre}</span>
                    </div>

                    <div className="flex items-center space-x-6 text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">
                        <button className="flex items-center gap-2 hover:text-green-500 transition-colors">
                            <FontAwesomeIcon icon={faExchangeAlt} />
                            <span className="hidden sm:inline">Comparar</span>
                        </button>
                        <button className="flex items-center gap-2 hover:text-green-500 transition-colors">
                            <FontAwesomeIcon icon={faShareAlt} />
                            <span className="hidden sm:inline">Compartir</span>
                        </button>
                    </div>
                </div>
            </nav>

            <main className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left: Gallery Section (5 columns) */}
                    <div className="lg:col-span-12 xl:col-span-5 flex flex-col-reverse md:flex-row gap-6">
                        {/* Vertical Thumbnails */}
                        <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-visible no-scrollbar">
                            {(product.imagenes || []).map((img, idx) => (
                                <motion.button
                                    key={idx}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setActiveImage(idx)}
                                    className={`relative w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden border-2 transition-all duration-300 flex-shrink-0 ${activeImage === idx
                                        ? 'border-green-500 bg-white dark:bg-white/10 shadow-[0_10px_30px_rgba(34,197,94,0.2)]'
                                        : 'border-gray-100 dark:border-white/5 opacity-40 hover:opacity-100'
                                        }`}
                                >
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                </motion.button>
                            ))}
                        </div>

                        {/* Main Image View */}
                        <div className="relative flex-grow aspect-square rounded-[40px] overflow-hidden bg-gray-50 dark:bg-white/5 group border border-gray-100 dark:border-white/5">
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={activeImage}
                                    src={product.imagenes[activeImage]}
                                    alt={product.nombre}
                                    initial={{ opacity: 0, scale: 1.05 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                                    className="w-full h-full object-cover"
                                />
                            </AnimatePresence>

                            {/* Status Badges Overlay */}
                            <div className="absolute top-8 left-8 flex flex-col gap-2 z-10">
                                {product.promocion && (
                                    <span className="bg-red-500 text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-tighter shadow-xl">
                                        Oferta -28%
                                    </span>
                                )}
                                {product.mas_vendido && (
                                    <span className="bg-orange-500 text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-tighter shadow-xl">
                                        Más Vendido
                                    </span>
                                )}
                                {product.nuevo && (
                                    <span className="bg-green-500 text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-tighter shadow-xl">
                                        Novedad
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Middle: Info Section (4 columns) */}
                    <div className="lg:col-span-8 xl:col-span-4 flex flex-col">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-[10px] font-black text-green-500 uppercase tracking-[0.3em]">{product.marca}</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6 leading-[1.05] tracking-tighter italic">
                            {product.nombre}
                        </h1>

                        {/* Rating Area */}
                        <div className="flex items-center gap-4 mb-8">
                            <div className="flex items-center text-orange-400 gap-1 text-sm">
                                <FontAwesomeIcon icon={faStar} />
                                <FontAwesomeIcon icon={faStar} />
                                <FontAwesomeIcon icon={faStar} />
                                <FontAwesomeIcon icon={faStar} />
                                <FontAwesomeIcon icon={faStarHalfAlt} />
                                <span className="ml-2 text-gray-900 dark:text-white text-xs font-black px-2 py-0.5 rounded bg-gray-100 dark:bg-white/5">4.5</span>
                            </div>
                            <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest hover:text-green-500 cursor-pointer underline decoration-2 transition-colors">12 reseñas</span>
                        </div>

                        {/* Color Options */}
                        <div className="mb-10">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Edición de Serie</p>
                            <div className="flex gap-4">
                                <motion.div whileHover={{ scale: 1.1 }} className="w-10 h-10 rounded-full bg-[#C68E3F] border-4 border-white dark:border-[#0a0a0a] ring-2 ring-[#C68E3F] cursor-pointer shadow-xl" />
                                <motion.div whileHover={{ scale: 1.1 }} className="w-10 h-10 rounded-full bg-gray-900 border-2 border-gray-100 dark:border-white/10 cursor-pointer hover:border-green-500 transition-colors" />
                            </div>
                        </div>

                        {/* Characteristics Table */}
                        <div className="flex flex-col gap-4">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Especificaciones Técnicas</p>
                            {mockCharacteristics.map((char, i) => (
                                <div key={i} className="flex items-baseline justify-between group">
                                    <span className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider whitespace-nowrap">{char.label}</span>
                                    <div className="mx-4 h-[1px] flex-grow border-b border-dotted border-gray-200 dark:border-white/10" />
                                    <span className="text-sm text-gray-900 dark:text-white font-black italic whitespace-nowrap">{char.value}</span>
                                </div>
                            ))}
                            <button className="text-[10px] font-black text-green-500 uppercase tracking-widest mt-4 hover:underline text-left transition-all">Ver todas las especificaciones</button>
                        </div>
                    </div>

                    {/* Right: Floating Price Section (3 columns) */}
                    <div className="lg:col-span-4 xl:col-span-3">
                        <motion.div
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="bg-gray-50 dark:bg-white/5 rounded-[40px] p-8 border border-gray-100 dark:border-white/10 sticky top-32 shadow-2xl dark:shadow-none shadow-gray-200/50"
                        >
                            <div className="mb-10">
                                <div className="flex items-baseline gap-2 mb-1">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">USD</span>
                                    <span className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter italic">
                                        {formatCurrency(product.precio)}
                                    </span>
                                </div>
                                {product.promocion && (
                                    <span className="text-sm text-gray-400 line-through font-bold tracking-tight opacity-60">
                                        {formatCurrency(product.precio * 1.28)}
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-col gap-3 mb-8">
                                <motion.button
                                    whileHover={{ scale: 1.02, backgroundColor: "#22c55e" }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => addToCart(product)}
                                    className="w-full bg-green-500 text-white font-black py-5 rounded-2xl shadow-xl shadow-green-500/20 flex items-center justify-center gap-3 transition-all"
                                >
                                    <FontAwesomeIcon icon={faShoppingCart} />
                                    <span className="uppercase tracking-widest text-xs">Añadir al carrito</span>
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setIsLiked(!isLiked)}
                                    className={`w-full py-5 rounded-2xl border-2 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${isLiked
                                        ? 'bg-red-50 dark:bg-red-900/10 border-red-500 text-red-500 shadow-xl shadow-red-500/10'
                                        : 'border-gray-200 dark:border-white/10 text-gray-400 hover:border-gray-300 dark:hover:border-white/20'
                                        }`}
                                >
                                    <FontAwesomeIcon icon={isLiked ? faHeart : faHeartRegular} className="text-lg" />
                                    <span>Favoritos</span>
                                </motion.button>
                            </div>

                            <div className="space-y-4 pt-8 border-t border-gray-200 dark:border-white/5">
                                <div className="flex items-center gap-4 text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                                    <div className="w-10 h-10 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center">
                                        <FontAwesomeIcon icon={faTruck} />
                                    </div>
                                    <p className="font-black">Envío Estándar: <span className="text-green-500">Gratis</span></p>
                                </div>
                                <div className="flex items-center gap-4 text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                                        <FontAwesomeIcon icon={faShieldAlt} />
                                    </div>
                                    <p className="font-black">Pago Seguro Garantizado</p>
                                </div>
                            </div>

                            {/* Seasonal Banner */}
                            <motion.div
                                whileHover={{ x: 5 }}
                                className="mt-10 bg-gradient-to-br from-orange-400 to-orange-600 p-5 rounded-[24px] text-white flex justify-between items-center cursor-pointer shadow-xl shadow-orange-500/20"
                            >
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-90">Oferta de Otoño 2026</p>
                                    <p className="text-sm font-black italic tracking-tight">Hasta el 10 de Nov</p>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                                    <FontAwesomeIcon icon={faChevronRight} className="text-[10px]" />
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>

                {/* Tabs Section */}
                <div className="mt-32">
                    <div className="flex border-b border-gray-100 dark:border-white/10 mb-12 overflow-x-auto no-scrollbar gap-12">
                        {['descripción', 'especificaciones', 'reseñas'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-6 text-xs font-black uppercase tracking-[0.3em] relative transition-all ${activeTab === tab ? 'text-green-500' : 'text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                    }`}
                            >
                                {tab}
                                {activeTab === tab && (
                                    <motion.div layoutId="detailTab" className="absolute bottom-0 left-0 right-0 h-1 bg-green-500 rounded-full" />
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="max-w-5xl">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="text-gray-600 dark:text-gray-400 leading-relaxed font-bold"
                            >
                                {activeTab === 'descripción' && (
                                    <div className="space-y-6">
                                        <p className="text-xl md:text-2xl text-gray-900 dark:text-white font-black italic tracking-tighter leading-snug">
                                            El alto rendimiento se une al diseño sostenible. El {product.nombre} representa la cima de la ingeniería ecológica.
                                        </p>
                                        <p className="text-lg">
                                            {product.descripcion || 'Sin descripción detallada disponible.'}. Diseñado para quienes exigen eficiencia sin compromisos estéticos, este dispositivo incorpora materiales de primera calidad y componentes modulares de vanguardia.
                                        </p>
                                        <p>
                                            Cada unidad es rigurosamente probada para cumplir con nuestra iniciativa "Residuo Cero", asegurando que hasta el 98% de los componentes sean reciclables al final de su vida útil. Jaguar Eco no es solo una elección, es un compromiso con el futuro.
                                        </p>
                                    </div>
                                )}
                                {activeTab === 'especificaciones' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {(product.especificaciones && product.especificaciones.length > 0 ? product.especificaciones : [...mockCharacteristics, ...mockCharacteristics]).map((spec, i) => (
                                            <div key={i} className="p-6 rounded-3xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 space-y-2">
                                                <p className="text-[9px] font-black uppercase tracking-widest text-green-500">{spec.label}</p>
                                                <p className="text-lg font-black italic text-gray-900 dark:text-white">{spec.value}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {activeTab === 'reseñas' && (
                                    <div className="space-y-8">
                                        {product.reseñas && product.reseñas.length > 0 ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {product.reseñas.map((review, i) => (
                                                    <div key={i} className="bg-gray-50 dark:bg-white/5 rounded-[32px] p-8 border border-gray-100 dark:border-white/5 shadow-sm">
                                                        <div className="flex justify-between items-start mb-4">
                                                            <div>
                                                                <p className="font-black italic text-gray-900 dark:text-white uppercase tracking-tighter">{review.usuario}</p>
                                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{review.fecha}</p>
                                                            </div>
                                                            <div className="flex gap-1 text-orange-400 text-xs">
                                                                {[...Array(5)].map((_, starIdx) => (
                                                                    <FontAwesomeIcon
                                                                        key={starIdx}
                                                                        icon={faStar}
                                                                        className={starIdx < review.rating ? 'text-orange-400' : 'text-gray-200 dark:text-white/10'}
                                                                    />
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <p className="text-sm italic leading-relaxed text-gray-600 dark:text-gray-300">"{review.comentario}"</p>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="bg-gray-50 dark:bg-white/5 rounded-[40px] p-12 border-2 border-dotted border-gray-200 dark:border-white/10 text-center flex flex-col items-center">
                                                <div className="flex gap-1 text-gray-200 dark:text-white/10 text-3xl mb-6">
                                                    <FontAwesomeIcon icon={faStar} />
                                                    <FontAwesomeIcon icon={faStar} />
                                                    <FontAwesomeIcon icon={faStar} />
                                                    <FontAwesomeIcon icon={faStar} />
                                                    <FontAwesomeIcon icon={faStar} />
                                                </div>
                                                <h4 className="text-xl font-black italic text-gray-900 dark:text-white mb-2 uppercase">Sin reseñas aún</h4>
                                                <p className="mb-8">Sé el primero en compartir tu experiencia con este producto.</p>
                                                <button className="bg-white dark:bg-black text-[10px] font-black uppercase tracking-[0.2em] px-10 py-4 rounded-2xl border-2 border-gray-100 dark:border-white/10 hover:border-green-500 transition-all">Escribir Reseña</button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <section className="mt-32 border-t border-gray-100 dark:border-white/5 pt-24">
                        <div className="flex items-end justify-between mb-16 px-2">
                            <div>
                                <p className="text-[10px] font-black text-green-500 uppercase tracking-[0.3em] mb-4">Completa tu set</p>
                                <h3 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white italic tracking-tighter">Ecosistema Relacionado</h3>
                            </div>
                            <button onClick={() => navigate('/catalog')} className="hidden md:block text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-[0.2em] px-8 py-3 rounded-xl border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-all">Explorar todo</button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                            {relatedProducts.map(p => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
};

export default ProductDetail;
