// src/services/aiMasteringApi.js

const API_KEY = import.meta.env.VITE_AIMASTERING_API_KEY;
const BASE_URL = import.meta.env.DEV ? '/api_aimastering' : 'https://api.bakuage.com';

/**
 * Lance le cycle complet : téléversement de l'audio puis démarrage du mastering.
 * @param {File} audioFile Le fichier audio d'origine
 * @param {Object} options Les options du mastering (mode, targetLoudness, masteringLevel)
 * @returns {Promise<string>} L'ID de la tâche de mastering (mastering_id)
 */
export const startMastering = async (audioFile, options = {}) => {
    if (!API_KEY) {
        throw new Error("Clé d'API AI Mastering (VITE_AIMASTERING_API_KEY) manquante.");
    }

    // Étape 1 : Téléversement du fichier audio
    const formData = new FormData();
    formData.append('file', audioFile);

    try {
        const uploadResponse = await fetch(`${BASE_URL}/audios`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`
                // Pas de Content-Type, le navigateur l'ajoute automatiquement avec le boundary pour le FormData
            },
            body: formData
        });

        if (!uploadResponse.ok) {
            throw new Error(`Échec de l'upload audio (Code HTTP ${uploadResponse.status})`);
        }

        const audioData = await uploadResponse.json();
        const actualAudio = audioData.audio || audioData;
        const audioId = actualAudio.id || actualAudio.audio_id || actualAudio.file_id || Object.values(actualAudio)[0];
        
        if (!audioId) {
            throw new Error("ID audio non trouvé dans la réponse du serveur.");
        }

        // Étape 2 : Création et démarrage de la tâche de mastering avec options personnalisées (Bakuage attend du multipart/form-data)
        const masteringFormData = new FormData();
        masteringFormData.append('input_audio_id', parseInt(audioId, 10));
        masteringFormData.append('mode', 'custom'); // Active le mode personnalisé pour exploiter les paramètres ci-dessous
        masteringFormData.append('mastering', 'true'); // Active le traitement de mastering
        masteringFormData.append('preset', options.preset || 'general'); // general, pop, classical, jazz
        masteringFormData.append('target_loudness', parseFloat(options.targetLoudness) || -14.0);
        masteringFormData.append('mastering_matching_level', parseFloat(options.masteringLevel) || 0.5);

        const masteringResponse = await fetch(`${BASE_URL}/masterings`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`
                // Pas de Content-Type pour que le navigateur injecte le boundary multipart/form-data
            },
            body: masteringFormData
        });

        if (!masteringResponse.ok) {
            const errorText = await masteringResponse.text();
            console.error("Détails de l'erreur serveur Bakuage /masterings:", errorText);
            throw new Error(`Échec du lancement du mastering (Code HTTP ${masteringResponse.status}): ${errorText}`);
        }

        const masteringData = await masteringResponse.json();
        console.log("Données de réponse Bakuage /masterings:", masteringData);
        const actualMastering = (masteringData.mastering && typeof masteringData.mastering === 'object') ? masteringData.mastering : masteringData;
        const masteringId = actualMastering.id || Object.values(actualMastering)[0];

        if (!masteringId) {
            throw new Error("ID de mastering non trouvé dans la réponse du serveur.");
        }

        return masteringId;

    } catch (error) {
        console.error("Erreur dans startMastering:", error);
        throw error;
    }
};

/**
 * Vérifie le statut d'une tâche de mastering.
 * @param {string} masteringId L'ID du mastering
 * @returns {Promise<Object>} Les données du mastering (contenant le status 'waiting', 'processing', 'succeeded' ou 'failed')
 */
export const checkMasteringStatus = async (masteringId) => {
    if (!API_KEY) {
        throw new Error("Clé d'API AI Mastering (VITE_AIMASTERING_API_KEY) manquante.");
    }

    try {
        const response = await fetch(`${BASE_URL}/masterings/${masteringId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${API_KEY}`
            }
        });

        if (!response.ok) {
            throw new Error(`Erreur lors de la récupération du statut (Code HTTP ${response.status})`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Erreur dans checkMasteringStatus:", error);
        throw error;
    }
};

/**
 * Récupère un token temporaire et génère l'URL de téléchargement/streaming authentifiée.
 * @param {string} outputAudioId L'ID de l'audio de sortie (masterisé)
 * @returns {Promise<string>} L'URL de streaming contournant CORS
 */
export const getAuthenticatedUrl = async (outputAudioId) => {
    if (!API_KEY || !outputAudioId) return '';

    try {
        const response = await fetch(`${BASE_URL}/audios/${outputAudioId}/download_token`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${API_KEY}`
            }
        });

        if (!response.ok) {
            throw new Error(`Échec de récupération du token de téléchargement (Code HTTP ${response.status})`);
        }

        const tokenData = await response.json();
        const actualToken = tokenData.audio_download_token || tokenData;
        const downloadToken = actualToken.token || actualToken.audio_download_token || actualToken.download_token || Object.values(actualToken)[0];

        if (!downloadToken) {
            throw new Error("Token de téléchargement manquant dans la réponse.");
        }

        return `${BASE_URL}/audios/download_by_token?download_token=${downloadToken}`;
    } catch (error) {
        console.error("Erreur dans getAuthenticatedUrl:", error);
        throw error;
    }
};
