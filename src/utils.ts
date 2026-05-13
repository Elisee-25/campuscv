// ============================================================
//  CampusCV — utils.ts
//  Fonctions utilitaires typées
// ============================================================

import type { StatusType } from './types';

// ─── DOM helpers ─────────────────────────────────────────────

export function $<T extends HTMLElement = HTMLElement>(id: string): T {
  const el = document.getElementById(id) as T | null;
  if (!el) throw new Error(`Element #${id} not found`);
  return el;
}

export function qs<T extends Element = Element>(sel: string): T | null {
  return document.querySelector<T>(sel);
}

// ─── Toast ───────────────────────────────────────────────────

let _toastTimer: ReturnType<typeof setTimeout> | undefined;

export function toast(msg: string, type: 'ok' | 'err' | '' = ''): void {
  const t = $('toast');
  t.textContent = msg;
  t.className = `toast show ${type}`;
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => (t.className = 'toast'), 3200);
}

// ─── Avatar color ────────────────────────────────────────────

export function avColor(str: string): string {
  let h = 0;
  for (const c of str) h = ((h * 31 + c.charCodeAt(0)) & 0xffff);
  return 'av' + (h % 6);
}

export function initials(first = '', last = ''): string {
  return ((first[0] ?? '') + (last[0] ?? '')).toUpperCase() || '?';
}

// ─── Status labels ───────────────────────────────────────────

const STATUS_LABELS: Record<StatusType, string> = {
  stage: 'Cherche stage',
  alternance: 'Alternance',
  emploi: '1er emploi',
  these: 'Thèse',
  freelance: 'Freelance',
  indisponible: 'Indisponible',
};

export function statusLabel(s: StatusType): string {
  return STATUS_LABELS[s] ?? s;
}

export function statusClass(s: StatusType): string {
  return `st-${s || 'indisponible'}`;
}

// ─── Date formatting ─────────────────────────────────────────

export function formatDate(ts: number | undefined): string {
  if (!ts) return '';
  return new Date(ts).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

// ─── Time helpers ────────────────────────────────────────────

export function parseSecs(str: string | undefined): number {
  if (!str) return 0;
  if (str.includes(':')) {
    const [m, s] = str.split(':').map(Number);
    return (m || 0) * 60 + (s || 0);
  }
  return parseFloat(str) || 0;
}

export function secsToStr(s: number): string {
  const m = Math.floor(s / 60);
  const ss = Math.floor(s % 60);
  return `${m}:${String(ss).padStart(2, '0')}`;
}

// ─── Media helpers ───────────────────────────────────────────

export function youtubeEmbed(url: string): string {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  if (m) return `https://www.youtube.com/embed/${m[1]}?enablejsapi=1&rel=0`;
  const v = url.match(/vimeo\.com\/(\d+)/);
  if (v) return `https://player.vimeo.com/video/${v[1]}`;
  return '';
}

// ─── Skills helper ───────────────────────────────────────────

export function skillArr(str: string | undefined): string[] {
  return (str ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}
