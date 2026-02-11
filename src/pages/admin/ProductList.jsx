import React, { useState, useEffect } from 'react';
import { useProducts } from '../../context/ProductContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faSearch, faFilter, faEyeSlash, faCheck, faTimes, faSave, faList, faThLarge, faStar } from '@fortawesome/free-solid-svg-icons';
import { formatCurrency } from '../../utils/formatters';
import { motion, AnimatePresence } from 'framer-motion';

const ProductList = () => {
    const { products, loading, addProduct, updateProduct, deleteProduct } = useProducts();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('Todos');
    const [showModal, setShowModal] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [viewMode, setViewMode] = useState(() => {
        return localStorage.getItem('product_view_mode') || 'list';
    });

    useEffect(() => {
        localStorage.setItem('product_view_mode', viewMode);
    }, [viewMode]);

    // Get unique categories
    const categories = ['Todos', ...new Set(products.map(p => p.categoria))];

    // Filter Logic
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.marca.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'Todos' || product.categoria === filterCategory;
        return matchesSearch && matchesCategory;
    });

    const handleEdit = (product) => {
        setCurrentProduct(product);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas deshabilitar este producto?')) {
            await deleteProduct(id);
        }
    };

    const handleAddNew = () => {
        setCurrentProduct(null);
        setShowModal(true);
    };

    if (loading) return (
        <div className="p-20 text-center flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 font-bold animate-pulse uppercase tracking-widest text-xs">Sincronizando Inventario...</p>
        </div>
    );

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Elegant Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter italic uppercase">
                        Gestión de <span className="text-green-500">Productos</span>
                    </h1>
                    <p className="text-gray-500 text-sm font-medium mt-1 uppercase tracking-widest">
                        Total: <span className="text-gray-900 dark:text-gray-200 font-bold">{products.length} Items</span>
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                    {/* View Toggle */}
                    <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-xl flex gap-1 shadow-inner border border-gray-200 dark:border-gray-700">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 text-xs font-black uppercase tracking-tighter ${viewMode === 'list' ? 'bg-white dark:bg-gray-700 text-green-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <FontAwesomeIcon icon={faList} /> Lista
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 text-xs font-black uppercase tracking-tighter ${viewMode === 'grid' ? 'bg-white dark:bg-gray-700 text-green-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <FontAwesomeIcon icon={faThLarge} /> Cards
                        </button>
                    </div>

                    <button
                        onClick={handleAddNew}
                        className="flex-grow lg:flex-grow-0 bg-green-600 text-white px-8 py-3 rounded-xl hover:bg-green-700 flex items-center justify-center gap-3 shadow-xl hover:shadow-green-500/30 transition-all transform active:scale-95 font-black uppercase tracking-widest text-xs"
                    >
                        <FontAwesomeIcon icon={faPlus} />
                        Añadir Producto
                    </button>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-md p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-4 justify-between">
                <div className="relative flex-grow max-w-xl">
                    <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre, marca o modelo..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-gray-900 border-2 border-transparent focus:border-green-500 outline-none dark:text-white transition-all font-medium text-sm placeholder:text-gray-400"
                    />
                </div>

                <div className="flex items-center gap-3">
                    <div className="px-4 py-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-700 flex items-center gap-3 group">
                        <FontAwesomeIcon icon={faFilter} className="text-gray-400 group-focus-within:text-green-500" />
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="bg-transparent text-gray-700 dark:text-gray-200 outline-none cursor-pointer font-bold text-xs uppercase tracking-widest min-w-[140px]"
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Main View Container */}
            <AnimatePresence mode="wait">
                {viewMode === 'list' ? (
                    <motion.div
                        key="list"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-white dark:bg-gray-800 rounded-[32px] shadow-2xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700 overflow-hidden"
                    >
                        <div className="overflow-x-auto custom-scrollbar">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-50/50 dark:bg-gray-900/50 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
                                    <tr>
                                        <th className="p-6">Información</th>
                                        <th className="p-6">Categoría</th>
                                        <th className="p-6">Finanzas</th>
                                        <th className="p-6">Inventario</th>
                                        <th className="p-6 text-center">Estado</th>
                                        <th className="p-6 text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                                    {filteredProducts.map(product => (
                                        <tr key={product.id} className={`group transition-all ${product.disabled ? 'bg-gray-50/50 dark:bg-gray-900/20 opacity-60' : 'hover:bg-gray-50/80 dark:hover:bg-gray-700/30'}`}>
                                            <td className="p-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-16 w-16 md:h-20 md:w-20 rounded-2xl bg-white dark:bg-gray-900 p-1 border-2 border-gray-100 dark:border-gray-700 relative overflow-hidden flex-shrink-0 group-hover:scale-110 transition-transform shadow-sm">
                                                        <img src={product.imagenes[0]} alt="" className="w-full h-full object-contain rounded-xl" />
                                                        {product.disabled && (
                                                            <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-[1px] flex items-center justify-center">
                                                                <FontAwesomeIcon icon={faEyeSlash} className="text-white text-xs" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-black text-gray-900 dark:text-white text-lg tracking-tighter italic line-clamp-1 truncate">{product.nombre}</div>
                                                        <div className="text-[10px] text-green-500 font-black uppercase tracking-[0.2em] mt-1">{product.marca}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className="bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border border-gray-200 dark:border-gray-600">
                                                    {product.categoria}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex flex-col">
                                                    <span className="text-2xl font-black text-gray-900 dark:text-white italic tracking-tighter">
                                                        {formatCurrency(product.precio)}
                                                    </span>
                                                    {product.promocion && <span className="text-[9px] text-red-500 font-black uppercase tracking-tighter">Oferta Activa</span>}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-2 w-16 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full transition-all duration-1000 ${product.stock < 10 ? 'bg-red-500' : 'bg-green-500'}`}
                                                            style={{ width: `${Math.min(product.stock, 100)}%` }}
                                                        />
                                                    </div>
                                                    <span className={`text-xs font-black ${product.stock < 10 ? 'text-red-500' : 'text-gray-600 dark:text-gray-400'}`}>{product.stock}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-center">
                                                {product.disabled ? (
                                                    <span className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-700 text-gray-500 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-gray-200 dark:border-gray-600">
                                                        Oculto
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-2 bg-green-50 dark:bg-green-900/20 text-green-600 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-100 dark:border-green-900/50">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse"></div> Activo
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex justify-end gap-2 lg:opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-0 translate-x-4">
                                                    <button onClick={() => handleEdit(product)} className="w-10 h-10 flex items-center justify-center bg-blue-50 dark:bg-blue-900/20 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition-all shadow-sm">
                                                        <FontAwesomeIcon icon={faEdit} />
                                                    </button>
                                                    {!product.disabled && (
                                                        <button onClick={() => handleDelete(product.id)} className="w-10 h-10 flex items-center justify-center bg-red-50 dark:bg-red-900/20 text-red-600 hover:bg-red-600 hover:text-white rounded-xl transition-all shadow-sm">
                                                            <FontAwesomeIcon icon={faTrash} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="grid"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    >
                        {filteredProducts.map(product => (
                            <div key={product.id} className={`group relative bg-white dark:bg-gray-800 rounded-[32px] p-5 shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700 transition-all hover:scale-[1.02] hover:shadow-2xl ${product.disabled ? 'opacity-60 grayscale' : ''}`}>
                                {/* Card Image */}
                                <div className="relative h-64 rounded-2xl bg-gray-50 dark:bg-gray-900 overflow-hidden mb-5 border border-gray-100 dark:border-gray-700">
                                    <img src={product.imagenes[0]} alt="" className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-700" />

                                    {/* Quick Badges */}
                                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                                        {product.nuevo && <span className="bg-green-500 text-white text-[8px] font-black px-2.5 py-1 rounded-lg shadow-lg uppercase tracking-widest">Nuevo</span>}
                                        {product.promocion && <span className="bg-red-500 text-white text-[8px] font-black px-2.5 py-1 rounded-lg shadow-lg uppercase tracking-widest">Oferta</span>}
                                    </div>

                                    {/* Action Hover Overlay */}
                                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                        <button onClick={() => handleEdit(product)} className="w-12 h-12 bg-white text-gray-900 rounded-full flex items-center justify-center shadow-xl hover:bg-green-500 hover:text-white transition-all transform hover:scale-110">
                                            <FontAwesomeIcon icon={faEdit} className="text-xl" />
                                        </button>
                                        {!product.disabled && (
                                            <button onClick={() => handleDelete(product.id)} className="w-12 h-12 bg-white text-red-600 rounded-full flex items-center justify-center shadow-xl hover:bg-red-600 hover:text-white transition-all transform hover:scale-110">
                                                <FontAwesomeIcon icon={faTrash} className="text-xl" />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-4 px-2">
                                    <div className="flex justify-between items-start gap-2">
                                        <div>
                                            <h3 className="font-black text-gray-900 dark:text-white text-lg tracking-tighter italic line-clamp-1 group-hover:text-green-500 transition-colors uppercase">{product.nombre}</h3>
                                            <p className="text-[11px] text-gray-400 font-black uppercase tracking-[0.2em] mt-1">{product.marca}</p>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-800 text-sm">
                                        <div className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter italic py-1 truncate">{formatCurrency(product.precio)}</div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest whitespace-nowrap">{product.categoria}</span>
                                            <span className={`text-[10px] font-black mt-1 ${product.stock < 10 ? 'text-red-500 animate-pulse' : 'text-gray-400'}`}>Stock: {product.stock}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Modal for Add/Edit */}
            <AnimatePresence>
                {showModal && (
                    <ProductModal
                        product={currentProduct}
                        onClose={() => setShowModal(false)}
                        onSave={async (data) => {
                            if (currentProduct) {
                                await updateProduct(currentProduct.id, data);
                            } else {
                                await addProduct(data);
                            }
                            setShowModal(false);
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

const ProductModal = ({ product, onClose, onSave }) => {
    const isEdit = !!product;
    const [activeTab, setActiveTab] = useState('general');
    const [formData, setFormData] = useState({
        nombre: product?.nombre || '',
        marca: product?.marca || '',
        categoria: product?.categoria || '',
        precio: product?.precio || '',
        stock: product?.stock || '',
        descripcion: product?.descripcion || '',
        imagenes: product?.imagenes || [],
        newImageInput: '',
        disabled: product?.disabled || false,
        promocion: product?.promocion || false,
        nuevo: product?.nuevo || false,
        mas_vendido: product?.mas_vendido || false,
        especificaciones: product?.especificaciones || [],
        reseñas: product?.reseñas || [],
    });

    const [imagePreview, setImagePreview] = useState('');
    const [newSpec, setNewSpec] = useState({ label: '', value: '' });
    const [newReview, setNewReview] = useState({ usuario: '', comentario: '', rating: 5, fecha: new Date().toLocaleDateString() });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name === 'newImageInput') {
            setImagePreview(value);
        }
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleAddImage = (e) => {
        e.preventDefault();
        if (formData.newImageInput.trim()) {
            setFormData(prev => ({
                ...prev,
                imagenes: [...prev.imagenes, prev.newImageInput.trim()],
                newImageInput: ''
            }));
            setImagePreview('');
        }
    };

    const handleRemoveImage = (index) => {
        setFormData(prev => ({
            ...prev,
            imagenes: prev.imagenes.filter((_, i) => i !== index)
        }));
    };

    const handleAddSpec = (e) => {
        e.preventDefault();
        if (newSpec.label.trim() && newSpec.value.trim()) {
            setFormData(prev => ({
                ...prev,
                especificaciones: [...prev.especificaciones, { ...newSpec }]
            }));
            setNewSpec({ label: '', value: '' });
        }
    };

    const handleRemoveSpec = (index) => {
        setFormData(prev => ({
            ...prev,
            especificaciones: prev.especificaciones.filter((_, i) => i !== index)
        }));
    };

    const handleAddReview = (e) => {
        e.preventDefault();
        if (newReview.usuario.trim() && newReview.comentario.trim()) {
            setFormData(prev => ({
                ...prev,
                reseñas: [
                    { ...newReview, fecha: new Date().toLocaleDateString() },
                    ...prev.reseñas
                ]
            }));
            setNewReview({ usuario: '', comentario: '', rating: 5, fecha: new Date().toLocaleDateString() });
        }
    };

    const handleRemoveReview = (index) => {
        setFormData(prev => ({
            ...prev,
            reseñas: prev.reseñas.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Auto-add pending image if user forgot to click the plus button
        let finalImages = [...formData.imagenes];
        if (formData.newImageInput.trim() && !finalImages.includes(formData.newImageInput.trim())) {
            finalImages.push(formData.newImageInput.trim());
        }

        const dataToSave = {
            ...formData,
            imagenes: finalImages,
            precio: parseFloat(formData.precio) || 0,
            stock: parseInt(formData.stock) || 0
        };

        delete dataToSave.newImageInput;
        onSave(dataToSave);
    };

    const tabs = [
        { id: 'general', label: 'General', icon: faEdit },
        { id: 'multimedia', label: 'Multimedia', icon: faThLarge },
        { id: 'descripcion', label: 'Descripción', icon: faList },
        { id: 'especificaciones', label: 'Especificaciones', icon: faPlus }, // Reusing faPlus for variety or use specific icons
        { id: 'reseñas', label: 'Reseñas', icon: faCheck }
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fade-in">
            <div className="bg-white dark:bg-gray-900 w-full max-w-5xl rounded-[40px] shadow-2xl overflow-hidden animate-scale-in flex flex-col max-h-[90vh] border border-gray-100 dark:border-gray-800">
                {/* Modal Header */}
                <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white italic uppercase tracking-tight">
                            {isEdit ? 'Editar' : 'Añadir'} <span className="text-green-500">Producto</span>
                        </h2>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">ID: {product?.id || 'Nuevo'}</p>
                    </div>
                    <button onClick={onClose} className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-2xl transition-all">
                        <FontAwesomeIcon icon={faTimes} className="text-xl" />
                    </button>
                </div>

                {/* Tab Navigation */}
                <div className="flex px-8 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 overflow-x-auto no-scrollbar">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`py-4 px-6 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${activeTab === tab.id
                                ? 'border-green-500 text-green-500 bg-green-50/10'
                                : 'border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
                                }`}
                        >
                            <FontAwesomeIcon icon={tab.icon} className="text-xs" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Form Content */}
                <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto custom-scrollbar p-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {activeTab === 'general' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nombre Comercial</label>
                                            <input name="nombre" value={formData.nombre} onChange={handleChange} className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 dark:text-white border border-transparent focus:border-green-500 outline-none font-bold text-sm transition-all shadow-inner" placeholder="P. ej. Panel Solar Pro X" required />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Marca</label>
                                                <input name="marca" value={formData.marca} onChange={handleChange} className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 dark:text-white border border-transparent focus:border-green-500 outline-none font-bold text-sm transition-all shadow-inner" placeholder="Jaguar" required />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Categoría</label>
                                                <select name="categoria" value={formData.categoria} onChange={handleChange} className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 dark:text-white border border-transparent focus:border-green-500 outline-none font-bold text-sm transition-all shadow-inner appearance-none" required>
                                                    <option value="">Seleccionar...</option>
                                                    <option value="Paneles Solares">Paneles Solares</option>
                                                    <option value="Inversores">Inversores</option>
                                                    <option value="Baterías">Baterías</option>
                                                    <option value="Generadores">Generadores</option>
                                                    <option value="Iluminación">Iluminación</option>
                                                    <option value="Accesorios">Accesorios</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Precio Unitario ($)</label>
                                                <input type="number" step="0.01" name="precio" value={formData.precio} onChange={handleChange} className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 dark:text-white border border-transparent focus:border-green-500 outline-none font-bold text-sm transition-all shadow-inner" required />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Stock Disponible</label>
                                                <input type="number" name="stock" value={formData.stock} onChange={handleChange} className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 dark:text-white border border-transparent focus:border-green-500 outline-none font-bold text-sm transition-all shadow-inner" required />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Flags de Visibilidad</label>
                                        <div className="grid grid-cols-1 gap-3">
                                            {[
                                                { name: 'promocion', label: 'En Promoción', color: 'red' },
                                                { name: 'nuevo', label: 'Nuevo Producto', color: 'green' },
                                                { name: 'mas_vendido', label: 'Más Vendido', color: 'orange' },
                                                { name: 'disabled', label: 'Deshabilitado', color: 'gray' }
                                            ].map(flag => (
                                                <label key={flag.name} className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${formData[flag.name] ? `border-${flag.color}-500 bg-${flag.color}-50/10` : 'border-gray-50 dark:border-gray-800 hover:border-gray-100'}`}>
                                                    <span className={`text-[10px] font-black uppercase tracking-widest ${formData[flag.name] ? `text-${flag.color}-500` : 'text-gray-500'}`}>{flag.label}</span>
                                                    <input type="checkbox" name={flag.name} checked={formData[flag.name]} onChange={handleChange} className="w-5 h-5 rounded-lg border-gray-300 text-green-500 focus:ring-green-500" />
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'multimedia' && (
                                <div className="space-y-8">
                                    <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-[32px] border-2 border-dashed border-gray-100 dark:border-gray-800">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 block">Añadir Nueva Imagen (URL)</label>
                                        <div className="flex gap-4">
                                            <input name="newImageInput" value={formData.newImageInput} onChange={handleChange} className="flex-grow p-4 rounded-2xl bg-white dark:bg-gray-900 dark:text-white border border-transparent focus:border-green-500 outline-none font-mono text-xs transition-all shadow-sm" placeholder="https://images.unsplash.com/..." />
                                            <button onClick={handleAddImage} className="w-14 h-14 bg-green-500 text-white rounded-2xl hover:bg-green-600 transition-all shadow-lg flex items-center justify-center">
                                                <FontAwesomeIcon icon={faPlus} />
                                            </button>
                                        </div>
                                        {imagePreview && (
                                            <div className="mt-6 aspect-video max-h-48 rounded-2xl overflow-hidden bg-white dark:bg-black p-4 border border-gray-100 dark:border-gray-800 relative group">
                                                <img src={imagePreview} alt="Preview" className="w-full h-full object-contain opacity-50 group-hover:opacity-100 transition-opacity" />
                                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                    <span className="bg-black/50 text-white text-[10px] font-black uppercase px-3 py-1 rounded-lg backdrop-blur-sm">Presiona (+) para Confirmar</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Galería Actual ({formData.imagenes.length} items)</label>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                            {formData.imagenes.map((img, idx) => (
                                                <div key={idx} className="relative group aspect-square rounded-2xl overflow-hidden bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-800">
                                                    <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                    <button onClick={() => handleRemoveImage(idx)} className="absolute inset-0 bg-red-600/80 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xl">
                                                        <FontAwesomeIcon icon={faTrash} />
                                                    </button>
                                                    <div className="absolute top-2 left-2 bg-black/50 text-white text-[8px] font-black px-2 py-0.5 rounded uppercase">#{idx + 1}</div>
                                                </div>
                                            ))}
                                            {formData.imagenes.length === 0 && (
                                                <div className="col-span-full py-12 flex flex-col items-center justify-center text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                                                    <FontAwesomeIcon icon={faThLarge} className="text-4xl mb-3 opacity-20" />
                                                    <p className="text-xs uppercase font-black tracking-widest">Sin imágenes</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'descripcion' && (
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Cuerpo de la Descripción (Markdown soportado)</label>
                                        <textarea
                                            name="descripcion"
                                            value={formData.descripcion}
                                            onChange={handleChange}
                                            rows="12"
                                            className="w-full p-6 rounded-[32px] bg-gray-50 dark:bg-gray-800 dark:text-white border border-transparent focus:border-green-500 outline-none font-medium text-sm leading-relaxed transition-all shadow-inner resize-none"
                                            placeholder="Introduce los detalles premium del producto..."
                                        />
                                    </div>
                                    <div className="p-6 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-2xl">
                                        <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest">Tip del Sistema</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Este texto se verá en la pestaña principal de la página de detalle del producto.</p>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'especificaciones' && (
                                <div className="space-y-8">
                                    <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-[32px] border border-gray-100 dark:border-gray-800">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 block">Añadir Especificación Técnica</label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <input value={newSpec.label} onChange={(e) => setNewSpec({ ...newSpec, label: e.target.value })} className="p-4 rounded-2xl bg-white dark:bg-gray-900 dark:text-white border border-transparent focus:border-green-500 outline-none font-bold text-xs uppercase" placeholder="Etiqueta (P. ej. Potencia)" />
                                            <div className="flex gap-4">
                                                <input value={newSpec.value} onChange={(e) => setNewSpec({ ...newSpec, value: e.target.value })} className="flex-grow p-4 rounded-2xl bg-white dark:bg-gray-900 dark:text-white border border-transparent focus:border-green-500 outline-none font-bold text-xs" placeholder="Valor (P. ej. 400W)" />
                                                <button onClick={handleAddSpec} className="w-14 h-14 bg-green-500 text-white rounded-2xl hover:bg-green-600 transition-all shadow-lg flex items-center justify-center shrink-0">
                                                    <FontAwesomeIcon icon={faPlus} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {formData.especificaciones.map((spec, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-800 group hover:border-green-500/50 transition-all">
                                                <div>
                                                    <p className="text-[9px] font-black text-green-500 uppercase tracking-widest">{spec.label}</p>
                                                    <p className="text-sm font-black italic dark:text-white">{spec.value}</p>
                                                </div>
                                                <button onClick={() => handleRemoveSpec(idx)} className="w-8 h-8 flex items-center justify-center text-gray-300 hover:text-red-500 transition-colors">
                                                    <FontAwesomeIcon icon={faTrash} className="text-sm" />
                                                </button>
                                            </div>
                                        ))}
                                        {formData.especificaciones.length === 0 && (
                                            <div className="col-span-full py-12 text-center text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-2xl border-2 border-dotted border-gray-200 dark:border-gray-800">
                                                <p className="text-xs uppercase font-black tracking-widest opacity-50 italic">Utilizando especificaciones por defecto del sistema</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'reseñas' && (
                                <div className="space-y-8">
                                    <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-[32px] border border-gray-100 dark:border-gray-800">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 block">Simular Nueva Reseña de Usuario</label>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                            <input value={newReview.usuario} onChange={(e) => setNewReview({ ...newReview, usuario: e.target.value })} className="p-4 rounded-2xl bg-white dark:bg-gray-900 dark:text-white border border-transparent focus:border-green-500 outline-none font-bold text-xs" placeholder="Nombre de Usuario" />
                                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-gray-900 border border-transparent">
                                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Calificación</span>
                                                <div className="flex gap-1 text-orange-400">
                                                    {[1, 2, 3, 4, 5].map(star => (
                                                        <FontAwesomeIcon
                                                            key={star}
                                                            icon={faStar}
                                                            className={`cursor-pointer transition-all ${star <= newReview.rating ? 'text-orange-400 scale-110' : 'text-gray-200 dark:text-gray-800'}`}
                                                            onClick={() => setNewReview({ ...newReview, rating: star })}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="flex gap-4">
                                                <button onClick={handleAddReview} className="flex-grow bg-green-500 text-white rounded-2xl hover:bg-green-600 transition-all font-black uppercase tracking-widest text-xs py-4 px-6 shadow-lg">
                                                    Publicar Reseña
                                                </button>
                                            </div>
                                        </div>
                                        <textarea value={newReview.comentario} onChange={(e) => setNewReview({ ...newReview, comentario: e.target.value })} className="w-full p-4 rounded-2xl bg-white dark:bg-gray-900 dark:text-white border border-transparent focus:border-green-500 outline-none font-medium text-xs leading-relaxed transition-all shadow-inner resize-none mb-2" rows="2" placeholder="Comentario del cliente..." />
                                    </div>

                                    <div className="space-y-4">
                                        {formData.reseñas.map((rev, idx) => (
                                            <div key={idx} className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 flex justify-between items-start">
                                                <div>
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <span className="text-sm font-black italic dark:text-white uppercase">{rev.usuario}</span>
                                                        <div className="flex gap-0.5 text-orange-400 text-[10px]">
                                                            {[...Array(5)].map((_, i) => (
                                                                <FontAwesomeIcon key={i} icon={faStar} className={i < rev.rating ? 'text-orange-400' : 'text-gray-100 dark:text-gray-900'} />
                                                            ))}
                                                        </div>
                                                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{rev.fecha}</span>
                                                    </div>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 italic">"{rev.comentario}"</p>
                                                </div>
                                                <button onClick={() => handleRemoveReview(idx)} className="w-10 h-10 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all">
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </button>
                                            </div>
                                        ))}
                                        {formData.reseñas.length === 0 && (
                                            <div className="py-12 text-center text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-2xl border-2 border-dotted border-gray-200 dark:border-gray-800">
                                                <p className="text-xs uppercase font-black tracking-widest opacity-50 italic">No hay reseñas registradas para este producto</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </form>

                {/* Modal Footer */}
                <div className="p-8 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 flex justify-between items-center">
                    <div className="flex gap-2">
                        {tabs.map((tab, i) => (
                            <div key={i} className={`w-2 h-2 rounded-full transition-all ${activeTab === tab.id ? 'w-6 bg-green-500' : 'bg-gray-200 dark:bg-gray-800'}`} />
                        ))}
                    </div>
                    <div className="flex gap-4">
                        <button onClick={onClose} className="px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                            Descartar
                        </button>
                        <button onClick={handleSubmit} className="px-10 py-4 rounded-2xl bg-green-500 text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-green-500/20 hover:bg-green-600 transition-all transform active:scale-95 flex items-center gap-3">
                            <FontAwesomeIcon icon={faSave} />
                            Guardar Cambios
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductList;
