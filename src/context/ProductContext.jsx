import React, { createContext, useContext, useState, useEffect } from 'react';
import productsData from '../data/products.json';

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Initial Load
    useEffect(() => {
        const initProducts = () => {
            setLoading(true);
            try {
                const savedProducts = localStorage.getItem('jaguar_products');
                if (savedProducts && JSON.parse(savedProducts).length > 0) {
                    setProducts(JSON.parse(savedProducts));
                } else {
                    // Fallback to static JSON if nothing in localStorage
                    setProducts(productsData);
                    localStorage.setItem('jaguar_products', JSON.stringify(productsData));
                }
            } catch (error) {
                console.error("Error initializing products:", error);
                setProducts(productsData);
            } finally {
                setLoading(false);
            }
        };

        initProducts();
    }, []);

    // Persistence Effect: Save to localStorage whenever products state changes
    useEffect(() => {
        if (!loading) {
            localStorage.setItem('jaguar_products', JSON.stringify(products));
        }
    }, [products, loading]);

    const getProductById = (id) => {
        return products.find(p => p.id === parseInt(id));
    };

    const getProductsByCategory = (category) => {
        return products.filter(p => p.categoria === category);
    };

    // CRUD Operations
    const addProduct = async (newProduct) => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        const id = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        const productToAdd = {
            ...newProduct,
            id,
            disabled: false,
            stock: parseInt(newProduct.stock) || 0,
            sold: 0,
            precio: parseFloat(newProduct.precio) || 0,
            imagenes: Array.isArray(newProduct.imagenes) ? newProduct.imagenes : [newProduct.imagenes]
        };

        setProducts(prev => [productToAdd, ...prev]);
        return productToAdd;
    };

    const updateProduct = async (id, updatedData) => {
        await new Promise(resolve => setTimeout(resolve, 300));
        setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedData } : p));
    };

    const deleteProduct = async (id) => {
        // Soft delete logic: mark as disabled
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
