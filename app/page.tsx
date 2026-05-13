import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-4xl rounded-xl bg-white p-8 shadow">
        <h1 className="mb-4 text-3xl font-bold text-gray-900">
          Controle de Contratos BPO
        </h1>

        <p className="mb-6 text-gray-700">
          Sistema interno para controle de clientes, contratos, planos e volume
          de lançamentos financeiros.
        </p>

        <Link
          href="/clientes"
          className="rounded bg-black px-5 py-3 text-white"
        >
          Acessar clientes
        </Link>
      </div>
    </main>
  );
}