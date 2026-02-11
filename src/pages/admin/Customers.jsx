import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUser, faEnvelope, faPhone, faHistory, faHeart, faEye } from '@fortawesome/free-solid-svg-icons';

const Customers = () => {
    const { customers, loading } = useAdmin();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCustomers = customers.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-10 text-center animate-pulse">Cargando Clientes...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Gestión de Clientes</h1>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-4 justify-between">
                <div className="relative w-full md:w-96">
                    <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre o email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border-none outline-none dark:text-white focus:ring-2 focus:ring-green-500 transition-all"
                    />
                </div>
                <div className="flex gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div> Activo
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div> VIP
                    </div>
                </div>
            </div>

            {/* Customers Grid/List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCustomers.map(customer => (
                    <div key={customer.id} className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300 group relative overflow-hidden">
                        {/* Status Badge */}
                        <div className={`absolute top-4 right-4 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider ${customer.status === 'vip' ? 'bg-yellow-100 text-yellow-600' :
                                customer.status === 'active' || customer.status === 'pro' ? 'bg-green-100 text-green-600' :
                                    'bg-gray-100 text-gray-400'
                            }`}>
                            {customer.status}
                        </div>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-green-500/30">
                                {customer.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-gray-800 dark:text-white">{customer.name}</h3>
                                <div className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-2">
                                    <FontAwesomeIcon icon={faUser} className="text-xs" /> ID: {customer.id}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300 text-sm">
                                <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-gray-400">
                                    <FontAwesomeIcon icon={faEnvelope} />
                                </div>
                                <span className="truncate">{customer.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300 text-sm">
                                <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-gray-400">
                                    <FontAwesomeIcon icon={faPhone} />
                                </div>
                                <span>{customer.phone}</span>
                            </div>
                        </div>

                        {/* Metrics */}
                        <div className="grid grid-cols-3 gap-2 border-t border-gray-100 dark:border-gray-700 pt-4 text-center">
                            <div>
                                <p className="text-xs text-gray-400 uppercase tracking-tighter">Compras</p>
                                <p className="font-bold text-gray-800 dark:text-white text-lg">{customer.purchaseCount}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase tracking-tighter">Total</p>
                                <p className="font-bold text-green-600 text-lg">${customer.totalSpent}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase tracking-tighter">Ultima</p>
                                <p className="font-bold text-gray-800 dark:text-white text-xs mt-1">{customer.lastPurchaseDate}</p>
                            </div>
                        </div>

                        {/* Engagement Metrics (Mock) */}
                        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-50 dark:border-gray-700/50">
                            <div className="flex items-center gap-1 text-xs text-gray-400" title="Productos visitados (Mock)">
                                <FontAwesomeIcon icon={faEye} /> 124
                            </div>
                            <div className="flex items-center gap-1 text-xs text-red-400" title="Likes (Mock)">
                                <FontAwesomeIcon icon={faHeart} /> 12
                            </div>
                            <div className="flex items-center gap-1 text-xs text-blue-400" title="Frecuencia (Mock)">
                                <FontAwesomeIcon icon={faHistory} /> Alta
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Customers;
