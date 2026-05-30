import { MasteringProvider, useMastering } from './context/MasteringContext';
import './App.css';

import FileUploader from './components/FileUploader';
import PollingLoader from './components/PollingLoader';
import ResultPlayer from './components/ResultPlayer';

function MasteringAppContent() {
  const { status, resetApp, language, setLanguage, t } = useMastering();

  return (
    <div className="app-container">
      {/* Overlay de trame d'oscilloscope cathodique (CRT Scanlines) */}
      <div className="crt-scanlines"></div>

      <div className="glow-blob glow-blob-1"></div>
      <div className="glow-blob glow-blob-2"></div>
      
      {/* Barre de Télémétrie Cockpit Spatiale (HUD Top) */}
      <div className="top-hud-row">
        <div className="telemetry-bar">
          <div className="telemetry-item">
            <span className="telemetry-led green blink"></span>
            <span className="telemetry-txt">SYSTEM: ONLINE</span>
          </div>
          <div className="telemetry-item">
            <span className="telemetry-led cyan pulse"></span>
            <span className="telemetry-txt">AI-ENGINE: ENGAGED</span>
          </div>
          <div className="telemetry-item">
            <span className="telemetry-led orange blink"></span>
            <span className="telemetry-txt">CORS-BYPASS: ACTIVE</span>
          </div>
        </div>

        {/* Sélecteur de Langue */}
        <div className="language-selector">
          <button 
            className={`lang-btn ${language === 'fr' ? 'active' : ''}`}
            onClick={() => setLanguage('fr')}
          >
            FR
          </button>
          <button 
            className={`lang-btn ${language === 'en' ? 'active' : ''}`}
            onClick={() => setLanguage('en')}
          >
            EN
          </button>
        </div>
      </div>

      <header>
        <div className="header-badge">
          <span></span> AuraMaster AI v2.5
        </div>
        <h1>AuraMaster</h1>
        <p>{t('subtitle')}</p>
      </header>

      <main className="main-content">
        {status === "idle" && <FileUploader />}

        {(status === "uploading" || status === "processing") && (
          <PollingLoader />
        )}

        {status === "done" && (
          <ResultPlayer />
        )}

        {status === "error" && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            <p>{t('errorMessage')}</p>
            <button onClick={resetApp}>{t('retryBtn')}</button>
          </div>
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <MasteringProvider>
      <MasteringAppContent />
    </MasteringProvider>
  );
}