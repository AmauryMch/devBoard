export type Article = {
    title: string
    description: string | null
    url: string
    urlToImage: string | null
    publishedAt: string
    source: { name: string }
    content: string | null
}

const MAX_CUSTOM_ARTICLES = 100
const customArticles: Article[] = []

export function getCustomArticles(): Article[] {
    return customArticles
}

export function insertArticle(article: Omit<Article, "content">): void {
    if (customArticles.length >= MAX_CUSTOM_ARTICLES) customArticles.pop()
    customArticles.unshift({ ...article, content: null })
}

export async function getAllArticles(): Promise<Article[]> {
    const [news, custom] = await Promise.all([getArticles(), Promise.resolve(getCustomArticles())])
    return [...custom, ...news]
}

export async function getArticles(): Promise<Article[]> {
    const apiKey = process.env.NEWS_API_KEY
    const query = encodeURIComponent(
        'programming OR "software development" OR javascript OR typescript OR "artificial intelligence" OR "machine learning" OR cybersecurity OR "cloud computing" OR devops OR kubernetes OR "mobile development"'
    )
    const res = await fetch(
        `https://newsapi.org/v2/everything?q=${query}&language=en&sortBy=publishedAt&pageSize=100&apiKey=${apiKey}`,
        { next: { revalidate: 3600 } }
    )
    if (!res.ok) throw new Error(`NewsAPI error: ${res.status}`)
    const data = await res.json()
    return data.articles ?? []
}

export async function fetchFullContent(url: string): Promise<string | null> {
    try {
        // Le contenu d'un article publié est immuable : on le met en cache longtemps
        // (24 h) pour éviter de re-scraper le site source à chaque visite.
        const res = await fetch(url, {
            headers: { "User-Agent": "Mozilla/5.0 (compatible; NewsReader/1.0)" },
            next: { revalidate: 86400 },
        })
        if (!res.ok) return null
        const html = await res.text()

        // Tente d'extraire le bloc <article> sinon le <main>
        const block =
            html.match(/<article[^>]*>([\s\S]*?)<\/article>/i)?.[1] ??
            html.match(/<main[^>]*>([\s\S]*?)<\/main>/i)?.[1] ??
            html

        const paragraphs = [...block.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
            .map((m) =>
                m[1]
                    .replace(/<[^>]+>/g, "")
                    .replace(/&nbsp;/g, " ")
                    .replace(/&amp;/g, "&")
                    .replace(/&lt;/g, "<")
                    .replace(/&gt;/g, ">")
                    .replace(/&quot;/g, '"')
                    .replace(/&#39;/g, "'")
                    .replace(/&#\d+;/g, "")
                    .replace(/\s+/g, " ")
                    .trim()
            )
            .filter((p) => p.length > 80)
            .filter((p) => !/function\s*\(|document\.|querySelector|\.setAttribute|\.getTime|let\s+\w|var\s+\w|freestar|unreplacedSlots/.test(p))

        return paragraphs.length > 0 ? paragraphs.join("\n\n") : null
    } catch {
        return null
    }
}
