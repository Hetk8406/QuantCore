import React, { useState } from 'react';
import { ComposedChart, Line, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Area, ResponsiveContainer, ReferenceLine } from 'recharts';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Chart Error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-4 border border-red-500 rounded bg-red-50 text-red-900 text-sm">
                    <p className="font-bold">Chart Failed to Render</p>
                    <p>{this.state.error && this.state.error.toString()}</p>
                </div>
            );
        }

        return this.props.children;
    }
}

const PriceChart = ({ data, currencySymbol = '₹' }) => {
    const [showMA10, setShowMA10] = useState(true);
    const [showMA50, setShowMA50] = useState(true);

    // 1. Safety Check: Ensure data exists and is an array
    if (!data || !Array.isArray(data) || data.length === 0) {
        return null;
    }

    // 2. Safety Check: Validate data structure of first item
    const sample = data[0];
    if (!sample || typeof sample !== 'object') {
        return null;
    }

    return (
        <div className="w-full space-y-6 mt-6">

            {/* Price + MA Chart */}
            <div className="bg-card/50 rounded-xl p-4 border border-border" style={{ height: '500px' }}>
                <div className="flex flex-col h-full">
                    {/* Header with Custom Legend & Toggles */}
                    <div className="flex flex-wrap items-center justify-between mb-4 z-10">
                        <h3 className="text-lg font-semibold text-foreground/80">Price Action</h3>
                        <div className="flex items-center gap-4 text-xs font-semibold">
                            <div className="flex items-center gap-2 text-blue-400">
                                <div className="w-3 h-1 bg-blue-400"></div>
                                <span>Close Price</span>
                            </div>

                            {/* Toggle MA10 */}
                            <button
                                onClick={() => setShowMA10(!showMA10)}
                                className={`flex items-center gap-2 transition-opacity ${showMA10 ? 'opacity-100' : 'opacity-40 line-through'}`}
                            >
                                <div className="w-3 h-1 bg-emerald-400"></div>
                                <span className="text-emerald-400">10-Day MA</span>
                            </button>

                            {/* Toggle MA50 */}
                            <button
                                onClick={() => setShowMA50(!showMA50)}
                                className={`flex items-center gap-2 transition-opacity ${showMA50 ? 'opacity-100' : 'opacity-40 line-through'}`}
                            >
                                <div className="w-3 h-1 bg-amber-400"></div>
                                <span className="text-amber-400">50-Day MA</span>
                            </button>
                        </div>
                    </div>

                    <div className="w-full mt-4 h-[400px] overflow-x-auto overflow-y-hidden">
                        <ComposedChart width={800} height={400} data={data} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.4} />
                            <XAxis
                                dataKey="Date"
                                stroke="#cbd5e1"
                                fontSize={12}
                                tickFormatter={(str) => (str && typeof str === 'string') ? str.slice(5) : ''}
                                tick={{ fill: '#94a3b8' }}
                                tickMargin={10}
                            />
                            <YAxis
                                domain={['auto', 'auto']}
                                stroke="#cbd5e1"
                                fontSize={12}
                                tickFormatter={(val) => `${currencySymbol}${val}`}
                                tick={{ fill: '#94a3b8' }}
                                width={60}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', borderRadius: '8px' }}
                                itemStyle={{ fontSize: '12px' }}
                                labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
                                formatter={(value) => [`${currencySymbol}${value}`, "Value"]}
                            />

                            <Line
                                type="monotone"
                                dataKey="Close"
                                stroke="#3b82f6"
                                strokeWidth={3}
                                dot={false}
                                connectNulls
                                name="Close Price"
                            />

                            {showMA10 && (
                                <Line
                                    type="monotone"
                                    dataKey="MA10"
                                    stroke="#10b981"
                                    strokeWidth={2}
                                    dot={false}
                                    connectNulls
                                    name="10-Day MA"
                                />
                            )}

                            {showMA50 && (
                                <Line
                                    type="monotone"
                                    dataKey="MA50"
                                    stroke="#f59e0b"
                                    strokeWidth={2}
                                    dot={false}
                                    connectNulls
                                    name="50-Day MA"
                                />
                            )}
                        </ComposedChart>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* RSI Chart */}
                <div className="bg-card/50 rounded-xl p-4 border border-border block">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-foreground/80">RSI Strength</h3>
                        <span className="text-xs font-bold text-violet-400">RSI</span>
                    </div>

                    <div className="w-full h-[200px] overflow-x-auto overflow-y-hidden">
                        <ComposedChart width={400} height={200} data={data} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.3} />
                            <XAxis dataKey="Date" hide />
                            <YAxis domain={[0, 100]} stroke="#64748b" fontSize={10} ticks={[30, 70]} />
                            <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }} />
                            {/* Reference Lines for Overbought/Oversold */}
                            <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="3 3" strokeOpacity={0.5} />
                            <ReferenceLine y={30} stroke="#22c55e" strokeDasharray="3 3" strokeOpacity={0.5} />
                            <Line type="monotone" dataKey="RSI" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                        </ComposedChart>
                    </div>
                </div>

                {/* MACD Chart */}
                <div className="bg-card/50 rounded-xl p-4 border border-border block">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-foreground/80">MACD Momentum</h3>
                        <div className="flex gap-2 text-xs">
                            <span className="text-pink-500">MACD</span>
                            <span className="text-rose-500">Signal</span>
                        </div>
                    </div>

                    <div className="w-full h-[200px] overflow-x-auto overflow-y-hidden">
                        <ComposedChart width={400} height={200} data={data} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.3} />
                            <XAxis dataKey="Date" hide />
                            <YAxis stroke="#64748b" fontSize={10} />
                            <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }} />
                            <Line type="monotone" dataKey="MACD" stroke="#ec4899" strokeWidth={2} dot={false} />
                            <Line type="monotone" dataKey="Signal" stroke="#f43f5e" strokeWidth={1.5} dot={false} />
                        </ComposedChart>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default PriceChart;
