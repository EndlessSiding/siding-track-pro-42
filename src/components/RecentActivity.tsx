
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  CheckCircle, 
  FileText, 
  Users, 
  DollarSign,
  Camera,
  Plus,
  Edit,
  TrendingUp,
  UserPlus,
  Settings
} from "lucide-react";
import { useActivities } from "@/hooks/useActivities";
import { useLanguage } from "@/contexts/LanguageContext";

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'project_created':
      return Plus;
    case 'project_updated':
      return Edit;
    case 'project_progress':
    case 'checklist_updated':
      return CheckCircle;
    case 'project_completed':
      return CheckCircle;
    case 'client_created':
    case 'client_updated':
      return UserPlus;
    case 'quote_created':
    case 'quote_sent':
    case 'quote_approved':
      return FileText;
    case 'team_assigned':
      return Users;
    case 'payment_received':
      return DollarSign;
    case 'document_uploaded':
      return Camera;
    default:
      return Settings;
  }
};

const getActivityColor = (type: string) => {
  switch (type) {
    case 'project_created':
    case 'client_created':
      return "text-blue-600";
    case 'project_updated':
    case 'client_updated':
      return "text-orange-600";
    case 'project_progress':
    case 'checklist_updated':
    case 'project_completed':
      return "text-green-600";
    case 'quote_created':
    case 'quote_sent':
    case 'quote_approved':
      return "text-purple-600";
    case 'team_assigned':
      return "text-indigo-600";
    case 'payment_received':
      return "text-emerald-600";
    case 'document_uploaded':
      return "text-cyan-600";
    default:
      return "text-slate-600";
  }
};

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
};

const RecentActivity = () => {
  const { activities, loading, error } = useActivities();
  const { t } = useLanguage();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            {t('dashboard.recentActivity')}
          </CardTitle>
          <CardDescription>
            Latest updates from your projects and team
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-start space-x-3">
                <div className="p-2 rounded-lg bg-slate-100 animate-pulse">
                  <div className="h-4 w-4 bg-slate-300 rounded"></div>
                </div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-300 rounded animate-pulse"></div>
                  <div className="h-3 bg-slate-200 rounded animate-pulse w-2/3"></div>
                  <div className="h-2 bg-slate-200 rounded animate-pulse w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            {t('dashboard.recentActivity')}
          </CardTitle>
          <CardDescription>
            Latest updates from your projects and team
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-sm text-slate-500">
              Failed to load recent activities
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          {t('dashboard.recentActivity')}
        </CardTitle>
        <CardDescription>
          Latest updates from your projects and team
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <p className="text-sm text-slate-500">
                No recent activities found
              </p>
              <p className="text-xs text-slate-400 mt-2">
                Activities will appear here when you create or update projects
              </p>
            </div>
          ) : (
            activities.map((activity) => {
              const IconComponent = getActivityIcon(activity.type);
              const iconColor = getActivityColor(activity.type);
              
              return (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg bg-slate-100 dark:bg-slate-800 ${iconColor}`}>
                    <IconComponent className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium text-foreground">{activity.title}</p>
                    {activity.description && (
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {formatTimeAgo(activity.created_at)}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
