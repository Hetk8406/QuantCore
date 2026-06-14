import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, Activity, Cpu, ShieldCheck, Globe, Zap } from 'lucide-react';

import StockMarquee from '../components/StockMarquee';

const LandingPage = () => {
    const canvasRef = useRef(null);
    const mouseX = useMotionValue(0.5);
    const mouseY = useMotionValue(0.5);
    const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
    const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

    const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

    useEffect(() => {
        const handleResize = () => setDimensions({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Neural Network Constellation Logic
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const particleCount = 100;
        const particles = [];
        const connectionDistance = 200;

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: (Math.random() - 0.5) * 800,
                y: (Math.random() - 0.5) * 800,
                z: (Math.random() - 0.5) * 800,
                size: Math.random() * 2 + 1,
            });
        }

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Perspective & Rotation
            // We use spring values to drive rotation
            const rotY = (springX.get() - 0.5) * Math.PI * 0.5;
            const rotX = (springY.get() - 0.5) * Math.PI * 0.5;

            const projectedPoints = particles.map(p => {
                // Rotation Y
                let x = p.x * Math.cos(rotY) - p.z * Math.sin(rotY);
                let z = p.x * Math.sin(rotY) + p.z * Math.cos(rotY);
                // Rotation X
                let y = p.y * Math.cos(rotX) - z * Math.sin(rotX);
                z = p.y * Math.sin(rotX) + z * Math.cos(rotX);

                // Perspective Projection
                const focalLength = 600;
                const perspective = focalLength / (focalLength + z);
                return {
                    x: x * perspective + canvas.width / 2,
                    y: y * perspective + canvas.height / 2,
                    z: z,
                    perspective: perspective
                };
            });

            // Draw Connections
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(59, 130, 246, 0.15)';
            ctx.lineWidth = 0.5;
            for (let i = 0; i < projectedPoints.length; i++) {
                for (let j = i + 1; j < projectedPoints.length; j++) {
                    const dx = projectedPoints[i].x - projectedPoints[j].x;
                    const dy = projectedPoints[i].y - projectedPoints[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    
                    if (dist < connectionDistance) {
                        const alpha = (1 - dist / connectionDistance) * 0.3;
                        ctx.strokeStyle = `rgba(59, 130, 246, ${alpha})`;
                        ctx.moveTo(projectedPoints[i].x, projectedPoints[i].y);
                        ctx.lineTo(projectedPoints[j].x, projectedPoints[j].y);
                    }
                }
            }
            ctx.stroke();

            // Draw Neurons
            projectedPoints.forEach(p => {
                const alpha = Math.max(0.1, (p.z + 400) / 800);
                ctx.fillStyle = `rgba(59, 130, 246, ${alpha})`;
                ctx.shadowBlur = 10;
                ctx.shadowColor = '#3b82f6';
                ctx.beginPath();
                ctx.arc(p.x, p.y, 2 * p.perspective, 0, Math.PI * 2);
                ctx.fill();
            });

            animationFrameId = requestAnimationFrame(render);
        };

        render();
        return () => cancelAnimationFrame(animationFrameId);
    }, [dimensions, springX, springY]);

    const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        mouseX.set(clientX / window.innerWidth);
        mouseY.set(clientY / window.innerHeight);
    };

    return (
        <div 
            onMouseMove={handleMouseMove}
            className="min-h-screen bg-[#020617] text-white flex flex-col items-center overflow-hidden relative selection:bg-primary/40"
        >
            {/* --- THE NEURAL CONSTELLATION CANVAS --- */}
            <canvas 
                ref={canvasRef}
                width={dimensions.width}
                height={dimensions.height}
                className="absolute inset-0 z-0 pointer-events-none opacity-60"
            />
            
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#020617_90%)] z-[1]" />

            {/* CONTENT LAYER */}
            <div className="relative z-[20] w-full pt-32">
                <StockMarquee />
            </div>

            <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center justify-center pt-24 pb-20 px-6">
                
                <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="text-center space-y-12"
                >
                    <div className="space-y-6">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-[10px] font-black uppercase tracking-[0.4em] shadow-[0_0_20px_rgba(59,130,246,0.2)]"
                        >
                             <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> Neural Network Active
                        </motion.div>

                        <h1 className="text-7xl md:text-[10rem] font-black tracking-tighter leading-[0.8] drop-shadow-[0_0_50px_rgba(59,130,246,0.3)]">
                            <span className="bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent italic">QUANT</span>
                            <br />
                            <span className="text-primary drop-shadow-[0_0_30px_rgba(59,130,246,0.6)]">CORE</span>
                        </h1>

                        <p className="text-lg md:text-2xl text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed mt-8">
                            Experience the future of Indian market analysis through our 
                            <span className="text-white"> Deep-Neural Prediction Constellation.</span>
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
                        <Link
                            to="/dashboard"
                            className="group relative px-14 py-6 bg-primary text-primary-foreground font-black rounded-3xl transition-all flex items-center gap-3 overflow-hidden shadow-[0_20px_50px_rgba(59,130,246,0.5)] hover:scale-105 active:scale-95"
                        >
                            <span className="relative z-10 uppercase tracking-widest text-sm">Enter Terminal</span> 
                            <ArrowRight className="w-6 h-6 relative z-10 group-hover:translate-x-2 transition-transform" />
                            <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300" />
                        </Link>
                        
                        <Link
                            to="/backtest"
                            className="px-14 py-6 bg-slate-900/50 border border-slate-800 text-white font-black rounded-3xl hover:bg-slate-800 hover:border-slate-700 transition-all backdrop-blur-xl flex items-center gap-3 uppercase tracking-widest text-sm"
                        >
                            <Activity className="w-5 h-5 text-emerald-400" /> Audit Model
                        </Link>
                    </div>
                </motion.div>

                {/* TRUST INDICATORS SECTION */}
                <motion.section 
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="mt-32 w-full grid grid-cols-1 md:grid-cols-3 gap-8"
                >
                    <TrustCard 
                        icon={<Cpu className="w-6 h-6 text-blue-400" />}
                        title="Neural Processing"
                        desc="Self-correcting LSTM nodes analyzing volumes across NIFTY 50."
                    />
                    <TrustCard 
                        icon={<ShieldCheck className="w-6 h-6 text-emerald-400" />}
                        title="Verified Alpha"
                        desc="Historically validated against the 2024 election market shock."
                    />
                    <TrustCard 
                        icon={<Globe className="w-6 h-6 text-indigo-400" />}
                        title="Synthesized Sent."
                        desc="Headlines from 50+ financial sources filtered via NLP."
                    />
                </motion.section>
            </div>
        </div>
    );
};

const TrustCard = ({ icon, title, desc }) => (
    <motion.div 
        whileHover={{ y: -10, scale: 1.02 }}
        className="p-8 rounded-[2.5rem] bg-slate-900/30 border border-slate-800/50 backdrop-blur-3xl hover:bg-slate-900/50 transition-all flex items-start gap-4 shadow-2xl relative group overflow-hidden"
    >
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="p-3 bg-slate-800 rounded-2xl group-hover:bg-primary/20 transition-colors shadow-inner relative z-10">{icon}</div>
        <div className="relative z-10">
            <h3 className="text-lg font-black tracking-tight mb-1 text-white uppercase">{title}</h3>
            <p className="text-xs text-slate-500 font-bold leading-relaxed">{desc}</p>
        </div>
    </motion.div>
);

export default LandingPage;
