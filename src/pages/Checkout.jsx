import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const Checkout = () => {
    const { cart, total } = useCart();

    if (cart.length === 0) {
        return (
            <div className="container mx-auto px-6 py-20 text-center">
                <h1 className="text-2xl font-bold mb-4 dark:text-white">Tu carrito está vacío</h1>
                <Link to="/catalog" className="inline-block bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700">Ir al Catálogo</Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6 py-12">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Finalizar Compra</h1>

            <div className="flex flex-col lg:flex-row gap-12">
                {/* Form */}
                <div className="w-full lg:w-2/3">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-xl font-semibold mb-6 dark:text-white">Información de Envío</h2>
                        <form className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre</label>
                                    <input type="text" className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-green-500 focus:border-green-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Apellido</label>
                                    <input type="text" className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-green-500 focus:border-green-500" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Correo Electrónico</label>
                                <input type="email" className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-green-500 focus:border-green-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Dirección</label>
                                <input type="text" className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-green-500 focus:border-green-500" />
                            </div>
                        </form>

                        <h2 className="text-xl font-semibold mt-8 mb-6 dark:text-white">Método de Pago</h2>
                        <div className="p-4 border dark:border-gray-600 rounded-lg text-center text-gray-500 dark:text-gray-400">
                            Mockup de Pago - Pago contra entrega / Integración con Stripe
                        </div>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="w-full lg:w-1/3">
                    <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 sticky top-24">
                        <h3 className="text-lg font-bold mb-4 dark:text-white">Resumen del Pedido</h3>
                        <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
                            {cart.map(item => (
                                <div key={item.id} className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400 break-words w-2/3">{item.nombre} x {item.quantity}</span>
                                    <span className="font-medium dark:text-gray-200">${(item.precio * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-between items-center mb-6">
                            <span className="font-bold text-lg dark:text-white">Total</span>
                            <span className="font-bold text-2xl text-green-600">${total.toFixed(2)}</span>
                        </div>
                        <button className="w-full bg-green-600 text-white py-4 rounded-full font-bold hover:bg-green-700 transition-colors shadow-lg">
                            Confirmar Pedido
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
