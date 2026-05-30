// src/context/MasteringContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { startMastering, checkMasteringStatus, downloadAudioFile } from '../services/auphonicApi';

const MasteringContext = createContext(null);

export function MasteringProvider({ children }) {
    const { t, i18n } = useTranslation();
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState("idle");
    const [taskId, setTaskId] = useState(null);
    const [resultUrl, setResultUrl] = useState(null);
    const [originalUrl, setOriginalUrl] = useState(null);

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

    // Gérer l'upload de fichier
    useEffect(() => {
        const uploadAudio = async () => {
            if (file && status === "uploading") {
                try {
                    const uuid = await startMastering(file);
                    setTaskId(uuid);
                    setStatus("processing");
                } catch (error) {
                    setStatus("error");
                }
            }
        };
        uploadAudio();
    }, [file, status]);

    // Boucle de Polling
    useEffect(() => {
        let intervalId;

        const pollStatus = async () => {
            try {
                const productionData = await checkMasteringStatus(taskId);

                if (productionData.status_string === 'Done') {
                    clearInterval(intervalId);
                    const rawUrl = productionData.output_files[0].download_url;
                    const localAudioUrl = await downloadAudioFile(rawUrl);

                    setResultUrl(localAudioUrl);
                    setStatus("done");
                } else if (productionData.status_string === 'Error') {
                    clearInterval(intervalId);
                    setStatus("error");
                }
            } catch (error) {
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
