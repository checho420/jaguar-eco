import React from 'react';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import { Link, useNavigate } from 'react-router-dom';
import { formatCurrency } from '../utils/formatters';

const Checkout = () => {
    const { cart, total, clearCart } = useCart();
    const { updateProduct, getProductById } = useProducts();
    const navigate = useNavigate();

    const handleConfirmOrder = async (e) => {
        e.preventDefault();

        if (window.confirm(`¿Confirmar pedido por un total de ${formatCurrency(total)}?`)) {
            try {
                // Process each item to update stock and sold count
                for (const item of cart) {
                    const product = getProductById(item.id);
                    if (product) {
                        const newStock = Math.max(0, (product.stock || 0) - item.quantity);
                        const newSold = (product.sold || 0) + item.quantity;
                        await updateProduct(item.id, { stock: newStock, sold: newSold });
                    }
                }

                alert('¡Pedido realizado con éxito! Gracias por tu compra.');
                clearCart();
                navigate('/');
            } catch (error) {
                console.error("Error processing order:", error);
                alert('Hubo un error al procesar tu pedido. Inténtalo de nuevo.');
            }
        }
    };

    if (cart.length === 0) {
        return (
            <div className="container mx-auto px-6 py-20 text-center animate-fade-in">
                <div className="bg-green-50 dark:bg-green-900/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-12 h-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                </div>
                <h1 className="text-3xl font-bold mb-4 dark:text-white">Tu carrito está vacío</h1>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">Parece que aún no has añadido productos. Explora nuestro catálogo y encuentra las mejores soluciones en energía solar.</p>
                <Link to="/catalog" className="inline-block bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 hover:shadow-lg hover:shadow-green-500/30 transition-all transform hover:-translate-y-1">
                    Volver al Catálogo
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6 py-12 animate-fade-in">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">Finalizar Compra</h1>

            <div className="flex flex-col lg:flex-row gap-12">
                {/* Form */}
                <div className="w-full lg:w-2/3">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700">
                        <h2 className="text-xl font-bold mb-6 dark:text-white flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center text-sm">1</span>
                            Información de Envío
                        </h2>
                        <form className="space-y-4" onSubmit={handleConfirmOrder}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre</label>
                                    <input type="text" required className="w-full rounded-xl border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 transition-all p-3" placeholder="Tu nombre" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Apellido</label>
                                    <input type="text" required className="w-full rounded-xl border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 transition-all p-3" placeholder="Tu apellido" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Correo Electrónico</label>
                                <input type="email" required className="w-full rounded-xl border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 transition-all p-3" placeholder="ejemplo@correo.com" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Dirección de Entrega</label>
                                <input type="text" required className="w-full rounded-xl border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 transition-all p-3" placeholder="Calle, Número, Colonia, Ciudad" />
                            </div>
                        </form>

                        <h2 className="text-xl font-bold mt-8 mb-6 dark:text-white flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center text-sm">2</span>
                            Método de Pago
                        </h2>
                        <div className="p-6 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-xl text-center bg-gray-50 dark:bg-gray-700/30">
                            <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">Selecciona un método de pago seguro</p>
                            <div className="flex justify-center gap-4 mt-4 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
                                <span className="font-bold text-blue-600 text-xl">VISA</span>
                                <span className="font-bold text-red-500 text-xl">Mastercard</span>
                                <span className="font-bold text-blue-400 text-xl">PayPal</span>
                            </div>
                            <p className="text-xs text-gray-400 mt-4">(Simulación: El pago se procesará como exitoso)</p>
                        </div>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="w-full lg:w-1/3">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 sticky top-24">
                        <h3 className="text-lg font-bold mb-6 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-4">Resumen del Pedido</h3>
                        <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                            {cart.map(item => (
                                <div key={item.id} className="flex gap-4 items-start">
                                    <img src={item.images[0]} alt={item.name} className="w-16 h-16 rounded-lg object-cover bg-gray-100" />
                                    <div className="flex-grow">
                                        <p className="text-sm font-medium text-gray-800 dark:text-white line-clamp-2">{item.name}</p>
                                        <div className="flex justify-between items-center mt-1">
                                            <span className="text-xs text-gray-500">Cant: {item.quantity}</span>
                                            <span className="text-sm font-bold text-gray-700 dark:text-gray-200">{formatCurrency(item.price * item.quantity)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-gray-100 dark:border-gray-700 pt-4 space-y-2 mb-6">
                            <div className="flex justify-between text-gray-500 text-sm">
                                <span>Subtotal</span>
                                <span>{formatCurrency(total)}</span>
                            </div>
                            <div className="flex justify-between text-gray-500 text-sm">
                                <span>Envío</span>
                                <span className="text-green-600">Gratis</span>
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-gray-700 mt-2">
                                <span className="font-bold text-lg dark:text-white">Total a Pagar</span>
                                <span className="font-bold text-2xl text-green-600">{formatCurrency(total)}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleConfirmOrder}
                            className="w-full bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-700 transition-all shadow-xl shadow-green-500/20 active:scale-95 flex items-center justify-center gap-2 group"
                        >
                            <span>Confirmar Pedido</span>
                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </button>

                        <p className="text-xs text-center text-gray-400 mt-4 flex items-center justify-center gap-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                            </svg>
                            Pago 100% Seguro y Encriptado
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;

