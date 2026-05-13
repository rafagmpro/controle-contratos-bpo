"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, usePathname } from "next/navigation";

export default function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function verificarUsuario() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const rotaPublica = pathname === "/login";

      if (!session && !rotaPublica) {
        router.push("/login");
        return;
      }

      if (session && pathname === "/login") {
        router.push("/dashboard");
        return;
      }

      setCarregando(false);
    }

    verificarUsuario();
  }, [pathname, router]);

  if (carregando) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Carregando...
      </div>
    );
  }

  return <>{children}</>;
}