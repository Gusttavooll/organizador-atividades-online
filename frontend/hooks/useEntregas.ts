"use client";

import { useEffect, useState } from "react";
import { listarEntregas } from "@/lib/api/entregas";
import { mensagemDeErro } from "@/lib/utils/erro";
import type { Entrega, FiltrosEntrega } from "@/types/entrega";

interface UseEntregasResult {
  entregas: Entrega[];
  carregando: boolean;
  erro: string | null;
  atualizarEntregaLocal: (entregaAtualizada: Entrega) => void;
}

export function useEntregas(filtros: FiltrosEntrega): UseEntregasResult {
  const [entregas, setEntregas] = useState<Entrega[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    let cancelado = false;

    setCarregando(true);
    setErro(null);

    listarEntregas(filtros)
      .then((resultado) => {
        if (!cancelado) setEntregas(resultado);
      })
      .catch((erro: unknown) => {
        if (!cancelado) setErro(mensagemDeErro(erro, "Não foi possível carregar as entregas."));
      })
      .finally(() => {
        if (!cancelado) setCarregando(false);
      });

    return () => {
      cancelado = true;
    };
    // Depende dos campos primitivos, não do objeto `filtros` — ele é recriado
    // a cada render do componente pai e isso causaria um novo fetch sempre.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtros.turmaId, filtros.disciplinaId, filtros.status]);

  function atualizarEntregaLocal(entregaAtualizada: Entrega) {
    setEntregas((atual) =>
      atual.map((entrega) => (entrega.id === entregaAtualizada.id ? entregaAtualizada : entrega)),
    );
  }

  return { entregas, carregando, erro, atualizarEntregaLocal };
}
