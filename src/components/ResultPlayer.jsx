import { useState } from 'react';
import { useMastering } from '../context/MasteringContext';
import CustomAudioPlayer from './CustomAudioPlayer';

export default function ResultPlayer() {
    const { resultUrl, originalUrl, resetApp, t } = useMastering();
    const [activeSource, setActiveSource] = useState("mastered");

    return (
        <div className="result-zone">
            <h3>{t('readyTitle')}</h3>
            <p className="result-subtitle">{t('readySubtitle')}</p>

            {/* Sélecteur A/B Haute fidélité */}
            <div className="ab-switch-container">
                <span className="ab-label">{t('abLabel')}</span>
                <div className="ab-switch-buttons">
                    <button 
                        className={`ab-btn original ${activeSource === 'original' ? 'active' : ''}`}
                        onClick={() => setActiveSource('original')}
                    >
                        {t('btnOriginal')}
                    </button>
                    <button 
                        className={`ab-btn mastered ${activeSource === 'mastered' ? 'active' : ''}`}
                        onClick={() => setActiveSource('mastered')}
                    >
                        {t('btnMastered')}
                    </button>
                </div>
            </div>

            {/* Lecteur Audio Customisé Composable */}
            <CustomAudioPlayer 
                src={activeSource === 'mastered' ? resultUrl : originalUrl} 
            />

            {/* Actions de téléchargement / reset */}
            <div className="result-actions">
                <a
                    href={resultUrl}
                    download="Master_AuraMaster.wav"
                    className="btn-download"
                >
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" style={{ marginRight: '6px' }}>
                        <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z" />
                    </svg>
                    {t('downloadBtn')}
                </a>

                <button onClick={resetApp} className="btn-reset">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" style={{ marginRight: '6px' }}>
                        <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
                    </svg>
                    {t('resetBtn')}
                </button>
            </div>
        </div>
    );
}
