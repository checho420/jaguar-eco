import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './layout/Layout';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import Home from './pages/Home';

import Checkout from './pages/Checkout';
import AdminLayout from './layout/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import ProductList from './pages/admin/ProductList';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/checkout" element={<Checkout />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<ProductList />} />
        </Route>

        <Route path="/cart" element={<div className="p-20 text-center dark:text-white">Cart coming soon...</div>} />
        <Route path="/login" element={<div className="p-20 text-center dark:text-white">Login Page</div>} />
        <Route path="*" element={<div className="p-20 text-center dark:text-white">404 Not Found</div>} />
      </Routes>
    </Layout>
  );
}

export default App;
