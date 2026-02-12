import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
    return (
        <footer className="bg-white/70 dark:bg-[#0d0e12]/60 backdrop-blur-md border-t border-gray-200/20 dark:border-[#1e1f26]/20 transition-all duration-500">
            <div className="container mx-auto px-6 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <h3 className="text-xl md:text-2xl font-bold">
                            <span className="text-jaguar-gold">Jaguar</span><span className="text-green-500 italic">Eco</span>
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-jaguar-cream/60">Lujo sostenible para todos.</p>
                    </div>
                    <div className="flex space-x-4 mb-4 md:mb-0">
                        {/* Socials Placeholder */}
                        <a href="#" className="text-gray-500 hover:text-green-600 dark:hover:text-green-400"><FontAwesomeIcon icon={faFacebook} /></a>
                        <a href="#" className="text-gray-500 hover:text-green-600 dark:hover:text-green-400"><FontAwesomeIcon icon={faInstagram} /></a>
                        <a href="#" className="text-gray-500 hover:text-green-600 dark:hover:text-green-400"><FontAwesomeIcon icon={faTwitter} /></a>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-jaguar-cream/40">
                        &copy; 2026 <span className="text-jaguar-gold">JaguarEco</span>. Todos los derechos reservados.
                    </div>
                </div>
            </div>
        </footer>
    )
}
export default Footer;
