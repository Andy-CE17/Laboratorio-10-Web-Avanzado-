"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
  IoArrowBack,
  IoCalendarOutline,
  IoEarthOutline,
  IoFemale,
  IoGameControllerOutline,
  IoHeart,
  IoHeartOutline,
  IoHomeOutline,
  IoInformationCircleOutline,
  IoLocationOutline,
  IoMale,
  IoPeopleOutline,
  IoPersonOutline,
  IoPlayCircleOutline,
  IoSearch,
  IoSunnyOutline,
} from "react-icons/io5";
import NotFoundExperience from "@/components/NotFoundExperience";
import type { Character } from "@/lib/rick-and-morty";

export default function CharacterProfile({ id }: { id: string }) {
  const [character, setCharacter] = useState<Character | null>(null);
  const [favorite, setFavorite] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    async function loadProfile() {
      try {
        const response = await fetch(`https://rickandmortyapi.com/api/character/${id}`, { signal: controller.signal });
        if (!response.ok) throw new Error("Personaje no encontrado");
        setCharacter(await response.json());
      } catch (loadError) {
        if (!(loadError instanceof DOMException && loadError.name === "AbortError")) setError(true);
      }
    }
    loadProfile();
    return () => controller.abort();
  }, [id]);

  if (error) return <NotFoundExperience character />;
  if (!character) return <ProfileSkeleton />;

  const createdAt = new Intl.DateTimeFormat("es-PE", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(character.created));

  return (
    <main className="profile-universe relative min-h-screen overflow-hidden bg-[#031019] text-white">
      <Image src="/images/rick-portal-hero-reference.png" alt="" fill priority sizes="100vw" className="pointer-events-none object-cover object-[70%_center] opacity-25" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_45%,rgba(32,255,126,0.14),transparent_33%),linear-gradient(90deg,rgba(2,17,24,0.98)_0%,rgba(2,18,25,0.91)_52%,rgba(2,17,24,0.76)_100%)]" />
      <ProfileHeader />

      <section className="relative z-10 mx-auto w-full max-w-[1460px] px-5 pb-8 pt-14 sm:px-8 sm:pt-16 lg:px-12 lg:pt-[4.5rem]">
        <Link href="/#explorar" className="inline-flex items-center gap-2 rounded-full border border-[#39f5a0]/65 bg-[#061c22]/85 px-5 py-2.5 text-sm font-black text-white shadow-[0_0_22px_rgba(57,245,160,0.1)] backdrop-blur transition hover:border-[#65ff82] hover:bg-[#0b302d]"><IoArrowBack size={19} /> Volver</Link>

        <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(310px,0.66fr)_minmax(0,1.34fr)] xl:gap-0">
          <aside className="profile-portrait relative z-10 mx-auto w-full max-w-[455px] overflow-hidden rounded-[2rem] border-2 border-[#39f5a0] bg-[#0a2028] shadow-[0_0_0_8px_rgba(57,245,160,0.06),0_0_42px_rgba(57,245,160,0.26)] lg:mx-0">
            <div className="relative aspect-[0.86] min-h-[430px] lg:min-h-[540px]">
              <Image src={character.image} alt={character.name} fill unoptimized priority sizes="(max-width: 1024px) 90vw, 36vw" className="object-cover" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_58%,rgba(2,17,24,0.8)_100%)]" />
              <span className="absolute bottom-5 left-5 rounded-xl border border-white/15 bg-[#071920]/85 px-4 py-2 text-base font-black tracking-wide text-white backdrop-blur">#{String(character.id).padStart(3, "0")}</span>
            </div>
          </aside>

          <section className="relative self-center overflow-hidden rounded-[2rem] border border-[#39f5a0]/38 bg-[#061920]/88 px-6 py-7 shadow-[0_24px_70px_rgba(0,0,0,0.42)] backdrop-blur-xl sm:px-9 lg:-ml-5 lg:pl-14 xl:px-14 xl:py-10">
            <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full border-[28px] border-[#39f5a0]/5 shadow-[0_0_80px_rgba(57,245,160,0.1)]" />
            <div className="relative flex items-start justify-between gap-4">
              <div>
                <span className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-black uppercase tracking-[0.08em] ${statusClass(character.status)}`}><IoPersonOutline size={17} /> {character.species} · {statusText(character.status)}</span>
                <h1 className="mt-4 text-4xl font-black leading-none tracking-[-0.055em] sm:text-5xl xl:text-6xl"><CharacterName name={character.name} /></h1>
              </div>
              <button type="button" onClick={() => setFavorite((current) => !current)} aria-label={favorite ? "Quitar de favoritos" : "Agregar a favoritos"} className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-[#39f5a0] bg-[#08252a]/80 text-[#39f5a0] shadow-[0_0_22px_rgba(57,245,160,0.18)] transition hover:scale-105 hover:bg-[#0c3833]">{favorite ? <IoHeart size={27} /> : <IoHeartOutline size={27} />}</button>
            </div>

            <p className="relative mt-4 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">{profileDescription(character)}</p>

            <div className="relative mt-6 grid gap-3 sm:grid-cols-3">
              <DataPill icon={<IoPersonOutline />} label="Especie" value={character.species} />
              <DataPill icon={genderIcon(character.gender)} label="Género" value={genderText(character.gender)} />
              <DataPill icon={<IoEarthOutline />} label="Origen" value={character.origin.name} />
            </div>

            <div className="relative mt-5 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-2xl border border-[#39f5a0]/25 bg-[#04151c]/72 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div><p className="flex items-center gap-2 font-black text-white"><IoPlayCircleOutline className="text-[#39f5a0]" size={23} /> Apariciones</p><p className="mt-2 text-4xl font-black text-white">{character.episode.length} <span className="text-sm font-semibold text-slate-400">episodios</span></p></div>
                  <EpisodeWave count={character.episode.length} />
                </div>
              </div>

              <div className="rounded-2xl border border-[#39f5a0]/25 bg-[#04151c]/72 p-5">
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#39f5a0]"><IoLocationOutline size={18} /> Ubicación actual</p>
                <p className="mt-2 truncate text-lg font-black text-white">{character.location.name}</p>
                <p className="mt-2 flex items-center gap-2 text-xs text-slate-400"><IoCalendarOutline /> Registro: {createdAt}</p>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

function ProfileHeader() {
  const items = [
    { href: "/", label: "Inicio", icon: <IoHomeOutline /> },
    { href: "/#explorar", label: "Personajes", icon: <IoPeopleOutline />, active: true },
    { href: "/buscar", label: "Buscar", icon: <IoSearch /> },
    { href: "/pokemon", label: "Pokédex", icon: <IoGameControllerOutline /> },
    { href: "/#acerca", label: "Acerca de", icon: <IoInformationCircleOutline /> },
  ];

  return <header className="relative z-20 px-4 pt-4 sm:px-8 lg:px-12"><nav className="mx-auto flex max-w-[1460px] items-center justify-between rounded-[1.6rem] border border-[#39f5a0]/30 bg-[#03151c]/88 px-5 py-3 shadow-[0_14px_40px_rgba(0,0,0,0.34)] backdrop-blur-xl sm:px-8"><Link href="/" className="relative block h-11 w-36 sm:w-44" aria-label="Inicio de Rick and Morty"><Image src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Rick_and_Morty.svg/1280px-Rick_and_Morty.svg.png" alt="Rick and Morty" fill sizes="176px" className="object-contain" priority /></Link><div className="hidden items-center gap-1 lg:flex">{items.map((item) => <Link key={item.label} href={item.href} className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition ${item.active ? "border border-[#39f5a0]/25 bg-[#0d3b32] text-[#65ff82] shadow-[0_0_20px_rgba(57,245,160,0.18)]" : "text-slate-300 hover:bg-white/5 hover:text-white"}`}><span className="text-lg">{item.icon}</span>{item.label}</Link>)}</div><span className="grid h-11 w-11 place-items-center rounded-full border border-[#39f5a0]/30 bg-[#08252a] text-[#65ff82]"><IoSunnyOutline size={21} /></span></nav></header>;
}

function CharacterName({ name }: { name: string }) {
  const words = name.split(" ");
  const accent = words.pop();
  return <>{words.length > 0 && `${words.join(" ")} `}<span className="bg-gradient-to-r from-[#87ff83] to-[#29e887] bg-clip-text text-transparent">{accent}</span></>;
}

function DataPill({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return <div className="flex min-w-0 items-center gap-3 rounded-full border border-[#315462] bg-[#071d25]/86 px-4 py-3.5"><span className="shrink-0 text-2xl text-[#39f5a0]">{icon}</span><span className="min-w-0"><small className="block text-[11px] font-semibold text-slate-400">{label}</small><strong className="block truncate text-sm text-white">{value}</strong></span></div>;
}

function EpisodeWave({ count }: { count: number }) {
  return <div className="flex h-12 items-end gap-1" aria-hidden="true">{Array.from({ length: 17 }, (_, index) => <span key={index} className="w-1.5 rounded-full bg-gradient-to-t from-[#087d5c] to-[#39f5a0] opacity-80" style={{ height: `${18 + ((index * 13 + count) % 31)}px` }} />)}</div>;
}

function ProfileSkeleton() {
  return <main className="min-h-screen bg-[#031019] p-5"><div className="mx-auto max-w-[1460px] animate-pulse"><div className="h-20 rounded-[1.6rem] bg-[#0b2028]" /><div className="mt-20 grid gap-5 lg:grid-cols-[0.66fr_1.34fr]"><div className="h-[34rem] rounded-[2rem] bg-[#0b2028]" /><div className="h-[29rem] self-center rounded-[2rem] bg-[#0b2028]" /></div></div></main>;
}

const statusText = (value: string) => value === "Alive" ? "Vivo" : value === "Dead" ? "Muerto" : "Desconocido";
const genderText = (value: string) => value === "Male" ? "Masculino" : value === "Female" ? "Femenino" : value === "Genderless" ? "Sin género" : "Desconocido";
const genderIcon = (value: string) => value === "Female" ? <IoFemale /> : value === "Male" ? <IoMale /> : <IoPersonOutline />;
const statusClass = (value: string) => value === "Alive" ? "border-[#39f5a0]/55 bg-[#0c4937]/65 text-[#65ff82]" : value === "Dead" ? "border-rose-400/50 bg-rose-950/60 text-rose-300" : "border-slate-400/40 bg-slate-800/60 text-slate-300";

function profileDescription(character: Character) {
  const state = character.status === "Alive" ? "continúa activo en el multiverso" : character.status === "Dead" ? "figura como fallecido en los registros" : "mantiene un estado desconocido";
  return `${character.name} es un personaje de especie ${character.species.toLowerCase()} que ${state}. Su última ubicación conocida es ${character.location.name}.`;
}
