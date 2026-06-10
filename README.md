# DevBoard

Outil de veille technologique permettant de monter en compétences sur les sujets qui nous intéressent. DevBoard propose des articles et des thématiques selon les préférences de l'utilisateur, avec un suivi de la veille réalisée.

## Équipe

| Membre | Rôle |
|---|---|
| Nicolas Rivalant | Livrable 1 |
| Amaury Mechin | Initialisation du projet |
| Kellian Kaufmann | Recherche de l'API & premiers tests d'appels via Bruno |

---

## Stack

- **Framework** — Next.js 15 (App Router)
- **Auth** — NextAuth (GitHub OAuth + Credentials)
- **Base de données** — SQLite via Prisma ORM
- **Data** — NewsAPI
- **Style** — Tailwind CSS

---

## Contraintes techniques

### Layouts imbriqués
Architecture en 2 niveaux :
- Le layout racine (`app/layout.tsx`) — providers globaux (NextAuth session)
- Le layout dashboard (`app/dashboard/layout.tsx`) — sidebar de navigation, header avec session utilisateur, vérifie la session via le middleware

### Data Fetching
- Les articles proviennent de l'API NewsAPI (`top-headlines?category=technology`)
- Les résultats sont mis en cache avec `revalidate: 3600` (revalidation toutes les heures)
- Le contenu complet d'un article est scrappé à la demande avec `revalidate: 3600` ⚠️ *(à passer en `cache: 'no-store'` pour toujours être frais)*

### Server Actions
Utilisées pour les actions qui modifient des données :
- Créer un article (`src/actions/articles.ts`) — insertion en mémoire + revalidation
- Ajouter / retirer un favori (`src/actions/favorites.ts`) — écriture Prisma + `revalidatePath`
- La logique reste entièrement côté serveur

### Auth NextAuth
- Connexion via GitHub OAuth et via email / mot de passe (CredentialsProvider + bcrypt)
- Les utilisateurs GitHub sont automatiquement créés en base à la première connexion
- Un middleware protège toutes les routes `/dashboard/**` et `/api/**` (hors auth)
- Contrôle d'accès par rôle : `/dashboard/users/**` réservé aux admins, `/dashboard/articles/create` aux admins et editors

### Optimisations mesurables
- Images des articles optimisées via `next/image` (remote patterns ouverts)
- Mise en cache des résultats NewsAPI, évite de re-fetch à chaque visite
- Skeleton loader sur la page détail d'un article (`articleSkeleton.tsx`)
- Mises à jour optimistes (`useOptimistic`) sur le bouton favori — feedback instantané sans attendre le serveur

---

## Features MVP

- **Authentification** — Connexion GitHub OAuth ou email/mot de passe, déconnexion, gestion de session JWT
- **Articles** — Liste des articles récents (NewsAPI), titre / description / source / date, page détail avec contenu scrappé
- **Catégories** — Filtrer par Web, IA, Cybersécurité, Cloud, Mobile (filtrage client-side par mots-clés)
- **Administration** — Ajouter un article (réservé admin / editor), accès restreint par rôle via middleware
- **Favoris** — Ajouter / retirer un article depuis la liste ou le dashboard, persistés en base par utilisateur

---

## Backlog Initial

| # | User Story | Priorité | Fait |
|:-:|---|:-:|:-:|
| 1 | En tant que visiteur, je veux voir la landing avec quelques articles pour comprendre ce qu'est DevBoard | P0 | [ ] |
| 2 | En tant que visiteur, je veux me connecter avec GitHub pour accéder au contenu complet | P0 | [x] |
| 3 | En tant qu'utilisateur connecté, je veux voir la liste complète des articles de veille | P0 | [x] |
| 4 | En tant qu'utilisateur connecté, je veux filtrer les articles par catégorie (Web, IA, Cybersécurité, Cloud, Mobile) | P2 | [x] |
| 5 | En tant qu'utilisateur connecté, je veux voir le détail d'un article | P0 | [x] |
| 6 | En tant qu'utilisateur connecté, je veux ajouter un article en favori et le retrouver dans ma liste | P1 | [x] |
| 7 | En tant qu'utilisateur connecté, je veux écrire une note sur un article pour garder une trace de ma veille | P1 | [ ] |
| 8 | En tant qu'utilisateur connecté, je veux mettre à jour mon profil | P1 | [ ] |
| 9 | En tant qu'utilisateur, je veux que le partage d'un article génère une preview propre | P2 | [ ] |
| 10 | En tant que développeur, je veux des scores Lighthouse > 90 documentés dans le README | P2 | [ ] |
| 11 | En tant que développeur, je veux avoir une page d'Erreur complète | P0 | [x] |

---

## Stratégie de mise en cache

| Endpoint | Fonction | Stratégie | Raison |
|---|---|---|---|
| `newsapi.org/v2/top-headlines` | `getArticles()` | `revalidate: 3600` | Articles publics qui changent lentement — évite de re-fetch newsAPI à chaque visite, conforme au cahier des charges (*"revalider toutes les heures"*) |
| URL externe de l'article | `fetchFullContent(url)` | `revalidate: 3600` ⚠️ | Scraping HTML d'un article externe — **à corriger** en `cache: 'no-store'` car le cahier des charges dit *"la page article individuelle est toujours fraîche"* |
| `newsapi.org` — Open Graph | `generateOgImage()` | `revalidate: 86400` | Image statique par article, le contenu ne change jamais après publication |
| Lecture des favoris | `getFavorites(userId)` | Cache taguée `['favorites', userId]` | Invalidée via `revalidateTag` après chaque mutation (ajout / suppression) |
| Lecture des notes | `getNotes(userId)` | Cache taguée `['notes', userId]` | Invalidée via `revalidateTag` après chaque Server Action d'écriture |
| Profil utilisateur | `getProfile(userId)` | `cache: 'no-store'` | Données personnelles — doit toujours refléter l'état réel en base |
| Session auth NextAuth | Middleware NextAuth | Géré par NextAuth | Pas de `fetch` manuel, NextAuth gère son propre cache de session |

---

Feat :

- Regarder nextAuth pour l'authent
- Il faut également faire la même architecture que dans le powerpoint de la seance deux