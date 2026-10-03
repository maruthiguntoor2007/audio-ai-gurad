import React, { useState } from 'react';
import { ScenarioData, ViewMode, AnomalyMarker } from '../types/forensics';

interface TimelineViewProps {
  currentScenario: ScenarioData;
  isPlaying: boolean;
  onTogglePlay: () => void;
  currentTime: number;
  onSeek: (time: number) => void;
  onInspectAnomaly: (anomaly: AnomalyMarker) => void;
  viewMode: ViewMode;
  showToast: (msg: string) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  currentScenario,
  isPlaying,
  onTogglePlay,
  currentTime,
  onSeek,
  onInspectAnomaly,
  viewMode,
  showToast,
}) => {
  const [zoomLevel, setZoomLevel] = useState<1 | 2 | 5>(1);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 2>(1);
  const [isLooping, setIsLooping] = useState(false);

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

  const isSynthetic = currentScenario.id === 'synthetic';

  return (
    <div className="flex flex-col w-full text-on-surface">
      {/* Top Notice Banner */}
      <div className="sticky top-20 z-40 px-3 py-2 bg-surface-container-high text-on-surface shadow-md flex items-center justify-between gap-2 border-b border-outline-variant/30">
        <div className="flex items-center gap-2 min-w-0">
          <span className="material-symbols-outlined text-primary text-[18px] shrink-0">info</span>
          <p className="font-mono text-[11px] leading-tight text-on-surface-variant truncate font-semibold">
            {viewMode === 'forensic'
              ? 'SIMULATED FRONTEND DEMO — Illustrative spectral inspection & anomaly markers'
              : 'SIMULATED DEMO — Visual sound inspection and highlighted voice glitches.'}
          </p>
        </div>
        <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-surface-container-lowest text-tertiary font-bold shrink-0">
          SEC//LEVEL-4
        </span>
      </div>

      <div className="max-w-4xl mx-auto w-full p-3 md:p-6 flex flex-col gap-4">
        {/* Active Audio File Banner */}
        <div className="flex flex-col bg-surface-container rounded-xl p-4 gap-2 shadow-md relative overflow-hidden border border-outline-variant/40">
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-error-container/20 to-transparent pointer-events-none" />

          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center shrink-0 text-primary shadow-inner">
                <span className="material-symbols-outlined text-[24px]">audio_file</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-headline font-bold text-base md:text-lg text-on-surface truncate">
                  {currentScenario.fileName}
                </span>
                <div className="flex items-center gap-2 mt-0.5 font-mono text-[11px] text-on-surface-variant">
                  <span>{currentScenario.duration}s Duration</span>
                  <span>•</span>
                  <span>44.1kHz • 16-Bit PCM</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end shrink-0">
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-mono text-[10px] font-bold tracking-wide ${
                  isSynthetic
                    ? 'bg-error-container/60 text-error'
                    : 'bg-tertiary-container/60 text-tertiary'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                    isSynthetic ? 'bg-error' : 'bg-tertiary'
                  }`}
                />
                {isSynthetic ? 'HIGH THREAT' : 'VERIFIED REAL'}
              </span>
              <span
                className={`font-headline font-bold text-2xl tracking-tight mt-0.5 ${
                  isSynthetic ? 'text-error' : 'text-tertiary'
                }`}
              >
                {currentScenario.confidence}%
              </span>
              <span className="font-mono text-[10px] text-on-surface-variant uppercase">
                {viewMode === 'forensic' ? currentScenario.verdictTitle : currentScenario.simplifiedTitle}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-outline-variant/20 font-mono text-[11px] text-on-surface-variant">
            <span>SHA256: 8f2a...c09e</span>
            <span className="italic text-error/90">Demo data — not a real analysis</span>
          </div>
        </div>

        {/* Interactive Playhead & Scrubbing Controller */}
        <div className="flex flex-col bg-surface-container rounded-xl p-4 gap-3 shadow-md border border-outline-variant/40">
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-1 font-mono">
              <span className="text-xl font-bold text-primary">{formatTime(currentTime)}</span>
              <span className="text-xs text-on-surface-variant">/ {formatTime(currentScenario.duration)}s</span>
            </div>

            {/* Zoom Segmented Buttons */}
            <div className="flex items-center bg-surface-container-lowest p-0.5 rounded-lg gap-1 border border-outline-variant/30">
              {([1, 2, 5] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setZoomLevel(lvl)}
                  className={`px-2.5 py-1 rounded font-mono text-xs transition-all cursor-pointer ${
                    zoomLevel === lvl
                      ? 'bg-primary text-on-primary font-bold shadow-sm'
                      : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {lvl}x
                </button>
              ))}
            </div>
          </div>

          {/* Main Scrubbing Progress Bar with Micro Anomaly Strips */}
          <div
            onClick={handleScrubberClick}
            className="relative w-full h-8 flex items-center cursor-pointer select-none group"
            title="Click or drag to seek anywhere"
          >
            <div className="w-full h-2.5 bg-surface-container-lowest rounded-full relative overflow-hidden border border-outline-variant/30">
              {/* Background Track */}
              <div className="absolute inset-0 bg-surface-container-high/60" />
              {/* Anomaly Zones in Mini-Bar */}
              {isSynthetic && (
                <>
                  <div className="absolute top-0 bottom-0 left-[19.3%] w-[13.7%] bg-error/50" />
                  <div className="absolute top-0 bottom-0 left-[66.1%] w-[12.1%] bg-error/50" />
                </>
              )}
              {/* Active Played Progress */}
              <div
                className="absolute top-0 bottom-0 left-0 bg-primary transition-all duration-75"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            {/* Draggable Scrub Thumb Handle */}
            <div
              className="absolute -translate-x-1/2 w-4 h-7 bg-primary rounded shadow-lg flex flex-col items-center justify-center pointer-events-none"
              style={{ left: `${progressPct}%` }}
            >
              <div className="w-0.5 h-3 bg-surface-container-lowest rounded-full" />
            </div>
          </div>

          {/* Playback Transport Controls */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setIsLooping(!isLooping);
                  showToast(isLooping ? 'Looping disabled' : 'Looping enabled');
                }}
                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                  isLooping
                    ? 'bg-primary text-on-primary font-bold'
                    : 'bg-surface-container-high text-on-surface-variant hover:text-primary'
                }`}
                title="Toggle Loop Mode"
              >
                <span className="material-symbols-outlined text-[18px]">repeat</span>
              </button>

              <button
                type="button"
                onClick={() => onSeek(Math.max(0, currentTime - 5))}
                className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                title="Step Backward 5s"
              >
                <span className="material-symbols-outlined text-[18px]">replay_5</span>
              </button>
            </div>

            {/* Main Center Play Trigger */}
            <div className="relative flex items-center justify-center">
              <div
                className={`absolute -inset-2 rounded-full bg-primary transition-all duration-300 pointer-events-none ${
                  isPlaying ? 'animate-ping opacity-70' : 'opacity-0'
                }`}
              />
              <button
                type="button"
                onClick={onTogglePlay}
                aria-label={isPlaying ? 'Pause Audio Preview' : 'Play Audio Preview'}
                className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-xl shadow-primary/30 active:scale-95 transition-transform z-10 cursor-pointer"
              >
                <span
                  className="material-symbols-outlined text-[28px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {isPlaying ? 'pause' : 'play_arrow'}
                </span>
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onSeek(Math.min(currentScenario.duration, currentTime + 5))}
                className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                title="Step Forward 5s"
              >
                <span className="material-symbols-outlined text-[18px]">forward_5</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const nextSpeed = playbackSpeed === 1 ? 2 : 1;
                  setPlaybackSpeed(nextSpeed);
                  showToast(`Playback speed: ${nextSpeed}x`);
                }}
                className="h-9 px-2.5 rounded-lg bg-surface-container-high flex items-center justify-center gap-1 text-on-surface-variant hover:text-primary font-mono text-xs transition-colors cursor-pointer"
                title="Playback Speed"
              >
                <span>{playbackSpeed}.0x</span>
                <span className="material-symbols-outlined text-[14px]">speed</span>
              </button>
            </div>
          </div>
        </div>

        {/* Time Domain Oscilloscope (Amplitude Envelope) */}
        <div className="flex flex-col bg-surface-container rounded-xl p-4 gap-2 shadow-md relative overflow-hidden border border-outline-variant/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-[18px]">graphic_eq</span>
              <span className="font-headline font-bold text-base text-on-surface">
                {viewMode === 'forensic' ? 'Time Domain Oscilloscope' : 'Sound Wave Shape & Volume'}
              </span>
            </div>
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-surface-container-lowest text-secondary font-semibold">
              16-BIT AMPLITUDE
            </span>
          </div>

          <p className="font-body text-xs text-on-surface-variant">
            Shows how loudly and smoothly the person is speaking. Real human voices rise and fall naturally.
          </p>

          {/* Oscilloscope Canvas Box */}
          <div className="relative w-full h-36 bg-surface-container-lowest rounded-lg overflow-hidden flex flex-col justify-center border border-outline-variant/30">
            {/* Grid Crosshairs */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20 py-2">
              <div className="w-full h-px bg-outline-variant" />
              <div className="w-full h-px bg-outline-variant" />
              <div className="w-full h-px bg-primary/50" />
              <div className="w-full h-px bg-outline-variant" />
              <div className="w-full h-px bg-outline-variant" />
            </div>

            {/* Waveform SVG */}
            <svg className="w-full h-full relative z-0" preserveAspectRatio="none" viewBox="0 0 400 120">
              <defs>
                <linearGradient id="waveNormalGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4cd7f6" stopOpacity="0.9" />
                  <stop offset="50%" stopColor="#7bd0ff" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#4cd7f6" stopOpacity="0.9" />
                </linearGradient>
                <linearGradient id="waveAnomalyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ffb4ab" stopOpacity="1" />
                  <stop offset="50%" stopColor="#93000a" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#ffb4ab" stopOpacity="1" />
                </linearGradient>
              </defs>

              {isSynthetic && (
                <>
                  {/* Anomaly 1 Window Underlay: 02.4s - 04.1s */}
                  <rect x="77" y="0" width="55" height="120" fill="#93000a" fillOpacity="0.25" />
                  {/* Anomaly 2 Window Underlay: 08.2s - 09.7s */}
                  <rect x="264" y="0" width="48" height="120" fill="#93000a" fillOpacity="0.25" />
                </>
              )}

              {/* Base Waveform */}
              <path
                d="M 0,60 Q 8,45 15,60 T 30,75 T 45,50 T 60,68 T 75,55 Q 85,15 95,105 T 105,25 T 115,95 T 125,35 T 132,60 Q 145,52 160,65 T 180,55 T 200,62 T 225,56 T 250,64 T 264,60 Q 272,8 280,112 T 290,12 T 300,108 T 312,60 Q 325,52 345,66 T 370,54 T 400,60"
                fill="none"
                stroke="url(#waveNormalGrad)"
                strokeWidth="2"
              />

              {isSynthetic && (
                <>
                  {/* Anomaly overlays */}
                  <path
                    d="M 77,55 Q 85,15 95,105 T 105,25 T 115,95 T 125,35 T 132,60"
                    fill="none"
                    stroke="url(#waveAnomalyGrad)"
                    strokeWidth="2.5"
                  />
                  <path
                    d="M 264,60 Q 272,8 280,112 T 290,12 T 300,108 T 312,60"
                    fill="none"
                    stroke="url(#waveAnomalyGrad)"
                    strokeWidth="2.5"
                  />
                  <line x1="77" y1="0" x2="77" y2="120" stroke="#ffb4ab" strokeDasharray="3 3" opacity="0.6" />
                  <line x1="132" y1="0" x2="132" y2="120" stroke="#ffb4ab" strokeDasharray="3 3" opacity="0.6" />
                  <line x1="264" y1="0" x2="264" y2="120" stroke="#ffb4ab" strokeDasharray="3 3" opacity="0.6" />
                  <line x1="312" y1="0" x2="312" y2="120" stroke="#ffb4ab" strokeDasharray="3 3" opacity="0.6" />
                </>
              )}

              {/* Live Playhead Marker */}
              <line
                x1={(progressPct * 4).toFixed(1)}
                y1="0"
                x2={(progressPct * 4).toFixed(1)}
                y2="120"
                stroke="#4cd7f6"
                strokeWidth="2"
              />
            </svg>

            {/* Labels */}
            <span className="absolute left-2 top-1 font-mono text-[9px] text-on-surface-variant/80 font-bold">
              +1.0 FS
            </span>
            <span className="absolute left-2 bottom-1 font-mono text-[9px] text-on-surface-variant/80 font-bold">
              -1.0 FS
            </span>
            <span className="absolute right-2 bottom-1 font-mono text-[9px] text-primary font-bold">
              PLAYHEAD: {formatTime(currentTime)}
            </span>
          </div>

          <div className="flex items-center justify-between text-on-surface-variant font-mono text-xs">
            <span>ANOMALY ZONES: {isSynthetic ? '2 DETECTED' : '0 (CLEAN)'}</span>
            <span className="italic">Demo data — not a real analysis</span>
          </div>
        </div>

        {/* Mel-Spectrogram Heatmap */}
        <div className="flex flex-col bg-surface-container rounded-xl p-4 gap-2 shadow-md relative border border-outline-variant/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-secondary text-[18px]">equalizer</span>
              <span className="font-headline font-bold text-base text-on-surface">
                {viewMode === 'forensic' ? 'Mel-Spectrogram Heatmap' : 'Voice Pitch & Treble Map'}
              </span>
            </div>
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-surface-container-lowest text-tertiary font-bold">
              FFT 1024 / HOP 256
            </span>
          </div>

          <div className="relative w-full h-56 bg-surface-container-lowest rounded-lg overflow-hidden flex border border-outline-variant/30">
            {/* Frequency Y-Axis */}
            <div className="w-12 bg-surface-container-high/40 flex flex-col justify-between py-1.5 px-1 shrink-0 select-none font-mono text-[9px]">
              <span className="text-on-surface-variant">8.0kHz</span>
              <span className="text-error font-bold">6.2kHz</span>
              <span className="text-on-surface-variant">4.0kHz</span>
              <span className="text-on-surface-variant">2.0kHz</span>
              <span className="text-on-surface-variant">F0 300</span>
              <span className="text-on-surface-variant">0 Hz</span>
            </div>

            {/* Spectrogram Canvas */}
            <div className="relative flex-1 h-full overflow-hidden bg-surface-container-lowest">
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-[#004e5c]/25 to-[#060e20]" />

              {/* Upper Vocoder Cutoff Anomaly Zone */}
              {isSynthetic && (
                <>
                  <div className="absolute top-0 left-0 right-0 h-[22.5%] bg-surface-container-lowest/85 flex items-center justify-center">
                    <div className="w-full h-px bg-error/40 absolute bottom-0" />
                  </div>
                  <div className="absolute top-2 left-6 right-6 bg-error-container/85 rounded p-1.5 flex items-center gap-1.5 shadow-lg z-20 border border-error/30">
                    <span className="material-symbols-outlined text-error text-[16px]">warning</span>
                    <span className="font-mono text-[11px] text-on-error-container font-bold truncate">
                      Synthetic High-Freq Loss (6.2kHz+ Truncation)
                    </span>
                  </div>
                </>
              )}

              {/* Harmonics & Wave Formants */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 300 200">
                <path d="M 0,160 Q 40,150 75,162 T 150,155 T 225,164 T 300,158" fill="none" opacity="0.75" stroke="#4edea3" strokeWidth="4" />
                <path d="M 0,135 Q 50,120 100,138 T 200,125 T 300,132" fill="none" opacity="0.65" stroke="#4cd7f6" strokeWidth="5" />
                <path d="M 0,105 Q 60,95 120,110 T 240,98 T 300,105" fill="none" opacity="0.5" stroke="#7bd0ff" strokeWidth="3" />

                {isSynthetic && (
                  <>
                    <rect x="75" y="45" width="40" height="145" fill="#93000a" fillOpacity="0.28" />
                    <rect x="200" y="45" width="40" height="145" fill="#93000a" fillOpacity="0.28" />
                  </>
                )}

                {/* Synchronized Playhead Line */}
                <line
                  x1={(progressPct * 3).toFixed(1)}
                  y1="0"
                  x2={(progressPct * 3).toFixed(1)}
                  y2="200"
                  stroke="#4cd7f6"
                  strokeWidth="2"
                />
              </svg>

              {/* Dynamic Anomaly Pins */}
              {isSynthetic && (
                <>
                  <div
                    onClick={() => onInspectAnomaly(currentScenario.anomalies[0])}
                    className="absolute bottom-2 left-[25%] -translate-x-1/2 flex flex-col items-center cursor-pointer group hover:scale-110 transition-transform"
                    title="Click to inspect ANOM-A vector proofs"
                  >
                    <div className="px-1.5 py-0.5 rounded bg-error text-on-error font-mono text-[9px] font-bold shadow-md">
                      ANOM-A
                    </div>
                    <div className="w-0.5 h-3 bg-error" />
                  </div>

                  {currentScenario.anomalies[1] && (
                    <div
                      onClick={() => onInspectAnomaly(currentScenario.anomalies[1])}
                      className="absolute bottom-2 left-[68%] -translate-x-1/2 flex flex-col items-center cursor-pointer group hover:scale-110 transition-transform"
                      title="Click to inspect ANOM-B vector proofs"
                    >
                      <div className="px-1.5 py-0.5 rounded bg-error text-on-error font-mono text-[9px] font-bold shadow-md">
                        ANOM-B
                      </div>
                      <div className="w-0.5 h-3 bg-error" />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between text-on-surface-variant font-mono text-[10px] pl-12 pt-0.5">
            <span>00:00.0</span>
            <span>00:03.0</span>
            <span>00:06.0</span>
            <span>00:09.0</span>
            <span>{formatTime(currentScenario.duration)}</span>
          </div>
        </div>

        {/* Detected Anomaly Tags */}
        {currentScenario.anomalies.length > 0 && (
          <div className="flex flex-col bg-surface-container rounded-xl p-4 gap-2 shadow-md border border-outline-variant/40">
            <div className="flex items-center justify-between">
              <span className="font-headline font-bold text-base text-on-surface">
                {viewMode === 'forensic' ? 'Detected Anomaly Tags' : 'Suspicious Audio Moments'}
              </span>
              <span className="font-mono text-xs text-primary font-bold">
                {currentScenario.anomalies.length} CUES LOGGED
              </span>
            </div>

            <div className="flex flex-col gap-2">
              {currentScenario.anomalies.map((anom) => (
                <div
                  key={anom.id}
                  onClick={() => {
                    onSeek(anom.startSec);
                    onInspectAnomaly(anom);
                  }}
                  className="flex items-center justify-between p-3 bg-surface-container-high hover:bg-surface-bright rounded-lg cursor-pointer transition-all active:scale-[0.99] border border-outline-variant/30"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-error-container/40 flex items-center justify-center shrink-0 text-error">
                      <span className="material-symbols-outlined text-[18px]">crisis_alert</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-headline font-semibold text-sm text-on-surface truncate">
                          {anom.name}
                        </span>
                        <span className="font-mono text-xs text-primary font-bold">{anom.timeRange}</span>
                      </div>
                      <span className="font-body text-xs text-on-surface-variant">
                        Tap to inspect mathematical vector proofs
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex flex-col items-end">
                      <span className="font-mono text-xs text-error font-bold">{anom.severity}% SEV</span>
                      <span className="font-mono text-[10px] text-on-surface-variant">{anom.frameRange}</span>
                    </div>
                    <span className="material-symbols-outlined text-on-surface-variant text-[18px]">
                      chevron_right
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Forensic Evidence Breakdown */}
        <div className="flex flex-col bg-surface-container rounded-xl p-4 gap-3 shadow-md border border-outline-variant/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-tertiary text-[20px]">biotech</span>
              <span className="font-headline font-bold text-base text-on-surface">
                {viewMode === 'forensic' ? 'Forensic Evidence Breakdown' : 'Why This Voice Was Flagged'}
              </span>
            </div>
            <span className="font-mono text-xs text-on-surface-variant">4 METRICS EVAL</span>
          </div>

          <div className="flex flex-col gap-2.5">
            {currentScenario.signatures.map((sig) => (
              <div
                key={sig.name}
                className="flex flex-col p-3 bg-surface-container-low rounded-lg gap-1 border border-outline-variant/20"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-on-surface">{sig.name}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                      sig.color === 'bg-error'
                        ? 'bg-error-container/50 text-error'
                        : sig.color === 'bg-tertiary'
                        ? 'bg-tertiary-container/50 text-tertiary'
                        : 'bg-surface-container-highest text-secondary'
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

        {/* Quick Mitigation Action */}
        <div className="rounded-xl bg-gradient-to-r from-surface-container-high to-surface-container p-4 shadow-md flex items-center justify-between gap-3 border border-outline-variant/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-error-container/40 text-error flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[24px]">flag</span>
            </div>
            <div>
              <h4 className="font-headline font-bold text-sm text-on-surface leading-tight">
                Escalate Suspicious Call
              </h4>
              <p className="font-body text-xs text-on-surface-variant">
                Notify security team and mark caller ID as synthetic.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => showToast('Flagged audio incident escalated to Security Dispatch (#DF-09).')}
            className="shrink-0 px-3.5 py-2 rounded-lg bg-error text-on-error font-mono text-xs font-bold tracking-wide active:scale-95 transition-transform cursor-pointer"
          >
            Flag Audio
          </button>
        </div>
      </div>
    </div>
  );
};
