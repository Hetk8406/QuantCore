import { Link } from 'react-router-dom';
import { TrendingUp, Twitter, Linkedin, Github, Mail } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-background border-t border-border/40 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

                {/* Brand Column */}
                <div className="space-y-4">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="p-1.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                            <TrendingUp className="w-6 h-6 text-primary" />
                        </div>
                        <span className="font-bold text-lg tracking-tight">StockAI</span>
                    </Link>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                        Empowering retail traders with institutional-grade AI models for NIFTY 50 predictions.
                        Make data-driven decisions with confidence.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="font-bold mb-4">Platform</h3>
                    <ul className="space-y-3 text-sm text-muted-foreground">
                        <li><Link to="/dashboard" className="hover:text-primary transition-colors">Prediction Dashboard</Link></li>
                        <li><Link to="/features" className="hover:text-primary transition-colors">How it Works</Link></li>
                        <li><Link to="/news" className="hover:text-primary transition-colors">Market News</Link></li>
                        <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                    </ul>
                </div>

                {/* Resources */}
                <div>
                    <h3 className="font-bold mb-4">Resources</h3>
                    <ul className="space-y-3 text-sm text-muted-foreground">
                        <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
                        <li><a href="#" className="hover:text-primary transition-colors">API Access</a></li>
                        <li><a href="#" className="hover:text-primary transition-colors">Community Forum</a></li>
                        <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h3 className="font-bold mb-4">Connect</h3>
                    <div className="flex gap-4">
                        <SocialLink href="#" icon={<Twitter className="w-5 h-5" />} />
                        <SocialLink href="#" icon={<Linkedin className="w-5 h-5" />} />
                        <SocialLink href="#" icon={<Github className="w-5 h-5" />} />
                        <SocialLink href="#" icon={<Mail className="w-5 h-5" />} />
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
                <p>&copy; {new Date().getFullYear()} StockAI Predictor. All rights reserved.</p>
                <div className="flex gap-8">
                    <span>Data provided by Yahoo Finance</span>
                    <span>Not financial advice</span>
                </div>
            </div>
        </footer>
    );
};

const SocialLink = ({ href, icon }) => (
    <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="p-2 rounded-full bg-secondary/50 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all"
    >
        {icon}
    </a>
);

export default Footer;
