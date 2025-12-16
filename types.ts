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

// Hauptkategorien für Vertragsklassifikation
export enum ContractCategory {
  KUNDEN_BAUPROJEKTE = 'Kunden & Bauprojekte',
  PERSONAL_DIENSTLEISTER = 'Personal & Dienstleister',
  LIEFERANTEN_EINKAUF = 'Lieferanten & Einkauf',
  IMMOBILIEN = 'Immobilien',
  FINANZEN_VERSICHERUNGEN = 'Finanzen & Versicherungen'
}

// Spezifische Vertragstypen
export enum ContractType {
  // Kunden & Bauprojekte
  WERKVERTRAG = 'Werkvertrag',
  WARTUNGSVERTRAG_BAU = 'Wartungsvertrag',
  RAHMENVERTRAG = 'Rahmenvertrag',
  VOB_B_VERTRAG = 'VOB/B-Vertrag',

  // Personal & Dienstleister
  ARBEITSVERTRAG = 'Arbeitsvertrag',
  TARIFVERTRAG = 'Tarifvertrag',
  SUBUNTERNEHMERVERTRAG = 'Subunternehmervertrag',
  BERATUNGSVERTRAG = 'Beratungsvertrag',
  IT_VERTRAG = 'IT-Vertrag',

  // Lieferanten & Einkauf
  KAUFVERTRAG = 'Kaufvertrag',
  LIEFERVERTRAG = 'Liefervertrag',
  RAHMENLIEFERVERTRAG = 'Rahmenliefervertrag',
  LEASINGVERTRAG = 'Leasingvertrag',
  MIETVERTRAG_MASCHINEN = 'Mietvertrag Maschinen',
  WARTUNGSVERTRAG_FUHRPARK = 'Wartungsvertrag Fuhrpark',

  // Immobilien
  MIETVERTRAG = 'Mietvertrag',
  PACHTVERTRAG = 'Pachtvertrag',
  HAUSVERWALTUNGSVERTRAG = 'Hausverwaltungsvertrag',
  MAKLERVERTRAG = 'Maklervertrag',
  HAUSMEISTERVERTRAG = 'Hausmeistervertrag',
  REINIGUNGSVERTRAG = 'Reinigungsvertrag',

  // Finanzen & Versicherungen
  DARLEHENSVERTRAG = 'Darlehensvertrag',
  KONTOVERTRAG = 'Kontovertrag',
  BUERGSCHAFT = 'Bürgschaft',
  BANKAVAL = 'Bankaval',
  VERSICHERUNGSVERTRAG = 'Versicherungsvertrag',
  GESELLSCHAFTSVERTRAG = 'Gesellschaftsvertrag',

  // Fallback
  SONSTIGER = 'Sonstiger Vertrag'
}

// Mapping von Vertragstyp zu Hauptkategorie
export const CONTRACT_TYPE_TO_CATEGORY: Record<ContractType, ContractCategory> = {
  // Kunden & Bauprojekte
  [ContractType.WERKVERTRAG]: ContractCategory.KUNDEN_BAUPROJEKTE,
  [ContractType.WARTUNGSVERTRAG_BAU]: ContractCategory.KUNDEN_BAUPROJEKTE,
  [ContractType.RAHMENVERTRAG]: ContractCategory.KUNDEN_BAUPROJEKTE,
  [ContractType.VOB_B_VERTRAG]: ContractCategory.KUNDEN_BAUPROJEKTE,

  // Personal & Dienstleister
  [ContractType.ARBEITSVERTRAG]: ContractCategory.PERSONAL_DIENSTLEISTER,
  [ContractType.TARIFVERTRAG]: ContractCategory.PERSONAL_DIENSTLEISTER,
  [ContractType.SUBUNTERNEHMERVERTRAG]: ContractCategory.PERSONAL_DIENSTLEISTER,
  [ContractType.BERATUNGSVERTRAG]: ContractCategory.PERSONAL_DIENSTLEISTER,
  [ContractType.IT_VERTRAG]: ContractCategory.PERSONAL_DIENSTLEISTER,

  // Lieferanten & Einkauf
  [ContractType.KAUFVERTRAG]: ContractCategory.LIEFERANTEN_EINKAUF,
  [ContractType.LIEFERVERTRAG]: ContractCategory.LIEFERANTEN_EINKAUF,
  [ContractType.RAHMENLIEFERVERTRAG]: ContractCategory.LIEFERANTEN_EINKAUF,
  [ContractType.LEASINGVERTRAG]: ContractCategory.LIEFERANTEN_EINKAUF,
  [ContractType.MIETVERTRAG_MASCHINEN]: ContractCategory.LIEFERANTEN_EINKAUF,
  [ContractType.WARTUNGSVERTRAG_FUHRPARK]: ContractCategory.LIEFERANTEN_EINKAUF,

  // Immobilien
  [ContractType.MIETVERTRAG]: ContractCategory.IMMOBILIEN,
  [ContractType.PACHTVERTRAG]: ContractCategory.IMMOBILIEN,
  [ContractType.HAUSVERWALTUNGSVERTRAG]: ContractCategory.IMMOBILIEN,
  [ContractType.MAKLERVERTRAG]: ContractCategory.IMMOBILIEN,
  [ContractType.HAUSMEISTERVERTRAG]: ContractCategory.IMMOBILIEN,
  [ContractType.REINIGUNGSVERTRAG]: ContractCategory.IMMOBILIEN,

  // Finanzen & Versicherungen
  [ContractType.DARLEHENSVERTRAG]: ContractCategory.FINANZEN_VERSICHERUNGEN,
  [ContractType.KONTOVERTRAG]: ContractCategory.FINANZEN_VERSICHERUNGEN,
  [ContractType.BUERGSCHAFT]: ContractCategory.FINANZEN_VERSICHERUNGEN,
  [ContractType.BANKAVAL]: ContractCategory.FINANZEN_VERSICHERUNGEN,
  [ContractType.VERSICHERUNGSVERTRAG]: ContractCategory.FINANZEN_VERSICHERUNGEN,
  [ContractType.GESELLSCHAFTSVERTRAG]: ContractCategory.FINANZEN_VERSICHERUNGEN,

  // Fallback
  [ContractType.SONSTIGER]: ContractCategory.KUNDEN_BAUPROJEKTE
};

// Hilfsfunktion: Vertragstypen pro Kategorie abrufen
export const getContractTypesForCategory = (category: ContractCategory): ContractType[] => {
  return Object.entries(CONTRACT_TYPE_TO_CATEGORY)
    .filter(([_, cat]) => cat === category)
    .map(([type]) => type as ContractType);
};

// Hilfsfunktion: Kategorie aus Vertragstyp ableiten
export const getCategoryForContractType = (contractType: ContractType): ContractCategory => {
  return CONTRACT_TYPE_TO_CATEGORY[contractType] || ContractCategory.KUNDEN_BAUPROJEKTE;
};

// Farben für Hauptkategorien
export const CATEGORY_COLORS: Record<ContractCategory, string> = {
  [ContractCategory.KUNDEN_BAUPROJEKTE]: '#3b82f6',      // Blue
  [ContractCategory.PERSONAL_DIENSTLEISTER]: '#8b5cf6', // Purple
  [ContractCategory.LIEFERANTEN_EINKAUF]: '#10b981',    // Emerald
  [ContractCategory.IMMOBILIEN]: '#f59e0b',             // Amber
  [ContractCategory.FINANZEN_VERSICHERUNGEN]: '#ec4899' // Pink
};

export interface Contract {
  id: string;
  title: string;
  partnerName: string;
  category: ContractCategory;      // Hauptkategorie
  contractType: ContractType;      // Spezifischer Vertragstyp
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
