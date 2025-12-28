import React from 'react';
import { User, Bell, Shield, Cloud, CreditCard } from 'lucide-react';

export const Settings: React.FC = () => {
  return (
    <div className="p-8 h-full overflow-y-auto max-w-4xl">
      <h2 className="text-3xl font-semibold text-white mb-10 tracking-tight">Settings</h2>

      <div className="space-y-6">
        
        {/* Profile Section */}
        <div className="bg-[#0A0A0A] p-8 rounded-2xl shadow-lg border border-white/5">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <User className="w-5 h-5 text-brand-500" /> Account Profile
          </h3>
          <div className="flex items-center gap-8">
            <div className="w-20 h-20 rounded-full bg-[#111] flex items-center justify-center text-2xl font-bold text-white border border-white/10 shadow-inner">
              JD
            </div>
            <div className="space-y-4 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Full Name</label>
                    <input type="text" defaultValue="John Doe" className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm font-light text-white focus:ring-1 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all" />
                 </div>
                 <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Email</label>
                    <input type="email" defaultValue="john@example.com" className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm font-light text-white focus:ring-1 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all" />
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preferences Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#0A0A0A] p-6 rounded-2xl shadow-lg border border-white/5">
             <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5 text-brand-500" /> Notifications
             </h3>
             <div className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors">
                   <span className="text-sm font-light text-slate-300">Monthly Report Alert</span>
                   <div className="w-10 h-5 bg-brand-600 rounded-full relative cursor-pointer shadow-inner"><div className="w-4 h-4 bg-white rounded-full absolute top-0.5 right-0.5 shadow-sm"></div></div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors">
                   <span className="text-sm font-light text-slate-300">Unusual Spending</span>
                   <div className="w-10 h-5 bg-brand-600 rounded-full relative cursor-pointer shadow-inner"><div className="w-4 h-4 bg-white rounded-full absolute top-0.5 right-0.5 shadow-sm"></div></div>
                </div>
             </div>
          </div>

          <div className="bg-[#0A0A0A] p-6 rounded-2xl shadow-lg border border-white/5">
             <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-brand-500" /> Security
             </h3>
             <div className="space-y-2">
                <button className="w-full text-left text-sm font-light text-slate-300 hover:text-white hover:bg-white/5 p-3 rounded-lg transition-colors flex justify-between items-center group">
                    Change Password
                    <span className="text-brand-500 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </button>
                <button className="w-full text-left text-sm font-light text-slate-300 hover:text-white hover:bg-white/5 p-3 rounded-lg transition-colors flex justify-between items-center group">
                    Enable 2FA
                    <span className="text-brand-500 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </button>
             </div>
          </div>
        </div>
        
        {/* Integrations */}
         <div className="bg-[#0A0A0A] p-8 rounded-2xl shadow-lg border border-white/5">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Cloud className="w-5 h-5 text-brand-500" /> Connected Services
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-[#111] border border-white/5 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-900/50">C</div>
                  <div>
                    <p className="text-sm font-semibold text-white">Chase Bank</p>
                    <p className="text-[10px] text-brand-400 flex items-center gap-1 uppercase tracking-wider font-bold">● Connected</p>
                  </div>
                </div>
                <button className="text-[10px] text-rose-400 hover:text-rose-300 font-bold border border-rose-500/20 px-4 py-2 rounded uppercase tracking-widest hover:bg-rose-500/10 transition-colors">Disconnect</button>
            </div>
             <div className="flex items-center justify-between p-4 bg-[#111] border border-white/5 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-indigo-600 rounded flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-900/50">S</div>
                  <div>
                    <p className="text-sm font-semibold text-white">Stripe</p>
                    <p className="text-[10px] text-brand-400 flex items-center gap-1 uppercase tracking-wider font-bold">● Connected</p>
                  </div>
                </div>
                <button className="text-[10px] text-rose-400 hover:text-rose-300 font-bold border border-rose-500/20 px-4 py-2 rounded uppercase tracking-widest hover:bg-rose-500/10 transition-colors">Disconnect</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};