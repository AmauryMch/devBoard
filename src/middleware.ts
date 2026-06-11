import withAuth from "next-auth/middleware";
import { NextResponse } from "next/server";

// Routes réservées aux utilisateurs connectés (rôle "user" minimum)
const authRoutes = ["/dashboard/parameters", "/api/favorites"];
// Routes réservées aux administrateurs
const adminRoutes = ["/dashboard/users"];
// Routes réservées aux users et administrateurs
const editorRoutes = ["/dashboard/articles/create"];

export default withAuth(
    function middleware(req) {
        const { pathname } = req.nextUrl;
        const role = req.nextauth.token?.role as string | undefined;

        const isAdminRoute = adminRoutes.some((r) => pathname.startsWith(r));
        const isEditorRoute = editorRoutes.some((r) => pathname.startsWith(r));

        if (isAdminRoute && role !== "admin") {
            return NextResponse.redirect(new URL("/dashboard", req.url));
        }

        if (isEditorRoute && role !== "admin" && role !== "editor") {
            return NextResponse.redirect(new URL("/dashboard", req.url));
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            // Détermine si la requête peut continuer. Sans connexion requise,
            // l'accès invité est autorisé ; sinon un token est exigé (redirection /login).
            authorized: ({ token, req }) => {
                const { pathname } = req.nextUrl;
                const requiresAuth = [...authRoutes, ...adminRoutes, ...editorRoutes].some(
                    (r) => pathname.startsWith(r)
                );
                if (!requiresAuth) return true;
                return token != null;
            },
        },
        pages: {
            signIn: "/login",
        },
    }
);

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/api/((?!auth).*)',
    ],
}
