import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import productsData from '../data/products.json';
import { useUI } from './UIContext';

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
    const { showToast } = useUI();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const STORAGE_KEY = 'logo_energy_products_v4';

    // Initial Load
    useEffect(() => {
        const initProducts = () => {
            setLoading(true);
            try {
                const savedProducts = localStorage.getItem(STORAGE_KEY);
                if (savedProducts && JSON.parse(savedProducts).length > 0) {
                    setProducts(JSON.parse(savedProducts));
                } else {
                    // Check for old versions and migrate if needed
                    const oldVersions = ['logo_energy_products', 'logo_energy_products_v2'];
                    let migrated = false;

                    for (const key of oldVersions) {
                        const oldData = localStorage.getItem(key);
                        if (oldData) {
                            try {
                                const parsed = JSON.parse(oldData);
                                if (Array.isArray(parsed) && parsed.length > 0) {
                                    // Migration logic: Map Spanish keys to English keys
                                    const migratedData = parsed.map(p => ({
                                        id: p.id,
                                        name: p.name || p.nombre,
                                        brand: p.brand || p.marca,
                                        category: p.category || p.categoria,
                                        price: p.price || p.precio,
                                        stock: p.stock,
                                        description: p.description || p.descripcion,
                                        images: p.images || p.imagenes || [],
                                        promotion: p.promotion !== undefined ? p.promotion : p.promocion,
                                        new: p.new !== undefined ? p.new : p.nuevo,
                                        bestSeller: p.bestSeller !== undefined ? p.bestSeller : p.mas_vendido,
                                        sold: p.sold || 0,
                                        disabled: p.disabled || false,
                                        specifications: p.specifications || p.especificaciones || [],
                                        reviews: p.reviews || p.reseñas || []
                                    }));
                                    setProducts(migratedData);
                                    localStorage.setItem(STORAGE_KEY, JSON.stringify(migratedData));
                                    migrated = true;
                                    break;
                                }
                            } catch (e) {
                                console.error(`Error migrating ${key}:`, e);
                            }
                        }
                    }

                    if (!migrated) {
                        setProducts(productsData);
                        localStorage.setItem(STORAGE_KEY, JSON.stringify(productsData));
                    }
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
            localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
        }
    }, [products, loading]);

    const getProductById = useCallback((id) => {
        return products.find(p => p.id === parseInt(id));
    }, [products]);

    const getProductsByCategory = useCallback((category) => {
        return products.filter(p => p.category === category);
    }, [products]);

    // Analytics Tracking logic
    const trackView = useCallback(async (id) => {
        setProducts(prev => prev.map(p =>
            p.id === id ? { ...p, views: (p.views || 0) + 1 } : p
        ));
    }, []);

    const toggleLike = useCallback(async (id) => {
        setProducts(prev => {
            const product = prev.find(p => p.id === id);
            if (product) {
                if (product.isLiked) {
                    showToast(`Eliminado de favoritos`, 'info');
                } else {
                    showToast(`¡Añadido a tus favoritos!`, 'success');
                }
            }
            return prev.map(p =>
                p.id === id ? { ...p, likesCount: (p.likesCount || 0) + (p.isLiked ? -1 : 1), isLiked: !p.isLiked } : p
            );
        });
    }, [showToast]);

    // CRUD Operations
    const addProduct = useCallback(async (newProduct) => {
        await new Promise(resolve => setTimeout(resolve, 300));
        const id = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        const productToAdd = {
            ...newProduct,
            id,
            disabled: false,
            stock: parseInt(newProduct.stock) || 0,
            sold: 0,
            price: parseFloat(newProduct.price) || 0,
            images: Array.isArray(newProduct.images) ? newProduct.images : [newProduct.images]
        };

        setProducts(prev => [productToAdd, ...prev]);
        return productToAdd;
    }, [products]);

    const updateProduct = useCallback(async (id, updatedData) => {
        await new Promise(resolve => setTimeout(resolve, 300));
        setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedData } : p));
    }, []);

    const deleteProduct = useCallback(async (id) => {
        await new Promise(resolve => setTimeout(resolve, 300));
        setProducts(prev => prev.map(p => p.id === id ? { ...p, disabled: true } : p));
    }, []);

    const value = useMemo(() => ({
        products,
        loading,
        getProductById,
        getProductsByCategory,
        trackView,
        toggleLike,
        addProduct,
        updateProduct,
        deleteProduct
    }), [products, loading, getProductById, getProductsByCategory, trackView, toggleLike, addProduct, updateProduct, deleteProduct]);

    return (
        <ProductContext.Provider value={value}>
            {children}
        </ProductContext.Provider>
    );
};

