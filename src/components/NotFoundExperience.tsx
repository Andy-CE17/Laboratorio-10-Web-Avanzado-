import Image from "next/image";
import Link from "next/link";
import { IoHome, IoSearch } from "react-icons/io5";

export default function NotFoundExperience({ character = false }: { character?: boolean }) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#020d15] px-5 py-7 text-center text-white">
      <Image src="/images/rick-portal-hero-reference.png" alt="" fill priority sizes="100vw" className="pointer-events-none object-cover object-[64%_center] opacity-60" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(2,13,21,0.9)_0%,rgba(2,13,21,0.62)_50%,rgba(2,13,21,0.82)_100%),linear-gradient(0deg,rgba(2,13,21,0.95)_0%,rgba(2,13,21,0.22)_53%,rgba(2,13,21,0.82)_100%)]" />
      <div className="star-field pointer-events-none absolute inset-0 opacity-20" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[38rem] w-[38rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#20ef7d]/18 blur-[120px]" />
      <section className="relative z-10 mx-auto w-full max-w-7xl rounded-[2.5rem] border border-[#39f5a0]/20 bg-[#020d15]/52 px-5 pb-9 pt-2 shadow-[0_30px_100px_rgba(0,0,0,0.52),0_0_55px_rgba(57,245,160,0.08)] backdrop-blur-sm sm:px-10">
        <div className="not-found-art relative mx-auto h-[320px] w-full max-w-6xl overflow-hidden sm:h-[430px] lg:h-[500px]">
          <Image src="/images/not-found-portal-reference.png" alt="Rick y Morty frente a un portal interdimensional con el código 404" fill priority sizes="(max-width: 1024px) 100vw, 1024px" className="object-cover object-top" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#020d15] to-transparent" />
        </div>
        <div className="relative -mt-6">
          <h1 className="text-3xl font-black tracking-[-0.035em] sm:text-5xl lg:text-6xl"><span className="text-[#39f5a0]">¡Ups!</span> {character ? "Personaje no encontrado" : "Página no encontrada"}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-300 sm:text-lg">{character ? "Este personaje escapó del archivo interdimensional o nunca existió en este universo." : "Parece que esta dimensión no existe o fue borrada por el Consejo de Ricks."}</p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/" className="inline-flex min-w-56 items-center justify-center gap-3 rounded-xl bg-[#39f5a0] px-6 py-4 text-sm font-black text-[#032019] shadow-[0_0_28px_rgba(57,245,160,0.25)] transition hover:-translate-y-0.5 hover:bg-[#65ff82]"><IoHome size={20} /> Volver al inicio</Link>
            <Link href="/buscar" className="inline-flex min-w-56 items-center justify-center gap-3 rounded-xl border border-[#2d6473] bg-[#061923]/80 px-6 py-4 text-sm font-black text-white transition hover:border-[#39f5a0] hover:bg-[#0a2630]"><IoSearch size={21} /> Buscar personajes</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
