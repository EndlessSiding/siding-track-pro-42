
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  CheckCircle, 
  FileText, 
  Users, 
  DollarSign,
  Camera
} from "lucide-react";

const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      type: "project_update",
      title: "Smith Residence progress updated",
      description: "Siding installation 65% complete",
      time: "2 hours ago",
      icon: CheckCircle,
      color: "text-green-600"
    },
    {
      id: 2,
      type: "document",
      title: "New photos uploaded",
      description: "Johnson Family Home - 12 images",
      time: "4 hours ago", 
      icon: Camera,
      color: "text-blue-600"
    },
    {
      id: 3,
      type: "payment",
      title: "Payment received",
      description: "$7,500 from Downtown Office Building",
      time: "1 day ago",
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      id: 4,
      type: "team",
      title: "Team assigned",
      description: "Mike Johnson assigned to new project",
      time: "2 days ago",
      icon: Users,
      color: "text-purple-600"
    },
    {
      id: 5,
      type: "quote",
      title: "Quote approved",
      description: "Wilson Residence - $18,500",
      time: "3 days ago",
      icon: FileText,
      color: "text-orange-600"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Activity
        </CardTitle>
        <CardDescription>
          Latest updates from your projects and team
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg bg-slate-100 ${activity.color}`}>
                <activity.icon className="h-4 w-4" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium text-slate-900">{activity.title}</p>
                <p className="text-sm text-slate-600">{activity.description}</p>
                <p className="text-xs text-slate-400">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
