import { Link } from 'react-router-dom';
import { TrendingUp, Twitter, Linkedin, Github, Mail, ExternalLink, ShieldCheck } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-[#020617] border-t border-slate-800/50 pt-20 pb-10 relative overflow-hidden font-sans">
            {/* Ambient Background Glow for Footer */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[120px] -z-10" />

            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-16 mb-20 relative z-10">

                {/* Brand Column */}
                <div className="space-y-6">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="p-2 rounded-xl bg-primary/20 border border-primary/30 group-hover:bg-primary/30 transition-all shadow-[0_0_20px_rgba(59,130,246,0.1)]">
                            <TrendingUp className="w-6 h-6 text-primary" />
                        </div>
                        <span className="font-black text-2xl tracking-tighter text-white">Stock<span className="text-primary italic">AI</span></span>
                    </Link>
                    <p className="text-slate-400 text-sm leading-relaxed font-medium">
                        Empowering retail traders with institutional-grade neural models for NIFTY 50 price sequences. 
                        Make data-driven decisions with high-frequency accuracy.
                    </p>
                    <div className="pt-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                        <ShieldCheck className="w-3 h-3" /> Encrypted Analysis Node
                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="font-black text-xs uppercase tracking-[0.2em] text-white mb-6">Platform</h3>
                    <ul className="space-y-4 text-sm font-bold text-slate-400">
                        <li><Link to="/dashboard" className="hover:text-primary transition-all flex items-center gap-2 group">
                            <div className="w-1 h-1 bg-slate-700 rounded-full group-hover:bg-primary" /> Prediction Hub
                        </Link></li>
                        <li><Link to="/analysis" className="hover:text-primary transition-all flex items-center gap-2 group">
                            <div className="w-1 h-1 bg-slate-700 rounded-full group-hover:bg-primary" /> Audit Benchmarks
                        </Link></li>
                        <li><Link to="/heatmap" className="hover:text-primary transition-all flex items-center gap-2 group">
                            <div className="w-1 h-1 bg-slate-700 rounded-full group-hover:bg-primary" /> Market Cityscape
                        </Link></li>
                        <li><Link to="/backtest" className="hover:text-primary transition-all flex items-center gap-2 group">
                            <div className="w-1 h-1 bg-slate-700 rounded-full group-hover:bg-primary" /> Time Machine
                        </Link></li>
                    </ul>
                </div>

                {/* Resources - Now Active */}
                <div>
                    <h3 className="font-black text-xs uppercase tracking-[0.2em] text-white mb-6">Resources</h3>
                    <ul className="space-y-4 text-sm font-bold text-slate-400">
                        <li><Link to="/docs" className="hover:text-primary transition-all flex items-center gap-2 group">
                            <div className="w-1 h-1 bg-slate-700 rounded-full group-hover:bg-primary" /> Neural Manual
                        </Link></li>
                        <li>
                            <a 
                                href="http://127.0.0.1:8000/docs" 
                                target="_blank" 
                                rel="noreferrer"
                                className="hover:text-primary transition-all flex items-center gap-2 group text-emerald-400/80"
                            >
                                <div className="w-1 h-1 bg-emerald-500/50 rounded-full group-hover:bg-emerald-400" /> 
                                Live API Swap <ExternalLink className="w-3 h-3" />
                            </a>
                        </li>
                        <li className="opacity-50 cursor-not-allowed">
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-1 bg-slate-800 rounded-full" /> Quant Discord 
                                <span className="text-[9px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-500">Soon</span>
                            </div>
                        </li>
                        <li><Link to="/terms" className="hover:text-primary transition-all flex items-center gap-2 group">
                            <div className="w-1 h-1 bg-slate-700 rounded-full group-hover:bg-primary" /> Legal Intelligence
                        </Link></li>
                    </ul>
                </div>

                {/* Connect */}
                <div>
                    <h3 className="font-black text-xs uppercase tracking-[0.2em] text-white mb-6">Connect</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <SocialLink href="https://x.com/KikaniHet" icon={<Twitter className="w-4 h-4" />} label="X.com" />
                        <SocialLink href="https://www.linkedin.com/in/het-kikani-67817236b/" icon={<Linkedin className="w-4 h-4" />} label="LinkedIn" />
                        <SocialLink href="https://github.com/Hetk8406" icon={<Github className="w-4 h-4" />} label="Github" />
                        <SocialLink href="mailto:hetkikani990@gmail.com" icon={<Mail className="w-4 h-4" />} label="Direct" />
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="max-w-7xl mx-auto px-6 pt-10 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                <p>&copy; {new Date().getFullYear()} STOCK AI QUANT VISION. ALL RIGHTS RESERVED.</p>
                <div className="flex gap-10">
                    <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> ENGINE ONLINE</span>
                    <span className="text-slate-600">YAHOO FINANCE DATA DRAIN</span>
                </div>
            </div>
        </footer>
    );
};

const SocialLink = ({ href, icon, label }) => (
    <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/50 border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white hover:border-slate-700 transition-all group overflow-hidden relative"
    >
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        {icon}
        <span className="text-[10px] font-black tracking-widest uppercase">{label}</span>
    </a>
);

export default Footer;
