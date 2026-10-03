import React, { useRef } from 'react';
import { ScenarioData, ScenarioType, ViewMode, TabId, AnomalyMarker } from '../types/forensics';

interface DashboardViewProps {
  currentScenario: ScenarioData;
  onSelectScenario: (type: ScenarioType) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  currentTime: number;
  onSeek: (time: number) => void;
  isAnalyzing: boolean;
  onRunAnalysis: () => void;
  onReset: () => void;
  onOpenReport: () => void;
  onInspectAnomaly: (anomaly: AnomalyMarker) => void;
  onNavigateTab: (tab: TabId) => void;
  viewMode: ViewMode;
  onUploadFile: (file: File) => void;
  showToast: (msg: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentScenario,
  onSelectScenario,
  isPlaying,
  onTogglePlay,
  currentTime,
  onSeek,
  isAnalyzing,
  onRunAnalysis,
  onReset,
  onOpenReport,
  onInspectAnomaly,
  onNavigateTab,
  viewMode,
  onUploadFile,
  showToast,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = (seconds % 60).toFixed(1);
    const paddedSecs = parseFloat(secs) < 10 ? `0${secs}` : secs;
    return `0${mins}:${paddedSecs}`;
  };

  const progressPct = Math.min(100, Math.max(0, (currentTime / currentScenario.duration) * 100));

  const handleScrubberClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    onSeek(ratio * currentScenario.duration);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onUploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUploadFile(e.target.files[0]);
    }
  };

  const isSynthetic = currentScenario.id === 'synthetic';
  const isGenuine = currentScenario.id === 'genuine';

  const spectrogramImg =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBe2eZ1mL__-hKdY2AQIfn5T8gDGtfZmQinYOPb5KaUuPSVww7EJqTIW7puJ5ckYrKhObtgVmgNBBiZyn2npv95dx-KZrmaYUYtseaqGm7aGTxuwNExFcO3NHIK-pIrWWweveMQN5sT-U-r5gaNC23gZJrupWE4Njq4mVENg9ZGNXgz3Un4caN_0UVNKgMlY9JC_PWYi0cNa_aDtuobhwRiO5ZUyZ6MgJn2HNLQQrptlt3NkgFjnMJ3';

  return (
    <div className="flex flex-col w-full text-on-surface">
      {/* Top Disclaimer Banner */}
      <div className="sticky top-20 z-40 px-3 py-2 bg-error-container text-on-error-container shadow-md flex items-center justify-between gap-2 border-b border-error/20">
        <div className="flex items-center gap-2 min-w-0">
          <span className="material-symbols-outlined text-[18px] text-error flex-shrink-0 animate-pulse">
            warning
          </span>
          <p className="font-mono text-[11px] leading-tight truncate font-semibold">
            {viewMode === 'forensic'
              ? 'SIMULATED FRONTEND DEMO — All scores, metrics & charts are synthetic mock data for presentation purposes only (backend offline).'
              : 'SIMULATION PREVIEW — All scores and numbers are mock examples for evaluation.'}
          </p>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-error text-on-error font-mono text-[10px] uppercase font-bold flex-shrink-0">
          Simulated
        </span>
      </div>

      <div className="max-w-4xl mx-auto w-full p-3 md:p-6 flex flex-col gap-4">
        {/* 1. SCENARIO SELECTOR */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5 font-semibold">
              <span className="material-symbols-outlined text-[15px] text-primary">play_circle</span>
              {viewMode === 'forensic' ? '1. Judge Pitch Scenario Selector' : 'Try Sample Voices'}
            </span>
            <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-surface-container-highest text-primary font-medium">
              Demo data
            </span>
          </div>

          {/* Scenario Tabs */}
          <div className="grid grid-cols-3 gap-2" id="scenario-selector">
            <button
              type="button"
              onClick={() => onSelectScenario('synthetic')}
              className={`p-2.5 rounded-xl font-mono text-xs transition-all flex flex-col items-center justify-center text-center cursor-pointer shadow-sm ${
                currentScenario.id === 'synthetic'
                  ? 'bg-primary text-on-primary font-bold shadow-lg shadow-primary/20 scale-[1.02]'
                  : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest'
              }`}
            >
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">record_voice_over</span>
                <span className="truncate">{viewMode === 'forensic' ? 'ElevenLabs' : 'AI Voice Clone'}</span>
              </div>
              <span className="text-[10px] opacity-80 mt-0.5 truncate">
                {viewMode === 'forensic' ? 'Clone A-8 (96.8%)' : 'Sample #1'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => onSelectScenario('genuine')}
              className={`p-2.5 rounded-xl font-mono text-xs transition-all flex flex-col items-center justify-center text-center cursor-pointer shadow-sm ${
                currentScenario.id === 'genuine'
                  ? 'bg-primary text-on-primary font-bold shadow-lg shadow-primary/20 scale-[1.02]'
                  : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest'
              }`}
            >
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">verified_user</span>
                <span className="truncate">{viewMode === 'forensic' ? 'Genuine Voice' : 'Real Human'}</span>
              </div>
              <span className="text-[10px] opacity-80 mt-0.5 truncate">
                {viewMode === 'forensic' ? 'Ref Vocal (99.2%)' : 'Sample #2'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => onSelectScenario('noisy')}
              className={`p-2.5 rounded-xl font-mono text-xs transition-all flex flex-col items-center justify-center text-center cursor-pointer shadow-sm ${
                currentScenario.id === 'noisy'
                  ? 'bg-primary text-on-primary font-bold shadow-lg shadow-primary/20 scale-[1.02]'
                  : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest'
              }`}
            >
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">graphic_eq</span>
                <span className="truncate">{viewMode === 'forensic' ? 'Noisy Stream' : 'Background Noise'}</span>
              </div>
              <span className="text-[10px] opacity-80 mt-0.5 truncate">
                {viewMode === 'forensic' ? 'Low SNR (84.1%)' : 'Sample #3'}
              </span>
            </button>
          </div>

          {/* Scenario File Metadata */}
          <div className="p-2.5 rounded-xl bg-surface-container-low flex items-center justify-between border border-outline-variant/30">
            <div className="flex items-center gap-2 min-w-0">
              <span className="material-symbols-outlined text-primary text-[18px] shrink-0">audio_file</span>
              <span className="font-mono text-xs text-on-surface truncate font-medium">
                {currentScenario.fileName}
              </span>
            </div>
            <span className="font-mono text-[11px] text-primary-fixed-dim whitespace-nowrap bg-surface-container px-2 py-0.5 rounded border border-primary/20">
              {currentScenario.spec}
            </span>
          </div>
        </div>

        {/* 2. ACOUSTIC PIPELINE FLOW */}
        <div className="p-3.5 rounded-xl bg-surface-container-low flex flex-col gap-2 border border-outline-variant/30">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] text-on-surface-variant uppercase tracking-wider flex items-center gap-1 font-semibold">
              <span className="material-symbols-outlined text-[15px] text-tertiary">
                {isAnalyzing ? 'sync' : 'alt_route'}
              </span>
              {viewMode === 'forensic' ? 'Acoustic Pipeline Flow' : 'Scan Progress'}
            </span>
            <span className="font-mono text-[11px] text-tertiary font-bold">
              {isAnalyzing ? 'RUNNING PARALLEL INFERENCE...' : 'STAGE 5 OF 5 COMPLETED (48ms)'}
            </span>
          </div>

          {/* Pipeline 5-Step Indicator */}
          <div className="grid grid-cols-5 gap-1.5 text-center">
            {['1. Input', '2. Preproc', '3. Infer', '4. Evidence', '5. Verdict'].map((step, idx) => (
              <div key={step} className="flex flex-col items-center gap-1">
                <div
                  className={`w-full h-1.5 rounded-full transition-all duration-300 ${
                    isAnalyzing
                      ? idx <= 2
                        ? 'bg-primary animate-pulse'
                        : 'bg-surface-container-highest'
                      : idx === 4
                      ? 'bg-primary shadow-[0_0_8px_#4cd7f6]'
                      : 'bg-tertiary'
                  }`}
                />
                <span
                  className={`font-mono text-[9px] uppercase truncate w-full ${
                    idx === 4 ? 'text-primary font-bold' : 'text-on-surface-variant'
                  }`}
                >
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. AUDIO INGEST & ACTION CARD */}
        <div className="p-4 rounded-xl bg-surface-container flex flex-col gap-3 shadow-lg border border-outline-variant/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[22px]">cloud_upload</span>
              <span className="font-headline font-bold text-base md:text-lg text-on-surface">
                {viewMode === 'forensic' ? 'Audio Ingest Stream' : 'Voice Recording Check'}
              </span>
            </div>
            <div className="flex gap-1">
              <span className="px-1.5 py-0.5 rounded bg-surface-container-highest font-mono text-[10px] text-on-surface-variant">
                WAV
              </span>
              <span className="px-1.5 py-0.5 rounded bg-surface-container-highest font-mono text-[10px] text-on-surface-variant">
                MP3
              </span>
              <span className="px-1.5 py-0.5 rounded bg-surface-container-highest font-mono text-[10px] text-on-surface-variant">
                FLAC
              </span>
            </div>
          </div>

          {/* Dropzone Interactive Box */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="p-4 rounded-xl bg-surface-container-lowest border border-dashed border-outline/40 hover:border-primary/80 flex flex-col items-center justify-center text-center gap-2 cursor-pointer hover:bg-surface-container-high/60 transition-all group"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="audio/*"
              className="hidden"
            />
            <div className="w-11 h-11 rounded-full bg-surface-container-high flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-inner">
              <span className="material-symbols-outlined text-[24px]">graphic_eq</span>
            </div>
            <div>
              <p className="font-body text-sm text-on-surface font-medium">
                Drag evidence audio or tap to simulate ingest
              </p>
              <p className="font-mono text-[11px] text-on-surface-variant">
                Max raw buffer: 32MB • Direct Zero-Memory Sandbox
              </p>
            </div>
          </div>

          {/* Audio Playback Simulator Preview */}
          <div className="p-3 rounded-lg bg-surface-container-high flex items-center gap-3 border border-outline-variant/30">
            <button
              type="button"
              onClick={onTogglePlay}
              aria-label={isPlaying ? 'Pause Audio Preview' : 'Play Audio Preview'}
              className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg shadow-primary/30 active:scale-95 transition-all shrink-0 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                {isPlaying ? 'pause' : 'play_arrow'}
              </span>
            </button>

            <div className="flex-1 flex flex-col gap-1.5 min-w-0">
              <div className="flex items-center justify-between font-mono text-xs text-on-surface-variant">
                <span className="text-primary font-semibold">{formatTime(currentTime)}</span>
                <span>{formatTime(currentScenario.duration)}s</span>
              </div>

              {/* Scrubber track */}
              <div
                onClick={handleScrubberClick}
                className="w-full bg-surface-container-lowest h-2.5 rounded-full overflow-hidden relative cursor-pointer group"
                title="Click anywhere to scrub playback"
              >
                {/* Simulated anomaly markers on track */}
                {isSynthetic && (
                  <>
                    <div
                      className="absolute top-0 bottom-0 bg-error/50 z-10 pointer-events-none"
                      style={{ left: '19.3%', width: '13.7%' }}
                      title="Anomaly Zone 1 [02.4s - 04.1s]"
                    />
                    <div
                      className="absolute top-0 bottom-0 bg-error/50 z-10 pointer-events-none"
                      style={{ left: '66.1%', width: '12.1%' }}
                      title="Anomaly Zone 2 [08.2s - 09.7s]"
                    />
                  </>
                )}
                <div
                  className="h-full bg-primary rounded-full transition-all relative"
                  style={{ width: `${progressPct}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-md" />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onSeek(currentTime > 0 ? 0 : 3.4)}
              className="w-8 h-8 rounded flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
              title="Reset Playhead"
            >
              <span className="material-symbols-outlined text-[18px]">restart_alt</span>
            </button>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onRunAnalysis}
              disabled={isAnalyzing}
              className="flex-1 py-3 px-4 rounded-xl bg-primary text-on-primary font-mono text-xs md:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-75"
            >
              <span className={`material-symbols-outlined text-[18px] ${isAnalyzing ? 'animate-spin' : ''}`}>
                {isAnalyzing ? 'sync' : 'bolt'}
              </span>
              <span>{isAnalyzing ? 'Analyzing Audio Signal...' : '⚡ Analyze Audio Signal (Demo Run)'}</span>
            </button>

            <button
              type="button"
              onClick={onReset}
              className="px-3.5 py-3 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-mono text-xs transition-colors flex items-center justify-center"
              title="Reset Demo Simulation"
            >
              <span className="material-symbols-outlined text-[18px]">restart_alt</span>
            </button>
          </div>
        </div>

        {/* 4. MULTI-PASS DSP STATUS */}
        <div className="p-3 rounded-xl bg-surface-container-low flex flex-col gap-2 border border-outline-variant/30">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">
              Multi-Pass DSP Status
            </span>
            <span className="font-mono text-xs text-tertiary font-bold">
              {isAnalyzing ? 'PROCESSING PASSES (1/3)...' : '3/3 COMPLETED (48ms)'}
            </span>
          </div>
          <div className="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden">
            <div
              className={`h-full bg-tertiary rounded-full transition-all duration-500 ${
                isAnalyzing ? 'w-2/3 animate-pulse' : 'w-full'
              }`}
            />
          </div>
          <div className="flex items-center justify-between text-on-surface-variant font-mono text-[10px] pt-1">
            <span className="text-tertiary flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[12px]">check_circle</span> FFT Normalization (12ms)
            </span>
            <span className="text-tertiary flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[12px]">check_circle</span> Neural Extraction (24ms)
            </span>
            <span className="text-tertiary flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[12px]">check_circle</span> Fusion Net (12ms)
            </span>
          </div>
        </div>

        {/* 5. DETECTION VERDICT CARD */}
        <div
          className={`p-4 rounded-xl flex flex-col gap-3 shadow-xl relative overflow-hidden transition-all duration-300 border ${
            isSynthetic
              ? 'bg-error-container text-on-error-container border-error/40'
              : isGenuine
              ? 'bg-surface-container-high text-tertiary border-tertiary/40'
              : 'bg-surface-container-high text-secondary border-secondary/40'
          }`}
        >
          {/* Ambient light glow */}
          <div
            className={`absolute -right-8 -top-8 w-36 h-36 rounded-full blur-2xl pointer-events-none ${
              isSynthetic ? 'bg-error/25' : isGenuine ? 'bg-tertiary/20' : 'bg-secondary/20'
            }`}
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span
                className={`w-2.5 h-2.5 rounded-full animate-ping ${
                  isSynthetic ? 'bg-error' : isGenuine ? 'bg-tertiary' : 'bg-secondary'
                }`}
              />
              <span
                className={`font-mono text-[11px] font-bold tracking-widest uppercase ${
                  isSynthetic ? 'text-error' : isGenuine ? 'text-tertiary' : 'text-secondary'
                }`}
              >
                {isSynthetic
                  ? 'CRITICAL THREAT DETECTED'
                  : isGenuine
                  ? 'VERIFIED AUTHENTIC SIGNAL'
                  : 'HEURISTIC ANOMALY DETECTED'}
              </span>
            </div>
            <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-surface-container-lowest text-on-surface font-semibold border border-outline-variant/30">
              Demo data
            </span>
          </div>

          <div className="flex items-baseline justify-between gap-2 flex-wrap">
            <div>
              <h2 className="font-headline font-extrabold text-2xl md:text-3xl leading-tight tracking-tight">
                {viewMode === 'forensic' ? currentScenario.verdictTitle : currentScenario.simplifiedTitle}
              </h2>
              <span
                className={`font-mono text-xs md:text-sm tracking-wide font-semibold block mt-0.5 ${
                  isSynthetic ? 'text-error' : isGenuine ? 'text-tertiary' : 'text-secondary'
                }`}
              >
                {viewMode === 'forensic' ? currentScenario.verdictSubtitle : currentScenario.simplifiedSubtitle}
              </span>
            </div>

            <div className="text-right shrink-0">
              <span className="font-headline font-bold text-3xl md:text-4xl leading-none">
                {currentScenario.confidence}%
              </span>
              <span className="block font-mono text-[10px] opacity-80 mt-1">Confidence (Demo)</span>
            </div>
          </div>

          {/* Forensic markers summary bullets */}
          <div className="p-3 rounded-lg bg-surface-container-lowest/80 flex flex-col gap-2 text-on-surface border border-outline-variant/20">
            {currentScenario.findings.map((finding) => (
              <div key={finding.title} className="flex items-start gap-2 font-body text-xs md:text-sm">
                <span
                  className={`material-symbols-outlined text-[16px] shrink-0 mt-0.5 ${
                    finding.type === 'error'
                      ? 'text-error'
                      : finding.type === 'warning'
                      ? 'text-secondary'
                      : 'text-tertiary'
                  }`}
                >
                  {finding.icon}
                </span>
                <p className="leading-snug">
                  <span className="font-semibold text-on-surface">{finding.title}: </span>
                  <span className="text-on-surface-variant">{finding.description}</span>
                </p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between opacity-80 font-mono text-[10px] pt-1">
            <span>Model Engine: AG-ResNet50-Forensic-v4.1</span>
            <span className="italic underline">Demo classification — not a real analysis</span>
          </div>
        </div>

        {/* 6. DUAL FORENSIC VISUALIZATIONS */}
        <div className="p-4 rounded-xl bg-surface-container flex flex-col gap-3 shadow-lg border border-outline-variant/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-[20px]">show_chart</span>
              <span className="font-headline font-bold text-base text-on-surface">
                Acoustic Signal Spectrogram
              </span>
            </div>
            <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-surface-container-highest text-primary font-medium">
              Demo data
            </span>
          </div>

          {/* Waveform Amplitude Oscilloscope (SVG) */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center text-on-surface-variant font-mono text-[11px]">
              <span>AMPLITUDE ENVELOPE (TIME DOMAIN)</span>
              <span className="text-primary font-semibold">16-BIT PCM</span>
            </div>
            <div className="h-24 w-full bg-surface-container-lowest rounded-lg p-1 relative overflow-hidden flex items-center border border-outline-variant/30">
              {/* Playhead indicator */}
              <div
                className="absolute top-0 bottom-0 w-[2px] bg-primary z-10 shadow-[0_0_8px_#4cd7f6] pointer-events-none transition-all duration-75"
                style={{ left: `${progressPct}%` }}
              >
                <span className="absolute -top-1 -left-3.5 px-1 py-0.2 bg-primary text-on-primary font-mono text-[8px] rounded font-bold">
                  {currentTime.toFixed(1)}s
                </span>
              </div>

              {/* Oscilloscope Wave SVG */}
              <svg className="w-full h-full text-secondary" fill="none" preserveAspectRatio="none" viewBox="0 0 400 60">
                {/* Normal Waveform baseline */}
                <path
                  d="M0,30 Q10,25 20,30 T40,32 T60,20 T80,45 T100,15 T120,48 T140,22 T160,38 T180,28 T200,32 T220,10 T240,50 T260,25 T280,35 T300,12 T320,49 T340,30 T360,28 T380,32 T400,30"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="1.5"
                />

                {isSynthetic && (
                  <>
                    {/* Anomaly glitch zone 1 */}
                    <rect
                      x="77"
                      y="4"
                      width="55"
                      height="52"
                      rx="2"
                      fill="#ffb4ab"
                      fillOpacity="0.22"
                      stroke="#ffb4ab"
                      strokeWidth="1"
                      strokeDasharray="3 3"
                    />
                    {/* Anomaly glitch zone 2 */}
                    <rect
                      x="264"
                      y="4"
                      width="48"
                      height="52"
                      rx="2"
                      fill="#ffb4ab"
                      fillOpacity="0.22"
                      stroke="#ffb4ab"
                      strokeWidth="1"
                      strokeDasharray="3 3"
                    />
                  </>
                )}
              </svg>
            </div>
          </div>

          {/* Mel-Spectrogram Heatmap Visualization */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center text-on-surface-variant font-mono text-[11px]">
              <span>MEL-SPECTROGRAM (0Hz – 8,000Hz)</span>
              <span className="text-tertiary font-semibold">FFT SIZE: 1024</span>
            </div>

            <div className="h-32 w-full bg-surface-container-lowest rounded-lg p-2 relative overflow-hidden flex flex-col justify-between border border-outline-variant/30">
              {/* Frequency scale watermark labels */}
              <div className="absolute left-2 top-2 font-mono text-[9px] text-on-surface-variant/60 font-semibold z-10">
                8.0 kHz [UPPER VOCODER CUTOFF]
              </div>
              <div className="absolute left-2 top-14 font-mono text-[9px] text-on-surface-variant/60 font-semibold z-10">
                4.0 kHz [FORMANT TRANSITION]
              </div>
              <div className="absolute left-2 bottom-2 font-mono text-[9px] text-on-surface-variant/60 font-semibold z-10">
                0.1 kHz [FUNDAMENTAL F0]
              </div>

              {/* Synthetic Anomaly Alert Zone Label */}
              {isSynthetic && (
                <div className="absolute right-3 top-3 px-2 py-0.5 rounded bg-error-container/85 text-error font-mono text-[9px] border border-error/40 flex items-center gap-1 z-10 shadow-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-error animate-pulse" />
                  Synthetic High-Freq Loss (6.2kHz+)
                </div>
              )}

              {/* Generative Heatmap SVG */}
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 300 80">
                <defs>
                  <linearGradient id="specGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.9" />
                    <stop offset="45%" stopColor="#7bd0ff" stopOpacity="0.7" />
                    <stop offset="70%" stopColor="#ffb4ab" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#171f33" stopOpacity="0.2" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,75 C20,70 40,78 60,72 C80,68 100,74 120,70 C140,65 160,75 180,68 C200,60 220,74 240,70 C260,65 280,72 300,70 L300,80 L0,80 Z"
                  fill="url(#specGrad)"
                  opacity="0.9"
                />
                <path
                  d="M0,55 C25,48 50,62 75,50 C100,45 125,58 150,52 C175,44 200,56 225,48 C250,42 275,54 300,50 L300,75 L0,75 Z"
                  fill="url(#specGrad)"
                  opacity="0.6"
                />
                <path
                  d="M0,35 C30,28 60,40 90,32 C120,25 150,38 180,30 C210,22 240,36 270,28 C285,24 295,26 300,30 L300,55 L0,55 Z"
                  fill="url(#specGrad)"
                  opacity="0.3"
                />
              </svg>
            </div>

            <div className="flex justify-between font-mono text-[10px] text-on-surface-variant px-1 pt-0.5">
              <span>00:00.0</span>
              <span>00:03.0</span>
              <span>00:06.0</span>
              <span>00:09.0</span>
              <span>{formatTime(currentScenario.duration)}</span>
            </div>
          </div>

          {/* Spectrogram Graphic tile banner */}
          <div className="rounded-lg overflow-hidden border border-outline-variant/30 relative h-24 bg-surface-container-lowest">
            <img
              src={spectrogramImg}
              alt="Spectrogram visualization"
              className="w-full h-full object-cover opacity-75"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-surface-container-lowest/80 px-2 py-0.5 rounded backdrop-blur border border-outline-variant/40">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="font-mono text-[10px] text-on-surface">128-Band Forensic Mel Filterbank</span>
            </div>
            <div className="absolute bottom-2 right-2 bg-surface-container-high/90 px-2 py-0.5 rounded font-mono text-[10px] text-on-surface-variant border border-outline-variant/40">
              Synthetic Anomaly @ 8.4 kHz
            </div>
          </div>
        </div>

        {/* 7. ANOMALY SEGMENT MARKERS */}
        {currentScenario.anomalies.length > 0 && (
          <div className="p-3.5 rounded-xl bg-surface-container flex flex-col gap-2.5 border border-outline-variant/40">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] text-on-surface-variant uppercase tracking-wider flex items-center gap-1 font-semibold">
                <span className="material-symbols-outlined text-[16px] text-error">timer</span>
                Anomaly Segment Markers
              </span>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-surface-container-highest text-primary">
                {currentScenario.anomalies.length} Cues Logged
              </span>
            </div>

            {/* Segment Scrub Timeline */}
            <div className="w-full h-8 bg-surface-container-lowest rounded-lg p-1 relative flex items-center border border-outline-variant/30">
              <div
                onClick={() => onInspectAnomaly(currentScenario.anomalies[0])}
                className="absolute left-[19%] w-[14%] h-6 bg-error/30 hover:bg-error/50 rounded flex items-center justify-center cursor-pointer transition-colors"
                title="Inspect Vocoder Jitter [02.4s - 04.1s]"
              >
                <span className="font-mono text-[8px] text-error font-bold truncate">Vocoder</span>
              </div>

              {currentScenario.anomalies[1] && (
                <div
                  onClick={() => onInspectAnomaly(currentScenario.anomalies[1])}
                  className="absolute left-[66%] w-[12%] h-6 bg-secondary-container/40 hover:bg-secondary-container/60 rounded flex items-center justify-center cursor-pointer transition-colors"
                  title="Inspect Zero Phase Jump [08.2s - 09.7s]"
                >
                  <span className="font-mono text-[8px] text-secondary-fixed font-bold truncate">Phase</span>
                </div>
              )}
            </div>

            {/* Anomaly Legend & clickable chips */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-on-surface-variant font-mono text-xs">
              {currentScenario.anomalies.map((anom) => (
                <button
                  key={anom.id}
                  type="button"
                  onClick={() => onInspectAnomaly(anom)}
                  className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-pointer"
                >
                  <span className="w-2.5 h-2.5 rounded bg-error/80 shrink-0" />
                  <span>
                    {anom.timeRange} {anom.name}
                  </span>
                  <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 8. MULTI-MODEL INFERENCE COMPARISON */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] text-on-surface-variant uppercase tracking-wider flex items-center gap-1 font-semibold">
              <span className="material-symbols-outlined text-[16px] text-primary">neurology</span>
              Multi-Model Inference Comparison
            </span>
            <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-surface-container-highest text-primary">
              Demo data
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {/* Random Forest */}
            <div className="p-3 rounded-xl bg-surface-container-low flex flex-col justify-between gap-2 shadow-sm border border-outline-variant/30">
              <div>
                <span className="font-mono text-[10px] text-on-surface-variant uppercase">Decision Forest</span>
                <p className="font-mono text-xs font-bold text-on-surface truncate">Random Forest</p>
              </div>
              <div>
                <span className="font-headline text-lg md:text-xl text-error leading-none font-bold">92.4%</span>
                <span className="block font-mono text-[9px] text-on-surface-variant mt-0.5">Synthetic Prob</span>
              </div>
              <div className="flex flex-col gap-1 pt-1">
                <div className="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden">
                  <div className="bg-error h-full rounded-full w-[92%]" />
                </div>
                <span className="font-mono text-[8px] text-on-surface-variant">Lat: 8ms • W: 0.25</span>
              </div>
            </div>

            {/* ResNet-Audio */}
            <div className="p-3 rounded-xl bg-surface-container-low flex flex-col justify-between gap-2 shadow-sm border border-outline-variant/30">
              <div>
                <span className="font-mono text-[10px] text-on-surface-variant uppercase">Deep ConvNet</span>
                <p className="font-mono text-xs font-bold text-on-surface truncate">ResNet-Audio</p>
              </div>
              <div>
                <span className="font-headline text-lg md:text-xl text-error leading-none font-bold">98.1%</span>
                <span className="block font-mono text-[9px] text-on-surface-variant mt-0.5">Synthetic Prob</span>
              </div>
              <div className="flex flex-col gap-1 pt-1">
                <div className="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden">
                  <div className="bg-error h-full rounded-full w-[98%]" />
                </div>
                <span className="font-mono text-[8px] text-on-surface-variant">Lat: 24ms • W: 0.50</span>
              </div>
            </div>

            {/* Ensemble Fusion */}
            <div className="p-3 rounded-xl bg-surface-container-high flex flex-col justify-between gap-2 shadow-md border border-primary/40">
              <div>
                <span className="font-mono text-[10px] text-primary uppercase font-semibold">Meta-Learner</span>
                <p className="font-mono text-xs font-bold text-primary truncate">Ensemble Fusion</p>
              </div>
              <div>
                <span className="font-headline text-lg md:text-xl text-primary leading-none font-bold">
                  {currentScenario.confidence}%
                </span>
                <span className="block font-mono text-[9px] text-on-surface-variant mt-0.5">Weighted Conf</span>
              </div>
              <div className="flex flex-col gap-1 pt-1">
                <div className="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full w-[97%]" />
                </div>
                <span className="font-mono text-[8px] text-primary font-semibold">Optimal Voting</span>
              </div>
            </div>
          </div>
        </div>

        {/* 9. CORE FORENSIC SIGNATURES */}
        <div className="p-4 rounded-xl bg-surface-container flex flex-col gap-3 shadow-lg border border-outline-variant/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-[20px]">fingerprint</span>
              <span className="font-headline font-bold text-base text-on-surface">
                {viewMode === 'forensic' ? 'Core Forensic Signatures' : 'Why This Voice Was Flagged'}
              </span>
            </div>
            <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-surface-container-highest text-primary">
              4 Metrics Eval
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            {currentScenario.signatures.map((sig) => (
              <div
                key={sig.name}
                className="p-3 rounded-lg bg-surface-container-low flex flex-col gap-1.5 border border-outline-variant/20"
              >
                <div className="flex items-center justify-between">
                  <span className="font-body text-xs md:text-sm font-semibold text-on-surface">{sig.name}</span>
                  <span
                    className={`font-mono text-[11px] px-2 py-0.5 rounded font-bold ${
                      sig.color === 'bg-error'
                        ? 'text-error bg-error-container/40'
                        : sig.color === 'bg-tertiary'
                        ? 'text-tertiary bg-tertiary-container/40'
                        : 'text-secondary bg-surface-container-high'
                    }`}
                  >
                    {sig.level}
                  </span>
                </div>
                <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${sig.color}`} style={{ width: `${sig.score}%` }} />
                </div>
                <p className="font-body text-xs text-on-surface-variant leading-relaxed">{sig.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 10. CTA LINK TO TIMELINE */}
        <button
          type="button"
          onClick={() => onNavigateTab('timeline')}
          className="w-full bg-gradient-to-r from-surface-container-high to-surface-container rounded-xl p-4 flex items-center justify-between group active:scale-[0.99] transition-all shadow-md border border-outline-variant/40 hover:border-primary/50 cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
              <span className="material-symbols-outlined text-[24px]">troubleshoot</span>
            </div>
            <div className="flex flex-col text-left">
              <span className="font-mono text-sm font-bold text-on-surface group-hover:text-primary transition-colors">
                Inspect Spectral Timeline →
              </span>
              <span className="font-body text-xs text-on-surface-variant">
                Correlate acoustic artifacts across timecode
              </span>
            </div>
          </div>
          <span className="material-symbols-outlined text-primary text-[22px] group-hover:translate-x-1 transition-transform">
            arrow_forward
          </span>
        </button>

        {/* 11. EXPORT & INVESTIGATION REPORT */}
        <div className="p-4 rounded-xl bg-surface-container-high flex flex-col gap-3 shadow-xl border border-outline-variant/40">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] text-on-surface-variant uppercase tracking-wider flex items-center gap-1 font-semibold">
              <span className="material-symbols-outlined text-[16px] text-primary">verified</span>
              Cryptographic Integrity & Export
            </span>
            <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-surface-container-lowest text-primary">
              Demo data
            </span>
          </div>

          <div className="p-3 rounded-lg bg-surface-container-lowest flex flex-col gap-1.5 font-mono text-xs border border-outline-variant/30">
            <div className="flex items-center justify-between text-on-surface-variant">
              <span>SHA-256 FORENSIC SEAL:</span>
              <span className="text-tertiary font-bold">MATCH VERIFIED</span>
            </div>
            <p className="text-primary break-all select-all font-semibold font-mono text-[11px] leading-relaxed">
              7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069
            </p>
            <span className="text-[10px] text-on-surface-variant">
              Deterministic Acoustic Hash • Timestamped ISO 8601
            </span>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onOpenReport}
              className="flex-1 py-3 px-4 rounded-xl bg-surface-container-lowest text-primary font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-surface-bright transition-all shadow-md active:scale-[0.99] border border-primary/30"
            >
              <span className="material-symbols-outlined text-[20px]">picture_as_pdf</span>
              <span>📄 Generate Forensic Report (PDF Demo)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText('7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069');
                showToast('SHA-256 Seal copied to clipboard');
              }}
              className="px-3 py-3 rounded-xl bg-surface-container-lowest text-on-surface font-mono text-xs hover:bg-surface-bright transition-colors border border-outline-variant/30"
              title="Copy SHA-256 Hash"
            >
              <span className="material-symbols-outlined text-[18px]">content_copy</span>
            </button>
          </div>
        </div>

        {/* Footer Audit Stamp */}
        <div className="w-full flex items-center justify-between px-1 py-2 font-mono text-[10px] text-on-surface-variant">
          <span>Forensic Node: US-EAST-NODE-09</span>
          <span className="flex items-center gap-1 text-tertiary">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary" /> Engine Synced & Verified
          </span>
        </div>
      </div>
    </div>
  );
};
