export enum ContractStatus {
  ACTIVE = 'Aktiv',
  EXPIRING_SOON = 'Läuft bald ab',
  EXPIRED = 'Abgelaufen',
  DRAFT = 'Entwurf',
  TERMINATED = 'Gekündigt'
}

export enum RiskLevel {
  LOW = 'Niedrig',
  MEDIUM = 'Mittel',
  HIGH = 'Hoch',
  UNKNOWN = 'Unbekannt'
}

export interface Contract {
  id: string;
  title: string;
  partnerName: string;
  category: string; // e.g., Service, Lease, NDA
  status: ContractStatus;
  value: number;
  currency: string;
  startDate: string; // ISO Date
  endDate: string | null; // ISO Date
  noticePeriod: string;
  riskLevel: RiskLevel;
  tags: string[];
  summary: string;
  fileName: string;
  uploadedAt: string;
}

export interface ContractStats {
  totalCount: number;
  totalValue: number;
  expiringSoon: number;
  riskDistribution: {
    low: number;
    medium: number;
    high: number;
  };
}
