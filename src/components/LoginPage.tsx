import React, { useState } from 'react';
import { AnalystUser } from '../types/forensics';
import { ANALYST_ROLES } from '../data/mockData';

interface LoginPageProps {
  onLoginSuccess: (user: AnalystUser) => void;
  showToast: (msg: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, showToast }) => {
  const [email, setEmail] = useState('sarah.chen@forensic-guard.gov');
  const [passcode, setPasscode] = useState('password123');
  const [showPasscode, setShowPasscode] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const logoUrl =
    'https://lh3.googleusercontent.com/aida/AEtjO1XwwmY-fJJHjAWmYN2P_OAbp8DRgHu2gS8qIAcqsNxeeuR1QnX61DLS69M9k6wIXQvNEYRIWqUmkbqrx0yEeeQbKOvDmC1EENssQXtjqVw_kUahjvEzV8DIEoYoD4MVjbFjVE4nG1AcWp8R_h4-894YLkkzC2cix1M0GUQeR3z7KFwMfWR7GQS1W3U-gS6tmfpi5FalQbvvgqWx3qTRGm1LUyZxxWG34cXMVPNANyYnWxMqbhyUjBpqAu0';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      showToast('Please enter your email ID');
      return;
    }
    if (!passcode.trim()) {
      showToast('Please enter your passcode');
      return;
    }

    setIsAuthenticating(true);
    showToast('Signing in...');
    setTimeout(() => {
      setIsAuthenticating(false);
      // Find matching user or fallback to lead analyst
      const matchedUser =
        ANALYST_ROLES.find((u) => u.email.toLowerCase() === email.toLowerCase()) || {
          ...ANALYST_ROLES[0],
          email: email.trim(),
        };
      onLoginSuccess(matchedUser);
      showToast(`Signed in successfully as ${matchedUser.name}. Opening Dashboard...`);
    }, 450);
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) {
      showToast('Please enter your email to receive password reset link');
      return;
    }
    showToast(`Password reset link sent to ${resetEmail.trim()}`);
    setForgotPasswordOpen(false);
    setResetEmail('');
  };

  return (
    <div className="min-h-screen bg-[#060e20] text-on-surface flex flex-col items-center justify-center p-4 selection:bg-primary/20 selection:text-primary">
      <div className="w-full max-w-sm flex flex-col items-center gap-6">
        {/* Brand Logo & Title */}
        <div className="flex flex-col items-center text-center gap-2">
          <div className="relative flex items-center justify-center">
            <img
              src={logoUrl}
              alt="AudioGuard AI"
              className="h-16 w-auto object-contain drop-shadow-[0_0_12px_rgba(76,215,246,0.6)]"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-tertiary border-2 border-[#060e20] animate-pulse" />
          </div>
          <div className="flex flex-col">
            <h1 className="font-headline font-bold text-2xl text-on-surface tracking-tight">
              AudioGuard AI
            </h1>
            <p className="font-mono text-xs text-on-surface-variant mt-0.5">
              Forensic Acoustic Neural Engine
            </p>
          </div>
        </div>

        {/* Clean Sign In Box */}
        <div className="w-full bg-[#171f33] rounded-2xl p-6 shadow-2xl border border-outline-variant/40 flex flex-col gap-4">
          <div className="flex flex-col gap-1 text-center">
            <h2 className="font-headline font-bold text-xl text-on-surface">Sign In</h2>
            <p className="font-body text-xs text-on-surface-variant">
              Enter your email ID and passcode to continue
            </p>
          </div>

          {!forgotPasswordOpen ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Email ID Field */}
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-xs font-semibold text-on-surface">Email ID</label>
                <div className="flex items-center bg-[#0b1326] rounded-xl px-3 py-2.5 border border-outline-variant/50 focus-within:border-primary transition-colors">
                  <span className="material-symbols-outlined text-[18px] text-primary mr-2 shrink-0">
                    mail
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email ID"
                    className="w-full bg-transparent font-mono text-xs text-on-surface focus:outline-none placeholder:text-on-surface-variant/50"
                  />
                </div>
              </div>

              {/* Passcode Field */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-mono text-xs font-semibold text-on-surface">Passcode</label>
                  <button
                    type="button"
                    onClick={() => {
                      setResetEmail(email);
                      setForgotPasswordOpen(true);
                    }}
                    className="font-mono text-xs text-primary hover:underline cursor-pointer transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="flex items-center bg-[#0b1326] rounded-xl px-3 py-2.5 border border-outline-variant/50 focus-within:border-primary transition-colors">
                  <span className="material-symbols-outlined text-[18px] text-primary mr-2 shrink-0">
                    lock
                  </span>
                  <input
                    type={showPasscode ? 'text' : 'password'}
                    required
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="Enter passcode"
                    className="w-full bg-transparent font-mono text-xs text-on-surface focus:outline-none placeholder:text-on-surface-variant/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasscode(!showPasscode)}
                    className="text-on-surface-variant hover:text-primary transition-colors ml-1 cursor-pointer"
                    aria-label={showPasscode ? 'Hide passcode' : 'Show passcode'}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {showPasscode ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={isAuthenticating}
                className="w-full py-3 px-4 rounded-xl bg-primary text-on-primary font-mono text-xs md:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-primary/30 hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-75 mt-1"
              >
                {isAuthenticating ? (
                  <>
                    <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
                    <span>Signing In...</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </button>
            </form>
          ) : (
            /* Forgot Password Form */
            <form onSubmit={handleForgotPasswordSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-xs font-semibold text-on-surface">
                  Email ID for Reset
                </label>
                <div className="flex items-center bg-[#0b1326] rounded-xl px-3 py-2.5 border border-outline-variant/50 focus-within:border-primary transition-colors">
                  <span className="material-symbols-outlined text-[18px] text-primary mr-2 shrink-0">
                    mail
                  </span>
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="Enter your email ID"
                    className="w-full bg-transparent font-mono text-xs text-on-surface focus:outline-none placeholder:text-on-surface-variant/50"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-3 rounded-xl bg-primary text-on-primary font-mono text-xs font-bold transition-all hover:brightness-110 active:scale-[0.98] cursor-pointer"
                >
                  Send Reset Link
                </button>
                <button
                  type="button"
                  onClick={() => setForgotPasswordOpen(false)}
                  className="px-3 py-2.5 rounded-xl bg-[#222a3d] text-on-surface font-mono text-xs hover:bg-[#2d3449] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
