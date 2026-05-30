// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  fr: {
    translation: {
      subtitle: "Sublimez vos pistes audio instantanément grâce à l'algorithme intelligent d'AI Mastering",
      dragDropText: "Glissez-déposez votre piste ici",
      clickBrowseText: "ou cliquez pour parcourir vos dossiers locaux",
      selectButton: "Sélectionner un fichier audio",
      formatsText: "Formats : WAV, MP3, FLAC, M4A et plus",
      formatError: "Format non supporté. Veuillez importer un fichier audio (.wav, .mp3, etc.)",
      loadingUpload: "Téléversement en cours...",
      loadingMastering: "Mastering IA en cours...",
      taskLabel: "Tâche ID : ",
      readyTitle: "🎉 Votre Master est prêt !",
      readySubtitle: "Écoutez la différence grâce au comparateur de précision",
      abLabel: "Comparateur A/B :",
      btnOriginal: "Original (Brut)",
      btnMastered: "✨ Masterisé (AI Mastering)",
      downloadBtn: "Télécharger le Master (WAV)",
      resetBtn: "Masteriser une autre piste",
      errorMessage: "Une erreur est survenue lors du traitement de ton audio.",
      retryBtn: "Réessayer",
      panelTitle: "📡 CONFIGURATION DE LA CONSOLE SPATIALE",
      panelSubtitle: "Étalonnez les senseurs acoustiques de l'IA",
      labelProfile: "Profil Acoustique (Tonalité)",
      presetGeneral: "Général",
      presetPop: "Pop/Rock",
      presetJazz: "Jazz/Acoustique",
      presetClassical: "Classique",
      labelLoudness: "Pression Acoustique (Loudness Cible)",
      labelIntensity: "Niveau du Mastering (Intensité)",
      intensitySubtil: "Subtil",
      intensityPuissant: "Puissant",
      presetLabel: "Préréglages rapides :",
      steps: [
        "Upload sécurisé du fichier audio...",
        "Analyse de la dynamique et du spectre...",
        "Correction fréquentielle et égalisation automatique...",
        "Optimisation de la stéréophonie et de l'espace...",
        "Ajustement du volume sonore (Loudness Maximizer)...",
        "Finalisation de l'export haute fidélité (WAV)..."
      ]
    }
  },
  en: {
    translation: {
      subtitle: "Enhance your audio tracks instantly using AI Mastering's intelligent algorithm",
      dragDropText: "Drag & drop your track here",
      clickBrowseText: "or click to browse your local folders",
      selectButton: "Select an audio file",
      formatsText: "Formats: WAV, MP3, FLAC, M4A and more",
      formatError: "Unsupported format. Please import an audio file (.wav, .mp3, etc.)",
      loadingUpload: "Uploading in progress...",
      loadingMastering: "AI Mastering in progress...",
      taskLabel: "Task ID: ",
      readyTitle: "🎉 Your Master is ready!",
      readySubtitle: "Hear the difference with the precision comparator",
      abLabel: "A/B Comparison:",
      btnOriginal: "Original (Raw)",
      btnMastered: "✨ Mastered (AI Mastering)",
      downloadBtn: "Download Master (WAV)",
      resetBtn: "Master another track",
      errorMessage: "An error occurred during your audio processing.",
      retryBtn: "Retry",
      panelTitle: "📡 SPACE CONSOLE CONFIGURATION",
      panelSubtitle: "Calibrate the AI acoustic sensors",
      labelProfile: "Acoustic Profile (Tonal Mode)",
      presetGeneral: "General",
      presetPop: "Pop/Rock",
      presetJazz: "Jazz/Acoustic",
      presetClassical: "Classical",
      labelLoudness: "Acoustic Pressure (Target Loudness)",
      labelIntensity: "Mastering Level (Intensity)",
      intensitySubtil: "Subtle",
      intensityPuissant: "Powerful",
      presetLabel: "Quick Presets:",
      steps: [
        "Secure upload of the audio file...",
        "Dynamics and spectrum analysis...",
        "Frequency correction & automatic EQ...",
        "Stereophony and space optimization...",
        "Loudness adjustment (Loudness Maximizer)...",
        "Finalizing high-fidelity export (WAV)..."
      ]
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'fr',
    fallbackLng: 'fr',
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
