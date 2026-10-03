import React, { useState } from 'react';
import { X, UserPlus, Copy, Check, QrCode, Share2, Sparkles, Users } from 'lucide-react';
import { useWallet } from '../../context/WalletContext';

export const InviteModal: React.FC = () => {
  const { user, setActiveSubModal, addInviteSimulation } = useWallet();
  const [copied, setCopied] = useState(false);

  const inviteUrl = `https://aiwealth.ug/register?ref=${user.referralCode}`;

  const copyUrl = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-5 space-y-4 shadow-2xl animate-in zoom-in-95">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-base text-slate-100">Invite & Earn 20%</h3>
          </div>
          <button
            onClick={() => setActiveSubModal(null)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* QR & Code box */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col items-center text-center space-y-3">
          <div className="w-28 h-28 bg-white p-2 rounded-2xl flex items-center justify-center shadow-lg">
            {/* Minimalist SVG QR */}
            <svg viewBox="0 0 100 100" className="w-full h-full text-slate-950 fill-current">
              <rect x="0" y="0" width="30" height="30" />
              <rect x="5" y="5" width="20" height="20" fill="white" />
              <rect x="10" y="10" width="10" height="10" />

              <rect x="70" y="0" width="30" height="30" />
              <rect x="75" y="5" width="20" height="20" fill="white" />
              <rect x="80" y="10" width="10" height="10" />

              <rect x="0" y="70" width="30" height="30" />
              <rect x="5" y="75" width="20" height="20" fill="white" />
              <rect x="10" y="80" width="10" height="10" />

              <rect x="40" y="10" width="20" height="10" />
              <rect x="40" y="30" width="10" height="40" />
              <rect x="60" y="40" width="30" height="10" />
              <rect x="40" y="80" width="20" height="10" />
              <rect x="70" y="70" width="20" height="20" />
            </svg>
          </div>

          <div>
            <div className="text-[11px] text-slate-400">Your Invitation Code</div>
            <div className="font-mono font-black text-lg text-amber-400 tracking-wider mt-0.5">
              {user.referralCode}
            </div>
          </div>
        </div>

        {/* Copy link & Referral code row */}
        <div className="space-y-3 text-xs">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-slate-400 font-medium">Your Referral Link</label>
              {copied && <span className="text-emerald-400 text-[11px] font-bold">Copied to Clipboard!</span>}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={inviteUrl}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs font-mono text-slate-300 outline-none truncate select-all focus:border-amber-500/50"
              />
              <button
                id="copy-referral-link-btn"
                onClick={copyUrl}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shrink-0 transition-all active:scale-95 shadow-md ${
                  copied
                    ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/20'
                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                }`}
              >
                {copied ? <Check className="w-4 h-4 stroke-[2.5]" /> : <Copy className="w-4 h-4 stroke-[2.5]" />}
                <span>{copied ? 'Copied' : 'Copy to Clipboard'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Commission rule notes */}
        <div className="bg-indigo-950/20 border border-indigo-500/20 rounded-xl p-3 text-xs space-y-1 text-slate-300">
          <div className="font-bold text-indigo-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Referral Benefits:</span>
          </div>
          <p>• 20% direct cash bonus on Level 1 invite VIP activation.</p>
          <p>• 2% on Level 2 and 1% on Level 3 sub-referrals.</p>
          <p>• Instant withdrawal to MTN/Airtel MoMo.</p>
        </div>

        <button
          onClick={() => {
            addInviteSimulation();
            setActiveSubModal(null);
          }}
          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700"
        >
          <Users className="w-3.5 h-3.5 text-indigo-400" />
          <span>Simulate 1 Active Friend Signup (+20% Bonus)</span>
        </button>
      </div>
    </div>
  );
};
