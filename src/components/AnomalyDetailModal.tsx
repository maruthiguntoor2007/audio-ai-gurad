import React from 'react';
import { AnomalyMarker } from '../types/forensics';

interface AnomalyDetailModalProps {
  anomaly: AnomalyMarker | null;
  onClose: () => void;
  onJumpToTime: (sec: number) => void;
}

export const AnomalyDetailModal: React.FC<AnomalyDetailModalProps> = ({
  anomaly,
  onClose,
  onJumpToTime,
}) => {
  if (!anomaly) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#060e20]/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface-container border border-outline-variant/50 rounded-2xl p-5 md:p-6 flex flex-col gap-4 shadow-2xl relative text-on-surface">
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <span className="font-headline font-bold text-lg md:text-xl text-on-surface">
              {anomaly.name}
            </span>
            <span className="font-mono text-xs text-primary font-bold mt-0.5">
              {anomaly.timeRange} • {anomaly.frameRange}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="flex flex-col gap-1.5 p-3 bg-surface-container-low rounded-xl border border-outline-variant/30">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-error font-bold tracking-wider">
              {anomaly.severity}% CRITICAL ANOMALY
            </span>
            <span className="font-mono text-[10px] text-on-surface-variant font-semibold">
              CODE: {anomaly.code}
            </span>
          </div>
          <p className="font-body text-xs md:text-sm text-on-surface-variant leading-relaxed">
            {anomaly.description}
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="font-mono text-[11px] text-on-surface-variant uppercase font-semibold">
            Fourier Phase Drift Vector Proof
          </span>
          <div className="p-3 bg-surface-container-lowest rounded-lg font-mono text-xs text-tertiary border border-outline-variant/30 leading-relaxed break-all">
            <span>{anomaly.mathematicalProof}</span>
          </div>
        </div>

        {/* Audio Wave slice visualization */}
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[10px] text-on-surface-variant uppercase">
            Frame Micro-Spectrogram
          </span>
          <div className="h-16 w-full bg-surface-container-lowest rounded-lg p-2 border border-outline-variant/20 flex items-center justify-center overflow-hidden">
            <svg className="w-full h-full text-error" fill="none" viewBox="0 0 200 40">
              <path
                d="M0,20 Q10,5 20,35 T40,10 T60,30 T80,0 T100,40 T120,5 T140,35 T160,15 T180,25 T200,20"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1 gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => {
              onJumpToTime(anomaly.startSec);
              onClose();
            }}
            className="flex-1 py-2.5 px-3 rounded-lg bg-primary-container text-on-primary-container hover:bg-primary font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">play_circle</span>
            <span>Listen to Glitch</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-4 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-mono text-xs font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
