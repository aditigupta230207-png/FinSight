import React, { useState, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Reports } from './components/Reports';
import { Account } from './components/Account';
import { Settings } from './components/Settings';
import { History } from './components/History';
import { Subscription } from './components/Subscription';
import { AIChat } from './components/AIChat';
import { AppView, Transaction, TransactionType, Category, BankAccount, UserTier } from './types';
import { Menu } from 'lucide-react';

// Mock Data
const MOCK_ACCOUNTS: BankAccount[] = [
  { id: '1', name: 'SBI Savings', balance: 145200.50, type: 'Savings', lastSynced: 'Today', accountNumber: '309871XXXXX', holderName: 'John Doe' },
];

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 't1', date: '2023-10-25', description: 'Salary Deposit', amount: 125000, type: TransactionType.INCOME, category: Category.INCOME, merchant: 'Tech Corp India Pvt Ltd' },
  { id: 't2', date: '2023-10-24', description: 'Grocery Store', amount: 4500, type: TransactionType.EXPENSE, category: Category.FOOD, merchant: 'Reliance Smart' },
  { id: 't3', date: '2023-10-23', description: 'Uber Trip', amount: 450.50, type: TransactionType.EXPENSE, category: Category.TRANSPORT, merchant: 'Uber' },
  { id: 't4', date: '2023-10-22', description: 'Monthly Rent', amount: 28000, type: TransactionType.EXPENSE, category: Category.UTILITIES, merchant: 'Landlord' },
  { id: 't5', date: '2023-10-21', description: 'Restaurant Dinner', amount: 3200.00, type: TransactionType.EXPENSE, category: Category.FOOD, merchant: 'Barbeque Nation' },
  { id: 't6', date: '2023-10-20', description: 'Netflix Sub', amount: 649, type: TransactionType.EXPENSE, category: Category.ENTERTAINMENT, merchant: 'Netflix' },
  { id: 't7', date: '2023-10-19', description: 'Petrol Station', amount: 3000.00, type: TransactionType.EXPENSE, category: Category.TRANSPORT, merchant: 'Indian Oil' },
  { id: 't8', date: '2023-10-18', description: 'Freelance Work', amount: 25000, type: TransactionType.INCOME, category: Category.INCOME, merchant: 'Client A' },
  { id: 't9', date: '2023-10-17', description: 'Office Supplies', amount: 4500.50, type: TransactionType.EXPENSE, category: Category.BUSINESS, merchant: 'Amazon Business' },
  { id: 't10', date: '2023-10-16', description: 'Flight Ticket', amount: 8500.00, type: TransactionType.EXPENSE, category: Category.TRAVEL, merchant: 'IndiGo' },
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userTier, setUserTier] = useState<UserTier>('FREE');
  
  // Memoize context data for AI Chat so it updates when relevant data changes
  const aiContextData = useMemo(() => {
    return {
      currentView,
      userTier,
      accounts: MOCK_ACCOUNTS.map(a => ({ name: a.name, balance: a.balance })),
      recentTransactions: MOCK_TRANSACTIONS.slice(0, 5)
    };
  }, [currentView, userTier]);

  const toggleUserTier = () => {
    setUserTier(prev => prev === 'FREE' ? 'PRO' : 'FREE');
  };

  const renderContent = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return <Dashboard transactions={MOCK_TRANSACTIONS} />;
      case AppView.HISTORY:
        return <History />;
      case AppView.REPORTS:
        return (
          <Reports 
            transactions={MOCK_TRANSACTIONS} 
            userTier={userTier} 
            onUpgrade={() => setCurrentView(AppView.SUBSCRIPTION)} 
          />
        );
      case AppView.SUBSCRIPTION:
        return (
          <Subscription
            userTier={userTier}
            onUpgrade={() => setUserTier('PRO')}
            onDowngrade={() => setUserTier('FREE')}
          />
        );
      case AppView.ACCOUNT:
        return (
          <Account 
            userTier={userTier} 
            onToggleTier={toggleUserTier} 
          />
        );
      case AppView.SETTINGS:
        return <Settings />;
      default:
        return <Dashboard transactions={MOCK_TRANSACTIONS} />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#050505] font-sans text-slate-300">
      <Sidebar 
        currentView={currentView} 
        onChangeView={setCurrentView} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        userTier={userTier}
      />
      
      <main className="flex-1 h-full overflow-hidden relative bg-[#050505]">
        {/* Subtle noise texture overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none mix-blend-overlay"></div>
        
        {/* Mobile Menu Toggle Button */}
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="md:hidden absolute top-6 left-6 z-40 p-2.5 bg-[#111] border border-white/10 rounded-lg text-white hover:bg-white/5 transition-colors shadow-xl"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Content Wrapper with padding adjustment for mobile toggle */}
        <div className="h-full pt-16 md:pt-0">
          {renderContent()}
        </div>

        <AIChat contextData={aiContextData} />
      </main>
    </div>
  );
};

export default App;