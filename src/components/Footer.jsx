import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
    return (
        <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
            <div className="container mx-auto px-6 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white">JaguarEco</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Sustainable luxury for everyone.</p>
                    </div>
                    <div className="flex space-x-4 mb-4 md:mb-0">
                        {/* Socials Placeholder */}
                        <a href="#" className="text-gray-500 hover:text-green-600 dark:hover:text-green-400"><FontAwesomeIcon icon={faFacebook} /></a>
                        <a href="#" className="text-gray-500 hover:text-green-600 dark:hover:text-green-400"><FontAwesomeIcon icon={faInstagram} /></a>
                        <a href="#" className="text-gray-500 hover:text-green-600 dark:hover:text-green-400"><FontAwesomeIcon icon={faTwitter} /></a>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        &copy; 2026 JaguarEco. All rights reserved.
                    </div>
                </div>
            </div>
        </footer>
    )
}
export default Footer;
