import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Controle de Contratos BPO",
  description: "Sistema de controle de contratos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="bg-gray-100">

        <header className="bg-black text-white shadow">
          <div className="mx-auto flex max-w-7xl items-center gap-4 p-4">

            <Link
              href="/dashboard"
              className="rounded bg-gray-800 px-4 py-2 hover:bg-gray-700"
            >
              Dashboard
            </Link>

            <Link
              href="/clientes"
              className="rounded bg-gray-800 px-4 py-2 hover:bg-gray-700"
            >
              Clientes
            </Link>

            <Link
              href="/planos"
              className="rounded bg-gray-800 px-4 py-2 hover:bg-gray-700"
            >
              Planos
            </Link>

            <Link
              href="/contratos"
              className="rounded bg-gray-800 px-4 py-2 hover:bg-gray-700"
            >
              Contratos
            </Link>

            <Link
              href="/volumes"
              className="rounded bg-gray-800 px-4 py-2 hover:bg-gray-700"
            >
              Volumes
            </Link>

          </div>
        </header>

        <main>
          {children}
        </main>

      </body>
    </html>
  );
}