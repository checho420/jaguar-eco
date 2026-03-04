import React, { useState, useEffect, useMemo } from 'react';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../context/ProductContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Home = () => {
    const { products, loading } = useProducts();

    // Stability of selection
    const [randomIds, setRandomIds] = useState([]);

    useEffect(() => {
        if (products.length > 0 && randomIds.length === 0) {
            const ids = products
                .filter(p => !p.disabled)
                .sort(() => Math.random() - 0.5)
                .slice(0, 6)
                .map(p => p.id);
            setRandomIds(ids);
        }
    }, [products, randomIds]);

    const displayProducts = useMemo(() => {
        return randomIds
            .map(id => products.find(p => p.id === id))
            .filter(Boolean);
    }, [randomIds, products]);

    return (
        <div className="bg-brand-cream dark:bg-brand-charcoal overflow-x-hidden transition-colors duration-1000">
            <Hero />

            {/* Intro Stats Section */}
            <section className="py-24 border-b border-brand-charcoal/[0.03] dark:border-white/[0.03]">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
                        <div className="flex flex-col gap-4">
                            <span className="text-brand-green font-bold text-5xl">98%</span>
                            <h4 className="text-sm font-bold uppercase tracking-widest opacity-40">Satisfacción Elite</h4>
                            <p className="text-sm leading-relaxed opacity-60">Nuestros clientes experimentan una transición energética impecable y sofisticada.</p>
                        </div>
                        <div className="flex flex-col gap-4">
                            <span className="text-brand-green font-bold text-5xl">25+</span>
                            <h4 className="text-sm font-bold uppercase tracking-widest opacity-40">Proyectos Globales</h4>
                            <p className="text-sm leading-relaxed opacity-60">Liderando la industria con infraestructuras de alto rendimiento en toda la región.</p>
                        </div>
                        <div className="flex flex-col gap-4">
                            <span className="text-brand-green font-bold text-5xl">0.0</span>
                            <h4 className="text-sm font-bold uppercase tracking-widest opacity-40">Huella de Carbono</h4>
                            <p className="text-sm leading-relaxed opacity-60">Compromiso absoluto con la neutralidad climática en cada eslabón de nuestra cadena.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="relative container mx-auto px-6 py-40 overflow-hidden">
                {/* Decorative background element for the section */}
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-brand-green/5 rounded-full blur-[120px] pointer-events-none" />

                <div className="flex flex-col md:flex-row justify-between items-end mb-32 gap-12 relative z-10">
                    <div className="max-w-2xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="flex items-center gap-4 mb-8"
                        >
                            <div className="h-[1px] w-10 bg-brand-green/30" />
                            <span className="text-brand-green font-black tracking-[0.5em] uppercase text-[9px]">
                                Catálogo Curado • Edición 2026
                            </span>
                        </motion.div>

                        <h2 className="text-6xl md:text-8xl font-black tracking-tightest leading-[0.85] text-brand-charcoal dark:text-brand-cream">
                            <motion.span
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="block"
                            >
                                Piezas Maestras
                            </motion.span>
                            <motion.span
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                                className="block text-brand-green italic font-light mt-2"
                            >
                                de Ingeniería Humana
                            </motion.span>
                        </h2>
                    </div>
                    <Link to="/catalog" className="group flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest border border-brand-charcoal/10 dark:border-white/10 px-10 py-6 rounded-full hover:bg-brand-green hover:border-brand-green hover:text-white transition-all duration-500">
                        Ver Selección Completa
                        <FontAwesomeIcon icon={faArrowRight} className="group-hover:translate-x-2 transition-transform" />
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[1, 2, 3].map(i => <div key={i} className="aspect-[3/4] bg-brand-charcoal/5 dark:bg-brand-cream/  5 rounded-[2rem] animate-pulse"></div>)}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-24">
                        {displayProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </section>

            {/* Minimalist CTA Banner */}
            <section className="py-40 bg-brand-charcoal">
                <div className="container mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="max-w-4xl mx-auto flex flex-col items-center gap-12"
                    >
                        <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-brand-green">Membresía Energy Elite</span>
                        <h2 className="text-5xl md:text-8xl font-bold tracking-tighter text-brand-cream leading-none italic">
                            El futuro no se espera, <br /> se diseña.
                        </h2>
                        <button className="bg-brand-cream text-brand-charcoal px-12 py-6 rounded-full font-bold uppercase text-[11px] tracking-widest hover:bg-brand-green hover:text-white transition-all shadow-2xl">
                            Unirse al Programa
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* WhatsApp Floating */}
            <motion.a
                href="https://wa.me/1234567890"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="fixed bottom-10 right-10 bg-brand-green text-brand-cream h-16 w-16 rounded-full flex items-center justify-center shadow-2xl z-50 transition-colors"
            >
                <FontAwesomeIcon icon={faWhatsapp} className="text-3xl" />
            </motion.a>
        </div>
    );
};

export default Home;
