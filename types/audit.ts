export interface AuditLogEntry {
  id: string;
  actorEmail: string;
  action: string;
  entityType: string;
  entityId: string;
  before?: unknown;
  after?: unknown;
  createdAt: string;
}

export interface AuditLogFilters {
  entityType?: string;
  actorEmail?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  pageSize?: number;
}
