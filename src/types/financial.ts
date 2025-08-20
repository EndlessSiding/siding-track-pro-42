
export interface Invoice {
  id: string;
  projectId: string;
  clientId: string;
  amount: number;
  status: "draft" | "sent" | "paid" | "overdue";
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  paidDate?: string;
  paymentMethod?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Expense {
  id: string;
  projectId?: string;
  category: "materials" | "labor" | "equipment" | "transportation" | "other";
  description: string;
  amount: number;
  date: string;
  receipt?: string;
  vendor?: string;
}

export interface Quote {
  id: string;
  clientId: string;
  projectName: string;
  status: "draft" | "sent" | "approved" | "rejected" | "expired";
  totalAmount: number;
  validUntil: string;
  createdDate: string;
  items: QuoteItem[];
  notes?: string;
}

export interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  category: "materials" | "labor" | "equipment";
}
