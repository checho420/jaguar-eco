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
            // Consider past banner when we scroll past 80% of window height or similar
            setPastBanner(window.scrollY > window.innerHeight - 100);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close menu on route change
    useEffect(() => {
        setIsMenuOpen(false);
    }, [location]);

    // Dynamic Classes
    const navClasses = scrolled
        ? "fixed top-0 w-full z-50 bg-white/10 dark:bg-black/20 backdrop-blur-md border-b border-gray-200/20 dark:border-gray-700/20 transition-all duration-300"
        : isHome
            ? "fixed top-0 w-full z-50 bg-transparent border-b border-transparent transition-all duration-300"
            : "sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 transition-all duration-300";

    const textClasses = isHome && !scrolled
        ? "text-white hover:text-green-400"
        : "text-gray-800 dark:text-gray-100 hover:text-green-600 dark:hover:text-green-400";

    const logoClasses = isHome && !scrolled
        ? "text-white"
        : "text-gray-900 dark:text-white";

    const jaguarColorClass = isHome
        ? (pastBanner ? "text-blue-600 dark:text-blue-400" : "text-white")
        : "text-blue-600 dark:text-blue-400";

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

    const navItems = [
        { label: 'Home', path: '/' },
        { label: 'Catalog', path: '/catalog' },
        { label: 'Bestsellers', path: '/bestsellers' },
        { label: 'Sale', path: '/sale' }
    ];

    return (
        <>
            <div className={navClasses}>
                <div className="container mx-auto px-8 py-6 flex justify-between items-center bg-transparent">
                    {/* Logo */}
                    <Link to="/" className="z-50 relative">
                        <motion.div
                            className={`text-3xl font-bold tracking-tight font-serif flex items-center`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                            <span className={jaguarColorClass}>Jaguar</span>
                            <motion.span
                                className="text-green-500 italic ml-1 inline-block"
                                animate={{ rotate: [0, 0, 0] }}
                                whileHover={{
                                    rotate: [0, -10, 10, -5, 5, 0],
                                    transition: { duration: 0.5 }
                                }}
                            >
                                Eco
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
                                        title="Logout"
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
                                >
                                    <FontAwesomeIcon icon={faUser} />
                                </motion.button>
                            )}
                        </div>

                        {/* Mobile/Hamburger Menu Toggle */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className={`${textClasses} text-3xl focus:outline-none`}
                        >
                            <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Drawer */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMenuOpen(false)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-md z-40"
                        />
                        <motion.div
                            variants={menuVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="fixed top-0 right-0 h-full w-full max-w-sm bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-[-20px_0_50px_rgba(0,0,0,0.1)] z-50 p-10 pt-24 flex flex-col justify-start"
                        >
                            {/* Close Button */}
                            <div className="absolute top-8 right-8">
                                <motion.button
                                    whileHover={{ scale: 1.2, rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="text-gray-400 hover:text-red-500 text-3xl focus:outline-none transition-colors p-2"
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
                                                className="group relative inline-block text-4xl font-serif font-bold text-gray-800 dark:text-white py-4 overflow-hidden"
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
                                        onClick={() => setIsLoginOpen(true)}
                                        className="flex items-center gap-6 text-xl font-medium text-gray-600 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400 transition-colors"
                                    >
                                        <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                                            <FontAwesomeIcon icon={faUser} />
                                        </div>
                                        <span>{isAuthenticated ? 'My Profile' : 'Sign In'}</span>
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ x: 10 }}
                                        onClick={toggleTheme}
                                        className="flex items-center gap-6 text-xl font-medium text-gray-600 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400 transition-colors"
                                    >
                                        <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                                            <FontAwesomeIcon icon={theme === 'light' ? faMoon : faSun} />
                                        </div>
                                        <span>{theme === 'light' ? 'Nights Mode' : 'Days Mode'}</span>
                                    </motion.button>
                                </motion.div>
                            </div>

                            <motion.div
                                variants={itemVariants}
                                className="text-left text-sm text-gray-400 tracking-widest uppercase font-medium"
                            >
                                <p>© 2026</p>
                                <p className="text-gray-900 dark:text-white mt-1">Jaguar Eco Architecture</p>
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
        </>
    );
};

export default Navbar;
