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
                // const querySnapshot = await getDocs(collection(db, "products"));
                // const data = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));

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

    return (
        <ProductContext.Provider value={{ products, loading, getProductById, getProductsByCategory }}>
            {children}
        </ProductContext.Provider>
    );
};
