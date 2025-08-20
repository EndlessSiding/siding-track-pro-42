
export type TableName = 'clients' | 'projects' | 'teams' | 'quotes';

const toNumber = (v: any, fallback = 0): number => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

const toInt = (v: any, fallback = 0): number => {
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : fallback;
};

const toDateYMD = (v: any): string | null => {
  if (!v) return null;
  const d = new Date(v);
  if (isNaN(d.getTime())) return null;
  return d.toISOString().split('T')[0];
};

export function normalizeTableData(data: any[], tableName: TableName): any[] {
  if (!Array.isArray(data)) return [];

  if (tableName === 'clients') {
    return data.map((raw) => {
      const preferred_contact =
        raw.preferred_contact ?? raw.preferredContact ?? 'email';
      const total_projects_value =
        toNumber(raw.total_projects_value ?? raw.totalProjectsValue, 0);
      const last_contact =
        toDateYMD(raw.last_contact ?? raw.lastContact) ?? null;

      return {
        id: raw.id,
        name: raw.name ?? '',
        email: raw.email ?? '',
        phone: raw.phone ?? '',
        address: raw.address ?? '',
        status: raw.status ?? 'active',
        preferred_contact,
        total_projects_value,
        last_contact,
      };
    });
  }

  if (tableName === 'projects') {
    return data.map((raw) => {
      const client_id = raw.client_id ?? raw.clientId ?? null;
      const client_name =
        raw.client_name ?? raw.client ?? raw.clientName ?? '';

      const due_date = toDateYMD(raw.due_date ?? raw.dueDate);
      const start_date = toDateYMD(raw.start_date ?? raw.startDate);
      const team = Array.isArray(raw.team) ? raw.team : [];

      return {
        id: raw.id,
        name: raw.name ?? '',
        client_id,
        client_name,
        address: raw.address ?? '',
        status: raw.status ?? 'planning',
        progress: toInt(raw.progress ?? 0, 0),
        budget: toNumber(raw.budget ?? 0, 0),
        spent: toNumber(raw.spent ?? 0, 0),
        due_date,
        start_date,
        team,
      };
    });
  }

  if (tableName === 'quotes') {
    return data.map((raw) => {
      const valid_until = toDateYMD(raw.valid_until ?? raw.validUntil);
      const items = Array.isArray(raw.items) ? raw.items : [];

      return {
        id: String(raw.id ?? `QT-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`),
        client_id: raw.client_id ?? raw.clientId ?? null,
        project_name: raw.project_name ?? raw.projectName ?? '',
        status: raw.status ?? 'draft',
        total_amount: toNumber(raw.total_amount ?? raw.totalAmount ?? 0, 0),
        valid_until,
        items,
      };
    });
  }

  if (tableName === 'teams') {
    return data.map((raw) => {
      const specialties = Array.isArray(raw.specialties) ? raw.specialties : [];
      const members = Array.isArray(raw.members) ? raw.members : [];

      return {
        id: raw.id,
        name: raw.name ?? '',
        availability: raw.availability ?? 'available',
        specialties,
        members,
        safety: toInt(raw.safety ?? 0, 0),
        quality: toInt(raw.quality ?? 0, 0),
        efficiency: toInt(raw.efficiency ?? 0, 0),
        current_project: raw.current_project ?? raw.currentProject ?? null,
      };
    });
  }

  return data;
}
