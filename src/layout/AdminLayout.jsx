import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faBox, faSignOutAlt, faHome } from '@fortawesome/free-solid-svg-icons';

const AdminLayout = () => {
    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
            {/* Sidebar */}
            <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
                <div className="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-700">
                    <h1 className="text-xl font-bold text-gray-800 dark:text-white">JaguarEco CRM</h1>
                </div>
                <nav className="flex-grow p-4 space-y-2">
                    <Link to="/admin" className="flex items-center space-x-3 text-gray-600 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-gray-700 hover:text-green-600 p-3 rounded-lg transition-colors">
                        <FontAwesomeIcon icon={faChartLine} />
                        <span>Dashboard</span>
                    </Link>
                    <Link to="/admin/products" className="flex items-center space-x-3 text-gray-600 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-gray-700 hover:text-green-600 p-3 rounded-lg transition-colors">
                        <FontAwesomeIcon icon={faBox} />
                        <span>Products</span>
                    </Link>
                    <Link to="/" className="flex items-center space-x-3 text-gray-600 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-gray-700 hover:text-green-600 p-3 rounded-lg transition-colors">
                        <FontAwesomeIcon icon={faHome} />
                        <span>View Store</span>
                    </Link>
                </nav>
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <button className="flex items-center space-x-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-3 rounded-lg w-full transition-colors">
                        <FontAwesomeIcon icon={faSignOutAlt} />
                        <span>Logout</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-grow overflow-y-auto">
                <div className="p-8">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
