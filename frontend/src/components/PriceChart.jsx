import React from 'react';
import { ComposedChart, Line, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Area, ResponsiveContainer } from 'recharts';

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

const PriceChart = ({ data }) => {
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
            <div className="bg-card/50 rounded-xl p-4 border border-border overflow-hidden" style={{ height: '480px' }}>
                <div className="relative w-full h-full">
                    {/* Header with Custom Legend */}
                    <div className="flex flex-wrap items-center justify-between mb-4 z-10 relative">
                        <h3 className="text-lg font-semibold text-foreground/80">Price History & Moving Averages</h3>
                        <div className="flex items-center gap-4 text-xs font-semibold">
                            <div className="flex items-center gap-2 text-blue-500">
                                <div className="w-4 h-1 rounded-full bg-blue-500"></div>
                                <span>Close Price</span>
                            </div>
                            <div className="flex items-center gap-2 text-emerald-500">
                                <div className="w-4 h-1 rounded-full bg-emerald-500"></div>
                                <span>10-Day MA</span>
                            </div>
                            <div className="flex items-center gap-2 text-amber-500">
                                <div className="w-4 h-1 rounded-full bg-amber-500"></div>
                                <span>50-Day MA</span>
                            </div>
                        </div>
                    </div>

                    <div className="w-full overflow-x-auto pb-4">
                        <div style={{ minWidth: '800px', height: '400px' }}>
                            <ComposedChart width={800} height={400} data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                <defs>
                                    <linearGradient id="colorClose" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis
                                    dataKey="Date"
                                    stroke="#94a3b8"
                                    fontSize={10}
                                    tickFormatter={(str) => (str && typeof str === 'string') ? str.slice(5) : ''}
                                />
                                <YAxis
                                    domain={['auto', 'auto']}
                                    stroke="#94a3b8"
                                    fontSize={12}
                                    tickFormatter={(val) => `₹${val}`}
                                />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} />
                                {/* Legends Removed from here */}
                                <Area type="monotone" dataKey="Close" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorClose)" connectNulls />
                                <Line type="monotone" dataKey="MA10" stroke="#10b981" strokeWidth={2} dot={false} connectNulls />
                                <Line type="monotone" dataKey="MA50" stroke="#f59e0b" strokeWidth={2} dot={false} connectNulls />
                            </ComposedChart>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* RSI Chart */}
                <div className="bg-card/50 rounded-xl p-4 border border-border">
                    <div className="flex flex-wrap items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-foreground/80">RSI (Relative Strength Index)</h3>
                        <div className="flex items-center gap-4 text-xs font-semibold">
                            <div className="flex items-center gap-2 text-violet-500">
                                <div className="w-4 h-1 rounded-full bg-violet-500"></div>
                                <span>RSI</span>
                            </div>
                        </div>
                    </div>

                    <div className="w-full overflow-x-auto pb-2">
                        <div style={{ minWidth: '400px', height: '250px' }}>
                            <ComposedChart width={400} height={250} data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis
                                    dataKey="Date"
                                    stroke="#94a3b8"
                                    fontSize={10}
                                    tickFormatter={(str) => (str && typeof str === 'string') ? str.slice(5) : ''}
                                />
                                <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={10} ticks={[30, 70]} />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} />
                                <Line type="monotone" dataKey="RSI" stroke="#8b5cf6" strokeWidth={2} dot={false} connectNulls />
                            </ComposedChart>
                        </div>
                    </div>
                </div>

                {/* MACD Chart */}
                <div className="bg-card/50 rounded-xl p-4 border border-border">
                    <div className="flex flex-wrap items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-foreground/80">MACD (Convergence Divergence)</h3>
                        <div className="flex items-center gap-4 text-xs font-semibold">
                            <div className="flex items-center gap-2 text-pink-500">
                                <div className="w-3 h-3 rounded-sm bg-pink-500/60 border border-pink-500"></div>
                                <span>MACD</span>
                            </div>
                            <div className="flex items-center gap-2 text-rose-500">
                                <div className="w-4 h-1 rounded-full bg-rose-500"></div>
                                <span>Signal</span>
                            </div>
                        </div>
                    </div>

                    <div className="w-full overflow-x-auto pb-2">
                        <div style={{ minWidth: '400px', height: '250px' }}>
                            <ComposedChart width={400} height={250} data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis
                                    dataKey="Date"
                                    stroke="#94a3b8"
                                    fontSize={10}
                                    tickFormatter={(str) => (str && typeof str === 'string') ? str.slice(5) : ''}
                                />
                                <YAxis stroke="#94a3b8" fontSize={10} />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} />
                                {/* Replaced Bar with Area to fix 'minPointSize' crash */}
                                <Area type="monotone" dataKey="MACD" fill="#ec4899" stroke="#ec4899" fillOpacity={0.6} connectNulls />
                                <Line type="monotone" dataKey="Signal" stroke="#f43f5e" strokeWidth={2} dot={false} connectNulls />
                            </ComposedChart>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default PriceChart;
