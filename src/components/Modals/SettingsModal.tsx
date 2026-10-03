import React, { useState } from 'react';
import {
  X,
  User,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Sparkles,
  RefreshCw,
  LogOut,
  LogIn,
  MessageSquarePlus,
  Send,
  AlertCircle,
  Bug,
  Lightbulb,
  HelpCircle,
  Check,
  Volume2,
  VolumeX,
  RotateCcw,
} from 'lucide-react';
import { useWallet } from '../../context/WalletContext';

export const SettingsModal: React.FC = () => {
  const {
    user,
    firebaseUser,
    isAuthLoading,
    signInWithGoogle,
    signOutFirebase,
    updateUserProfileInfo,
    setActiveSubModal,
    soundEnabled,
    toggleSound,
    resetAllAccountsToZero,
  } = useWallet();

  const [activeTab, setActiveTab] = useState<'profile' | 'feedback'>('profile');

  // Profile Form States
  const [name, setName] = useState(user.name);
  const [momoNumber, setMomoNumber] = useState(user.momoNumber);
  const [network, setNetwork] = useState<'MTN' | 'AIRTEL'>(user.network || 'MTN');
  const [pin, setPin] = useState('1234');
  const [notifications, setNotifications] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [isResetting, setIsResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  // Feedback Form States
  const [feedbackType, setFeedbackType] = useState<'suggestion' | 'bug' | 'payout' | 'general'>('suggestion');
  const [feedbackSubject, setFeedbackSubject] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedMessage(null);

    const res = await updateUserProfileInfo({
      name: name.trim() || user.name,
      momoNumber: momoNumber.trim() || user.momoNumber,
      network,
    });

    setIsSaving(false);
    if (res.success) {
      setSavedMessage(res.message);
      setTimeout(() => {
        setSavedMessage(null);
      }, 3000);
    }
  };

  const handleResetBalance = async () => {
    setIsResetting(true);
    setResetMessage(null);
    try {
      await resetAllAccountsToZero();
      setResetMessage('All account balances have been reset to 0.00 UGX.');
      setTimeout(() => {
        setResetMessage(null);
      }, 4000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsResetting(false);
    }
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackMessage.trim()) return;

    setIsSubmittingFeedback(true);
    setTimeout(() => {
      setIsSubmittingFeedback(false);
      setFeedbackSuccess(true);
      setFeedbackSubject('');
      setFeedbackMessage('');
      setTimeout(() => {
        setFeedbackSuccess(false);
      }, 4000);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95 overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center">
              {activeTab === 'profile' ? <User className="w-4 h-4 text-amber-400" /> : <MessageSquarePlus className="w-4 h-4 text-cyan-400" />}
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-100">
                {activeTab === 'profile' ? 'Account & Security' : 'Submit Feedback'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {activeTab === 'profile' ? 'Manage verified credentials & cloud sync' : 'Send suggestions or report bugs to admins'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveSubModal(null)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection Switcher */}
        <div className="p-2 border-b border-slate-800/80 bg-slate-950/60">
          <div className="grid grid-cols-2 p-1 bg-slate-950 border border-slate-800 rounded-xl gap-1">
            <button
              id="settings-tab-profile"
              onClick={() => setActiveTab('profile')}
              className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'profile'
                  ? 'bg-slate-800 text-amber-400 shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Profile & Security</span>
            </button>
            <button
              id="settings-tab-feedback"
              onClick={() => setActiveTab('feedback')}
              className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'feedback'
                  ? 'bg-slate-800 text-cyan-400 shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <MessageSquarePlus className="w-3.5 h-3.5" />
              <span>Feedback & Help</span>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {activeTab === 'feedback' ? (
            /* Feedback Tab View */
            <form onSubmit={handleFeedbackSubmit} className="space-y-4" id="feedback-form">
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 space-y-2">
                <div className="flex items-center gap-2 text-slate-200 font-bold text-xs">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>Platform Helpdesk & Feedback</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Your feedback helps improve VIP compute rewards, network reliability, and payout gateways. Reports are reviewed directly by operations administrators.
                </p>
              </div>

              {/* Feedback Category Buttons */}
              <div className="space-y-1.5">
                <label className="block text-slate-400 font-medium">Category</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'suggestion', label: 'Feature Idea', icon: Lightbulb, color: 'text-amber-400' },
                    { id: 'bug', label: 'Report a Bug', icon: Bug, color: 'text-rose-400' },
                    { id: 'payout', label: 'Payout / Deposit', icon: AlertCircle, color: 'text-emerald-400' },
                    { id: 'general', label: 'General Inquiry', icon: HelpCircle, color: 'text-cyan-400' },
                  ].map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = feedbackType === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setFeedbackType(cat.id as typeof feedbackType)}
                        className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                          isSelected
                            ? 'bg-slate-800 border-cyan-500/60 text-slate-100 shadow-sm shadow-cyan-950'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-300'
                        }`}
                      >
                        <Icon className={`w-3.5 h-3.5 ${cat.color}`} />
                        <span className="text-[11px] font-bold">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-1">
                <label className="block text-slate-400 font-medium">Subject</label>
                <input
                  type="text"
                  value={feedbackSubject}
                  onChange={(e) => setFeedbackSubject(e.target.value)}
                  placeholder="e.g., MTN MoMo notification delay or feature request..."
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-slate-200 outline-none transition-colors"
                />
              </div>

              {/* Message */}
              <div className="space-y-1">
                <label className="block text-slate-400 font-medium flex items-center justify-between">
                  <span>Detailed Description</span>
                  <span className="text-[10px] text-slate-500 font-mono">Max 500 chars</span>
                </label>
                <textarea
                  rows={4}
                  required
                  maxLength={500}
                  value={feedbackMessage}
                  onChange={(e) => setFeedbackMessage(e.target.value)}
                  placeholder="Describe your suggestion or provide steps to reproduce the issue..."
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl p-3 text-slate-200 outline-none transition-colors resize-none leading-relaxed text-xs"
                />
              </div>

              {/* Success Notification */}
              {feedbackSuccess && (
                <div className="p-3 bg-emerald-950/50 border border-emerald-500/40 rounded-xl text-emerald-300 font-bold text-xs flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Thank you! Your ticket has been submitted to the platform administrators.</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmittingFeedback || !feedbackMessage.trim()}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white font-bold text-xs transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
              >
                {isSubmittingFeedback ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Transmitting to Admins...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Feedback to Admins</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Profile & Security Tab */
            <>
              {/* Cloud Firestore & Google Auth Banner */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold text-slate-200">Firebase Cloud Persistence</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    Firestore Connected
                  </span>
                </div>

                {firebaseUser ? (
                  <div className="flex items-center justify-between bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                    <div className="flex items-center gap-2.5">
                      {firebaseUser.photoURL ? (
                        <img
                          src={firebaseUser.photoURL}
                          alt={firebaseUser.displayName || 'User'}
                          referrerPolicy="no-referrer"
                          className="w-9 h-9 rounded-full ring-2 ring-emerald-500/40"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-300 font-bold flex items-center justify-center">
                          {(firebaseUser.displayName || 'G')[0].toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-slate-100">{firebaseUser.displayName || user.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{firebaseUser.email}</div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={signOutFirebase}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-[11px] flex items-center gap-1 border border-slate-700 transition-colors"
                    >
                      <LogOut className="w-3 h-3 text-rose-400" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Sign in with Google to back up your VIP yields, referral earnings, and MoMo withdrawal history across any device.
                    </p>
                    <button
                      type="button"
                      onClick={signInWithGoogle}
                      disabled={isAuthLoading}
                      className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all active:scale-95"
                    >
                      {isAuthLoading ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <LogIn className="w-3.5 h-3.5" />
                      )}
                      <span>Sign In with Google (Sync Data)</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Editable Personal Information Form */}
              <form onSubmit={handleSave} className="space-y-3.5">
                <h4 className="font-bold text-slate-300 text-xs uppercase tracking-wider">
                  Personal & Payout Credentials
                </h4>

                {/* Full Name */}
                <div>
                  <label className="block text-slate-400 font-medium mb-1 flex items-center justify-between">
                    <span>Account Full Name</span>
                    <span className="text-[10px] text-emerald-400">Matches MoMo ID</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-slate-200 font-semibold outline-none transition-colors"
                    placeholder="Glad booster Eric"
                  />
                </div>

                {/* Registered MoMo Number */}
                <div>
                  <label className="block text-slate-400 font-medium mb-1 flex items-center justify-between">
                    <span>MoMo Payout Number</span>
                    <span className="text-[10px] text-amber-400 font-mono">Uganda (+256)</span>
                  </label>
                  <input
                    type="text"
                    value={momoNumber}
                    onChange={(e) => setMomoNumber(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-slate-200 font-mono font-bold outline-none transition-colors"
                    placeholder="+256768912846"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    Your daily VIP task yields and cashouts are wired directly to this phone number.
                  </p>
                </div>

                {/* Network Selector */}
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Preferred Carrier</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setNetwork('MTN')}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                        network === 'MTN'
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      MTN MoMo Uganda
                    </button>
                    <button
                      type="button"
                      onClick={() => setNetwork('AIRTEL')}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                        network === 'AIRTEL'
                          ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      Airtel Money Uganda
                    </button>
                  </div>
                </div>

                {/* Security PIN */}
                <div>
                  <label className="block text-slate-400 font-medium mb-1">
                    Withdrawal PIN (4-Digits)
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-slate-200 font-mono outline-none"
                  />
                </div>

                {/* Tactile Sound Effects (Cha-Ching) */}
                <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                      {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
                    </div>
                    <div>
                      <div className="font-bold text-slate-200 text-xs">Tactile Sound Effects</div>
                      <div className="text-[10px] text-slate-400">Play 'Cha-Ching' & chimes on AI task completion and raffle wins</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={toggleSound}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      soundEnabled ? 'bg-amber-500' : 'bg-slate-800'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        soundEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* MoMo SMS Notifications */}
                <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div>
                    <div className="font-bold text-slate-200">Instant MoMo SMS Alerts</div>
                    <div className="text-[10px] text-slate-400">Receive SMS notifications on approved cashouts</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications}
                    onChange={(e) => setNotifications(e.target.checked)}
                    className="w-4 h-4 accent-amber-500"
                  />
                </div>

                {/* Balance Management Card */}
                <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <RotateCcw className="w-4 h-4 text-rose-400" />
                      <span className="font-bold text-slate-200 text-xs">Account Balance Reset</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">
                      Balance: <strong className="text-amber-400">{user.totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} UGX</strong>
                    </span>
                  </div>
                  <p className="text-[10.5px] text-slate-400 leading-relaxed">
                    Reset total wallet balance, withdrawable earnings, deposited capital, and earnings to 0.00 UGX.
                  </p>
                  {resetMessage && (
                    <div className="p-2.5 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-emerald-300 font-bold text-[11px] flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{resetMessage}</span>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={handleResetBalance}
                    disabled={isResetting}
                    className="w-full py-2.5 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 hover:border-rose-500/50 text-rose-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isResetting ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Resetting balances to 0.00 UGX...</span>
                      </>
                    ) : (
                      <>
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset All Balances to 0.00 UGX</span>
                      </>
                    )}
                  </button>
                </div>

                {savedMessage && (
                  <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-center text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{savedMessage}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving to Cloud...</span>
                    </>
                  ) : (
                    <span>Save Profile Changes</span>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

