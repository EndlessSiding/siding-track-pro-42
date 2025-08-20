
import { useParams, useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { QuoteForm } from "@/components/forms/QuoteForm";

export default function QuoteEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { quotes, updateQuote } = useApp();
  const { t } = useLanguage();

  const quote = quotes.find(q => q.id === id);

  if (!quote) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-foreground mb-2">{t('quotes.notFound')}</h1>
          <p className="text-muted-foreground mb-4">{t('quotes.notFoundDesc')}</p>
          <Button onClick={() => navigate('/quotes')}>
            {t('quotes.backToQuotes')}
          </Button>
        </div>
      </div>
    );
  }

  const handleSubmit = (quoteData: any) => {
    updateQuote(quote.id, quoteData);
    navigate(`/quotes/${quote.id}`);
  };

  const handleCancel = () => {
    navigate(`/quotes/${quote.id}`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(`/quotes/${quote.id}`)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('quotes.editQuote')}</h1>
          <p className="text-muted-foreground">
            {t('quotes.editQuote')} "{quote.id}"
          </p>
        </div>
      </div>

      <QuoteForm
        quote={quote}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}
