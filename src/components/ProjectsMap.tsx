
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Navigation } from "lucide-react";

interface Project {
  id: string;
  name: string;
  client: string;
  address: string;
  status: string;
}

interface ProjectsMapProps {
  projects: Project[];
}

const ProjectsMap = ({ projects }: ProjectsMapProps) => {
  // This is a placeholder for the map component
  // In a real implementation, you would integrate with Google Maps or another mapping service
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Project Locations
          </CardTitle>
          <CardDescription>
            Interactive map showing all your project locations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Map Placeholder */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg h-96 flex items-center justify-center border-2 border-dashed border-blue-200">
            <div className="text-center">
              <MapPin className="h-16 w-16 text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">Interactive Map Coming Soon</h3>
              <p className="text-slate-600 mb-4">
                We'll integrate with Google Maps to show all your project locations
              </p>
              <div className="inline-flex items-center text-blue-600 text-sm">
                <Navigation className="h-4 w-4 mr-2" />
                Map integration will be added in the next update
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Project List with Addresses */}
      <Card>
        <CardHeader>
          <CardTitle>Project Addresses</CardTitle>
          <CardDescription>
            All project locations for quick reference
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {projects.map((project) => (
              <div key={project.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  <div>
                    <p className="font-medium text-slate-900">{project.name}</p>
                    <p className="text-sm text-slate-600">{project.address}</p>
                  </div>
                </div>
                <div className="text-sm text-slate-500">{project.client}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectsMap;
