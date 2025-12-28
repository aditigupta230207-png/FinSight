import React from 'react';
import { AppView, UserTier } from '../types';
import { 
  LayoutDashboard, 
  FileText, 
  User, 
  Settings, 
  Check,
  LogOut,
  History,
  X,
  Lock,
  CreditCard
} from 'lucide-react';

interface SidebarProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
  isOpen: boolean;
  onClose: () => void;
  userTier: UserTier;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, isOpen, onClose, userTier }) => {
  const navItems = [
    { view: AppView.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard, isPro: false },
    { view: AppView.HISTORY, label: 'History', icon: History, isPro: false },
    { view: AppView.REPORTS, label: 'Tax & Reports', icon: FileText, isPro: true },
    { view: AppView.SUBSCRIPTION, label: 'Subscription', icon: CreditCard, isPro: false },
    { view: AppView.ACCOUNT, label: 'Account', icon: User, isPro: false },
    { view: AppView.SETTINGS, label: 'Settings', icon: Settings, isPro: false },
  ];

  const handleNavClick = (view: AppView) => {
    onChangeView(view);
    onClose();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed md:static inset-y-0 left-0 z-50
        w-64 bg-[#050505] h-full flex flex-col border-r border-white/5
        transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-8 flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-brand-600 to-brand-400 p-2 rounded-lg shadow-[0_0_15px_rgba(34,197,94,0.3)]">
              <Check className="w-5 h-5 text-white" strokeWidth={3} />
            </div>
            <h1 className="text-xl font-semibold text-white tracking-tight">FinSight</h1>
          </div>
          
          {/* Mobile Close Button */}
          <button 
            onClick={onClose}
            className="md:hidden text-slate-500 hover:text-white transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = currentView === item.view;
            return (
              <button
                key={item.view}
                onClick={() => handleNavClick(item.view)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-300 group ${
                  isActive 
                    ? 'bg-brand-500/10 border-l-2 border-brand-500' 
                    : 'hover:bg-white/5 border-l-2 border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                    <item.icon className={`w-4 h-4 transition-colors ${isActive ? 'text-brand-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                    <span className={`text-xs tracking-wide ${isActive ? 'text-brand-400 font-medium' : 'text-slate-400 font-light group-hover:text-slate-200'}`}>
                    {item.label}
                    </span>
                </div>
                {item.isPro && userTier === 'FREE' && (
                    <Lock className="w-3 h-3 text-slate-600" />
                )}
                {item.isPro && userTier === 'PRO' && (
                    <span className="text-[9px] font-bold bg-gradient-to-r from-amber-200 to-yellow-400 text-black px-1.5 rounded-sm">PRO</span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#0A0A0A] hover:bg-white/5 cursor-pointer transition-colors border border-white/5 group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-700 to-brand-500 flex items-center justify-center text-white text-[10px] font-bold shadow-inner relative">
              JD
              {userTier === 'PRO' && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border-2 border-[#0A0A0A]"></div>
              )}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-medium text-white truncate group-hover:text-brand-300 transition-colors">John Doe</p>
              <p className="text-[10px] font-light text-slate-500 truncate capitalize">{userTier.toLowerCase()} Plan</p>
            </div>
            <LogOut className="w-3 h-3 text-slate-600 hover:text-white transition-colors" />
          </div>
          <div className="mt-4 px-4">
              <span className="text-[10px] font-light text-slate-600">v2.5.0 <span className="text-brand-500/50">•</span> {userTier}</span>
          </div>
        </div>
      </div>
    </>
  );
};