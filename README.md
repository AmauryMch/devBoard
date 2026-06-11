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

- **Framework** — Next.js 16 (App Router, Turbopack)
- **Auth** — NextAuth (GitHub OAuth + Credentials)
- **Base de données** — SQLite via Prisma ORM
- **Validation** — Zod (schémas côté serveur)
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
- Le contenu complet d'un article est scrappé à la demande puis mis en cache `revalidate: 86400` (24 h) : le contenu d'un article publié étant immuable, on évite de re-scraper le site source à chaque visite

### Server Actions
Utilisées pour les actions qui modifient des données :
- Créer un article (`src/actions/articles.ts`) — insertion en mémoire + revalidation, protégée par `requireRole("admin", "editor")`
- Ajouter / retirer un favori (`src/actions/favorites.ts`) — écriture Prisma + `revalidatePath`, protégée par `requireAuth()`
- La logique reste entièrement côté serveur

### Auth NextAuth
- Connexion via GitHub OAuth et via email / mot de passe (CredentialsProvider + bcrypt)
- Les utilisateurs GitHub sont automatiquement créés en base à la première connexion
- **Accès invité** : le dashboard est accessible sans connexion ; seules les routes sensibles exigent une session. La connexion débloque les fonctionnalités supplémentaires (favoris, paramètres)
- Le middleware (`src/middleware.ts`) gère le contrôle d'accès par route via la callback `authorized` :
  - `/dashboard/parameters` — connexion requise (tout rôle)
  - `/dashboard/articles/create` — admins et editors
  - `/dashboard/users/**` — admins uniquement
- **Protection côté serveur** : un helper partagé `src/lib/session.ts` expose `requireAuth()` et `requireRole(...roles)`, appelés dans les Server Actions pour bloquer la source (le middleware seul ne protège pas l'invocation directe d'une action)

### Optimisations mesurables
- **Bundle client allégé** : la constante `CATEGORIES` a été isolée dans `src/lib/categories.ts` (sans dépendance Zod). Avant, la page de création importait `CATEGORIES` depuis le module de validation, ce qui embarquait tout Zod côté client (~628 KB). Zod reste désormais confiné au serveur.
- **Images externes** : composant `ArticleImage` (`unoptimized` + fallback). Les vignettes viennent de sources arbitraires (NewsAPI) ; passer par l'optimiseur Next provoquait des `403` (protection anti-hotlink). Le composant charge l'image directement et affiche le nom de la source en cas d'échec.
- Mise en cache des résultats NewsAPI, évite de re-fetch à chaque visite
- Skeleton loader sur la page détail d'un article (`articleSkeleton.tsx`)
- Mises à jour optimistes (`useOptimistic`) sur le bouton favori — feedback instantané sans attendre le serveur
- Analyse de bundle disponible via `@next/bundle-analyzer` (`ANALYZE=true next build`)

---

## Features MVP

- **Accès invité** — Le dashboard et les articles sont consultables sans connexion ; la connexion débloque les favoris et les paramètres
- **Authentification** — Connexion GitHub OAuth ou email/mot de passe, déconnexion, gestion de session JWT
- **Articles** — Liste des articles récents (NewsAPI), titre / description / source / date, page détail avec contenu scrappé
- **Catégories** — Filtrer par Web, IA, Cybersécurité, Cloud, Mobile (filtrage client-side par mots-clés)
- **Administration** — Ajouter un article (réservé admin / editor), accès restreint par rôle via middleware
- **Favoris** — Ajouter / retirer un article depuis la liste ou le dashboard, persistés en base par utilisateur

---

## Backlog Initial

| # | User Story | Priorité | Fait |
|:-:|---|:-:|:-:|
| 1 | En tant que visiteur, je veux accéder au dashboard et aux articles en invité pour comprendre ce qu'est DevBoard | P0 | [x] |
| 2 | En tant que visiteur, je veux me connecter avec GitHub pour accéder au contenu complet | P0 | [x] |
| 3 | En tant que visiteur (invité ou connecté), je veux voir la liste complète des articles de veille | P0 | [x] |
| 4 | En tant que visiteur (invité ou connecté), je veux filtrer les articles par catégorie (Web, IA, Cybersécurité, Cloud, Mobile) | P2 | [x] |
| 5 | En tant que visiteur (invité ou connecté), je veux voir le détail d'un article | P0 | [x] |
| 6 | En tant qu'utilisateur connecté, je veux ajouter un article en favori et le retrouver dans ma liste | P1 | [x] |
| 7 | En tant qu'utilisateur connecté, je veux écrire une note sur un article pour garder une trace de ma veille | P1 | [ ] |
| 8 | En tant qu'utilisateur connecté, je veux mettre à jour mon profil | P1 | [ ] |
| 9 | En tant qu'utilisateur, je veux que le partage d'un article génère une preview propre | P2 | [ ] |
| 10 | En tant que développeur, je veux des scores Lighthouse > 90 documentés dans le README | P2 | [ ] |
| 11 | En tant que développeur, je veux avoir une page d'Erreur complète | P0 | [x] |

---

## Stratégie de mise en cache

| Endpoint / Donnée | Fonction | Stratégie | Raison |
|---|---|---|---|
| `newsapi.org/v2/top-headlines` | `getArticles()` | `revalidate: 3600` | Articles publics qui changent lentement — évite de re-fetch NewsAPI à chaque visite |
| URL externe de l'article | `fetchFullContent(url)` | `revalidate: 86400` | Scraping HTML — contenu immuable une fois publié, cache long pour ne pas re-scraper le site source à chaque visite |
| Favoris utilisateur | `getUserFavorites()` | `revalidatePath('/dashboard')` | Invalidation de la page après chaque ajout / suppression via Server Action |
| Session auth | Middleware NextAuth | Géré par NextAuth (JWT) | Pas de `fetch` manuel, NextAuth gère son propre cache de session |