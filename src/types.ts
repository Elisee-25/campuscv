// ============================================================
//  CampusCV — types.ts
//  Définitions des types TypeScript
// ============================================================

export type MediaType = 'video' | 'audio' | 'yt' | '';

export type StatusType =
  | 'stage'
  | 'alternance'
  | 'emploi'
  | 'these'
  | 'freelance'
  | 'indisponible';

export interface Experience {
  org: string;
  role: string;
  period: string;
  loc?: string;
  desc?: string;
}

export interface Education {
  school: string;
  degree: string;
  year: string;
}

export interface Project {
  name: string;
  stack: string;
  url?: string;
  year?: string;
  desc?: string;
}

export interface Language {
  lang: string;
  level: string;
}

export interface Chapter {
  time: string;
  title: string;
  desc?: string;
}

export interface Profile {
  id?: number;
  firstname: string;
  lastname: string;
  specialty: string;
  school?: string;
  promo?: string;
  city?: string;
  bio?: string;
  skills?: string;
  goal?: string;
  email?: string;
  linkedin?: string;
  github?: string;
  status: StatusType;
  photo?: string;
  mediaType?: MediaType;
  mediaData?: string;
  experiences?: Experience[];
  education?: Education[];
  projects?: Project[];
  languages?: Language[];
  chapters?: Chapter[];
  createdAt?: number;
  updatedAt?: number;
}

export interface ProfileWithId extends Profile {
  id: number;
}

export type PageId = 'home' | 'members' | 'search' | 'add' | 'profile' | 'settings';
export type SortType = 'name' | 'date' | 'school';
export type MediaTab = 'file' | 'url';
