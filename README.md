# Déclaration de pollutions

Application de déclaration de pollutions, réalisée dans le cadre du cours SI Web (CNAM).
Le dépôt contient deux projets :

- `Front/` : application Angular (liste, détail, création et modification des pollutions, inscription, connexion, liste des utilisateurs).
- `api/` : API REST Express / Sequelize avec une base PostgreSQL (pollutions et utilisateurs).

## Lancer l'API en local

```bash
cd api
npm install
npm run dev
```

L'API écoute sur `http://localhost:3000` (route de contrôle : `/health`).
Autres commandes : `npm run build` (compilation TypeScript dans `dist/`) et `npm run start` (lance `dist/index.js`).

Variables d'environnement lues par l'API (toutes facultatives en local, valeurs par défaut dans `api/src/config.ts`) :

- `DATABASE_URL` : URL de connexion PostgreSQL (remplace les variables `DB_*`)
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` : connexion PostgreSQL si `DATABASE_URL` est absente
- `DB_SSL` : `true` ou `false` pour forcer ou désactiver SSL (par défaut, SSL sauf pour localhost)
- `PORT` : port d'écoute (3000 par défaut)

## Lancer le front en local

```bash
cd Front
npm install
npm start
```

L'application est servie sur `http://localhost:4200` et appelle l'API sur `http://localhost:3000/api`
(`src/environments/environment.development.ts`). Autres commandes : `npm run build`, `npm test`, `npm run lint`.

## Production

Le front est construit avec `src/environments/environment.ts`, qui pointe vers l'API en production :
`https://projet-bischung-lilian-api.onrender.com/api`.
Le fichier `render.yaml` décrit le déploiement de l'API sur Render (dossier `api`).
