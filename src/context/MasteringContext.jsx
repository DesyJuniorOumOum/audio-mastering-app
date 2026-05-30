// src/context/MasteringContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { startMastering, checkMasteringStatus, getAuthenticatedUrl } from '../services/aiMasteringApi';

const MasteringContext = createContext(null);

export function MasteringProvider({ children }) {
    const { t, i18n } = useTranslation();
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState("idle");
    const [taskId, setTaskId] = useState(null);
    const [resultUrl, setResultUrl] = useState(null);
    const [originalUrl, setOriginalUrl] = useState(null);

    // Nouveaux états de contrôle de la Console Spatiale IA
    const [preset, setPreset] = useState("general");
    const [targetLoudness, setTargetLoudness] = useState(-14);
    const [masteringLevel, setMasteringLevel] = useState(0.5);

    // Gérer l'URL locale du fichier d'origine pour la comparaison A/B
    useEffect(() => {
        if (file) {
            const url = URL.createObjectURL(file);
            setOriginalUrl(url);
            return () => {
                URL.revokeObjectURL(url);
            };
        } else {
            setOriginalUrl(null);
        }
    }, [file]);

    // Gérer l'upload de fichier avec options dynamiques
    useEffect(() => {
        const uploadAudio = async () => {
            if (file && status === "uploading") {
                try {
                    const masteringId = await startMastering(file, { preset, targetLoudness, masteringLevel });
                    setTaskId(masteringId);
                    setStatus("processing");
                } catch (error) {
                    setStatus("error");
                }
            }
        };
        uploadAudio();
    }, [file, status, preset, targetLoudness, masteringLevel]);

    // Boucle de Polling
    useEffect(() => {
        let intervalId;

        const pollStatus = async () => {
            try {
                const responseData = await checkMasteringStatus(taskId);
                const masteringData = (responseData.mastering && typeof responseData.mastering === 'object') ? responseData.mastering : responseData;

                if (masteringData.status === 'succeeded') {
                    clearInterval(intervalId);
                    const outputAudioId = masteringData.output_audio_id;
                    const authenticatedUrl = await getAuthenticatedUrl(outputAudioId);

                    setResultUrl(authenticatedUrl);
                    setStatus("done");
                } else if (masteringData.status === 'failed') {
                    clearInterval(intervalId);
                    setStatus("error");
                }
            } catch (error) {
                console.error("Erreur lors du polling :", error);
                clearInterval(intervalId);
                setStatus("error");
            }
        };

        if (status === "processing" && taskId) {
            intervalId = setInterval(pollStatus, 5000);
        }

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [status, taskId]);


    // Fonction d'upload
    const uploadFile = (selectedFile) => {
        setFile(selectedFile);
        setStatus("uploading");
    };

    // Recommencer le processus
    const resetApp = () => {
        setFile(null);
        setTaskId(null);
        setResultUrl(null);
        setStatus("idle");
    };

    // Changer la langue courante via i18next
    const setLanguage = (lang) => {
        i18n.changeLanguage(lang);
    };

    const value = {
        file,
        status,
        taskId,
        resultUrl,
        originalUrl,
        preset,
        setPreset,
        targetLoudness,
        setTargetLoudness,
        masteringLevel,
        setMasteringLevel,
        language: i18n.language || "fr",
        setLanguage,
        t,
        uploadFile,
        resetApp
    };

    return (
        <MasteringContext.Provider value={value}>
            {children}
        </MasteringContext.Provider>
    );
}

export function useMastering() {
    const context = useContext(MasteringContext);
    if (!context) {
        throw new Error("useMastering must be used within a MasteringProvider");
    }
    return context;
}
