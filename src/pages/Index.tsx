import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Users, 
  Calendar, 
  TrendingUp, 
  MapPin, 
  Plus,
  Eye,
  Edit,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import ProjectCard from "@/components/ProjectCard";
import MetricCard from "@/components/MetricCard";
import RecentActivity from "@/components/RecentActivity";
import ProjectsMap from "@/components/ProjectsMap";

const Index = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data for demonstration - properly typed
  const metrics = [
    {
      title: "Active Projects",
      value: "12",
      change: "+2 from last month",
      icon: Building2,
      color: "blue" as const
    },
    {
      title: "Total Clients",
      value: "45",
      change: "+5 from last month", 
      icon: Users,
      color: "green" as const
    },
    {
      title: "This Month Revenue",
      value: "$84,250",
      change: "+12% from last month",
      icon: DollarSign,
      color: "purple" as const
    },
    {
      title: "Completion Rate",
      value: "94%",
      change: "+3% from last month",
      icon: TrendingUp,
      color: "orange" as const
    }
  ];

  const projects = [
    {
      id: "1",
      name: "Smith Residence Vinyl Siding",
      client: "John & Jane Smith",
      clientId: "client-1",
      address: "123 Oak Street, Springfield, IL",
      status: "in-progress" as const,
      progress: 65,
      budget: 15000,
      spent: 9750,
      dueDate: "2024-08-15",
      startDate: "2024-06-01",
      team: ["Mike Johnson", "Sarah Davis"]
    },
    {
      id: "2", 
      name: "Downtown Office Building",
      client: "ABC Corporation",
      clientId: "client-2",
      address: "456 Main St, Springfield, IL",
      status: "planning" as const,
      progress: 25,
      budget: 45000,
      spent: 11250,
      dueDate: "2024-09-30",
      startDate: "2024-07-01",
      team: ["Tom Wilson", "Lisa Brown"]
    },
    {
      id: "3",
      name: "Johnson Family Home",
      client: "Robert Johnson",
      clientId: "client-3",
      address: "789 Pine Ave, Springfield, IL",
      status: "completed" as const,
      progress: 100,
      budget: 22000,
      spent: 21500,
      dueDate: "2024-07-20",
      startDate: "2024-05-15",
      team: ["Mike Johnson", "Carlos Rodriguez"]
    }
  ];

  return (
    <div className="w-full h-full p-4 lg:p-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 w-full">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="map">Map View</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Projects */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Recent Projects
                </CardTitle>
                <CardDescription>
                  Your latest project updates and progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projects.slice(0, 3).map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <RecentActivity />
          </div>
        </TabsContent>

        <TabsContent value="projects" className="w-full">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">All Projects</h3>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} detailed />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="map" className="w-full h-[600px]">
          <ProjectsMap projects={projects} />
        </TabsContent>

        <TabsContent value="reports" className="w-full">
          <Card>
            <CardHeader>
              <CardTitle>Reports & Analytics</CardTitle>
              <CardDescription>
                Comprehensive insights into your business performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <TrendingUp className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">Reports Coming Soon</h3>
                <p className="text-slate-600">
                  Advanced reporting and analytics features will be available in the next update.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;
