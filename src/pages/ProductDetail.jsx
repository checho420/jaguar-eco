import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import ProductCard from '../components/ProductCard';

const ProductDetail = () => {
    const { id } = useParams();
    const { getProductById, getProductsByCategory, loading } = useProducts();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);

    useEffect(() => {
        if (!loading) {
            const found = getProductById(id);
            setProduct(found);
            if (found) {
                // Get related products (same category, excluding current)
                const related = getProductsByCategory(found.categoria)
                    .filter(p => p.id !== found.id)
                    .slice(0, 4);
                setRelatedProducts(related);
            }
        }
    }, [id, loading, getProductById, getProductsByCategory]);

    if (loading) return <div className="text-center py-20 dark:text-white">Loading...</div>;
    if (!product) return <div className="text-center py-20 dark:text-white">Product not found</div>;

    return (
        <div className="container mx-auto px-6 py-12">
            <Link to="/catalog" className="text-gray-500 hover:text-green-600 mb-6 inline-flex items-center space-x-2 transition-colors">
                <FontAwesomeIcon icon={faArrowLeft} />
                <span>Back to Catalog</span>
            </Link>

            <div className="flex flex-col md:flex-row gap-12 mb-16">
                {/* Images */}
                <div className="w-full md:w-1/2">
                    <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700 group">
                        <img src={product.imagenes[0]} alt={product.nombre} className="w-full h-auto object-cover transform transition-transform duration-500 group-hover:scale-105" />
                    </div>
                    {/* Thumbnails placeholder */}
                    <div className="flex gap-4 mt-4 overflow-x-auto pb-2">
                        {product.imagenes.map((img, idx) => (
                            <img key={idx} src={img} alt="" className="w-20 h-20 rounded-md object-cover border-2 border-green-500 cursor-pointer hover:opacity-80 transition-opacity" />
                        ))}
                    </div>
                </div>

                {/* Info */}
                <div className="w-full md:w-1/2">
                    <div className="mb-2">
                        <span className="text-sm font-medium text-green-600 dark:text-green-400 uppercase tracking-widest">{product.marca}</span>
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{product.nombre}</h1>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mb-6">${product.precio}</p>

                    <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                        {product.descripcion}
                    </p>

                    <div className="py-6 border-t border-b border-gray-200 dark:border-gray-700 mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-gray-700 dark:text-gray-300 font-medium">Stock:</span>
                            <span className="text-green-600 font-bold">{product.stock} units</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-700 dark:text-gray-300 font-medium">Category:</span>
                            <span className="text-gray-600 dark:text-gray-400">{product.categoria}</span>
                        </div>
                    </div>

                    <button onClick={() => addToCart(product)} className="w-full bg-green-600 text-white py-4 rounded-full font-bold text-lg hover:bg-green-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3 transform hover:scale-[1.02]">
                        <FontAwesomeIcon icon={faShoppingCart} />
                        Add to Cart
                    </button>
                </div>
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <div>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Related Products</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {relatedProducts.map(p => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetail;
