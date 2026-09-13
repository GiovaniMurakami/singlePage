import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Shell } from "../components/ui/Shell";
import { Seo } from "../components/Seo";
import { mensagemErro, verificarEmail } from "../services/backendApi";

export function VerificarEmailPage() {
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const [estado, setEstado] = useState(token ? "enviando" : "faltando");
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (!token) return undefined;
    let cancelado = false;
    verificarEmail(token)
      .then(() => { if (!cancelado) setEstado("ok"); })
      .catch((error) => {
        if (cancelado) return;
        setEstado("erro");
        setErro(mensagemErro(error, "Link inválido ou expirado."));
      });
    return () => { cancelado = true; };
  }, [token]);

  return (
    <Shell>
      <Seo title="Confirmar e-mail" path="/verificar-email" robots="noindex,nofollow" />
      <div className="mx-auto mt-20 max-w-md rounded-[2rem] bg-paper-2 p-8 shadow-sm ring-1 ring-line">
        <h1 className="font-display text-4xl">Confirmar e-mail</h1>
        {estado === "enviando" && <p className="mt-4 text-sm text-ink-soft">Confirmando…</p>}
        {estado === "ok" && <p className="mt-4 text-sm">E-mail confirmado. Já pode usar a conta normalmente.</p>}
        {estado === "faltando" && <p className="mt-4 text-sm text-ink-soft">Abra o link que chegou no seu e-mail.</p>}
        {estado === "erro" && <p className="mt-4 text-sm text-red-500">{erro}</p>}
        <p className="mt-6 text-sm"><Link to="/entrar" className="text-ink">Entrar</Link></p>
      </div>
    </Shell>
  );
}
