import Link from "next/link";
import Image from "next/image";
import CharacterExplorer from "@/components/CharacterExplorer";
import { getCharacters } from "@/lib/rick-and-morty";

interface SearchPageProps { searchParams: Promise<{ q?: string }>; }

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const [{ q = "" }, catalog] = await Promise.all([searchParams, getCharacters()]);
  return (
    <main className="min-h-screen bg-[#061018] text-white">
      <header className="border-b border-[#203542] bg-[#07151f]"><nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-10"><Link href="/" className="relative block h-8 w-32"><Image src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Rick_and_Morty.svg/1280px-Rick_and_Morty.svg.png" alt="Rick and Morty" fill sizes="128px" className="object-contain" priority /></Link><div className="flex gap-5 text-xs font-bold text-white/70"><Link href="/#explorar">Personajes</Link><Link href="/buscar" className="text-[#65ff82]">Buscar</Link><Link href="/pokemon" className="rounded-md border border-[#39f5a0]/35 px-2 py-1 text-[#65ff82]">Pokédex</Link></div></nav></header>
      <CharacterExplorer initialCharacters={catalog.results} initialTotal={catalog.info.count} initialQuery={q} mode="search" />
    </main>
  );
}
