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
        { name: 'Ene', current: 3800, previous: 2800 },
        { name: 'Feb', current: 4200, previous: 3200 },
        { name: 'Mar', current: 3900, previous: 3100 },
        { name: 'Abr', current: 4500, previous: 3800 },
        { name: 'May', current: 4100, previous: 3600 },
        { name: 'Jun', current: 4800, previous: 4000 },
    ];

    const orderStatusData = [
        { name: 'Entregado', value: metrics.deliveredOrders },
        { name: 'Pendiente', value: metrics.pendingOrders },
        { name: 'Cancelado', value: metrics.canceledOrders },
    ];

    const STATUS_COLORS = ['#0abab5', '#ff9500', '#ff2d55']; // Tiffany Blue, Orange, Rose

    // Top Selling Products (Mock logic: sort by 'sold' field if available, else random slice)
    const topProducts = [...products]
        .sort((a, b) => (b.sold || 0) - (a.sold || 0))
        .slice(0, 5);

    return (
        <div className="space-y-8 animate-fade-in-up">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter italic uppercase">
                        Dashboard <span className="text-[#0abab5]">Global</span>
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Resumen de actividad en tiempo real</p>
                </div>
                <div className="flex items-center space-x-3 bg-white dark:bg-[#171821] p-2 rounded-2xl shadow-sm border border-gray-100 dark:border-[#1e1f26]">
                    <img src="https://i.pravatar.cc/150?u=admin_logo_energy" alt="Admin" className="w-10 h-10 rounded-full border-2 border-[#0abab5]" />
                    <div className="pr-4">
                        <p className="text-sm font-black text-gray-800 dark:text-white uppercase tracking-tighter">Admin User</p>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Super Admin</p>
                    </div>
                </div>
            </header>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard
                    title="Ingresos del día"
                    value={formatCurrency(metrics.totalRevenue / 30)}
                    icon={faDollarSign}
                    color="tiffany"
                    trend="+12.5%"
                />
                <KPICard
                    title="Órdenes del día"
                    value={Math.floor(metrics.totalOrders / 5)}
                    icon={faShoppingBag}
                    color="blue"
                    trend="+5.2%"
                />
                <KPICard
                    title="Total Productos"
                    value={products.length}
                    icon={faTag}
                    color="rose"
                    trend="Estable"
                />
                <KPICard
                    title="Visitantes"
                    value="1,245"
                    icon={faUsers}
                    color="orange"
                    trend="+18%"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-[#171821] p-10 rounded-[32px] shadow-sm border border-gray-100 dark:border-[#1e1f26]">
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="font-black text-xl text-gray-800 dark:text-white uppercase tracking-tighter italic">Comparativa de Ingresos</h3>
                        <select className="bg-gray-50 dark:bg-[#1c1d26] text-[10px] p-4 rounded-xl border-none outline-none dark:text-white font-black uppercase tracking-widest">
                            <option>Semana Actual vs Anterior</option>
                            <option>Mes Actual vs Anterior</option>
                        </select>
                    </div>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={earningData}>
                                <defs>
                                    <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0abab5" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#0abab5" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorPrev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6B7280" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6B7280" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#555" opacity={0.1} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 10, fontWeight: 900 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 10, fontWeight: 900 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#171821', borderRadius: '16px', border: '1px solid #1e1f26', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}
                                    itemStyle={{ color: '#0abab5', fontSize: '12px', fontWeight: 900 }}
                                    labelStyle={{ color: '#fff', marginBottom: '8px', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px' }}
                                    formatter={(value) => [formatCurrency(value), 'Ingresos']}
                                />
                                <Area type="monotone" dataKey="current" name="Semana Actual" stroke="#0abab5" strokeWidth={4} fillOpacity={1} fill="url(#colorCurrent)" />
                                <Area type="monotone" dataKey="previous" name="Semana Anterior" stroke="#6b7280" strokeWidth={4} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorPrev)" />
                                <Legend verticalAlign="top" align="right" height={36} iconType="circle" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Order Status Pie Chart */}
                <div className="bg-white dark:bg-[#171821] p-10 rounded-[32px] shadow-sm border border-gray-100 dark:border-[#1e1f26] flex flex-col">
                    <h3 className="font-black text-xl text-gray-800 dark:text-white uppercase tracking-tighter italic mb-8">Estado de Órdenes</h3>
                    <div className="flex-grow relative min-h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={orderStatusData}
                                    innerRadius={70}
                                    outerRadius={90}
                                    paddingAngle={8}
                                    dataKey="value"
                                    cornerRadius={12}
                                >
                                    {orderStatusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#171821', borderRadius: '16px', border: '1px solid #1e1f26' }}
                                    itemStyle={{ fontSize: '12px', fontWeight: 900 }}
                                />
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
                <div className="bg-white dark:bg-[#171821] p-10 rounded-[32px] shadow-sm border border-gray-100 dark:border-[#1e1f26]">
                    <h3 className="font-black text-xl text-gray-800 dark:text-white uppercase tracking-tighter italic mb-10">Productos Más Vendidos</h3>
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
                                    <tr key={product.id} className="border-b border-gray-50 dark:border-[#1e1f26] last:border-none hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                        <td className="py-6 px-4 flex items-center gap-4">
                                            <img src={product.images[0]} alt={product.name} className="w-12 h-12 rounded-xl object-contain bg-gray-50 dark:bg-[#0d0e12] p-1" />
                                            <span className="font-black text-gray-800 dark:text-gray-200 line-clamp-1 uppercase tracking-tighter italic">{product.name}</span>
                                        </td>
                                        <td className="py-6 px-4 text-gray-500 dark:text-gray-400 font-black text-[10px] uppercase tracking-widest">{product.category}</td>
                                        <td className="py-6 px-4 text-right font-black text-gray-900 dark:text-white text-lg tracking-tighter italic">{formatCurrency(product.price)}</td>
                                        <td className="py-6 px-4 text-right text-[#0abab5] font-black italic text-lg">{formatNumber(product.sold || 0)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white dark:bg-[#171821] p-10 rounded-[32px] shadow-sm border border-gray-100 dark:border-[#1e1f26]">
                    <h3 className="font-black text-xl text-gray-800 dark:text-white uppercase tracking-tighter italic mb-10">Órdenes Recientes</h3>
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
                                    <tr key={order.id} className="border-b border-gray-50 dark:border-[#1e1f26] last:border-none hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-xs font-black uppercase tracking-widest text-[#6b7c93]">
                                        <td className="py-6 px-4 font-black">#{order.id}</td>
                                        <td className="py-6 px-4">{order.date}</td>
                                        <td className="py-6 px-4 text-gray-800 dark:text-white">{order.customerName}</td>
                                        <td className="py-6 px-4 font-black text-gray-800 dark:text-white text-base tracking-tighter italic">{formatCurrency(order.total)}</td>
                                        <td className="py-6 px-4 text-center">
                                            <span className={`px-4 py-2 rounded-full text-[9px] font-black tracking-widest ${order.status === 'entregado' ? 'bg-[#0abab5]/10 text-[#0abab5]' :
                                                order.status === 'pendiente' ? 'bg-[#ff9500]/10 text-[#ff9500]' :
                                                    'bg-[#ff2d55]/10 text-[#ff2d55]'
                                                }`}>
                                                {order.status}
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

const KPICard = ({ title, value, icon, color, trend }) => {
    const themeColors = {
        tiffany: {
            bg: 'bg-[#0abab5]/10',
            text: 'text-[#0abab5]',
            gradient: 'from-[#0abab5] to-[#008b8b]',
            glow: 'shadow-[#0abab5]/20'
        },
        blue: {
            bg: 'bg-[#4169e1]/10',
            text: 'text-[#4169e1]',
            gradient: 'from-[#4169e1] to-[#7b61ff]',
            glow: 'shadow-[#4169e1]/20'
        },
        rose: {
            bg: 'bg-[#ff2d55]/10',
            text: 'text-[#ff2d55]',
            gradient: 'from-[#ff2d55] to-[#ff7171]',
            glow: 'shadow-[#ff2d55]/20'
        },
        orange: {
            bg: 'bg-[#ff9500]/10',
            text: 'text-[#ff9500]',
            gradient: 'from-[#ff9500] to-[#ffcc00]',
            glow: 'shadow-[#ff9500]/20'
        }
    };

    const theme = themeColors[color];

    return (
        <div className="bg-white dark:bg-[#171821] p-8 rounded-[28px] border border-gray-100 dark:border-[#1e1f26] flex flex-col justify-between h-full transition-all hover:scale-[1.02] duration-300 relative overflow-hidden group">
            {/* Soft Background Glow */}
            <div className={`absolute -right-8 -bottom-8 w-32 h-32 rounded-full blur-[60px] opacity-10 transition-opacity group-hover:opacity-30 bg-current ${theme.text}`}></div>

            <div className="flex justify-between items-start mb-8 relative z-10">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br shadow-lg ${theme.gradient} text-white`}>
                    <FontAwesomeIcon icon={icon} className="text-xl" />
                </div>
                {trend && (
                    <div className={`px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest ${theme.bg} ${theme.text}`}>
                        {trend}
                    </div>
                )}
            </div>

            <div className="relative z-10">
                <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter mb-1">
                    {value}
                </h3>
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] opacity-80">
                    {title}
                </p>
            </div>
        </div>
    );
};

export default Dashboard;

