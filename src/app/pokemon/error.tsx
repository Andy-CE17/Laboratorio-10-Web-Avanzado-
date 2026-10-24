"use client";

import { useEffect } from "react";
import Link from "next/link";
import { IoRefresh, IoWarning } from "react-icons/io5";

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-[calc(100vh-72px)] items-center justify-center p-6">
      <section className="w-full max-w-lg rounded-3xl border border-white/15 bg-[#121326]/90 p-8 text-center shadow-2xl shadow-black/40">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-400/15 text-amber-300">
          <IoWarning size={34} />
        </span>
        <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-amber-200">
          Error de carga
        </p>
        <h1 className="mt-3 text-3xl font-black text-white">
          No se pudo mostrar esta sección
        </h1>
        <p className="mt-3 text-sm leading-6 text-white/65">
          Ocurrió un problema inesperado. Puedes volver a intentar cargar la información.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => retry()}
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-violet-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-violet-400"
          >
            <IoRefresh size={18} /> Reintentar
          </button>
          <Link
            href="/pokemon"
            className="rounded-xl border border-white/15 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
          >
            Volver a la Pokédex
          </Link>
        </div>
      </section>
    </main>
  );
}
