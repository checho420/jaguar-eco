import React from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTag, faDollarSign, faShoppingBag, faEllipsisH } from '@fortawesome/free-solid-svg-icons';

// Mock Data for Charts
const earningData = [
    { month: 'Jan', earning: 1000 },
    { month: 'Feb', earning: 2500 },
    { month: 'Mar', earning: 2000 },
    { month: 'Apr', earning: 3200 },
    { month: 'May', earning: 2800 },
    { month: 'Jun', earning: 3812 },
    { month: 'Jul', earning: 3600 },
    { month: 'Aug', earning: 4200 },
];

const orderModeData = [
    { name: 'Online orders', value: 70 },
    { name: 'Store orders', value: 30 },
];
const PIE_COLORS = ['#34D399', '#374151']; // Green and Dark Gray

const Dashboard = () => {
    return (
        <div className="space-y-6 animate-fade-in-up">
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
                <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Welcome, Admin</span>
                    <button className="bg-gray-200 dark:bg-gray-700 p-2 rounded-full">
                        <img src="https://i.pravatar.cc/150?u=admin_jaguar" alt="Admin" className="w-8 h-8 rounded-full" />
                    </button>
                </div>
            </header>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Sales */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between">
                    <div>
                        <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 mb-2">
                            <FontAwesomeIcon icon={faTag} />
                            <span className="font-semibold text-xs tracking-wider uppercase">Total Sales</span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-800 dark:text-white">$ 9568.19</h3>
                    </div>
                    <div className="h-12 w-12 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-xl">↗</span>
                    </div>
                </div>

                {/* Total Earnings */}
                <div className="bg-[#DCFCE7] dark:bg-green-900/30 p-6 rounded-3xl shadow-sm border border-green-100 dark:border-green-800 flex items-center justify-between">
                    <div>
                        <div className="flex items-center space-x-2 text-green-700 dark:text-green-400 mb-2">
                            <FontAwesomeIcon icon={faDollarSign} />
                            <span className="font-semibold text-xs tracking-wider uppercase">Total Earnings</span>
                        </div>
                        <h3 className="text-3xl font-bold text-green-800 dark:text-green-300">$ 4593.36</h3>
                    </div>
                    <div className="h-12 w-12 bg-green-200 dark:bg-green-800 text-green-700 rounded-full flex items-center justify-center">
                        <span className="text-xl">↗</span>
                    </div>
                </div>

                {/* Total Orders */}
                <div className="bg-[#F3E8FF] dark:bg-purple-900/30 p-6 rounded-3xl shadow-sm border border-purple-100 dark:border-purple-800 flex items-center justify-between">
                    <div>
                        <div className="flex items-center space-x-2 text-purple-700 dark:text-purple-400 mb-2">
                            <FontAwesomeIcon icon={faShoppingBag} />
                            <span className="font-semibold text-xs tracking-wider uppercase">Total Orders</span>
                        </div>
                        <h3 className="text-3xl font-bold text-purple-800 dark:text-purple-300">150 k</h3>
                    </div>
                    <div className="h-12 w-12 bg-purple-200 dark:bg-purple-800 text-purple-700 rounded-full flex items-center justify-center font-bold">
                        <span>↘</span>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Earning Analytics (Area Chart) */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg text-gray-800 dark:text-white">Earning Analytics</h3>
                        <div className="flex items-center space-x-2">
                            <span className="h-3 w-3 bg-green-400 rounded-full"></span>
                            <span className="text-xs text-gray-500">Earning</span>
                            <select className="bg-gray-50 dark:bg-gray-700 ml-4 text-xs p-1 rounded border-none outline-none dark:text-white">
                                <option>Monthly</option>
                                <option>Weekly</option>
                            </select>
                        </div>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={earningData}>
                                <defs>
                                    <linearGradient id="colorEarning" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#34D399" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#34D399" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" verical={false} stroke="#E5E7EB" opacity={0.3} />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Area type="monotone" dataKey="earning" stroke="#34D399" strokeWidth={3} fillOpacity={1} fill="url(#colorEarning)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Mode of Order (Pie Chart) */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg text-gray-800 dark:text-white">Mode of Order</h3>
                        <FontAwesomeIcon icon={faEllipsisH} className="text-gray-400" />
                    </div>
                    <div className="h-64 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={orderModeData}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {orderModeData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-3xl font-bold text-gray-800 dark:text-white">30%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section: Top Selling Products (Placeholder for now) */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg text-gray-800 dark:text-white">Top Selling Products</h3>
                    <select className="bg-gray-50 dark:bg-gray-700 text-xs p-1 rounded border-none outline-none dark:text-white">
                        <option>This Week</option>
                    </select>
                </div>
                {/* Simple Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="text-xs text-gray-400 uppercase bg-gray-50 dark:bg-gray-700/50">
                            <tr>
                                <th className="px-4 py-3 rounded-l-lg">Product</th>
                                <th className="px-4 py-3">Price</th>
                                <th className="px-4 py-3">Orders</th>
                                <th className="px-4 py-3">Stock</th>
                                <th className="px-4 py-3 rounded-r-lg">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm dark:text-gray-300">
                            <tr className="border-b border-gray-100 dark:border-gray-700">
                                <td className="px-4 py-3 font-medium flex items-center gap-2">
                                    <div className="w-8 h-8 rounded bg-gray-200"></div>
                                    Solar Generator 1000Wh
                                </td>
                                <td className="px-4 py-3">$999</td>
                                <td className="px-4 py-3">47</td>
                                <td className="px-4 py-3 text-red-500">23</td>
                                <td className="px-4 py-3 font-bold">$46,953</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 font-medium flex items-center gap-2">
                                    <div className="w-8 h-8 rounded bg-gray-200"></div>
                                    400W Solar Panel
                                </td>
                                <td className="px-4 py-3">$299</td>
                                <td className="px-4 py-3">98</td>
                                <td className="px-4 py-3 text-green-500">50</td>
                                <td className="px-4 py-3 font-bold">$29,301</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
