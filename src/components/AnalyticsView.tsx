import React, { useMemo } from 'react';
import {
    ArrowLeft, TrendingUp, PieChart as PieIcon
} from 'lucide-react';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend
} from 'recharts';
import { motion } from 'motion/react';
import { WorkEntry } from '../types';

interface AnalyticsViewProps {
    entries: WorkEntry[];
    onBack: () => void;
}

// Modern colors from the user's reference image
const COLORS = [
    '#0ea5e9', // Blue
    '#84cc16', // Green
    '#fbbf24', // Yellow
    '#ef4444', // Red
    '#8b5cf6', // Purple
    '#ec4899', // Pink
    '#06b6d4', // Cyan
];

const STATUS_COLORS: Record<string, string> = {
    'Completed': '#84cc16',
    'Pending Approval': '#fbbf24',
    'Assigned': '#0ea5e9',
    'Initiated': '#8b5cf6',
    'Document Requested': '#ec4899',
    'Not Assigned': '#94a3b8',
};

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 1.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text
            x={x}
            y={y}
            fill="#334155"
            textAnchor={x > cx ? 'start' : 'end'}
            dominantBaseline="central"
            className="text-[10px] sm:text-xs font-bold"
        >
            {`${name} (${(percent * 100).toFixed(0)}%)`}
        </text>
    );
};

export default function AnalyticsView({ entries, onBack }: AnalyticsViewProps) {
    const data = useMemo(() => {
        const counts = entries.reduce((acc: any, curr) => {
            acc[curr.status] = (acc[curr.status] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(counts).map(([name, value]) => ({
            name,
            value: value as number
        })).sort((a, b) => b.value - a.value);
    }, [entries]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col min-h-[80vh] w-full p-4 sm:p-6 lg:p-10 max-w-6xl mx-auto"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 mr-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-all shadow-sm group"
                    >
                        <ArrowLeft className="w-5 h-5 text-slate-600 group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Status Distribution</h2>
                        <p className="text-sm text-slate-500 font-medium">Real-time work profile analysis</p>
                    </div>
                </div>
                <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">High Fidelity Data</span>
                </div>
            </div>

            {/* Central 3D-Style Hero Chart */}
            <div className="flex-1 flex flex-col items-center justify-center">
                <div className="relative w-full aspect-square max-w-[600px] flex items-center justify-center">
                    {/* Background Glow */}
                    <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl -z-10 animate-pulse" />

                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <defs>
                                <filter id="shadow" height="200%">
                                    <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                                    <feOffset dx="0" dy="5" result="offsetblur" />
                                    <feComponentTransfer>
                                        <feFuncA type="linear" slope="0.3" />
                                    </feComponentTransfer>
                                    <feMerge>
                                        <feMergeNode />
                                        <feMergeNode in="SourceGraphic" />
                                    </feMerge>
                                </filter>
                                {data.map((entry, index) => (
                                    <linearGradient key={`grad-${index}`} id={`grad-${index}`} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor={STATUS_COLORS[entry.name] || COLORS[index % COLORS.length]} stopOpacity={1} />
                                        <stop offset="100%" stopColor={STATUS_COLORS[entry.name] || COLORS[index % COLORS.length]} stopOpacity={0.8} />
                                    </linearGradient>
                                ))}
                            </defs>

                            {/* The "3D Depth" Layer */}
                            <Pie
                                data={data}
                                cx="50%"
                                cy="52%"
                                innerRadius={0}
                                outerRadius="65%"
                                dataKey="value"
                                isAnimationActive={false}
                                stroke="none"
                            >
                                {data.map((entry, index) => (
                                    <Cell
                                        key={`cell-depth-${index}`}
                                        fill={STATUS_COLORS[entry.name] || COLORS[index % COLORS.length]}
                                        style={{ filter: 'brightness(0.6)' }}
                                    />
                                ))}
                            </Pie>

                            {/* Main Top Layer */}
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                labelLine={true}
                                label={renderCustomizedLabel}
                                outerRadius="65%"
                                fill="#8884d8"
                                dataKey="value"
                                stroke="#fff"
                                strokeWidth={2}
                                style={{ filter: 'url(#shadow)' }}
                                animationBegin={0}
                                animationDuration={1000}
                            >
                                {data.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={`url(#grad-${index})`}
                                    />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    borderRadius: '16px',
                                    border: 'none',
                                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                                    padding: '12px 16px'
                                }}
                                itemStyle={{ fontWeight: 'bold' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Legend / Info Cards Below */}
                <div className="mt-12 w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    {data.map((entry, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-1"
                        >
                            <div
                                className="w-3 h-3 rounded-full mb-1"
                                style={{ backgroundColor: STATUS_COLORS[entry.name] || COLORS[index % COLORS.length] }}
                            />
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter leading-none">{entry.name}</p>
                            <p className="text-sm font-black text-slate-800 tracking-tight">{entry.value} Tasks</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
