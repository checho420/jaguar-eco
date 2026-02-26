import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import LoginModal from './LoginModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon, faShoppingCart, faUser, faSearch, faSignOutAlt, faChartLine, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { theme, toggleTheme } = useTheme();
    const { toggleCart, itemCount } = useCart();
    const { user, isAuthenticated, logout } = useAuth();
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [pastBanner, setPastBanner] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Check if we are on the Home page
    const isHome = location.pathname === '/';

    // Handle scroll effect for transparency and banner transition
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
            setPastBanner(window.scrollY > window.innerHeight - 100);
        };

        const handleAdminScroll = (e) => {
            setScrolled(e.detail.scrollTop > 50);
        };

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('admin-scroll', handleAdminScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('admin-scroll', handleAdminScroll);
        };
    }, []);

    // Close menu on route change
    useEffect(() => {
        setIsMenuOpen(false);
    }, [location]);

    // Dynamic Classes
    const isAdmin = location.pathname.startsWith('/admin');

    const navClasses = scrolled
        ? "fixed top-0 w-full z-[100] bg-white/70 dark:bg-[#0d0e12]/60 backdrop-blur-md border-b border-gray-200/20 dark:border-[#1e1f26] transition-all duration-300 shadow-sm"
        : (isHome || isAdmin)
            ? "fixed top-0 w-full z-[100] bg-transparent border-b border-transparent transition-all duration-300"
            : "sticky top-0 z-[100] bg-white dark:bg-[#0d0e12] border-b border-gray-100 dark:border-[#1e1f26] transition-all duration-300";

    // Dynamic Color Logic
    const isBannerArea = isHome && !pastBanner;
    const logoColorClass = isBannerArea ? "text-white" : "text-logo-energy-gold";
    const textClasses = isBannerArea
        ? "text-white hover:text-green-400"
        : "text-logo-energy-black dark:text-logo-energy-cream hover:text-green-600 dark:hover:text-green-400";
    const iconColorStyle = isBannerArea ? { color: '#FFFFFF' } : {};

    // Menu Drawer Variants
    const menuVariants = {
        hidden: {
            x: '100%',
            transition: {
                type: 'spring',
                stiffness: 400,
                damping: 40
            }
        },
        visible: {
            x: 0,
            transition: {
                type: 'spring',
                stiffness: 300,
                damping: 30,
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        },
        exit: {
            x: '100%',
            transition: {
                type: 'spring',
                stiffness: 400,
                damping: 40
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: 50 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { type: 'spring', stiffness: 300, damping: 25 }
        },
        exit: { opacity: 0, x: 20 }
    };

    const navItems = isAdmin
        ? [
            { label: 'Dashboard', path: '/admin' },
            { label: 'Pedidos', path: '/admin/orders' },
            { label: 'Productos', path: '/admin/products' },
            { label: 'Clientes', path: '/admin/customers' },
            { label: 'Volver a la Tienda', path: '/' }
        ]
        : [
            { label: 'Inicio', path: '/' },
            { label: 'Catálogo', path: '/catalog' },
            { label: 'Más Vendidos', path: '/bestsellers' },
            { label: 'Ofertas', path: '/sale' }
        ];

    return (
        <>
            <div className={navClasses}>
                <div className="container mx-auto px-6 py-6 flex justify-between items-center bg-transparent">
                    {/* Logo */}
                    <Link to="/" className="z-50 relative">
                        <motion.div
                            className="text-3xl md:text-4xl font-black tracking-tighter flex items-center group"
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                            <motion.span
                                className="font-sans font-bold relative inline-block uppercase"
                                style={{ color: isBannerArea ? '#FFFFFF' : '#C68E3F' }}
                                whileHover={{
                                    color: '#C68E3F',
                                    y: -4,
                                    skewX: -5,
                                    textShadow: "5px 5px 15px rgba(0,0,0,0.3), 0 0 15px rgba(198, 142, 63, 0.3)"
                                }}
                                transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
                            >
                                LOGO
                            </motion.span><motion.span
                                className="text-green-500 font-sans font-black italic inline-block"
                                initial={{ rotate: 0 }}
                                whileHover={{
                                    rotate: [0, -15, 15, -10, 10, 0],
                                    scale: 1.2,
                                    color: "#4ade80",
                                }}
                                transition={{
                                    rotate: { duration: 0.6, ease: "easeInOut" },
                                    scale: { type: "spring", stiffness: 300 }
                                }}
                            >
                                Energy
                            </motion.span>
                        </motion.div>
                    </Link>

                    {/* Icons */}
                    <div className="flex items-center space-x-8 z-50 relative">
                        {/* Search */}
                        <motion.button
                            whileHover={{ scale: 1.2, rotate: 15 }}
                            whileTap={{ scale: 0.9 }}
                            className={`${textClasses} text-2xl transition-colors hidden md:block`}
                        >
                            <FontAwesomeIcon icon={faSearch} />
                        </motion.button>

                        {/* Theme Toggle */}
                        <motion.button
                            whileHover={{ scale: 1.2, rotate: -15 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={toggleTheme}
                            style={iconColorStyle}
                            className={`${textClasses} text-2xl focus:outline-none transition-colors hidden md:block`}
                        >
                            <FontAwesomeIcon icon={theme === 'light' ? faMoon : faSun} />
                        </motion.button>

                        {/* Cart */}
                        <motion.button
                            whileHover={{ scale: 1.2, y: -5 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={toggleCart}
                            className={`relative ${textClasses} text-2xl transition-colors`}
                        >
                            <FontAwesomeIcon icon={faShoppingCart} />
                            {itemCount > 0 && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white dark:border-gray-900"
                                >
                                    {itemCount}
                                </motion.span>
                            )}
                        </motion.button>

                        {/* Login / User Profile */}
                        <div className="hidden md:block">
                            {isAuthenticated ? (
                                <div className="flex items-center gap-3">
                                    <Link to="/admin">
                                        <motion.img
                                            whileHover={{ scale: 1.15, ring: "2px solid #22c55e" }}
                                            src={user.avatar}
                                            alt="Profile"
                                            className="w-10 h-10 rounded-full border-2 border-green-500 p-0.5"
                                        />
                                    </Link>
                                    <motion.button
                                        whileHover={{ scale: 1.2, rotate: 10 }}
                                        onClick={() => { logout(); navigate('/'); }}
                                        className={`${textClasses} text-2xl hover:text-red-500`}
                                        title="Cerrar Sesión"
                                    >
                                        <FontAwesomeIcon icon={faSignOutAlt} />
                                    </motion.button>
                                </div>
                            ) : (
                                <motion.button
                                    whileHover={{ scale: 1.2, rotate: 15 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setIsLoginOpen(true)}
                                    className={`${textClasses} text-2xl transition-colors`}
                                    title="Entrar"
                                >
                                    <FontAwesomeIcon icon={faUser} />
                                </motion.button>
                            )}
                        </div>

                        {/* Mobile/Hamburger Menu Toggle */}
                        <motion.button
                            whileHover={{ scale: 1.1, color: "#C68E3F" }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className={`${textClasses} text-3xl focus:outline-none`}
                        >
                            <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Menu Drawer & Backdrop */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        key="nav-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsMenuOpen(false)}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200]"
                    />
                )}
                {isMenuOpen && (
                    <motion.div
                        key="nav-drawer"
                        variants={menuVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="fixed top-0 right-0 h-full w-full max-w-sm bg-white dark:bg-[#0d0e12] z-[210] p-10 pt-24 flex flex-col justify-start shadow-2xl"
                    >
                        {/* Close Button Inside Menu */}
                        <div className="absolute top-8 right-8 z-[220]">
                            <motion.button
                                whileHover={{ scale: 1.2, rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsMenuOpen(false);
                                }}
                                className="text-gray-400 hover:text-red-500 text-3xl focus:outline-none transition-colors p-2 cursor-pointer"
                            >
                                <FontAwesomeIcon icon={faTimes} />
                            </motion.button>
                        </div>

                        <div className="flex-grow">
                            <nav className="flex flex-col space-y-1">
                                {navItems.map((item) => (
                                    <motion.div key={item.path} variants={itemVariants}>
                                        <Link
                                            to={item.path}
                                            className="group relative inline-block text-4xl font-sans font-black text-gray-800 dark:text-white py-4 overflow-hidden tracking-tighter"
                                        >
                                            <span className="relative z-10 transition-colors duration-300 group-hover:text-green-500">
                                                {item.label}
                                            </span>
                                            <motion.span
                                                className="absolute bottom-4 left-0 w-0 h-1 bg-green-500 transition-all duration-300 group-hover:w-full"
                                                initial={false}
                                            />
                                        </Link>
                                    </motion.div>
                                ))}
                            </nav>

                            <motion.div
                                variants={itemVariants}
                                className="mt-12 pt-12 border-t border-gray-100 dark:border-gray-800 space-y-8"
                            >
                                <motion.button
                                    whileHover={{ x: 10 }}
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                        setIsLoginOpen(true);
                                    }}
                                    className="flex items-center gap-6 text-xl font-medium text-gray-600 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400 transition-colors"
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                                        <FontAwesomeIcon icon={faUser} />
                                    </div>
                                    <span>{isAuthenticated ? 'Mi Perfil' : 'Entrar'}</span>
                                </motion.button>

                                <motion.button
                                    whileHover={{ x: 10 }}
                                    onClick={toggleTheme}
                                    className="flex items-center gap-6 text-xl font-medium text-gray-600 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400 transition-colors"
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                                        <FontAwesomeIcon icon={theme === 'light' ? faMoon : faSun} />
                                    </div>
                                    <span>{theme === 'light' ? 'Modo Noche' : 'Modo Día'}</span>
                                </motion.button>
                            </motion.div>
                        </div>

                        <motion.div
                            variants={itemVariants}
                            className="text-left text-sm text-gray-400 tracking-widest uppercase font-medium"
                        >
                            <p>© 2026</p>
                            <p className="text-gray-900 dark:text-white mt-1">Arquitectura LOGO Energy</p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
        </>
    );
};

export default Navbar;

