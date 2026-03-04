import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CartSidebar from '../components/CartSidebar';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col bg-brand-cream dark:bg-brand-charcoal transition-colors duration-1000 font-sans">
            <Navbar />
            <CartSidebar />
            <main className="flex-grow">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;

