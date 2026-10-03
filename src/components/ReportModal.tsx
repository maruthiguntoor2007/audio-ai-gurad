import React from 'react';
import { ScenarioData, AnalystUser } from '../types/forensics';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  scenario: ScenarioData;
  currentUser: AnalystUser;
  showToast: (msg: string) => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  scenario,
  currentUser,
  showToast,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopySummary = () => {
    const text = `AUDIOGUARD AI FORENSIC INVESTIGATION REPORT
Case Ref: AG-CASE-8841-A
Evidence Item: ${scenario.fileName}
SHA-256 Seal: 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069
Verdict: ${scenario.verdictTitle} (${scenario.confidence}%)
Sub-Classification: ${scenario.verdictSubtitle}
Examining Analyst: ${currentUser.name} (${currentUser.role})
Compliance: CJIS-Standard / ISO 8601 Verification`;

    navigator.clipboard.writeText(text);
    showToast('Report text summary copied to clipboard');
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#060e20]/85 backdrop-blur-md flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div className="w-full max-w-2xl bg-[#0b1326] border border-outline-variant/50 rounded-2xl p-5 md:p-8 shadow-2xl relative my-auto flex flex-col gap-5 text-on-surface">
        {/* Header Actions */}
        <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[24px]">description</span>
            <div>
              <h2 className="font-headline font-bold text-lg md:text-xl text-on-surface">
                Forensic Investigation Dossier
              </h2>
              <span className="font-mono text-[11px] text-tertiary">
                CASE #DF-8841-A • EVIDENTIARY DOSSIER
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-bright font-mono text-xs text-on-surface flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              <span className="hidden sm:inline">Print / PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-bright flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>

        {/* Dossier Body (Printable formatting) */}
        <div className="bg-surface-container rounded-xl p-4 md:p-6 flex flex-col gap-4 border border-outline-variant/30 font-body text-xs md:text-sm">
          {/* Top metadata table */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs border-b border-outline-variant/20 pb-3">
            <div>
              <span className="text-on-surface-variant block text-[10px]">FILE NAME:</span>
              <span className="text-on-surface font-semibold truncate block">{scenario.fileName}</span>
            </div>
            <div>
              <span className="text-on-surface-variant block text-[10px]">VERDICT:</span>
              <span className="text-error font-bold block">{scenario.verdictTitle}</span>
            </div>
            <div>
              <span className="text-on-surface-variant block text-[10px]">CONFIDENCE:</span>
              <span className="text-primary font-bold block">{scenario.confidence}%</span>
            </div>
            <div>
              <span className="text-on-surface-variant block text-[10px]">EXAMINER:</span>
              <span className="text-tertiary font-semibold truncate block">{currentUser.name}</span>
            </div>
          </div>

          {/* Cryptographic Seal */}
          <div className="bg-surface-container-lowest p-3 rounded-lg font-mono text-xs space-y-1 border border-outline-variant/30">
            <div className="flex justify-between text-on-surface-variant text-[10px]">
              <span>SHA-256 ACOUSTIC DIGEST SEAL</span>
              <span className="text-tertiary font-bold">ED25519 VERIFIED</span>
            </div>
            <p className="text-primary break-all select-all font-semibold text-[11px]">
              7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069
            </p>
          </div>

          {/* Key Findings section */}
          <div className="space-y-2">
            <h4 className="font-headline font-bold text-sm text-on-surface">Key Forensic Findings</h4>
            <div className="space-y-1.5">
              {scenario.findings.map((f, idx) => (
                <div key={idx} className="p-2.5 rounded bg-surface-container-low border border-outline-variant/20">
                  <span className="font-semibold text-on-surface font-mono text-xs">{f.title}: </span>
                  <span className="text-on-surface-variant text-xs">{f.description}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Anomaly Timestamps */}
          {scenario.anomalies.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-headline font-bold text-sm text-on-surface">Correlated Anomaly Segments</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {scenario.anomalies.map((a) => (
                  <div key={a.id} className="p-2.5 bg-surface-container-low rounded border border-outline-variant/20">
                    <div className="flex justify-between font-mono text-[11px] font-bold text-primary">
                      <span>{a.name}</span>
                      <span className="text-error">{a.timeRange}</span>
                    </div>
                    <span className="font-mono text-[10px] text-tertiary block mt-1">
                      {a.mathematicalProof}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Examiner Sign-off */}
          <div className="pt-2 border-t border-outline-variant/20 flex items-center justify-between text-on-surface-variant font-mono text-xs flex-wrap gap-2">
            <div>
              <span className="block text-[10px]">CERTIFYING OFFICER:</span>
              <span className="text-on-surface font-bold">{currentUser.name}</span>
              <span className="block text-[10px] opacity-75">{currentUser.department}</span>
            </div>
            <div className="text-right">
              <span className="block text-[10px]">CLEARANCE TIER:</span>
              <span className="text-tertiary font-bold">{currentUser.clearance}</span>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleCopySummary}
            className="py-2.5 px-4 rounded-lg bg-surface-container hover:bg-surface-high font-mono text-xs text-on-surface flex items-center gap-1.5 transition-colors cursor-pointer border border-outline-variant/30"
          >
            <span className="material-symbols-outlined text-[16px]">content_copy</span>
            <span>Copy Text Summary</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-6 rounded-lg bg-primary text-on-primary font-mono text-xs font-bold uppercase transition-all shadow-md cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
