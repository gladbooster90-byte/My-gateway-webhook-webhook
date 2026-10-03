import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { WalletProvider, useWallet } from './context/WalletContext';
import { Header } from './components/Header';
import { NoticeBanner } from './components/NoticeBanner';
import { BottomNav } from './components/BottomNav';

// Views
import { HomeView } from './components/Views/HomeView';
import { WalletView } from './components/Views/WalletView';
import { WithdrawView } from './components/Views/WithdrawView';
import { AiTaskView } from './components/Views/AiTaskView';
import { RaffleView } from './components/Views/RaffleView';
import { IncomeView } from './components/Views/IncomeView';
import { TeamView } from './components/Views/TeamView';
import { ChatView } from './components/Views/ChatView';
import { FAQView } from './components/Views/FAQView';

// Modals
import { DepositModal } from './components/Modals/DepositModal';
import { BillModal } from './components/Modals/BillModal';
import { InviteModal } from './components/Modals/InviteModal';
import { RewardModal } from './components/Modals/RewardModal';
import { DownloadAppModal } from './components/Modals/DownloadAppModal';
import { SettingsModal } from './components/Modals/SettingsModal';
import { SignOutModal } from './components/Modals/SignOutModal';
import { VipDetailsModal } from './components/Modals/VipDetailsModal';

const AppContent: React.FC = () => {
  const { activeTab, activeSubModal, setActiveSubModal } = useWallet();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-amber-500 selection:text-slate-950">
      {/* Top App Header */}
      <Header />

      {/* Real-time Notice Ticker */}
      <NoticeBanner />

      {/* Main Dynamic View Area */}
      <main className="flex-1 w-full max-w-md mx-auto relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: [0.25, 1, 0.5, 1] }}
            className="w-full"
          >
            {activeTab === 'Home' && <HomeView />}
            {activeTab === 'Wallet' && <WalletView />}
            {activeTab === 'MyWithdraw' && <WithdrawView />}
            {activeTab === 'AI' && <AiTaskView />}
            {activeTab === 'Raffle' && <RaffleView />}
            {activeTab === 'Income' && <IncomeView />}
            {activeTab === 'Team' && <TeamView />}
            {activeTab === 'chats' && <ChatView />}
            {activeTab === 'FAQ' && <FAQView />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Sticky Navigation */}
      <BottomNav />

      {/* Modals */}
      {activeSubModal === 'deposit' && <DepositModal />}
      {activeSubModal === 'bill' && <BillModal />}
      {activeSubModal === 'invite' && <InviteModal />}
      {activeSubModal === 'reward' && <RewardModal />}
      {activeSubModal === 'download' && <DownloadAppModal />}
      {activeSubModal === 'settings' && <SettingsModal />}
      {activeSubModal === 'signout' && <SignOutModal />}
      {activeSubModal === 'vip_details' && (
        <VipDetailsModal onClose={() => setActiveSubModal(null)} />
      )}
    </div>
  );
};

export default function App() {
  return (
    <WalletProvider>
      <AppContent />
    </WalletProvider>
  );
}
