import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faBox, faSignOutAlt, faHome, faClipboardList, faUsers } from '@fortawesome/free-solid-svg-icons';

const AdminLayout = () => {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path ? "bg-green-50 dark:bg-gray-700 text-green-600" : "text-gray-600 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-gray-700 hover:text-green-600";
    };

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900 font-sans">
            {/* Barra Lateral */}
            <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300">
                <div className="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-700">
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">JaguarEco CRM</h1>
                </div>
                <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
                    <Link to="/admin" className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${isActive('/admin')}`}>
                        <FontAwesomeIcon icon={faChartLine} className="w-5" />
                        <span className="font-medium">Panel de Control</span>
                    </Link>
                    <Link to="/admin/orders" className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${isActive('/admin/orders')}`}>
                        <FontAwesomeIcon icon={faClipboardList} className="w-5" />
                        <span className="font-medium">Pedidos</span>
                    </Link>
                    <Link to="/admin/products" className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${isActive('/admin/products')}`}>
                        <FontAwesomeIcon icon={faBox} className="w-5" />
                        <span className="font-medium">Productos</span>
                    </Link>
                    <Link to="/admin/customers" className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${isActive('/admin/customers')}`}>
                        <FontAwesomeIcon icon={faUsers} className="w-5" />
                        <span className="font-medium">Clientes</span>
                    </Link>
                    <div className="my-4 border-t border-gray-100 dark:border-gray-700"></div>
                    <Link to="/" className="flex items-center space-x-3 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white p-3 rounded-lg transition-colors">
                        <FontAwesomeIcon icon={faHome} className="w-5" />
                        <span className="font-medium">Ver Tienda</span>
                    </Link>
                </nav>
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <button className="flex items-center space-x-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-3 rounded-lg w-full transition-colors group">
                        <FontAwesomeIcon icon={faSignOutAlt} className="group-hover:rotate-180 transition-transform duration-300" />
                        <span className="font-medium">Cerrar Sesión</span>
                    </button>
                </div>
            </div>

            {/* Contenido Principal */}
            <div className="flex-grow overflow-y-auto bg-gray-50 dark:bg-gray-900">
                <div className="p-8">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
