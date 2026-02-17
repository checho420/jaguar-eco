import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

import banner1 from '../assets/banner/banner1.jpg';
import banner2 from '../assets/banner/banner2.png';
import banner3 from '../assets/banner/banner3.png';
import banner4 from '../assets/banner/banner4.jpg';

const images = [
    {
        src: banner1,
        title: "Sostenibilidad",
        subtitle: "Energía limpia para un futuro mejor"
    },
    {
        src: banner2,
        title: "Innovación",
        subtitle: "Soluciones solares a tu alcance"
    },
    {
        src: banner3,
        title: "Ecomovilidad",
        subtitle: "Transporte eficiente y ecológico"
    },
    {
        src: banner4,
        title: "Comunidad",
        subtitle: "Unidos por un planeta más verde"
    }
];

const Hero = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    const nextSlide = useCallback(() => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % images.length);
    }, []);

    const prevSlide = useCallback(() => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    }, []);

    useEffect(() => {
        const timer = setInterval(nextSlide, 7000);
        return () => clearInterval(timer);
    }, [nextSlide]);

    const variants = {
        enter: (direction) => ({
            scale: 1.05,
            opacity: 0,
            filter: 'blur(15px)',
            zIndex: 0
        }),
        center: {
            x: 0,
            opacity: 1,
            scale: 1.02, // Base scale for Ken Burns start
            filter: 'blur(0px)',
            zIndex: 1,
            transition: {
                opacity: { duration: 1.2, ease: "easeOut" },
                filter: { duration: 1.5, ease: "easeOut" },
                scale: { duration: 15, ease: "linear" } // Persistent Ken Burns
            }
        },
        exit: {
            zIndex: 0,
            opacity: 0,
            scale: 0.98,
            filter: 'blur(20px)',
            transition: {
                opacity: { duration: 0.8 },
                filter: { duration: 0.8 },
                scale: { duration: 0.8 }
            }
        }
    };

    return (
        <div className="relative bg-black text-white overflow-hidden h-[75svh] md:h-screen min-h-[500px] flex flex-col justify-center items-center">
            {/* Background Carousel */}
            <div className="absolute inset-0 z-0">
                <AnimatePresence initial={false} custom={direction}>
                    <motion.div
                        key={currentIndex}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className="absolute inset-0"
                    >
                        <img
                            src={images[currentIndex].src}
                            alt={images[currentIndex].title}
                            className="w-full h-full object-cover object-center transition-all duration-1000 ease-in-out"
                        />
                        {/* Ken Burns Scale animation is handled in variants.center */}
                    </motion.div>
                </AnimatePresence>

                {/* Gradient Overlays - Optimized for mobile readability and image visibility */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/80 z-10"></div>
                <div className="absolute inset-0 bg-black/20 z-10 md:bg-black/10"></div>
            </div>

            {/* Content Container */}
            <div className="container mx-auto px-6 relative z-20 text-center mb-32 md:mb-0">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="max-w-4xl mx-auto"
                    >
                        <h1 className="text-4xl sm:text-6xl md:text-8xl font-black mb-6 tracking-tighter uppercase italic drop-shadow-2xl flex flex-wrap justify-center overflow-hidden">
                            {images[currentIndex].title.split('').map((char, i) => (
                                <motion.span
                                    key={i}
                                    initial={{ y: "100%", opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{
                                        delay: i * 0.04,
                                        type: "spring",
                                        stiffness: 100,
                                        damping: 10
                                    }}
                                    className="inline-block"
                                >
                                    {char === ' ' ? '\u00A0' : char}
                                </motion.span>
                            ))}
                        </h1>
                        <div className="overflow-hidden">
                            <motion.p
                                initial={{ y: "120%", opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.8, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                                className="text-lg sm:text-xl md:text-2xl font-light tracking-[0.2em] md:tracking-[0.5em] text-green-400 uppercase drop-shadow-lg"
                            >
                                {images[currentIndex].subtitle}
                            </motion.p>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation Arrows - Simplified for mobile */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2 md:px-10 z-30 pointer-events-none">
                <button
                    onClick={prevSlide}
                    className="p-3 md:p-4 rounded-full bg-white/5 hover:bg-white/20 backdrop-blur-md transition-all pointer-events-auto group"
                    aria-label="Previous slide"
                >
                    <FontAwesomeIcon icon={faChevronLeft} className="text-white text-base md:text-xl group-hover:-translate-x-1 transition-transform" />
                </button>
                <button
                    onClick={nextSlide}
                    className="p-3 md:p-4 rounded-full bg-white/5 hover:bg-white/20 backdrop-blur-md transition-all pointer-events-auto group"
                    aria-label="Next slide"
                >
                    <FontAwesomeIcon icon={faChevronRight} className="text-white text-base md:text-xl group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            {/* Indicators (Dots) */}
            <div className="absolute bottom-8 md:bottom-10 left-1/2 -translate-x-1/2 flex space-x-3 z-30">
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            setDirection(index > currentIndex ? 1 : -1);
                            setCurrentIndex(index);
                        }}
                        className={`group relative h-1 transition-all duration-500 ${index === currentIndex ? 'w-10 md:w-12 bg-logo-energy-gold' : 'w-4 md:w-6 bg-white/30 hover:bg-white/60'}`}
                    >
                        <span className="absolute -inset-2 block pointer-events-auto"></span>
                    </button>
                ))}
            </div>

            {/* Modern Animated Brand Logo */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 1 }}
                className="absolute bottom-24 md:bottom-32 z-30 w-full flex justify-center pointer-events-none"
            >
                <motion.div
                    className="text-5xl md:text-7xl font-black tracking-tighter flex items-center group pointer-events-auto cursor-default"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                    <motion.span
                        className="font-sans font-bold text-white relative inline-block uppercase tracking-tighter"
                        whileHover={{
                            color: '#C68E3F',
                            y: -8,
                            skewX: -5,
                            textShadow: "10px 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(198, 142, 63, 0.4)"
                        }}
                        transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
                    >
                        LOGO
                    </motion.span>
                    <motion.span
                        className="text-green-500 font-sans font-black italic inline-block tracking-tighter"
                        initial={{ rotate: 0 }}
                        whileHover={{
                            rotate: [0, -15, 15, -10, 10, 0],
                            scale: 1.3,
                            color: "#4ade80",
                            textShadow: "0 0 20px rgba(34, 197, 94, 0.4)"
                        }}
                        transition={{
                            rotate: { duration: 0.6, ease: "easeInOut" },
                            scale: { type: "spring", stiffness: 300 }
                        }}
                    >
                        Energy
                    </motion.span>
                </motion.div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
                className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 text-white/50 flex flex-col items-center pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
            >
                <div className="w-[1px] h-6 md:h-10 bg-gradient-to-b from-logo-energy-gold to-transparent"></div>
            </motion.div>
        </div>
    );
};

export default Hero;

