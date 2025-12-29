import React, { useState } from 'react';
import { Transaction, HistoryItem, AnalysisResult } from '../types';
import { Upload, CheckCircle, Loader2, RefreshCw, FileText, Image as ImageIcon, Table, PieChart, Repeat, ShoppingBag, ArrowRightLeft } from 'lucide-react';
import { analyzeBankStatement } from '../services/geminiService';
import { read, utils } from 'xlsx';

interface DashboardProps {
  transactions: Transaction[];
}

export const Dashboard: React.FC<DashboardProps> = ({ transactions }) => {
  // Bank Statement Analysis State
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const saveToHistory = (file: File, result: AnalysisResult) => {
    try {
      const historyItem: HistoryItem = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        fileName: file.name,
        fileType: file.type || 'unknown',
        result: result
      };

      const existingHistoryJson = localStorage.getItem('finsight_history');
      const existingHistory: HistoryItem[] = existingHistoryJson ? JSON.parse(existingHistoryJson) : [];
      
      // Add new item to the beginning
      const updatedHistory = [historyItem, ...existingHistory];
      
      localStorage.setItem('finsight_history', JSON.stringify(updatedHistory));
    } catch (e) {
      console.error("Failed to save history", e);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAnalyzing(true);
    setAnalysisResult(null);

    try {
      // Handle Excel Files
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.type.includes('sheet') || file.type.includes('excel')) {
        const buffer = await file.arrayBuffer();
        const workbook = read(buffer);
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const csvData = utils.sheet_to_csv(worksheet);
        
        const result = await analyzeBankStatement(csvData, 'text/csv');
        setAnalysisResult(result);
        saveToHistory(file, result);
        setAnalyzing(false);
        return;
      }

      // Handle PDF and Images (Base64)
      const reader = new FileReader();
      reader.onload = async () => {
        const base64String = (reader.result as string).split(',')[1];
        // Ensure mime type is passed correctly. 
        // Note: For images/pdf, Gemini supports standard mime types.
        const result = await analyzeBankStatement(base64String, file.type);
        setAnalysisResult(result);
        saveToHistory(file, result);
        setAnalyzing(false);
      };
      reader.onerror = () => {
        console.error("File reading failed");
        setAnalyzing(false);
      };
      reader.readAsDataURL(file);

    } catch (error) {
      console.error(error);
      setAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setAnalysisResult(null);
  };

  return (
    <div className="p-8 h-full overflow-y-auto relative z-10">
      
      {/* Header */}
      <div className="mb-10">
        <h2 className="text-3xl font-semibold text-white tracking-tight">Dashboard</h2>
        <p className="text-slate-400 font-light mt-2">Upload your bank statement to generate AI-powered insights.</p>
      </div>

      {/* Main Content: Centered Upload/Analysis Card */}
      <div className="max-w-6xl mx-auto">
        
        {!analysisResult && (
          <div className="bg-[#0A0A0A] rounded-2xl border border-white/5 overflow-hidden relative transition-all min-h-[400px] flex flex-col group hover:border-white/10 shadow-2xl max-w-4xl mx-auto">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-500 to-transparent opacity-30"></div>
            
            <div className="flex-1 p-10 flex flex-col justify-center relative">
              {/* Ambient Background Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-500/5 rounded-full blur-3xl pointer-events-none"></div>

              {!analyzing && (
                <div className="flex flex-col items-center text-center group space-y-8 relative z-10">
                  <div className="flex gap-6">
                    <div className="p-5 bg-[#111] border border-white/5 rounded-2xl group-hover:scale-110 transition-transform shadow-lg">
                      <FileText className="w-6 h-6 text-brand-400" />
                    </div>
                    <div className="p-5 bg-[#111] border border-white/5 rounded-2xl group-hover:scale-110 transition-transform delay-75 shadow-lg">
                      <Table className="w-6 h-6 text-emerald-200" />
                    </div>
                    <div className="p-5 bg-[#111] border border-white/5 rounded-2xl group-hover:scale-110 transition-transform delay-100 shadow-lg">
                      <ImageIcon className="w-6 h-6 text-brand-300" />
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Analyze Bank Statement</h3>
                    <p className="text-slate-400 font-light max-w-md mx-auto leading-relaxed">
                      Upload your bank statement in <span className="font-medium text-brand-400">PDF</span>, <span className="font-medium text-brand-400">Excel</span>, or <span className="font-medium text-brand-400">Image</span> format. 
                      <br/>Our AI will extract income, expenses, and summarize activity.
                    </p>
                  </div>
                  
                  <label className="cursor-pointer bg-brand-600 text-white px-8 py-4 rounded-xl text-base font-semibold hover:bg-brand-500 transition-all hover:scale-105 flex items-center gap-3 shadow-[0_0_25px_rgba(34,197,94,0.2)]">
                    <Upload className="w-4 h-4" />
                    <span>Upload Document</span>
                    <input 
                      type="file" 
                      accept=".pdf,.xlsx,.xls,.csv,.jpg,.jpeg,.png,.webp" 
                      className="hidden" 
                      onChange={handleFileUpload} 
                    />
                  </label>
                </div>
              )}

              {analyzing && (
                <div className="flex flex-col items-center text-center animate-pulse space-y-6 relative z-10">
                  <Loader2 className="w-12 h-12 text-brand-400 animate-spin drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
                  <div>
                    <h3 className="text-lg font-semibold text-white">Analyzing Document...</h3>
                    <p className="text-slate-400 font-light mt-2">Extracting vendor details and recurring patterns</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {analysisResult && (
          <div className="flex flex-col h-full animate-in fade-in zoom-in duration-300 relative z-10 space-y-8">
            
            {/* Action Bar */}
            <div className="flex items-center justify-between pb-6 border-b border-white/5">
              <div className="flex items-center gap-3 text-brand-400">
                  <div className="p-2 bg-brand-500/10 rounded-full border border-brand-500/20">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <span className="text-lg font-semibold tracking-tight">Analysis Complete</span>
              </div>
              <button onClick={resetAnalysis} className="flex items-center gap-2 text-slate-400 hover:text-white px-4 py-2 hover:bg-white/5 rounded-lg transition-colors border border-transparent hover:border-white/5">
                  <RefreshCw className="w-3 h-3" />
                  <span className="text-xs font-medium uppercase tracking-wider">Analyze Another</span>
              </button>
            </div>
            
            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-6 bg-[#111] rounded-2xl border border-white/5 relative overflow-hidden group hover:border-brand-500/30 transition-colors">
                  <div className="absolute inset-0 bg-brand-500/5 group-hover:bg-brand-500/10 transition-colors"></div>
                  <p className="text-xs text-brand-400 font-semibold uppercase tracking-widest mb-2 relative z-10">Net Income</p>
                  <p className="text-3xl font-semibold text-white relative z-10">+₹{analysisResult.totalIncome.toLocaleString('en-IN')}</p>
              </div>
              <div className="p-6 bg-[#111] rounded-2xl border border-white/5 relative overflow-hidden group hover:border-rose-500/30 transition-colors">
                  <div className="absolute inset-0 bg-rose-500/5 group-hover:bg-rose-500/10 transition-colors"></div>
                  <p className="text-xs text-rose-400 font-semibold uppercase tracking-widest mb-2 relative z-10">Net Expenses</p>
                  <p className="text-3xl font-semibold text-white relative z-10">-₹{analysisResult.totalExpense.toLocaleString('en-IN')}</p>
              </div>
              <div className="p-6 bg-[#111] rounded-2xl border border-white/5 relative overflow-hidden group hover:border-blue-500/30 transition-colors">
                  <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors"></div>
                  <p className="text-xs text-blue-400 font-semibold uppercase tracking-widest mb-2 relative z-10 flex items-center gap-1">
                      <ArrowRightLeft className="w-3 h-3" /> Excluded Transfers
                  </p>
                  <p className="text-3xl font-semibold text-slate-300 relative z-10">₹{(analysisResult.excludedInternalTransfers || 0).toLocaleString('en-IN')}</p>
                  <p className="text-[10px] text-slate-500 mt-2">Self-transfers & credit card payments filtered out.</p>
              </div>
            </div>
            
            <div className="bg-[#111] p-6 rounded-2xl border border-white/5">
              <h4 className="font-semibold text-white mb-2 text-sm uppercase tracking-wide">Summary</h4>
              <p className="text-slate-300 font-light leading-relaxed">
                "{analysisResult.summary}"
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Col: Category & Vendor Breakdown */}
              <div className="lg:col-span-2 space-y-6">
                 <h4 className="font-semibold text-white flex items-center gap-2 text-sm uppercase tracking-wide">
                    <PieChart className="w-4 h-4 text-brand-500" />
                    Detailed Expense Breakdown
                 </h4>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {analysisResult.breakdown && analysisResult.breakdown
                      .filter(item => item.amount > 0)
                      .sort((a, b) => b.amount - a.amount)
                      .map((item, idx) => (
                        <div key={idx} className="bg-[#111] rounded-2xl border border-white/5 overflow-hidden flex flex-col h-full hover:border-white/10 transition-all">
                           <div className="p-5 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
                              <span className="text-sm font-semibold text-white tracking-wide">{item.category}</span>
                              <span className="text-sm font-bold text-white">₹{item.amount.toLocaleString('en-IN')}</span>
                           </div>
                           <div className="p-4 flex-1">
                              {item.vendors && item.vendors.length > 0 ? (
                                <ul className="space-y-3">
                                  {item.vendors.map((vendor, vIdx) => (
                                    <li key={vIdx} className="flex justify-between items-center text-xs">
                                       <div className="flex items-center gap-2">
                                          <div className={`w-1.5 h-1.5 rounded-full ${vIdx === 0 ? 'bg-brand-500' : 'bg-slate-600'}`}></div>
                                          <span className="text-slate-400 font-light truncate max-w-[120px]">{vendor.name}</span>
                                       </div>
                                       <span className="text-slate-300 font-medium">₹{vendor.amount.toLocaleString('en-IN')}</span>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-xs text-slate-600 font-light italic">No vendor details available</p>
                              )}
                           </div>
                        </div>
                    ))}
                 </div>
              </div>

              {/* Right Col: Recurring Transactions */}
              <div className="space-y-6">
                  <h4 className="font-semibold text-white flex items-center gap-2 text-sm uppercase tracking-wide">
                    <Repeat className="w-4 h-4 text-indigo-400" />
                    Repetitive Habits
                 </h4>
                 
                 <div className="bg-[#111] rounded-2xl border border-white/5 overflow-hidden">
                    <div className="p-4 border-b border-white/5 bg-indigo-500/5">
                        <p className="text-xs text-indigo-300 font-light">Sorted by highest total paid</p>
                    </div>
                    <div className="divide-y divide-white/5">
                       {analysisResult.recurring && analysisResult.recurring.length > 0 ? (
                         analysisResult.recurring.map((rec, rIdx) => (
                           <div key={rIdx} className="p-4 hover:bg-white/5 transition-colors group">
                              <div className="flex justify-between items-start mb-1">
                                 <span className="text-sm font-medium text-white group-hover:text-indigo-300 transition-colors">{rec.merchant}</span>
                                 <span className="text-sm font-bold text-white">₹{rec.amount.toLocaleString('en-IN')}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                 <span className="text-[10px] uppercase font-bold bg-white/5 text-slate-500 px-1.5 py-0.5 rounded border border-white/5">{rec.count} txns</span>
                              </div>
                           </div>
                         ))
                       ) : (
                         <div className="p-8 text-center">
                            <Repeat className="w-8 h-8 text-slate-700 mx-auto mb-2" />
                            <p className="text-sm text-slate-500 font-light">No recurring transactions identified.</p>
                         </div>
                       )}
                    </div>
                 </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};