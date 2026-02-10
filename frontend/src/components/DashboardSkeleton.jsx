import { motion } from "framer-motion";

const DashboardSkeleton = () => {
    return (
        <div className="space-y-8 animate-pulse">
            {/* Header / Selector Placeholder */}
            <div className="w-full max-w-lg mx-auto h-12 bg-secondary/50 rounded-xl"></div>

            <div className="space-y-8">
                {/* Cards Row Placeholder */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Prediction Card Skeleton */}
                    <div className="p-6 rounded-2xl border border-border bg-card/30 h-[200px] space-y-4">
                        <div className="h-6 w-1/3 bg-secondary/50 rounded"></div>
                        <div className="h-10 w-2/3 bg-secondary/50 rounded"></div>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div className="h-16 bg-secondary/30 rounded"></div>
                            <div className="h-16 bg-secondary/30 rounded"></div>
                        </div>
                    </div>

                    {/* Sentiment Card Skeleton */}
                    <div className="p-6 rounded-2xl border border-border bg-card/30 h-[200px] space-y-4">
                        <div className="flex justify-between">
                            <div className="h-6 w-1/4 bg-secondary/50 rounded"></div>
                            <div className="h-6 w-12 bg-secondary/50 rounded-full"></div>
                        </div>
                        <div className="h-4 w-full bg-secondary/30 rounded"></div>
                        <div className="h-4 w-5/6 bg-secondary/30 rounded"></div>
                        <div className="h-20 w-full bg-secondary/20 rounded mt-4"></div>
                    </div>
                </div>

                {/* Chart Placeholder */}
                <div className="p-6 rounded-2xl border border-border bg-card/30 h-[500px] flex flex-col space-y-4">
                    <div className="flex justify-between items-center mb-4">
                        <div className="h-8 w-1/4 bg-secondary/50 rounded"></div>
                        <div className="flex gap-2">
                            <div className="h-8 w-16 bg-secondary/50 rounded"></div>
                            <div className="h-8 w-16 bg-secondary/50 rounded"></div>
                        </div>
                    </div>
                    {/* Chart Area */}
                    <div className="flex-grow bg-gradient-to-t from-primary/5 to-transparent rounded-lg relative overflow-hidden">
                        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-secondary/20 to-transparent"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardSkeleton;
