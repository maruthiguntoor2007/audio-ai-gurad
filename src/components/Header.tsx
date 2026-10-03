import React from 'react';
import { ViewMode, AnalystUser } from '../types/forensics';

interface HeaderProps {
  viewMode: ViewMode;
  onToggleViewMode: () => void;
  onOpenSettings: () => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  currentUser: AnalystUser;
  activeTabTitle: string;
}

export const Header: React.FC<HeaderProps> = ({
  viewMode,
  onToggleViewMode,
  onOpenSettings,
  onOpenAuth,
  onLogout,
  currentUser,
  activeTabTitle,
}) => {
  const logoUrl =
    'https://lh3.googleusercontent.com/aida/AEtjO1XwwmY-fJJHjAWmYN2P_OAbp8DRgHu2gS8qIAcqsNxeeuR1QnX61DLS69M9k6wIXQvNEYRIWqUmkbqrx0yEeeQbKOvDmC1EENssQXtjqVw_kUahjvEzV8DIEoYoD4MVjbFjVE4nG1AcWp8R_h4-894YLkkzC2cix1M0GUQeR3z7KFwMfWR7GQS1W3U-gS6tmfpi5FalQbvvgqWx3qTRGm1LUyZxxWG34cXMVPNANyYnWxMqbhyUjBpqAu0';

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 pt-safe bg-[#0b1326]/90 backdrop-blur-xl border-b border-[#222a3d]/60 shadow-[0_4px_20px_rgba(0,0,0,0.45)]">
      <div className="max-w-7xl mx-auto h-20 px-3 md:px-6 flex items-center justify-between">
        {/* Brand Area */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center shrink-0">
            <img
              alt="AudioGuard AI Logo"
              className="h-9 w-auto object-contain drop-shadow-[0_0_8px_rgba(76,215,246,0.5)]"
              src={logoUrl}
              onError={(e) => {
                // Fallback SVG in case of offline/network issue
                e.currentTarget.style.display = 'none';
              }}
            />
            {/* Fallback shield icon */}
            <div className="absolute -inset-1 rounded-full bg-primary/20 blur-sm -z-10" />
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-headline font-bold text-lg md:text-xl tracking-tight text-on-surface leading-none">
                AudioGuard AI
              </span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-surface-container-high border border-tertiary/30 text-tertiary font-mono text-[10px] tracking-wider uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse" />
                DEMO MODE (OFFLINE)
              </span>
            </div>
            <span className="font-mono text-[11px] text-on-surface-variant tracking-wider uppercase mt-1 truncate">
              {viewMode === 'forensic'
                ? `Signal & Acoustic Forensics • ${activeTabTitle}`
                : `Voice Authenticity Scanner • ${activeTabTitle}`}
            </span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 md:gap-2.5">
          {/* Mode switch pill */}
          <button
            type="button"
            onClick={onToggleViewMode}
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/40 text-on-surface text-xs font-mono transition-colors cursor-pointer"
            title="Switch between Technical Forensic Spec and Plain English summary view"
          >
            <span className="material-symbols-outlined text-[15px] text-primary">
              {viewMode === 'forensic' ? 'biotech' : 'translate'}
            </span>
            <span>{viewMode === 'forensic' ? 'Forensic Spec' : 'Plain English'}</span>
          </button>

          {/* Forensic Settings modal button */}
          <button
            type="button"
            onClick={onOpenSettings}
            aria-label="Forensic Sensitivity Parameters"
            className="w-10 h-10 flex items-center justify-center rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors cursor-pointer"
            title="Settings & DSP Parameters"
          >
            <span className="material-symbols-outlined text-[20px]">tune</span>
          </button>

          {/* User Enclave / Role Avatar button */}
          <button
            type="button"
            onClick={onOpenAuth}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full bg-surface-container hover:bg-surface-container-high transition-all border border-primary/30 group cursor-pointer"
            title={`Investigator: ${currentUser.name} (${currentUser.role}). Tap to switch profiles.`}
          >
            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/60 flex items-center justify-center shadow-[0_0_10px_rgba(76,215,246,0.3)]">
              <span className="material-symbols-outlined text-primary text-[18px]">verified_user</span>
            </div>
            <span className="hidden md:inline font-mono text-xs text-on-surface group-hover:text-primary transition-colors">
              {currentUser.name.split(' ')[0]}
            </span>
          </button>

          {/* Lock / Log out to Login Page */}
          <button
            type="button"
            onClick={onLogout}
            aria-label="Lock Terminal & Return to Login"
            className="w-10 h-10 flex items-center justify-center rounded-lg text-on-surface-variant hover:text-error hover:bg-error-container/20 transition-colors cursor-pointer"
            title="Lock Terminal & Return to Login Screen"
          >
            <span className="material-symbols-outlined text-[19px]">lock</span>
          </button>
        </div>
      </div>
    </header>
  );
};
