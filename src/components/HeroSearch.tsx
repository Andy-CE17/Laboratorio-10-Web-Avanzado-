"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { IoSearch } from "react-icons/io5";

export default function HeroSearch() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    router.push(`/buscar${params.size ? `?${params}` : ""}`);
  }

  return (
    <form onSubmit={submit} className="mt-7 flex max-w-xl items-center gap-3 rounded-xl border border-[#2b5664] bg-[#071925]/85 p-2 shadow-[0_15px_40px_rgba(0,0,0,0.22)] backdrop-blur">
      <IoSearch className="ml-2 text-[#65ff82]" size={19} />
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por nombre..." className="h-10 min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-400" />
      <button type="submit" className="rounded-lg bg-[#39f5a0] px-4 py-2.5 text-xs font-black text-[#052018] transition hover:bg-[#65ff82]">Buscar</button>
    </form>
  );
}
