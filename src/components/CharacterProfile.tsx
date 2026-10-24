"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { IoArrowBack, IoCalendar, IoEarth, IoLink, IoLocation, IoPerson, IoPulse, IoTv } from "react-icons/io5";
import type { Character, Episode } from "@/lib/rick-and-morty";

export default function CharacterProfile({ id }: { id: string }) {
  const [character, setCharacter] = useState<Character | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    async function loadProfile() {
      try {
        const response = await fetch(`https://rickandmortyapi.com/api/character/${id}`, { signal: controller.signal });
        if (!response.ok) throw new Error("Personaje no encontrado");
        const profile: Character = await response.json();
        setCharacter(profile);
        const episodeIds = profile.episode.map((url) => url.split("/").pop()).filter(Boolean).join(",");
        if (episodeIds) {
          const episodeResponse = await fetch(`https://rickandmortyapi.com/api/episode/${episodeIds}`, { signal: controller.signal });
          if (episodeResponse.ok) {
            const data: Episode | Episode[] = await episodeResponse.json();
            setEpisodes(Array.isArray(data) ? data : [data]);
          }
        }
      } catch (loadError) {
        if (!(loadError instanceof DOMException && loadError.name === "AbortError")) setError(true);
      }
    }
    loadProfile();
    return () => controller.abort();
  }, [id]);

  if (error) return <ProfileError />;
  if (!character) return <ProfileSkeleton />;
  const createdAt = new Intl.DateTimeFormat("es-PE", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(character.created));

  return <main className="min-h-screen bg-[#061018] text-white"><Header /><section className="mx-auto max-w-7xl px-5 py-7 sm:px-8 lg:px-10"><Link href="/#explorar" className="inline-flex items-center gap-2 rounded-lg border border-[#2b5664] bg-[#0b2230] px-3 py-2 text-sm font-bold text-[#c8ffe1] transition hover:border-[#39f5a0]"><IoArrowBack size={17} /> Volver</Link><p className="mt-5 text-xs text-[#94a3b8]">Personajes <span className="px-2 text-[#39f5a0]">›</span> <strong className="text-white">{character.name}</strong></p><div className="mt-4 grid gap-5 xl:grid-cols-[0.72fr_1.12fr_0.88fr]"><aside className="rounded-2xl border border-[#2b5664] bg-[#0b1923] p-4 shadow-[0_16px_45px_rgba(0,0,0,0.22)]"><div className="portal-frame relative aspect-square overflow-hidden rounded-xl border-2 border-[#39f5a0]"><Image src={character.image} alt={character.name} fill unoptimized className="object-cover" sizes="(max-width: 1280px) 100vw, 30vw" /><div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_48%,rgba(24,255,118,0.24))]" /></div><div className="mt-4 flex items-center justify-between rounded-xl border border-[#203542] bg-[#061018] p-3"><span className="text-xs font-bold text-[#94a3b8]">ID del personaje</span><span className="font-black text-[#65ff82]">#{String(character.id).padStart(3, "0")}</span></div></aside><section className="rounded-2xl border border-[#203542] bg-[#0b1923] p-5 sm:p-6"><div className="flex flex-wrap items-center gap-3"><h1 className="text-4xl font-black tracking-[-0.05em] text-white">{character.name}</h1><span className={`rounded-full px-3 py-1 text-xs font-black ${character.status === "Alive" ? "bg-[#39f5a0] text-[#062018]" : character.status === "Dead" ? "bg-rose-500" : "bg-slate-400 text-[#061018]"}`}>{statusText(character.status)}</span></div><p className="mt-2 flex items-center gap-2 text-sm text-[#94a3b8]"><span className="h-2 w-2 rounded-full bg-[#39f5a0]" />{character.species}</p><p className="mt-5 max-w-xl text-sm leading-6 text-slate-300">Registro del archivo interdimensional con información disponible desde la API oficial.</p><div className="mt-5 grid grid-cols-3 gap-2"><DataMini icon={<IoPerson />} label="Especie" value={character.species} /><DataMini icon={<IoPerson />} label="Género" value={character.gender} /><DataMini icon={<IoPulse />} label="Tipo" value={character.type || "Sin tipo"} /></div><InfoCard title="Información general"><InfoRow label="Estado" value={statusText(character.status)} /><InfoRow label="Especie" value={character.species} /><InfoRow label="Tipo" value={character.type || "Sin tipo"} /><InfoRow label="Género" value={character.gender} /></InfoCard><InfoCard title="Ubicación y origen"><InfoRow icon={<IoEarth />} label="Origen" value={character.origin.name} /><InfoRow icon={<IoLocation />} label="Ubicación actual" value={character.location.name} /></InfoCard><div className="mt-3 rounded-xl border border-[#203542] bg-[#061018] p-4"><p className="text-sm font-black">Datos del registro</p><div className="mt-3 grid gap-3 text-xs text-[#94a3b8] sm:grid-cols-2"><span className="flex items-center gap-2"><IoCalendar className="text-[#39f5a0]" /> Creado: {createdAt}</span><span className="flex items-center gap-2"><IoTv className="text-[#39f5a0]" /> {character.episode.length} episodios</span><a href={character.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[#65ff82] sm:col-span-2"><IoLink /> Consultar registro en la API</a></div></div></section><aside className="overflow-hidden rounded-2xl border border-[#39f5a0]/45 bg-[#0b1923] p-4 shadow-[0_16px_45px_rgba(0,0,0,0.22)]"><div className="flex items-center justify-between"><div><h2 className="font-black">Apariciones</h2><p className="mt-1 text-xs text-[#94a3b8]">{character.episode.length} episodios registrados</p></div><IoTv className="text-[#39f5a0]" size={22} /></div><div className="mt-4 max-h-[32rem] space-y-2 overflow-y-auto pr-1">{episodes.length ? episodes.map((episode) => <a key={episode.id} href={episode.url} target="_blank" rel="noreferrer" className="group flex items-center gap-3 rounded-lg border border-[#203542] bg-[#102431] p-2.5 transition hover:border-[#39f5a0]/65"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-[#163a40] text-[10px] font-black text-[#65ff82]">{episode.episode}</span><span className="min-w-0 flex-1"><strong className="block truncate text-xs text-white">{episode.name}</strong><small className="text-[11px] text-[#94a3b8]">{episode.air_date}</small></span></a>) : <EpisodeSkeleton />}</div></aside></div></section></main>;
}

function Header() { return <header className="border-b border-[#203542] bg-[#07151f]"><nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-10"><Link href="/" className="relative block h-8 w-32" aria-label="Inicio de Rick and Morty"><Image src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Rick_and_Morty.svg/1280px-Rick_and_Morty.svg.png" alt="Rick and Morty" fill sizes="128px" className="object-contain" /></Link><div className="flex gap-5 text-xs font-bold text-white/70"><Link href="/#explorar">Personajes</Link><Link href="/buscar">Buscar</Link><Link href="/pokemon" className="text-[#65ff82]">Pokédex</Link></div></nav></header>; }
function ProfileSkeleton() { return <main className="min-h-screen bg-[#061018] p-6"><div className="mx-auto max-w-7xl animate-pulse"><div className="h-14 rounded-xl bg-[#0b1923]" /><div className="mt-8 grid gap-5 xl:grid-cols-3"><div className="aspect-square rounded-2xl bg-[#0b1923]" /><div className="h-[35rem] rounded-2xl bg-[#0b1923]" /><div className="h-[35rem] rounded-2xl bg-[#0b1923]" /></div></div></main>; }
function ProfileError() { return <main className="grid min-h-screen place-items-center bg-[#061018] p-6 text-center text-white"><div><p className="text-7xl font-black text-[#65ff82]">404</p><h1 className="mt-3 text-2xl font-black">¡Ups! No encontramos este personaje</h1><p className="mt-2 text-sm text-[#94a3b8]">Parece que cruzó a otra dimensión.</p><Link href="/" className="mt-6 inline-block rounded-lg bg-[#39f5a0] px-5 py-3 text-sm font-black text-[#061018]">Volver al inicio</Link></div></main>; }
const statusText = (value: string) => value === "Alive" ? "Vivo" : value === "Dead" ? "Muerto" : "Desconocido";
function DataMini({ icon, label, value }: { icon: ReactNode; label: string; value: string }) { return <div className="rounded-lg border border-[#203542] bg-[#102431] p-3 text-center"><span className="mx-auto text-[#39f5a0]">{icon}</span><p className="mt-2 text-[10px] font-bold uppercase tracking-wide text-[#94a3b8]">{label}</p><p className="mt-1 truncate text-xs font-bold text-white">{value}</p></div>; }
function InfoCard({ title, children }: { title: string; children: ReactNode }) { return <div className="mt-3 rounded-xl border border-[#203542] bg-[#061018] p-4"><p className="text-sm font-black text-white">{title}</p><div className="mt-3 grid gap-3 sm:grid-cols-2">{children}</div></div>; }
function InfoRow({ icon, label, value }: { icon?: ReactNode; label: string; value: string }) { return <div className="min-w-0"><p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-[#94a3b8]">{icon && <span className="text-[#39f5a0]">{icon}</span>}{label}</p><p className="mt-1 truncate text-sm font-bold text-white">{value}</p></div>; }
function EpisodeSkeleton() { return <>{Array.from({ length: 6 }).map((_, index) => <div key={index} className="h-14 animate-pulse rounded-lg bg-[#102431]" />)}</>; }
