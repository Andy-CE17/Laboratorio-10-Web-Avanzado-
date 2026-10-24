import Image from "next/image";
import Link from "next/link";
import { IoArrowForward, IoGameController, IoHome, IoInformationCircleOutline, IoPeople, IoSearch, IoSunnyOutline } from "react-icons/io5";
import CharacterExplorer from "@/components/CharacterExplorer";
import HeroSearch from "@/components/HeroSearch";
import { getCharacters } from "@/lib/rick-and-morty";

export default async function Home() {
  const catalog = await getCharacters();

  return (
    <main className="min-h-screen bg-[#031019] text-white">
      <section className="hero-space relative min-h-[610px] overflow-hidden border-b border-[#47f49a]/20 lg:min-h-[720px]">
        <Image src="/images/rick-portal-hero-reference.png" alt="Universo de Rick and Morty con portal interdimensional" fill priority sizes="100vw" className="object-cover object-[66%_center]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,16,25,0.94)_0%,rgba(3,16,25,0.82)_32%,rgba(3,16,25,0.25)_62%,rgba(3,16,25,0.05)_100%),linear-gradient(0deg,rgba(3,16,25,0.82)_0%,transparent_38%)]" />
        <nav className="relative mx-4 mt-4 flex max-w-none items-center justify-between overflow-hidden rounded-2xl border border-[#57f58d]/40 bg-[linear-gradient(105deg,rgba(3,16,25,0.98)_0%,rgba(5,38,32,0.96)_32%,rgba(18,132,65,0.84)_66%,rgba(3,16,25,0.97)_100%)] px-5 py-4 shadow-[0_14px_42px_rgba(22,203,91,0.16)] backdrop-blur-md sm:mx-8 sm:mt-5 sm:px-8 lg:mx-auto lg:max-w-[calc(100%-7rem)] lg:px-10">
          <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,transparent_20%,rgba(87,245,141,0.09)_50%,transparent_72%)]" />
          <Link href="/" className="relative block h-10 w-36 sm:h-12 sm:w-44" aria-label="Inicio de Rick and Morty">
            <Image src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Rick_and_Morty.svg/1280px-Rick_and_Morty.svg.png" alt="Rick and Morty" fill sizes="144px" className="object-contain" priority />
          </Link>
          <div className="relative hidden items-center gap-2 rounded-2xl border border-white/20 bg-[#061018]/82 p-1.5 text-sm font-bold text-white/90 shadow-lg shadow-black/20 lg:flex xl:gap-3">
            <Link href="/" className="flex items-center gap-2.5 rounded-xl bg-[#0d3032] px-6 py-3 text-[#65ff82]"><IoHome size={19} /> Inicio</Link>
            <a href="#explorar" className="flex items-center gap-2.5 rounded-xl px-5 py-3 transition hover:bg-white/5"><IoPeople size={19} /> Personajes</a>
            <Link href="/buscar" className="flex items-center gap-2.5 rounded-xl px-5 py-3 transition hover:bg-white/5"><IoSearch size={18} /> Buscar</Link>
            <Link href="/pokemon" className="flex items-center gap-2.5 rounded-xl px-5 py-3 transition hover:bg-white/5"><IoGameController size={19} /> Pokédex</Link>
            <a href="#acerca" className="flex items-center gap-2.5 rounded-xl px-5 py-3 transition hover:bg-white/5"><IoInformationCircleOutline size={19} /> Acerca de</a>
          </div>
          <div className="relative flex items-center gap-2"><Link href="/pokemon" className="rounded-lg border border-[#061018]/30 bg-[#061018]/80 px-3 py-2 text-xs font-black text-[#65ff82] transition hover:bg-[#061018] lg:hidden">Pokédex</Link><span className="grid h-10 w-10 place-items-center rounded-full border border-[#061018]/25 bg-[#061018]/82 text-[#65ff82] shadow-lg shadow-black/20"><IoSunnyOutline size={19} /></span></div>
        </nav>

        <div className="relative mx-auto flex max-w-7xl px-5 pb-14 pt-24 sm:px-8 lg:px-10 lg:pb-16 lg:pt-32">
          <div className="z-10 max-w-2xl">
            <p className="text-xs font-black uppercase tracking-[0.32em] text-[#39f5a0]">Multiverso</p>
            <h1 className="mt-6 text-5xl font-black leading-[0.92] tracking-[-0.06em] text-white sm:text-6xl lg:text-8xl">Explora <span className="block text-[#39f5a0]">Rick and Morty</span></h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-slate-200 sm:text-xl">Descubre personajes, especies, episodios y mucho más del universo de Rick and Morty.</p>
            <div className="mt-8 flex flex-wrap gap-3"><a href="#explorar" className="inline-flex items-center gap-2 rounded-xl bg-[#39f5a0] px-6 py-4 text-sm font-black text-[#052018] transition duration-300 hover:-translate-y-0.5 hover:bg-[#65ff82] hover:shadow-[0_12px_30px_rgba(57,245,160,0.3)]"><IoPeople size={19} /> Ver personajes <IoArrowForward size={17} /></a><Link href="/pokemon" className="inline-flex items-center gap-2 rounded-xl border border-[#2b5664] bg-[#071923]/70 px-6 py-4 text-sm font-black text-white backdrop-blur transition hover:border-[#39f5a0]"><IoGameController size={19} /> Ver Pokédex</Link></div>
            <HeroSearch />
          </div>
        </div>
      </section>

      <CharacterExplorer initialCharacters={catalog.results} initialTotal={catalog.info.count} />

      <footer id="acerca" className="border-t border-[#47f49a]/15 bg-[#020c14] px-5 py-8 sm:px-8 lg:px-10"><div className="mx-auto flex max-w-7xl flex-col gap-2 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between"><p className="font-black tracking-wide text-[#47f49a]">RICK & MORTY · ARCHIVO DE PERSONAJES</p><p>Proyecto académico · API pública de Rick and Morty</p></div></footer>
    </main>
  );
}
