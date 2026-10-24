export interface ApiInfo {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
}

export interface CharacterReference {
  name: string;
  url: string;
}

export interface Character {
  id: number;
  name: string;
  status: "Alive" | "Dead" | "unknown";
  species: string;
  type: string;
  gender: "Female" | "Male" | "Genderless" | "unknown";
  origin: CharacterReference;
  location: CharacterReference;
  image: string;
  episode: string[];
  url: string;
  created: string;
}

export interface CharacterListResponse {
  info: ApiInfo;
  results: Character[];
}

export interface Episode {
  id: number;
  name: string;
  air_date: string;
  episode: string;
  url: string;
}

interface EpisodeListResponse {
  info: ApiInfo;
  results: Episode[];
}

const API_URL = "https://rickandmortyapi.com/api/character";
export const TEN_DAYS_IN_SECONDS = 60 * 60 * 24 * 10;

async function apiRequest<T>(url: string): Promise<T> {
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const response = await fetch(url, {
      cache: "force-cache",
      next: { revalidate: TEN_DAYS_IN_SECONDS },
    });

    if (response.ok) return response.json();
    if (response.status !== 429 && response.status < 500) break;
    await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
  }
  throw new Error("No se pudo obtener la información del multiverso");
}

export async function getCharacters() {
  return apiRequest<CharacterListResponse>(API_URL);
}

let charactersCatalogPromise: Promise<Character[]> | undefined;

async function getCharactersCatalog() {
  if (!charactersCatalogPromise) {
    charactersCatalogPromise = (async () => {
      const firstPage = await getCharacters();
      const pages = [firstPage];
      for (let page = 2; page <= firstPage.info.pages; page += 1) {
        pages.push(await apiRequest<CharacterListResponse>(`${API_URL}/?page=${page}`));
      }
      return pages.flatMap((response) => response.results);
    })();
  }
  return charactersCatalogPromise;
}

export async function getCharacter(id: string) {
  const catalog = await getCharactersCatalog();
  const character = catalog.find((item) => item.id === Number(id));
  if (!character) throw new Error("Personaje no encontrado");
  return character;
}

let episodesCatalogPromise: Promise<Episode[]> | undefined;

async function getEpisodesCatalog() {
  if (!episodesCatalogPromise) {
    episodesCatalogPromise = (async () => {
      const firstPage = await apiRequest<EpisodeListResponse>("https://rickandmortyapi.com/api/episode");
      const remaining = await Promise.all(
        Array.from({ length: firstPage.info.pages - 1 }, (_, index) =>
          apiRequest<EpisodeListResponse>(`https://rickandmortyapi.com/api/episode?page=${index + 2}`),
        ),
      );
      return [firstPage, ...remaining].flatMap((page) => page.results);
    })();
  }
  return episodesCatalogPromise;
}

export async function getEpisodes(episodeUrls: string[]) {
  const ids = new Set(episodeUrls.map(episodeNumber).filter(Boolean));
  const catalog = await getEpisodesCatalog();
  return catalog.filter((episode) => ids.has(String(episode.id)));
}

export async function getAllCharacterParams() {
  return Array.from({ length: 826 }, (_, index) => ({ id: String(index + 1) }));
}

export function episodeNumber(url: string) {
  return url.split("/").pop() ?? "";
}
