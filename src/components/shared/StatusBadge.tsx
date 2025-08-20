
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  variant?: "project" | "client" | "invoice" | "team";
  className?: string;
}

const statusConfigs = {
  project: {
    planning: { label: "Planejamento", className: "bg-yellow-100 text-yellow-800" },
    "in-progress": { label: "Em Andamento", className: "bg-blue-100 text-blue-800" },
    completed: { label: "Concluído", className: "bg-green-100 text-green-800" },
    "on-hold": { label: "Pausado", className: "bg-red-100 text-red-800" },
  },
  client: {
    active: { label: "Ativo", className: "bg-green-100 text-green-800" },
    inactive: { label: "Inativo", className: "bg-gray-100 text-gray-800" },
    potential: { label: "Potencial", className: "bg-blue-100 text-blue-800" },
  },
  invoice: {
    paid: { label: "Pago", className: "bg-green-100 text-green-800" },
    sent: { label: "Enviado", className: "bg-blue-100 text-blue-800" },
    draft: { label: "Rascunho", className: "bg-gray-100 text-gray-800" },
    overdue: { label: "Atrasado", className: "bg-red-100 text-red-800" },
  },
  team: {
    available: { label: "Disponível", className: "bg-green-100 text-green-800" },
    busy: { label: "Ocupada", className: "bg-red-100 text-red-800" },
    off: { label: "Ausente", className: "bg-gray-100 text-gray-800" },
  },
};

export function StatusBadge({ status, variant = "project", className }: StatusBadgeProps) {
  const config = statusConfigs[variant][status];
  
  if (!config) {
    return (
      <Badge className={cn("bg-gray-100 text-gray-800", className)}>
        {status}
      </Badge>
    );
  }

  return (
    <Badge className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
}
