# AuraMaster - Studio de Mastering Audio IA 🎛️✨

AuraMaster est une application web moderne et haut de gamme d'égalisation et de mastering audio automatisé, propulsée par l'intelligence artificielle de l'API **AI Mastering (aimastering.com / Bakuage)**. 

Conçue comme un véritable outil de production en studio numérique, elle offre une expérience immersive en temps réel pour optimiser instantanément la dynamique, le loudness et le spectre de vos pistes audio.

---

## 🎨 Fonctionnalités Clés & Design Premium

- **Esthétique Cyber Dark & Glassmorphism** : Interface sombre immersive inspirée des logiciels audionumériques professionnels (Ableton, Splice). Elle utilise des dégradés néon réactifs (cyan, violet, rose), des cartes en verre dépoli translucide (`backdrop-filter: blur(20px)`) et des lueurs ambiantes flottantes animées.
- **Comparateur A/B Haute-Fidélité en Temps Réel** : Un commutateur instantané permettant d'écouter et de comparer la piste **Originale (Brute)** et la piste **Masterisée (AI Mastering)**. Le lecteur conserve la position temporelle exacte (à la milliseconde près) et reprend la lecture sans aucune coupure pour une comparaison d'une précision absolue.
- **Lecteur Audio Customisé & Égaliseur Waveform** : Remplacement du lecteur natif du navigateur par un lecteur sur-mesure équipé d'indicateurs de temps MM:SS, d'une barre de progression retro-éclairée réactive, d'un contrôle précis du volume (avec bouton de sourdine) et d'un spectrographe de vagues sonores CSS qui pulse en rythme uniquement lors de la lecture.
- **Console de Chargement & Logs Interactifs** : Un radar animé en gradient conique couplé à un système de logs réactifs détaillant les 6 étapes de traitement du signal (analyse spectrale, égalisation automatique, stéréophonie, maximiseur de loudness...) au fil de la communication avec l'API.
- **Localisation Multilingue (Français / Anglais)** : Système bilingue standardisé s'appuyant sur **i18next** et **react-i18next**, commutable instantanément via un sélecteur de langue coulissant dans l'en-tête.

---

## 🏛️ Architecture Modulaire Propre (React Context)

Pour faciliter la maintenance et l'évolution de l'application, l'architecture a été divisée de manière à éliminer complètement le *Props Drilling* et à maximiser la composabilité à l'aide de composants présentations d'une part, et de composants atomiques réutilisables d'autre part :

### Structure des dossiers
```
src/
├── context/
│   └── MasteringContext.jsx    # État global unifié (Fichier, Statuts, URLs, i18n hooks, fonctions d'upload/reset)
├── components/
│   ├── FileUploader.jsx        # Zone d'importation interactive avec waveform SVG dynamique et bilingue
│   ├── PollingLoader.jsx       # Contrôleur d'étapes de chargement
│   ├── ResultPlayer.jsx        # Présentateur du Master et du sélecteur A/B
│   ├── CustomAudioPlayer.jsx   # [Atomique] Lecteur générique autonome et découplé
│   ├── RadarSpinner.jsx        # [Atomique] Animation conique de radar de chargement
│   ├── StepTracker.jsx         # [Atomique] Checklist linéaire de progression générique
│   └── WaveformVisualizer.jsx  # [Atomique] Égaliseur décoratif autonome
├── services/
│   └── aiMasteringApi.js       # Appels sécurisés, polling, token de téléchargement et intégration d'AI Mastering
├── App.jsx                     # Layout global épuré encapsulé par le MasteringProvider
├── i18n.js                     # Paramétrage d'i18next et dictionnaires FR / EN
└── main.jsx                    # Point d'entrée avec importation globale d'i18n
```

---

## ⚡ Résolution Technique Avancée (Bypass CORS & Token de Téléchargement)

Lors de l'interrogation de l'API de Bakuage, l'application résout de manière élégante et standardisée les restrictions de sécurité cross-origin (CORS) :

### 1. Le Défi CORS
L'API officielle de Bakuage (`api.bakuage.com`) ne prend pas en charge nativement le protocole CORS pour les requêtes émises depuis les navigateurs sur des domaines externes (comme `http://localhost:5173`). Les navigateurs bloquent ainsi les requêtes directes en émettant une erreur d'origine.

### 2. La Solution Proxy Inverse local (Vite)
Pour contourner cette limitation de manière stable et sécurisée en mode développement, nous avons configuré un proxy inverse directement au cœur de notre serveur de développement Vite (`vite.config.js`). 
Toutes les requêtes faites vers la route locale `/api_aimastering` sont relayées par Node de manière transparente au serveur de Bakuage sans restriction de CORS.

### 3. Récupération Sécurisée des Pistes Audio
Au lieu de charger des fichiers via des authentifications basiques ou en-têtes d'autorisation bloqués par le navigateur pour des éléments de sous-ressources, nous appliquons le protocole sécurisé en deux étapes de Bakuage :
1. Dès que la tâche de mastering passe au statut `succeeded`, le context effectue une requête asynchrone pour générer un token temporaire à usage unique : `GET /audios/{id}/download_token`.
2. Nous construisons ensuite une URL de streaming directe : `/api_aimastering/audios/download_by_token?download_token={token}`.
3. Le lecteur audio HTML5 décode ainsi le master de manière anonyme et 100% stable !

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
Créez un fichier `.env` à la racine du projet (au même niveau que le fichier `package.json`) et ajoutez votre clé d'API AI Mastering personnelle générée sur [app.bakuage.com/#/developer](https://app.bakuage.com/#/developer) :
```env
VITE_AIMASTERING_API_KEY=votre_cle_api_aimastering_reelle
```

### 4. Lancer le serveur de développement
```bash
npm run dev
```
Ouvrez l'adresse locale affichée dans votre terminal (généralement `http://localhost:5173`).

### 5. Compiler pour la production
```bash
# Génère les fichiers statiques optimisés dans le dossier dist/
npm run build
```
