import React from 'react';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../context/ProductContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';

const Home = () => {
    const { products, loading } = useProducts();

    // Filter sections
    const featuredProducts = products.filter(p => p.mas_vendido).slice(0, 4);
    console.log("Featured Products", featuredProducts); // Debug
    const newProducts = products.filter(p => p.nuevo).slice(0, 4);

    return (
        <div className="pb-20">
            <Hero />

            {/* Featured Section */}
            <section className="container mx-auto px-6 py-16">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Bestsellers</h2>
                        <p className="text-gray-600 dark:text-gray-400">Our most popular eco-friendly choices.</p>
                    </div>
                    <a href="/catalog" className="hidden md:block text-green-600 font-semibold hover:text-green-700">View All</a>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {[1, 2, 3, 4].map(i => <div key={i} className="h-96 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse"></div>)}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {featuredProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </section>

            {/* Banner Promo */}
            <section className="bg-green-900 py-16 text-white text-center mb-16 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="relative z-10 container mx-auto px-6">
                    <h2 className="text-3xl font-bold mb-4">Summer Sale is Live!</h2>
                    <p className="text-xl mb-8 opacity-90">Get up to 30% off on selected sustainable apparel.</p>
                    <button className="bg-white text-green-900 px-8 py-3 rounded-full font-bold hover:bg-green-100 transition-colors">Check Promotions</button>
                </div>
            </section>

            {/* New Arrivals Section */}
            <section className="container mx-auto px-6 py-8">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">New Arrivals</h2>
                {loading ? (
                    <div className="text-center py-20">Loading...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {newProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
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
