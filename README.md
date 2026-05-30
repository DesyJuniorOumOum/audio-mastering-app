# AuraMaster - Studio de Mastering Audio IA 🎛️✨

AuraMaster est une application web moderne de mastering et d'optimisation audio automatisée de qualité professionnelle, propulsée par l'intelligence artificielle de l'API **Auphonic**. 

---

## 🎨 Fonctionnalités Phares & Design Premium

- **Esthétique Cyber Dark & Glassmorphism** : Interface sombre immersive avec des dégradés néon réactifs (cyan, violet, rose) et des cartes en verre dépoli (`backdrop-filter: blur(20px)`) s'adaptant à tous les écrans.
- **Comparateur A/B Haute-Fidélité en Temps Réel** : Un commutateur instantané permettant d'écouter et de comparer la piste **Originale** brute et la piste **Masterisée** en temps réel. Le lecteur conserve la position temporelle exacte (à la milliseconde près) et reprend la lecture sans aucune coupure.
- **Lecteur Audio Customisé & Égaliseur Waveform** : Remplacement du lecteur natif gris par un lecteur sur-mesure équipé d'indicateurs de temps MM:SS, d'une réglette de progression retro-éclairée, d'une commande de volume précise et d'un spectrographe de vagues sonores CSS qui pulse en rythme.
- **Console de Chargement Interactive** : Un radar animé en gradient conique couplé à un système de logs réactifs qui détaille les 6 étapes de traitement du signal (analyse spectrale, égalisation automatique, maximiseur de loudness...) au fil de la communication avec l'API.
- **Localisation Multilingue (Français / Anglais)** : Système bilingue standardisé de pointe s'appuyant sur **i18next** et **react-i18next**, commutable instantanément via un sélecteur de langue coulissant.

---

## 🏛️ Architecture Modulaire Propre (React Context)

Pour faciliter la maintenance et l'évolution de l'application, l'architecture a été conçue pour éliminer le *Props Drilling* et maximiser la composabilité :

```
src/
├── context/
│   └── MasteringContext.jsx    # État global unifié (Fichier, Statuts, URLs, i18n hooks)
├── components/
│   ├── FileUploader.jsx        # Zone d'importation interactive avec waveform SVG dynamique
│   ├── PollingLoader.jsx       # Contrôleur d'étapes de chargement
│   ├── ResultPlayer.jsx        # Présentateur du Master et du sélecteur A/B
│   ├── CustomAudioPlayer.jsx   # Lecteur générique autonome et découplé
│   ├── RadarSpinner.jsx        # Animation conique de chargement
│   ├── StepTracker.jsx         # Checklist linéaire et générique de progression
│   └── WaveformVisualizer.jsx  # Égaliseur décoratif autonome
├── services/
│   └── auphonicApi.js          # Appels sécurisés et download de Blobs d'Auphonic
├── App.jsx                     # Layout global épuré encapsulé par le Provider
├── i18n.js                     # Paramétrage d'i18next et dictionnaires FR / EN
└── main.jsx                    # Point d'entrée de l'application
```

---

## 🛠️ Installation & Démarrage rapide

### 1. Prérequis
Assurez-vous d'avoir [Node.js](https://nodejs.org/) installé sur votre machine.

### 2. Cloner le projet et installer les dépendances
```bash
# Installer les modules Node
npm install
```

### 3. Configurer les variables d'environnement
Créez un fichier `.env` à la racine du projet et ajoutez votre clé d'API Auphonic :
```env
VITE_AUPHONIC_API_KEY=votre_cle_api_auphonic_ici
```

### 4. Lancer le serveur de développement
```bash
npm run dev
```
Ouvrez l'adresse locale affichée dans votre terminal (généralement `http://localhost:5173`).

### 5. Compiler pour la production
```bash
npm run build
```
Les fichiers optimisés seront générés dans le dossier `dist/`.
