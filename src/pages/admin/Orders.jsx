import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter, faEye, faCheckCircle, faTimesCircle, faClock } from '@fortawesome/free-solid-svg-icons';

const Orders = () => {
    const { orders, loading } = useAdmin();
    const [statusFilter, setStatusFilter] = useState('Todos');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);

    const filteredOrders = orders.filter(order => {
        const matchesStatus = statusFilter === 'Todos' || order.status.toLowerCase() === statusFilter.toLowerCase();
        const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    if (loading) return <div className="p-10 text-center animate-pulse">Cargando Pedidos...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Gestión de Pedidos</h1>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-4 justify-between">
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                    {['Todos', 'Pendiente', 'Entregado', 'Cancelado'].map(status => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${statusFilter === status
                                    ? 'bg-green-600 text-white shadow-lg shadow-green-500/30'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
                <div className="relative w-full md:w-64">
                    <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar pedido o cliente..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border-none outline-none dark:text-white focus:ring-2 focus:ring-green-500 transition-all"
                    />
                </div>
            </div>

            {/* Orders List */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="p-5 font-semibold">ID Orden</th>
                                <th className="p-5 font-semibold">Fecha</th>
                                <th className="p-5 font-semibold">Cliente</th>
                                <th className="p-5 font-semibold">Estado</th>
                                <th className="p-5 font-semibold">Total</th>
                                <th className="p-5 font-semibold text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700 text-sm">
                            {filteredOrders.map(order => (
                                <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                    <td className="p-5 font-bold text-gray-800 dark:text-white">#{order.id}</td>
                                    <td className="p-5 text-gray-500">{order.date}</td>
                                    <td className="p-5 font-medium text-gray-700 dark:text-gray-300">{order.customerName}</td>
                                    <td className="p-5">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${order.status === 'entregado' ? 'bg-green-50 text-green-600 border-green-100' :
                                                order.status === 'pendiente' ? 'bg-yellow-50 text-yellow-600 border-yellow-100' :
                                                    'bg-red-50 text-red-600 border-red-100'
                                            }`}>
                                            {order.status === 'entregado' && <FontAwesomeIcon icon={faCheckCircle} />}
                                            {order.status === 'pendiente' && <FontAwesomeIcon icon={faClock} />}
                                            {order.status === 'cancelado' && <FontAwesomeIcon icon={faTimesCircle} />}
                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="p-5 font-bold text-gray-800 dark:text-white">${order.total}</td>
                                    <td className="p-5 text-right">
                                        <button
                                            onClick={() => setSelectedOrder(order)}
                                            className="text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 p-2 rounded-lg transition-colors"
                                        >
                                            <FontAwesomeIcon icon={faEye} /> Ver Detalles
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Detalle de Orden #{selectedOrder.id}</h2>
                            <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-red-500 transition-colors">
                                <FontAwesomeIcon icon={faTimesCircle} className="text-xl" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase">Fecha</p>
                                    <p className="font-medium dark:text-white">{selectedOrder.date}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase">Estado</p>
                                    <p className={`font-bold ${selectedOrder.status === 'entregado' ? 'text-green-500' :
                                            selectedOrder.status === 'pendiente' ? 'text-yellow-500' : 'text-red-500'
                                        }`}>
                                        {selectedOrder.status.toUpperCase()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase">Cliente</p>
                                    <p className="font-medium dark:text-white">{selectedOrder.customerName}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase">Total</p>
                                    <p className="font-bold text-xl text-green-600">${selectedOrder.total}</p>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
                                <h3 className="font-bold mb-2 dark:text-white">Historial de Seguimiento</h3>
                                <div className="space-y-3 relative pl-4 border-l-2 border-gray-200 dark:border-gray-700 ml-2">
                                    <div className="relative">
                                        <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-green-500 ring-4 ring-white dark:ring-gray-800"></div>
                                        <p className="text-sm font-medium dark:text-white">Pedido Realizado</p>
                                        <p className="text-xs text-gray-500">{selectedOrder.date} 10:00 AM</p>
                                    </div>
                                    <div className="relative">
                                        <div className={`absolute -left-[21px] top-1 h-3 w-3 rounded-full ring-4 ring-white dark:ring-gray-800 ${selectedOrder.status !== 'pendiente' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                        <p className="text-sm font-medium dark:text-white">Pago Confirmado</p>
                                        <p className="text-xs text-gray-500">{selectedOrder.date} 10:30 AM</p>
                                    </div>
                                    <div className="relative">
                                        <div className={`absolute -left-[21px] top-1 h-3 w-3 rounded-full ring-4 ring-white dark:ring-gray-800 ${selectedOrder.status === 'entregado' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                        <p className="text-sm font-medium dark:text-white">Entregado</p>
                                        <p className="text-xs text-gray-500">{selectedOrder.status === 'entregado' ? 'Fecha de entrega' : 'Pendiente'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-gray-900/50 text-center">
                            <button onClick={() => setSelectedOrder(null)} className="text-sm text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white">Cerrar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Orders;
