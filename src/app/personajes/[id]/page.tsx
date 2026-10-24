import type { Metadata } from "next";
import CharacterProfile from "@/components/CharacterProfile";
import { getAllCharacterParams } from "@/lib/rick-and-morty";

export const revalidate = 864000;

interface CharacterPageProps { params: Promise<{ id: string }>; }

export async function generateStaticParams() {
  return getAllCharacterParams();
}

export async function generateMetadata({ params }: CharacterPageProps): Promise<Metadata> {
  const { id } = await params;
  return { title: `Personaje #${id} | Rick and Morty Explorer`, description: "Perfil interdimensional de personaje" };
}

export default async function CharacterDetail({ params }: CharacterPageProps) {
  const { id } = await params;
  return <CharacterProfile id={id} />;
}
