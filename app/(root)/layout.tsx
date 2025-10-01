import Header from "@/components/Header";

// Note: Server-side Better Auth integration removed during Firebase migration.
// The Header component will resolve user information client-side.

const Layout = ({ children }: { children : React.ReactNode }) => {
    return (
        <main className="min-h-screen text-gray-400">
            <Header />

            <div className="container py-10">
                {children}
            </div>
        </main>
    )
}
export default Layout
