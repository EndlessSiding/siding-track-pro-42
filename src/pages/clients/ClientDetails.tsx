
import { useParams, useNavigate, Link } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Mail, Phone, MapPin, Building, Calendar, DollarSign, Trash2, FileText } from "lucide-react";
import InvoiceDocumentsList from "@/components/invoice/InvoiceDocumentsList";
import { useInvoiceDocuments } from "@/hooks/useInvoiceDocuments";

const statusColors = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-100 text-gray-800",
  potential: "bg-yellow-100 text-yellow-800",
};

export default function ClientDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { clients, projects, deleteClient } = useApp();

  const client = clients.find(c => c.id === id);
  const clientProjects = projects.filter(p => p.clientId === id);
  
  // Get all invoice documents for this client's projects
  const projectIds = clientProjects.map(p => p.id);
  const { documents: allDocuments, deleteDocument } = useInvoiceDocuments();
  const clientDocuments = allDocuments.filter(doc => projectIds.includes(doc.project_id));

  if (!client) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-foreground mb-2">Cliente não encontrado</h1>
          <p className="text-muted-foreground mb-4">O cliente solicitado não existe ou foi removido.</p>
          <Button onClick={() => navigate('/clients')}>
            Voltar para Clientes
          </Button>
        </div>
      </div>
    );
  }

  const handleDelete = () => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      deleteClient(client.id);
      navigate('/clients');
    }
  };

  const totalInvoiceAmount = clientDocuments.reduce((sum, doc) => sum + (doc.amount || 0), 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/clients')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{client.name}</h1>
            <p className="text-muted-foreground">
              Cliente desde {new Date(client.createdAt).toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link to={`/clients/${client.id}/edit`}>
            <Button className="gap-2">
              <Edit className="h-4 w-4" />
              Editar
            </Button>
          </Link>
          <Button variant="destructive" size="icon" onClick={handleDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Informações do Cliente</span>
                <Badge className={statusColors[client.status]}>
                  {client.status === "active" ? "Ativo" :
                   client.status === "inactive" ? "Inativo" : "Potencial"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{client.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Telefone</p>
                    <p className="text-sm text-muted-foreground">{client.phone}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Endereço</p>
                  <p className="text-sm text-muted-foreground">{client.address}</p>
                </div>
              </div>

              {client.company && (
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Empresa</p>
                    <p className="text-sm text-muted-foreground">{client.company}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Contato Preferido</p>
                  <p className="text-sm text-muted-foreground">
                    {client.preferredContact === "email" ? "Email" :
                     client.preferredContact === "phone" ? "Telefone" : "Texto"}
                  </p>
                </div>
              </div>

              {client.lastContact && (
                <div>
                  <p className="text-sm font-medium">Último Contato</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(client.lastContact).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Projects */}
          <Card>
            <CardHeader>
              <CardTitle>Projetos do Cliente</CardTitle>
            </CardHeader>
            <CardContent>
              {clientProjects.length > 0 ? (
                <div className="space-y-3">
                  {clientProjects.map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">{project.name}</p>
                        <p className="text-sm text-muted-foreground">{project.address}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {project.status === "in-progress" ? "Em Andamento" :
                           project.status === "planning" ? "Planejamento" :
                           project.status === "completed" ? "Concluído" : "Pausado"}
                        </Badge>
                        <Link to={`/projects/${project.id}`}>
                          <Button variant="outline" size="sm">
                            Ver Projeto
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  Nenhum projeto encontrado para este cliente.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Invoice Documents */}
          {clientDocuments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Notas Fiscais
                  <span className="text-sm font-normal text-muted-foreground">
                    ({clientDocuments.length} documento{clientDocuments.length !== 1 ? 's' : ''})
                  </span>
                </CardTitle>
                <div className="text-sm text-muted-foreground">
                  Valor total: R$ {totalInvoiceAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
              </CardHeader>
              <CardContent>
                <InvoiceDocumentsList 
                  documents={clientDocuments}
                  onDelete={deleteDocument}
                  showProjectInfo={true}
                />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Resumo Financeiro
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Valor Total de Projetos</span>
                  <span className="font-medium">R$ {client.totalProjectsValue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Projetos Ativos</span>
                  <span className="font-medium">{clientProjects.length}</span>
                </div>
                {totalInvoiceAmount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm">Notas Fiscais</span>
                    <span className="font-medium">R$ {totalInvoiceAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full gap-2">
                <Mail className="h-4 w-4" />
                Enviar Email
              </Button>
              <Button variant="outline" className="w-full gap-2">
                <Phone className="h-4 w-4" />
                Fazer Ligação
              </Button>
              <Link to="/projects" className="block">
                <Button variant="outline" className="w-full">
                  Criar Novo Projeto
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
