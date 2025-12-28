import React, { useEffect, useState } from 'react';
import { HistoryItem } from '../types';
import { Clock, FileText, Calendar, ArrowUpRight, ArrowDownRight, PieChart } from 'lucide-react';

export const History: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('finsight_history');
    if (saved) {
      try {
        const parsed: HistoryItem[] = JSON.parse(saved);
        const now = Date.now();
        const EXPIRATION_TIME = 72 * 60 * 60 * 1000;
        
        const filtered = parsed.filter(item => (now - item.timestamp) < EXPIRATION_TIME);
        const sorted = filtered.sort((a, b) => b.timestamp - a.timestamp);

        setHistory(sorted);

        if (parsed.length !== filtered.length) {
          localStorage.setItem('finsight_history', JSON.stringify(sorted));
        }
      } catch (e) {
        console.error("Error parsing history", e);
        localStorage.removeItem('finsight_history');
      }
    }
  }, []);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-8 h-full overflow-y-auto">
      <div className="mb-10">
        <h2 className="text-3xl font-semibold text-white tracking-tight">Analysis History</h2>
        <p className="text-slate-400 font-light mt-2 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>Analyses are stored locally for 72 hours.</span>
        </p>
      </div>

      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-[#0A0A0A] border border-dashed border-white/10 rounded-2xl">
          <div className="bg-[#111] p-4 rounded-full mb-4">
            <Clock className="w-8 h-8 text-slate-500" />
          </div>
          <p className="text-slate-400 font-medium">No recent analysis history found</p>
          <p className="text-slate-500 text-sm font-light mt-1">Upload a statement in the Dashboard to get started</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {history.map((item) => (
            <div key={item.id} className="bg-[#0A0A0A] p-6 rounded-2xl shadow-lg border border-white/5 hover:border-brand-500/20 transition-all group">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4 mb-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-[#111] text-brand-400 rounded-xl border border-white/5 group-hover:text-brand-300 transition-colors">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-lg">{item.fileName}</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 font-light">
                      <span className="uppercase font-bold bg-[#111] px-2 py-0.5 rounded text-brand-500 border border-white/5">{item.fileType.split('/')[1] || 'FILE'}</span>
                      <span>•</span>
                      <Calendar className="w-3 h-3" />
                      <span>{formatTime(item.timestamp)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-1 md:col-span-2 space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">AI Summary</h4>
                    <p className="text-slate-300 font-light leading-relaxed bg-[#111] border border-white/5 p-4 rounded-xl text-sm">
                      {item.result.summary}
                    </p>
                  </div>
                  
                  {item.result.breakdown && item.result.breakdown.length > 0 && (
                     <div className="space-y-2">
                      <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                        <PieChart className="w-3 h-3" /> Breakdown
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {item.result.breakdown
                          .filter(b => b.amount > 0)
                          .sort((a,b) => b.amount - a.amount)
                          .map((b, i) => (
                            <div key={i} className="px-3 py-1.5 bg-[#111] border border-white/5 rounded-lg text-xs flex items-center gap-2 text-slate-300">
                               <span className="font-medium text-slate-400">{b.category}</span>
                               <span className="font-bold text-white">₹{b.amount.toLocaleString('en-IN')}</span>
                            </div>
                        ))}
                      </div>
                     </div>
                  )}
                </div>

                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Financials</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-[#111] rounded-lg border border-white/5 group-hover:border-brand-500/10 transition-colors">
                      <div className="flex items-center gap-2 text-brand-400">
                        <ArrowUpRight className="w-4 h-4" />
                        <span className="text-xs font-semibold uppercase tracking-wider">Income</span>
                      </div>
                      <span className="font-bold text-brand-300">₹{item.result.totalIncome.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-[#111] rounded-lg border border-white/5 group-hover:border-rose-500/10 transition-colors">
                      <div className="flex items-center gap-2 text-rose-400">
                        <ArrowDownRight className="w-4 h-4" />
                        <span className="text-xs font-semibold uppercase tracking-wider">Expenses</span>
                      </div>
                      <span className="font-bold text-rose-300">₹{item.result.totalExpense.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};