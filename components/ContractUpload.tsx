import React, { useCallback, useState } from 'react';
import { Upload, Loader2, CheckCircle2, AlertCircle, FileType, Sparkles } from 'lucide-react';
import { analyzeContractWithOllama } from '../services/ollamaService';
import { Contract } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface ContractUploadProps {
  onContractAnalyzed: (contract: Contract) => void;
  onCancel: () => void;
}

export const ContractUpload: React.FC<ContractUploadProps> = ({ onContractAnalyzed, onCancel }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFile = async (file: File) => {
    setIsAnalyzing(true);
    setError(null);

    try {
      // Simulate/Execute AI Analysis
      const analyzedData = await analyzeContractWithOllama(file);
      
      const newContract: Contract = {
        id: uuidv4(),
        ...analyzedData as any,
        tags: analyzedData.tags || [],
      };

      onContractAnalyzed(newContract);
    } catch (err: any) {
      console.error(err);
      setError("Fehler bei der KI-Analyse. Bitte stellen Sie sicher, dass das Dokument lesbar ist und versuchen Sie es erneut.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      processFile(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-in zoom-in-95 duration-500">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center">
          <Sparkles className="mr-3 text-blue-500" size={28}/>
          Neuen Vertrag importieren
        </h2>
        <p className="text-slate-400">Laden Sie Ihre Vertragsdokumente hoch, um die automatische KI-Analyse zu starten.</p>
      </div>
      
      <div className="bg-slate-900/40 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 p-1 relative overflow-hidden group">
        {/* Animated border gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-1000"></div>
        
        <div className="bg-slate-950/90 rounded-[22px] p-12 relative overflow-hidden">
             
            {isAnalyzing ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-8 animate-in fade-in">
                <div className="relative">
                <div className="w-24 h-24 border-4 border-slate-800 rounded-full"></div>
                <div className="absolute top-0 left-0 w-24 h-24 border-4 border-blue-500 rounded-full border-t-transparent animate-spin shadow-[0_0_20px_rgba(59,130,246,0.5)]"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 size={32} className="text-blue-400 animate-pulse" />
                </div>
                </div>
                <div className="text-center z-10">
                <h3 className="text-2xl font-bold text-white mb-2">KI analysiert Dokument...</h3>
                <p className="text-slate-400 max-w-md mx-auto leading-relaxed">Lokale KI extrahiert Metadaten, prüft Klauseln und bewertet Risiken.</p>
                </div>
            </div>
            ) : (
            <div 
                className={`
                relative z-10 border-2 border-dashed rounded-2xl p-16 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300
                ${isDragging 
                    ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_50px_rgba(59,130,246,0.2)] scale-[1.01]' 
                    : 'border-slate-700 hover:border-blue-400/50 hover:bg-slate-900'
                }
                ${error ? 'border-red-500/50 bg-red-500/5' : ''}
                `}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-upload')?.click()}
            >
                {error ? (
                <>
                    <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-6 ring-4 ring-red-500/5 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                    <AlertCircle size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-red-400">Analyse fehlgeschlagen</h3>
                    <p className="text-red-300/80 mt-2 mb-8">{error}</p>
                    <button 
                    onClick={(e) => { e.stopPropagation(); setError(null); }}
                    className="px-8 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-semibold shadow-lg shadow-red-500/20"
                    >
                    Erneut versuchen
                    </button>
                </>
                ) : (
                <>
                    <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-8 ring-8 transition-all duration-500 ${isDragging ? 'bg-blue-500 text-white ring-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.4)]' : 'bg-slate-800 text-slate-400 ring-slate-800/50 group-hover:bg-slate-700 group-hover:text-blue-400 group-hover:ring-slate-700/50'}`}>
                    <Upload size={40} className={isDragging ? 'animate-bounce' : ''} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">Datei hier ablegen</h3>
                    <p className="text-slate-400 text-lg">oder klicken, um Datei auszuwählen</p>
                    
                    <div className="flex items-center space-x-6 mt-12 opacity-60">
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center text-slate-500 border border-slate-700"><FileType size={24}/></div>
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">PDF</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center text-slate-500 border border-slate-700"><FileType size={24}/></div>
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">DOCX</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center text-slate-500 border border-slate-700"><FileType size={24}/></div>
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">IMG</span>
                    </div>
                    </div>
                </>
                )}
                <input 
                id="file-upload" 
                type="file" 
                className="hidden" 
                accept=".pdf,.doc,.docx,.jpg,.png" 
                onChange={handleFileSelect}
                />
            </div>
            )}
        </div>
      </div>

       <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900/50 border border-white/5 p-4 rounded-2xl flex items-center space-x-4">
                <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg"><CheckCircle2 size={20}/></div>
                <div>
                    <p className="text-sm font-bold text-white">OCR Ready</p>
                    <p className="text-xs text-slate-500">Texterkennung integriert</p>
                </div>
            </div>
             <div className="bg-slate-900/50 border border-white/5 p-4 rounded-2xl flex items-center space-x-4">
                <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg"><CheckCircle2 size={20}/></div>
                <div>
                    <p className="text-sm font-bold text-white">AI Extraction</p>
                    <p className="text-xs text-slate-500">Automatische Metadaten</p>
                </div>
            </div>
             <div className="bg-slate-900/50 border border-white/5 p-4 rounded-2xl flex items-center space-x-4">
                <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg"><CheckCircle2 size={20}/></div>
                <div>
                    <p className="text-sm font-bold text-white">DSGVO-Safe</p>
                    <p className="text-xs text-slate-500">Konforme Verarbeitung</p>
                </div>
            </div>
       </div>
    </div>
  );
};