import React from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend, BarChart, Bar
} from 'recharts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTag, faDollarSign, faShoppingBag, faUsers, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { useAdmin } from '../../context/AdminContext';
import { useProducts } from '../../context/ProductContext';
import { formatCurrency, formatNumber } from '../../utils/formatters';

const Dashboard = () => {
    const { metrics, recentOrders, orders, loading: adminLoading } = useAdmin();
    const { products, loading: productsLoading } = useProducts();

    if (adminLoading || productsLoading) return <div className="p-10 text-center animate-pulse">Cargando Dashboard...</div>;

    // Derived Data for Charts
    const earningData = [
        { name: 'Lun', current: 4000, previous: 2400 },
        { name: 'Mar', current: 3000, previous: 1398 },
        { name: 'Mie', current: 2000, previous: 9800 },
        { name: 'Jue', current: 2780, previous: 3908 },
        { name: 'Vie', current: 1890, previous: 4800 },
        { name: 'Sab', current: 2390, previous: 3800 },
        { name: 'Dom', current: 3490, previous: 4300 },
    ];

    const orderStatusData = [
        { name: 'Entregado', value: metrics.deliveredOrders },
        { name: 'Pendiente', value: metrics.pendingOrders },
        { name: 'Cancelado', value: metrics.canceledOrders },
    ];

    const STATUS_COLORS = ['#10B981', '#F59E0B', '#EF4444']; // Green, Yellow/Orange, Red

    // Top Selling Products (Mock logic: sort by 'sold' field if available, else random slice)
    const topProducts = [...products]
        .sort((a, b) => (b.sold || 0) - (a.sold || 0))
        .slice(0, 5);

    return (
        <div className="space-y-8 animate-fade-in-up">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-1">Dashboard</h1>
                    <p className="text-gray-500 dark:text-gray-400">Resumen de actividad en tiempo real</p>
                </div>
                <div className="flex items-center space-x-3 bg-white dark:bg-gray-800 p-2 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <img src="https://i.pravatar.cc/150?u=admin_jaguar" alt="Admin" className="w-10 h-10 rounded-full border-2 border-green-500" />
                    <div className="pr-4">
                        <p className="text-sm font-bold text-gray-800 dark:text-white">Admin User</p>
                        <p className="text-xs text-gray-500">Super Admin</p>
                    </div>
                </div>
            </header>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard
                    title="Ingresos del día"
                    value={formatCurrency(metrics.totalRevenue / 30)} // Mock daily
                    icon={faDollarSign}
                    color="green"
                    trend="+12.5%"
                />
                <KPICard
                    title="Órdenes del día"
                    value={Math.floor(metrics.totalOrders / 5)} // Mock daily
                    icon={faShoppingBag}
                    color="blue"
                    trend="+5.2%"
                />
                <KPICard
                    title="Total Productos"
                    value={products.length}
                    icon={faTag}
                    color="purple"
                    trend="Stable"
                    trendUp={null}
                />
                <KPICard
                    title="Visitantes del día"
                    value="1,245"
                    icon={faUsers}
                    color="orange"
                    trend="+18%"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-xl text-gray-800 dark:text-white">Comparativa de Ingresos</h3>
                        <select className="bg-gray-50 dark:bg-gray-700 text-sm p-2 rounded-lg border-none outline-none dark:text-white font-medium">
                            <option>Semana Actual vs Anterior</option>
                            <option>Mes Actual vs Anterior</option>
                        </select>
                    </div>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={earningData}>
                                <defs>
                                    <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorPrev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6B7280" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6B7280" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" opacity={0.3} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                    formatter={(value) => [formatCurrency(value), 'Ingresos']}
                                />
                                <Area type="monotone" dataKey="current" name="Semana Actual" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorCurrent)" />
                                <Area type="monotone" dataKey="previous" name="Semana Anterior" stroke="#6B7280" strokeWidth={3} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorPrev)" />
                                <Legend verticalAlign="top" height={36} iconType="circle" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Order Status Pie Chart */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 flex flex-col">
                    <h3 className="font-bold text-xl text-gray-800 dark:text-white mb-6">Estado de Órdenes</h3>
                    <div className="flex-grow relative min-h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={orderStatusData}
                                    innerRadius={80}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                    cornerRadius={10}
                                >
                                    {orderStatusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Center Text */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mb-8">
                            <span className="text-4xl font-bold text-gray-800 dark:text-white">{metrics.totalOrders}</span>
                            <span className="text-xs text-gray-400 uppercase tracking-widest">Total</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section: Top Products & Recent Orders */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Top Selling Products */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700">
                    <h3 className="font-bold text-xl text-gray-800 dark:text-white mb-6">Productos Más Vendidos</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-xs text-gray-400 uppercase border-b border-gray-100 dark:border-gray-700">
                                    <th className="py-3 px-2">Producto</th>
                                    <th className="py-3 px-2">Categoría</th>
                                    <th className="py-3 px-2 text-right">Precio</th>
                                    <th className="py-3 px-2 text-right">Vendidos</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {topProducts.map((product) => (
                                    <tr key={product.id} className="border-b border-gray-50 dark:border-gray-700/50 last:border-none hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors">
                                        <td className="py-4 px-2 flex items-center gap-3">
                                            <img src={product.imagenes[0]} alt={product.nombre} className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                                            <span className="font-medium text-gray-800 dark:text-gray-200 line-clamp-1 max-w-[150px]">{product.nombre}</span>
                                        </td>
                                        <td className="py-4 px-2 text-gray-500">{product.categoria}</td>
                                        <td className="py-4 px-2 text-right font-semibold text-gray-700 dark:text-gray-300 py-2">{formatCurrency(product.precio)}</td>
                                        <td className="py-4 px-2 text-right text-green-500 font-bold">{formatNumber(product.sold || 0)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700">
                    <h3 className="font-bold text-xl text-gray-800 dark:text-white mb-6">Órdenes Recientes</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-xs text-gray-400 uppercase border-b border-gray-100 dark:border-gray-700">
                                    <th className="py-3 px-2">Orden #</th>
                                    <th className="py-3 px-2">Fecha</th>
                                    <th className="py-3 px-2">Cliente</th>
                                    <th className="py-3 px-2">Monto</th>
                                    <th className="py-3 px-2 text-center">Estado</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {recentOrders.map((order) => (
                                    <tr key={order.id} className="border-b border-gray-50 dark:border-gray-700/50 last:border-none hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors">
                                        <td className="py-4 px-2 font-medium text-gray-800 dark:text-gray-200">{order.id}</td>
                                        <td className="py-4 px-2 text-gray-500">{order.date}</td>
                                        <td className="py-4 px-2 text-gray-600 dark:text-gray-300">{order.customerName}</td>
                                        <td className="py-4 px-2 font-bold text-gray-800 dark:text-white">{formatCurrency(order.total)}</td>
                                        <td className="py-4 px-2 text-center">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${order.status === 'entregado' ? 'bg-green-100 text-green-600 dark:bg-green-900/30' :
                                                order.status === 'pendiente' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30' :
                                                    'bg-red-100 text-red-600 dark:bg-red-900/30'
                                                }`}>
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

const KPICard = ({ title, value, icon, color, trend, trendUp = true }) => {
    const colorClasses = {
        green: 'bg-green-50 text-green-600 dark:bg-green-900/20',
        blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20',
        purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20',
        orange: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20',
        red: 'bg-red-50 text-red-600 dark:bg-red-900/20',
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between h-full transition-transform hover:-translate-y-1 duration-300">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl ${colorClasses[color]}`}>
                    <FontAwesomeIcon icon={icon} className="text-xl" />
                </div>
                {trend && (
                    <div className={`flex items-center space-x-1 text-sm font-bold ${trendUp === true ? 'text-green-500' : trendUp === false ? 'text-red-500' : 'text-gray-400'}`}>
                        <span>{trend}</span>
                        {trendUp === true && <FontAwesomeIcon icon={faArrowUp} className="text-xs" />}
                        {trendUp === false && <FontAwesomeIcon icon={faArrowDown} className="text-xs" />}
                    </div>
                )}
            </div>
            <div>
                <p className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">{title}</p>
                <h3 className="text-3xl font-bold text-gray-800 dark:text-white">{value}</h3>
            </div>
        </div>
    );
};

export default Dashboard;
