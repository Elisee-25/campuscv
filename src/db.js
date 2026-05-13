// ============================================================
//  CampusCV — db.ts  (index.db via IndexedDB)
//  CRUD : Create · Read · Update · Delete
// ============================================================
const DB_NAME = 'index.db';
const DB_VERSION = 1;
const STORE = 'profiles';
let _db = null;
function openDB() {
    return new Promise((res, rej) => {
        if (_db)
            return res(_db);
        const req = indexedDB.open(DB_NAME, DB_VERSION);
        req.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains(STORE)) {
                const st = db.createObjectStore(STORE, { keyPath: 'id', autoIncrement: true });
                st.createIndex('lastname', 'lastname', { unique: false });
                st.createIndex('school', 'school', { unique: false });
                st.createIndex('promo', 'promo', { unique: false });
                st.createIndex('createdAt', 'createdAt', { unique: false });
            }
        };
        req.onsuccess = (e) => {
            _db = e.target.result;
            res(_db);
        };
        req.onerror = (e) => rej(e.target.error);
    });
}
export async function dbCreate(profile) {
    const db = await openDB();
    return new Promise((res, rej) => {
        const data = {
            ...profile,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };
        const req = db.transaction(STORE, 'readwrite').objectStore(STORE).add(data);
        req.onsuccess = (e) => res(e.target.result);
        req.onerror = (e) => rej(e.target.error);
    });
}
export async function dbGetAll() {
    const db = await openDB();
    return new Promise((res, rej) => {
        const req = db.transaction(STORE, 'readonly').objectStore(STORE).getAll();
        req.onsuccess = (e) => res(e.target.result);
        req.onerror = (e) => rej(e.target.error);
    });
}
export async function dbGetOne(id) {
    const db = await openDB();
    return new Promise((res, rej) => {
        const req = db.transaction(STORE, 'readonly').objectStore(STORE).get(id);
        req.onsuccess = (e) => res(e.target.result);
        req.onerror = (e) => rej(e.target.error);
    });
}
export async function dbUpdate(profile) {
    const db = await openDB();
    return new Promise((res, rej) => {
        const data = { ...profile, updatedAt: Date.now() };
        const req = db.transaction(STORE, 'readwrite').objectStore(STORE).put(data);
        req.onsuccess = () => res();
        req.onerror = (e) => rej(e.target.error);
    });
}
export async function dbDelete(id) {
    const db = await openDB();
    return new Promise((res, rej) => {
        const req = db.transaction(STORE, 'readwrite').objectStore(STORE).delete(id);
        req.onsuccess = () => res();
        req.onerror = (e) => rej(e.target.error);
    });
}
export async function dbDeleteAll() {
    const db = await openDB();
    return new Promise((res, rej) => {
        const req = db.transaction(STORE, 'readwrite').objectStore(STORE).clear();
        req.onsuccess = () => res();
        req.onerror = (e) => rej(e.target.error);
    });
}
export async function dbCount() {
    const db = await openDB();
    return new Promise((res, rej) => {
        const req = db.transaction(STORE, 'readonly').objectStore(STORE).count();
        req.onsuccess = (e) => res(e.target.result);
        req.onerror = (e) => rej(e.target.error);
    });
}
export async function dbExport() {
    return JSON.stringify(await dbGetAll(), null, 2);
}
export async function dbImport(jsonStr) {
    const profiles = JSON.parse(jsonStr);
    const db = await openDB();
    return new Promise((res, rej) => {
        const tx = db.transaction(STORE, 'readwrite');
        const st = tx.objectStore(STORE);
        let n = 0;
        for (const p of profiles) {
            const entry = { ...p };
            delete entry.id;
            st.add(entry);
            n++;
        }
        tx.oncomplete = () => res(n);
        tx.onerror = (e) => rej(e.target.error);
    });
}
