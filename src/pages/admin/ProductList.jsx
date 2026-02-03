import React, { useState } from 'react';
import { useProducts } from '../../context/ProductContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faSearch, faFilter } from '@fortawesome/free-solid-svg-icons';

const ProductList = () => {
    const { products, loading } = useProducts();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');

    // Get unique categories
    const categories = ['All', ...new Set(products.map(p => p.categoria))];

    // Filter Logic
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.marca.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'All' || product.categoria === filterCategory;
        return matchesSearch && matchesCategory;
    });

    const handleEdit = (id) => alert(`Edit Module for ID: ${id} coming soon!`);
    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            alert('Delete API call would happen here.');
        }
    };

    if (loading) return <div className="p-10 text-center">Loading Inventory...</div>;

    return (
        <div className="space-y-6">
            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Product Inventory</h1>
                <button className="bg-green-600 text-white px-6 py-2.5 rounded-xl hover:bg-green-700 flex items-center gap-2 shadow-lg hover:shadow-green-500/30 transition-all">
                    <FontAwesomeIcon icon={faPlus} />
                    Add Product
                </button>
            </div>

            {/* Filters Bar */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-4 justify-between">
                <div className="relative flex-grow max-w-md">
                    <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search products, brands..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border-none outline-none dark:text-white focus:ring-2 focus:ring-green-500 transition-all"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faFilter} className="text-gray-400" />
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-2 px-4 rounded-lg outline-none cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="p-5 font-semibold">Product info</th>
                                <th className="p-5 font-semibold">Category</th>
                                <th className="p-5 font-semibold">Price</th>
                                <th className="p-5 font-semibold">Stock</th>
                                <th className="p-5 font-semibold">Status</th>
                                <th className="p-5 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700 text-sm">
                            {filteredProducts.map(product => (
                                <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors group">
                                    <td className="p-5">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-lg bg-white p-1 border dark:border-gray-600 flex-shrink-0">
                                                <img src={product.imagenes[0]} alt="" className="w-full h-full object-cover rounded-md" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-800 dark:text-gray-200 line-clamp-1">{product.nombre}</div>
                                                <div className="text-xs text-gray-500">{product.marca}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-5 text-gray-600 dark:text-gray-400">
                                        <span className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                                            {product.categoria}
                                        </span>
                                    </td>
                                    <td className="p-5 font-semibold text-gray-700 dark:text-gray-200">${product.precio}</td>
                                    <td className="p-5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full ${product.stock < 20 ? 'bg-red-500' : 'bg-green-500'}`}
                                                    style={{ width: `${Math.min(product.stock, 100)}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-xs text-gray-500">{product.stock}</span>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        {product.stock < 10 ? (
                                            <span className="text-red-600 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded text-xs font-bold">Low Stock</span>
                                        ) : (
                                            <span className="text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded text-xs font-bold">Active</span>
                                        )}
                                    </td>
                                    <td className="p-5 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleEdit(product.id)} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors">
                                                <FontAwesomeIcon icon={faEdit} />
                                            </button>
                                            <button onClick={() => handleDelete(product.id)} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Pagination (Mock) */}
                <div className="p-4 border-t border-gray-100 dark:border-gray-700 text-center text-xs text-gray-500">
                    Showing {filteredProducts.length} items
                </div>
            </div>
        </div>
    );
};

export default ProductList;
