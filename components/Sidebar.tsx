import React from 'react';
import { LayoutDashboard, FileText, PlusCircle, Settings, Shield, Hexagon, Building2, Users, Truck, Home, Wallet } from 'lucide-react';
import { ContractCategory, CATEGORY_COLORS, Contract } from '../types';

interface SidebarProps {
  currentView: string;
  onChangeView: (view: string) => void;
  contracts?: Contract[];
  onCategoryFilter?: (category: ContractCategory | null) => void;
  selectedCategory?: ContractCategory | null;
}

// Icons für Kategorien
const CATEGORY_ICONS: Record<ContractCategory, React.ElementType> = {
  [ContractCategory.KUNDEN_BAUPROJEKTE]: Building2,
  [ContractCategory.PERSONAL_DIENSTLEISTER]: Users,
  [ContractCategory.LIEFERANTEN_EINKAUF]: Truck,
  [ContractCategory.IMMOBILIEN]: Home,
  [ContractCategory.FINANZEN_VERSICHERUNGEN]: Wallet
};

// Kurzbezeichnungen für die Sidebar
const CATEGORY_SHORT_NAMES: Record<ContractCategory, string> = {
  [ContractCategory.KUNDEN_BAUPROJEKTE]: 'Kunden & Bau',
  [ContractCategory.PERSONAL_DIENSTLEISTER]: 'Personal',
  [ContractCategory.LIEFERANTEN_EINKAUF]: 'Lieferanten',
  [ContractCategory.IMMOBILIEN]: 'Immobilien',
  [ContractCategory.FINANZEN_VERSICHERUNGEN]: 'Finanzen'
};

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentView, 
  onChangeView, 
  contracts = [],
  onCategoryFilter,
  selectedCategory 
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'contracts', label: 'Verträge', icon: FileText },
    { id: 'upload', label: 'Neu Importieren', icon: PlusCircle },
  ];

  const bottomItems = [
    { id: 'compliance', label: 'Compliance & Risiko', icon: Shield },
    { id: 'settings', label: 'Einstellungen', icon: Settings },
  ];

  // Zähler für jede Kategorie berechnen
  const categoryCounts = Object.values(ContractCategory).reduce((acc, cat) => {
    acc[cat] = contracts.filter(c => c.category === cat).length;
    return acc;
  }, {} as Record<ContractCategory, number>);

  const handleCategoryClick = (category: ContractCategory) => {
    if (onCategoryFilter) {
      // Toggle: Wenn dieselbe Kategorie geklickt wird, Filter aufheben
      if (selectedCategory === category) {
        onCategoryFilter(null);
      } else {
        onCategoryFilter(category);
        // Zur Vertragsliste wechseln
        onChangeView('contracts');
      }
    }
  };

  return (
    <div className="w-72 bg-slate-950/80 backdrop-blur-2xl border-r border-white/5 text-slate-300 flex flex-col h-full shrink-0 relative overflow-hidden z-30">
      {/* Background Accent */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none" />

      <div className="p-8 pb-6 flex items-center space-x-3 relative z-10">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2.5 rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.3)]">
          <Hexagon className="text-white h-7 w-7 fill-white/20" strokeWidth={1.5} />
        </div>
        <div>
          <span className="font-black text-white text-xl tracking-tight block leading-none bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            ContractAI
          </span>
          <span className="text-[10px] text-blue-400 font-bold tracking-[0.2em] uppercase">Enterprise</span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 overflow-y-auto py-6 relative z-10">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 px-4">Menu</div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                  : 'hover:bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] animate-[shimmer_2s_infinite]" />
              )}
              <Icon size={20} className={`transition-colors ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'}`} />
              <span className="font-medium tracking-wide">{item.label}</span>
            </button>
          );
        })}

        {/* Kategorien Sektion */}
        <div className="mt-8 text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 px-4">Kategorien</div>
        <div className="space-y-1">
          {Object.values(ContractCategory).map((category) => {
            const Icon = CATEGORY_ICONS[category];
            const count = categoryCounts[category];
            const color = CATEGORY_COLORS[category];
            const isSelected = selectedCategory === category;
            
            return (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-200 group ${
                  isSelected 
                    ? 'bg-white/10 text-white' 
                    : 'hover:bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className="p-1.5 rounded-lg transition-all"
                    style={{ 
                      backgroundColor: isSelected ? `${color}30` : `${color}15`,
                      color: color 
                    }}
                  >
                    <Icon size={16} />
                  </div>
                  <span className="text-sm font-medium">{CATEGORY_SHORT_NAMES[category]}</span>
                </div>
                <span 
                  className={`text-xs font-bold px-2 py-0.5 rounded-full transition-all ${
                    isSelected 
                      ? 'bg-white/20 text-white' 
                      : 'bg-slate-800 text-slate-500 group-hover:bg-slate-700 group-hover:text-slate-300'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-8 text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 px-4">System</div>
        {bottomItems.map((item) => {
           const Icon = item.icon;
           return (
            <button
              key={item.id}
              className="w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-200 hover:bg-white/5 text-slate-400 hover:text-white group"
            >
              <Icon size={20} className="text-slate-500 group-hover:text-indigo-400" />
              <span className="font-medium tracking-wide">{item.label}</span>
            </button>
           )
        })}
      </nav>

      {/* User & Prominent Copyright Section */}
      <div className="p-6 mt-auto bg-gradient-to-t from-slate-900 to-slate-900/50 border-t border-white/5 relative z-10">
        <div className="flex items-center space-x-3 rounded-xl p-2.5 mb-6 hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-white/5 group">
          <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-lg ring-2 ring-slate-900 group-hover:ring-indigo-500/50 transition-all">
            IM
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-200 truncate group-hover:text-white">Isabel Müller</p>
            <p className="text-xs text-slate-500 truncate">Benutzerin</p>
          </div>
        </div>
        
        {/* BIG COPYRIGHT SECTION */}
        <div className="pt-4 border-t border-white/5">
          <div className="bg-slate-950/50 rounded-2xl p-4 border border-white/5 shadow-inner text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2">Powered by</p>
            
            <h3 className="text-2xl font-black text-white tracking-tight leading-none mb-1 drop-shadow-sm">
              <span className="text-blue-500">GiKS</span> GmbH
            </h3>
            
            <p className="text-[11px] text-slate-400 font-medium mt-1 opacity-60">
              &copy; {new Date().getFullYear()} All Rights Reserved
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
