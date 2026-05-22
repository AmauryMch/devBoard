This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


## stratégie de mise en cache 

Tableau de réflexions des endpoints existants et à venir 

| Endpoint                  | Méthode             | Stratégie                          | Raison                                                                                                                                                    |
| ------------------------- | ------------------- | ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Landing - aperçu articles | getArticles()       | revalidate: 3600                   | Articles publics qui changent lentement - évite de re-fetch newsAPI à chaque visite ("revalidate toutes les heures")                                      |
| URL externe de l'article  | fetchFullContent()  | revalidate: 3600             | Scraping HTML d'un article externe - à corriger en cache : "no-store" car le cahier des charges dit : "la page article individuelle est toujours fraîche" |
| newsapi.org - Open Graph  | generateOgImage()   | revalidate: 86400                  | Image Statique par article, le contenu ne change jamais après publication                                                                                 |
| Lecture des favoris       | getFavoris(userId)  | Cache taguée ['favorites', userId] | Invalidée via revalidateTag après mutation (ajout / suppresion)                                                                                           |
| Lectures des notes        | getNotes(userId)    | Cache taguée ['notes', userId]     | Invalidée via revalidateTag après chaque Server Action d'écriture                                                                                         |
| Profil Utilisateur        | getProfile(userId)  | cache : "no-store"                 | Données personnelles - doit toujours refléter l'état réel en base                                                                                         |
| Session auth nextAuth     | Middleware NextAuth | gérer par NextAuth                 | Pas de fetch manuel, Nextauth gère son propre  cache de session                                                                                           |
