// ============================================================
//  CampusCV — app.ts
//  Navigation · Rendu · CRUD · Upload média · Sync chapitres
// ============================================================
import { dbCreate, dbGetAll, dbGetOne, dbUpdate, dbDelete, dbDeleteAll, dbCount, dbExport, dbImport, } from './db';
import { $, qs, toast, avColor, initials, statusLabel, statusClass, formatDate, parseSecs, youtubeEmbed, skillArr, } from './utils';
// ─── NAVIGATION ──────────────────────────────────────────────
let currentPage = 'home';
let prevPage = 'members';
function navigateTo(page) {
    prevPage = currentPage;
    document.querySelectorAll('.page').forEach((p) => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach((n) => n.classList.remove('active'));
    $(`page-${page}`).classList.add('active');
    qs(`[data-page="${page}"]`)?.classList.add('active');
    currentPage = page;
    closeSidebar();
    const actions = {
        home: renderHome,
        members: renderMembers,
        add: resetForm,
        search: () => {
            ($('search-q')).value = '';
            renderSearch([]);
        },
        settings: renderSettings,
    };
    actions[page]?.();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
function goBack() {
    navigateTo(prevPage === 'profile' ? 'members' : prevPage);
}
// sidebar nav links
document.querySelectorAll('.nav-item').forEach((el) => {
    el.addEventListener('click', (e) => {
        e.preventDefault();
        const page = el.dataset['page'];
        navigateTo(page);
    });
});
// hamburger
$('hamburger').addEventListener('click', () => {
    $('sidebar').classList.toggle('open');
    $('overlay').classList.toggle('show');
});
function closeSidebar() {
    $('sidebar').classList.remove('open');
    $('overlay').classList.remove('show');
}
// ─── HOME ────────────────────────────────────────────────────
async function renderHome() {
    const all = await dbGetAll();
    $('sc-total').textContent = String(all.length);
    $('sc-media').textContent = String(all.filter((p) => p.mediaType).length);
    $('sc-schools').textContent = String(new Set(all.map((p) => p.school).filter(Boolean)).size);
    $('sc-promos').textContent = String(new Set(all.map((p) => p.promo).filter(Boolean)).size);
    const recent = [...all]
        .sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0))
        .slice(0, 8);
    const grid = $('home-grid');
    const empty = $('home-empty');
    if (!all.length) {
        grid.innerHTML = '';
        empty.style.display = '';
        return;
    }
    empty.style.display = 'none';
    grid.innerHTML = recent.map(cardHTML).join('');
    attachCards();
}
// ─── MEMBERS ─────────────────────────────────────────────────
async function renderMembers() {
    const all = await dbGetAll();
    const promos = [...new Set(all.map((p) => p.promo).filter(Boolean))].sort();
    const sel = $('filter-promo');
    const curPromo = sel.value;
    sel.innerHTML =
        '<option value="">Toutes promotions</option>' +
            promos
                .map((p) => `<option value="${p}" ${p === curPromo ? 'selected' : ''}>${p}</option>`)
                .join('');
    const sort = $('filter-sort').value;
    const promo = sel.value;
    let list = all.filter((p) => !promo || p.promo === promo);
    if (sort === 'name')
        list.sort((a, b) => (a.lastname || '').localeCompare(b.lastname || ''));
    else if (sort === 'date')
        list.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
    else if (sort === 'school')
        list.sort((a, b) => (a.school || '').localeCompare(b.school || ''));
    const grid = $('members-grid');
    const empty = $('members-empty');
    if (!list.length) {
        grid.innerHTML = '';
        empty.style.display = '';
        return;
    }
    empty.style.display = 'none';
    grid.innerHTML = list.map(cardHTML).join('');
    attachCards();
}
// ─── SEARCH ──────────────────────────────────────────────────
async function doSearch() {
    const q = $('search-q').value.toLowerCase().trim();
    const all = await dbGetAll();
    if (!q)
        return renderSearch(all);
    const res = all.filter((p) => [
        p.firstname,
        p.lastname,
        p.specialty,
        p.school,
        p.promo,
        p.city,
        p.bio,
        p.skills,
        p.goal,
        ...(p.experiences ?? []).map((e) => `${e.org} ${e.role}`),
        ...(p.projects ?? []).map((pr) => pr.name),
    ]
        .join(' ')
        .toLowerCase()
        .includes(q));
    renderSearch(res);
}
function renderSearch(list) {
    const grid = $('search-grid');
    const empty = $('search-empty');
    if (!list.length) {
        grid.innerHTML = '';
        empty.style.display = '';
        return;
    }
    empty.style.display = 'none';
    grid.innerHTML = list.map(cardHTML).join('');
    attachCards();
}
// ─── CARD HTML ───────────────────────────────────────────────
function cardHTML(p) {
    const ini = initials(p.firstname, p.lastname);
    const av = avColor(ini);
    const skills = skillArr(p.skills).slice(0, 4);
    const avatarEl = p.photo
        ? `<img src="${p.photo}" class="avatar" alt="">`
        : `<div class="avatar-init ${av}">${ini}</div>`;
    let mediaBadge = '';
    if (p.mediaType === 'video')
        mediaBadge = '<span class="media-badge badge-video">▶ Vidéo</span>';
    else if (p.mediaType === 'audio')
        mediaBadge = '<span class="media-badge badge-audio">🎵 Audio</span>';
    else if (p.mediaType === 'yt')
        mediaBadge = '<span class="media-badge badge-yt">▶ YouTube</span>';
    return `
  <div class="mcard" data-id="${p.id}">
    <div class="mcard-top">
      ${avatarEl}
      <div class="mcard-info">
        <div class="mcard-name">${p.firstname || ''} ${p.lastname || ''}</div>
        <div class="mcard-spec">${p.specialty || ''}</div>
        <div class="mcard-school">🏫 ${p.school || ''} ${p.promo ? '· ' + p.promo : ''}</div>
      </div>
      ${mediaBadge}
    </div>
    ${p.bio ? `<div class="mcard-bio">${p.bio}</div>` : ''}
    ${skills.length ? `<div class="mcard-skills">${skills.map((s) => `<span class="skill-tag">${s}</span>`).join('')}</div>` : ''}
    <div class="mcard-footer">
      ${p.city ? `<span class="promo-tag">📍 ${p.city}</span>` : '<span></span>'}
      <span class="status-tag ${statusClass(p.status)}">${statusLabel(p.status)}</span>
    </div>
    <div class="mcard-actions">
      <button class="btn-ghost btn-sm" style="flex:1" onclick="event.stopPropagation();window.__app.openProfile(${p.id})">Voir le profil</button>
      <button class="btn-icon" onclick="event.stopPropagation();window.__app.editProfile(${p.id})" title="Modifier">✏️</button>
      <button class="btn-icon del" onclick="event.stopPropagation();window.__app.deleteProfile(${p.id})" title="Supprimer">🗑</button>
    </div>
  </div>`;
}
function attachCards() {
    document.querySelectorAll('.mcard').forEach((c) => {
        c.addEventListener('click', () => openProfile(Number(c.dataset['id'])));
    });
}
// ─── PROFILE DETAIL ──────────────────────────────────────────
async function openProfile(id) {
    const p = await dbGetOne(id);
    if (!p)
        return;
    prevPage = currentPage;
    document.querySelectorAll('.page').forEach((pg) => pg.classList.remove('active'));
    $('page-profile').classList.add('active');
    currentPage = 'profile';
    $('profile-content').innerHTML = buildProfileHTML(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    initSync(p);
}
function buildProfileHTML(p) {
    const ini = initials(p.firstname, p.lastname);
    const av = avColor(ini);
    const avatarEl = p.photo
        ? `<img src="${p.photo}" class="p-avatar" alt="">`
        : `<div class="p-avatar-init ${av}">${ini}</div>`;
    const skills = skillArr(p.skills);
    const exps = p.experiences ?? [];
    const edus = p.education ?? [];
    const projs = p.projects ?? [];
    const langs = p.languages ?? [];
    const chapters = p.chapters ?? [];
    let playerHTML = '';
    let hasMedia = false;
    if (p.mediaType === 'video' && p.mediaData) {
        hasMedia = true;
        playerHTML = `
      <div class="media-player-wrap">
        <video id="profile-player" controls preload="metadata">
          <source src="${p.mediaData}" type="video/mp4">
          Votre navigateur ne supporte pas la lecture vidéo.
        </video>
      </div>`;
    }
    else if (p.mediaType === 'audio' && p.mediaData) {
        hasMedia = true;
        playerHTML = `
      <div class="media-player-wrap">
        <div class="audio-visual" id="audio-visual">
          <div class="audio-bars"><span></span><span></span><span></span><span></span><span></span></div>
          <span style="font-size:13px;color:var(--t2)">${p.firstname} ${p.lastname} — Présentation audio</span>
        </div>
        <audio id="profile-player" controls style="width:100%;padding:14px;background:var(--bg3);display:block">
          <source src="${p.mediaData}">
        </audio>
      </div>`;
    }
    else if (p.mediaType === 'yt' && p.mediaData) {
        hasMedia = true;
        playerHTML = `
      <div class="media-player-wrap">
        <iframe id="profile-yt-frame" src="${p.mediaData}" frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen></iframe>
      </div>`;
    }
    const chaptersHTML = chapters.length
        ? `<div class="chapters-list" id="chapters-list">
        ${chapters
            .map((ch, i) => `
          <div class="chapter-item ${i === 0 ? 'active' : ''}" data-secs="${parseSecs(ch.time)}" onclick="window.__app.seekChapter(this, ${parseSecs(ch.time)})">
            <div class="ch-time">${ch.time || '0:00'}</div>
            <div class="ch-title">${ch.title || ''}</div>
            ${ch.desc ? `<div class="ch-desc">${ch.desc}</div>` : ''}
          </div>`)
            .join('')}
       </div>`
        : '<p style="color:var(--t3);font-size:13px">Aucun chapitre défini</p>';
    const mediaSection = hasMedia
        ? `<div class="psection">
      <div class="psection-title">Présentation & Parcours synchronisé</div>
      <div class="sync-layout">
        ${playerHTML}
        <div>
          <div style="font-size:12px;color:var(--t3);margin-bottom:12px;font-weight:600;letter-spacing:.5px">
            CHAPITRES — cliquez pour naviguer dans le média
          </div>
          ${chaptersHTML}
        </div>
      </div>
    </div>`
        : '';
    const tlHTML = (arr) => arr
        .map((e) => {
        const org = e.org ?? e.school ?? e.name ?? '';
        const role = e.role ?? e.degree ?? e.stack ?? '';
        const period = e.period ?? e.year ?? e.url ?? '';
        const desc = e.desc ?? e.desc ?? '';
        return `
        <div class="tl-item">
          <div class="tl-left"><div class="tl-dot"></div><div class="tl-line"></div></div>
          <div class="tl-body">
            <div class="tl-org">${org}</div>
            <div class="tl-role">${role}</div>
            <div class="tl-period">${period}</div>
            ${desc ? `<div class="tl-desc">${desc}</div>` : ''}
          </div>
        </div>`;
    })
        .join('');
    return `
  <div class="profile-hero">
    <div class="profile-hero-inner">
      <div>${avatarEl}</div>
      <div class="p-meta">
        <div class="p-name">${p.firstname || ''} ${p.lastname || ''}</div>
        <div class="p-spec">${p.specialty || ''}</div>
        <div class="p-tags">
          ${p.school ? `<span class="p-tag">🏫 ${p.school}</span>` : ''}
          ${p.promo ? `<span class="p-tag">📅 Promo ${p.promo}</span>` : ''}
          ${p.city ? `<span class="p-tag">📍 ${p.city}</span>` : ''}
          <span class="p-tag"><span class="status-tag ${statusClass(p.status)}">${statusLabel(p.status)}</span></span>
        </div>
        <div class="p-actions">
          ${p.email ? `<a href="mailto:${p.email}" class="btn-ghost btn-sm">✉️ Email</a>` : ''}
          ${p.linkedin ? `<a href="${p.linkedin}" target="_blank" class="btn-ghost btn-sm">in LinkedIn</a>` : ''}
          ${p.github ? `<a href="${p.github}" target="_blank" class="btn-ghost btn-sm">⌨ Portfolio</a>` : ''}
          <button class="btn-ghost btn-sm" onclick="window.__app.editProfile(${p.id})">✏️ Modifier</button>
        </div>
      </div>
    </div>
  </div>

  <div class="profile-body">
    ${p.bio
        ? `<div class="psection">
      <div class="psection-title">À propos</div>
      <p style="color:var(--t2);font-size:15px;line-height:1.7">${p.bio}</p>
      ${p.goal ? `<p style="margin-top:12px;color:var(--accent);font-size:14px;font-weight:600">🎯 Objectif : ${p.goal}</p>` : ''}
    </div>`
        : ''}

    ${mediaSection}

    ${skills.length
        ? `<div class="psection">
      <div class="psection-title">Compétences</div>
      <div class="skills-cloud">${skills.map((s) => `<span class="skill-pill">${s}</span>`).join('')}</div>
    </div>`
        : ''}

    ${edus.length
        ? `<div class="psection">
      <div class="psection-title">Formation</div>
      <div class="timeline">${tlHTML(edus)}</div>
    </div>`
        : ''}

    ${exps.length
        ? `<div class="psection">
      <div class="psection-title">Expériences</div>
      <div class="timeline">${tlHTML(exps)}</div>
    </div>`
        : ''}

    ${projs.length
        ? `<div class="psection">
      <div class="psection-title">Projets personnels</div>
      <div class="timeline">${tlHTML(projs)}</div>
    </div>`
        : ''}

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
      <div class="psection">
        <div class="psection-title">Contact</div>
        <div class="crows">
          ${p.email ? `<div class="crow"><span class="crow-lbl">Email</span><span class="crow-val"><a href="mailto:${p.email}">${p.email}</a></span></div>` : ''}
          ${p.linkedin ? `<div class="crow"><span class="crow-lbl">LinkedIn</span><span class="crow-val"><a href="${p.linkedin}" target="_blank">Voir le profil</a></span></div>` : ''}
          ${p.github ? `<div class="crow"><span class="crow-lbl">Portfolio</span><span class="crow-val"><a href="${p.github}" target="_blank">Voir</a></span></div>` : ''}
          <div class="crow"><span class="crow-lbl">Ajouté le</span><span class="crow-val" style="color:var(--t2)">${formatDate(p.createdAt)}</span></div>
        </div>
      </div>
      ${langs.length
        ? `<div class="psection">
        <div class="psection-title">Langues</div>
        ${langs.map((l) => `<div class="lang-row"><span class="lang-name">${l.lang}</span><span class="lang-level">${l.level}</span></div>`).join('')}
      </div>`
        : ''}
    </div>
  </div>`;
}
// ─── SYNC CHAPITRES ──────────────────────────────────────────
function initSync(p) {
    const player = document.getElementById('profile-player');
    if (!player)
        return;
    if (p.mediaType === 'audio') {
        const visual = document.getElementById('audio-visual');
        player.addEventListener('play', () => visual?.classList.remove('paused'));
        player.addEventListener('pause', () => visual?.classList.add('paused'));
    }
    const chapters = p.chapters ?? [];
    if (!chapters.length)
        return;
    const times = chapters.map((ch) => parseSecs(ch.time));
    player.addEventListener('timeupdate', () => {
        const t = player.currentTime;
        let idx = 0;
        for (let i = 0; i < times.length; i++) {
            if (t >= (times[i] ?? 0))
                idx = i;
        }
        const items = document.querySelectorAll('.chapter-item');
        items.forEach((it, i) => it.classList.toggle('active', i === idx));
        items[idx]?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    });
}
function seekChapter(el, secs) {
    document.querySelectorAll('.chapter-item').forEach((i) => i.classList.remove('active'));
    el.classList.add('active');
    const player = document.getElementById('profile-player');
    if (player) {
        player.currentTime = secs;
        player.play().catch(() => { });
        return;
    }
    const yt = document.getElementById('profile-yt-frame');
    if (yt) {
        try {
            yt.contentWindow?.postMessage(JSON.stringify({ event: 'command', func: 'seekTo', args: [secs, true] }), '*');
            yt.contentWindow?.postMessage(JSON.stringify({ event: 'command', func: 'playVideo', args: [] }), '*');
        }
        catch (_e) { }
    }
}
// ─── FORM ────────────────────────────────────────────────────
let _expN = 0, _eduN = 0, _projN = 0, _langN = 0, _chN = 0;
function resetForm() {
    ($('form-page-title')).textContent = 'Nouveau profil';
    [
        'f-id', 'f-firstname', 'f-lastname', 'f-specialty', 'f-school', 'f-promo',
        'f-city', 'f-bio', 'f-skills', 'f-goal', 'f-email', 'f-linkedin', 'f-github',
        'f-media-url',
    ].forEach((id) => {
        const el = document.getElementById(id);
        if (el)
            el.value = '';
    });
    $('f-status').value = 'stage';
    $('f-media-type').value = '';
    $('f-media-data').value = '';
    const prev = $('photo-prev');
    prev.style.display = 'none';
    prev.src = '';
    $('photo-hint').style.display = '';
    $('media-preview-wrap').style.display = 'none';
    $('media-preview-el').innerHTML = '';
    $('chapters-card').style.display = 'none';
    $('exp-list').innerHTML = '';
    $('edu-list').innerHTML = '';
    $('proj-list').innerHTML = '';
    $('lang-list').innerHTML = '';
    $('chapters-list').innerHTML = '';
    $('form-msg').textContent = '';
    _expN = _eduN = _projN = _langN = _chN = 0;
    addEduRow();
    addExpRow();
    addLangRow();
    switchTab('file');
}
async function editProfile(id) {
    navigateTo('add');
    const p = await dbGetOne(id);
    if (!p)
        return;
    $('form-page-title').textContent = 'Modifier le profil';
    ($('f-id')).value = String(p.id);
    ($('f-firstname')).value = p.firstname || '';
    ($('f-lastname')).value = p.lastname || '';
    ($('f-specialty')).value = p.specialty || '';
    ($('f-school')).value = p.school || '';
    ($('f-promo')).value = p.promo || '';
    ($('f-city')).value = p.city || '';
    ($('f-bio')).value = p.bio || '';
    ($('f-skills')).value = p.skills || '';
    ($('f-goal')).value = p.goal || '';
    ($('f-email')).value = p.email || '';
    ($('f-linkedin')).value = p.linkedin || '';
    ($('f-github')).value = p.github || '';
    ($('f-status')).value = p.status || 'stage';
    ($('f-media-type')).value = p.mediaType || '';
    ($('f-media-data')).value = p.mediaData || '';
    if (p.photo) {
        const prev = $('photo-prev');
        prev.src = p.photo;
        prev.style.display = 'block';
        $('photo-hint').style.display = 'none';
    }
    if (p.mediaType && p.mediaData)
        showMediaPreview(p.mediaType, p.mediaData);
    $('exp-list').innerHTML = '';
    _expN = 0;
    (p.experiences ?? []).forEach((e) => addExpRow(e));
    if (!p.experiences?.length)
        addExpRow();
    $('edu-list').innerHTML = '';
    _eduN = 0;
    (p.education ?? []).forEach((e) => addEduRow(e));
    if (!p.education?.length)
        addEduRow();
    $('proj-list').innerHTML = '';
    _projN = 0;
    (p.projects ?? []).forEach((e) => addProjRow(e));
    $('lang-list').innerHTML = '';
    _langN = 0;
    (p.languages ?? []).forEach((l) => addLangRow(l));
    if (!p.languages?.length)
        addLangRow();
    $('chapters-list').innerHTML = '';
    _chN = 0;
    if (p.chapters?.length) {
        $('chapters-card').style.display = '';
        p.chapters.forEach((ch) => addChapterRow(ch));
    }
}
// Dynamic rows ─────────────────────────────────────────────
function addExpRow(d = {}) {
    const i = ++_expN;
    $('exp-list').insertAdjacentHTML('beforeend', `<div class="drow" id="exp-${i}">
      <button class="drow-remove" onclick="this.closest('.drow').remove()">✕</button>
      <div class="g2">
        <input id="ex-org-${i}"    placeholder="Entreprise / Organisation" value="${d.org || ''}">
        <input id="ex-role-${i}"   placeholder="Poste / Mission"           value="${d.role || ''}">
      </div>
      <div class="g2">
        <input id="ex-period-${i}" placeholder="Période (ex: Juin–Août 2024)" value="${d.period || ''}">
        <input id="ex-loc-${i}"    placeholder="Lieu (optionnel)"             value="${d.loc || ''}">
      </div>
      <input id="ex-desc-${i}" placeholder="Description de la mission…" value="${d.desc || ''}">
    </div>`);
}
function addEduRow(d = {}) {
    const i = ++_eduN;
    $('edu-list').insertAdjacentHTML('beforeend', `<div class="drow" id="edu-${i}">
      <button class="drow-remove" onclick="this.closest('.drow').remove()">✕</button>
      <div class="g2">
        <input id="ed-school-${i}" placeholder="École / Université" value="${d.school || ''}">
        <input id="ed-degree-${i}" placeholder="Diplôme / Niveau"   value="${d.degree || ''}">
      </div>
      <input id="ed-year-${i}" placeholder="Année (ex: 2023–2025)" value="${d.year || ''}">
    </div>`);
}
function addProjRow(d = {}) {
    const i = ++_projN;
    $('proj-list').insertAdjacentHTML('beforeend', `<div class="drow" id="proj-${i}">
      <button class="drow-remove" onclick="this.closest('.drow').remove()">✕</button>
      <div class="g2">
        <input id="pr-name-${i}"  placeholder="Nom du projet"  value="${d.name || ''}">
        <input id="pr-stack-${i}" placeholder="Technologies"   value="${d.stack || ''}">
      </div>
      <div class="g2">
        <input id="pr-url-${i}"  placeholder="Lien (GitHub, live…)" value="${d.url || ''}">
        <input id="pr-year-${i}" placeholder="Année"                 value="${d.year || ''}">
      </div>
      <input id="pr-desc-${i}" placeholder="Description du projet…" value="${d.desc || ''}">
    </div>`);
}
function addLangRow(d = {}) {
    const i = ++_langN;
    $('lang-list').insertAdjacentHTML('beforeend', `<div class="drow" id="lang-${i}">
      <button class="drow-remove" onclick="this.closest('.drow').remove()">✕</button>
      <div class="g2">
        <input id="ln-lang-${i}"  placeholder="Langue (ex: Français)" value="${d.lang || ''}">
        <input id="ln-level-${i}" placeholder="Niveau (ex: Natif, B2)" value="${d.level || ''}">
      </div>
    </div>`);
}
function addChapterRow(d = {}) {
    const i = ++_chN;
    $('chapters-list').insertAdjacentHTML('beforeend', `<div class="chapter-row" id="ch-${i}">
      <input id="ch-time-${i}"  placeholder="0:30" value="${d.time || ''}" style="font-family:var(--mono)">
      <input id="ch-title-${i}" placeholder="Titre du chapitre (ex: Formation, Stage…)" value="${d.title || ''}">
      <button onclick="document.getElementById('ch-${i}').remove()">✕</button>
    </div>
    <div style="margin-bottom:4px">
      <input id="ch-desc-${i}" placeholder="Description courte (optionnel)" value="${d.desc || ''}"
        style="width:100%;background:var(--bg4);border:1px solid var(--border);border-radius:var(--r3);padding:7px 10px;color:var(--t1);font-family:var(--font);font-size:12px;outline:none;margin-bottom:6px">
    </div>`);
}
function collectRows(listId, prefix, fields) {
    return [...$(listId).querySelectorAll('.drow')]
        .map((row) => {
        const id = row.id.replace(`${prefix}-`, '');
        const obj = {};
        fields.forEach((f) => {
            const el = document.getElementById(f.id.replace('N', id));
            obj[f.key] = el ? el.value.trim() : '';
        });
        return obj;
    })
        .filter((o) => Object.values(o).some((v) => v));
}
function collectChapters() {
    const out = [];
    for (let i = 1; i <= _chN; i++) {
        const row = document.getElementById(`ch-${i}`);
        if (row) {
            const t = document.getElementById(`ch-time-${i}`)?.value?.trim() ?? '';
            const ti = document.getElementById(`ch-title-${i}`)?.value?.trim() ?? '';
            const d = document.getElementById(`ch-desc-${i}`)?.value?.trim() ?? '';
            if (t || ti)
                out.push({ time: t, title: ti, desc: d });
        }
    }
    return out;
}
// ─── SAVE ────────────────────────────────────────────────────
async function saveProfile() {
    const first = $('f-firstname').value.trim();
    const last = $('f-lastname').value.trim();
    const spec = $('f-specialty').value.trim();
    if (!first || !last || !spec) {
        showMsg('⚠️ Prénom, nom et filière sont obligatoires', 'err');
        return;
    }
    const photoEl = $('photo-prev');
    const photo = photoEl.src && photoEl.src !== window.location.href ? photoEl.src : '';
    const profile = {
        firstname: first,
        lastname: last,
        specialty: spec,
        school: $('f-school').value.trim(),
        promo: $('f-promo').value.trim(),
        city: $('f-city').value.trim(),
        bio: $('f-bio').value.trim(),
        skills: $('f-skills').value.trim(),
        goal: $('f-goal').value.trim(),
        email: $('f-email').value.trim(),
        linkedin: $('f-linkedin').value.trim(),
        github: $('f-github').value.trim(),
        status: $('f-status').value,
        photo,
        mediaType: $('f-media-type').value,
        mediaData: $('f-media-data').value,
        experiences: collectRows('exp-list', 'exp', [
            { id: 'ex-org-N', key: 'org' },
            { id: 'ex-role-N', key: 'role' },
            { id: 'ex-period-N', key: 'period' },
            { id: 'ex-loc-N', key: 'loc' },
            { id: 'ex-desc-N', key: 'desc' },
        ]),
        education: collectRows('edu-list', 'edu', [
            { id: 'ed-school-N', key: 'school' },
            { id: 'ed-degree-N', key: 'degree' },
            { id: 'ed-year-N', key: 'year' },
        ]),
        projects: collectRows('proj-list', 'proj', [
            { id: 'pr-name-N', key: 'name' },
            { id: 'pr-stack-N', key: 'stack' },
            { id: 'pr-url-N', key: 'url' },
            { id: 'pr-year-N', key: 'year' },
            { id: 'pr-desc-N', key: 'desc' },
        ]),
        languages: collectRows('lang-list', 'lang', [
            { id: 'ln-lang-N', key: 'lang' },
            { id: 'ln-level-N', key: 'level' },
        ]),
        chapters: collectChapters(),
    };
    try {
        const existId = $('f-id').value;
        if (existId) {
            const updated = { ...profile, id: Number(existId) };
            await dbUpdate(updated);
            toast('✅ Profil mis à jour !', 'ok');
        }
        else {
            await dbCreate(profile);
            toast('✅ Profil créé !', 'ok');
        }
        showMsg('✅ Enregistré !', 'ok');
        setTimeout(() => navigateTo('members'), 700);
    }
    catch (err) {
        console.error(err);
        showMsg(`❌ Erreur : ${err.message}`, 'err');
    }
}
function showMsg(msg, type) {
    const el = $('form-msg');
    el.textContent = msg;
    el.className = `form-msg ${type}`;
    setTimeout(() => (el.textContent = ''), 4000);
}
// ─── PHOTO ───────────────────────────────────────────────────
function handlePhoto(e) {
    const file = e.target.files?.[0];
    if (!file)
        return;
    if (file.size > 4 * 1024 * 1024) {
        toast('⚠️ Photo trop lourde (max 4 Mo)', 'err');
        return;
    }
    const r = new FileReader();
    r.onload = (ev) => {
        const prev = $('photo-prev');
        prev.src = ev.target?.result;
        prev.style.display = 'block';
        $('photo-hint').style.display = 'none';
    };
    r.readAsDataURL(file);
}
// ─── MEDIA UPLOAD ────────────────────────────────────────────
function switchTab(tab) {
    $('tab-file').style.display = tab === 'file' ? '' : 'none';
    $('tab-url').style.display = tab === 'url' ? '' : 'none';
    $('mtab-btn-file').classList.toggle('active', tab === 'file');
    $('mtab-btn-url').classList.toggle('active', tab === 'url');
}
function handleMediaDrop(e) {
    e.preventDefault();
    $('media-drop').classList.remove('drag');
    const file = e.dataTransfer?.files[0];
    if (file)
        processMediaFile(file);
}
function handleMediaFile(e) {
    const file = e.target.files?.[0];
    if (file)
        processMediaFile(file);
}
function processMediaFile(file) {
    const isVideo = file.type.startsWith('video/');
    const isAudio = file.type.startsWith('audio/');
    if (!isVideo && !isAudio) {
        toast('⚠️ Format non supporté', 'err');
        return;
    }
    const maxMb = isVideo ? 200 : 50;
    if (file.size > maxMb * 1024 * 1024) {
        toast(`⚠️ Fichier trop lourd (max ${maxMb} Mo)`, 'err');
        return;
    }
    toast('⏳ Chargement du fichier…');
    const r = new FileReader();
    r.onload = (ev) => {
        const type = isVideo ? 'video' : 'audio';
        const data = ev.target?.result;
        $('f-media-type').value = type;
        $('f-media-data').value = data;
        showMediaPreview(type, data);
        $('chapters-card').style.display = '';
        if ($('chapters-list').children.length === 0)
            addChapterRow();
        toast('✅ Fichier chargé !', 'ok');
    };
    r.readAsDataURL(file);
}
function previewUrl() {
    const url = $('f-media-url').value.trim();
    const embed = youtubeEmbed(url);
    if (!embed) {
        toast('URL YouTube ou Vimeo invalide', 'err');
        return;
    }
    $('f-media-type').value = 'yt';
    $('f-media-data').value = embed;
    showMediaPreview('yt', embed);
    $('chapters-card').style.display = '';
    if ($('chapters-list').children.length === 0)
        addChapterRow();
}
function showMediaPreview(type, data) {
    const wrap = $('media-preview-wrap');
    const el = $('media-preview-el');
    wrap.style.display = '';
    if (type === 'video') {
        el.innerHTML = `<video controls style="width:100%;border-radius:var(--r2);aspect-ratio:16/9;background:#000">
      <source src="${data}"></video>`;
    }
    else if (type === 'audio') {
        el.innerHTML = `
      <div style="background:var(--bg3);border-radius:var(--r2);padding:16px;text-align:center;color:var(--t3);font-size:13px;margin-bottom:6px">🎵 Fichier audio chargé</div>
      <audio controls style="width:100%;display:block"><source src="${data}"></audio>`;
    }
    else if (type === 'yt') {
        el.innerHTML = `<iframe src="${data}" frameborder="0" allowfullscreen style="width:100%;aspect-ratio:16/9;border-radius:var(--r2);display:block"></iframe>`;
    }
}
function clearMedia() {
    $('f-media-type').value = '';
    $('f-media-data').value = '';
    $('media-preview-wrap').style.display = 'none';
    $('media-preview-el').innerHTML = '';
    $('chapters-card').style.display = 'none';
    $('chapters-list').innerHTML = '';
    _chN = 0;
    const fi = document.getElementById('f-media-file');
    if (fi)
        fi.value = '';
}
// ─── DELETE ──────────────────────────────────────────────────
async function deleteProfile(id) {
    if (!confirm('Supprimer ce profil définitivement ?'))
        return;
    await dbDelete(id);
    toast('🗑 Profil supprimé');
    if (currentPage === 'home')
        renderHome();
    else if (currentPage === 'members')
        renderMembers();
    else
        navigateTo('members');
}
// ─── SETTINGS ────────────────────────────────────────────────
async function renderSettings() {
    const all = await dbGetAll();
    const size = Math.round(JSON.stringify(all).length / 1024);
    $('db-info').innerHTML = `
    Nom&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: <b>index.db</b><br>
    Profils&nbsp;&nbsp;&nbsp;&nbsp;: <b>${all.length}</b><br>
    Taille&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: <b>~${size} Ko</b><br>
    Mis à jour : <b>${all.length ? formatDate(Math.max(...all.map((p) => p.updatedAt ?? 0))) : '—'}</b>
  `;
}
async function exportDB() {
    const json = await dbExport();
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([json], { type: 'application/json' }));
    a.download = `campuscv-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    toast('📤 Export réussi', 'ok');
}
async function importDB(e) {
    const file = e.target.files?.[0];
    if (!file)
        return;
    try {
        const n = await dbImport(await file.text());
        toast(`📥 ${n} profils importés`, 'ok');
        renderSettings();
    }
    catch (_err) {
        toast('❌ Erreur import', 'err');
    }
    e.target.value = '';
}
async function clearAll() {
    if (!confirm('Supprimer TOUS les profils ? Action irréversible.'))
        return;
    await dbDeleteAll();
    toast('🗑 Base vidée');
    renderSettings();
}
// ─── DEMO DATA ───────────────────────────────────────────────
const DEMO = [
    {
        firstname: 'Amina', lastname: 'Koné', specialty: 'Génie Logiciel — Web & Mobile',
        school: "IUT d'Abidjan", promo: '2025', city: 'Abidjan, Côte d\'Ivoire',
        bio: "Étudiante passionnée par le développement web fullstack et l'expérience utilisateur. Je construis des applications modernes avec React et Node.js, et j'adore les défis techniques.",
        skills: 'React, Node.js, TypeScript, MongoDB, Figma, Git, TailwindCSS',
        goal: "Stage de fin d'études en développement web",
        email: 'amina.kone@example.com', linkedin: 'https://linkedin.com',
        github: 'https://github.com', status: 'stage',
        mediaType: 'yt', mediaData: 'https://www.youtube.com/embed/aircAruvnKk?enablejsapi=1&rel=0',
        experiences: [
            { org: 'Startup Techno Africa', role: 'Développeuse Front-end (stagiaire)', period: 'Juil–Sept 2024', desc: 'Développement de composants React pour une plateforme e-commerce.' },
        ],
        education: [{ school: "IUT d'Abidjan", degree: 'DUT Informatique', year: '2023–2025' }],
        projects: [{ name: 'BudgetTrack', stack: 'React · Firebase', url: 'https://github.com', desc: 'Application de suivi budgétaire avec graphiques temps réel.' }],
        languages: [{ lang: 'Français', level: 'Natif' }, { lang: 'Anglais', level: 'B2' }, { lang: 'Dioula', level: 'Natif' }],
        chapters: [
            { time: '0:00', title: 'Introduction', desc: 'Présentation générale' },
            { time: '0:45', title: 'Formation', desc: "IUT d'Abidjan — Génie Logiciel" },
            { time: '1:30', title: 'Stage Techno Africa', desc: 'Développeuse Front-end' },
            { time: '2:15', title: 'Projet BudgetTrack', desc: 'Application React/Firebase' },
            { time: '3:00', title: 'Compétences & objectif', desc: 'Stage en développement web' },
        ],
    },
    {
        firstname: 'Julien', lastname: 'Martin', specialty: 'Data Science & Intelligence Artificielle',
        school: 'Université Paris-Saclay', promo: 'Master 1 · 2025', city: 'Paris, France',
        bio: 'Étudiant en Master Data Science, fasciné par le Machine Learning et la visualisation de données.',
        skills: 'Python, Pandas, Scikit-learn, TensorFlow, SQL, Power BI, R',
        goal: 'Alternance Data Scientist',
        email: 'julien.martin@example.com', status: 'alternance',
        mediaType: '', mediaData: '',
        experiences: [{ org: 'INSEE', role: 'Analyste données (stage)', period: 'Été 2024', desc: "Analyse de jeux de données socio-économiques." }],
        education: [
            { school: 'Université Paris-Saclay', degree: 'Master 1 Data Science', year: '2024–2025' },
            { school: 'IUT Orsay', degree: 'BUT Statistiques & Informatique', year: '2021–2024' },
        ],
        projects: [{ name: 'PredictMétéo', stack: 'Python · Streamlit', desc: 'Modèle de prédiction météo avec données open data.' }],
        languages: [{ lang: 'Français', level: 'Natif' }, { lang: 'Anglais', level: 'C1' }],
        chapters: [],
    },
    {
        firstname: 'Fatima', lastname: 'Bah', specialty: 'UX/UI Design & Expérience Numérique',
        school: 'ESAG Conakry', promo: '2024', city: 'Conakry, Guinée',
        bio: "Designer UX passionnée par la création d'interfaces inclusives et accessibles.",
        skills: 'Figma, Adobe XD, Prototyping, User Research, Accessibilité, HTML/CSS',
        goal: 'Premier emploi en design UX',
        email: 'fatima.bah@example.com', github: 'https://behance.net', status: 'emploi',
        mediaType: '', mediaData: '',
        experiences: [{ org: 'ONG NumériqueAfrique', role: 'Designer UI bénévole', period: '2023–2024', desc: 'Refonte du site web.' }],
        education: [{ school: 'ESAG Conakry', degree: 'Licence Communication Visuelle', year: '2021–2024' }],
        projects: [{ name: 'AppSanté Mobile', stack: 'Figma · Prototype', desc: "Conception d'une app de suivi de santé." }],
        languages: [{ lang: 'Français', level: 'Natif' }, { lang: 'Anglais', level: 'B1' }, { lang: 'Peul', level: 'Natif' }],
        chapters: [],
    },
    {
        firstname: 'Thomas', lastname: 'Nguyen', specialty: 'Cybersécurité & Réseaux',
        school: 'EPITA Lyon', promo: '2025', city: 'Lyon, France',
        bio: "Passionné par la sécurité des systèmes d'information, je me spécialise en pentest.",
        skills: 'Kali Linux, Metasploit, Wireshark, Python, C, Cryptographie, OWASP',
        goal: 'Stage en cybersécurité / pentest',
        email: 'thomas.nguyen@example.com', github: 'https://github.com', status: 'stage',
        mediaType: '', mediaData: '',
        experiences: [{ org: 'DSI Université Lyon 3', role: 'Assistant sécurité', period: '2024', desc: 'Audit de sécurité des postes étudiants.' }],
        education: [{ school: 'EPITA Lyon', degree: 'Cycle ingénieur — Sécurité', year: '2022–2025' }],
        projects: [{ name: 'CTF WriteUps', stack: 'GitHub · Markdown', url: 'https://github.com', desc: 'Write-ups de compétitions CTF.' }],
        languages: [{ lang: 'Français', level: 'Natif' }, { lang: 'Anglais', level: 'C1' }, { lang: 'Vietnamien', level: 'B1' }],
        chapters: [],
    },
];
async function seedDemo() {
    const n = await dbCount();
    if (n > 0)
        return;
    for (const p of DEMO)
        await dbCreate({ ...p });
}
window.__app = {
    navigateTo, goBack, openProfile, editProfile, deleteProfile,
    saveProfile, resetForm, doSearch, renderMembers, renderSettings,
    exportDB, importDB, clearAll, handlePhoto, handleMediaFile,
    handleMediaDrop, previewUrl, clearMedia, switchTab,
    addExpRow, addEduRow, addProjRow, addLangRow, addChapterRow,
    seekChapter, closeSidebar,
};
// ─── BOOT ────────────────────────────────────────────────────
(async () => {
    await seedDemo();
    navigateTo('home');
})();
