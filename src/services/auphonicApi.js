// src/services/auphonicApi.js

const API_KEY = import.meta.env.VITE_AUPHONIC_API_KEY;
const BASE_URL = 'https://auphonic.com/api';

export const startMastering = async (audioFile) => {
    const formData = new FormData();
    formData.append('input_file', audioFile);
    formData.append('action', 'start'); // Lance le traitement automatiquement

    try {
        const response = await fetch(`${BASE_URL}/simple/productions.json`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`
                // Pas de Content-Type, le navigateur gère le FormData
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();
        return data.data.uuid; // On retourne l'ID de la tâche

    } catch (error) {
        console.error("Erreur lors de l'envoi à Auphonic:", error);
        throw error;
    }
};
// Fonction pour vérifier le statut de la production
export const checkMasteringStatus = async (uuid) => {
    try {
        const response = await fetch(`${BASE_URL}/production/${uuid}.json`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${API_KEY}`
            }
        });

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error("Erreur lors de la vérification du statut:", error);
        throw error;
    }
};

// Utiliser le paramètre bearer_token officiel de l'API Auphonic pour les requêtes URL (comme <audio>) afin d'éviter les restrictions de credentials basiques de Chrome et contourner CORS
export const getAuthenticatedUrl = (downloadUrl) => {
    if (!API_KEY || !downloadUrl) return downloadUrl;
    
    // Déterminer s'il faut utiliser ? ou & selon la présence de paramètres existants
    const separator = downloadUrl.includes('?') ? '&' : '?';
    return `${downloadUrl}${separator}bearer_token=${API_KEY}`;
};