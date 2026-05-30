import { useState, useRef } from 'react';
import { useMastering } from '../context/MasteringContext';

export default function FileUploader() {
    const { 
        uploadFile, 
        preset, 
        setPreset, 
        targetLoudness, 
        setTargetLoudness, 
        masteringLevel, 
        setMasteringLevel, 
        t 
    } = useMastering();
    
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        validateAndProcessFile(droppedFile);
    };

    const handleChange = (e) => {
        const selectedFile = e.target.files[0];
        validateAndProcessFile(selectedFile);
    };

    const validateAndProcessFile = (file) => {
        if (!file) return;
        if (file.type.startsWith('audio/')) {
            uploadFile(file);
        } else {
            alert(t('formatError'));
        }
    };

    const applyPreset = (lufs) => {
        setTargetLoudness(lufs);
    };

    return (
        <div className="console-dashboard">
            {/* 1. Zone d'Upload (Cockpit gauche) */}
            <div
                className={`upload-zone ${isDragging ? 'active' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current.click()}
            >
                <input
                    type="file"
                    accept="audio/*"
                    ref={fileInputRef}
                    onChange={handleChange}
                    style={{ display: 'none' }}
                />
                
                <div className="upload-glow-effect"></div>
                
                <div className="upload-content">
                    <div className="waveform-container">
                        <svg className="waveform-svg" viewBox="0 0 100 40" width="120" height="48">
                            <rect x="5" y="10" width="3" height="20" rx="1.5" fill="var(--primary)" opacity="0.8" />
                            <rect x="12" y="5" width="3" height="30" rx="1.5" fill="var(--primary)" opacity="0.9" />
                            <rect x="19" y="15" width="3" height="10" rx="1.5" fill="var(--secondary)" />
                            <rect x="26" y="8" width="3" height="24" rx="1.5" fill="var(--primary)" />
                            <rect x="33" y="12" width="3" height="16" rx="1.5" fill="var(--secondary)" />
                            <rect x="40" y="2" width="3" height="36" rx="1.5" fill="url(#wave-gradient)" />
                            <rect x="47" y="14" width="3" height="12" rx="1.5" fill="var(--secondary)" />
                            <rect x="54" y="6" width="3" height="28" rx="1.5" fill="var(--primary)" />
                            <rect x="61" y="10" width="3" height="20" rx="1.5" fill="var(--primary)" />
                            <rect x="68" y="15" width="3" height="10" rx="1.5" fill="var(--secondary)" />
                            <rect x="75" y="4" width="3" height="32" rx="1.5" fill="var(--primary)" />
                            <rect x="82" y="12" width="3" height="16" rx="1.5" fill="var(--secondary)" />
                            <rect x="89" y="8" width="3" height="24" rx="1.5" fill="var(--primary)" opacity="0.8" />
                            <defs>
                                <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="var(--accent)" />
                                    <stop offset="100%" stopColor="var(--primary)" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                    
                    <h3>{t('dragDropText')}</h3>
                    <p>{t('clickBrowseText')}</p>
                    
                    <button type="button" className="btn-browse">
                        {t('selectButton')}
                    </button>
                    
                    <div className="file-formats-container">
                        <span className="file-formats">{t('formatsText')}</span>
                    </div>
                </div>
            </div>

            {/* 2. Panneau de Contrôle Interactif (Cockpit droit) */}
            <div className="console-controls-panel" onClick={(e) => e.stopPropagation()}>
                <div className="panel-header">
                    <span className="telemetry-led green blink"></span>
                    <div className="panel-titles">
                        <h4>{t('panelTitle')}</h4>
                        <span className="panel-subtitle">{t('panelSubtitle')}</span>
                    </div>
                </div>

                <div className="panel-body">
                    {/* Contrôle 1 : Profil Acoustique (Preset) */}
                    <div className="control-group">
                        <label className="control-label">
                            <span className="label-icon">🎛️</span>
                            {t('labelProfile')}
                        </label>
                        <div className="profile-selector" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                            <button
                                className={`profile-btn ${preset === 'general' ? 'active' : ''}`}
                                onClick={() => setPreset('general')}
                            >
                                <span className="profile-dot"></span>
                                {t('presetGeneral')}
                            </button>
                            <button
                                className={`profile-btn ${preset === 'pop' ? 'active' : ''}`}
                                onClick={() => setPreset('pop')}
                            >
                                <span className="profile-dot"></span>
                                {t('presetPop')}
                            </button>
                            <button
                                className={`profile-btn ${preset === 'jazz' ? 'active' : ''}`}
                                onClick={() => setPreset('jazz')}
                            >
                                <span className="profile-dot"></span>
                                {t('presetJazz')}
                            </button>
                            <button
                                className={`profile-btn ${preset === 'classical' ? 'active' : ''}`}
                                onClick={() => setPreset('classical')}
                            >
                                <span className="profile-dot"></span>
                                {t('presetClassical')}
                            </button>
                        </div>
                    </div>

                    {/* Contrôle 2 : Loudness Cible */}
                    <div className="control-group">
                        <div className="control-header-row">
                            <label className="control-label">
                                <span className="label-icon">🔊</span>
                                {t('labelLoudness')}
                            </label>
                            <span className="value-badge neon-cyan">{targetLoudness} LUFS</span>
                        </div>
                        
                        <input
                            type="range"
                            min="-20"
                            max="-6"
                            step="1"
                            value={targetLoudness}
                            onChange={(e) => setTargetLoudness(parseInt(e.target.value))}
                            className="console-slider"
                            style={{
                                background: `linear-gradient(to right, var(--secondary) 0%, var(--secondary) ${((targetLoudness - (-20)) / (-6 - (-20))) * 100}%, rgba(255,255,255,0.06) ${((targetLoudness - (-20)) / (-6 - (-20))) * 100}%, rgba(255,255,255,0.06) 100%)`
                            }}
                        />

                        {/* Presets rapides de Loudness */}
                        <div className="presets-container">
                            <span className="presets-label">{t('presetLabel')}</span>
                            <div className="presets-buttons">
                                <button 
                                    className={`preset-btn ${targetLoudness === -16 ? 'active' : ''}`}
                                    onClick={() => applyPreset(-16)}
                                >
                                    Podcast (-16)
                                </button>
                                <button 
                                    className={`preset-btn ${targetLoudness === -14 ? 'active' : ''}`}
                                    onClick={() => applyPreset(-14)}
                                >
                                    Streaming (-14)
                                </button>
                                <button 
                                    className={`preset-btn ${targetLoudness === -10 ? 'active' : ''}`}
                                    onClick={() => applyPreset(-10)}
                                >
                                    Club (-10)
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Contrôle 3 : Intensité du Mastering */}
                    <div className="control-group">
                        <div className="control-header-row">
                            <label className="control-label">
                                <span className="label-icon">⚡</span>
                                {t('labelIntensity')}
                            </label>
                            <span className="value-badge neon-purple">{Math.round(masteringLevel * 100)}%</span>
                        </div>
                        
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={masteringLevel}
                            onChange={(e) => setMasteringLevel(parseFloat(e.target.value))}
                            className="console-slider"
                            style={{
                                background: `linear-gradient(to right, var(--primary) 0%, var(--primary) ${masteringLevel * 100}%, rgba(255,255,255,0.06) ${masteringLevel * 100}%, rgba(255,255,255,0.06) 100%)`
                            }}
                        />

                        <div className="slider-ticks-labels">
                            <span>{t('intensitySubtil')}</span>
                            <span>{t('intensityPuissant')}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}