import React, { createContext, useContext, useState, useEffect } from 'react';
import ordersData from '../data/orders.json';
import customersData from '../data/customers.json';

const AdminContext = createContext();

export const useAdmin = () => useContext(AdminContext);

export const AdminProvider = ({ children }) => {
    const [orders, setOrders] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Mock API delay
                await new Promise(resolve => setTimeout(resolve, 500));
                setOrders(ordersData);
                setCustomers(customersData);
            } catch (error) {
                console.error("Error fetching admin data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Derived Metrics
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + (order.status !== 'cancelado' ? order.total : 0), 0);
    const pendingOrders = orders.filter(o => o.status === 'pendiente').length;
    const deliveredOrders = orders.filter(o => o.status === 'entregado').length;
    const canceledOrders = orders.filter(o => o.status === 'cancelado').length;

    // Recent Orders
    const recentOrders = [...orders].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

    // Top Selling products logic would typically require product aggregation from order items, 
    // but since our mock data structure is simple, we might just use the "sold" field in ProductContext for that. 
    // Here we focus on order metrics.

    return (
        <AdminContext.Provider value={{
            orders,
            customers,
            loading,
            metrics: {
                totalOrders,
                totalRevenue,
                pendingOrders,
                deliveredOrders,
                canceledOrders
            },
            recentOrders
        }}>
            {children}
        </AdminContext.Provider>
    );
};
