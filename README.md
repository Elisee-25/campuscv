# 🎓 CampusCV — Trombinoscopique Étudiant

> Application web moderne pour créer et partager les profils étudiants d'une promotion.  
> Construite avec **TypeScript**, **Vite** et **IndexedDB**.

---

## 📸 Aperçu

CampusCV est un annuaire interactif (trombinoscopique) permettant à des étudiants de créer leur profil complet avec photo, vidéo de présentation, compétences, expériences, formations et projets. Chaque profil peut être enrichi d'une vidéo ou d'un audio synchronisé avec des chapitres de parcours.

---

## ✨ Fonctionnalités

### 👤 Gestion des profils
- Création et modification de profils étudiants complets
- Photo de profil (JPG, PNG, WEBP — max 4 Mo)
- Statut de recherche : Stage, Alternance, Premier emploi, Thèse, Freelance, Indisponible

### 📋 Informations du profil
- Identité : prénom, nom, filière, école, promotion, ville
- Présentation personnelle et objectif professionnel
- Compétences (séparées par des virgules)
- Formations académiques
- Expériences professionnelles (stages, jobs, bénévolat)
- Projets personnels
- Langues parlées
- Liens : Email, LinkedIn, GitHub / Portfolio

### 🎬 Média de présentation
- Upload de vidéo locale (MP4, MOV, WEBM — max 200 Mo)
- Upload d'audio local (MP3, WAV, OGG, M4A — max 50 Mo)
- Intégration YouTube / Vimeo via URL
- **Chapitres synchronisés** : naviguez dans le média en cliquant sur une section du parcours

### 🔍 Recherche & Filtres
- Recherche globale : nom, école, compétences, promotion, ville, bio
- Filtre par promotion
- Tri : Nom A-Z, Plus récents, École

### 📊 Tableau de bord
- Statistiques en temps réel : nombre de profils, médias, écoles, promotions
- Aperçu des profils récents

### ⚙️ Paramètres
- Export de la base de données en JSON
- Import de profils depuis un fichier JSON
- Suppression complète des données

---

## 🛠️ Technologies utilisées

| Technologie | Rôle |
|-------------|------|
| **TypeScript** | Langage principal — typage strict de tout le code |
| **Vite** | Bundler et serveur de développement |
| **IndexedDB** | Base de données locale dans le navigateur |
| **HTML5 / CSS3** | Interface utilisateur |
| **Web APIs** | FileReader, MediaPlayer, IFrame YouTube API |

---

## 📁 Structure du projet

```
campuscv/
├── src/                    # Sources TypeScript
│   ├── types.ts            # Interfaces & types (Profile, Experience, etc.)
│   ├── db.ts               # Couche IndexedDB typée (CRUD)
│   ├── utils.ts            # Fonctions utilitaires typées
│   └── app.ts              # Logique principale de l'application
├── docs/                   # Build de production (servi par GitHub Pages)
├── index.html              # Point d'entrée HTML
├── styles.css              # Styles de l'application
├── tsconfig.json           # Configuration TypeScript
├── vite.config.ts          # Configuration Vite
└── package.json            # Dépendances du projet
```

---

## 🚀 Installation et lancement

### Prérequis
- [Node.js](https://nodejs.org) version 18 ou supérieure
- [Git](https://git-scm.com)

### Étapes

```bash
# 1. Cloner le projet
git clone https://github.com/Elisee-25/campuscv.git

# 2. Entrer dans le dossier
cd campuscv

# 3. Installer les dépendances
npm install

# 4. Lancer en développement
npm run dev
```

L'application s'ouvre sur `http://localhost:5173`

### Commandes disponibles

```bash
npm run dev      # Serveur de développement avec hot reload
npm run build    # Build de production dans /docs
npm run preview  # Prévisualiser le build de production
```


## 💾 Base de données

CampusCV utilise **IndexedDB**, une base de données intégrée au navigateur. Cela signifie que :

- ✅ Aucun serveur requis — fonctionne 100% hors ligne
- ✅ Données stockées localement et de manière persistante
- ⚠️ Les données sont propres à chaque navigateur/appareil
- ⚠️ Deux utilisateurs différents ne partagent pas les mêmes données

Pour partager des profils, utilisez la fonctionnalité **Export / Import JSON** dans les paramètres.

---

## 👨‍💻 Auteur

**Elisee-25** — [GitHub](https://github.com/Elisee-25)

---

## 📄 Licence

Ce projet est open source sous licence MIT.