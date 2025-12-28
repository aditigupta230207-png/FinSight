import React, { useState } from 'react';
import { Transaction, TaxAnalysisResult, UserTier } from '../types';
import { analyzeTaxDocument } from '../services/geminiService';
import { RefreshCw, Upload, Briefcase, User, IndianRupee, FileText, Sparkles, Brain, Lock, Check, AlertTriangle, TrendingUp, TrendingDown, ShieldAlert } from 'lucide-react';

interface ReportsProps {
  transactions: Transaction[];
  userTier: UserTier;
  onUpgrade: () => void;
}

export const Reports: React.FC<ReportsProps> = ({ transactions, userTier, onUpgrade }) => {
  const [taxAnalysis, setTaxAnalysis] = useState<TaxAnalysisResult | null>(null);
  const [analyzingDoc, setAnalyzingDoc] = useState(false);

  // Locked View for Free Tier
  if (userTier === 'FREE') {
    return (
      <div className="p-8 h-full flex flex-col items-center justify-center relative overflow-hidden">
        {/* Background visual effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] pointer-events-none mix-blend-overlay"></div>

        <div className="max-w-2xl w-full bg-[#0A0A0A] rounded-3xl border border-white/10 p-10 text-center relative z-10 shadow-2xl animate-in fade-in zoom-in duration-500">
          <div className="w-16 h-16 bg-[#111] rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5 shadow-inner">
            <Lock className="w-8 h-8 text-brand-500" />
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">Unlock Pro Insights</h2>
          <p className="text-slate-400 font-light text-lg mb-8 max-w-md mx-auto leading-relaxed">
            Upgrade to FinSight Pro to access detailed tax liability reports, ITR document analysis, and exportable PDF statements.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left max-w-lg mx-auto mb-10">
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/5">
              <div className="bg-brand-500/20 p-1 rounded-full"><Check className="w-3 h-3 text-brand-400" /></div>
              <span className="text-sm text-slate-300">Detailed ITR-Ready Reports</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/5">
              <div className="bg-brand-500/20 p-1 rounded-full"><Check className="w-3 h-3 text-brand-400" /></div>
              <span className="text-sm text-slate-300">Tax Liability Estimation</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/5">
              <div className="bg-brand-500/20 p-1 rounded-full"><Check className="w-3 h-3 text-brand-400" /></div>
              <span className="text-sm text-slate-300">Document Analysis (PDF)</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/5">
              <div className="bg-brand-500/20 p-1 rounded-full"><Check className="w-3 h-3 text-brand-400" /></div>
              <span className="text-sm text-slate-300">Personalized Tax Advice</span>
            </div>
          </div>

          <button 
            onClick={onUpgrade}
            className="bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-widest shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] transition-all transform hover:scale-105"
          >
            Upgrade to Pro
          </button>
          <p className="mt-4 text-[10px] text-slate-600 uppercase tracking-widest font-medium">Cancel anytime</p>
        </div>
      </div>
    );
  }

  // New functionality for PDF Upload Analysis
  const handleTaxDocUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAnalyzingDoc(true);
    setTaxAnalysis(null);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64String = (reader.result as string).split(',')[1];
        const result = await analyzeTaxDocument(base64String, file.type);
        setTaxAnalysis(result);
        setAnalyzingDoc(false);
      };
      reader.onerror = () => {
        console.error("File reading failed");
        setAnalyzingDoc(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error(error);
      setAnalyzingDoc(false);
    }
  };

  return (
    <div className="p-8 h-full overflow-y-auto max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-3xl font-semibold text-white tracking-tight flex items-center gap-3">
             Tax & Financial Reports
             <span className="bg-gradient-to-r from-amber-200 to-yellow-400 text-black text-[10px] font-bold px-2 py-0.5 rounded shadow-[0_0_10px_rgba(251,191,36,0.4)]">PRO</span>
          </h2>
          <p className="text-slate-400 font-light mt-2">Deep AI classification of Income and Expenses for ITR preparation.</p>
        </div>
      </div>

      <div className="mb-12">
        {/* Card: Deep Document Analysis (PDF Upload) */}
        {!taxAnalysis && (
            <div className="bg-[#0A0A0A] p-10 rounded-2xl border border-white/5 shadow-lg flex flex-col items-center justify-center text-center group hover:border-brand-500/20 transition-all max-w-3xl mx-auto">
                <div className="p-4 bg-indigo-500/10 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
                    <FileText className="w-8 h-8 text-indigo-400" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-3">ITR Document Analysis</h3>
                <p className="text-slate-400 font-light leading-relaxed mb-8 max-w-lg">
                Upload your Bank Statement or P&L (PDF/Image). AI will classify Salary, Business Income, Deductible Expenses, and flag Scrutiny Risks.
                </p>
            
            <label className={`w-full max-w-sm flex items-center justify-center gap-2 border-2 border-dashed border-white/10 hover:border-indigo-400/50 hover:bg-indigo-500/5 text-slate-300 hover:text-indigo-300 px-8 py-5 rounded-xl font-medium transition-all cursor-pointer ${analyzingDoc ? 'opacity-50 pointer-events-none' : ''}`}>
                {analyzingDoc ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                <span>{analyzingDoc ? "Classifying Income & Expenses..." : "Upload Statement (PDF)"}</span>
                <input 
                    type="file" 
                    accept=".pdf,.png,.jpg,.jpeg" 
                    className="hidden" 
                    onChange={handleTaxDocUpload} 
                />
            </label>
            </div>
        )}
      </div>

      {/* --- ITR Analysis Results Section --- */}
      {taxAnalysis && (
        <div className="space-y-8 animate-in slide-in-from-bottom-5 duration-500 mb-12">
           
           {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#111] p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 rounded-full blur-3xl"></div>
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-brand-500" /> Total Gross Income
                    </h4>
                    <p className="text-3xl font-bold text-white">₹{taxAnalysis.income.totalGross.toLocaleString('en-IN')}</p>
                </div>

                <div className="bg-[#111] p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl"></div>
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <TrendingDown className="w-4 h-4 text-indigo-400" /> Total Deductible Exp
                    </h4>
                    <p className="text-3xl font-bold text-white">₹{taxAnalysis.expenses.totalDeductible.toLocaleString('en-IN')}</p>
                </div>

                 <div className="bg-[#111] p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-3xl"></div>
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                         <AlertTriangle className="w-4 h-4 text-rose-500" /> Disallowed / Personal
                    </h4>
                    <p className="text-3xl font-bold text-white">₹{taxAnalysis.expenses.totalNonDeductible.toLocaleString('en-IN')}</p>
                </div>
            </div>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Left Column: Income & Recurring */}
              <div className="space-y-8">
                  {/* Income Classification */}
                  <div className="bg-[#0A0A0A] p-8 rounded-2xl border border-white/5 relative overflow-hidden">
                    <h4 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                        <IndianRupee className="w-5 h-5 text-brand-500" /> Income Classification
                    </h4>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                            <span className="text-sm text-slate-300">Business / Profession</span>
                            <span className="font-semibold text-white">₹{taxAnalysis.income.breakdown.business.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                            <span className="text-sm text-slate-300">Salary</span>
                            <span className="font-semibold text-white">₹{taxAnalysis.income.breakdown.salary.toLocaleString('en-IN')}</span>
                        </div>
                         <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                            <span className="text-sm text-slate-300">Interest Income</span>
                            <span className="font-semibold text-white">₹{taxAnalysis.income.breakdown.interest.toLocaleString('en-IN')}</span>
                        </div>
                         <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                            <span className="text-sm text-slate-300">Dividend</span>
                            <span className="font-semibold text-white">₹{taxAnalysis.income.breakdown.dividend.toLocaleString('en-IN')}</span>
                        </div>
                         <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                            <span className="text-sm text-slate-300">Other Sources</span>
                            <span className="font-semibold text-white">₹{taxAnalysis.income.breakdown.other.toLocaleString('en-IN')}</span>
                        </div>
                    </div>
                  </div>

                  {/* Recurring Sources */}
                   <div className="bg-[#0A0A0A] p-8 rounded-2xl border border-white/5">
                    <h4 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                        <RefreshCw className="w-5 h-5 text-emerald-400" /> Recurring Sources
                    </h4>
                     <div className="space-y-3">
                        {taxAnalysis.income.recurringSources.length > 0 ? taxAnalysis.income.recurringSources.map((source, idx) => (
                            <div key={idx} className="flex justify-between items-center border-b border-white/5 last:border-0 pb-3 last:pb-0">
                                <div>
                                    <p className="text-sm font-medium text-white">{source.name}</p>
                                    <p className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider">{source.frequency || 'REGULAR'}</p>
                                </div>
                                <span className="text-sm font-bold text-slate-300">₹{source.amount.toLocaleString('en-IN')}</span>
                            </div>
                        )) : (
                            <p className="text-sm text-slate-500 italic">No recurring sources detected.</p>
                        )}
                     </div>
                  </div>
              </div>

              {/* Right Column: Expenses & Risks */}
              <div className="space-y-8">
                  {/* Expense Breakdown */}
                  <div className="bg-[#0A0A0A] p-8 rounded-2xl border border-white/5">
                    <div className="flex justify-between items-center mb-6">
                        <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                            <Briefcase className="w-5 h-5 text-indigo-400" /> Deductible Expenses
                        </h4>
                        <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded border border-indigo-500/30 font-bold uppercase">Section 37 Allowed</span>
                    </div>
                    
                    <div className="space-y-3 mb-6">
                        {taxAnalysis.expenses.deductibleBreakdown.length > 0 ? taxAnalysis.expenses.deductibleBreakdown.map((exp, idx) => (
                             <div key={idx} className="flex justify-between items-center">
                                <span className="text-sm text-slate-400">{exp.category}</span>
                                <span className="text-sm font-bold text-white">₹{exp.amount.toLocaleString('en-IN')}</span>
                            </div>
                        )) : (
                             <p className="text-sm text-slate-500 italic">No deductible business expenses found.</p>
                        )}
                    </div>
                     <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                        <span className="text-xs text-slate-500 uppercase tracking-widest">Total Allowed</span>
                         <span className="text-lg font-bold text-indigo-400">₹{taxAnalysis.expenses.totalDeductible.toLocaleString('en-IN')}</span>
                     </div>
                  </div>

                  {/* Scrutiny Risks / Flags */}
                  <div className="bg-[#1a0f0f] p-8 rounded-2xl border border-rose-900/30 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-rose-500/5 rounded-full blur-3xl"></div>
                    <h4 className="text-lg font-semibold text-rose-200 mb-6 flex items-center gap-2 relative z-10">
                        <ShieldAlert className="w-5 h-5 text-rose-500" /> Scrutiny Risks & Flags
                    </h4>
                    
                    <div className="space-y-4 relative z-10">
                        {/* Flagged Credits */}
                        {taxAnalysis.income.flaggedCredits.map((item, idx) => (
                             <div key={`credit-${idx}`} className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="text-sm font-bold text-rose-200">{item.description}</span>
                                    <span className="text-sm font-bold text-rose-400">₹{item.amount.toLocaleString('en-IN')}</span>
                                </div>
                                <p className="text-xs text-rose-300/70">{item.reason}</p>
                            </div>
                        ))}

                        {/* Flagged Expenses */}
                        {taxAnalysis.expenses.scrutinyRisks.map((item, idx) => (
                             <div key={`exp-${idx}`} className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="text-sm font-bold text-rose-200">{item.description}</span>
                                    <span className="text-sm font-bold text-rose-400">₹{item.amount.toLocaleString('en-IN')}</span>
                                </div>
                                <p className="text-xs text-rose-300/70">{item.riskReason}</p>
                            </div>
                        ))}

                        {taxAnalysis.income.flaggedCredits.length === 0 && taxAnalysis.expenses.scrutinyRisks.length === 0 && (
                             <div className="text-center py-4">
                                <Check className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                                <p className="text-emerald-400 text-sm">No high-risk items detected.</p>
                             </div>
                        )}
                    </div>
                  </div>
              </div>
           </div>
           
           {/* AI Insight Footer */}
           <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/20 p-6 rounded-xl flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex gap-4">
                    <div className="p-3 bg-indigo-500/10 rounded-xl h-fit">
                        <Brain className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                        <h4 className="text-indigo-300 font-bold text-sm uppercase tracking-widest mb-1">
                            {taxAnalysis.aiInsight?.title || "AI Strategic Insight"}
                        </h4>
                        <p className="text-slate-300 text-sm leading-relaxed max-w-xl">
                            {taxAnalysis.aiInsight?.description}
                        </p>
                    </div>
                </div>
                <div className="text-right shrink-0">
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Potential Tax Savings</p>
                    <p className="text-2xl font-bold text-emerald-400">{taxAnalysis.aiInsight?.potentialSavings}</p>
                </div>
           </div>

            {/* ITR Suggestion Badge */}
            <div className="flex justify-center mt-8">
                <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-3 rounded-full">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Suggested Form</span>
                    <span className="text-sm font-bold text-white font-mono">{taxAnalysis.itrContext.suggestedForm}</span>
                    <span className="w-px h-4 bg-white/10 mx-2"></span>
                    <div className="flex gap-2">
                        {taxAnalysis.itrContext.detectedSections.map((sec, i) => (
                             <span key={i} className="text-[10px] bg-brand-500/10 text-brand-400 px-2 py-1 rounded border border-brand-500/20">{sec}</span>
                        ))}
                    </div>
                </div>
            </div>

            <button 
                onClick={() => { setTaxAnalysis(null); setAnalyzingDoc(false); }}
                className="mx-auto block text-slate-500 hover:text-white text-xs mt-8 transition-colors"
            >
                Upload Different Document
            </button>

        </div>
      )}
    </div>
  );
};