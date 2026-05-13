(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))o(s);new MutationObserver(s=>{for(const n of s)if(n.type==="childList")for(const r of n.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&o(r)}).observe(document,{childList:!0,subtree:!0});function a(s){const n={};return s.integrity&&(n.integrity=s.integrity),s.referrerPolicy&&(n.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?n.credentials="include":s.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function o(s){if(s.ep)return;s.ep=!0;const n=a(s);fetch(s.href,n)}})();const de="index.db",pe=1,p="profiles";let k=null;function g(){return new Promise((e,t)=>{if(k)return e(k);const a=indexedDB.open(de,pe);a.onupgradeneeded=o=>{const s=o.target.result;if(!s.objectStoreNames.contains(p)){const n=s.createObjectStore(p,{keyPath:"id",autoIncrement:!0});n.createIndex("lastname","lastname",{unique:!1}),n.createIndex("school","school",{unique:!1}),n.createIndex("promo","promo",{unique:!1}),n.createIndex("createdAt","createdAt",{unique:!1})}},a.onsuccess=o=>{k=o.target.result,e(k)},a.onerror=o=>t(o.target.error)})}async function z(e){const t=await g();return new Promise((a,o)=>{const s={...e,createdAt:Date.now(),updatedAt:Date.now()},n=t.transaction(p,"readwrite").objectStore(p).add(s);n.onsuccess=r=>a(r.target.result),n.onerror=r=>o(r.target.error)})}async function $(){const e=await g();return new Promise((t,a)=>{const o=e.transaction(p,"readonly").objectStore(p).getAll();o.onsuccess=s=>t(s.target.result),o.onerror=s=>a(s.target.error)})}async function V(e){const t=await g();return new Promise((a,o)=>{const s=t.transaction(p,"readonly").objectStore(p).get(e);s.onsuccess=n=>a(n.target.result),s.onerror=n=>o(n.target.error)})}async function ue(e){const t=await g();return new Promise((a,o)=>{const s={...e,updatedAt:Date.now()},n=t.transaction(p,"readwrite").objectStore(p).put(s);n.onsuccess=()=>a(),n.onerror=r=>o(r.target.error)})}async function me(e){const t=await g();return new Promise((a,o)=>{const s=t.transaction(p,"readwrite").objectStore(p).delete(e);s.onsuccess=()=>a(),s.onerror=n=>o(n.target.error)})}async function ve(){const e=await g();return new Promise((t,a)=>{const o=e.transaction(p,"readwrite").objectStore(p).clear();o.onsuccess=()=>t(),o.onerror=s=>a(s.target.error)})}async function fe(){const e=await g();return new Promise((t,a)=>{const o=e.transaction(p,"readonly").objectStore(p).count();o.onsuccess=s=>t(s.target.result),o.onerror=s=>a(s.target.error)})}async function ge(){return JSON.stringify(await $(),null,2)}async function he(e){const t=JSON.parse(e),a=await g();return new Promise((o,s)=>{const n=a.transaction(p,"readwrite"),r=n.objectStore(p);let l=0;for(const d of t){const c={...d};delete c.id,r.add(c),l++}n.oncomplete=()=>o(l),n.onerror=d=>s(d.target.error)})}function i(e){const t=document.getElementById(e);if(!t)throw new Error(`Element #${e} not found`);return t}function ye(e){return document.querySelector(e)}let O;function f(e,t=""){const a=i("toast");a.textContent=e,a.className=`toast show ${t}`,clearTimeout(O),O=setTimeout(()=>a.className="toast",3200)}function G(e){let t=0;for(const a of e)t=t*31+a.charCodeAt(0)&65535;return"av"+t%6}function J(e="",t=""){return((e[0]??"")+(t[0]??"")).toUpperCase()||"?"}const be={stage:"Cherche stage",alternance:"Alternance",emploi:"1er emploi",these:"Thèse",freelance:"Freelance",indisponible:"Indisponible"};function W(e){return be[e]??e}function K(e){return`st-${e||"indisponible"}`}function X(e){return e?new Date(e).toLocaleDateString("fr-FR",{day:"2-digit",month:"short",year:"numeric"}):""}function N(e){if(!e)return 0;if(e.includes(":")){const[t,a]=e.split(":").map(Number);return(t||0)*60+(a||0)}return parseFloat(e)||0}function $e(e){const t=e.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);if(t)return`https://www.youtube.com/embed/${t[1]}?enablejsapi=1&rel=0`;const a=e.match(/vimeo\.com\/(\d+)/);return a?`https://player.vimeo.com/video/${a[1]}`:""}function Y(e){return(e??"").split(",").map(t=>t.trim()).filter(Boolean)}let b="home",x="members";function h(e){var a,o;x=b,document.querySelectorAll(".page").forEach(s=>s.classList.remove("active")),document.querySelectorAll(".nav-item").forEach(s=>s.classList.remove("active")),i(`page-${e}`).classList.add("active"),(a=ye(`[data-page="${e}"]`))==null||a.classList.add("active"),b=e,Q();const t={home:Z,members:C,add:te,search:()=>{i("search-q").value="",D([])},settings:j};(o=t[e])==null||o.call(t),window.scrollTo({top:0,behavior:"smooth"})}function we(){h(x==="profile"?"members":x)}document.querySelectorAll(".nav-item").forEach(e=>{e.addEventListener("click",t=>{t.preventDefault();const a=e.dataset.page;h(a)})});i("hamburger").addEventListener("click",()=>{i("sidebar").classList.toggle("open"),i("overlay").classList.toggle("show")});function Q(){i("sidebar").classList.remove("open"),i("overlay").classList.remove("show")}async function Z(){const e=await $();i("sc-total").textContent=String(e.length),i("sc-media").textContent=String(e.filter(s=>s.mediaType).length),i("sc-schools").textContent=String(new Set(e.map(s=>s.school).filter(Boolean)).size),i("sc-promos").textContent=String(new Set(e.map(s=>s.promo).filter(Boolean)).size);const t=[...e].sort((s,n)=>(n.createdAt??0)-(s.createdAt??0)).slice(0,8),a=i("home-grid"),o=i("home-empty");if(!e.length){a.innerHTML="",o.style.display="";return}o.style.display="none",a.innerHTML=t.map(I).join(""),H()}async function C(){const e=await $(),t=[...new Set(e.map(c=>c.promo).filter(Boolean))].sort(),a=i("filter-promo"),o=a.value;a.innerHTML='<option value="">Toutes promotions</option>'+t.map(c=>`<option value="${c}" ${c===o?"selected":""}>${c}</option>`).join("");const s=i("filter-sort").value,n=a.value;let r=e.filter(c=>!n||c.promo===n);s==="name"?r.sort((c,u)=>(c.lastname||"").localeCompare(u.lastname||"")):s==="date"?r.sort((c,u)=>(u.createdAt??0)-(c.createdAt??0)):s==="school"&&r.sort((c,u)=>(c.school||"").localeCompare(u.school||""));const l=i("members-grid"),d=i("members-empty");if(!r.length){l.innerHTML="",d.style.display="";return}d.style.display="none",l.innerHTML=r.map(I).join(""),H()}async function ke(){const e=i("search-q").value.toLowerCase().trim(),t=await $();if(!e)return D(t);const a=t.filter(o=>[o.firstname,o.lastname,o.specialty,o.school,o.promo,o.city,o.bio,o.skills,o.goal,...(o.experiences??[]).map(s=>`${s.org} ${s.role}`),...(o.projects??[]).map(s=>s.name)].join(" ").toLowerCase().includes(e));D(a)}function D(e){const t=i("search-grid"),a=i("search-empty");if(!e.length){t.innerHTML="",a.style.display="";return}a.style.display="none",t.innerHTML=e.map(I).join(""),H()}function I(e){const t=J(e.firstname,e.lastname),a=G(t),o=Y(e.skills).slice(0,4),s=e.photo?`<img src="${e.photo}" class="avatar" alt="">`:`<div class="avatar-init ${a}">${t}</div>`;let n="";return e.mediaType==="video"?n='<span class="media-badge badge-video">▶ Vidéo</span>':e.mediaType==="audio"?n='<span class="media-badge badge-audio">🎵 Audio</span>':e.mediaType==="yt"&&(n='<span class="media-badge badge-yt">▶ YouTube</span>'),`
  <div class="mcard" data-id="${e.id}">
    <div class="mcard-top">
      ${s}
      <div class="mcard-info">
        <div class="mcard-name">${e.firstname||""} ${e.lastname||""}</div>
        <div class="mcard-spec">${e.specialty||""}</div>
        <div class="mcard-school">🏫 ${e.school||""} ${e.promo?"· "+e.promo:""}</div>
      </div>
      ${n}
    </div>
    ${e.bio?`<div class="mcard-bio">${e.bio}</div>`:""}
    ${o.length?`<div class="mcard-skills">${o.map(r=>`<span class="skill-tag">${r}</span>`).join("")}</div>`:""}
    <div class="mcard-footer">
      ${e.city?`<span class="promo-tag">📍 ${e.city}</span>`:"<span></span>"}
      <span class="status-tag ${K(e.status)}">${W(e.status)}</span>
    </div>
    <div class="mcard-actions">
      <button class="btn-ghost btn-sm" style="flex:1" onclick="event.stopPropagation();window.__app.openProfile(${e.id})">Voir le profil</button>
      <button class="btn-icon" onclick="event.stopPropagation();window.__app.editProfile(${e.id})" title="Modifier">✏️</button>
      <button class="btn-icon del" onclick="event.stopPropagation();window.__app.deleteProfile(${e.id})" title="Supprimer">🗑</button>
    </div>
  </div>`}function H(){document.querySelectorAll(".mcard").forEach(e=>{e.addEventListener("click",()=>ee(Number(e.dataset.id)))})}async function ee(e){const t=await V(e);t&&(x=b,document.querySelectorAll(".page").forEach(a=>a.classList.remove("active")),i("page-profile").classList.add("active"),b="profile",i("profile-content").innerHTML=Te(t),window.scrollTo({top:0,behavior:"smooth"}),xe(t))}function Te(e){const t=J(e.firstname,e.lastname),a=G(t),o=e.photo?`<img src="${e.photo}" class="p-avatar" alt="">`:`<div class="p-avatar-init ${a}">${t}</div>`,s=Y(e.skills),n=e.experiences??[],r=e.education??[],l=e.projects??[],d=e.languages??[],c=e.chapters??[];let u="",y=!1;e.mediaType==="video"&&e.mediaData?(y=!0,u=`
      <div class="media-player-wrap">
        <video id="profile-player" controls preload="metadata">
          <source src="${e.mediaData}" type="video/mp4">
          Votre navigateur ne supporte pas la lecture vidéo.
        </video>
      </div>`):e.mediaType==="audio"&&e.mediaData?(y=!0,u=`
      <div class="media-player-wrap">
        <div class="audio-visual" id="audio-visual">
          <div class="audio-bars"><span></span><span></span><span></span><span></span><span></span></div>
          <span style="font-size:13px;color:var(--t2)">${e.firstname} ${e.lastname} — Présentation audio</span>
        </div>
        <audio id="profile-player" controls style="width:100%;padding:14px;background:var(--bg3);display:block">
          <source src="${e.mediaData}">
        </audio>
      </div>`):e.mediaType==="yt"&&e.mediaData&&(y=!0,u=`
      <div class="media-player-wrap">
        <iframe id="profile-yt-frame" src="${e.mediaData}" frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen></iframe>
      </div>`);const oe=c.length?`<div class="chapters-list" id="chapters-list">
        ${c.map((m,v)=>`
          <div class="chapter-item ${v===0?"active":""}" data-secs="${N(m.time)}" onclick="window.__app.seekChapter(this, ${N(m.time)})">
            <div class="ch-time">${m.time||"0:00"}</div>
            <div class="ch-title">${m.title||""}</div>
            ${m.desc?`<div class="ch-desc">${m.desc}</div>`:""}
          </div>`).join("")}
       </div>`:'<p style="color:var(--t3);font-size:13px">Aucun chapitre défini</p>',ne=y?`<div class="psection">
      <div class="psection-title">Présentation & Parcours synchronisé</div>
      <div class="sync-layout">
        ${u}
        <div>
          <div style="font-size:12px;color:var(--t3);margin-bottom:12px;font-weight:600;letter-spacing:.5px">
            CHAPITRES — cliquez pour naviguer dans le média
          </div>
          ${oe}
        </div>
      </div>
    </div>`:"",P=m=>m.map(v=>{const re=v.org??v.school??v.name??"",le=v.role??v.degree??v.stack??"",ce=v.period??v.year??v.url??"",R=v.desc??v.desc??"";return`
        <div class="tl-item">
          <div class="tl-left"><div class="tl-dot"></div><div class="tl-line"></div></div>
          <div class="tl-body">
            <div class="tl-org">${re}</div>
            <div class="tl-role">${le}</div>
            <div class="tl-period">${ce}</div>
            ${R?`<div class="tl-desc">${R}</div>`:""}
          </div>
        </div>`}).join("");return`
  <div class="profile-hero">
    <div class="profile-hero-inner">
      <div>${o}</div>
      <div class="p-meta">
        <div class="p-name">${e.firstname||""} ${e.lastname||""}</div>
        <div class="p-spec">${e.specialty||""}</div>
        <div class="p-tags">
          ${e.school?`<span class="p-tag">🏫 ${e.school}</span>`:""}
          ${e.promo?`<span class="p-tag">📅 Promo ${e.promo}</span>`:""}
          ${e.city?`<span class="p-tag">📍 ${e.city}</span>`:""}
          <span class="p-tag"><span class="status-tag ${K(e.status)}">${W(e.status)}</span></span>
        </div>
        <div class="p-actions">
          ${e.email?`<a href="mailto:${e.email}" class="btn-ghost btn-sm">✉️ Email</a>`:""}
          ${e.linkedin?`<a href="${e.linkedin}" target="_blank" class="btn-ghost btn-sm">in LinkedIn</a>`:""}
          ${e.github?`<a href="${e.github}" target="_blank" class="btn-ghost btn-sm">⌨ Portfolio</a>`:""}
          <button class="btn-ghost btn-sm" onclick="window.__app.editProfile(${e.id})">✏️ Modifier</button>
        </div>
      </div>
    </div>
  </div>

  <div class="profile-body">
    ${e.bio?`<div class="psection">
      <div class="psection-title">À propos</div>
      <p style="color:var(--t2);font-size:15px;line-height:1.7">${e.bio}</p>
      ${e.goal?`<p style="margin-top:12px;color:var(--accent);font-size:14px;font-weight:600">🎯 Objectif : ${e.goal}</p>`:""}
    </div>`:""}

    ${ne}

    ${s.length?`<div class="psection">
      <div class="psection-title">Compétences</div>
      <div class="skills-cloud">${s.map(m=>`<span class="skill-pill">${m}</span>`).join("")}</div>
    </div>`:""}

    ${r.length?`<div class="psection">
      <div class="psection-title">Formation</div>
      <div class="timeline">${P(r)}</div>
    </div>`:""}

    ${n.length?`<div class="psection">
      <div class="psection-title">Expériences</div>
      <div class="timeline">${P(n)}</div>
    </div>`:""}

    ${l.length?`<div class="psection">
      <div class="psection-title">Projets personnels</div>
      <div class="timeline">${P(l)}</div>
    </div>`:""}

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
      <div class="psection">
        <div class="psection-title">Contact</div>
        <div class="crows">
          ${e.email?`<div class="crow"><span class="crow-lbl">Email</span><span class="crow-val"><a href="mailto:${e.email}">${e.email}</a></span></div>`:""}
          ${e.linkedin?`<div class="crow"><span class="crow-lbl">LinkedIn</span><span class="crow-val"><a href="${e.linkedin}" target="_blank">Voir le profil</a></span></div>`:""}
          ${e.github?`<div class="crow"><span class="crow-lbl">Portfolio</span><span class="crow-val"><a href="${e.github}" target="_blank">Voir</a></span></div>`:""}
          <div class="crow"><span class="crow-lbl">Ajouté le</span><span class="crow-val" style="color:var(--t2)">${X(e.createdAt)}</span></div>
        </div>
      </div>
      ${d.length?`<div class="psection">
        <div class="psection-title">Langues</div>
        ${d.map(m=>`<div class="lang-row"><span class="lang-name">${m.lang}</span><span class="lang-level">${m.level}</span></div>`).join("")}
      </div>`:""}
    </div>
  </div>`}function xe(e){const t=document.getElementById("profile-player");if(!t)return;if(e.mediaType==="audio"){const s=document.getElementById("audio-visual");t.addEventListener("play",()=>s==null?void 0:s.classList.remove("paused")),t.addEventListener("pause",()=>s==null?void 0:s.classList.add("paused"))}const a=e.chapters??[];if(!a.length)return;const o=a.map(s=>N(s.time));t.addEventListener("timeupdate",()=>{var l;const s=t.currentTime;let n=0;for(let d=0;d<o.length;d++)s>=(o[d]??0)&&(n=d);const r=document.querySelectorAll(".chapter-item");r.forEach((d,c)=>d.classList.toggle("active",c===n)),(l=r[n])==null||l.scrollIntoView({block:"nearest",behavior:"smooth"})})}function Le(e,t){var s,n;document.querySelectorAll(".chapter-item").forEach(r=>r.classList.remove("active")),e.classList.add("active");const a=document.getElementById("profile-player");if(a){a.currentTime=t,a.play().catch(()=>{});return}const o=document.getElementById("profile-yt-frame");if(o)try{(s=o.contentWindow)==null||s.postMessage(JSON.stringify({event:"command",func:"seekTo",args:[t,!0]}),"*"),(n=o.contentWindow)==null||n.postMessage(JSON.stringify({event:"command",func:"playVideo",args:[]}),"*")}catch{}}let B=0,q=0,F=0,_=0,w=0;function te(){i("form-page-title").textContent="Nouveau profil",["f-id","f-firstname","f-lastname","f-specialty","f-school","f-promo","f-city","f-bio","f-skills","f-goal","f-email","f-linkedin","f-github","f-media-url"].forEach(t=>{const a=document.getElementById(t);a&&(a.value="")}),i("f-status").value="stage",i("f-media-type").value="",i("f-media-data").value="";const e=i("photo-prev");e.style.display="none",e.src="",i("photo-hint").style.display="",i("media-preview-wrap").style.display="none",i("media-preview-el").innerHTML="",i("chapters-card").style.display="none",i("exp-list").innerHTML="",i("edu-list").innerHTML="",i("proj-list").innerHTML="",i("lang-list").innerHTML="",i("chapters-list").innerHTML="",i("form-msg").textContent="",B=q=F=_=w=0,S(),L(),A(),ae("file")}async function Se(e){var a,o,s,n;h("add");const t=await V(e);if(t){if(i("form-page-title").textContent="Modifier le profil",i("f-id").value=String(t.id),i("f-firstname").value=t.firstname||"",i("f-lastname").value=t.lastname||"",i("f-specialty").value=t.specialty||"",i("f-school").value=t.school||"",i("f-promo").value=t.promo||"",i("f-city").value=t.city||"",i("f-bio").value=t.bio||"",i("f-skills").value=t.skills||"",i("f-goal").value=t.goal||"",i("f-email").value=t.email||"",i("f-linkedin").value=t.linkedin||"",i("f-github").value=t.github||"",i("f-status").value=t.status||"stage",i("f-media-type").value=t.mediaType||"",i("f-media-data").value=t.mediaData||"",t.photo){const r=i("photo-prev");r.src=t.photo,r.style.display="block",i("photo-hint").style.display="none"}t.mediaType&&t.mediaData&&U(t.mediaType,t.mediaData),i("exp-list").innerHTML="",B=0,(t.experiences??[]).forEach(r=>L(r)),(a=t.experiences)!=null&&a.length||L(),i("edu-list").innerHTML="",q=0,(t.education??[]).forEach(r=>S(r)),(o=t.education)!=null&&o.length||S(),i("proj-list").innerHTML="",F=0,(t.projects??[]).forEach(r=>ie(r)),i("lang-list").innerHTML="",_=0,(t.languages??[]).forEach(r=>A(r)),(s=t.languages)!=null&&s.length||A(),i("chapters-list").innerHTML="",w=0,(n=t.chapters)!=null&&n.length&&(i("chapters-card").style.display="",t.chapters.forEach(r=>M(r)))}}function L(e={}){const t=++B;i("exp-list").insertAdjacentHTML("beforeend",`<div class="drow" id="exp-${t}">
      <button class="drow-remove" onclick="this.closest('.drow').remove()">✕</button>
      <div class="g2">
        <input id="ex-org-${t}"    placeholder="Entreprise / Organisation" value="${e.org||""}">
        <input id="ex-role-${t}"   placeholder="Poste / Mission"           value="${e.role||""}">
      </div>
      <div class="g2">
        <input id="ex-period-${t}" placeholder="Période (ex: Juin–Août 2024)" value="${e.period||""}">
        <input id="ex-loc-${t}"    placeholder="Lieu (optionnel)"             value="${e.loc||""}">
      </div>
      <input id="ex-desc-${t}" placeholder="Description de la mission…" value="${e.desc||""}">
    </div>`)}function S(e={}){const t=++q;i("edu-list").insertAdjacentHTML("beforeend",`<div class="drow" id="edu-${t}">
      <button class="drow-remove" onclick="this.closest('.drow').remove()">✕</button>
      <div class="g2">
        <input id="ed-school-${t}" placeholder="École / Université" value="${e.school||""}">
        <input id="ed-degree-${t}" placeholder="Diplôme / Niveau"   value="${e.degree||""}">
      </div>
      <input id="ed-year-${t}" placeholder="Année (ex: 2023–2025)" value="${e.year||""}">
    </div>`)}function ie(e={}){const t=++F;i("proj-list").insertAdjacentHTML("beforeend",`<div class="drow" id="proj-${t}">
      <button class="drow-remove" onclick="this.closest('.drow').remove()">✕</button>
      <div class="g2">
        <input id="pr-name-${t}"  placeholder="Nom du projet"  value="${e.name||""}">
        <input id="pr-stack-${t}" placeholder="Technologies"   value="${e.stack||""}">
      </div>
      <div class="g2">
        <input id="pr-url-${t}"  placeholder="Lien (GitHub, live…)" value="${e.url||""}">
        <input id="pr-year-${t}" placeholder="Année"                 value="${e.year||""}">
      </div>
      <input id="pr-desc-${t}" placeholder="Description du projet…" value="${e.desc||""}">
    </div>`)}function A(e={}){const t=++_;i("lang-list").insertAdjacentHTML("beforeend",`<div class="drow" id="lang-${t}">
      <button class="drow-remove" onclick="this.closest('.drow').remove()">✕</button>
      <div class="g2">
        <input id="ln-lang-${t}"  placeholder="Langue (ex: Français)" value="${e.lang||""}">
        <input id="ln-level-${t}" placeholder="Niveau (ex: Natif, B2)" value="${e.level||""}">
      </div>
    </div>`)}function M(e={}){const t=++w;i("chapters-list").insertAdjacentHTML("beforeend",`<div class="chapter-row" id="ch-${t}">
      <input id="ch-time-${t}"  placeholder="0:30" value="${e.time||""}" style="font-family:var(--mono)">
      <input id="ch-title-${t}" placeholder="Titre du chapitre (ex: Formation, Stage…)" value="${e.title||""}">
      <button onclick="document.getElementById('ch-${t}').remove()">✕</button>
    </div>
    <div style="margin-bottom:4px">
      <input id="ch-desc-${t}" placeholder="Description courte (optionnel)" value="${e.desc||""}"
        style="width:100%;background:var(--bg4);border:1px solid var(--border);border-radius:var(--r3);padding:7px 10px;color:var(--t1);font-family:var(--font);font-size:12px;outline:none;margin-bottom:6px">
    </div>`)}function T(e,t,a){return[...i(e).querySelectorAll(".drow")].map(o=>{const s=o.id.replace(`${t}-`,""),n={};return a.forEach(r=>{const l=document.getElementById(r.id.replace("N",s));n[r.key]=l?l.value.trim():""}),n}).filter(o=>Object.values(o).some(s=>s))}function Ae(){var t,a,o,s,n,r;const e=[];for(let l=1;l<=w;l++)if(document.getElementById(`ch-${l}`)){const c=((a=(t=document.getElementById(`ch-time-${l}`))==null?void 0:t.value)==null?void 0:a.trim())??"",u=((s=(o=document.getElementById(`ch-title-${l}`))==null?void 0:o.value)==null?void 0:s.trim())??"",y=((r=(n=document.getElementById(`ch-desc-${l}`))==null?void 0:n.value)==null?void 0:r.trim())??"";(c||u)&&e.push({time:c,title:u,desc:y})}return e}async function Me(){const e=i("f-firstname").value.trim(),t=i("f-lastname").value.trim(),a=i("f-specialty").value.trim();if(!e||!t||!a){E("⚠️ Prénom, nom et filière sont obligatoires","err");return}const o=i("photo-prev"),s=o.src&&o.src!==window.location.href?o.src:"",n={firstname:e,lastname:t,specialty:a,school:i("f-school").value.trim(),promo:i("f-promo").value.trim(),city:i("f-city").value.trim(),bio:i("f-bio").value.trim(),skills:i("f-skills").value.trim(),goal:i("f-goal").value.trim(),email:i("f-email").value.trim(),linkedin:i("f-linkedin").value.trim(),github:i("f-github").value.trim(),status:i("f-status").value,photo:s,mediaType:i("f-media-type").value,mediaData:i("f-media-data").value,experiences:T("exp-list","exp",[{id:"ex-org-N",key:"org"},{id:"ex-role-N",key:"role"},{id:"ex-period-N",key:"period"},{id:"ex-loc-N",key:"loc"},{id:"ex-desc-N",key:"desc"}]),education:T("edu-list","edu",[{id:"ed-school-N",key:"school"},{id:"ed-degree-N",key:"degree"},{id:"ed-year-N",key:"year"}]),projects:T("proj-list","proj",[{id:"pr-name-N",key:"name"},{id:"pr-stack-N",key:"stack"},{id:"pr-url-N",key:"url"},{id:"pr-year-N",key:"year"},{id:"pr-desc-N",key:"desc"}]),languages:T("lang-list","lang",[{id:"ln-lang-N",key:"lang"},{id:"ln-level-N",key:"level"}]),chapters:Ae()};try{const r=i("f-id").value;if(r){const l={...n,id:Number(r)};await ue(l),f("✅ Profil mis à jour !","ok")}else await z(n),f("✅ Profil créé !","ok");E("✅ Enregistré !","ok"),setTimeout(()=>h("members"),700)}catch(r){console.error(r),E(`❌ Erreur : ${r.message}`,"err")}}function E(e,t){const a=i("form-msg");a.textContent=e,a.className=`form-msg ${t}`,setTimeout(()=>a.textContent="",4e3)}function je(e){var o;const t=(o=e.target.files)==null?void 0:o[0];if(!t)return;if(t.size>4*1024*1024){f("⚠️ Photo trop lourde (max 4 Mo)","err");return}const a=new FileReader;a.onload=s=>{var r;const n=i("photo-prev");n.src=(r=s.target)==null?void 0:r.result,n.style.display="block",i("photo-hint").style.display="none"},a.readAsDataURL(t)}function ae(e){i("tab-file").style.display=e==="file"?"":"none",i("tab-url").style.display=e==="url"?"":"none",i("mtab-btn-file").classList.toggle("active",e==="file"),i("mtab-btn-url").classList.toggle("active",e==="url")}function Pe(e){var a;e.preventDefault(),i("media-drop").classList.remove("drag");const t=(a=e.dataTransfer)==null?void 0:a.files[0];t&&se(t)}function Ee(e){var a;const t=(a=e.target.files)==null?void 0:a[0];t&&se(t)}function se(e){const t=e.type.startsWith("video/"),a=e.type.startsWith("audio/");if(!t&&!a){f("⚠️ Format non supporté","err");return}const o=t?200:50;if(e.size>o*1024*1024){f(`⚠️ Fichier trop lourd (max ${o} Mo)`,"err");return}f("⏳ Chargement du fichier…");const s=new FileReader;s.onload=n=>{var d;const r=t?"video":"audio",l=(d=n.target)==null?void 0:d.result;i("f-media-type").value=r,i("f-media-data").value=l,U(r,l),i("chapters-card").style.display="",i("chapters-list").children.length===0&&M(),f("✅ Fichier chargé !","ok")},s.readAsDataURL(e)}function Ne(){const e=i("f-media-url").value.trim(),t=$e(e);if(!t){f("URL YouTube ou Vimeo invalide","err");return}i("f-media-type").value="yt",i("f-media-data").value=t,U("yt",t),i("chapters-card").style.display="",i("chapters-list").children.length===0&&M()}function U(e,t){const a=i("media-preview-wrap"),o=i("media-preview-el");a.style.display="",e==="video"?o.innerHTML=`<video controls style="width:100%;border-radius:var(--r2);aspect-ratio:16/9;background:#000">
      <source src="${t}"></video>`:e==="audio"?o.innerHTML=`
      <div style="background:var(--bg3);border-radius:var(--r2);padding:16px;text-align:center;color:var(--t3);font-size:13px;margin-bottom:6px">🎵 Fichier audio chargé</div>
      <audio controls style="width:100%;display:block"><source src="${t}"></audio>`:e==="yt"&&(o.innerHTML=`<iframe src="${t}" frameborder="0" allowfullscreen style="width:100%;aspect-ratio:16/9;border-radius:var(--r2);display:block"></iframe>`)}function De(){i("f-media-type").value="",i("f-media-data").value="",i("media-preview-wrap").style.display="none",i("media-preview-el").innerHTML="",i("chapters-card").style.display="none",i("chapters-list").innerHTML="",w=0;const e=document.getElementById("f-media-file");e&&(e.value="")}async function Ce(e){confirm("Supprimer ce profil définitivement ?")&&(await me(e),f("🗑 Profil supprimé"),b==="home"?Z():b==="members"?C():h("members"))}async function j(){const e=await $(),t=Math.round(JSON.stringify(e).length/1024);i("db-info").innerHTML=`
    Nom&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: <b>index.db</b><br>
    Profils&nbsp;&nbsp;&nbsp;&nbsp;: <b>${e.length}</b><br>
    Taille&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: <b>~${t} Ko</b><br>
    Mis à jour : <b>${e.length?X(Math.max(...e.map(a=>a.updatedAt??0))):"—"}</b>
  `}async function Ie(){const e=await ge(),t=document.createElement("a");t.href=URL.createObjectURL(new Blob([e],{type:"application/json"})),t.download=`campuscv-${new Date().toISOString().slice(0,10)}.json`,t.click(),f("📤 Export réussi","ok")}async function He(e){var a;const t=(a=e.target.files)==null?void 0:a[0];if(t){try{const o=await he(await t.text());f(`📥 ${o} profils importés`,"ok"),j()}catch{f("❌ Erreur import","err")}e.target.value=""}}async function Be(){confirm("Supprimer TOUS les profils ? Action irréversible.")&&(await ve(),f("🗑 Base vidée"),j())}const qe=[{firstname:"Amina",lastname:"Koné",specialty:"Génie Logiciel — Web & Mobile",school:"IUT d'Abidjan",promo:"2025",city:"Abidjan, Côte d'Ivoire",bio:"Étudiante passionnée par le développement web fullstack et l'expérience utilisateur. Je construis des applications modernes avec React et Node.js, et j'adore les défis techniques.",skills:"React, Node.js, TypeScript, MongoDB, Figma, Git, TailwindCSS",goal:"Stage de fin d'études en développement web",email:"amina.kone@example.com",linkedin:"https://linkedin.com",github:"https://github.com",status:"stage",mediaType:"yt",mediaData:"https://www.youtube.com/embed/aircAruvnKk?enablejsapi=1&rel=0",experiences:[{org:"Startup Techno Africa",role:"Développeuse Front-end (stagiaire)",period:"Juil–Sept 2024",desc:"Développement de composants React pour une plateforme e-commerce."}],education:[{school:"IUT d'Abidjan",degree:"DUT Informatique",year:"2023–2025"}],projects:[{name:"BudgetTrack",stack:"React · Firebase",url:"https://github.com",desc:"Application de suivi budgétaire avec graphiques temps réel."}],languages:[{lang:"Français",level:"Natif"},{lang:"Anglais",level:"B2"},{lang:"Dioula",level:"Natif"}],chapters:[{time:"0:00",title:"Introduction",desc:"Présentation générale"},{time:"0:45",title:"Formation",desc:"IUT d'Abidjan — Génie Logiciel"},{time:"1:30",title:"Stage Techno Africa",desc:"Développeuse Front-end"},{time:"2:15",title:"Projet BudgetTrack",desc:"Application React/Firebase"},{time:"3:00",title:"Compétences & objectif",desc:"Stage en développement web"}]},{firstname:"Julien",lastname:"Martin",specialty:"Data Science & Intelligence Artificielle",school:"Université Paris-Saclay",promo:"Master 1 · 2025",city:"Paris, France",bio:"Étudiant en Master Data Science, fasciné par le Machine Learning et la visualisation de données.",skills:"Python, Pandas, Scikit-learn, TensorFlow, SQL, Power BI, R",goal:"Alternance Data Scientist",email:"julien.martin@example.com",status:"alternance",mediaType:"",mediaData:"",experiences:[{org:"INSEE",role:"Analyste données (stage)",period:"Été 2024",desc:"Analyse de jeux de données socio-économiques."}],education:[{school:"Université Paris-Saclay",degree:"Master 1 Data Science",year:"2024–2025"},{school:"IUT Orsay",degree:"BUT Statistiques & Informatique",year:"2021–2024"}],projects:[{name:"PredictMétéo",stack:"Python · Streamlit",desc:"Modèle de prédiction météo avec données open data."}],languages:[{lang:"Français",level:"Natif"},{lang:"Anglais",level:"C1"}],chapters:[]},{firstname:"Fatima",lastname:"Bah",specialty:"UX/UI Design & Expérience Numérique",school:"ESAG Conakry",promo:"2024",city:"Conakry, Guinée",bio:"Designer UX passionnée par la création d'interfaces inclusives et accessibles.",skills:"Figma, Adobe XD, Prototyping, User Research, Accessibilité, HTML/CSS",goal:"Premier emploi en design UX",email:"fatima.bah@example.com",github:"https://behance.net",status:"emploi",mediaType:"",mediaData:"",experiences:[{org:"ONG NumériqueAfrique",role:"Designer UI bénévole",period:"2023–2024",desc:"Refonte du site web."}],education:[{school:"ESAG Conakry",degree:"Licence Communication Visuelle",year:"2021–2024"}],projects:[{name:"AppSanté Mobile",stack:"Figma · Prototype",desc:"Conception d'une app de suivi de santé."}],languages:[{lang:"Français",level:"Natif"},{lang:"Anglais",level:"B1"},{lang:"Peul",level:"Natif"}],chapters:[]},{firstname:"Thomas",lastname:"Nguyen",specialty:"Cybersécurité & Réseaux",school:"EPITA Lyon",promo:"2025",city:"Lyon, France",bio:"Passionné par la sécurité des systèmes d'information, je me spécialise en pentest.",skills:"Kali Linux, Metasploit, Wireshark, Python, C, Cryptographie, OWASP",goal:"Stage en cybersécurité / pentest",email:"thomas.nguyen@example.com",github:"https://github.com",status:"stage",mediaType:"",mediaData:"",experiences:[{org:"DSI Université Lyon 3",role:"Assistant sécurité",period:"2024",desc:"Audit de sécurité des postes étudiants."}],education:[{school:"EPITA Lyon",degree:"Cycle ingénieur — Sécurité",year:"2022–2025"}],projects:[{name:"CTF WriteUps",stack:"GitHub · Markdown",url:"https://github.com",desc:"Write-ups de compétitions CTF."}],languages:[{lang:"Français",level:"Natif"},{lang:"Anglais",level:"C1"},{lang:"Vietnamien",level:"B1"}],chapters:[]}];async function Fe(){if(!(await fe()>0))for(const t of qe)await z({...t})}window.__app={navigateTo:h,goBack:we,openProfile:ee,editProfile:Se,deleteProfile:Ce,saveProfile:Me,resetForm:te,doSearch:ke,renderMembers:C,renderSettings:j,exportDB:Ie,importDB:He,clearAll:Be,handlePhoto:je,handleMediaFile:Ee,handleMediaDrop:Pe,previewUrl:Ne,clearMedia:De,switchTab:ae,addExpRow:L,addEduRow:S,addProjRow:ie,addLangRow:A,addChapterRow:M,seekChapter:Le,closeSidebar:Q};(async()=>(await Fe(),h("home")))();
