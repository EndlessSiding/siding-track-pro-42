
import { motion } from "framer-motion";
import { ModernCard, ModernCardContent } from "@/components/ui/modern-card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  color: "blue" | "green" | "purple" | "orange" | "red";
  index?: number;
}

const colorClasses = {
  blue: "from-blue-500 to-blue-600",
  green: "from-green-500 to-green-600", 
  purple: "from-purple-500 to-purple-600",
  orange: "from-orange-500 to-orange-600",
  red: "from-red-500 to-red-600"
};

const MetricCard = ({ title, value, change, icon: Icon, color, index = 0 }: MetricCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.05 }}
      className="stagger-animation"
      style={{ '--stagger': index } as React.CSSProperties}
    >
      <ModernCard className="relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        
        <ModernCardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground/80 uppercase tracking-wide">
                {title}
              </p>
              <motion.p 
                className="text-3xl font-bold text-foreground"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
              >
                {value}
              </motion.p>
              <p className="text-sm text-green-600 font-medium flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse-soft" />
                {change}
              </p>
            </div>
            
            <motion.div 
              className={cn(
                "p-4 rounded-xl bg-gradient-to-r shadow-lg",
                colorClasses[color]
              )}
              whileHover={{ rotate: 10, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <Icon className="h-6 w-6 text-white" />
            </motion.div>
          </div>
        </ModernCardContent>
      </ModernCard>
    </motion.div>
  );
};

export default MetricCard;
