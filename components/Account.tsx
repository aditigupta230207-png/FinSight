import React from 'react';
import { Mail, Phone, ShieldCheck, User as UserIcon, Crown } from 'lucide-react';
import { UserTier } from '../types';

interface AccountProps {
  userTier: UserTier;
  onToggleTier: () => void;
}

export const Account: React.FC<AccountProps> = ({ userTier, onToggleTier }) => {
  return (
    <div className="p-8 h-full flex items-center justify-center relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="bg-[#0A0A0A] p-10 rounded-3xl border border-white/5 shadow-2xl relative z-10 max-w-md w-full group hover:border-brand-500/20 transition-all animate-in fade-in zoom-in duration-300">
            <div className="flex flex-col items-center mb-10">
                <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-brand-600 to-brand-400 p-1 mb-6 shadow-2xl shadow-brand-500/20 relative">
                    <div className="w-full h-full rounded-full bg-[#111] flex items-center justify-center overflow-hidden">
                        <UserIcon className="w-12 h-12 text-slate-400" />
                    </div>
                    {userTier === 'PRO' ? (
                         <div className="absolute bottom-1 right-1 bg-gradient-to-r from-amber-300 to-yellow-500 rounded-full p-2 border-4 border-[#0A0A0A] shadow-lg">
                            <Crown className="w-4 h-4 text-black fill-current" />
                        </div>
                    ) : (
                        <div className="absolute bottom-1 right-1 bg-brand-500 rounded-full p-1.5 border-4 border-[#0A0A0A]">
                            <ShieldCheck className="w-4 h-4 text-white" />
                        </div>
                    )}
                </div>
                <h2 className="text-3xl font-bold text-white tracking-tight">John Doe</h2>
                
                <div className="mt-2">
                    {userTier === 'PRO' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/20 rounded-full">
                             <Crown className="w-3 h-3 text-amber-400 fill-amber-400/20" />
                             <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Pro Member</span>
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                             <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">Free Plan</span>
                        </span>
                    )}
                </div>
            </div>

            <div className="space-y-6">
                <div className="p-5 bg-[#111] rounded-2xl border border-white/5 flex items-center gap-5 group-hover:bg-white/[0.02] transition-colors relative overflow-hidden">
                    <div className="absolute left-0 top-0 w-1 h-full bg-blue-500/50"></div>
                    <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400 shrink-0">
                        <Mail className="w-5 h-5" />
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Email Address</p>
                        <p className="text-sm font-medium text-slate-200 truncate">john.doe@gmail.com</p>
                    </div>
                </div>

                <div className="p-5 bg-[#111] rounded-2xl border border-white/5 flex items-center gap-5 group-hover:bg-white/[0.02] transition-colors relative overflow-hidden">
                    <div className="absolute left-0 top-0 w-1 h-full bg-brand-500/50"></div>
                    <div className="p-3 bg-brand-500/10 rounded-xl text-brand-400 shrink-0">
                        <Phone className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Mobile Number</p>
                        <p className="text-sm font-medium text-slate-200">+91 98765 43210</p>
                    </div>
                </div>
            </div>

             <div className="mt-10 pt-6 border-t border-white/5 text-center space-y-4">
                 <button 
                    onClick={onToggleTier}
                    className={`w-full py-3 rounded-xl font-bold text-sm uppercase tracking-widest transition-all ${
                        userTier === 'FREE' 
                        ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white hover:scale-105 shadow-lg shadow-brand-500/20' 
                        : 'bg-white/5 text-slate-400 hover:bg-white/10'
                    }`}
                 >
                    {userTier === 'FREE' ? 'Upgrade to Pro' : 'Downgrade to Free'}
                 </button>
                 
                 <button className="text-xs text-slate-500 hover:text-brand-400 transition-colors uppercase tracking-widest font-bold flex items-center justify-center gap-2 mx-auto">
                    Manage Account Settings
                 </button>
             </div>
        </div>
    </div>
  );
};