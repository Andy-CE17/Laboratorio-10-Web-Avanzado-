import Link from "next/link";
import { IoHome } from "react-icons/io5";

export default function NotFound() {
  return <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[#061018] p-6 text-center text-white"><div className="star-field absolute inset-0 opacity-70" /><div className="absolute h-72 w-72 rounded-full border-[18px] border-[#39f5a0]/70 shadow-[0_0_80px_rgba(57,245,160,0.7),inset_0_0_48px_rgba(57,245,160,0.62)]" /><section className="relative z-10"><p className="text-[7rem] font-black leading-none tracking-[-0.1em] text-[#65ff82] drop-shadow-[0_0_25px_rgba(101,255,130,0.6)] sm:text-[10rem]">404</p><h1 className="mt-3 text-2xl font-black sm:text-3xl">¡Ups! No encontramos este personaje</h1><p className="mt-3 text-sm text-[#cbd5e1]">Parece que este personaje ya cruzó a otra dimensión.</p><Link href="/" className="mt-7 inline-flex items-center gap-2 rounded-lg bg-[#39f5a0] px-5 py-3 text-sm font-black text-[#052018] transition hover:bg-[#65ff82]"><IoHome size={17} /> Volver al inicio</Link></section></main>;
}
