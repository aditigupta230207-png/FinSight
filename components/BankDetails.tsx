import React from 'react';
import { BankAccount, Transaction } from '../types';
import { Building2, User, Hash, Wallet, Wifi } from 'lucide-react';

interface BankDetailsProps {
  accounts: BankAccount[];
  transactions: Transaction[];
}

export const BankDetails: React.FC<BankDetailsProps> = ({ accounts }) => {
  return (
    <div className="p-8 h-full overflow-y-auto">
      <h2 className="text-3xl font-semibold text-white mb-10 tracking-tight">Bank Account Details</h2>

      {/* Cards Scroll Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {accounts.map(acc => (
          <div key={acc.id} className="bg-[#0A0A0A] rounded-2xl shadow-2xl border border-white/10 overflow-hidden relative group hover:border-brand-500/30 transition-all hover:-translate-y-1">
            {/* Gloss effect */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none group-hover:bg-brand-500/5 transition-colors"></div>
            
            <div className="p-8 space-y-8 relative z-10">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#111] rounded-full flex items-center justify-center border border-white/10 group-hover:border-brand-500/20 transition-colors">
                        <Building2 className="w-5 h-5 text-slate-300 group-hover:text-brand-400 transition-colors" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white leading-none mb-1.5">{acc.name}</h3>
                        <p className="text-[10px] text-brand-500 uppercase tracking-widest font-bold">{acc.type}</p>
                    </div>
                </div>
                <Wifi className="w-6 h-6 text-slate-700 rotate-90" />
              </div>

              <div className="space-y-1">
                 <p className="text-[10px] text-slate-500 uppercase tracking-widest font-medium">Balance</p>
                 <p className="text-3xl font-semibold text-white tracking-tight">
                  {acc.balance.toLocaleString('en-IN', {
                    style: 'currency',
                    currency: 'INR',
                    maximumFractionDigits: 0
                  })}
                 </p>
              </div>

              <div className="pt-6 border-t border-white/5 flex justify-between items-end">
                <div>
                   <p className="text-[10px] text-slate-500 uppercase mb-1 font-medium">Card Holder</p>
                   <p className="text-sm font-medium text-slate-300">{acc.holderName}</p>
                </div>
                <div className="text-right">
                   <p className="text-[10px] text-slate-500 uppercase mb-1 font-medium">Account No.</p>
                   <p className="text-sm font-medium text-slate-300 font-mono tracking-widest">•••• {acc.accountNumber.slice(-4)}</p>
                </div>
              </div>
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
};