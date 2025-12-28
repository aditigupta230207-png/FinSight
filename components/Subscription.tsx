import React, { useState } from 'react';
import { UserTier } from '../types';
import { Check, X, Shield, Crown, CreditCard, Loader2 } from 'lucide-react';

interface SubscriptionProps {
  userTier: UserTier;
  onUpgrade: () => void;
  onDowngrade: () => void;
}

export const Subscription: React.FC<SubscriptionProps> = ({ userTier, onUpgrade, onDowngrade }) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleUpgradeClick = () => {
    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      setPaymentSuccess(true);
      setTimeout(() => {
        onUpgrade();
        setShowPaymentModal(false);
        setPaymentSuccess(false);
      }, 1500);
    }, 2000);
  };

  return (
    <div className="p-8 h-full overflow-y-auto">
       <div className="mb-10 text-center">
        <h2 className="text-3xl font-semibold text-white tracking-tight">Plans & Pricing</h2>
        <p className="text-slate-400 font-light mt-2">Choose the plan that fits your financial journey.</p>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        
        {/* Free Tier */}
        <div className={`rounded-3xl p-8 border ${userTier === 'FREE' ? 'bg-[#111] border-brand-500' : 'bg-[#0A0A0A] border-white/10'} flex flex-col transition-all relative overflow-hidden`}>
           {userTier === 'FREE' && (
             <div className="absolute top-0 right-0 bg-brand-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl">CURRENT PLAN</div>
           )}
           <div className="mb-6">
             <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4">
               <Shield className="w-6 h-6 text-slate-300" />
             </div>
             <h3 className="text-xl font-bold text-white">Starter</h3>
             <div className="mt-2 flex items-baseline gap-1">
               <span className="text-3xl font-bold text-white">₹0</span>
               <span className="text-slate-500 text-sm">/month</span>
             </div>
             <p className="text-slate-400 text-sm font-light mt-4">Essential tools for tracking your expenses.</p>
           </div>

           <div className="flex-1 space-y-4 mb-8">
             <div className="flex items-center gap-3 text-sm text-slate-300">
               <Check className="w-4 h-4 text-brand-500" /> <span>Basic Dashboard Analytics</span>
             </div>
             <div className="flex items-center gap-3 text-sm text-slate-300">
               <Check className="w-4 h-4 text-brand-500" /> <span>Expense Categorization</span>
             </div>
             <div className="flex items-center gap-3 text-sm text-slate-300">
               <Check className="w-4 h-4 text-brand-500" /> <span>72h History Retention</span>
             </div>
             <div className="flex items-center gap-3 text-sm text-slate-500">
               <X className="w-4 h-4" /> <span>Tax Liability Reports</span>
             </div>
             <div className="flex items-center gap-3 text-sm text-slate-500">
               <X className="w-4 h-4" /> <span>ITR Document Analysis</span>
             </div>
             <div className="flex items-center gap-3 text-sm text-slate-500">
               <X className="w-4 h-4" /> <span>Priority AI Support</span>
             </div>
           </div>

           <button 
             disabled={userTier === 'FREE'}
             onClick={onDowngrade}
             className={`w-full py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-all ${userTier === 'FREE' ? 'bg-white/5 text-slate-500 cursor-default' : 'bg-white/10 text-white hover:bg-white/20'}`}
           >
             {userTier === 'FREE' ? 'Active' : 'Downgrade'}
           </button>
        </div>

        {/* Pro Tier */}
        <div className={`rounded-3xl p-8 border ${userTier === 'PRO' ? 'bg-[#111] border-amber-400' : 'bg-[#0A0A0A] border-amber-500/30'} flex flex-col transition-all relative overflow-hidden group`}>
           <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-300 via-yellow-500 to-amber-300"></div>
           {userTier === 'PRO' && (
             <div className="absolute top-0 right-0 bg-amber-400 text-black text-[10px] font-bold px-3 py-1 rounded-bl-xl">ACTIVE</div>
           )}
           <div className="mb-6 relative z-10">
             <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4">
               <Crown className="w-6 h-6 text-amber-400" />
             </div>
             <h3 className="text-xl font-bold text-white">Pro Access</h3>
             <div className="mt-2 flex items-baseline gap-1">
               <span className="text-3xl font-bold text-white">₹499</span>
               <span className="text-slate-500 text-sm">/month</span>
             </div>
             <p className="text-slate-400 text-sm font-light mt-4">Deep insights and tax preparation AI.</p>
           </div>

           <div className="flex-1 space-y-4 mb-8 relative z-10">
             <div className="flex items-center gap-3 text-sm text-white font-medium">
               <Check className="w-4 h-4 text-amber-400" /> <span>Everything in Starter</span>
             </div>
             <div className="flex items-center gap-3 text-sm text-white font-medium">
               <Check className="w-4 h-4 text-amber-400" /> <span>ITR Document Analysis</span>
             </div>
             <div className="flex items-center gap-3 text-sm text-white font-medium">
               <Check className="w-4 h-4 text-amber-400" /> <span>Tax Liability Estimation</span>
             </div>
             <div className="flex items-center gap-3 text-sm text-white font-medium">
               <Check className="w-4 h-4 text-amber-400" /> <span>Strategic AI Insights</span>
             </div>
             <div className="flex items-center gap-3 text-sm text-white font-medium">
               <Check className="w-4 h-4 text-amber-400" /> <span>Unlimited History</span>
             </div>
           </div>
           
           {/* Ambient Glow */}
           <div className="absolute bottom-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-500/20 transition-colors"></div>

           <button 
             disabled={userTier === 'PRO'}
             onClick={handleUpgradeClick}
             className={`relative z-10 w-full py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-all ${userTier === 'PRO' ? 'bg-amber-500/10 text-amber-500 cursor-default' : 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black hover:scale-105 shadow-lg shadow-amber-500/20'}`}
           >
             {userTier === 'PRO' ? 'Currently Active' : 'Upgrade Now'}
           </button>
        </div>
      </div>

      {/* Payment Modal Simulation */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
           <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 shadow-2xl">
              
              <div className="p-6 border-b border-white/5 flex justify-between items-center">
                 <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-brand-500" /> Secure Payment
                 </h3>
                 {!processing && !paymentSuccess && (
                     <button onClick={() => setShowPaymentModal(false)}><X className="w-5 h-5 text-slate-500 hover:text-white" /></button>
                 )}
              </div>

              <div className="p-6">
                {paymentSuccess ? (
                    <div className="py-10 flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-5">
                        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
                            <Check className="w-8 h-8 text-green-500" />
                        </div>
                        <h4 className="text-xl font-bold text-white mb-2">Payment Successful!</h4>
                        <p className="text-slate-400 text-sm">Welcome to FinSight Pro.</p>
                    </div>
                ) : (
                    <form onSubmit={handlePaymentSubmit} className="space-y-4">
                        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 mb-6">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-bold text-amber-400 uppercase">Total Amount</span>
                                <span className="text-lg font-bold text-white">₹499.00</span>
                            </div>
                            <p className="text-[10px] text-amber-200/70">FinSight Pro Monthly Subscription</p>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1">Card Number</label>
                                <input disabled={processing} required type="text" placeholder="0000 0000 0000 0000" className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-brand-500 transition-colors font-mono" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1">Expiry</label>
                                    <input disabled={processing} required type="text" placeholder="MM/YY" className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-brand-500 transition-colors font-mono" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1">CVC</label>
                                    <input disabled={processing} required type="text" placeholder="123" className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-brand-500 transition-colors font-mono" />
                                </div>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={processing}
                            className="w-full mt-6 bg-brand-600 hover:bg-brand-500 disabled:bg-brand-600/50 disabled:cursor-not-allowed text-white py-3 rounded-lg font-bold shadow-lg shadow-brand-500/20 transition-all flex items-center justify-center gap-2"
                        >
                            {processing ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" /> Processing...
                                </>
                            ) : 'Pay ₹499'}
                        </button>
                    </form>
                )}
              </div>
              
              {!paymentSuccess && (
                  <div className="bg-[#111] p-3 text-center border-t border-white/5">
                    <p className="text-[10px] text-slate-500 flex items-center justify-center gap-2">
                        <Shield className="w-3 h-3" /> Encrypted & Secure Payment Gateway
                    </p>
                </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
};