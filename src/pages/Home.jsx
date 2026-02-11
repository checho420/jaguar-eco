import React from 'react';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import BestsellerCarousel from '../components/BestsellerCarousel';
import { useProducts } from '../context/ProductContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { motion } from 'framer-motion';

const Home = () => {
    const { products, loading } = useProducts();

    // Filter sections
    const featuredProducts = products.filter(p => p.mas_vendido && !p.disabled).slice(0, 4);

    // Randomize the "Novedades" section to show a fresh selection on each load
    const newProducts = React.useMemo(() => {
        return products
            .filter(p => !p.disabled)
            .sort(() => Math.random() - 0.5)
            .slice(0, 6);
    }, [products]);

    return (
        <div className="pb-20">
            <Hero />

            {/* Featured Section */}
            <section className="container mx-auto px-6 py-16 overflow-hidden">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-3">Los más vendidos</h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-md">Descubre nuestras opciones ecológicas más populares y favoritas de la comunidad.</p>
                    </div>
                    <a href="/catalog" className="hidden md:block text-green-600 font-bold hover:text-green-700 transition-colors py-2 px-4 rounded-lg bg-green-50 dark:bg-green-900/20">
                        Ver Todo
                    </a>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {[1, 2, 3, 4].map(i => <div key={i} className="h-96 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse"></div>)}
                    </div>
                ) : (
                    <BestsellerCarousel products={featuredProducts} />
                )}
            </section>

            {/* Banner Promo */}
            <section className="bg-green-900 py-20 text-white text-center mb-16 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="relative z-10 container mx-auto px-6">
                    <h2 className="text-4xl font-black mb-4">¡La Rebaja de Verano ya está aquí!</h2>
                    <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">Obtén hasta un 30% de descuento en una selección exclusiva de productos sostenibles.</p>
                    <button className="bg-white text-green-900 px-10 py-4 rounded-full font-bold hover:bg-green-100 transition-all transform hover:scale-105 shadow-xl">
                        Ver Promociones
                    </button>
                </div>
            </section>

            {/* New Arrivals Section */}
            <section className="container mx-auto px-6 py-24">
                <div className="flex flex-col items-center text-center mb-16">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-green-600 font-bold tracking-[0.3em] uppercase text-xs mb-4"
                    >
                        Lo más reciente
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl font-black text-gray-900 dark:text-white mb-6"
                    >
                        Novedades
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-500 dark:text-gray-400 max-w-xl text-lg"
                    >
                        Nuestra última selección de productos ecológicos diseñados para un estilo de vida consciente y moderno.
                    </motion.p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                        {newProducts.map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <ProductCard product={product} />
                            </motion.div>
                        ))}
                    </div>
                )}
            </section>

            {/* WhatsApp Button */}
            <a
                href="https://wa.me/1234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-8 right-8 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all transform hover:scale-110 z-50 flex items-center justify-center h-14 w-14"
            >
                <FontAwesomeIcon icon={faWhatsapp} className="text-2xl" />
            </a>
        </div>
    );
};

export default Home;
