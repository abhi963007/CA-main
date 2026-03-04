import React, { useMemo } from 'react';
import {
    ArrowLeft, PieChart as PieIcon, BarChart3, TrendingUp,
    CheckCircle2, Clock, AlertCircle, Banknote, Users
} from 'lucide-react';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
    AreaChart, Area
} from 'recharts';
import { motion } from 'motion/react';
import { WorkEntry } from '../types';

interface AnalyticsViewProps {
    entries: WorkEntry[];
    onBack: () => void;
}

const COLORS = {
    Completed: '#10b981', // Emerald 500
    'Pending Approval': '#f59e0b', // Amber 500
    Assigned: '#3b82f6', // Blue 500
    Initiated: '#8b5cf6', // Violet 500
    'Document Requested': '#ec4899', // Pink 500
    'Not Assigned': '#94a3b8', // Slate 400
    Received: '#10b981',
    'Not Received': '#ef4444', // Rose 500
};

export default function AnalyticsView({ entries, onBack }: AnalyticsViewProps) {
    // Data Processing
    const stats = useMemo(() => {
        const total = entries.length;
        const completed = entries.filter(e => e.status === 'Completed').length;
        const pending = entries.filter(e => e.status !== 'Completed').length;
        const totalReceived = entries.filter(e => e.paymentStatus === 'Received').reduce((acc, curr) => acc + curr.amount, 0);
        const totalPending = entries.filter(e => e.paymentStatus === 'Not Received').reduce((acc, curr) => acc + curr.amount, 0);

        // Status Distribution
        const statusData = Object.entries(
            entries.reduce((acc: any, curr) => {
                acc[curr.status] = (acc[curr.status] || 0) + 1;
                return acc;
            }, {})
        ).map(([name, value]) => ({ name, value }));

        // Payment Distribution
        const paymentData = [
            { name: 'Received', value: totalReceived },
            { name: 'Pending', value: totalPending }
        ];

        // Member Distribution
        const memberData = Object.entries(
            entries.reduce((acc: any, curr) => {
                acc[curr.assignedTo] = (acc[curr.assignedTo] || 0) + 1;
                return acc;
            }, {})
        ).map(([name, count]) => ({ name, count }))
            .sort((a, b) => (b.count as number) - (a.count as number))
            .slice(0, 5);

        // Date Trend (Last 7 days or more)
        const dateTrend = Object.entries(
            entries.reduce((acc: any, curr) => {
                acc[curr.date] = (acc[curr.date] || 0) + 1;
                return acc;
            }, {})
        ).map(([date, count]) => ({ date: date.split('-').slice(1).join('/'), count }))
            .sort((a, b) => a.date.localeCompare(b.date))
            .slice(-10);

        return { total, completed, pending, totalReceived, totalPending, statusData, paymentData, memberData, dateTrend };
    }, [entries]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col gap-6 p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto w-full"
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 mr-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-all shadow-sm group"
                    >
                        <ArrowLeft className="w-5 h-5 text-slate-600 group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Analytics Dashboard</h2>
                        <p className="text-sm text-slate-500 font-medium">Visual insights into your firm's performance</p>
                    </div>
                </div>
                <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary/5 text-primary rounded-full border border-primary/10">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Live Insights</span>
                </div>
            </div>

            {/* Top Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Tasks', value: stats.total, icon: BarChart3, color: 'text-primary', bg: 'bg-primary/5' },
                    { label: 'Completed', value: stats.completed, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Revenue Received', value: `₹${stats.totalReceived.toLocaleString('en-IN')}`, icon: Banknote, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Pending Payment', value: `₹${stats.totalPending.toLocaleString('en-IN')}`, icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col gap-1"
                    >
                        <div className={`w-8 h-8 ${stat.bg} ${stat.color} rounded-lg flex items-center justify-center mb-1`}>
                            <stat.icon className="w-4 h-4" />
                        </div>
                        <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">{stat.label}</p>
                        <p className={`text-lg sm:text-2xl font-black ${stat.color} tracking-tight`}>{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Status Distribution (Pie) */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm">
                    <div className="flex items-center gap-2 mb-6">
                        <PieIcon className="w-5 h-5 text-primary" />
                        <h3 className="font-bold text-slate-800 uppercase tracking-widest text-xs">Work Status Distribution</h3>
                    </div>
                    <div className="h-[280px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats.statusData}
                                    innerRadius={60}
                                    outerRadius={90}
                                    paddingAngle={5}
                                    dataKey="value"
                                    animationBegin={200}
                                    animationDuration={1500}
                                >
                                    {stats.statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS] || '#94a3b8'} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Member Workload (Bar) */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm">
                    <div className="flex items-center gap-2 mb-6">
                        <Users className="w-5 h-5 text-primary" />
                        <h3 className="font-bold text-slate-800 uppercase tracking-widest text-xs">Top Member Workload</h3>
                    </div>
                    <div className="h-[280px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.memberData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
                                <YAxis hide />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="count" fill="#2B59D3" radius={[8, 8, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Work Trend (Line/Area) */}
                <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm">
                    <div className="flex items-center gap-2 mb-6">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        <h3 className="font-bold text-slate-800 uppercase tracking-widest text-xs">Work Volume Trend</h3>
                    </div>
                    <div className="h-[280px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.dateTrend}>
                                <defs>
                                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2B59D3" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#2B59D3" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="date" fontSize={10} axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} fontSize={10} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area type="monotone" dataKey="count" stroke="#2B59D3" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Revenue Collection (Pie) */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-3xl border border-slate-700 shadow-xl text-white">
                    <div className="flex items-center gap-2 mb-6 text-white/90">
                        <Banknote className="w-5 h-5" />
                        <h3 className="font-bold uppercase tracking-widest text-xs">Revenue Collection</h3>
                    </div>
                    <div className="h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats.paymentData}
                                    innerRadius={45}
                                    outerRadius={70}
                                    paddingAngle={8}
                                    dataKey="value"
                                >
                                    <Cell fill="#10b981" />
                                    <Cell fill="#ef4444" />
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Collected</span>
                            <span className="text-sm font-bold text-emerald-400">₹{stats.totalReceived.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="h-px bg-slate-700" />
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Outstanding</span>
                            <span className="text-sm font-bold text-rose-400">₹{stats.totalPending.toLocaleString('en-IN')}</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
