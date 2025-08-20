
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Search, Users, Calendar, Eye, Edit } from "lucide-react";
import { Link } from "react-router-dom";
import TeamForm from "@/components/forms/TeamForm";
import { useApp } from "@/contexts/AppContext";

const availabilityColors = {
  available: "bg-green-100 text-green-800",
  busy: "bg-red-100 text-red-800",
  off: "bg-gray-100 text-gray-800",
};

export default function TeamsPage() {
  const { teams, addTeam } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCreateTeam = (teamData: any) => {
    addTeam({
      ...teamData,
      availability: 'available',
      performance: {
        efficiency: 90,
        quality: 95,
        safety: 100,
      },
    });
    setIsDialogOpen(false);
  };

  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.members.some(member => 
      member.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Equipes</h1>
          <p className="text-muted-foreground">
            Gerencie suas equipes e alocações de projeto
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/teams/schedule">
            <Button variant="outline" className="gap-2">
              <Calendar className="h-4 w-4" />
              Cronograma
            </Button>
          </Link>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Nova Equipe
              </Button>
            </DialogTrigger>
            <TeamForm
              onSubmit={handleCreateTeam}
              onCancel={() => setIsDialogOpen(false)}
            />
          </Dialog>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar equipes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </CardContent>
      </Card>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTeams.map((team) => (
          <Card key={team.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{team.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {team.members.length} membros
                    </span>
                  </div>
                </div>
                <Badge className={availabilityColors[team.availability]}>
                  {team.availability === "available" ? "Disponível" :
                   team.availability === "busy" ? "Ocupada" : "Ausente"}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Members */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Membros</h4>
                {team.members.map((member, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {member.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-sm">
                      <span className="font-medium">{member.name}</span>
                      <span className="text-muted-foreground ml-2">({member.role})</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Current Project */}
              {team.currentProject && (
                <div>
                  <h4 className="font-medium text-sm mb-1">Projeto Atual</h4>
                  <p className="text-sm text-muted-foreground">{team.currentProject}</p>
                </div>
              )}

              {/* Specialties */}
              <div>
                <h4 className="font-medium text-sm mb-2">Especialidades</h4>
                <div className="flex flex-wrap gap-1">
                  {team.specialties.map((specialty, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Performance */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Performance</h4>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Eficiência</span>
                    <span>{team.performance.efficiency}%</span>
                  </div>
                  <Progress value={team.performance.efficiency} className="h-1" />
                  
                  <div className="flex justify-between text-xs">
                    <span>Qualidade</span>
                    <span>{team.performance.quality}%</span>
                  </div>
                  <Progress value={team.performance.quality} className="h-1" />
                  
                  <div className="flex justify-between text-xs">
                    <span>Segurança</span>
                    <span>{team.performance.safety}%</span>
                  </div>
                  <Progress value={team.performance.safety} className="h-1" />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Link to={`/teams/${team.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full gap-2">
                    <Eye className="h-4 w-4" />
                    Ver Detalhes
                  </Button>
                </Link>
                <Link to={`/teams/${team.id}/edit`}>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Edit className="h-4 w-4" />
                    Editar
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
