# AuraMaster - Studio de Mastering Audio IA 🎛️✨

AuraMaster est une application web moderne et haut de gamme d'égalisation et de mastering audio automatisé, propulsée par l'intelligence artificielle de l'API **Auphonic**. 

Conçue comme un véritable outil de production en studio numérique, elle offre une expérience immersive en temps réel pour optimiser instantanément la dynamique, le loudness et le spectre de vos pistes audio.

---

## 🎨 Fonctionnalités Clés & Design Premium

- **Esthétique Cyber Dark & Glassmorphism** : Interface sombre immersive inspirée des logiciels audionumériques professionnels (Ableton, Splice). Elle utilise des dégradés néon réactifs (cyan, violet, rose), des cartes en verre dépoli translucide (`backdrop-filter: blur(20px)`) et des lueurs ambiantes flottantes animées.
- **Comparateur A/B Haute-Fidélité en Temps Réel** : Un commutateur instantané permettant d'écouter et de comparer la piste **Originale (Brute)** et la piste **Masterisée (Auphonic)**. Le lecteur conserve la position temporelle exacte (à la milliseconde près) et reprend la lecture sans aucune coupure pour une comparaison d'une précision absolue.
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
│   └── auphonicApi.js          # Appels sécurisés, polling et conversion d'URLs d'Auphonic
├── App.jsx                     # Layout global épuré encapsulé par le MasteringProvider
├── i18n.js                     # Paramétrage d'i18next et dictionnaires FR / EN
└── main.jsx                    # Point d'entrée avec importation globale d'i18n
```

---

## ⚡ Résolution Technique Avancée (CORS & Redirections Cloudflare R2)

Lors de la récupération de la piste finale masterisée, l'application résout de manière élégante un problème classique d'authentification et de sécurité cross-origin (CORS) :

### Le Problème
1. Le fichier masterisé est hébergé sur un bucket de stockage Cloudflare R2.
2. Faire une requête AJAX JavaScript `fetch()` vers l'URL de téléchargement d'Auphonic avec l'en-tête `Authorization: Bearer <API_KEY>` provoque une redirection (302) vers R2. Le navigateur suit la redirection et envoie l'en-tête à R2, ce qui échoue pour cause de CORS (R2 ne renvoyant pas les en-têtes d'autorisation ou CORS pour l'origine locale).
3. À l'inverse, charger directement l'URL brute d'Auphonic dans la balise `<audio>` échoue avec une erreur **403 (Forbidden)** car la balise n'envoie pas d'en-tête d'autorisation.
4. Les navigateurs modernes bloquent désormais les identifiants d'authentification basique intégrés dans les URLs de sous-ressources (comme `https://user:password@domain/file.mp3`) pour lutter contre le phishing.

### La Solution AuraMaster
Nous utilisons le paramètre de requête **`bearer_token`** officiellement pris en charge par l'API d'Auphonic :
1. Nous générons une URL de téléchargement sous le format : `https://auphonic.com/api/download/audio-result/{uuid}/{filename}?bearer_token={API_KEY}`.
2. Le lecteur HTML5 standard effectue une requête GET classique vers cette URL. Auphonic reçoit le token en paramètre de requête, valide l'authentification et renvoie une redirection `302` vers Cloudflare R2.
3. **Sécurité native du navigateur** : Lors d'une redirection cross-origin (de `auphonic.com` vers `cloudflarestorage.com`), le navigateur **supprime automatiquement** les paramètres d'authentification de la requête.
4. Le lecteur audio HTML5 accède de façon anonyme au flux de stockage R2 final (qui autorise le streaming media anonyme), contournant ainsi de manière 100% stable et sécurisée les restrictions CORS AJAX !

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
Créez un fichier `.env` à la racine du projet (au même niveau que le fichier `package.json`) et ajoutez votre clé d'API Auphonic personnelle :
```env
VITE_AUPHONIC_API_KEY=votre_cle_api_auphonic_reelle
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
