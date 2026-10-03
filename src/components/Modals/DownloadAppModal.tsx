import React, { useState } from 'react';
import { X, Download, Smartphone, Check, ArrowDownToLine, ShieldCheck } from 'lucide-react';
import { useWallet } from '../../context/WalletContext';

export const DownloadAppModal: React.FC = () => {
  const { setActiveSubModal } = useWallet();
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setDownloaded(true);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-5 space-y-4 shadow-2xl animate-in zoom-in-95">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
              <Download className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-base text-slate-100">Download Mobile App</h3>
          </div>
          <button
            onClick={() => setActiveSubModal(null)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 font-black text-2xl flex items-center justify-center mx-auto shadow-xl shadow-amber-500/20">
            UGX
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-100">AI Wealth Uganda Official v2.4</h4>
            <p className="text-xs text-slate-400 mt-0.5">Optimized for MTN & Airtel MoMo Payouts</p>
          </div>
          <div className="inline-flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verified Secure & Virus Free (14.2 MB)</span>
          </div>
        </div>

        <div className="space-y-2 text-xs">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white font-bold text-xs shadow-lg shadow-teal-950 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            {downloading ? (
              <span>Downloading Android APK...</span>
            ) : downloaded ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>APK Download Complete (Click to install)</span>
              </>
            ) : (
              <>
                <ArrowDownToLine className="w-4 h-4" />
                <span>Download Android APK</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              alert('To install on iOS/Safari: Tap Share -> "Add to Home Screen"');
            }}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs flex items-center justify-center gap-1.5 border border-slate-700"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Install Web App (iOS / Safari)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
