
import { useParams, useNavigate, Link } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Edit, Calendar, DollarSign, FileText, User, Download, Send, Trash2 } from "lucide-react";

const statusColors = {
  draft: "bg-gray-100 text-gray-800",
  sent: "bg-blue-100 text-blue-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  expired: "bg-orange-100 text-orange-800",
};

export default function QuoteDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { quotes, clients, deleteQuote } = useApp();

  const quote = quotes.find(q => q.id === id);
  const client = clients.find(c => c.id === quote?.clientId);

  if (!quote) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-foreground mb-2">Orçamento não encontrado</h1>
          <p className="text-muted-foreground mb-4">O orçamento solicitado não existe ou foi removido.</p>
          <Button onClick={() => navigate('/quotes')}>
            Voltar para Orçamentos
          </Button>
        </div>
      </div>
    );
  }

  const handleDelete = () => {
    if (window.confirm('Tem certeza que deseja excluir este orçamento?')) {
      deleteQuote(quote.id);
      navigate('/quotes');
    }
  };

  const materialItems = quote.items.filter(item => item.category === 'materials');
  const laborItems = quote.items.filter(item => item.category === 'labor');
  const equipmentItems = quote.items.filter(item => item.category === 'equipment');

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/quotes')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{quote.id}</h1>
            <p className="text-muted-foreground">
              {quote.projectName} - {client?.name}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Baixar PDF
          </Button>
          <Button variant="outline" className="gap-2">
            <Send className="h-4 w-4" />
            Enviar
          </Button>
          <Link to={`/quotes/${quote.id}/edit`}>
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
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Informações do Orçamento</span>
                <Badge className={statusColors[quote.status]}>
                  {quote.status === "sent" ? "Enviado" :
                   quote.status === "approved" ? "Aprovado" :
                   quote.status === "rejected" ? "Rejeitado" :
                   quote.status === "expired" ? "Expirado" : "Rascunho"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Data de Criação</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(quote.createdDate).toLocaleDateString('en-US')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Válido até</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(quote.validUntil).toLocaleDateString('en-US')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Nome do Projeto</p>
                  <p className="text-sm text-muted-foreground">{quote.projectName}</p>
                </div>
              </div>

              {quote.notes && (
                <div>
                  <p className="text-sm font-medium">Observações</p>
                  <p className="text-sm text-muted-foreground">{quote.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Items */}
          <Card>
            <CardHeader>
              <CardTitle>Itens do Orçamento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {materialItems.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3">Materiais</h4>
                  <div className="space-y-2">
                    {materialItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div>
                          <p className="font-medium">{item.description}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.quantity} x $ {item.unitPrice.toLocaleString()}
                          </p>
                        </div>
                        <span className="font-medium">$ {item.total.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {laborItems.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3">Mão de Obra</h4>
                  <div className="space-y-2">
                    {laborItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div>
                          <p className="font-medium">{item.description}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.quantity} x $ {item.unitPrice.toLocaleString()}
                          </p>
                        </div>
                        <span className="font-medium">$ {item.total.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {equipmentItems.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3">Equipamentos</h4>
                  <div className="space-y-2">
                    {equipmentItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div>
                          <p className="font-medium">{item.description}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.quantity} x $ {item.unitPrice.toLocaleString()}
                          </p>
                        </div>
                        <span className="font-medium">$ {item.total.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Separator />
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total</span>
                <span>$ {quote.totalAmount.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
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
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">
                  $ {quote.totalAmount.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Total quote value</p>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Materiais</span>
                  <span>$ {materialItems.reduce((sum, item) => sum + item.total, 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Mão de Obra</span>
                  <span>$ {laborItems.reduce((sum, item) => sum + item.total, 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Equipamentos</span>
                  <span>$ {equipmentItems.reduce((sum, item) => sum + item.total, 0).toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informações do Cliente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm font-medium">{client?.name}</p>
                {client?.email && (
                  <p className="text-sm text-muted-foreground">{client.email}</p>
                )}
                {client?.phone && (
                  <p className="text-sm text-muted-foreground">{client.phone}</p>
                )}
              </div>
              {client && (
                <Link to={`/clients/${client.id}`}>
                  <Button variant="outline" size="sm" className="w-full">
                    Ver Perfil do Cliente
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
