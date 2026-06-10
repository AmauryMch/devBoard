import withAuth from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const { pathname } = req.nextUrl;
        const role = req.nextauth.token?.role as string | undefined;

        const isUsersRoute = pathname.startsWith("/dashboard/users");
        const isCreateArticleRoute = pathname.startsWith("/dashboard/articles/create");

        if (isUsersRoute && role !== "admin") {
            return NextResponse.redirect(new URL("/dashboard", req.url));
        }

        if (isCreateArticleRoute && role !== "admin" && role !== "editor") {
            return NextResponse.redirect(new URL("/dashboard", req.url));
        }

        return NextResponse.next();
    },
    {
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