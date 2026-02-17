import React, { useState, useEffect, useMemo } from 'react';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSearch,
    faFilter,
    faChevronDown,
    faTimes,
    faChartBar,
    faStar as faStarSolid
} from '@fortawesome/free-solid-svg-icons';
import { formatCurrency } from '../utils/formatters';

const Catalog = () => {
    const { products, loading } = useProducts();
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [selectedBrand, setSelectedBrand] = useState('Todas');
    const [selectedRating, setSelectedRating] = useState(null);
    const [priceRange, setPriceRange] = useState({ min: 0, max: '' });
    const [sortBy, setSortBy] = useState('Popularidad');
    const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
    const [collapsedSections, setCollapsedSections] = useState({
        brand: false,
        category: false,
        rating: false,
        price: false
    });

    const toggleSection = (section) => {
        setCollapsedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    // Categories and brands for filters
    const categories = useMemo(() => ['Todos', ...new Set(products.map(p => p.categoria))], [products]);
    const brands = useMemo(() => ['Todas', ...new Set(products.map(p => p.marca))], [products]);

    useEffect(() => {
        // Start with only active products
        let result = products.filter(p => !p.disabled);

        // Defensive Search
        if (searchTerm.trim()) {
            const query = searchTerm.toLowerCase().trim();
            result = result.filter(p =>
                (p.nombre || '').toLowerCase().includes(query) ||
                (p.marca || '').toLowerCase().includes(query)
            );
        }

        // Defensive Category
        if (selectedCategory !== 'Todos') {
            result = result.filter(p => p.categoria === selectedCategory);
        }

        // Defensive Brand
        if (selectedBrand !== 'Todas') {
            result = result.filter(p => p.marca === selectedBrand);
        }

        // Defensive Price (ensure numbers)
        const minP = parseFloat(priceRange.min) || 0;
        const maxP = priceRange.max === '' ? Infinity : (parseFloat(priceRange.max) || Infinity);
        result = result.filter(p => {
            const price = parseFloat(p.precio) || 0;
            return price >= minP && price <= maxP;
        });

        // Defensive Rating
        if (selectedRating) {
            result = result.filter(p => (p.rating || 0) >= selectedRating);
        }

        // Robust Sorting
        const sortedResult = [...result];
        if (sortBy === 'Precio: Menor a Mayor') {
            sortedResult.sort((a, b) => (parseFloat(a.precio) || 0) - (parseFloat(b.precio) || 0));
        } else if (sortBy === 'Precio: Mayor a Menor') {
            sortedResult.sort((a, b) => (parseFloat(b.precio) || 0) - (parseFloat(a.precio) || 0));
        } else if (sortBy === 'Nombre') {
            sortedResult.sort((a, b) => (a.nombre || '').localeCompare(b.nombre || ''));
        } else {
            // Default: Newest first (highest ID first)
            sortedResult.sort((a, b) => (parseInt(b.id) || 0) - (parseInt(a.id) || 0));
        }

        setFilteredProducts(sortedResult);
    }, [products, searchTerm, selectedCategory, selectedBrand, priceRange, sortBy, selectedRating]);

    const handleClearFilters = () => {
        setSelectedCategory('Todos');
        setSelectedBrand('Todas');
        setPriceRange({ min: 0, max: '' });
        setSelectedRating(null);
        setSearchTerm('');
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#0a0a0a] pb-20">
            <div className="container mx-auto px-6 pt-32 py-12">
                <div className="flex flex-col lg:flex-row gap-12">
                    <div className="flex-grow order-2 lg:order-1">
                        {/* Search and Sort Toolbar */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
                            <div className="flex items-center gap-4 w-full sm:w-auto">
                                <h2 className="text-lg font-black text-gray-900 dark:text-white whitespace-nowrap">
                                    {filteredProducts.length} <span className="text-gray-400 font-bold uppercase text-xs ml-1 tracking-widest">Productos</span>
                                </h2>
                                <button
                                    onClick={() => setIsFilterDrawerOpen(true)}
                                    className="lg:hidden p-3 bg-blue-600 text-white rounded-xl shadow-lg"
                                >
                                    <FontAwesomeIcon icon={faFilter} />
                                </button>
                            </div>

                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                <div className="relative group w-full sm:w-64">
                                    <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm group-focus-within:text-blue-500 transition-colors" />
                                    <input
                                        type="text"
                                        placeholder="Buscar un producto..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all dark:text-white text-sm font-medium"
                                    />
                                </div>
                                <div className="relative w-full sm:w-auto">
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="appearance-none w-full bg-white dark:bg-white/10 border border-gray-100 dark:border-white/10 rounded-2xl px-6 py-3 pr-12 text-sm font-bold text-gray-700 dark:text-white outline-none cursor-pointer focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option>Popularidad</option>
                                        <option>Precio: Menor a Mayor</option>
                                        <option>Precio: Mayor a Menor</option>
                                        <option>Nombre</option>
                                    </select>
                                    <FontAwesomeIcon icon={faChevronDown} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs" />
                                </div>
                            </div>
                        </div>

                        {/* Product Grid */}
                        <AnimatePresence mode="popLayout">
                            {loading ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                    {[1, 2, 3, 4, 5, 6].map(i => (
                                        <div key={i} className="h-[450px] bg-white dark:bg-white/5 rounded-[40px] animate-pulse" />
                                    ))}
                                </div>
                            ) : filteredProducts.length > 0 ? (
                                <motion.div
                                    layout
                                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
                                >
                                    {filteredProducts.map(product => (
                                        <motion.div
                                            key={product.id}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <ProductCard product={product} />
                                        </motion.div>
                                    ))}
                                </motion.div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-24 text-center">
                                    <div className="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
                                        <FontAwesomeIcon icon={faTimes} className="text-3xl text-gray-300" />
                                    </div>
                                    <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 italic">Sin resultados</h3>
                                    <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-xs">No encontramos productos que coincidan con tus filtros actuales.</p>
                                    <button
                                        onClick={handleClearFilters}
                                        className="bg-blue-600 text-white px-8 py-3 rounded-full font-black uppercase text-xs tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20"
                                    >
                                        Limpiar Filtros
                                    </button>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Sidebar Filters (Desktop) */}
                    <aside className="hidden lg:block w-[380px] flex-shrink-0 order-1 lg:order-2">
                        <div className="bg-white dark:bg-[#111] p-10 rounded-[40px] border border-gray-100 dark:border-white/5 sticky top-32 shadow-xl shadow-gray-200/50 dark:shadow-none">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-black text-gray-900 dark:text-white italic tracking-tight">Filtrar Productos</h3>
                                <button onClick={handleClearFilters} className="text-[10px] font-black uppercase tracking-widest text-blue-500 hover:text-blue-600">Limpiar</button>
                            </div>

                            {/* Brand Filter */}
                            <div className="mb-6">
                                <button
                                    onClick={() => toggleSection('brand')}
                                    className="w-full text-xs font-black uppercase tracking-widest text-gray-400 mb-4 flex items-center justify-between hover:text-blue-500 transition-colors"
                                >
                                    Marca
                                    <FontAwesomeIcon
                                        icon={faChevronDown}
                                        className={`text-[10px] transition-transform duration-300 ${collapsedSections.brand ? '-rotate-90' : ''}`}
                                    />
                                </button>
                                <AnimatePresence initial={false}>
                                    {!collapsedSections.brand && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                                            className="overflow-hidden"
                                        >
                                            <div className="grid grid-cols-2 gap-2 pb-6">
                                                {brands.map(brand => (
                                                    <button
                                                        key={brand}
                                                        onClick={() => setSelectedBrand(brand)}
                                                        className={`px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${selectedBrand === brand
                                                            ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20'
                                                            : 'bg-white dark:bg-white/5 border-gray-100 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:border-blue-500/50'
                                                            }`}
                                                    >
                                                        {brand}
                                                    </button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Category Filter */}
                            <div className="mb-6">
                                <button
                                    onClick={() => toggleSection('category')}
                                    className="w-full text-xs font-black uppercase tracking-widest text-gray-400 mb-4 flex items-center justify-between hover:text-blue-500 transition-colors"
                                >
                                    Categoría
                                    <FontAwesomeIcon
                                        icon={faChevronDown}
                                        className={`text-[10px] transition-transform duration-300 ${collapsedSections.category ? '-rotate-90' : ''}`}
                                    />
                                </button>
                                <AnimatePresence initial={false}>
                                    {!collapsedSections.category && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                                            className="overflow-hidden"
                                        >
                                            <div className="grid grid-cols-2 gap-2 pb-6">
                                                {categories.map(cat => (
                                                    <button
                                                        key={cat}
                                                        onClick={() => setSelectedCategory(cat)}
                                                        className={`px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${selectedCategory === cat
                                                            ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20'
                                                            : 'bg-white dark:bg-white/5 border-gray-100 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:border-blue-500/50'
                                                            }`}
                                                    >
                                                        {cat}
                                                    </button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Rating Selector */}
                            <div className="mb-6">
                                <button
                                    onClick={() => toggleSection('rating')}
                                    className="w-full text-xs font-black uppercase tracking-widest text-gray-400 mb-4 flex items-center justify-between hover:text-blue-500 transition-colors"
                                >
                                    Calificación
                                    <FontAwesomeIcon
                                        icon={faChevronDown}
                                        className={`text-[10px] transition-transform duration-300 ${collapsedSections.rating ? '-rotate-90' : ''}`}
                                    />
                                </button>
                                <AnimatePresence initial={false}>
                                    {!collapsedSections.rating && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                                            className="overflow-hidden"
                                        >
                                            <div className="flex gap-2 pb-6">
                                                {[1, 2, 3, 4, 5].map(rating => (
                                                    <button
                                                        key={rating}
                                                        onClick={() => setSelectedRating(rating === selectedRating ? null : rating)}
                                                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all border ${selectedRating === rating
                                                            ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20'
                                                            : 'bg-white dark:bg-white/5 border-gray-100 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:border-blue-500/50'
                                                            }`}
                                                    >
                                                        <span className="text-sm font-black">{rating}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Price Range Filter */}
                            <div className="mb-6">
                                <button
                                    onClick={() => toggleSection('price')}
                                    className="w-full text-xs font-black uppercase tracking-widest text-gray-400 mb-4 flex items-center justify-between hover:text-blue-500 transition-colors"
                                >
                                    Precio (USD)
                                    <FontAwesomeIcon
                                        icon={faChevronDown}
                                        className={`text-[10px] transition-transform duration-300 ${collapsedSections.price ? '-rotate-90' : ''}`}
                                    />
                                </button>
                                <AnimatePresence initial={false}>
                                    {!collapsedSections.price && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                                            className="overflow-hidden"
                                        >
                                            <div className="pb-6">
                                                {/* Histogram Placeholder Visual */}
                                                <div className="flex items-end gap-1 h-12 mb-6 px-2">
                                                    {[4, 7, 12, 18, 25, 35, 45, 50, 42, 30, 20, 15, 12, 8].map((h, i) => (
                                                        <div key={i} className={`flex-grow rounded-t-sm transition-colors duration-500 ${i > 3 && i < 11 ? 'bg-blue-500' : 'bg-gray-100 dark:bg-white/10'}`} style={{ height: `${h}%` }}></div>
                                                    ))}
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <div className="flex-grow">
                                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Desde ($)</p>
                                                        <div className="relative">
                                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                                                            <input
                                                                type="number"
                                                                value={priceRange.min}
                                                                onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                                                                placeholder="0"
                                                                className="w-full pl-8 pr-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl outline-none text-sm font-black dark:text-white"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex-grow">
                                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Hasta ($)</p>
                                                        <div className="relative">
                                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                                                            <input
                                                                type="number"
                                                                value={priceRange.max}
                                                                onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                                                                placeholder="Max"
                                                                className="w-full pl-8 pr-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl outline-none text-sm font-black dark:text-white"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Promo Banner in Sidebar */}
                            <div className="bg-gradient-to-br from-green-400 to-green-600 p-6 rounded-[32px] text-white overflow-hidden relative group cursor-pointer shadow-xl shadow-green-500/20">
                                <div className="relative z-10">
                                    <p className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-80">Edición Limitada</p>
                                    <h4 className="text-2xl font-black italic tracking-tighter leading-tight mb-4">Membresía <br />Energy PRO</h4>
                                    <button className="bg-white text-green-600 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform">Saber más</button>
                                </div>
                                <FontAwesomeIcon icon={faChartBar} className="absolute -right-4 -bottom-4 text-7xl opacity-20 rotate-12 group-hover:rotate-0 transition-transform duration-700" />
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            {/* Mobile Filter Drawer */}
            <AnimatePresence>
                {isFilterDrawerOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsFilterDrawerOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] lg:hidden"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 right-0 w-full max-w-sm bg-white dark:bg-[#0a0a0a] z-[101] lg:hidden overflow-y-auto p-8 shadow-2xl"
                        >
                            <div className="flex items-center justify-between mb-10">
                                <h3 className="text-2xl font-black text-gray-900 dark:text-white italic">Filtros</h3>
                                <button onClick={() => setIsFilterDrawerOpen(false)} className="p-3 bg-gray-100 dark:bg-white/5 rounded-full text-gray-500">
                                    <FontAwesomeIcon icon={faTimes} />
                                </button>
                            </div>

                            {/* Mobile Filters Content - Reusing the desktop structure but simplified */}
                            <div className="space-y-12">
                                <div>
                                    <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6">Marca</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {brands.map(brand => (
                                            <button
                                                key={brand}
                                                onClick={() => setSelectedBrand(brand)}
                                                className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all ${selectedBrand === brand
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-gray-100 dark:bg-white/5 text-gray-500'
                                                    }`}
                                            >
                                                {brand}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6">Categoría</h4>
                                    <div className="grid grid-cols-2 gap-2">
                                        {categories.map(cat => (
                                            <button
                                                key={cat}
                                                onClick={() => setSelectedCategory(cat)}
                                                className={`px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${selectedCategory === cat
                                                    ? 'bg-blue-600 border-blue-600 text-white'
                                                    : 'bg-white dark:bg-white/5 border-gray-100 dark:border-white/10 text-gray-500 dark:text-gray-400'
                                                    }`}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6">Rango de Precio</h4>
                                    <div className="flex items-center gap-3">
                                        <div className="relative flex-grow">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                                            <input
                                                type="number"
                                                value={priceRange.min}
                                                onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                                                placeholder="Mín"
                                                className="w-full pl-8 pr-2 py-3 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl outline-none text-sm font-black dark:text-white"
                                            />
                                        </div>
                                        <span className="text-gray-400 font-bold">-</span>
                                        <div className="relative flex-grow">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                                            <input
                                                type="number"
                                                value={priceRange.max}
                                                onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                                                placeholder="Máx"
                                                className="w-full pl-8 pr-2 py-3 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl outline-none text-sm font-black dark:text-white"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setIsFilterDrawerOpen(false)}
                                    className="w-full bg-blue-600 text-white py-5 rounded-3xl font-black uppercase tracking-widest shadow-xl shadow-blue-500/20"
                                >
                                    Ver Resultados
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Catalog;

