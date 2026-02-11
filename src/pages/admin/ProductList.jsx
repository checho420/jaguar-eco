import React, { useState } from 'react';
import { useProducts } from '../../context/ProductContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faSearch, faFilter, faEyeSlash, faCheck, faTimes, faSave } from '@fortawesome/free-solid-svg-icons';

const ProductList = () => {
    const { products, loading, addProduct, updateProduct, deleteProduct } = useProducts();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('Todos');
    const [showModal, setShowModal] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null); // If null, mode is Add, else Edit

    // Get unique categories
    const categories = ['Todos', ...new Set(products.map(p => p.categoria))];

    // Filter Logic
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.marca.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'Todos' || product.categoria === filterCategory;
        // Show all products, but visually distinguish disabled ones
        return matchesSearch && matchesCategory;
    });

    const handleEdit = (product) => {
        setCurrentProduct(product);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas deshabilitar este producto? (Borrado Lógico)')) {
            await deleteProduct(id);
        }
    };

    const handleAddNew = () => {
        setCurrentProduct(null);
        setShowModal(true);
    };

    if (loading) return <div className="p-10 text-center animate-pulse">Cargando Inventario...</div>;

    return (
        <div className="space-y-6">
            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Inventario de Productos</h1>
                <button
                    onClick={handleAddNew}
                    className="bg-green-600 text-white px-6 py-2.5 rounded-xl hover:bg-green-700 flex items-center gap-2 shadow-lg hover:shadow-green-500/30 transition-all transform hover:scale-105 active:scale-95"
                >
                    <FontAwesomeIcon icon={faPlus} />
                    Añadir Producto
                </button>
            </div>

            {/* Filters Bar */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-4 justify-between">
                <div className="relative flex-grow max-w-md">
                    <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar productos, marcas..."
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
                                <th className="p-5 font-semibold">Info del Producto</th>
                                <th className="p-5 font-semibold">Categoría</th>
                                <th className="p-5 font-semibold">Precio / Stock</th>
                                <th className="p-5 font-semibold text-center">Estado</th>
                                <th className="p-5 font-semibold text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700 text-sm">
                            {filteredProducts.map(product => (
                                <tr key={product.id} className={`transition-colors group ${product.disabled ? 'bg-gray-50 dark:bg-gray-900/50 grayscale opacity-75' : 'hover:bg-gray-50 dark:hover:bg-gray-700/30'}`}>
                                    <td className="p-5">
                                        <div className="flex items-center gap-4">
                                            <div className="h-16 w-16 rounded-xl bg-white p-1 border dark:border-gray-600 flex-shrink-0 relative overflow-hidden">
                                                <img src={product.imagenes[0]} alt="" className="w-full h-full object-cover rounded-lg" />
                                                {product.disabled && (
                                                    <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center">
                                                        <FontAwesomeIcon icon={faEyeSlash} className="text-white" />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-800 dark:text-gray-200 text-base">{product.nombre}</div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">{product.marca}</span>
                                                    {product.nuevo && <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-600 dark:bg-blue-900/30">Nuevo</span>}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-5 text-gray-600 dark:text-gray-400">
                                        <span className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                                            {product.categoria}
                                        </span>
                                    </td>
                                    <td className="p-5">
                                        <div className="flex flex-col gap-1">
                                            <span className="font-bold text-gray-800 dark:text-white">${product.precio}</span>
                                            <div className="text-xs text-gray-500">Stock: <span className={product.stock < 10 ? 'text-red-500 font-bold' : 'text-green-600'}>{product.stock}</span></div>
                                        </div>
                                    </td>
                                    <td className="p-5 text-center">
                                        {product.disabled ? (
                                            <span className="inline-flex items-center gap-1 text-gray-500 bg-gray-100 px-2 py-1 rounded text-xs font-bold border border-gray-200">
                                                <FontAwesomeIcon icon={faEyeSlash} /> Deshabilitado
                                            </span>
                                        ) : product.stock < 5 ? (
                                            <span className="inline-flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded text-xs font-bold border border-red-100">
                                                Critico
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded text-xs font-bold border border-green-100">
                                                <FontAwesomeIcon icon={faCheck} /> Activo
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-5 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleEdit(product)} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors" title="Editar">
                                                <FontAwesomeIcon icon={faEdit} />
                                            </button>
                                            {!product.disabled && (
                                                <button onClick={() => handleDelete(product.id)} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors" title="Deshabilitar">
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
            </div>

            {/* Modal for Add/Edit */}
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
        </div>
    );
};

const ProductModal = ({ product, onClose, onSave }) => {
    const isEdit = !!product;
    const [formData, setFormData] = useState({
        nombre: product?.nombre || '',
        marca: product?.marca || '',
        categoria: product?.categoria || '',
        precio: product?.precio || '',
        stock: product?.stock || '',
        descripcion: product?.descripcion || '',
        // Handle array, default to empty string if array empty, else join or take first
        imageInput: product?.imagenes?.[0] || '',
        disabled: product?.disabled || false,
    });

    const [imagePreview, setImagePreview] = useState(formData.imageInput);
    const [imageError, setImageError] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === 'imageInput') {
            setImagePreview(value);
            setImageError(false);
        }

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Pack data, converting imageInput back to array
        const dataToSave = {
            ...formData,
            imagenes: [formData.imageInput] // For now, single image support in UI
        };
        delete dataToSave.imageInput; // Remove temp field
        onSave(dataToSave);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-scale-in flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                        {isEdit ? 'Editar Producto' : 'Nuevo Producto'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors">
                        <FontAwesomeIcon icon={faTimes} className="text-xl" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto custom-scrollbar flex-grow">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Column: Details */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nombre del Producto</label>
                                <input
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 transition-all"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Marca</label>
                                    <input
                                        name="marca"
                                        value={formData.marca}
                                        onChange={handleChange}
                                        className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 transition-all"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Categoría</label>
                                    <input
                                        name="categoria"
                                        value={formData.categoria}
                                        onChange={handleChange}
                                        className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 transition-all"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Precio</label>
                                    <input
                                        type="number"
                                        name="precio"
                                        value={formData.precio}
                                        onChange={handleChange}
                                        className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 transition-all"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Stock</label>
                                    <input
                                        type="number"
                                        name="stock"
                                        value={formData.stock}
                                        onChange={handleChange}
                                        className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 transition-all"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="pt-2">
                                <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                    <input
                                        type="checkbox"
                                        name="disabled"
                                        checked={formData.disabled}
                                        onChange={handleChange}
                                        className="w-5 h-5 rounded text-green-600 focus:ring-green-500"
                                    />
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Deshabilitar Producto</span>
                                        <span className="text-xs text-gray-500">Ocultar este producto de la tienda</span>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Right Column: Image & Description */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">URL de la Imagen</label>
                                <div className="flex gap-2">
                                    <input
                                        name="imageInput"
                                        value={formData.imageInput}
                                        onChange={handleChange}
                                        placeholder="https://ejemplo.com/imagen.jpg"
                                        className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Image Preview Area */}
                            <div className="aspect-video w-full rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex items-center justify-center overflow-hidden relative group">
                                {imagePreview && !imageError ? (
                                    <>
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            onError={() => setImageError(true)}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs">
                                            Vista Previa
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center text-gray-400 p-4">
                                        <FontAwesomeIcon icon={faEyeSlash} className="text-3xl mb-2" />
                                        <p className="text-sm">{imageError ? 'Error al cargar imagen' : 'Sin imagen'}</p>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Descripción</label>
                                <textarea
                                    name="descripcion"
                                    value={formData.descripcion}
                                    onChange={handleChange}
                                    rows="4"
                                    className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 transition-all resize-none"
                                ></textarea>
                            </div>
                        </div>
                    </div>
                </form>

                <div className="p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex justify-end gap-3 shrink-0">
                    <button onClick={onClose} className="px-6 py-2.5 rounded-xl text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors font-medium">
                        Cancelar
                    </button>
                    <button onClick={handleSubmit} className="px-6 py-2.5 rounded-xl bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-500/30 transition-all flex items-center gap-2 font-bold transform active:scale-95">
                        <FontAwesomeIcon icon={faSave} />
                        Guardar Producto
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductList;
