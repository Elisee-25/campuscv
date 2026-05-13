// ============================================================
//  CampusCV — db.ts  (index.db via IndexedDB)
//  CRUD : Create · Read · Update · Delete
// ============================================================

import type { Profile, ProfileWithId } from './types';

const DB_NAME = 'index.db';
const DB_VERSION = 1;
const STORE = 'profiles';

let _db: IDBDatabase | null = null;

function openDB(): Promise<IDBDatabase> {
  return new Promise((res, rej) => {
    if (_db) return res(_db);
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = (e: IDBVersionChangeEvent) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE)) {
        const st = db.createObjectStore(STORE, { keyPath: 'id', autoIncrement: true });
        st.createIndex('lastname', 'lastname', { unique: false });
        st.createIndex('school', 'school', { unique: false });
        st.createIndex('promo', 'promo', { unique: false });
        st.createIndex('createdAt', 'createdAt', { unique: false });
      }
    };

    req.onsuccess = (e: Event) => {
      _db = (e.target as IDBOpenDBRequest).result;
      res(_db);
    };

    req.onerror = (e: Event) => rej((e.target as IDBOpenDBRequest).error);
  });
}

export async function dbCreate(profile: Profile): Promise<number> {
  const db = await openDB();
  return new Promise((res, rej) => {
    const data: Profile = {
      ...profile,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    const req = db.transaction(STORE, 'readwrite').objectStore(STORE).add(data);
    req.onsuccess = (e: Event) => res((e.target as IDBRequest<number>).result);
    req.onerror = (e: Event) => rej((e.target as IDBRequest).error);
  });
}

export async function dbGetAll(): Promise<ProfileWithId[]> {
  const db = await openDB();
  return new Promise((res, rej) => {
    const req = db.transaction(STORE, 'readonly').objectStore(STORE).getAll();
    req.onsuccess = (e: Event) =>
      res((e.target as IDBRequest<ProfileWithId[]>).result);
    req.onerror = (e: Event) => rej((e.target as IDBRequest).error);
  });
}

export async function dbGetOne(id: number): Promise<ProfileWithId | undefined> {
  const db = await openDB();
  return new Promise((res, rej) => {
    const req = db.transaction(STORE, 'readonly').objectStore(STORE).get(id);
    req.onsuccess = (e: Event) =>
      res((e.target as IDBRequest<ProfileWithId | undefined>).result);
    req.onerror = (e: Event) => rej((e.target as IDBRequest).error);
  });
}

export async function dbUpdate(profile: ProfileWithId): Promise<void> {
  const db = await openDB();
  return new Promise((res, rej) => {
    const data: ProfileWithId = { ...profile, updatedAt: Date.now() };
    const req = db.transaction(STORE, 'readwrite').objectStore(STORE).put(data);
    req.onsuccess = () => res();
    req.onerror = (e: Event) => rej((e.target as IDBRequest).error);
  });
}

export async function dbDelete(id: number): Promise<void> {
  const db = await openDB();
  return new Promise((res, rej) => {
    const req = db.transaction(STORE, 'readwrite').objectStore(STORE).delete(id);
    req.onsuccess = () => res();
    req.onerror = (e: Event) => rej((e.target as IDBRequest).error);
  });
}

export async function dbDeleteAll(): Promise<void> {
  const db = await openDB();
  return new Promise((res, rej) => {
    const req = db.transaction(STORE, 'readwrite').objectStore(STORE).clear();
    req.onsuccess = () => res();
    req.onerror = (e: Event) => rej((e.target as IDBRequest).error);
  });
}

export async function dbCount(): Promise<number> {
  const db = await openDB();
  return new Promise((res, rej) => {
    const req = db.transaction(STORE, 'readonly').objectStore(STORE).count();
    req.onsuccess = (e: Event) =>
      res((e.target as IDBRequest<number>).result);
    req.onerror = (e: Event) => rej((e.target as IDBRequest).error);
  });
}

export async function dbExport(): Promise<string> {
  return JSON.stringify(await dbGetAll(), null, 2);
}

export async function dbImport(jsonStr: string): Promise<number> {
  const profiles: Profile[] = JSON.parse(jsonStr) as Profile[];
  const db = await openDB();
  return new Promise((res, rej) => {
    const tx = db.transaction(STORE, 'readwrite');
    const st = tx.objectStore(STORE);
    let n = 0;
    for (const p of profiles) {
      const entry = { ...p };
      delete (entry as Partial<ProfileWithId>).id;
      st.add(entry);
      n++;
    }
    tx.oncomplete = () => res(n);
    tx.onerror = (e: Event) => rej((e.target as IDBRequest).error);
  });
}
