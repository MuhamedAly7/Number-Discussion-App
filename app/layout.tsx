import "./globals.css";
import Link from "next/link";
import { getServerSession } from "next-auth";
import LogoutButton from "@/components/LogoutButton";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <nav className="bg-white shadow-sm p-4">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <Link href="/" className="text-xl font-bold text-purple-600">
              Number Discussion App
            </Link>
            <div className="flex gap-4 items-center">
              {session ? (
                <>
                  <span className="text-sm text-gray-700">
                    Hi, {session.user?.name}
                  </span>
                  <LogoutButton />
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-sm text-purple-600 hover:underline"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="text-sm text-purple-600 hover:underline"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>
        <main className="max-w-4xl mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}
