import React from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { Contract, ContractStatus, RiskLevel, ContractCategory, CATEGORY_COLORS } from '../types';
import { AlertCircle, FileText, TrendingUp, ShieldAlert, ArrowUpRight, Building2, Users, Truck, Home, Wallet } from 'lucide-react';

interface DashboardProps {
  contracts: Contract[];
}

const RISK_COLORS = {
  [RiskLevel.LOW]: '#10b981',   // Emerald 500
  [RiskLevel.MEDIUM]: '#f59e0b', // Amber 500
  [RiskLevel.HIGH]: '#ef4444',   // Red 500
  [RiskLevel.UNKNOWN]: '#64748b' // Slate 500
};

// Icons für Kategorien
const CATEGORY_ICONS: Record<ContractCategory, React.ReactNode> = {
  [ContractCategory.KUNDEN_BAUPROJEKTE]: <Building2 size={18} />,
  [ContractCategory.PERSONAL_DIENSTLEISTER]: <Users size={18} />,
  [ContractCategory.LIEFERANTEN_EINKAUF]: <Truck size={18} />,
  [ContractCategory.IMMOBILIEN]: <Home size={18} />,
  [ContractCategory.FINANZEN_VERSICHERUNGEN]: <Wallet size={18} />
};

// Custom Tooltip for Recharts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700 p-4 rounded-xl shadow-2xl text-xs">
        <p className="text-slate-200 font-semibold mb-2 text-sm">{label ? label : payload[0].name}</p>
        <p className="text-slate-400">
          Anzahl: <span className="text-white font-mono font-bold text-base ml-2">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

export const Dashboard: React.FC<DashboardProps> = ({ contracts }) => {
  // Stats Calculation
  const totalValue = contracts.reduce((acc, curr) => acc + (curr.value || 0), 0);
  const expiringSoon = contracts.filter(c => c.status === ContractStatus.EXPIRING_SOON).length;
  const highRisk = contracts.filter(c => c.riskLevel === RiskLevel.HIGH).length;

  // Chart Data Preparation - Hauptkategorien
  const categoryData = Object.entries(
    contracts.reduce((acc, curr) => {
      const cat = curr.category || 'Unbekannt';
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ 
    name, 
    value,
    color: CATEGORY_COLORS[name as ContractCategory] || '#64748b'
  }));

  // Chart Data - Vertragstypen
  const contractTypeData = Object.entries(
    contracts.reduce((acc, curr) => {
      const type = curr.contractType || 'Sonstiger';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6); // Top 6 Vertragstypen

  const riskData = Object.entries(
    contracts.reduce((acc, curr) => {
      acc[curr.riskLevel] = (acc[curr.riskLevel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  // Kategorie-Statistiken für die Karten
  const categoryStats = Object.values(ContractCategory).map(cat => ({
    category: cat,
    count: contracts.filter(c => c.category === cat).length,
    value: contracts.filter(c => c.category === cat).reduce((sum, c) => sum + (c.value || 0), 0),
    color: CATEGORY_COLORS[cat],
    icon: CATEGORY_ICONS[cat]
  }));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-900/60 backdrop-blur-xl p-6 rounded-3xl border border-white/5 shadow-lg relative overflow-hidden group hover:border-blue-500/20 transition-all hover:shadow-blue-500/10 hover:-translate-y-1">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <FileText size={100} className="text-blue-500 transform rotate-12 translate-x-4 -translate-y-4" />
          </div>
          <div className="flex flex-col h-full justify-between relative z-10">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-blue-500/10 text-blue-400 rounded-2xl border border-blue-500/20">
                <FileText size={24} />
              </div>
              <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20 flex items-center">
                +12% <ArrowUpRight size={12} className="ml-1"/>
              </span>
            </div>
            <div className="mt-4">
              <p className="text-slate-400 font-medium text-sm">Aktive Verträge</p>
              <p className="text-4xl font-bold text-white mt-2">{contracts.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-xl p-6 rounded-3xl border border-white/5 shadow-lg relative overflow-hidden group hover:border-emerald-500/20 transition-all hover:shadow-emerald-500/10 hover:-translate-y-1">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <TrendingUp size={100} className="text-emerald-500 transform rotate-12 translate-x-4 -translate-y-4" />
          </div>
          <div className="flex flex-col h-full justify-between relative z-10">
             <div className="flex justify-between items-start">
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20">
                <TrendingUp size={24} />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-slate-400 font-medium text-sm">Gesamtvolumen</p>
              <p className="text-4xl font-bold text-white mt-2 tracking-tight">
                {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(totalValue)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-xl p-6 rounded-3xl border border-white/5 shadow-lg relative overflow-hidden group hover:border-amber-500/20 transition-all hover:shadow-amber-500/10 hover:-translate-y-1">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <AlertCircle size={100} className="text-amber-500 transform rotate-12 translate-x-4 -translate-y-4" />
          </div>
          <div className="flex flex-col h-full justify-between relative z-10">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-amber-500/10 text-amber-400 rounded-2xl border border-amber-500/20">
                <AlertCircle size={24} />
              </div>
              {expiringSoon > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              )}
            </div>
            <div className="mt-4">
              <p className="text-slate-400 font-medium text-sm">Fristenwarnung</p>
              <p className="text-4xl font-bold text-white mt-2">{expiringSoon}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-xl p-6 rounded-3xl border border-white/5 shadow-lg relative overflow-hidden group hover:border-red-500/20 transition-all hover:shadow-red-500/10 hover:-translate-y-1">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <ShieldAlert size={100} className="text-red-500 transform rotate-12 translate-x-4 -translate-y-4" />
          </div>
          <div className="flex flex-col h-full justify-between relative z-10">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-red-500/10 text-red-400 rounded-2xl border border-red-500/20">
                <ShieldAlert size={24} />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-slate-400 font-medium text-sm">Kritische Risiken</p>
              <p className="text-4xl font-bold text-white mt-2">{highRisk}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Kategorie-Übersicht */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {categoryStats.map((stat) => (
          <div 
            key={stat.category}
            className="bg-slate-900/40 backdrop-blur-xl p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-all group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div 
                className="p-2.5 rounded-xl"
                style={{ backgroundColor: `${stat.color}20`, color: stat.color }}
              >
                {stat.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-500 truncate">{stat.category}</p>
                <p className="text-2xl font-bold text-white">{stat.count}</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Volumen</span>
              <span className="text-slate-300 font-medium">
                {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(stat.value)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution - Hauptkategorien */}
        <div className="bg-slate-900/60 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-lg h-[450px] relative">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center">
            <span className="w-1.5 h-6 bg-blue-500 rounded-full mr-3"></span>
            Verträge nach Hauptkategorie
          </h3>
          <ResponsiveContainer width="100%" height="85%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="45%"
                innerRadius={70}
                outerRadius={110}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
              >
                {categoryData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    className="stroke-slate-900 stroke-2 hover:opacity-80 transition-opacity cursor-pointer" 
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={50} 
                iconType="circle"
                iconSize={10}
                formatter={(value) => (
                  <span className="text-slate-400 ml-1 text-xs font-medium">
                    {value.length > 20 ? value.substring(0, 18) + '...' : value}
                  </span>
                )} 
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Distribution */}
        <div className="bg-slate-900/60 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-lg h-[450px]">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center">
            <span className="w-1.5 h-6 bg-purple-500 rounded-full mr-3"></span>
            Risikoanalyse
          </h3>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart
              data={riskData}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#1e293b" />
              <XAxis type="number" stroke="#64748b" tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" width={100} stroke="#94a3b8" tick={{fill: '#94a3b8', fontSize: 13, fontWeight: 500}} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255,255,255,0.03)'}} />
              <Bar dataKey="value" name="Anzahl Verträge" radius={[0, 6, 6, 0]} barSize={30}>
                {riskData.map((entry, index) => (
                   <Cell key={`cell-${index}`} fill={RISK_COLORS[entry.name as RiskLevel] || '#8884d8'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Vertragstypen - Top 6 */}
      <div className="bg-slate-900/60 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-lg">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center">
          <span className="w-1.5 h-6 bg-emerald-500 rounded-full mr-3"></span>
          Top Vertragstypen
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {contractTypeData.map((type, index) => (
            <div 
              key={type.name}
              className="bg-slate-800/50 rounded-2xl p-4 border border-white/5 hover:border-white/10 transition-all"
            >
              <div className="text-3xl font-bold text-white mb-1">{type.value}</div>
              <div className="text-xs text-slate-400 truncate" title={type.name}>{type.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
