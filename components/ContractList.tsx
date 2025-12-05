import React, { useState } from 'react';
import { Contract, ContractStatus, RiskLevel } from '../types';
import { Search, Filter, Eye, AlertTriangle, CheckCircle, Clock, ChevronRight } from 'lucide-react';

interface ContractListProps {
  contracts: Contract[];
  onViewDetails: (contract: Contract) => void;
}

export const ContractList: React.FC<ContractListProps> = ({ contracts, onViewDetails }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [riskFilter, setRiskFilter] = useState<string>('all');

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = 
      contract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.partnerName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || contract.status === statusFilter;
    const matchesRisk = riskFilter === 'all' || contract.riskLevel === riskFilter;

    return matchesSearch && matchesStatus && matchesRisk;
  });

  const getStatusBadge = (status: ContractStatus) => {
    switch (status) {
      case ContractStatus.ACTIVE:
        return <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"><CheckCircle size={12} className="mr-1.5"/> Aktiv</span>;
      case ContractStatus.EXPIRING_SOON:
        return <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20"><Clock size={12} className="mr-1.5"/> Bald fällig</span>;
      case ContractStatus.EXPIRED:
        return <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20"><AlertTriangle size={12} className="mr-1.5"/> Abgelaufen</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-700 text-slate-300 border border-slate-600">{status}</span>;
    }
  };

  const getRiskBadge = (risk: RiskLevel) => {
    const colors = {
      [RiskLevel.LOW]: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      [RiskLevel.MEDIUM]: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      [RiskLevel.HIGH]: 'bg-red-500/10 text-red-400 border-red-500/20',
      [RiskLevel.UNKNOWN]: 'bg-slate-700 text-slate-300 border-slate-600',
    };
    return <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${colors[risk]}`}>{risk}</span>;
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-white/5 shadow-2xl overflow-hidden flex flex-col h-[calc(100vh-160px)] animate-in fade-in duration-500">
      {/* Header & Filter Bar */}
      <div className="p-6 border-b border-white/5 space-y-4 shrink-0 bg-slate-900/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
             <div className="h-8 w-1.5 bg-blue-500 rounded-full"></div>
             <h2 className="text-xl font-bold text-white">Vertragsdatenbank</h2>
          </div>
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 group-hover:text-blue-400 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Suchen nach Titel, Partner..." 
              className="pl-10 pr-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none w-full md:w-80 text-slate-200 placeholder-slate-600 transition-all shadow-inner"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="flex items-center space-x-2 mr-2 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-white/5">
            <Filter size={14} className="text-slate-400" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Filter</span>
          </div>
          
          <select 
            className="text-sm bg-slate-950/50 border border-slate-700 text-slate-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500/20 px-3 py-1.5 outline-none hover:bg-slate-800 transition-colors cursor-pointer"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Alle Status</option>
            {Object.values(ContractStatus).map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <select 
            className="text-sm bg-slate-950/50 border border-slate-700 text-slate-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500/20 px-3 py-1.5 outline-none hover:bg-slate-800 transition-colors cursor-pointer"
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
          >
            <option value="all">Alle Risiken</option>
            {Object.values(RiskLevel).map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-auto flex-1 custom-scrollbar">
        <table className="min-w-full divide-y divide-white/5">
          <thead className="bg-slate-950/80 sticky top-0 z-10 backdrop-blur-md">
            <tr>
              <th scope="col" className="px-6 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Titel / Partner</th>
              <th scope="col" className="px-6 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Kategorie</th>
              <th scope="col" className="px-6 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Wert</th>
              <th scope="col" className="px-6 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Risiko</th>
              <th scope="col" className="px-6 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Ablaufdatum</th>
              <th scope="col" className="px-6 py-5 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 bg-transparent">
            {filteredContracts.map((contract) => (
              <tr key={contract.id} className="hover:bg-blue-500/5 transition-all duration-200 group cursor-pointer" onClick={() => onViewDetails(contract)}>
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-slate-200 group-hover:text-blue-400 transition-colors">{contract.title}</span>
                    <span className="text-xs text-slate-500 mt-0.5">{contract.partnerName}</span>
                  </div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <span className="text-xs font-medium text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">{contract.category}</span>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  {getStatusBadge(contract.status)}
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <span className="text-sm font-mono font-medium text-slate-300">
                    {contract.value > 0 
                      ? new Intl.NumberFormat('de-DE', { style: 'currency', currency: contract.currency || 'EUR' }).format(contract.value) 
                      : '-'}
                  </span>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  {getRiskBadge(contract.riskLevel)}
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-sm text-slate-400">
                  {contract.endDate ? new Date(contract.endDate).toLocaleDateString('de-DE') : <span className="text-slate-600 italic">Unbefristet</span>}
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                  <div className="inline-flex items-center justify-center p-2 rounded-full text-slate-600 hover:text-blue-400 hover:bg-blue-500/10 transition-all opacity-0 group-hover:opacity-100">
                    <ChevronRight size={18} />
                  </div>
                </td>
              </tr>
            ))}
            {filteredContracts.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-24 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center">
                    <div className="bg-slate-800/50 p-4 rounded-full mb-4">
                        <Filter size={32} className="text-slate-600" />
                    </div>
                    <p className="font-medium text-slate-400">Keine Verträge gefunden</p>
                    <p className="text-sm text-slate-600 mt-1">Versuchen Sie es mit anderen Suchbegriffen oder Filtern.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};