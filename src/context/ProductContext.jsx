import React, { createContext, useContext, useState, useEffect } from 'react';
import productsData from '../data/products.json';

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate API call
        const fetchProducts = async () => {
            setLoading(true);
            try {
                // In a real app, we would fetch from Firebase here
                // Using mock data
                await new Promise(resolve => setTimeout(resolve, 500)); // Mock network delay
                setProducts(productsData);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const getProductById = (id) => {
        return products.find(p => p.id === parseInt(id));
    };

    const getProductsByCategory = (category) => {
        return products.filter(p => p.categoria === category);
    };

    // CRUD Operations
    const addProduct = async (newProduct) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 300));
        const id = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        const productToAdd = { ...newProduct, id, disabled: false, stock: parseInt(newProduct.stock) || 0, sold: 0 };
        setProducts(prev => [productToAdd, ...prev]);
        return productToAdd;
    };

    const updateProduct = async (id, updatedData) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 300));
        setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedData } : p));
    };

    const deleteProduct = async (id) => {
        // Soft delete logic
        await new Promise(resolve => setTimeout(resolve, 300));
        setProducts(prev => prev.map(p => p.id === id ? { ...p, disabled: true } : p));
    };

    return (
        <ProductContext.Provider value={{
            products,
            loading,
            getProductById,
            getProductsByCategory,
            addProduct,
            updateProduct,
            deleteProduct
        }}>
            {children}
        </ProductContext.Provider>
    );
};
