import React from 'react';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faTrash, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const CartSidebar = () => {
    const { cart, isCartOpen, toggleCart, removeFromCart, updateQuantity, total } = useCart();

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        onClick={toggleCart}
                        className="fixed inset-0 bg-black z-40"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'tween', duration: 0.3 }}
                        className="fixed inset-y-0 right-0 w-full md:w-96 bg-white dark:bg-gray-900 shadow-xl z-50 flex flex-col"
                    >
                        <div className="p-6 flex justify-between items-center border-b border-gray-200 dark:border-gray-800">
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Carrito de Compras</h2>
                            <button onClick={toggleCart} className="text-gray-500 hover:text-red-500">
                                <FontAwesomeIcon icon={faTimes} size="lg" />
                            </button>
                        </div>

                        <div className="flex-grow overflow-y-auto p-6 space-y-6">
                            {cart.length === 0 ? (
                                <div className="text-center text-gray-500 mt-10">Tu carrito está vacío.</div>
                            ) : (
                                cart.map(item => (
                                    <div key={item.id} className="flex gap-4">
                                        <img src={item.imagenes[0]} alt={item.nombre} className="w-20 h-20 object-cover rounded-md border border-gray-100 dark:border-gray-700" />
                                        <div className="flex-grow">
                                            <h4 className="text-sm font-semibold text-gray-800 dark:text-white line-clamp-2 mb-1">{item.nombre}</h4>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">${item.precio}</p>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                                                    <button onClick={() => updateQuantity(item.id, -1)} className="p-1 px-2 text-gray-600 dark:text-gray-400 hover:text-green-600 transition-colors"><FontAwesomeIcon icon={faMinus} size="xs" /></button>
                                                    <span className="text-sm font-medium dark:text-white">{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item.id, 1)} className="p-1 px-2 text-gray-600 dark:text-gray-400 hover:text-green-600 transition-colors"><FontAwesomeIcon icon={faPlus} size="xs" /></button>
                                                </div>
                                                <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {cart.length > 0 && (
                            <div className="p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-gray-600 dark:text-gray-300">Total</span>
                                    <span className="text-2xl font-bold text-gray-900 dark:text-white">${total.toFixed(2)}</span>
                                </div>
                                <Link to="/checkout" onClick={toggleCart} className="block w-full text-center bg-green-600 text-white py-3 rounded-full font-bold hover:bg-green-700 transition-colors shadow-lg">
                                    Finalizar Compra
                                </Link>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CartSidebar;
