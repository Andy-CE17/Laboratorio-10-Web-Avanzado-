"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IoChevronBack, IoChevronForward, IoClose, IoLocation, IoSearch } from "react-icons/io5";
import type { Character, CharacterListResponse } from "@/lib/rick-and-morty";

interface CharacterExplorerProps {
  initialCharacters: Character[];
  initialTotal: number;
  initialQuery?: string;
  mode?: "catalog" | "search";
}

const statusOptions = ["", "Alive", "Dead", "unknown"];
const genderOptions = ["", "Female", "Male", "Genderless", "unknown"];
const textStatus = (value: string) => value === "Alive" ? "Vivo" : value === "Dead" ? "Muerto" : "Desconocido";
const textGender = (value: string) => ({ Female: "Femenino", Male: "Masculino", Genderless: "Sin género", unknown: "Desconocido" })[value as Character["gender"]];

export default function CharacterExplorer({ initialCharacters, initialTotal, initialQuery = "", mode = "catalog" }: CharacterExplorerProps) {
  const [name, setName] = useState(initialQuery);
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [gender, setGender] = useState("");
  const [page, setPage] = useState(1);
  const [characters, setCharacters] = useState(initialCharacters);
  const [total, setTotal] = useState(initialTotal);
  const [totalPages, setTotalPages] = useState(Math.ceil(initialTotal / 20));
  const [loading, setLoading] = useState(Boolean(initialQuery));
  const [empty, setEmpty] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams({ page: String(page) });
    if (name.trim()) params.set("name", name.trim());
    if (status) params.set("status", status);
    if (type.trim()) params.set("type", type.trim());
    if (gender) params.set("gender", gender);
    const hasFilters = Boolean(name.trim() || status || type.trim() || gender);
    if (!hasFilters && page === 1) {
      const reset = window.setTimeout(() => { setCharacters(initialCharacters); setTotal(initialTotal); setTotalPages(Math.ceil(initialTotal / 20)); setEmpty(false); setLoading(false); }, 0);
      return () => window.clearTimeout(reset);
    }
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true); setEmpty(false);
      try {
        const response = await fetch(`https://rickandmortyapi.com/api/character/?${params}`, { signal: controller.signal });
        if (response.status === 404) { setCharacters([]); setTotal(0); setTotalPages(0); setEmpty(true); return; }
        if (!response.ok) throw new Error("Búsqueda no disponible");
        const data: CharacterListResponse = await response.json();
        setCharacters(data.results); setTotal(data.info.count); setTotalPages(data.info.pages);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setCharacters([]); setTotal(0); setTotalPages(0); setEmpty(true);
      } finally { if (!controller.signal.aborted) setLoading(false); }
    }, 350);
    return () => { controller.abort(); window.clearTimeout(timer); };
  }, [gender, initialCharacters, initialTotal, name, page, status, type]);

  function resetPage(callback: () => void) { callback(); setPage(1); }
  const clear = () => { setName(""); setStatus(""); setType(""); setGender(""); setPage(1); };
  const active = Boolean(name || status || type || gender);
  const pageItems = Array.from({ length: Math.min(5, totalPages) }, (_, index) => Math.min(Math.max(1, page - 2) + index, totalPages));

  return (
    <section id="explorar" className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10 lg:py-16">
      <div className={mode === "search" ? "mx-auto max-w-3xl text-center" : ""}>
        <p className="text-xs font-black uppercase tracking-[0.24em] text-[#39f5a0]">{mode === "search" ? "Búsqueda interdimensional" : "Catálogo de personajes"}</p>
        <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl">{mode === "search" ? "Busca personajes" : "Explora los personajes"}</h2>
        <p className="mt-2 text-sm text-[#94a3b8]">{mode === "search" ? "Encuentra tus personajes favoritos filtrando por nombre, estado, tipo y género." : loading ? "Actualizando resultados..." : `${total.toLocaleString("es-PE")} personajes encontrados`}</p>
      </div>

      <div className={`mt-7 rounded-xl border border-[#203542] bg-[#0b1923]/90 p-4 shadow-[0_18px_42px_rgba(0,0,0,0.22)] ${mode === "search" ? "mx-auto max-w-5xl" : ""}`}>
        <label className="flex h-12 items-center gap-3 rounded-lg border border-[#2b4a59] bg-[#061018] px-4 text-[#65ff82] focus-within:border-[#39f5a0]"><IoSearch size={18} /><input value={name} onChange={(event) => resetPage(() => setName(event.target.value))} placeholder="Buscar por nombre..." className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-[#94a3b8]" />{name && <button onClick={() => resetPage(() => setName(""))} type="button" className="text-slate-400 hover:text-white"><IoClose size={18} /></button>}</label>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <label className="text-xs font-bold text-slate-300">Estado<select value={status} onChange={(event) => resetPage(() => setStatus(event.target.value))} className="mt-1.5 h-10 w-full rounded-lg border border-[#203542] bg-[#111f2b] px-3 text-sm font-medium text-white outline-none focus:border-[#39f5a0] [&>option]:bg-[#111f2b]"><option value="">Todos</option>{statusOptions.slice(1).map((value) => <option key={value} value={value}>{textStatus(value)}</option>)}</select></label>
          <label className="text-xs font-bold text-slate-300">Tipo<input value={type} onChange={(event) => resetPage(() => setType(event.target.value))} placeholder="Todos" className="mt-1.5 h-10 w-full rounded-lg border border-[#203542] bg-[#111f2b] px-3 text-sm font-medium text-white outline-none placeholder:text-slate-500 focus:border-[#39f5a0]" /></label>
          <label className="text-xs font-bold text-slate-300">Género<select value={gender} onChange={(event) => resetPage(() => setGender(event.target.value))} className="mt-1.5 h-10 w-full rounded-lg border border-[#203542] bg-[#111f2b] px-3 text-sm font-medium text-white outline-none focus:border-[#39f5a0] [&>option]:bg-[#111f2b]"><option value="">Todos</option>{genderOptions.slice(1).map((value) => <option key={value} value={value}>{textGender(value)}</option>)}</select></label>
        </div>
        {active && <button type="button" onClick={clear} className="mt-3 rounded-lg border border-[#39f5a0]/40 px-3 py-2 text-xs font-bold text-[#65ff82] transition hover:bg-[#39f5a0] hover:text-[#061018]">Limpiar filtros</button>}
      </div>

      {!loading && !empty && <div className="mt-5 flex items-center justify-between text-sm"><p className="font-bold text-white">{active ? `Resultados para “${name || "filtros seleccionados"}”` : "Personajes destacados"}</p><p className="text-[#94a3b8]">{total} resultados</p></div>}
      {empty ? <div className="mt-10 rounded-xl border border-dashed border-[#2b5664] bg-[#0b1923]/50 px-6 py-16 text-center"><p className="text-xl font-bold text-white">No encontramos personajes con estos filtros.</p><button type="button" onClick={clear} className="mt-4 font-bold text-[#65ff82]">Restablecer búsqueda</button></div> :
        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {loading ? Array.from({ length: 10 }).map((_, index) => <div key={index} className="overflow-hidden rounded-xl border border-[#203542] bg-[#111f2b]"><div className="aspect-[1/1.08] animate-pulse bg-[#203542]" /><div className="space-y-2 p-3"><div className="h-3 w-3/4 animate-pulse rounded bg-[#203542]" /><div className="h-2 w-1/2 animate-pulse rounded bg-[#203542]" /></div></div>) : characters.map((character) => <Link key={character.id} href={`/personajes/${character.id}`} className="group overflow-hidden rounded-xl border border-[#203542] bg-[#111f2b] shadow-lg shadow-black/10 transition duration-300 hover:-translate-y-1 hover:border-[#39f5a0]/75 hover:shadow-[0_15px_34px_rgba(38,245,156,0.12)]"><div className="relative aspect-[1/1.04] overflow-hidden"><Image src={character.image} alt={character.name} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw" className="object-cover transition duration-500 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-[#061018]/65 via-transparent to-transparent" /><span className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full border border-white/20 bg-black/35 text-[10px] font-black text-white/80">{String(character.id).padStart(2, "0")}</span></div><div className="p-3"><h3 className="truncate text-sm font-black text-white group-hover:text-[#65ff82]">{character.name}</h3><p className="mt-1 flex items-center gap-1.5 truncate text-xs text-[#94a3b8]"><span className={`h-2 w-2 rounded-full ${character.status === "Alive" ? "bg-[#39f5a0]" : character.status === "Dead" ? "bg-rose-500" : "bg-slate-400"}`} />{textStatus(character.status)} · {character.species}</p><p className="mt-1 flex items-center gap-1 truncate text-[11px] text-slate-500"><IoLocation size={11} /> {character.location.name}</p></div></Link>)}
        </div>}
      {!loading && !empty && totalPages > 1 && <nav className="mt-9 flex items-center justify-center gap-2" aria-label="Paginación"><button type="button" disabled={page === 1} onClick={() => setPage(page - 1)} className="grid h-8 w-8 place-items-center rounded-md border border-[#203542] text-white disabled:opacity-30"><IoChevronBack /></button>{pageItems.map((item) => <button key={item} type="button" onClick={() => setPage(item)} className={`h-8 min-w-8 rounded-md px-2 text-xs font-bold transition ${item === page ? "bg-[#39f5a0] text-[#061018]" : "text-slate-300 hover:bg-[#111f2b]"}`}>{item}</button>)}{totalPages > 5 && <span className="px-1 text-slate-500">…</span>}<button type="button" disabled={page === totalPages} onClick={() => setPage(page + 1)} className="grid h-8 w-8 place-items-center rounded-md border border-[#203542] text-white disabled:opacity-30"><IoChevronForward /></button></nav>}
    </section>
  );
}
