(function () {
  const P = window.PORTFOLIO;
  const vis = window.visivel;
  const pagina = document.body.dataset.pagina;
  const reduz = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const meses = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  const data = (iso) => {
    if (!iso) return "";
    const [a, m, d] = iso.split("-");
    return `${Number(d)} ${meses[Number(m) - 1]} ${a}`;
  };
  const slug = (url) => String(url || "").replace(/\/+$/, "").split("/").pop();
  const carimbo = (item) => (item.confirmado ? "" : '<span class="carimbo">a confirmar</span>');

  /* ---------- Ajustes salvos pela prévia editável ----------
     Na versão publicada vale só window.AJUSTES (assets/js/ajustes.js).
     No servidor de edição local, o rascunho em andamento tem prioridade. */
  const local = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
  window.AJUSTES_ATIVOS = window.AJUSTES || {};
  if (local) {
    try {
      const r = JSON.parse(localStorage.getItem("portfolio-ajustes-rascunho") || "null");
      if (r && r.__base === (window.AJUSTES_VERSAO || "")) window.AJUSTES_ATIVOS = r;
      else if (r) { // rascunho feito sobre outra versão: guardado à parte, sem sobrescrever o que está salvo
        localStorage.setItem("portfolio-ajustes-rascunho-antigo", JSON.stringify(r));
        localStorage.removeItem("portfolio-ajustes-rascunho");
      }
    } catch (_) {}
  }
  const AJ = () => window.AJUSTES_ATIVOS || {};
  const ordena = (lista, chave, idDe) => {
    const ord = AJ().ordem && AJ().ordem[chave];
    if (!ord) return lista;
    const pos = new Map(ord.map((id, i) => [id, i]));
    const p = (x) => (pos.has(idDe(x)) ? pos.get(idDe(x)) : 999);
    return [...lista].sort((a, b) => p(a) - p(b));
  };
  const capaDe = (orig) => (AJ().capas && AJ().capas[orig]) || orig;

  /* ---------- Modo rascunho (itens a confirmar) ---------- */
  if (window.RASCUNHO) {
    document.querySelectorAll('a[href$=".html"]').forEach((a) => { a.href = a.getAttribute("href") + "?rascunho"; });
    const alvo = document.querySelector("[data-aviso]");
    if (alvo) {
      const aviso = document.createElement("p");
      aviso.className = "aviso-rascunho";
      aviso.textContent = "Modo rascunho: itens marcados “a confirmar” não aparecem no link enviado.";
      alvo.prepend(aviso);
    }
  }

  /* ---------- Folha de textos (hover que revela o trecho) ---------- */
  const folhaTexto = (t, opc) => `
    <li class="texto${opc.capa ? "" : " simples"}"${opc.capa && t.capa ? ` data-tamanho data-controles="tam"` : ""}>
      <a href="${esc(t.link)}" target="_blank" rel="noopener">
        ${t.trecho ? `<div class="verso"><p>“${esc(t.trecho)}”</p></div>` : ""}
        <div class="rosto">
          ${opc.capa && t.capa ? `<div class="capa-post"><img src="${esc(t.capa)}" alt="" loading="lazy" data-capa="${esc(t.capa)}" data-capa-chave="textos.capa.${esc(slug(t.link))}" data-enquadrar="textos.capa.${esc(slug(t.link))}"></div>` : ""}
          ${opc.logo ? `<img class="logo-fb" src="${esc(opc.logo)}" alt="">` : ""}
          <div class="corpo-folha">
            <time datetime="${esc(t.data)}">${data(t.data)}</time>
            <h3>${esc(t.titulo)}</h3>
            ${t.subtitulo ? `<p class="subtitulo">${esc(t.subtitulo)}</p>` : ""}
            ${carimbo(t)}
            <span class="ler">Ler em ${esc(opc.onde)}<span class="sr"> (abre em nova aba)</span></span>
          </div>
        </div>
      </a>
    </li>`;

  if (pagina === "textos") {
    const A = P.autorais;
    document.getElementById("autorais").innerHTML = `
      <section class="frente-textos fb" aria-labelledby="t-fb">
        <header>
          <h2 id="t-fb" class="arte-fb"><img src="assets/img/marca/fake-blonde-arte.jpg" width="1000" height="702" alt="Fake Blonde Loves You"></h2>
          <div>
            ${(A.descricao || []).map((p, i) => `<p data-editavel="textos.fb.${i}">${esc(p)}</p>`).join("")}
            ${A.assinatura ? `<p class="assinatura"><em>${esc(A.assinatura)}</em></p>` : ""}
            <p class="credito">${esc(A.credito)}</p>
          </div>
        </header>
        <ul class="folhas">${A.textos.filter(vis).map((t) => folhaTexto(t, { capa: true, logo: A.logo, onde: A.plataforma })).join("")}</ul>
      </section>`;
  }

  if (pagina === "outros-textos") {
    document.getElementById("outros").innerHTML = P.outros
      .map((f) => {
        const itens = f.textos.filter(vis);
        if (!itens.length) return "";
        return `
        <section class="frente-textos" id="${f.id}" aria-labelledby="t-${f.id}">
          <header>
            <h2 id="t-${f.id}"><span>${esc(f.nome)}<small>pela ${esc(f.contexto)}</small></span></h2>
            <div>
              <p>${esc(f.nota)}</p>
              <p class="credito">${esc(f.credito)}</p>
            </div>
          </header>
          <ul class="folhas">${itens.map((t) => folhaTexto(t, { capa: false, onde: f.nome })).join("")}</ul>
        </section>`;
      })
      .join("");
  }

  /* ---------- Visualizador (fotos, slides de um carrossel, vídeos) ---------- */
  const dlg = document.getElementById("lightbox");
  let lb = { itens: [], atual: 0, origem: null };
  if (dlg) {
    const palco = dlg.querySelector(".palco");
    const cont = dlg.querySelector("[data-contador]");
    const leg = dlg.querySelector(".legenda");
    const setas = dlg.querySelectorAll(".seta");
    const mostrar = (n) => {
      lb.atual = (n + lb.itens.length) % lb.itens.length;
      const it = lb.itens[lb.atual];
      palco.innerHTML = it.tipo === "video"
        ? `<video src="${esc(it.src)}" poster="${esc(it.capa || "")}" controls autoplay playsinline aria-label="${esc(it.alt)}"></video>`
        : `<img src="${esc(it.src)}" alt="${esc(it.alt)}">`;
      cont.textContent = lb.itens.length > 1 ? `${lb.atual + 1}/${lb.itens.length}` : "";
      leg.textContent = it.legenda || "";
      setas.forEach((s) => (s.hidden = lb.itens.length < 2));
    };
    const fechar = (viaHistorico) => {
      if (!dlg.open) return;
      dlg.close();
      palco.innerHTML = "";
      if (!viaHistorico && history.state && history.state.ampliado) history.back();
    };
    dlg.addEventListener("close", () => lb.origem && lb.origem.focus({ preventScroll: true }));
    dlg.querySelector(".fechar").addEventListener("click", () => fechar(false));
    dlg.querySelector(".ant").addEventListener("click", () => mostrar(lb.atual - 1));
    dlg.querySelector(".prox").addEventListener("click", () => mostrar(lb.atual + 1));
    dlg.addEventListener("cancel", (e) => { e.preventDefault(); fechar(false); });
    palco.addEventListener("click", (e) => { if (e.target === palco) fechar(false); });
    document.addEventListener("keydown", (e) => {
      if (!dlg.open || lb.itens.length < 2) return;
      if (e.key === "ArrowRight") mostrar(lb.atual + 1);
      if (e.key === "ArrowLeft") mostrar(lb.atual - 1);
    });
    window.addEventListener("popstate", () => fechar(true));
    let x0 = null;
    dlg.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; }, { passive: true });
    dlg.addEventListener("touchend", (e) => {
      if (x0 === null || lb.itens.length < 2) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 50) mostrar(lb.atual + (dx < 0 ? 1 : -1));
      x0 = null;
    });
    window.abrirVisualizador = (itens, n, origem) => {
      lb = { itens, atual: 0, origem };
      mostrar(n || 0);
      dlg.showModal();
      history.pushState({ ampliado: true }, "");
    };
  }

  /* ---------- Fotografia ---------- */
  if (pagina === "fotografia") {
    const ficha = document.querySelector("[data-ficha]");
    if (ficha) ficha.textContent = P.fotografia.ficha;
    const src = (f, p) => `assets/img/fotos/${f.arquivo}${p ? "-p" : ""}.jpg`;
    const legenda = (f) => [f.lugar, f.data, f.filme].filter(Boolean).join(" · ");
    const medidas = {};
    const medir = (f) =>
      medidas[f.arquivo] ? Promise.resolve({ ...f, ...medidas[f.arquivo] }) : new Promise((ok) => {
        const im = new Image();
        im.onload = () => { medidas[f.arquivo] = { w: im.naturalWidth, h: im.naturalHeight }; ok({ ...f, ...medidas[f.arquivo] }); };
        im.onerror = () => ok({ ...f, w: 3, h: 2 });
        im.src = src(f, true);
      });
    const gal = document.getElementById("galeria");
    let lista = [];
    window.renderFotografia = () => {
      const fotos = ordena(P.fotografia.fotos.filter(vis), "fotos", (f) => f.arquivo);
      return Promise.all(fotos.map(medir)).then((l) => {
        lista = l;
        const linhas = [];
        let i = 0, grande = true;
        while (i < lista.length) {
          if (grande || i === lista.length - 1) { linhas.push([i]); i += 1; }
          else { linhas.push([i, i + 1]); i += 2; }
          grande = !grande;
        }
        const fig = (idx, flex) => {
          const f = lista[idx];
          const leg = legenda(f);
          return `<figure style="${flex ? `flex:${(f.w / f.h).toFixed(3)} 1 0` : ""}" data-foto="${f.arquivo}">
            <button type="button" data-i="${idx}" aria-label="Ampliar foto ${idx + 1} de ${lista.length}">
              <img src="${src(f, true)}" width="${f.w}" height="${f.h}" loading="${idx < 3 ? "eager" : "lazy"}" alt="Fotografia analógica ${idx + 1}${leg ? ", " + esc(leg) : ""}">
            </button>
            ${leg ? `<figcaption>${esc(leg)}</figcaption>` : ""}
          </figure>`;
        };
        gal.innerHTML = linhas
          .map((l) => (l.length === 1
            ? `<div class="linha grande ${lista[l[0]].w >= lista[l[0]].h ? "paisagem" : "retrato"}">${fig(l[0], false)}</div>`
            : `<div class="linha par">${fig(l[0], true)}${fig(l[1], true)}</div>`))
          .join("");
      });
    };
    window.renderFotografia();
    gal.addEventListener("click", (e) => {
      const b = e.target.closest("button[data-i]");
      if (!b || !window.abrirVisualizador) return;
      const itens = lista.map((f, n) => ({ tipo: "imagem", src: src(f, false), alt: `Fotografia analógica ${n + 1}`, legenda: legenda(f) || P.fotografia.ficha }));
      window.abrirVisualizador(itens, Number(b.dataset.i), b);
    });
  }

  /* ---------- Trabalhos ---------- */
  // peças do case, com as mudanças da prévia (AJ.midias substitui a lista inteira do case)
  window.pecasDoCase = (ci) => {
    const soc = P.trabalhos.find((t) => t.cases);
    const m = AJ().midias && AJ().midias[`case:${ci}`];
    return m || (soc ? soc.cases[ci].pecas : []);
  };
  const capaDaPeca = (p) => p.capa || (p.tipo === "carrossel" ? (p.slides || [])[0] : p.src) || "";

  if (pagina === "trabalhos") {
    const iconeTipo = (p) =>
      p.tipo === "video" ? '<span class="play" aria-hidden="true"></span>'
      : p.tipo === "carrossel" ? `<span class="paginas" aria-hidden="true">1/${(p.slides || []).length}</span>` : "";
    const rotulo = (p) => (p.tipo === "video" ? "Assistir" : p.tipo === "carrossel" ? `Abrir carrossel (${(p.slides || []).length} páginas)` : "Ampliar");

    const social = (t) => `
      <article class="projeto social" id="${t.id}">
        <div class="topo">
          <div class="mosaico" aria-hidden="true">${t.mosaico.map((s) => `<img src="${esc(s)}" alt="">`).join("")}</div>
          <div>
            <p class="papel">${esc(t.papel)}${carimbo(t)}</p>
            <h2>${esc(t.titulo)}</h2>
            <div class="intro">${t.texto.map((p, i) => `<p data-editavel="trabalhos.social.${i}">${esc(p)}</p>`).join("")}</div>
          </div>
        </div>
        ${t.cases.map((c, ci) => `
          <section class="case" aria-labelledby="case-${ci}" data-case="${ci}">
            <header>
              <div>
                <h3 id="case-${ci}">${esc(c.cliente)}</h3>
                <p>${esc(c.descricao)}</p>
              </div>
              <div class="carrossel-ctrl">
                <button type="button" data-dir="-1" aria-label="Voltar na vitrine de ${esc(c.cliente)}">←</button>
                <button type="button" data-dir="1" aria-label="Avançar na vitrine de ${esc(c.cliente)}">→</button>
              </div>
            </header>
            <ul class="carrossel" tabindex="0" aria-label="Trabalhos para ${esc(c.cliente)}"></ul>
          </section>`).join("")}
      </article>`;

    const projeto = (t) => {
      const links = (t.links || []).filter((l) => l.confirmado !== false || window.RASCUNHO);
      return `
      <article class="projeto${t.emBreve ? " em-breve" : ""}" id="${t.id}">
        <div class="topo">
          <div class="capa${t.capaFormato === "retrato" ? " retrato" : ""}">
            <img src="${esc(capaDe(t.capa))}" alt="Capa do projeto ${esc(t.titulo)}" loading="lazy" data-capa="${esc(t.capa)}" data-enquadrar="capa.${t.id}">
            ${t.emBreve ? '<span class="selo-breve">Em breve</span>' : ""}
          </div>
          <div>
            <p class="papel">${esc(t.papel)}${carimbo(t)}</p>
            <h2>${esc(t.titulo)}</h2>
            ${!t.emBreve && t.texto && t.texto.length ? `<button type="button" class="abrir-projeto" aria-expanded="false" aria-controls="aberto-${t.id}">Ler sobre o projeto</button>` : ""}
            <p class="resumo">${esc(t.resumo)}</p>
            ${links.length ? `<ul class="links">${links.map((l) => `<li><a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.rotulo)} ↗</a></li>`).join("")}</ul>` : ""}
          </div>
        </div>
        ${!t.emBreve && t.texto && t.texto.length
          ? `<div class="aberto" id="aberto-${t.id}" hidden>${t.texto.map((p) => `<p>${esc(p)}</p>`).join("")}${t.galeria && t.galeria.length ? `<div class="galeria-projeto">${t.galeria.map((s, i) => `<figure style="margin:0" class="${i === 0 ? "destaque" : ""}"><img src="${esc(s)}" alt="" loading="lazy"></figure>`).join("")}</div>` : ""}</div>`
          : ""}
      </article>`;
    };

    const lista = P.trabalhos.filter(vis);
    document.getElementById("projetos").innerHTML = lista.map((t) => (t.tipo === "social" ? social(t) : projeto(t))).join("");

    // vitrine de cada cliente: redesenha na hora quando a prévia muda as mídias
    window.renderVitrine = (ci) => {
      const ul = document.querySelector(`.case[data-case="${ci}"] .carrossel`);
      if (!ul) return;
      ul.innerHTML = window.pecasDoCase(ci).map((p, pi) => `
        <li data-id="${esc(p.id)}" class="peca-${esc(p.tipo)}"><figure><button type="button" data-case="${ci}" data-i="${pi}" aria-label="${rotulo(p)}: ${esc(p.alt)}">
          <span class="quadro-peca"><img src="${esc(capaDaPeca(p))}" alt="${esc(p.alt)}" loading="lazy"${p.tipo === "video" ? ` data-enquadrar="peca.${esc(p.id)}"` : ""}></span>${iconeTipo(p)}
        </button></figure></li>`).join("");
      ul.dispatchEvent(new Event("scroll"));
      if (window.aplicarAjustesDOM) window.aplicarAjustesDOM();
    };
    document.querySelectorAll(".case").forEach((sec) => {
      const ci = Number(sec.dataset.case);
      window.renderVitrine(ci);
      const trilho = sec.querySelector(".carrossel");
      const [ant, prox] = sec.querySelectorAll(".carrossel-ctrl button");
      const atualiza = () => {
        ant.disabled = trilho.scrollLeft < 8;
        prox.disabled = trilho.scrollLeft + trilho.clientWidth > trilho.scrollWidth - 8;
      };
      sec.querySelectorAll(".carrossel-ctrl button").forEach((b) =>
        b.addEventListener("click", () => trilho.scrollBy({ left: Number(b.dataset.dir) * trilho.clientWidth * 0.8, behavior: reduz ? "auto" : "smooth" })));
      trilho.addEventListener("scroll", atualiza, { passive: true });
      addEventListener("resize", atualiza);
      setTimeout(atualiza, 300);
      // abrir uma peça: carrossel -> só os slides daquele post; vídeo -> player; imagem -> ela
      trilho.addEventListener("click", (e) => {
        const b = e.target.closest("button[data-i]");
        if (!b || !window.abrirVisualizador || document.body.classList.contains("ed-ativo")) return;
        const p = window.pecasDoCase(ci)[Number(b.dataset.i)];
        const cliente = P.trabalhos.find((t) => t.cases).cases[ci].cliente;
        const legenda = `${cliente} · ${p.alt}`;
        const itens = p.tipo === "carrossel"
          ? (p.slides || []).map((s, k) => ({ tipo: "imagem", src: s, alt: `${p.alt}, página ${k + 1}`, legenda }))
          : [{ tipo: p.tipo === "video" ? "video" : "imagem", src: p.src, capa: p.capa, alt: p.alt, legenda }];
        window.abrirVisualizador(itens, 0, b);
      });
    });

    document.querySelectorAll(".abrir-projeto").forEach((b) => {
      b.addEventListener("click", () => {
        const alvo = document.getElementById(b.getAttribute("aria-controls"));
        const abrir = b.getAttribute("aria-expanded") !== "true";
        b.setAttribute("aria-expanded", String(abrir));
        b.textContent = abrir ? "Fechar o projeto" : "Ler sobre o projeto";
        alvo.hidden = !abrir;
      });
    });
  }

  /* ---------- Ajustes de texto, enquadramento e capas (também na versão publicada) ---------- */
  window.aplicarAjustesDOM = function (aj) {
    aj = aj || AJ();
    document.querySelectorAll("[data-editavel]").forEach((el) => {
      if (el.dataset.original == null) el.dataset.original = el.innerHTML;
      const v = aj.textos && aj.textos[el.dataset.editavel];
      el.innerHTML = v != null ? v : el.dataset.original;
    });
    document.querySelectorAll("[data-enquadrar]").forEach((el) => {
      const e = aj.enquadrar && aj.enquadrar[el.dataset.enquadrar];
      el.style.objectPosition = e ? `${e.x}% ${e.y}%` : "";
      el.style.transform = e && e.zoom && e.zoom !== 1 ? `scale(${e.zoom})` : "";
      el.style.transformOrigin = e ? `${e.x}% ${e.y}%` : "";
      const quadro = el.closest("[data-tamanho]");
      if (quadro) {
        quadro.style.setProperty("--tam", e && e.tam ? e.tam : 1);
        quadro.style.setProperty("--prop", e && e.prop ? e.prop : "");
        quadro.style.setProperty("--acima", e && e.acima != null ? e.acima : "");
        if (!(e && e.prop)) quadro.style.removeProperty("--prop");
        if (!(e && e.acima != null)) quadro.style.removeProperty("--acima");
      }
    });
    document.querySelectorAll("img[data-capa]").forEach((img) => {
      const chave = img.dataset.capaChave || img.dataset.capa;
      const alvo = (aj.capas && aj.capas[chave]) || img.dataset.capa;
      if (img.getAttribute("src") !== alvo) img.setAttribute("src", alvo);
    });
  };
  window.aplicarAjustesDOM();

  /* ---------- Coraçõezinhos no hover/foco (como no Readymag) ---------- */
  if (!reduz) {
    const solta = (el) => {
      if (el._coracoes && Date.now() - el._coracoes < 700) return;
      el._coracoes = Date.now();
      const r = el.getBoundingClientRect();
      for (let i = 0; i < 3; i++) {
        const c = document.createElement("span");
        c.className = "coracao-voa";
        c.style.left = `${r.left + scrollX + r.width * (0.25 + 0.25 * i) - 7}px`;
        c.style.top = `${r.top + scrollY - 4}px`;
        c.style.setProperty("--dx", `${(i - 1) * 10}px`);
        c.style.setProperty("--rot", `${(i - 1) * 14}deg`);
        c.style.animationDelay = `${i * 90}ms`;
        document.body.appendChild(c);
        setTimeout(() => c.remove(), 1300);
      }
    };
    document.querySelectorAll("[data-coracoes]").forEach((el) => {
      el.addEventListener("mouseenter", () => solta(el));
      el.addEventListener("focus", () => solta(el));
    });
  }
})();
