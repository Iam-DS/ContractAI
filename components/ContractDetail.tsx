import React from 'react';
import { Contract, RiskLevel } from '../types';
import { X, Calendar, DollarSign, Building, AlertTriangle, FileText, Tag, Clock, Download } from 'lucide-react';

interface ContractDetailProps {
  contract: Contract;
  onClose: () => void;
}

export const ContractDetail: React.FC<ContractDetailProps> = ({ contract, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-[#0b1120] rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto flex flex-col border border-slate-800 ring-1 ring-white/10 animate-in zoom-in-95 duration-300 relative">
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>

        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-slate-800 bg-[#0b1120]/90 sticky top-0 z-10 backdrop-blur-xl">
          <div>
            <div className="flex items-center space-x-3 mb-2">
               <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-400 border border-slate-700">
                 {contract.id}
               </span>
               {contract.riskLevel === RiskLevel.HIGH && (
                   <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-red-500 border border-red-500/20">
                     High Risk
                   </span>
               )}
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">{contract.title}</h2>
            <p className="text-sm text-slate-400 flex items-center mt-2 font-medium">
              <Building size={16} className="mr-2 text-blue-500" /> {contract.partnerName}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2.5 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white border border-transparent hover:border-slate-700"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h3 className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-4 flex items-center">
                 <span className="w-8 h-px bg-blue-500 mr-3"></span>
                 Executive Summary
              </h3>
              <div className="bg-slate-800/40 p-6 rounded-2xl text-slate-300 leading-relaxed text-base border border-slate-700/50 shadow-sm">
                {contract.summary}
              </div>
            </section>

            <section>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-5">Vertragsdetails</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-start space-x-4 hover:border-slate-700 transition-colors group">
                  <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl group-hover:bg-blue-500/20 transition-colors"><Calendar size={22}/></div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wide">Laufzeit</p>
                    <p className="font-semibold text-slate-200 mt-1 text-lg">
                      {new Date(contract.startDate).toLocaleDateString('de-DE')} 
                      <span className="mx-2 text-slate-600">-</span>
                      {contract.endDate ? new Date(contract.endDate).toLocaleDateString('de-DE') : 'Unbefristet'}
                    </p>
                  </div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-start space-x-4 hover:border-slate-700 transition-colors group">
                  <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl group-hover:bg-emerald-500/20 transition-colors"><DollarSign size={22}/></div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wide">Vertragswert</p>
                    <p className="font-semibold text-slate-200 mt-1 text-lg">
                      {new Intl.NumberFormat('de-DE', { style: 'currency', currency: contract.currency || 'EUR' }).format(contract.value)}
                    </p>
                  </div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-start space-x-4 hover:border-slate-700 transition-colors group">
                   <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl group-hover:bg-purple-500/20 transition-colors"><Clock size={22}/></div>
                   <div>
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wide">Kündigungsfrist</p>
                    <p className="font-semibold text-slate-200 mt-1 text-lg">{contract.noticePeriod}</p>
                   </div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-start space-x-4 hover:border-slate-700 transition-colors group">
                   <div className="p-3 bg-orange-500/10 text-orange-400 rounded-xl group-hover:bg-orange-500/20 transition-colors"><Tag size={22}/></div>
                   <div>
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wide">Kategorie</p>
                    <p className="font-semibold text-slate-200 mt-1 text-lg">{contract.category}</p>
                   </div>
                </div>
              </div>
            </section>

             <section>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Tags & Metadaten</h3>
              <div className="flex flex-wrap gap-2">
                {contract.tags.map((tag, idx) => (
                  <span key={idx} className="px-4 py-2 bg-slate-900 text-slate-400 border border-slate-800 rounded-lg text-sm font-medium hover:text-white hover:border-slate-600 transition-colors cursor-default">
                    #{tag}
                  </span>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar Info (Risk & File) */}
          <div className="space-y-6">
             <div className={`p-6 rounded-3xl border backdrop-blur-sm ${
               contract.riskLevel === RiskLevel.HIGH ? 'bg-red-500/5 border-red-500/20' : 
               contract.riskLevel === RiskLevel.MEDIUM ? 'bg-amber-500/5 border-amber-500/20' :
               'bg-emerald-500/5 border-emerald-500/20'
             }`}>
               <div className="flex items-center space-x-3 mb-4">
                 <div className={`p-2 rounded-lg ${
                    contract.riskLevel === RiskLevel.HIGH ? 'bg-red-500/20' : 
                    contract.riskLevel === RiskLevel.MEDIUM ? 'bg-amber-500/20' :
                    'bg-emerald-500/20'
                 }`}>
                    <AlertTriangle size={24} className={
                        contract.riskLevel === RiskLevel.HIGH ? 'text-red-400' :
                        contract.riskLevel === RiskLevel.MEDIUM ? 'text-amber-400' :
                        'text-emerald-400'
                    } />
                 </div>
                 <h3 className={`font-bold text-lg ${
                    contract.riskLevel === RiskLevel.HIGH ? 'text-red-400' :
                    contract.riskLevel === RiskLevel.MEDIUM ? 'text-amber-400' :
                    'text-emerald-400'
                 }`}>Risiko: {contract.riskLevel}</h3>
               </div>
               <p className="text-sm text-slate-400 leading-relaxed opacity-90">
                 Die KI-Analyse hat diesen Vertrag basierend auf Haftungsklauseln, Laufzeiten und potenziellen Mehrdeutigkeiten eingestuft.
               </p>
             </div>

             <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6">
               <h3 className="font-bold text-slate-200 mb-4 text-xs uppercase tracking-widest">Originaldatei</h3>
               <div className="flex items-center space-x-4 p-4 bg-black/20 rounded-2xl border border-slate-800 mb-6 group hover:border-blue-500/30 transition-colors cursor-pointer">
                 <div className="p-3 bg-slate-800 rounded-xl text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                    <FileText size={24} strokeWidth={1.5} />
                 </div>
                 <div className="flex-1 overflow-hidden">
                   <p className="text-sm font-bold text-slate-200 truncate group-hover:text-blue-400 transition-colors">{contract.fileName}</p>
                   <p className="text-xs text-slate-500 mt-1">{new Date(contract.uploadedAt).toLocaleDateString()}</p>
                 </div>
               </div>
               <button className="w-full py-3 bg-white text-slate-950 hover:bg-blue-50 font-bold rounded-xl transition-all text-sm shadow-lg shadow-white/5 flex items-center justify-center gap-2">
                 <Download size={18} />
                 Dokument herunterladen
               </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};