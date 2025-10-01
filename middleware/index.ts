import { NextRequest, NextResponse } from "next/server";

// Temporary permissive middleware while migrating from Better Auth to Firebase.
export async function middleware(request: NextRequest) {
    // Temporary no-op read to acknowledge the request param during migration.
    void request;
    // TODO: validate Firebase ID token from cookies/headers to gate access to protected routes.
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|sign-in|sign-up|assets).*)',
    ],
};
