import React, { useState } from 'react';
import { X, ArrowDownLeft, Phone, Zap, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useWallet } from '../../context/WalletContext';

export const DepositModal: React.FC = () => {
  const { user, depositMoney, setActiveSubModal } = useWallet();
  const [network, setNetwork] = useState<'MTN' | 'AIRTEL'>('MTN');
  const [phone, setPhone] = useState(user.momoNumber);
  const [amount, setAmount] = useState('30000');
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const presets = [10000, 30000, 50000, 80000, 200000, 500000];

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (!num || num < 5000) return;

    setIsProcessing(true);
    setTimeout(() => {
      depositMoney(num, network, phone);
      setIsProcessing(false);
      setSuccess(true);
      setTimeout(() => {
        setActiveSubModal(null);
      }, 1800);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-5 space-y-4 shadow-2xl animate-in zoom-in-95">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-base text-slate-100">Deposit MoMo (UGX)</h3>
          </div>
          <button
            onClick={() => setActiveSubModal(null)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="text-center py-6 space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <h4 className="font-bold text-base text-emerald-300">Deposit Successful!</h4>
            <p className="text-xs text-slate-300">
              {parseFloat(amount).toLocaleString()} UGX has been credited to your balance.
            </p>
          </div>
        ) : (
          <form onSubmit={handleDeposit} className="space-y-3.5 text-xs">
            {/* Network Selector */}
            <div>
              <label className="block text-slate-400 font-medium mb-1">Select Network</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setNetwork('MTN')}
                  className={`py-2.5 px-3 rounded-xl border font-bold flex items-center justify-center gap-2 transition-all ${
                    network === 'MTN'
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                  <span>MTN MoMo (*165#)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setNetwork('AIRTEL')}
                  className={`py-2.5 px-3 rounded-xl border font-bold flex items-center justify-center gap-2 transition-all ${
                    network === 'AIRTEL'
                      ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span>Airtel Money (*185#)</span>
                </button>
              </div>
            </div>

            {/* Sender Phone */}
            <div>
              <label className="block text-slate-400 font-medium mb-1">MoMo Account Phone</label>
              <div className="relative">
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 font-mono outline-none"
                  placeholder="+2567..."
                  required
                />
                <Phone className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-slate-400 font-medium mb-1">Deposit Amount (UGX)</label>
              <input
                type="number"
                min="5000"
                step="1000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-base font-bold text-emerald-400 outline-none"
                required
              />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {presets.map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAmount(val.toString())}
                    className={`px-2 py-1 rounded-lg border text-[11px] ${
                      amount === val.toString()
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    {val.toLocaleString()} UGX
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <div className="flex items-center gap-1 text-slate-300 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Instant MoMo Prompt Processing:</span>
              </div>
              <p>You will receive a PIN prompt on your phone to authorize payment.</p>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-950 flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
            >
              <Zap className="w-4 h-4" />
              <span>{isProcessing ? 'Waiting for MoMo PIN...' : 'Confirm Deposit & Pay'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
