# 📈 StockTrader - Application de Trading

Une application web de simulation de trading d'actions permettant aux utilisateurs de gérer un portefeuille virtuel, acheter et vendre des actions en temps réel.

## 🚀 Fonctionnalités

- **Authentification** : Inscription et connexion sécurisées avec JWT
- **Portefeuille** : Visualisation et gestion de votre portefeuille d'actions
- **Trading** : Achat et vente d'actions en temps réel
- **Multilingue** : Support français et anglais
- **Documentation API** : Interface Swagger interactive

## 🛠️ Technologies

### Backend

- **Node.js** avec **Express**
- **TypeScript**
- **MongoDB** (base de données)
- **JWT** (authentification)
- **Swagger** (documentation API)
- **Vitest** (tests unitaires)

### Frontend

- **React 18** avec **TypeScript**
- **Vite** (build tool)
- **Tailwind CSS** (styling)
- **Shadcn/UI** (composants UI)
- **Context API** (gestion d'état)

## 📋 Prérequis

- Node.js v18+
- npm ou yarn
- MongoDB (local ou Atlas)

## ⚙️ Installation

### 1. Cloner le projet

```bash
git clone <url-du-repo>
cd ProjetFinal
```

### 2. Configuration du Backend

```bash
cd backend
npm install
```

Créer le fichier `.env` à partir de l'exemple :

```bash
cp .env.example .env
```

Configurer les variables d'environnement dans `.env` :

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/stocktrader
JWT_SECRET=votre_secret_jwt
NODE_ENV=development
```

### 3. Configuration du Frontend

```bash
cd frontend
npm install
```

Créer le fichier `.env` :

```env
VITE_API_URL=http://localhost:3000/api
```

## 🚀 Lancement

### Démarrer le Backend

```bash
cd backend
npm run dev
```

Le serveur démarre sur `http://localhost:3000`

### Démarrer le Frontend

```bash
cd frontend
npm run dev
```

L'application démarre sur `http://localhost:5173`

## 📚 Documentation API

Une fois le backend lancé, accédez à la documentation Swagger :

- **Interface Swagger UI** : `http://localhost:3000/api/docs`
- **Spécification JSON** : `http://localhost:3000/api/docs.json`

## 🧪 Tests

### Backend

```bash
cd backend
npm run test
```

## 📁 Structure du Projet

```
ProjetFinal/
├── backend/
│   ├── src/
│   │   ├── common/          # Constantes et utilitaires
│   │   ├── models/          # Modèles de données
│   │   ├── repos/           # Couche d'accès aux données
│   │   ├── routes/          # Routes API
│   │   ├── services/        # Logique métier
│   │   └── server.ts        # Configuration Express
│   └── tests/               # Tests unitaires
│
└── frontend/
    ├── src/
    │   ├── components/      # Composants React
    │   ├── context/         # Contextes React
    │   ├── pages/           # Pages de l'application
    │   ├── services/        # Services API
    │   ├── lang/            # Fichiers de traduction
    │   └── lib/             # Utilitaires
    └── public/              # Fichiers statiques
```

## 🔗 Endpoints API Principaux

| Méthode | Endpoint              | Description          |
| ------- | --------------------- | -------------------- |
| POST    | `/api/users/register` | Inscription          |
| POST    | `/api/users/login`    | Connexion            |
| GET     | `/api/stocks`         | Liste des actions    |
| GET     | `/api/stocks/:id`     | Détails d'une action |
| POST    | `/api/stocks/buy`     | Acheter une action   |
| POST    | `/api/stocks/sell`    | Vendre une action    |

## 👤 Auteur

Justin

## 📄 Licence

Ce projet est réalisé dans le cadre du cours de Développement Web 3.
