import React, { useMemo } from 'react';
import {
    ArrowLeft, TrendingUp
} from 'lucide-react';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip
} from 'recharts';
import { motion } from 'motion/react';
import { WorkEntry } from '../types';

interface AnalyticsViewProps {
    entries: WorkEntry[];
    onBack: () => void;
}

const STATUS_COLORS: Record<string, string> = {
    'Completed': '#84cc16',         // Lime Green (Marketing-like)
    'Pending Approval': '#fbbf24',  // Amber (Travel-like)
    'Assigned': '#0ea5e9',         // Sky Blue (Infrastructure-like)
    'Initiated': '#8b5cf6',        // Purple
    'Document Requested': '#ec4899',// Pink
    'Not Assigned': '#f43f5e',     // Rose (Others-like)
};

const SHADOW_COLORS: Record<string, string> = {
    'Completed': '#4d7c0f',
    'Pending Approval': '#b45309',
    'Assigned': '#0369a1',
    'Initiated': '#6d28d9',
    'Document Requested': '#be185d',
    'Not Assigned': '#9f1239',
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
            className="flex flex-col min-h-screen w-full bg-slate-50/50"
        >
            {/* Header */}
            <div className="flex items-center justify-between p-6 lg:px-10 bg-white border-b border-slate-200">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-all shadow-sm group"
                    >
                        <ArrowLeft className="w-5 h-5 text-slate-600 group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div>
                        <h2 className="text-xl font-black text-slate-900 tracking-tight">3D Work Analytics</h2>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">Expenses Analysis - 3D Pie Chart</p>
                    </div>
                </div>
                <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary/5 text-primary rounded-full border border-primary/10">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Premium Insights</span>
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center -mt-10 overflow-hidden">
                {/* 3D Container */}
                <div
                    className="relative w-full max-w-[1000px] h-[700px] flex items-center justify-center -mt-10"
                    style={{ perspective: '1500px' }}
                >
                    {/* The "Table" Surface for shadows */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-slate-900/5 rounded-full blur-3xl transform rotateX(65deg) translateZ(-50px)" />

                    {/* The 3D Chart Group */}
                    <div
                        className="relative w-full h-full flex items-center justify-center transform-gpu cursor-pointer"
                        style={{
                            transformStyle: 'preserve-3d',
                            transform: 'rotateX(55deg) rotateZ(0deg)',
                        }}
                    >
                        {/* ── Thickness Layers (Draw multiple stacked slices for real depth) ── */}
                        {[...Array(15)].map((_, i) => (
                            <div
                                key={`depth-${i}`}
                                className="absolute inset-0 pointer-events-none"
                                style={{ transform: `translateZ(${-i * 2.5}px)` }}
                            >
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={data}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={0}
                                            outerRadius="48%"
                                            dataKey="value"
                                            isAnimationActive={false}
                                            stroke="none"
                                        >
                                            {data.map((entry, index) => (
                                                <Cell
                                                    key={`cell-depth-${i}-${index}`}
                                                    fill={SHADOW_COLORS[entry.name] || '#334155'}
                                                />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        ))}

                        {/* ── Top Layer (The actual interactive surface) ── */}
                        <div className="absolute inset-0" style={{ transform: 'translateZ(1px)' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius="48%"
                                        dataKey="value"
                                        stroke="#ffffff"
                                        strokeWidth={1}
                                        animationBegin={200}
                                        animationDuration={1500}
                                        labelLine={false}
                                    >
                                        {data.map((entry, index) => (
                                            <Cell
                                                key={`cell-top-${index}`}
                                                fill={STATUS_COLORS[entry.name] || '#94a3b8'}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: '16px',
                                            border: 'none',
                                            boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                                            transform: 'rotateX(-55deg) translateZ(100px)', // Counter rotate tooltip
                                            background: 'rgba(255, 255, 255, 0.95)',
                                            backdropFilter: 'blur(8px)'
                                        }}
                                        itemStyle={{ fontWeight: 'black', color: '#1e293b' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* ── Floating Labels (Positioned in 2D to be readable) ── */}
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                        <div className="w-full h-full relative max-w-[800px] max-h-[800px]">
                            {data.map((entry, index) => {
                                // Simple logic to spread labels around
                                const angle = (index / data.length) * 360 - 90;
                                const rad = angle * (Math.PI / 180);
                                const x = 50 + 48 * Math.cos(rad);
                                const y = 50 + 28 * Math.sin(rad); // Narrower Y to match tilted perspective

                                return (
                                    <motion.div
                                        key={`label-${index}`}
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 1 + index * 0.1 }}
                                        className="absolute flex flex-col items-center gap-1"
                                        style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
                                    >
                                        <div className="bg-white/90 backdrop-blur-sm border border-slate-200 px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                                            <div
                                                className="w-3 h-3 rounded-full"
                                                style={{ backgroundColor: STATUS_COLORS[entry.name] }}
                                            />
                                            <p className="text-xs font-black text-slate-800 whitespace-nowrap">
                                                {entry.name}
                                                <span className="ml-2 text-slate-400">
                                                    {Math.round((entry.value / entries.length) * 100)}%
                                                </span>
                                            </p>
                                        </div>
                                        <div className="h-6 w-px bg-slate-200" />
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Legend / Metrics Grid */}
                <div className="w-full max-w-5xl px-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 py-10">
                    {data.map((entry, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ y: -5 }}
                            className="bg-white p-4 rounded-3xl border border-slate-200/60 shadow-sm flex flex-col items-center justify-center gap-1 text-center"
                        >
                            <div
                                className="w-8 h-8 rounded-xl mb-1 flex items-center justify-center text-white font-bold"
                                style={{ backgroundColor: STATUS_COLORS[entry.name] }}
                            >
                                {entry.value}
                            </div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter leading-none">{entry.name}</p>
                            <p className="text-xs font-black text-slate-900 mt-1">{Math.round((entry.value / entries.length) * 100)}%</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
