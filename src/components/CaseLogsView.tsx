import React, { useState } from 'react';
import { ViewMode, IncidentRecord } from '../types/forensics';
import { RECENT_INCIDENTS } from '../data/mockData';

interface CaseLogsViewProps {
  viewMode: ViewMode;
  onOpenReport: () => void;
  onSelectIncident?: (incident: IncidentRecord) => void;
  showToast: (msg: string) => void;
}

export const CaseLogsView: React.FC<CaseLogsViewProps> = ({
  viewMode,
  onOpenReport,
  onSelectIncident,
  showToast,
}) => {
  const [filter, setFilter] = useState<'all' | 'deepfake' | 'genuine' | 'flagged'>('all');
  const hashVal = '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069';

  const filteredIncidents = RECENT_INCIDENTS.filter((item) => {
    if (filter === 'all') return true;
    return item.category === filter;
  });

  const handleCopyHash = () => {
    navigator.clipboard.writeText(hashVal);
    showToast('SHA-256 seal copied to clipboard');
  };

  const handleVerifyCustody = () => {
    showToast('Chain of custody verified: Ed25519 digital signature valid');
  };

  const handleExportStix = () => {
    const stixBundle = {
      type: 'bundle',
      id: 'bundle--8841a-forensics-df09',
      spec_version: '2.1',
      objects: [
        {
          type: 'observed-data',
          id: 'observed-data--7f83b165',
          created: '2025-02-28T14:22:04Z',
          first_observed: '2025-02-28T14:21:40Z',
          number_observed: 1,
          objects: {
            '0': {
              type: 'file',
              name: 'sample_exec_call_clone.wav',
              hashes: {
                'SHA-256': hashVal,
              },
              x_forensic_classification: 'AI-SYNTHESIZED (96.8%)',
              x_vocoder_anomaly: 'DiffWave v3.2 / 6.2kHz Nyquist Truncation',
            },
          },
        },
      ],
    };

    const blob = new Blob([JSON.stringify(stixBundle, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'audioguard_telemetry_stix21.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast('STIX 2.1 JSON bundle downloaded');
  };

  return (
    <div className="flex flex-col w-full text-on-surface">
      {/* Top Legal Notice Banner */}
      <div className="sticky top-20 z-40 px-3 py-2 bg-surface-container-high text-on-surface shadow-md flex items-center justify-between gap-2 border-b border-outline-variant/30">
        <div className="flex items-center gap-2 min-w-0">
          <span className="material-symbols-outlined text-primary text-[18px] shrink-0">verified</span>
          <p className="font-mono text-[11px] leading-tight text-on-surface-variant truncate font-semibold">
            {viewMode === 'forensic'
              ? 'SIMULATED FORENSIC AUDIT ENGINE — Case records are cryptographically timestamped.'
              : 'SIMULATED DEMO — Case history records and downloadable reports are sample examples.'}
          </p>
        </div>
        <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-surface-container-low text-tertiary font-bold shrink-0">
          CJIS-MOCK
        </span>
      </div>

      <div className="max-w-4xl mx-auto w-full p-3 md:p-6 flex flex-col gap-4">
        {/* Cryptographic Chain of Custody & Hash Seal Card */}
        <section className="w-full bg-surface-container text-on-surface p-4 rounded-xl space-y-3 shadow-md relative overflow-hidden border border-outline-variant/40">
          <div className="absolute -right-8 -top-8 w-28 h-28 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-surface-container-high text-tertiary flex items-center justify-center shrink-0 border border-tertiary/30">
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  enhanced_encryption
                </span>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-mono text-sm font-semibold text-on-surface truncate">
                    sample_exec_call_clone.wav
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-surface-container-lowest text-tertiary font-mono text-[10px] uppercase font-bold border border-tertiary/20">
                    WAV • 48kHz
                  </span>
                </div>
                <span className="font-mono text-[11px] text-tertiary tracking-wide uppercase font-semibold flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse inline-block" />
                  MATCH VERIFIED — CRYPTOGRAPHIC INTEGRITY SECURED
                </span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-tertiary/15 text-tertiary font-mono text-[10px] uppercase font-bold shrink-0 border border-tertiary/30">
              SEALED
            </span>
          </div>

          {/* SHA-256 Hash Display Box */}
          <div className="bg-surface-container-lowest text-on-surface-variant p-3 rounded-lg space-y-1.5 border border-outline-variant/30">
            <div className="flex items-center justify-between text-on-surface-variant font-mono">
              <span className="text-[11px] uppercase tracking-wider text-secondary flex items-center gap-1 font-semibold">
                <span className="material-symbols-outlined text-[14px]">key</span>
                {viewMode === 'forensic' ? 'SHA-256 Acoustic Seal' : 'Unique Audio Fingerprint'}
              </span>
              <span className="text-[10px] text-on-surface-variant">256-BIT DIGEST</span>
            </div>

            <p className="font-mono text-[11px] text-primary-fixed break-all select-all font-medium leading-relaxed bg-surface-container-high/40 p-2 rounded border border-outline-variant/20">
              {hashVal}
            </p>

            <div className="flex items-center justify-between pt-0.5 font-mono text-[11px]">
              <span className="text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">schedule</span> 2025-02-28 14:22:04 UTC
              </span>
              <span className="text-tertiary font-semibold">ISO 8601 Compliance</span>
            </div>
          </div>

          {/* Seal Actions */}
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleCopyHash}
              className="flex-1 py-2 px-3 rounded-lg bg-surface-container-high hover:bg-surface-bright active:scale-95 transition-all flex items-center justify-center gap-1.5 font-mono text-xs font-semibold text-primary border border-outline-variant/30 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">content_copy</span>
              <span>Copy Hash</span>
            </button>
            <button
              type="button"
              onClick={handleVerifyCustody}
              className="flex-1 py-2 px-3 rounded-lg bg-primary-container text-on-primary-container hover:bg-primary active:scale-95 transition-all flex items-center justify-center gap-1.5 font-mono text-xs font-bold shadow-md cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">task_alt</span>
              <span>Verify Custody</span>
            </button>
          </div>
        </section>

        {/* Incident Investigation History Log */}
        <section className="w-full space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-[20px]">history_edu</span>
              <h2 className="font-headline font-bold text-base md:text-lg text-on-surface">
                {viewMode === 'forensic' ? 'Incident History Log' : 'Past Case History'}
              </h2>
            </div>
            <span className="font-mono text-xs text-on-surface-variant">14 Records Total</span>
          </div>

          {/* Status Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-full font-mono text-xs font-semibold shrink-0 transition-all flex items-center gap-1 cursor-pointer ${
                filter === 'all'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span>All</span>
              <span className="px-1.5 py-0.2 rounded-full bg-surface-container text-[10px]">14</span>
            </button>

            <button
              type="button"
              onClick={() => setFilter('deepfake')}
              className={`px-3 py-1.5 rounded-full font-mono text-xs font-semibold shrink-0 transition-all flex items-center gap-1 cursor-pointer ${
                filter === 'deepfake'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span>{viewMode === 'forensic' ? 'Deepfakes' : 'Fake Voices'}</span>
              <span className="px-1.5 py-0.2 rounded-full bg-surface-container text-error text-[10px]">9</span>
            </button>

            <button
              type="button"
              onClick={() => setFilter('genuine')}
              className={`px-3 py-1.5 rounded-full font-mono text-xs font-semibold shrink-0 transition-all flex items-center gap-1 cursor-pointer ${
                filter === 'genuine'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span>{viewMode === 'forensic' ? 'Genuine' : 'Real Voices'}</span>
              <span className="px-1.5 py-0.2 rounded-full bg-surface-container text-tertiary text-[10px]">5</span>
            </button>

            <button
              type="button"
              onClick={() => setFilter('flagged')}
              className={`px-3 py-1.5 rounded-full font-mono text-xs font-semibold shrink-0 transition-all flex items-center gap-1 cursor-pointer ${
                filter === 'flagged'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span>Flagged Review</span>
              <span className="px-1.5 py-0.2 rounded-full bg-surface-container text-secondary text-[10px]">0</span>
            </button>
          </div>

          {/* Forensic Incident Cards List */}
          <div className="space-y-2.5">
            {filteredIncidents.map((incident) => {
              const isDf = incident.category === 'deepfake';
              return (
                <article
                  key={incident.id}
                  onClick={() => onSelectIncident?.(incident)}
                  className="w-full bg-surface-container hover:bg-surface-container-high text-on-surface p-3.5 rounded-xl space-y-2 transition-all border border-outline-variant/30 cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-surface-container-lowest text-primary shrink-0 border border-primary/20">
                        #{incident.id}
                      </span>
                      <div className="flex flex-col min-w-0">
                        <span className="font-mono text-xs md:text-sm font-semibold text-on-surface truncate group-hover:text-primary transition-colors">
                          {incident.fileName}
                        </span>
                        <span className="font-body text-xs text-on-surface-variant">{incident.details}</span>
                      </div>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-mono text-[10px] font-bold shrink-0 ${
                        isDf
                          ? 'bg-error-container text-on-error-container'
                          : 'bg-tertiary-container text-on-tertiary-container'
                      }`}
                    >
                      {isDf && <span className="w-1.5 h-1.5 rounded-full bg-error animate-ping" />}
                      {!isDf && <span className="material-symbols-outlined text-[13px]">check_circle</span>}
                      {incident.verdict}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-on-surface-variant bg-surface-container-low px-2.5 py-1.5 rounded-lg font-mono text-[11px] border border-outline-variant/20">
                    <div className={`flex items-center gap-1 ${isDf ? 'text-error font-semibold' : 'text-tertiary font-semibold'}`}>
                      <span className="material-symbols-outlined text-[14px]">
                        {isDf ? 'warning' : 'verified'}
                      </span>
                      <span className="truncate">{incident.technicalTag}</span>
                    </div>

                    <div className="flex items-center gap-2 text-on-surface-variant text-[10px] shrink-0">
                      <span>{incident.duration}</span>
                      <span>•</span>
                      <span>{incident.timestamp}</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Report Generation & Export Panel */}
        <section className="w-full bg-surface-container text-on-surface p-4 rounded-xl space-y-3 shadow-md border border-outline-variant/40">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-lg bg-surface-container-high text-primary flex items-center justify-center shrink-0 border border-primary/20">
                <span className="material-symbols-outlined text-[24px]">description</span>
              </div>
              <div>
                <h3 className="font-headline font-bold text-base text-on-surface leading-tight">
                  {viewMode === 'forensic'
                    ? 'Forensic PDF Investigation Dossier'
                    : 'Full Investigation Report (PDF)'}
                </h3>
                <span className="font-body text-xs text-on-surface-variant">
                  Court-admissible evidentiary standard packaging
                </span>
              </div>
            </div>
            <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-surface-container-highest text-secondary uppercase font-bold shrink-0">
              STIX 2.1 READY
            </span>
          </div>

          {/* Dossier Content Breakdown */}
          <div className="grid grid-cols-2 gap-2 text-on-surface-variant font-mono text-[11px]">
            <div className="bg-surface-container-low p-2 rounded flex items-center gap-1.5 border border-outline-variant/20">
              <span className="material-symbols-outlined text-primary text-[15px]">analytics</span>
              <span className="truncate">Spectrogram Snapshots</span>
            </div>
            <div className="bg-surface-container-low p-2 rounded flex items-center gap-1.5 border border-outline-variant/20">
              <span className="material-symbols-outlined text-primary text-[15px]">timelapse</span>
              <span className="truncate">Anomaly Timestamps</span>
            </div>
            <div className="bg-surface-container-low p-2 rounded flex items-center gap-1.5 border border-outline-variant/20">
              <span className="material-symbols-outlined text-primary text-[15px]">psychology</span>
              <span className="truncate">Model Probabilities</span>
            </div>
            <div className="bg-surface-container-low p-2 rounded flex items-center gap-1.5 border border-outline-variant/20">
              <span className="material-symbols-outlined text-primary text-[15px]">gavel</span>
              <span className="truncate">Legal Chain of Custody</span>
            </div>
          </div>

          {/* Export Action Buttons */}
          <div className="space-y-2 pt-1">
            <button
              type="button"
              onClick={onOpenReport}
              className="w-full py-3 px-4 rounded-lg bg-primary text-on-primary hover:bg-primary-fixed active:scale-[0.98] transition-all flex items-center justify-center gap-2 font-mono text-xs md:text-sm font-bold shadow-lg shadow-primary/20 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">picture_as_pdf</span>
              <span>GENERATE FORENSIC REPORT (PDF DEMO)</span>
            </button>

            <button
              type="button"
              onClick={handleExportStix}
              className="w-full py-2.5 px-4 rounded-lg bg-surface-container-high text-secondary hover:bg-surface-bright active:scale-[0.98] transition-all flex items-center justify-center gap-2 font-mono text-xs font-semibold border border-outline-variant/30 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">data_object</span>
              <span>Export JSON Telemetry (STIX 2.1)</span>
            </button>
          </div>
        </section>

        {/* Chain of Custody Compliance Badges */}
        <section className="w-full pt-1 pb-4 space-y-2">
          <div className="text-center">
            <span className="font-mono text-[10px] tracking-wider uppercase text-on-surface-variant font-bold">
              COMPLIANCE & TAMPER PROTECTION STANDARDS
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2">
            <div className="flex items-center gap-2.5 bg-surface-container-low p-2.5 rounded-lg border border-outline-variant/20">
              <div className="w-8 h-8 rounded-full bg-surface-container-high text-tertiary flex items-center justify-center shrink-0 border border-tertiary/20">
                <span className="material-symbols-outlined text-[18px]">policy</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-mono text-xs font-semibold text-on-surface">
                  CJIS Compliant Architecture (Mock)
                </span>
                <span className="font-body text-[11px] text-on-surface-variant">
                  Federated audit trails with strict access role separation
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 bg-surface-container-low p-2.5 rounded-lg border border-outline-variant/20">
              <div className="w-8 h-8 rounded-full bg-surface-container-high text-primary flex items-center justify-center shrink-0 border border-primary/20">
                <span className="material-symbols-outlined text-[18px]">memory</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-mono text-xs font-semibold text-on-surface">
                  Zero-Memory Ingest Sandbox
                </span>
                <span className="font-body text-[11px] text-on-surface-variant">
                  Raw audio buffers discarded post-tensor extraction
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 bg-surface-container-low p-2.5 rounded-lg border border-outline-variant/20">
              <div className="w-8 h-8 rounded-full bg-surface-container-high text-secondary flex items-center justify-center shrink-0 border border-secondary/20">
                <span className="material-symbols-outlined text-[18px]">lock_reset</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-mono text-xs font-semibold text-on-surface">
                  Non-Repudiation Guaranteed
                </span>
                <span className="font-body text-[11px] text-on-surface-variant">
                  Ed25519 signing per forensic analyst timestamp pass
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
