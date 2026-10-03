import React from 'react';
import { X, LogOut, RefreshCw, RotateCcw } from 'lucide-react';
import { useWallet } from '../../context/WalletContext';

export const SignOutModal: React.FC = () => {
  const { setActiveSubModal, setActiveTab } = useWallet();

  const handleResetSession = () => {
    localStorage.removeItem('ugx_wallet_user');
    localStorage.removeItem('ugx_withdrawal_records');
    localStorage.removeItem('ugx_transaction_bills');
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl animate-in zoom-in-95 text-center">
        <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center mx-auto">
          <LogOut className="w-6 h-6" />
        </div>

        <div>
          <h3 className="font-bold text-base text-slate-100">Sign out / Switch Account</h3>
          <p className="text-xs text-slate-400 mt-1">
            Are you sure you want to sign out of Glad booster Eric (+256768912846)?
          </p>
        </div>

        <div className="space-y-2 pt-2 text-xs">
          <button
            onClick={() => {
              setActiveSubModal(null);
              setActiveTab('Home');
            }}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold border border-slate-700 transition-colors"
          >
            Stay Signed In
          </button>

          <button
            onClick={handleResetSession}
            className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold transition-colors flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset / Switch Account</span>
          </button>
        </div>
      </div>
    </div>
  );
};
