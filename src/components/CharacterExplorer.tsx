"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { IoArrowForward, IoChevronBack, IoChevronForward, IoClose, IoGrid, IoHeartOutline, IoList, IoLocation, IoPersonOutline, IoPulse, IoRefresh, IoSearch } from "react-icons/io5";
import type { Character, CharacterListResponse } from "@/lib/rick-and-morty";

interface CharacterExplorerProps { initialCharacters: Character[]; initialTotal: number; initialQuery?: string; mode?: "catalog" | "search"; }
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
  const [view, setView] = useState<"grid" | "list">("grid");
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

  return <section id="explorar" className="mx-auto w-full max-w-[1680px] px-4 py-12 sm:px-7 lg:px-10 lg:py-16">
    <header className="text-center">{mode === "search" ? <><p className="text-xs font-black uppercase tracking-[0.26em] text-[#39f5a0]">Búsqueda interdimensional</p><h2 className="mt-3 text-4xl font-black tracking-[-0.055em] text-white sm:text-5xl">Busca personajes</h2><p className="mx-auto mt-3 max-w-2xl text-sm text-[#94a3b8]">Encuentra tus personajes favoritos filtrando por nombre, estado, tipo y género.</p></> : <h2 className="text-4xl font-black tracking-[-0.055em] text-white drop-shadow-[0_4px_18px_rgba(255,255,255,0.08)] sm:text-5xl lg:text-6xl"><span>Catálogo de </span><span className="text-[#65ff9a] drop-shadow-[0_0_20px_rgba(57,245,160,0.28)]">personajes</span></h2>}</header>

    <div className="mt-8 grid gap-3 rounded-[1.4rem] border border-[#39f5a0]/70 bg-[#06141d]/95 p-4 shadow-[0_0_30px_rgba(57,245,160,0.15),inset_0_0_24px_rgba(57,245,160,0.04)] backdrop-blur lg:grid-cols-[1.55fr_repeat(3,minmax(155px,0.62fr))_auto] lg:items-center">
      <label className="flex h-16 items-center gap-3 rounded-2xl border border-[#39f5a0]/75 bg-[#071923] px-5 text-[#65ff82] shadow-[0_0_18px_rgba(57,245,160,0.13)] focus-within:border-[#65ff82] focus-within:shadow-[0_0_24px_rgba(57,245,160,0.24)]"><IoSearch size={25} /><input value={name} onChange={(event) => resetPage(() => setName(event.target.value))} placeholder="Buscar personaje..." className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-[#94a3b8]" />{name && <button onClick={() => resetPage(() => setName(""))} type="button"><IoClose size={18} /></button>}<span className="hidden rounded-md bg-[#142734] px-2.5 py-1.5 text-[10px] font-black text-slate-400 sm:inline">Ctrl K</span></label>
      <Filter label="Estado" icon={<IoPulse />}><select value={status} onChange={(event) => resetPage(() => setStatus(event.target.value))} className="filter-control"><option value="">Todos</option>{statusOptions.slice(1).map((value) => <option key={value} value={value}>{textStatus(value)}</option>)}</select></Filter>
      <Filter label="Tipo" icon={<IoLocation />}><input value={type} onChange={(event) => resetPage(() => setType(event.target.value))} placeholder="Todos" className="filter-control" /></Filter>
      <Filter label="Género" icon={<IoPersonOutline />}><select value={gender} onChange={(event) => resetPage(() => setGender(event.target.value))} className="filter-control"><option value="">Todos</option>{genderOptions.slice(1).map((value) => <option key={value} value={value}>{textGender(value)}</option>)}</select></Filter>
      <button type="button" onClick={clear} disabled={!active} className="flex h-16 items-center justify-center gap-2 rounded-2xl border border-[#39f5a0]/75 bg-[#071923] px-5 text-xs font-black text-[#65ff82] transition enabled:shadow-[0_0_18px_rgba(57,245,160,0.14)] enabled:hover:bg-[#39f5a0] enabled:hover:text-[#061018] disabled:cursor-not-allowed disabled:opacity-45"><IoRefresh size={20} /> Limpiar filtros</button>
    </div>

    {!loading && !empty && <div className="mt-5 flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-slate-300"><strong className="mr-1 text-xl font-black text-[#39f5a0]">{total.toLocaleString("es-PE")}</strong> personajes encontrados</p><div className="flex overflow-hidden rounded-xl border border-[#203542] bg-[#0b1923]"><button type="button" onClick={() => setView("grid")} className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold transition ${view === "grid" ? "bg-[#39f5a0] text-[#061018]" : "text-slate-400 hover:text-white"}`}><IoGrid /> Grid</button><button type="button" onClick={() => setView("list")} className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold transition ${view === "list" ? "bg-[#39f5a0] text-[#061018]" : "text-slate-400 hover:text-white"}`}><IoList /> Lista</button></div></div>}

    {empty ? <div className="mt-10 rounded-2xl border border-dashed border-[#2b5664] bg-[#0b1923]/50 px-6 py-16 text-center"><p className="text-xl font-bold text-white">No encontramos personajes con estos filtros.</p><button type="button" onClick={clear} className="mt-4 font-bold text-[#65ff82]">Restablecer búsqueda</button></div> : <div className={`mt-5 grid gap-4 ${view === "grid" ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6" : "grid-cols-1 lg:grid-cols-2"}`}>
      {loading ? Array.from({ length: view === "grid" ? 12 : 6 }).map((_, index) => <Skeleton key={index} view={view} />) : characters.map((character) => <CharacterCard key={character.id} character={character} view={view} />)}
    </div>}

    {!loading && !empty && totalPages > 1 && <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Paginación"><button type="button" disabled={page === 1} onClick={() => setPage(page - 1)} className="grid h-9 w-9 place-items-center rounded-lg border border-[#203542] text-white transition hover:border-[#39f5a0] disabled:opacity-30"><IoChevronBack /></button>{pageItems.map((item) => <button key={item} type="button" onClick={() => setPage(item)} className={`h-9 min-w-9 rounded-lg px-2 text-xs font-bold transition ${item === page ? "bg-[#39f5a0] text-[#061018]" : "border border-[#203542] text-slate-300 hover:border-[#39f5a0]"}`}>{item}</button>)}{totalPages > 5 && <span className="px-1 text-slate-500">… {totalPages}</span>}<button type="button" disabled={page === totalPages} onClick={() => setPage(page + 1)} className="grid h-9 w-9 place-items-center rounded-lg border border-[#203542] text-white transition hover:border-[#39f5a0] disabled:opacity-30"><IoChevronForward /></button></nav>}
  </section>;
}

function Filter({ label, icon, children }: { label: string; icon: ReactNode; children: ReactNode }) { return <label className="flex h-16 items-center gap-3 rounded-2xl border border-[#203542] bg-[#0b1923] px-4 transition focus-within:border-[#39f5a0]/75"><span className="text-[#39f5a0] [&>svg]:h-5 [&>svg]:w-5">{icon}</span><span className="min-w-0 flex-1"><span className="block text-[11px] font-bold text-[#94a3b8]">{label}</span>{children}</span></label>; }
function Skeleton({ view }: { view: "grid" | "list" }) { return <div className={`animate-pulse overflow-hidden rounded-xl border border-[#203542] bg-[#111f2b] ${view === "list" ? "flex" : ""}`}><div className={`${view === "list" ? "h-36 w-40 shrink-0" : "aspect-[1/1.05]"} bg-[#203542]`} /><div className="flex-1 space-y-3 p-4"><div className="h-3 w-3/4 rounded bg-[#203542]" /><div className="h-2 w-1/2 rounded bg-[#203542]" /><div className="h-2 w-2/3 rounded bg-[#203542]" /></div></div>; }
function CharacterCard({ character, view }: { character: Character; view: "grid" | "list" }) { return <Link href={`/personajes/${character.id}`} className={`group overflow-hidden rounded-xl border border-[#203542] bg-[#0b1923] shadow-lg shadow-black/15 transition duration-300 hover:-translate-y-1 hover:border-[#39f5a0]/80 hover:shadow-[0_14px_34px_rgba(38,245,156,0.14)] ${view === "list" ? "flex min-h-40" : ""}`}><div className={`relative overflow-hidden ${view === "list" ? "w-40 shrink-0" : "aspect-[1/1.03]"}`}><Image src={character.image} alt={character.name} fill sizes="(max-width:640px) 50vw, (max-width:1280px) 25vw, 16vw" className="object-cover transition duration-500 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-[#061018]/75 via-transparent to-transparent" /><span className="absolute left-2 top-2 rounded-md border border-[#39f5a0]/50 bg-[#061018]/75 px-2 py-1 text-[10px] font-black text-[#65ff82]">#{String(character.id).padStart(3, "0")}</span><span className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full border border-white/20 bg-[#061018]/70 text-white"><IoHeartOutline size={16} /></span></div><div className="flex min-w-0 flex-1 flex-col p-3.5"><h3 className="truncate text-base font-black text-white transition group-hover:text-[#65ff82]">{character.name}</h3><p className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-300"><span className={`h-2.5 w-2.5 rounded-full ${character.status === "Alive" ? "bg-[#39f5a0]" : character.status === "Dead" ? "bg-rose-500" : "bg-slate-400"}`} />{textStatus(character.status)}</p><div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-[#94a3b8]"><span className="flex items-center gap-1"><IoLocation />{character.species}</span><span className="flex items-center gap-1"><IoPersonOutline />{textGender(character.gender)}</span></div>{view === "list" && <p className="mt-2 truncate text-xs text-slate-500">Ubicación: {character.location.name}</p>}<span className="mt-auto self-end grid h-8 w-8 place-items-center rounded-full border border-[#39f5a0]/60 text-[#65ff82] transition group-hover:bg-[#39f5a0] group-hover:text-[#061018]"><IoArrowForward size={15} /></span></div></Link>; }
