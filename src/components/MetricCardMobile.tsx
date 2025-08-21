
import { LucideIcon } from "lucide-react";
import { ModernCard } from "@/components/ui/modern-card";

interface MetricCardMobileProps {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  color: "blue" | "green" | "purple" | "orange";
}

const colorClasses = {
  blue: "text-blue-600 bg-blue-50",
  green: "text-green-600 bg-green-50", 
  purple: "text-purple-600 bg-purple-50",
  orange: "text-orange-600 bg-orange-50"
};

export default function MetricCardMobile({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  color 
}: MetricCardMobileProps) {
  return (
    <ModernCard className="p-3">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-muted-foreground truncate mb-1">
            {title}
          </p>
          <p className="text-lg font-bold text-foreground mb-1">
            {value}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {change}
          </p>
        </div>
        <div className={`p-2 rounded-lg flex-shrink-0 ml-2 ${colorClasses[color]}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
    </ModernCard>
  );
}
