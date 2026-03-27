import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { TrendingUp, Menu, X, LayoutDashboard, Newspaper, Box, Activity, History, Zap, BarChart3, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Terminal', path: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
        { name: 'MarketPulse', path: '/news', icon: <Newspaper className="w-4 h-4" /> },
        { name: 'Cityscape', path: '/heatmap', icon: <Box className="w-4 h-4" /> },
        { name: 'Analysis', path: '/analysis', icon: <Activity className="w-4 h-4" /> },
        { name: 'Backtest', path: '/backtest', icon: <History className="w-4 h-4" /> },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-500 font-sans ${scrolled
                ? 'py-4 px-6 md:px-12'
                : 'py-8 px-6 md:px-12'
                }`}
        >
            {/* Glass Container */}
            <div className={`max-w-7xl mx-auto rounded-3xl border border-white/10 backdrop-blur-2xl transition-all duration-500 relative flex items-center justify-between px-8 h-18 py-4 ${scrolled
                ? 'bg-slate-900/60 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-primary/20 scale-[0.98]'
                : 'bg-transparent border-transparent'
                }`}>

                {/* Branding */}
                <NavLink to="/" className="flex items-center gap-3 group relative z-10">
                    <div className="p-2 rounded-xl bg-primary/20 border border-primary/30 group-hover:bg-primary/30 transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                        <TrendingUp className="w-6 h-6 text-primary" />
                    </div>
                    <span className="font-black text-xl md:text-2xl tracking-tighter text-white">Stock<span className="text-primary italic">AI</span></span>
                </NavLink>

                {/* Desktop Menu */}
                <div className="hidden lg:flex items-center gap-2">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.name}
                            to={link.path}
                            className={({ isActive }) =>
                                `relative px-4 py-2 text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 rounded-xl border border-transparent ${isActive
                                    ? 'text-primary bg-primary/10 border-primary/20 shadow-inner'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`
                            }
                        >
                            {link.icon}
                            {link.name}

                            {/* Sub-active indicator */}
                            {location.pathname === link.path && (
                                <motion.div
                                    layoutId="navbar-active"
                                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full shadow-[0_0_10px_#3b82f6]"
                                />
                            )}
                        </NavLink>
                    ))}
                </div>

                {/* Action CTA */}
                <div className="hidden lg:flex items-center">
                    <NavLink
                        to="/dashboard"
                        className="px-6 py-2.5 bg-primary text-slate-950 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:scale-105 hover:shadow-primary/50 active:scale-95 transition-all"
                    >
                        Live Terminal
                    </NavLink>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="lg:hidden p-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="lg:hidden absolute top-28 left-6 right-6 bg-slate-900/95 backdrop-blur-3xl border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl z-[1000]"
                    >
                        <div className="flex flex-col space-y-4">
                            {navLinks.map((link) => (
                                <NavLink
                                    key={link.name}
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className={({ isActive }) =>
                                        `flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all ${isActive
                                            ? 'bg-primary/20 text-primary border border-primary/20'
                                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                        }`
                                    }
                                >
                                    <div className="p-2 bg-slate-800 rounded-lg">{link.icon}</div>
                                    {link.name}
                                </NavLink>
                            ))}
                            <NavLink
                                to="/dashboard"
                                onClick={() => setIsOpen(false)}
                                className="mt-4 px-6 py-5 bg-primary text-slate-950 text-center font-black uppercase tracking-[0.3em] rounded-2xl shadow-xl"
                            >
                                Launch Live Terminal
                            </NavLink>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
