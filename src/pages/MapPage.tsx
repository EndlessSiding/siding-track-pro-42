
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Navigation, Building2 } from "lucide-react";
import ProjectsMap from "@/components/ProjectsMap";
import { useApp } from "@/contexts/AppContext";

const MapPage = () => {
  const [activeTab, setActiveTab] = useState("map");
  const { projects } = useApp();

  return (
    <div className="w-full h-full p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Mapa de Projetos</h1>
          <p className="text-muted-foreground">
            Visualize todos os seus projetos em um mapa interativo.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:w-fit">
          <TabsTrigger value="map">Mapa</TabsTrigger>
          <TabsTrigger value="list">Lista</TabsTrigger>
        </TabsList>

        <TabsContent value="map" className="w-full h-[600px]">
          <ProjectsMap projects={projects} />
        </TabsContent>

        <TabsContent value="list" className="w-full">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Todos os Projetos
              </CardTitle>
              <CardDescription>
                Lista completa de projetos com endereços
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {projects.map((project) => (
                  <div key={project.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{project.name}</p>
                        <p className="text-sm text-muted-foreground">{project.address}</p>
                        <p className="text-xs text-muted-foreground">Cliente: {project.client}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        project.status === 'completed' ? 'bg-green-100 text-green-800' :
                        project.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                        project.status === 'planning' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {project.status === 'completed' ? 'Concluído' :
                         project.status === 'in-progress' ? 'Em Andamento' :
                         project.status === 'planning' ? 'Planejamento' : 'Pausado'}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Progresso: {project.progress}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MapPage;
