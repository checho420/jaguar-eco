import React, { useState, useEffect } from 'react';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';
import { motion } from 'framer-motion';

const Catalog = () => {
    const { products, loading } = useProducts();
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedBrand, setSelectedBrand] = useState('All');

    // Extract unique categories and brands
    const categories = ['All', ...new Set(products.map(p => p.categoria))];
    const brands = ['All', ...new Set(products.map(p => p.marca))];

    useEffect(() => {
        let result = products;
        if (selectedCategory !== 'All') {
            result = result.filter(p => p.categoria === selectedCategory);
        }
        if (selectedBrand !== 'All') {
            result = result.filter(p => p.marca === selectedBrand);
        }
        setFilteredProducts(result);
    }, [products, selectedCategory, selectedBrand]);

    return (
        <div className="container mx-auto px-6 py-12">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-8">Catalog</h1>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Filters Sidebar */}
                <div className="w-full md:w-1/4">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 sticky top-24">
                        <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">Filters</h3>

                        {/* Category Filter */}
                        <div className="mb-6">
                            <h4 className="font-semibold mb-2 text-gray-700 dark:text-gray-300">Category</h4>
                            <div className="space-y-2">
                                {categories.map(cat => (
                                    <label key={cat} className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="category"
                                            checked={selectedCategory === cat}
                                            onChange={() => setSelectedCategory(cat)}
                                            className="form-radio text-green-600 rounded focus:ring-green-500 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                                        />
                                        <span className="text-gray-600 dark:text-gray-400 hover:text-green-600 transition-colors">{cat}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Brand Filter */}
                        <div>
                            <h4 className="font-semibold mb-2 text-gray-700 dark:text-gray-300">Brand</h4>
                            <div className="space-y-2">
                                {brands.map(brand => (
                                    <label key={brand} className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="brand"
                                            checked={selectedBrand === brand}
                                            onChange={() => setSelectedBrand(brand)}
                                            className="form-radio text-green-600 rounded focus:ring-green-500 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                                        />
                                        <span className="text-gray-600 dark:text-gray-400 hover:text-green-600 transition-colors">{brand}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Grid */}
                <div className="w-full md:w-3/4">
                    {loading ? (
                        <div className="text-center py-20 dark:text-white">Loading products...</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                            {filteredProducts.length === 0 && (
                                <div className="col-span-3 text-center py-20 text-gray-500 dark:text-gray-400">No products found matching your filters.</div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Catalog;
