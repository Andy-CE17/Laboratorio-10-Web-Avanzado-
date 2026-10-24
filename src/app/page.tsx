import Image from "next/image";
import Link from "next/link";
import { IoArrowForward, IoSunnyOutline } from "react-icons/io5";
import CharacterExplorer from "@/components/CharacterExplorer";
import HeroSearch from "@/components/HeroSearch";
import { getCharacters } from "@/lib/rick-and-morty";

export default async function Home() {
  const catalog = await getCharacters();

  return (
    <main className="min-h-screen bg-[#031019] text-white">
      <section className="hero-space relative overflow-hidden border-b border-[#47f49a]/20">
        <Image src="/images/space-portal-hero.png" alt="Fondo espacial interdimensional" fill priority sizes="100vw" className="object-cover object-center opacity-80" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,16,25,0.92)_0%,rgba(3,16,25,0.62)_46%,rgba(3,16,25,0.2)_100%),linear-gradient(180deg,rgba(1,12,21,0.16),#031019)]" />
        <nav className="relative mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-10">
          <Link href="/" className="relative block h-8 w-32 sm:h-9 sm:w-36" aria-label="Inicio de Rick and Morty">
            <Image src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Rick_and_Morty.svg/1280px-Rick_and_Morty.svg.png" alt="Rick and Morty" fill sizes="144px" className="object-contain" priority />
          </Link>
          <div className="flex items-center gap-4 text-xs font-bold text-white/85 sm:gap-8">
            <a href="#explorar" className="nav-active">Personajes</a>
            <Link href="/buscar" className="hidden sm:inline">Buscar</Link>
            <a href="#acerca" className="hidden sm:inline">Acerca de</a>
            <Link href="/pokemon" className="rounded-md border border-[#47f49a]/35 px-2.5 py-1.5 text-[#47f49a] transition hover:bg-[#47f49a] hover:text-[#031019]">Pokédex</Link>
            <span className="grid h-7 w-7 place-items-center rounded-full border border-white/10 bg-white/5 text-[#f5e96a]"><IoSunnyOutline size={15} /></span>
          </div>
        </nav>

        <div className="relative mx-auto grid max-w-7xl gap-5 px-5 pb-16 pt-10 sm:px-8 lg:grid-cols-[1fr_0.92fr] lg:px-10 lg:pb-20 lg:pt-16">
          <div className="z-10 self-center">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#47f49a]">Archivo interdimensional</p>
            <h1 className="mt-4 max-w-xl text-4xl font-black leading-[1.02] tracking-[-0.05em] sm:text-5xl">Explora el universo de <span className="text-[#47f49a]">Rick and Morty</span></h1>
            <p className="mt-5 max-w-lg text-sm leading-6 text-white/75">Descubre personajes, especies, estados y localizaciones a partir de información de la API oficial.</p>
            <a href="#explorar" className="mt-7 inline-flex items-center gap-2 rounded-lg bg-[#47f49a] px-5 py-3 text-sm font-black text-[#052018] transition duration-300 hover:-translate-y-0.5 hover:bg-[#75ffb8] hover:shadow-[0_10px_30px_rgba(71,244,154,0.3)]">Ver personajes <IoArrowForward size={17} /></a>
            <HeroSearch />
          </div>
          <div className="relative min-h-[18rem] overflow-hidden sm:min-h-[23rem]">
            <div className="portal-ring absolute left-[52%] top-[48%] h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full sm:h-80 sm:w-80" />
            <div className="absolute inset-x-[8%] bottom-[2%] h-24 rounded-full bg-[#39f5a0]/20 blur-3xl" />
            <Image src="https://www.pngitem.com/pimgs/m/530-5301192_rickipedia-rick-and-morty-rick-standing-hd-png.png" alt="Rick Sanchez explorando el portal" width={900} height={1100} priority unoptimized className="hero-character absolute bottom-[-8%] left-1/2 z-20 h-auto w-[53%] -translate-x-1/2 drop-shadow-[0_25px_35px_rgba(0,0,0,0.72)] sm:w-[47%]" />
          </div>
        </div>
      </section>

      <CharacterExplorer initialCharacters={catalog.results} initialTotal={catalog.info.count} />

      <footer id="acerca" className="border-t border-[#47f49a]/15 bg-[#020c14] px-5 py-8 sm:px-8 lg:px-10"><div className="mx-auto flex max-w-7xl flex-col gap-2 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between"><p className="font-black tracking-wide text-[#47f49a]">RICK & MORTY · ARCHIVO DE PERSONAJES</p><p>Proyecto académico · API pública de Rick and Morty</p></div></footer>
    </main>
  );
}
