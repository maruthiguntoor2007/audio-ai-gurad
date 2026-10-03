import React from 'react';
import { ViewMode } from '../types/forensics';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  viewMode: ViewMode;
  onSetViewMode: (mode: ViewMode) => void;
  showToast: (msg: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  viewMode,
  onSetViewMode,
  showToast,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#060e20]/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface-container border border-outline-variant/50 rounded-2xl p-5 md:p-6 flex flex-col gap-4 shadow-2xl relative text-on-surface">
        <div className="flex items-center justify-between border-b border-outline-variant/30 pb-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">tune</span>
            <h3 className="font-headline font-bold text-base md:text-lg text-on-surface">
              Forensic Engine Settings
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>

        {/* View Mode Toggle */}
        <div className="flex flex-col gap-2">
          <span className="font-mono text-xs font-semibold text-on-surface">Display Terminology Mode</span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                onSetViewMode('forensic');
                showToast('Switched to Forensic Deep Spec terminology');
              }}
              className={`p-3 rounded-xl flex flex-col gap-1 text-left border transition-all cursor-pointer ${
                viewMode === 'forensic'
                  ? 'bg-primary/15 border-primary text-on-surface shadow-sm'
                  : 'bg-surface-container-low border-outline-variant/30 text-on-surface-variant'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-primary">Forensic Spec</span>
                {viewMode === 'forensic' && (
                  <span className="material-symbols-outlined text-primary text-[16px]">check</span>
                )}
              </div>
              <span className="font-body text-[11px] text-on-surface-variant leading-tight">
                MFCCs, Mel-Spectrograms, Vocoder Jitter, Decision Forests
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                onSetViewMode('simplified');
                showToast('Switched to Plain English summary terminology');
              }}
              className={`p-3 rounded-xl flex flex-col gap-1 text-left border transition-all cursor-pointer ${
                viewMode === 'simplified'
                  ? 'bg-primary/15 border-primary text-on-surface shadow-sm'
                  : 'bg-surface-container-low border-outline-variant/30 text-on-surface-variant'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-primary">Plain English</span>
                {viewMode === 'simplified' && (
                  <span className="material-symbols-outlined text-primary text-[16px]">check</span>
                )}
              </div>
              <span className="font-body text-[11px] text-on-surface-variant leading-tight">
                Computer Generated, Robotic Glitches, Sound Waves
              </span>
            </button>
          </div>
        </div>

        {/* FFT Resolution Setting */}
        <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-surface-container-low border border-outline-variant/20">
          <div className="flex justify-between font-mono text-xs">
            <span className="text-on-surface font-semibold">STFT Window Size (FFT)</span>
            <span className="text-primary font-bold">1024 / 256 Hop</span>
          </div>
          <span className="font-body text-[11px] text-on-surface-variant">
            Higher resolution improves narrow formant tracking in human vocal tract.
          </span>
        </div>

        {/* Zero-Memory Sandbox Setting */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-outline-variant/20">
          <div className="flex flex-col">
            <span className="font-mono text-xs font-semibold text-on-surface">Zero-Memory Sandbox</span>
            <span className="font-body text-[11px] text-on-surface-variant">
              Discard raw audio tensor buffers immediately after inference
            </span>
          </div>
          <span className="font-mono text-xs text-tertiary font-bold px-2 py-0.5 rounded bg-tertiary/15">
            ACTIVE
          </span>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 px-4 rounded-xl bg-primary text-on-primary font-mono text-xs font-bold uppercase transition-all shadow-md mt-1 cursor-pointer"
        >
          Save & Return
        </button>
      </div>
    </div>
  );
};
