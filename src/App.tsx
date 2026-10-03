import { useState, useEffect, useRef } from 'react';
import { TabId, ViewMode, ScenarioType, AnomalyMarker, AnalystUser, IncidentRecord } from './types/forensics';
import { SCENARIOS, ANALYST_ROLES } from './data/mockData';
import { forensicAudio } from './utils/audioSimulator';
import { LoginPage } from './components/LoginPage';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { DashboardView } from './components/DashboardView';
import { TimelineView } from './components/TimelineView';
import { ModelLabView } from './components/ModelLabView';
import { CaseLogsView } from './components/CaseLogsView';
import { AuthEnclaveModal } from './components/AuthEnclaveModal';
import { AnomalyDetailModal } from './components/AnomalyDetailModal';
import { ReportModal } from './components/ReportModal';
import { SettingsModal } from './components/SettingsModal';

export default function App() {
  // Authentication gate - start with login page first as requested
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [viewMode, setViewMode] = useState<ViewMode>('forensic');
  const [scenarioType, setScenarioType] = useState<ScenarioType>('synthetic');
  const [scenarioData, setScenarioData] = useState(SCENARIOS['synthetic']);

  // Audio simulation state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(3.4);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Modals state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [activeAnomaly, setActiveAnomaly] = useState<AnomalyMarker | null>(null);

  // User session
  const [currentUser, setCurrentUser] = useState<AnalystUser>(ANALYST_ROLES[0]);

  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = (message: string) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToastMessage(message);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Switch scenario
  const handleSelectScenario = (type: ScenarioType) => {
    setScenarioType(type);
    setScenarioData(SCENARIOS[type]);
    setCurrentTime(type === 'synthetic' ? 3.4 : 0.0);
    if (isPlaying) {
      forensicAudio.stop();
      setIsPlaying(false);
    }
    showToast(`Loaded scenario: ${SCENARIOS[type].title}`);
  };

  // Playback timer loop
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying) {
      forensicAudio.play(scenarioType, currentTime);
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= scenarioData.duration) {
            forensicAudio.stop();
            setIsPlaying(false);
            return 0;
          }
          return parseFloat((prev + 0.1).toFixed(1));
        });
      }, 100);
    } else {
      forensicAudio.stop();
    }

    return () => {
      if (interval) clearInterval(interval);
      forensicAudio.stop();
    };
  }, [isPlaying, scenarioType, scenarioData.duration]);

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (newTime: number) => {
    const clamped = Math.max(0, Math.min(scenarioData.duration, newTime));
    setCurrentTime(clamped);
  };

  const handleRunAnalysis = () => {
    if (isAnalyzing) return;
    setIsAnalyzing(true);
    showToast('Executing multi-pass DSP audio scan...');
    setTimeout(() => {
      setIsAnalyzing(false);
      showToast(`Analysis complete: ${scenarioData.verdictTitle} (${scenarioData.confidence}%)`);
    }, 1200);
  };

  const handleReset = () => {
    handleSelectScenario('synthetic');
    setCurrentTime(3.4);
    setIsPlaying(false);
    showToast('Demo simulation reset to initial state');
  };

  const handleUploadFile = (file: File) => {
    const customScenario = {
      ...SCENARIOS['synthetic'],
      fileName: file.name,
      spec: `${(file.size / 1024 / 1024).toFixed(1)}MB • Custom Audio`,
    };
    setScenarioData(customScenario);
    setCurrentTime(0);
    setIsPlaying(false);
    showToast(`Loaded user audio file: ${file.name}`);
    handleRunAnalysis();
  };

  const handleSelectIncident = (incident: IncidentRecord) => {
    if (incident.category === 'genuine') {
      handleSelectScenario('genuine');
    } else {
      handleSelectScenario('synthetic');
    }
    showToast(`Investigating incident #${incident.id}: ${incident.fileName}`);
    setActiveTab('dashboard');
  };

  const tabTitles: Record<TabId, string> = {
    dashboard: 'Forensic Dashboard',
    timeline: 'Timeline & Spectrogram',
    'model-lab': 'Model Lab & Benchmarks',
    'case-logs': 'Case Logs & Chain of Custody',
  };

  // If not authenticated, show the login page first as requested
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#060e20] text-on-surface">
        {toastMessage && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-surface-bright text-primary font-mono text-xs font-semibold rounded-xl shadow-2xl border border-primary/30 flex items-center gap-2 animate-bounce">
            <span className="material-symbols-outlined text-tertiary text-[18px]">verified</span>
            <span>{toastMessage}</span>
          </div>
        )}
        <LoginPage
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            setIsAuthenticated(true);
            setActiveTab('dashboard');
          }}
          showToast={showToast}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col selection:bg-primary/20 selection:text-primary">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-surface-bright text-primary font-mono text-xs font-semibold rounded-xl shadow-2xl border border-primary/30 flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-tertiary text-[18px]">verified</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header */}
      <Header
        viewMode={viewMode}
        onToggleViewMode={() => {
          const nextMode = viewMode === 'forensic' ? 'simplified' : 'forensic';
          setViewMode(nextMode);
          showToast(`Switched to ${nextMode === 'forensic' ? 'Forensic Spec' : 'Plain English'}`);
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={() => {
          setIsAuthenticated(false);
          setIsPlaying(false);
          showToast('Terminal session locked. Returned to Login Gateway.');
        }}
        currentUser={currentUser}
        activeTabTitle={tabTitles[activeTab]}
      />

      {/* Main View Area */}
      <main className="flex-1 flex flex-col relative w-full pt-20 pb-20 bg-background">
        {activeTab === 'dashboard' && (
          <DashboardView
            currentScenario={scenarioData}
            onSelectScenario={handleSelectScenario}
            isPlaying={isPlaying}
            onTogglePlay={handleTogglePlay}
            currentTime={currentTime}
            onSeek={handleSeek}
            isAnalyzing={isAnalyzing}
            onRunAnalysis={handleRunAnalysis}
            onReset={handleReset}
            onOpenReport={() => setIsReportOpen(true)}
            onInspectAnomaly={(anom) => setActiveAnomaly(anom)}
            onNavigateTab={(tab) => setActiveTab(tab)}
            viewMode={viewMode}
            onUploadFile={handleUploadFile}
            showToast={showToast}
          />
        )}

        {activeTab === 'timeline' && (
          <TimelineView
            currentScenario={scenarioData}
            isPlaying={isPlaying}
            onTogglePlay={handleTogglePlay}
            currentTime={currentTime}
            onSeek={handleSeek}
            onInspectAnomaly={(anom) => setActiveAnomaly(anom)}
            viewMode={viewMode}
            showToast={showToast}
          />
        )}

        {activeTab === 'model-lab' && (
          <ModelLabView
            viewMode={viewMode}
            showToast={showToast}
          />
        )}

        {activeTab === 'case-logs' && (
          <CaseLogsView
            viewMode={viewMode}
            onOpenReport={() => setIsReportOpen(true)}
            onSelectIncident={handleSelectIncident}
            showToast={showToast}
          />
        )}
      </main>

      {/* Bottom Sticky Navigation */}
      <Navigation
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
      />

      {/* Auth / Profile Modal */}
      <AuthEnclaveModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={currentUser}
        onSelectUser={(user) => setCurrentUser(user)}
        onLogout={() => {
          setIsAuthOpen(false);
          setIsAuthenticated(false);
          setIsPlaying(false);
          showToast('Signed out. Returned to Sign In screen.');
        }}
        showToast={showToast}
      />

      {/* Anomaly Vector Proof Inspector Modal (Screenshots 2 & 9) */}
      <AnomalyDetailModal
        anomaly={activeAnomaly}
        onClose={() => setActiveAnomaly(null)}
        onJumpToTime={(time) => {
          handleSeek(time);
          setIsPlaying(true);
        }}
      />

      {/* PDF Dossier Modal */}
      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        scenario={scenarioData}
        currentUser={currentUser}
        showToast={showToast}
      />

      {/* Forensic Engine Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        viewMode={viewMode}
        onSetViewMode={(m) => setViewMode(m)}
        showToast={showToast}
      />
    </div>
  );
}
