import React from 'react';
import { AnalystUser } from '../types/forensics';

interface AuthEnclaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AnalystUser;
  onSelectUser: (user: AnalystUser) => void;
  showToast: (msg: string) => void;
  onLogout?: () => void;
}

export const AuthEnclaveModal: React.FC<AuthEnclaveModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  showToast,
  onLogout,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#060e20]/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-[#171f33] border border-outline-variant/50 rounded-2xl p-5 shadow-2xl relative flex flex-col gap-4 text-on-surface">
        <div className="flex items-center justify-between border-b border-outline-variant/30 pb-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">account_circle</span>
            <h3 className="font-headline font-bold text-base text-on-surface">Investigator Profile</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-surface-container hover:bg-surface-bright flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 p-3 bg-[#0b1326] rounded-xl border border-outline-variant/30">
            <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined text-[22px]">person</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-headline font-bold text-sm text-on-surface truncate">
                {currentUser.name}
              </span>
              <span className="font-mono text-xs text-primary truncate">{currentUser.email}</span>
            </div>
          </div>

          <div className="p-3 bg-[#0b1326] rounded-xl border border-outline-variant/30 flex flex-col gap-2 font-mono text-xs">
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Role:</span>
              <span className="text-on-surface font-semibold">{currentUser.role}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Department:</span>
              <span className="text-on-surface font-semibold truncate max-w-[180px]">{currentUser.department}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Badge ID:</span>
              <span className="text-tertiary font-bold">{currentUser.badgeId}</span>
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onLogout) {
                  onLogout();
                }
              }}
              className="flex-1 py-2.5 px-3 rounded-xl bg-error-container text-on-error-container hover:bg-error/30 font-mono text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">logout</span>
              <span>Sign Out</span>
            </button>

            <button
              type="button"
              onClick={() => {
                showToast('Credentials verified');
                onClose();
              }}
              className="flex-1 py-2.5 px-3 rounded-xl bg-[#222a3d] hover:bg-[#2d3449] font-mono text-xs text-on-surface font-semibold transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
