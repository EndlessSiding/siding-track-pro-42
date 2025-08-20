
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Filter, Eye, FileText, Calendar, DollarSign, Download, Send, CheckCircle, XCircle, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { useApp } from "@/contexts/AppContext";
import { useLanguage } from "@/contexts/LanguageContext";

const statusColors = {
  draft: "bg-gray-100 text-gray-800",
  sent: "bg-blue-100 text-blue-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  expired: "bg-orange-100 text-orange-800",
};

const statusIcons = {
  draft: FileText,
  sent: Send,
  approved: CheckCircle,
  rejected: XCircle,
  expired: Clock,
};

export default function QuotesPage() {
  const { quotes, addQuote, clients } = useApp();
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCreateQuote = (quoteData: any) => {
    addQuote(quoteData);
    setIsDialogOpen(false);
  };

  const filteredQuotes = quotes.filter((quote) => {
    const client = clients.find(c => c.id === quote.clientId);
    const clientName = client?.name || "";
    const matchesSearch = clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quote.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quote.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || quote.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('quotes.title')}</h1>
          <p className="text-muted-foreground">
            {t('quotes.subtitle')}
          </p>
        </div>
        <QuoteForm
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSubmit={handleCreateQuote}
          onCancel={() => setIsDialogOpen(false)}
          trigger={
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              {t('quotes.newQuote')}
            </Button>
          }
        />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t('quotes.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder={t('common.status')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('quotes.allStatus')}</SelectItem>
                <SelectItem value="draft">{t('quotes.status.draft')}</SelectItem>
                <SelectItem value="sent">{t('quotes.status.sent')}</SelectItem>
                <SelectItem value="approved">{t('quotes.status.approved')}</SelectItem>
                <SelectItem value="rejected">{t('quotes.status.rejected')}</SelectItem>
                <SelectItem value="expired">{t('quotes.status.expired')}</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              {t('quotes.moreFilters')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quotes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredQuotes.map((quote) => {
          const StatusIcon = statusIcons[quote.status];
          const client = clients.find(c => c.id === quote.clientId);
          return (
            <Card key={quote.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{quote.id}</CardTitle>
                    <p className="text-sm text-muted-foreground">{client?.name}</p>
                    <p className="text-sm font-medium">{quote.projectName}</p>
                  </div>
                  <Badge className={statusColors[quote.status]}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {t(`quotes.status.${quote.status}`)}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-2xl font-bold text-primary">
                  <DollarSign className="h-6 w-6" />
                  {quote.totalAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{t('quotes.createdOn')}: {new Date(quote.createdDate).toLocaleDateString('pt-BR')}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{t('quotes.validUntil')}: {new Date(quote.validUntil).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium">{t('quotes.items')}:</p>
                  <div className="text-xs text-muted-foreground space-y-1">
                    {quote.items.slice(0, 2).map((item, index) => (
                      <div key={index} className="flex justify-between">
                        <span>{item.description}</span>
                        <span>{item.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                      </div>
                    ))}
                    {quote.items.length > 2 && (
                      <p className="text-center">... e mais {quote.items.length - 2} itens</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Link to={`/quotes/${quote.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full gap-2">
                      <Eye className="h-4 w-4" />
                      {t('quotes.viewDetails')}
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="h-4 w-4" />
                    PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
