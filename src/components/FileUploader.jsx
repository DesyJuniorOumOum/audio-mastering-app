import { useState, useRef } from 'react';
import { useMastering } from '../context/MasteringContext';

export default function FileUploader() {
    const { uploadFile, t } = useMastering();
    
    // État pour savoir si un fichier survole actuellement la zone
    const [isDragging, setIsDragging] = useState(false);

    // Référence pour simuler un clic sur l'input caché
    const fileInputRef = useRef(null);

    // Empêche le navigateur d'ouvrir le fichier par défaut
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

        // Récupère le premier fichier déposé
        const droppedFile = e.dataTransfer.files[0];
        validateAndProcessFile(droppedFile);
    };

    const handleChange = (e) => {
        const selectedFile = e.target.files[0];
        validateAndProcessFile(selectedFile);
    };

    // Fonction de validation pour s'assurer que c'est bien de l'audio
    const validateAndProcessFile = (file) => {
        if (!file) return;

        if (file.type.startsWith('audio/')) {
            uploadFile(file);
        } else {
            alert(t('formatError'));
        }
    };

    return (
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
                style={{ display: 'none' }} // On le cache pour garder un beau design
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
                                <stop offset="0%" stop-color="var(--accent)" />
                                <stop offset="100%" stop-color="var(--primary)" />
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
    );
}