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
- **Auth** — NextAuth (GitHub OAuth)
- **Data** — NewsAPI
- **Style** — Tailwind CSS

---

## Contraintes techniques

### Layouts imbriqués
Architecture en 3 niveaux :
- Le layout public affiche un header avec un CTA "Se connecter" et un footer
- Le layout privé ajoute une sidebar de navigation et vérifie la session au niveau du layout

### Data Fetching
- Les articles proviennent de l'API NewsAPI (articles récupérés par catégories)
- La landing affiche les derniers articles avec du cache (revalidation toutes les heures)
- La page article individuelle est toujours fraîche

### Server Actions
Utilisées pour les actions qui modifient des données côté utilisateur :
- Créer et enregistrer une note sur un article lu
- Mettre à jour son profil
- La logique reste côté serveur

### Route Handler
- Un endpoint dédié pour générer les images Open Graph de chaque article
- Récupère les données NewsAPI et génère un preview propre pour le partage

### Auth NextAuth
- Connexion via GitHub OAuth
- Un middleware protège toutes les routes privées
- Redirection automatique vers le login si non connecté

### Optimisations mesurables
- Images des articles optimisées via `next/image`
- Mise en cache des résultats NewsAPI, évite de re-fetch à chaque visite
- Skeleton loaders sur les listes d'articles
- ISR sur la landing, limite les appels à l'API externe

---

## Features MVP

- **Authentification** — Inscription, connexion / déconnexion, gestion de session
- **Articles** — Liste des articles récents, titre / description / catégorie / source / date, page détail
- **Catégories** — Filtrer par Web, IA, Cybersécurité, Cloud, Mobile
- **Administration** — Ajouter, modifier, supprimer un article
- **Favoris** — Ajouter / retirer un article, consulter sa liste

---

## Backlog Initial

| # | User Story | Priorité |
|:-:|---|:-:|
| 1 | En tant que visiteur, je veux voir la landing avec quelques articles pour comprendre ce qu'est DevBoard | P0 |
| 2 | En tant que visiteur, je veux me connecter avec GitHub pour accéder au contenu complet | P0 |
| 3 | En tant qu'utilisateur connecté, je veux voir la liste complète des articles de veille | P0 |
| 4 | En tant qu'utilisateur connecté, je veux filtrer les articles par catégorie (Web, IA, Cybersécurité, Cloud, Mobile) | P0 |
| 5 | En tant qu'utilisateur connecté, je veux voir le détail d'un article | P0 |
| 6 | En tant qu'utilisateur connecté, je veux ajouter un article en favori et le retrouver dans ma liste | P1 |
| 7 | En tant qu'utilisateur connecté, je veux écrire une note sur un article pour garder une trace de ma veille | P1 |
| 8 | En tant qu'utilisateur connecté, je veux mettre à jour mon profil | P1 |
| 9 | En tant qu'utilisateur, je veux que le partage d'un article génère une preview propre | P2 |
| 10 | En tant que développeur, je veux des scores Lighthouse > 90 documentés dans le README | P2 |

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