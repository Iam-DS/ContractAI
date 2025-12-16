import React, { useState, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { ContractList } from './components/ContractList';
import { ContractUpload } from './components/ContractUpload';
import { ContractDetail } from './components/ContractDetail';
import { Contract, ContractStatus, RiskLevel, ContractCategory, ContractType } from './types';
import { Plus, Bell } from 'lucide-react';

// Mock Data for Initial State - mit neuen Kategorien und Vertragstypen
const MOCK_CONTRACTS: Contract[] = [
  // Personal & Dienstleister
  {
    id: '1',
    title: 'IT-Dienstleistungsvertrag CRM System',
    partnerName: 'TechSolutions GmbH',
    category: ContractCategory.PERSONAL_DIENSTLEISTER,
    contractType: ContractType.IT_VERTRAG,
    status: ContractStatus.ACTIVE,
    value: 12000,
    currency: 'EUR',
    startDate: '2025-01-01',
    endDate: '2026-12-31',
    noticePeriod: '3 Monate',
    riskLevel: RiskLevel.LOW,
    tags: ['Software', 'IT', 'SaaS', 'CRM'],
    summary: 'Jahreslizenz für CRM Software inklusive Support Level 2 und monatliche Updates.',
    fileName: 'it_service_crm_2025.pdf',
    uploadedAt: '2024-12-01T10:00:00Z'
  },
  {
    id: '2',
    title: 'Arbeitsvertrag Senior Developer',
    partnerName: 'Max Mustermann',
    category: ContractCategory.PERSONAL_DIENSTLEISTER,
    contractType: ContractType.ARBEITSVERTRAG,
    status: ContractStatus.ACTIVE,
    value: 75000,
    currency: 'EUR',
    startDate: '2024-06-01',
    endDate: null,
    noticePeriod: '3 Monate zum Quartalsende',
    riskLevel: RiskLevel.LOW,
    tags: ['Personal', 'IT', 'Entwicklung'],
    summary: 'Unbefristeter Arbeitsvertrag für Senior Software Developer Position.',
    fileName: 'arbeitsvertrag_mustermann.pdf',
    uploadedAt: '2024-05-15T09:00:00Z'
  },
  {
    id: '3',
    title: 'Beratungsvertrag Digitalisierung',
    partnerName: 'Digital Consulting AG',
    category: ContractCategory.PERSONAL_DIENSTLEISTER,
    contractType: ContractType.BERATUNGSVERTRAG,
    status: ContractStatus.ACTIVE,
    value: 48000,
    currency: 'EUR',
    startDate: '2024-09-01',
    endDate: '2025-08-31',
    noticePeriod: '2 Monate',
    riskLevel: RiskLevel.MEDIUM,
    tags: ['Beratung', 'Digitalisierung', 'Strategie'],
    summary: 'Strategische Beratung zur digitalen Transformation inkl. Prozessoptimierung.',
    fileName: 'beratung_digital.pdf',
    uploadedAt: '2024-08-20T14:30:00Z'
  },

  // Immobilien
  {
    id: '4',
    title: 'Büromietvertrag Zentrale Berlin',
    partnerName: 'ImmoTrust AG',
    category: ContractCategory.IMMOBILIEN,
    contractType: ContractType.MIETVERTRAG,
    status: ContractStatus.ACTIVE,
    value: 45000,
    currency: 'EUR',
    startDate: '2020-05-01',
    endDate: null,
    noticePeriod: '6 Monate',
    riskLevel: RiskLevel.MEDIUM,
    tags: ['Facility', 'Miete', 'Headquarters', 'Berlin'],
    summary: 'Unbefristeter Mietvertrag für Büroflächen in Berlin Mitte. Automatische Indexanpassung.',
    fileName: 'mietvertrag_berlin.pdf',
    uploadedAt: '2020-04-20T09:00:00Z'
  },
  {
    id: '5',
    title: 'Hausverwaltungsvertrag Immobilie Hamburg',
    partnerName: 'HansaVerwaltung GmbH',
    category: ContractCategory.IMMOBILIEN,
    contractType: ContractType.HAUSVERWALTUNGSVERTRAG,
    status: ContractStatus.ACTIVE,
    value: 3600,
    currency: 'EUR',
    startDate: '2023-01-01',
    endDate: '2025-12-31',
    noticePeriod: '3 Monate',
    riskLevel: RiskLevel.LOW,
    tags: ['Verwaltung', 'Hamburg', 'Facility'],
    summary: 'Vollständige Hausverwaltung inkl. Nebenkostenabrechnung und Mieterbetreuung.',
    fileName: 'hausverwaltung_hamburg.pdf',
    uploadedAt: '2022-11-15T11:00:00Z'
  },
  {
    id: '6',
    title: 'Reinigungsvertrag Bürogebäude',
    partnerName: 'CleanPro Services',
    category: ContractCategory.IMMOBILIEN,
    contractType: ContractType.REINIGUNGSVERTRAG,
    status: ContractStatus.EXPIRING_SOON,
    value: 2400,
    currency: 'EUR',
    startDate: '2024-01-01',
    endDate: '2025-03-31',
    noticePeriod: '1 Monat',
    riskLevel: RiskLevel.LOW,
    tags: ['Reinigung', 'Facility', 'Service'],
    summary: 'Tägliche Büroreinigung und wöchentliche Grundreinigung.',
    fileName: 'reinigung_buero.pdf',
    uploadedAt: '2023-12-01T10:00:00Z'
  },

  // Lieferanten & Einkauf
  {
    id: '7',
    title: 'Wartungsvertrag Maschinenpark',
    partnerName: 'Industrial Services KG',
    category: ContractCategory.LIEFERANTEN_EINKAUF,
    contractType: ContractType.WARTUNGSVERTRAG_FUHRPARK,
    status: ContractStatus.ACTIVE,
    value: 8500,
    currency: 'EUR',
    startDate: '2024-11-01',
    endDate: '2026-11-01',
    noticePeriod: '1 Monat',
    riskLevel: RiskLevel.LOW,
    tags: ['Wartung', 'Produktion', 'Maschinen'],
    summary: 'Wartung der CNC-Fräsen und Drehmaschinen. Reaktionszeit 24h.',
    fileName: 'wartung_maschinen.pdf',
    uploadedAt: '2024-10-15T14:30:00Z'
  },
  {
    id: '8',
    title: 'Rahmenliefervertrag Büromaterial',
    partnerName: 'Office Supplies GmbH',
    category: ContractCategory.LIEFERANTEN_EINKAUF,
    contractType: ContractType.RAHMENLIEFERVERTRAG,
    status: ContractStatus.ACTIVE,
    value: 15000,
    currency: 'EUR',
    startDate: '2024-01-01',
    endDate: '2025-12-31',
    noticePeriod: '3 Monate',
    riskLevel: RiskLevel.LOW,
    tags: ['Einkauf', 'Büro', 'Material'],
    summary: 'Rahmenvertrag für Büromaterialien mit garantierten Mengenrabatten.',
    fileName: 'rahmen_bueromaterial.pdf',
    uploadedAt: '2023-11-20T09:00:00Z'
  },
  {
    id: '9',
    title: 'Leasingvertrag Firmenfahrzeuge',
    partnerName: 'AutoLeasing Plus',
    category: ContractCategory.LIEFERANTEN_EINKAUF,
    contractType: ContractType.LEASINGVERTRAG,
    status: ContractStatus.ACTIVE,
    value: 36000,
    currency: 'EUR',
    startDate: '2023-06-01',
    endDate: '2026-05-31',
    noticePeriod: '6 Monate zum Vertragsende',
    riskLevel: RiskLevel.MEDIUM,
    tags: ['Fuhrpark', 'Leasing', 'Fahrzeuge'],
    summary: 'Leasing von 5 Firmenfahrzeugen inkl. Vollkasko und Wartung.',
    fileName: 'leasing_fahrzeuge.pdf',
    uploadedAt: '2023-05-10T11:30:00Z'
  },

  // Kunden & Bauprojekte
  {
    id: '10',
    title: 'Werkvertrag Lagerhalle München',
    partnerName: 'Bauunternehmung Schmidt GmbH',
    category: ContractCategory.KUNDEN_BAUPROJEKTE,
    contractType: ContractType.WERKVERTRAG,
    status: ContractStatus.ACTIVE,
    value: 850000,
    currency: 'EUR',
    startDate: '2024-03-01',
    endDate: '2025-09-30',
    noticePeriod: 'Nicht anwendbar',
    riskLevel: RiskLevel.HIGH,
    tags: ['Bau', 'Projekt', 'München', 'Lager'],
    summary: 'Neubau einer Lagerhalle mit 5000m² inkl. Bürotrakt. VOB/B-konforme Ausführung.',
    fileName: 'werkvertrag_lagerhalle.pdf',
    uploadedAt: '2024-02-15T08:00:00Z'
  },
  {
    id: '11',
    title: 'Rahmenvertrag Projektentwicklung',
    partnerName: 'ProjectDev Consulting',
    category: ContractCategory.KUNDEN_BAUPROJEKTE,
    contractType: ContractType.RAHMENVERTRAG,
    status: ContractStatus.ACTIVE,
    value: 120000,
    currency: 'EUR',
    startDate: '2024-01-01',
    endDate: '2026-12-31',
    noticePeriod: '6 Monate',
    riskLevel: RiskLevel.MEDIUM,
    tags: ['Projekt', 'Entwicklung', 'Beratung'],
    summary: 'Langfristige Zusammenarbeit für Projektentwicklung und -begleitung.',
    fileName: 'rahmen_projektdev.pdf',
    uploadedAt: '2023-12-01T14:00:00Z'
  },

  // Finanzen & Versicherungen
  {
    id: '12',
    title: 'Darlehensvertrag Investitionskredit',
    partnerName: 'Deutsche Mittelstandsbank',
    category: ContractCategory.FINANZEN_VERSICHERUNGEN,
    contractType: ContractType.DARLEHENSVERTRAG,
    status: ContractStatus.ACTIVE,
    value: 500000,
    currency: 'EUR',
    startDate: '2023-01-15',
    endDate: '2028-01-15',
    noticePeriod: 'Gemäß Tilgungsplan',
    riskLevel: RiskLevel.MEDIUM,
    tags: ['Kredit', 'Investition', 'Bank'],
    summary: 'Investitionskredit für Maschinenpark-Erweiterung. Zinssatz 4,5% p.a. fest.',
    fileName: 'darlehen_investition.pdf',
    uploadedAt: '2023-01-10T10:00:00Z'
  },
  {
    id: '13',
    title: 'Betriebshaftpflichtversicherung',
    partnerName: 'Allianz Versicherung AG',
    category: ContractCategory.FINANZEN_VERSICHERUNGEN,
    contractType: ContractType.VERSICHERUNGSVERTRAG,
    status: ContractStatus.ACTIVE,
    value: 4800,
    currency: 'EUR',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    noticePeriod: '3 Monate zum Jahresende',
    riskLevel: RiskLevel.LOW,
    tags: ['Versicherung', 'Haftpflicht', 'Betrieb'],
    summary: 'Betriebshaftpflicht mit 10 Mio. EUR Deckungssumme.',
    fileName: 'versicherung_haftpflicht.pdf',
    uploadedAt: '2023-11-15T09:00:00Z'
  },
  {
    id: '14',
    title: 'Gesellschaftsvertrag GmbH',
    partnerName: 'Gründungsgesellschafter',
    category: ContractCategory.FINANZEN_VERSICHERUNGEN,
    contractType: ContractType.GESELLSCHAFTSVERTRAG,
    status: ContractStatus.ACTIVE,
    value: 25000,
    currency: 'EUR',
    startDate: '2018-03-01',
    endDate: null,
    noticePeriod: 'Nicht anwendbar',
    riskLevel: RiskLevel.LOW,
    tags: ['GmbH', 'Gesellschaft', 'Gründung'],
    summary: 'Gesellschaftsvertrag der Musterfirma GmbH mit Stammkapital 25.000 EUR.',
    fileName: 'gesellschaftsvertrag.pdf',
    uploadedAt: '2018-03-01T12:00:00Z'
  },
  {
    id: '15',
    title: 'Bürgschaftsvertrag Mietkaution',
    partnerName: 'Sparkasse Berlin',
    category: ContractCategory.FINANZEN_VERSICHERUNGEN,
    contractType: ContractType.BUERGSCHAFT,
    status: ContractStatus.ACTIVE,
    value: 9000,
    currency: 'EUR',
    startDate: '2020-05-01',
    endDate: null,
    noticePeriod: 'Bei Beendigung Mietverhältnis',
    riskLevel: RiskLevel.LOW,
    tags: ['Bürgschaft', 'Kaution', 'Miete'],
    summary: 'Bankbürgschaft als Mietkaution für Büroflächen Berlin.',
    fileName: 'buergschaft_miete.pdf',
    uploadedAt: '2020-04-25T11:00:00Z'
  }
];

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [contracts, setContracts] = useState<Contract[]>(MOCK_CONTRACTS);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ContractCategory | null>(null);

  const handleContractAnalyzed = (newContract: Contract) => {
    setContracts(prev => [newContract, ...prev]);
    setCurrentView('contracts');
  };

  const handleCategoryFilter = (category: ContractCategory | null) => {
    setSelectedCategory(category);
  };

  // Gefilterte Verträge basierend auf der Sidebar-Kategorie
  const filteredContracts = useMemo(() => {
    if (!selectedCategory) return contracts;
    return contracts.filter(c => c.category === selectedCategory);
  }, [contracts, selectedCategory]);

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard contracts={contracts} />;
      case 'contracts':
        return <ContractList contracts={filteredContracts} onViewDetails={setSelectedContract} />;
      case 'upload':
        return (
          <ContractUpload 
            onContractAnalyzed={handleContractAnalyzed} 
            onCancel={() => setCurrentView('dashboard')} 
          />
        );
      default:
        return <div className="p-10 text-slate-500">In Entwicklung...</div>;
    }
  };

  // Dynamischer Header-Titel basierend auf Filter
  const getHeaderTitle = () => {
    if (currentView === 'dashboard') return 'Executive Dashboard';
    if (currentView === 'upload') return 'Intelligente Analyse';
    if (currentView === 'contracts') {
      if (selectedCategory) {
        return `Verträge: ${selectedCategory}`;
      }
      return 'Vertragsmanagement';
    }
    return 'ContractAI';
  };

  return (
    <div className="flex h-screen bg-[#020617] font-sans text-slate-200 overflow-hidden">
      <Sidebar 
        currentView={currentView} 
        onChangeView={setCurrentView}
        contracts={contracts}
        onCategoryFilter={handleCategoryFilter}
        selectedCategory={selectedCategory}
      />
      
      <main className="flex-1 overflow-y-auto relative perspective-1000">
        {/* Sophisticated Background */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-900/10 rounded-full blur-[130px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-900/10 rounded-full blur-[130px]" />
          <div className="absolute top-[30%] left-[40%] w-[20%] h-[20%] bg-purple-900/10 rounded-full blur-[100px]" />
        </div>

        <header className="sticky top-0 z-20 px-8 py-5 flex justify-between items-center backdrop-blur-xl bg-[#020617]/80 border-b border-white/5 transition-all">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              {getHeaderTitle()}
            </h1>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              {selectedCategory && currentView === 'contracts' 
                ? `${filteredContracts.length} Verträge in dieser Kategorie`
                : 'Willkommen zurück, Isabel'
              }
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {selectedCategory && currentView === 'contracts' && (
              <button 
                className="px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                onClick={() => setSelectedCategory(null)}
              >
                Filter zurücksetzen
              </button>
            )}
             <button className="p-2.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors relative">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-[#020617]"></span>
             </button>
             <button 
               className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all flex items-center gap-2"
               onClick={() => setCurrentView('upload')}
             >
               <Plus size={18} strokeWidth={2.5} />
               Neuer Vertrag
             </button>
          </div>
        </header>

        <div className="p-8 max-w-[1600px] mx-auto relative z-10 min-h-full pb-20">
          {renderContent()}
        </div>
      </main>

      {selectedContract && (
        <ContractDetail 
          contract={selectedContract} 
          onClose={() => setSelectedContract(null)} 
        />
      )}
    </div>
  );
}

export default App;
