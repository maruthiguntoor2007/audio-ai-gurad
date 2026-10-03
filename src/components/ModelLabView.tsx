import React, { useState } from 'react';
import { ViewMode } from '../types/forensics';
import { MODELS_TELEMETRY } from '../data/mockData';

interface ModelLabViewProps {
  viewMode: ViewMode;
  showToast: (msg: string) => void;
}

export const ModelLabView: React.FC<ModelLabViewProps> = ({ viewMode, showToast }) => {
  const [threshold, setThreshold] = useState(0.50);
  const [noiseTolerance, setNoiseTolerance] = useState(true);
  const [glottalFilter, setGlottalFilter] = useState(true);
  const [isBenchmarking, setIsBenchmarking] = useState(false);
  const [benchmarkLogs, setBenchmarkLogs] = useState<string[]>([]);
  const [benchmarkStatus, setBenchmarkStatus] = useState<string | null>(null);

  const activeFusedScore = 0.968;
  const isFlagged = activeFusedScore >= threshold;
  const margin = Math.abs(activeFusedScore - threshold).toFixed(3);

  const runBenchmark = () => {
    if (isBenchmarking) return;
    setIsBenchmarking(true);
    setBenchmarkStatus('STRESS TESTING (0/3)...');
    setBenchmarkLogs(['[0.00s] Initializing synthetic vocoder perturbator...']);

    setTimeout(() => {
      setBenchmarkLogs((prev) => [
        ...prev,
        '[0.42s] ResNet-Audio: 24ms @ 98.1% confidence intact (512-pt FFT).',
      ]);
      setBenchmarkStatus('TESTING ENSEMBLE (2/3)...');
    }, 450);

    setTimeout(() => {
      setBenchmarkLogs((prev) => [
        ...prev,
        '[0.88s] Random Forest: Glottal filter passed (8ms latency).',
        '[1.10s] Benchmark Completed: 32ms total latency • Zero dropouts.',
      ]);
      setBenchmarkStatus('BENCHMARK COMPLETE • 97.4% ACC');
      setIsBenchmarking(false);
      showToast('Model benchmark completed successfully');
    }, 1150);
  };

  return (
    <div className="flex flex-col w-full text-on-surface">
      {/* Disclaimer Notice Banner */}
      <div className="sticky top-20 z-40 px-3 py-2 bg-surface-container-high text-on-surface shadow-md flex items-center justify-between gap-2 border-b border-outline-variant/30">
        <div className="flex items-center gap-2 min-w-0">
          <span className="material-symbols-outlined text-primary text-[18px] shrink-0 animate-pulse">
            developer_board
          </span>
          <p className="font-mono text-[11px] leading-tight text-on-surface-variant truncate font-semibold">
            {viewMode === 'forensic'
              ? 'SIMULATED FRONTEND DEMO — Illustrative multi-model inference scores • Not real analysis'
              : 'SIMULATED DEMO — See how 3 different AI checkers work together to catch cloned voices.'}
          </p>
        </div>
        <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-surface-container-lowest text-primary font-bold shrink-0">
          V2.4-STABLE
        </span>
      </div>

      <div className="max-w-4xl mx-auto w-full p-3 md:p-6 flex flex-col gap-4">
        {/* Primary Architecture Card */}
        <div className="bg-surface-container-low rounded-xl p-4 shadow-md flex flex-col gap-3 border border-outline-variant/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">hub</span>
              <span className="font-headline font-bold text-base md:text-lg text-on-surface">
                {viewMode === 'forensic'
                  ? 'Ensemble Fusion Pipeline'
                  : 'How Our 3 AI Systems Work Together'}
              </span>
            </div>
            <span className="font-mono text-[10px] text-tertiary bg-surface-container-highest px-2 py-0.5 rounded uppercase font-semibold">
              V2.4-STABLE
            </span>
          </div>

          <p className="font-body text-xs md:text-sm text-on-surface-variant leading-relaxed">
            {viewMode === 'forensic'
              ? 'Acoustic features stream through dual discriminator models before converging into a Bayesian gated meta-learner for weighted synthetic probability scoring.'
              : 'We run the audio through two independent sound checkers, then blend their scores together to give the most trustworthy final verdict.'}
          </p>

          {/* Architecture Visual Flow */}
          <div className="bg-surface-container-lowest rounded-lg p-3 shadow-inner flex flex-col gap-2 border border-outline-variant/30">
            <div className="flex items-center justify-between text-on-surface-variant font-mono text-[10px] px-1 font-semibold">
              <span>RAW ACOUSTICS</span>
              <span>PARALLEL TENSORS</span>
              <span>META ENSEMBLE</span>
            </div>

            <div className="grid grid-cols-12 gap-1 items-center py-1">
              {/* Input Stage */}
              <div className="col-span-3 bg-surface-container-high p-2 rounded flex flex-col items-center justify-center text-center shadow-sm border border-outline-variant/20">
                <span className="material-symbols-outlined text-secondary text-[20px]">graphic_eq</span>
                <span className="font-mono text-xs text-on-surface font-semibold mt-1">128 MFCC</span>
                <span className="font-mono text-[9px] text-on-surface-variant">+ Mel STFT</span>
              </div>

              {/* Chevron 1 */}
              <div className="col-span-1 flex justify-center text-outline">
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </div>

              {/* Parallel Models */}
              <div className="col-span-4 flex flex-col gap-1">
                <div className="bg-surface-container px-2 py-1 rounded flex items-center justify-between shadow-sm border border-outline-variant/20">
                  <span className="font-mono text-[11px] text-on-surface truncate">ResNet-Audio</span>
                  <span className="font-mono text-[10px] text-primary font-bold">w:0.50</span>
                </div>
                <div className="bg-surface-container px-2 py-1 rounded flex items-center justify-between shadow-sm border border-outline-variant/20">
                  <span className="font-mono text-[11px] text-on-surface truncate">Random Forest</span>
                  <span className="font-mono text-[10px] text-primary-fixed font-bold">w:0.25</span>
                </div>
                <div className="bg-surface-container px-2 py-1 rounded flex items-center justify-between shadow-sm border border-outline-variant/20">
                  <span className="font-mono text-[11px] text-on-surface truncate">Spectral Heur.</span>
                  <span className="font-mono text-[10px] text-secondary font-bold">w:0.25</span>
                </div>
              </div>

              {/* Chevron 2 */}
              <div className="col-span-1 flex justify-center text-outline">
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </div>

              {/* Meta Node */}
              <div className="col-span-3 bg-primary-container/20 p-2 rounded flex flex-col items-center justify-center text-center shadow-sm border border-primary/40">
                <span className="material-symbols-outlined text-primary text-[22px]">neurology</span>
                <span className="font-mono text-[11px] text-primary font-bold mt-1">Meta-Learner</span>
                <span className="font-mono text-[10px] text-tertiary font-semibold">96.8% Synth</span>
              </div>
            </div>
          </div>

          {/* Active Weight Meter Chips */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-surface-container p-2 rounded flex flex-col border border-outline-variant/20">
              <span className="font-mono text-[9px] text-on-surface-variant font-semibold">RESNET WEIGHT</span>
              <span className="font-headline text-lg font-bold text-primary">50%</span>
              <div className="w-full bg-surface-container-high h-1 rounded-full mt-1 overflow-hidden">
                <div className="bg-primary h-full w-1/2" />
              </div>
            </div>

            <div className="bg-surface-container p-2 rounded flex flex-col border border-outline-variant/20">
              <span className="font-mono text-[9px] text-on-surface-variant font-semibold">FOREST WEIGHT</span>
              <span className="font-headline text-lg font-bold text-secondary">25%</span>
              <div className="w-full bg-surface-container-high h-1 rounded-full mt-1 overflow-hidden">
                <div className="bg-secondary h-full w-1/4" />
              </div>
            </div>

            <div className="bg-surface-container p-2 rounded flex flex-col border border-outline-variant/20">
              <span className="font-mono text-[9px] text-on-surface-variant font-semibold">HEURISTIC WEIGHT</span>
              <span className="font-headline text-lg font-bold text-tertiary">25%</span>
              <div className="w-full bg-surface-container-high h-1 rounded-full mt-1 overflow-hidden">
                <div className="bg-tertiary h-full w-1/4" />
              </div>
            </div>
          </div>
        </div>

        {/* Multi-Model Telemetry Stack */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-secondary text-[18px]">compare_arrows</span>
              <span className="font-mono text-xs uppercase tracking-wide font-semibold text-on-surface">
                {viewMode === 'forensic' ? 'Multi-Model Telemetry' : 'Individual AI Detector Scores'}
              </span>
            </div>
            <span className="font-mono text-[10px] text-on-surface-variant">3 Evaluators Active</span>
          </div>

          <div className="flex flex-col gap-2.5">
            {MODELS_TELEMETRY.map((mod) => (
              <div
                key={mod.id}
                className="bg-surface-container-low rounded-xl p-3.5 shadow-sm flex flex-col gap-2 border border-outline-variant/30"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-[20px]">
                        {mod.id === 'model-a' ? 'account_tree' : mod.id === 'model-b' ? 'layers' : 'psychology'}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-mono text-xs font-bold text-on-surface">{mod.name}</span>
                        <span className="font-mono text-[9px] px-1.5 py-0.2 bg-surface-container-highest text-on-surface-variant rounded font-semibold">
                          {mod.tag}
                        </span>
                      </div>
                      <span className="font-mono text-[11px] text-on-surface-variant">{mod.subtitle}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end shrink-0">
                    <span
                      className={`font-headline text-lg font-bold ${
                        mod.confidence > 95 ? 'text-error' : 'text-primary'
                      }`}
                    >
                      {mod.confidence}%
                    </span>
                    <span className="font-mono text-[9px] text-on-surface-variant uppercase">{mod.status}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-1">
                  <div className="bg-surface-container-high px-2.5 py-1 rounded flex items-center justify-between font-mono text-[10px]">
                    <span className="text-on-surface-variant">INFERENCE LATENCY</span>
                    <span className="text-tertiary font-bold">{mod.latency}</span>
                  </div>
                  <div className="bg-surface-container-high px-2.5 py-1 rounded flex items-center justify-between font-mono text-[10px]">
                    <span className="text-on-surface-variant">DETAIL</span>
                    <span className="text-primary font-bold">{mod.detail}</span>
                  </div>
                </div>

                <div className="bg-surface-container px-2.5 py-1 rounded flex items-center gap-1.5 border border-outline-variant/20">
                  <span className="material-symbols-outlined text-[15px] text-error shrink-0">crisis_alert</span>
                  <span className="font-mono text-[10px] text-on-surface-variant truncate">
                    Trigger: <span className="text-on-surface">{mod.boundaryTrigger}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ROC Calibration & Accuracy Panel */}
        <div className="bg-surface-container-low rounded-xl p-4 shadow-md flex flex-col gap-3 border border-outline-variant/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-secondary text-[20px]">analytics</span>
              <span className="font-headline font-bold text-base text-on-surface">
                {viewMode === 'forensic' ? 'ROC Calibration & Accuracy' : 'Testing Accuracy & Strictness'}
              </span>
            </div>
            <span className="font-mono text-[10px] text-on-surface-variant">N=42,800 Voice Samples</span>
          </div>

          {/* Benchmark metrics cards */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-surface-container p-2.5 rounded-lg flex flex-col text-center border border-outline-variant/20">
              <span className="font-mono text-[9px] text-on-surface-variant font-semibold">ACCURACY</span>
              <span className="font-headline text-lg font-bold text-tertiary">97.4%</span>
              <span className="font-mono text-[9px] text-on-surface-variant">±0.2% variance</span>
            </div>

            <div className="bg-surface-container p-2.5 rounded-lg flex flex-col text-center border border-outline-variant/20">
              <span className="font-mono text-[9px] text-on-surface-variant font-semibold">FALSE POSITIVE</span>
              <span className="font-headline text-lg font-bold text-primary">0.8%</span>
              <span className="font-mono text-[9px] text-on-surface-variant">Rarely flags real</span>
            </div>

            <div className="bg-surface-container p-2.5 rounded-lg flex flex-col text-center border border-outline-variant/20">
              <span className="font-mono text-[9px] text-on-surface-variant font-semibold">EQUAL ERR (EER)</span>
              <span className="font-headline text-lg font-bold text-secondary">1.9%</span>
              <span className="font-mono text-[9px] text-on-surface-variant">Optimal threshold</span>
            </div>
          </div>

          {/* Operating Decision Threshold Interactive Slider */}
          <div className="bg-surface-container-high p-3 rounded-lg flex flex-col gap-2 border border-outline-variant/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-[16px]">tune</span>
                <span className="font-mono text-xs font-semibold text-on-surface">
                  Operating Decision Threshold:
                </span>
              </div>
              <span className="font-mono text-xs text-primary font-bold">
                {threshold.toFixed(2)} {threshold < 0.4 ? '(Sensitive)' : threshold > 0.6 ? '(Strict)' : '(Balanced)'}
              </span>
            </div>

            <input
              type="range"
              min="0.10"
              max="0.90"
              step="0.01"
              value={threshold}
              onChange={(e) => setThreshold(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-surface-container-lowest rounded-lg appearance-none cursor-pointer accent-primary"
            />

            <div className="flex items-center justify-between font-mono text-[10px] text-on-surface-variant">
              <span>0.10 (High Sensitivity)</span>
              <span className="text-tertiary font-bold">Active Fused Score: 0.968</span>
              <span>0.90 (High Precision)</span>
            </div>

            <div className="mt-0.5 bg-surface-container px-2.5 py-1.5 rounded flex items-center justify-between border border-outline-variant/20">
              <span className="font-mono text-[10px] text-on-surface-variant uppercase">
                CURRENT VERDICT AT {threshold.toFixed(2)}:
              </span>
              <span
                className={`font-mono text-[11px] font-bold uppercase ${
                  isFlagged ? 'text-error' : 'text-tertiary'
                }`}
              >
                {isFlagged ? `Flagged Deepfake (+${margin} Margin)` : `Cleared as Organic / Clean`}
              </span>
            </div>
          </div>

          {/* Confusion Array */}
          <div className="bg-surface-container-lowest p-3 rounded-lg flex flex-col gap-1.5 border border-outline-variant/30">
            <span className="font-mono text-[10px] text-on-surface-variant uppercase font-semibold">
              Synthetic vs Organic Confusion Array (Demo)
            </span>
            <div className="grid grid-cols-2 gap-1.5 text-center font-mono">
              <div className="bg-surface-container p-2 rounded flex flex-col">
                <span className="text-on-surface-variant text-[9px]">TRUE POSITIVE (AI CLONE)</span>
                <span className="font-headline text-base font-bold text-primary">98.2%</span>
                <span className="text-[9px] text-tertiary font-semibold">20,980 Verified Flags</span>
              </div>
              <div className="bg-surface-container p-2 rounded flex flex-col">
                <span className="text-on-surface-variant text-[9px]">FALSE NEGATIVE (MISSED)</span>
                <span className="font-headline text-base font-bold text-error">1.8%</span>
                <span className="text-[9px] text-on-surface-variant">384 Latent Artifacts</span>
              </div>
              <div className="bg-surface-container p-2 rounded flex flex-col">
                <span className="text-on-surface-variant text-[9px]">FALSE POSITIVE (FALSE ALARM)</span>
                <span className="font-headline text-base font-bold text-error">0.8%</span>
                <span className="text-[9px] text-on-surface-variant">171 Audio Samples</span>
              </div>
              <div className="bg-surface-container p-2 rounded flex flex-col">
                <span className="text-on-surface-variant text-[9px]">TRUE NEGATIVE (HUMAN)</span>
                <span className="font-headline text-base font-bold text-tertiary">99.2%</span>
                <span className="text-[9px] text-tertiary font-semibold">21,265 Organic Cleared</span>
              </div>
            </div>
          </div>
        </div>

        {/* Inference Sandbox Controls */}
        <div className="bg-surface-container-low rounded-xl p-4 shadow-md flex flex-col gap-3 border border-outline-variant/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-[20px]">science</span>
              <span className="font-headline font-bold text-base text-on-surface">
                {viewMode === 'forensic' ? 'Inference Sandbox Controls' : 'Test Audio Quality Filters'}
              </span>
            </div>
            <span className="font-mono text-[10px] text-tertiary px-1.5 py-0.5 rounded bg-surface-container-high font-bold">
              SIMULATOR
            </span>
          </div>

          <p className="font-body text-xs text-on-surface-variant">
            Adjust active front-end pre-processing filters to test how neural discrimination behaves under hostile or
            noisy acoustic channels.
          </p>

          <div className="flex flex-col gap-2">
            <label className="bg-surface-container p-3 rounded-lg flex items-center justify-between cursor-pointer border border-outline-variant/20 hover:bg-surface-container-high transition-colors">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-secondary text-[20px]">graphic_eq</span>
                <div className="flex flex-col">
                  <span className="font-mono text-xs font-semibold text-on-surface">
                    Apply Noise Floor Tolerance (+12dB SNR)
                  </span>
                  <span className="font-mono text-[10px] text-on-surface-variant">
                    Suppresses ambient hiss before tensor tokenization
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={noiseTolerance}
                onChange={() => setNoiseTolerance(!noiseTolerance)}
                className="w-4 h-4 rounded text-primary accent-primary cursor-pointer"
              />
            </label>

            <label className="bg-surface-container p-3 rounded-lg flex items-center justify-between cursor-pointer border border-outline-variant/20 hover:bg-surface-container-high transition-colors">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-primary text-[20px]">air</span>
                <div className="flex flex-col">
                  <span className="font-mono text-xs font-semibold text-on-surface">
                    Temporal Glottal Waveform Filter
                  </span>
                  <span className="font-mono text-[10px] text-on-surface-variant">
                    Tracks biomechanical vocal cord impulse regularity
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={glottalFilter}
                onChange={() => setGlottalFilter(!glottalFilter)}
                className="w-4 h-4 rounded text-primary accent-primary cursor-pointer"
              />
            </label>
          </div>

          <button
            type="button"
            onClick={runBenchmark}
            disabled={isBenchmarking}
            className="w-full bg-primary-container hover:bg-primary text-on-primary-container font-mono text-xs md:text-sm font-bold py-3 px-4 rounded-lg shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer disabled:opacity-75"
          >
            <span className={`material-symbols-outlined text-[18px] ${isBenchmarking ? 'animate-spin' : ''}`}>
              {isBenchmarking ? 'sync' : 'speed'}
            </span>
            <span>{isBenchmarking ? 'Running Stress Test...' : '⚡ Run Benchmark Stress Test (Demo)'}</span>
          </button>

          {/* Live Benchmark Terminal */}
          {benchmarkLogs.length > 0 && (
            <div className="bg-surface-container-lowest p-3 rounded-lg font-mono text-xs flex flex-col gap-1 border border-outline-variant/30 shadow-inner">
              <div className="flex items-center justify-between text-on-surface-variant pb-1 border-b border-outline-variant/20">
                <span className="text-primary font-bold">&gt; INFERENCE_BENCHMARK_SUITE</span>
                <span className="text-tertiary font-semibold">{benchmarkStatus}</span>
              </div>
              <div className="flex flex-col gap-0.5 text-on-surface-variant pt-1 text-[11px]">
                {benchmarkLogs.map((log) => (
                  <div key={log} className="leading-snug">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between text-on-surface-variant font-mono text-[10px]">
            <span>Demo data — not a real analysis</span>
            <span>ENGINE: PyTorch-Audio Forensic Core</span>
          </div>
        </div>
      </div>
    </div>
  );
};
