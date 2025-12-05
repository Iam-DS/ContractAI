import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { ContractList } from './components/ContractList';
import { ContractUpload } from './components/ContractUpload';
import { ContractDetail } from './components/ContractDetail';
import { Contract, ContractStatus, RiskLevel } from './types';
import { Plus, Bell } from 'lucide-react';

// Mock Data for Initial State
const MOCK_CONTRACTS: Contract[] = [
  {
    id: '1',
    title: 'Software Lizenzvertrag 2025',
    partnerName: 'TechSolutions GmbH',
    category: 'Lizenz',
    status: ContractStatus.ACTIVE,
    value: 12000,
    currency: 'EUR',
    startDate: '2025-01-01',
    endDate: '2026-12-31',
    noticePeriod: '3 Monate',
    riskLevel: RiskLevel.LOW,
    tags: ['Software', 'IT', 'SaaS'],
    summary: 'Jahreslizenz für CRM Software inklusive Support Level 2.',
    fileName: 'license_tech_2025.pdf',
    uploadedAt: '2024-12-01T10:00:00Z'
  },
  {
    id: '2',
    title: 'Büromietvertrag Zentrale',
    partnerName: 'ImmoTrust AG',
    category: 'Miete',
    status: ContractStatus.ACTIVE,
    value: 45000,
    currency: 'EUR',
    startDate: '2020-05-01',
    endDate: null,
    noticePeriod: '6 Monate',
    riskLevel: RiskLevel.MEDIUM,
    tags: ['Facility', 'Miete', 'Headquarters'],
    summary: 'Unbefristeter Mietvertrag für Büroflächen in Berlin Mitte. Automatische Indexanpassung.',
    fileName: 'lease_office_berlin.pdf',
    uploadedAt: '2020-04-20T09:00:00Z'
  },
  {
    id: '3',
    title: 'Wartungsvertrag Maschinenpark',
    partnerName: 'Industrial Services KG',
    category: 'Dienstleistung',
    status: ContractStatus.ACTIVE,
    value: 8500,
    currency: 'EUR',
    startDate: '2024-11-01',
    endDate: '2026-11-01',
    noticePeriod: '1 Monat',
    riskLevel: RiskLevel.LOW,
    tags: ['Wartung', 'Produktion'],
    summary: 'Wartung der CNC-Fräsen. Reaktionszeit 24h.',
    fileName: 'maintenance_cnc.pdf',
    uploadedAt: '2024-10-15T14:30:00Z'
  },
   {
    id: '4',
    title: 'Exklusivvertriebsvereinbarung',
    partnerName: 'Global Trade Ltd.',
    category: 'Vertrieb',
    status: ContractStatus.ACTIVE,
    value: 150000,
    currency: 'USD',
    startDate: '2024-03-01',
    endDate: '2026-03-01',
    noticePeriod: '6 Monate',
    riskLevel: RiskLevel.HIGH,
    tags: ['Vertrieb', 'International', 'Exklusiv'],
    summary: 'Exklusive Vertriebsrechte für Nordamerika. Enthält Konventionalstrafen bei Nichterfüllung von Quoten.',
    fileName: 'distrib_agreement_na.pdf',
    uploadedAt: '2024-02-01T11:00:00Z'
  }
];

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [contracts, setContracts] = useState<Contract[]>(MOCK_CONTRACTS);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);

  const handleContractAnalyzed = (newContract: Contract) => {
    setContracts(prev => [newContract, ...prev]);
    setCurrentView('contracts');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard contracts={contracts} />;
      case 'contracts':
        return <ContractList contracts={contracts} onViewDetails={setSelectedContract} />;
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

  return (
    <div className="flex h-screen bg-[#020617] font-sans text-slate-200 overflow-hidden">
      <Sidebar currentView={currentView} onChangeView={setCurrentView} />
      
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
              {currentView === 'dashboard' && 'Executive Dashboard'}
              {currentView === 'contracts' && 'Vertragsmanagement'}
              {currentView === 'upload' && 'Intelligente Analyse'}
            </h1>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Willkommen zurück, Isabel</p>
          </div>
          <div className="flex items-center space-x-4">
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