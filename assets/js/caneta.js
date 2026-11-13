/* Caneta Fake Blonde.
   Clique/toque na caneta para pegá-la: ela acompanha o cursor (ou o dedo) com a ponta
   exatamente no ponto do desenho. Pressione e arraste sobre o papel para rabiscar;
   o traço some sozinho depois de soltar. "Devolver a caneta" ou Esc devolvem a caneta
   à margem e a navegação volta ao normal. */
(function () {
  const caneta = document.querySelector(".caneta");
  const tela = document.querySelector(".rabisco");
  const devolver = document.querySelector(".devolver-caneta");
  if (!caneta || !tela) return;
  if (devolver) document.body.appendChild(devolver); // fixo na tela, fora da folha
  document.body.appendChild(caneta); // a caneta vive fixa na tela (margem ou na mão)
  const folha = tela.parentElement;
  const ctx = tela.getContext("2d");
  const COR = "#e0709f";
  const SOME = 1400;
  // ponta da caneta: centro da largura, quase no fim da altura (desenho 24 × 150, ponta em 12, 148)
  const ponta = () => ({ x: caneta.offsetWidth / 2, y: caneta.offsetHeight * (148 / 150) });
  let tracos = [], atual = null, rodando = false, naMao = false;

  function dimensiona() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    tela.width = Math.round(folha.clientWidth * dpr);
    tela.height = Math.round(folha.clientHeight * dpr);
    tela.style.width = folha.clientWidth + "px";
    tela.style.height = folha.clientHeight + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  dimensiona();
  new ResizeObserver(dimensiona).observe(folha);
  setTimeout(naMargem, 0);

  function desenha() {
    const agora = performance.now();
    ctx.clearRect(0, 0, tela.width, tela.height);
    tracos = tracos.filter((t) => !t.fim || agora - t.fim < SOME);
    for (const t of tracos) {
      if (t.pts.length < 2) continue;
      ctx.globalAlpha = Math.max(0, t.fim ? 1 - (agora - t.fim) / SOME : 1);
      ctx.strokeStyle = COR;
      ctx.lineWidth = 2.8;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(t.pts[0].x, t.pts[0].y);
      for (let i = 1; i < t.pts.length - 1; i++) {
        const mx = (t.pts[i].x + t.pts[i + 1].x) / 2, my = (t.pts[i].y + t.pts[i + 1].y) / 2;
        ctx.quadraticCurveTo(t.pts[i].x, t.pts[i].y, mx, my);
      }
      const u = t.pts[t.pts.length - 1];
      ctx.lineTo(u.x, u.y);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    if (tracos.length) requestAnimationFrame(desenha);
    else rodando = false;
  }
  const anima = () => { if (!rodando) { rodando = true; requestAnimationFrame(desenha); } };
  const ponto = (e) => { const r = tela.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };

  // a caneta segue o ponteiro com a ponta no ponto exato
  function segue(x, y) {
    const p = ponta();
    caneta.style.left = x - p.x + "px";
    caneta.style.top = y - p.y + "px";
  }

  // em repouso: fixa na margem esquerda da folha, na altura visível da tela
  function naMargem() {
    if (naMao) return;
    const r = folha.getBoundingClientRect();
    const estreita = innerWidth <= 900;
    caneta.classList.add("na-margem");
    caneta.style.left = (estreita ? 2 : Math.max(4, r.left - caneta.offsetWidth - 8)) + "px";
    caneta.style.top = Math.round(innerHeight * 0.42 - caneta.offsetHeight / 2) + "px";
  }
  addEventListener("resize", naMargem);
  function onMove(e) { if (naMao) segue(e.clientX, e.clientY); }

  const casa = { pai: caneta.parentElement, depois: caneta.nextSibling };
  function pegar(x, y) {
    naMao = true;
    document.body.appendChild(caneta); // fora da folha, para seguir a tela inteira
    caneta.classList.remove("na-margem");
    caneta.classList.add("na-mao");
    caneta.setAttribute("aria-pressed", "true");
    document.body.classList.add("caneta-ativa");
    if (devolver) devolver.hidden = false;
    segue(x, y);
    document.addEventListener("pointermove", onMove);
  }
  function soltar() {
    if (!naMao) return;
    naMao = false;
    caneta.classList.remove("na-mao");
    naMargem(); // volta para a margem, na altura visível agora
    caneta.setAttribute("aria-pressed", "false");
    document.body.classList.remove("caneta-ativa");
    if (devolver) devolver.hidden = true;
    document.removeEventListener("pointermove", onMove);
    caneta.focus({ preventScroll: true });
  }

  caneta.addEventListener("click", (e) => {
    if (naMao) return;
    const r = caneta.getBoundingClientRect();
    // clique pelo teclado não tem coordenadas: a caneta começa perto da margem
    const x = e.clientX || r.left + r.width / 2 + 60;
    const y = e.clientY || r.top + r.height / 2;
    pegar(x, y);
  });
  if (devolver) devolver.addEventListener("click", soltar);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") soltar(); });

  tela.addEventListener("pointerdown", (e) => {
    if (!naMao) return;
    e.preventDefault();
    try { tela.setPointerCapture(e.pointerId); } catch (_) {}
    segue(e.clientX, e.clientY);
    atual = { pts: [ponto(e)], fim: null };
    tracos.push(atual);
    anima();
  });
  tela.addEventListener("pointermove", (e) => {
    if (!atual) return;
    const lista = e.getCoalescedEvents ? e.getCoalescedEvents() : [];
    for (const ev of lista.length ? lista : [e]) atual.pts.push(ponto(ev));
  });
  const fimTraco = () => { if (atual) { atual.fim = performance.now(); atual = null; anima(); } };
  tela.addEventListener("pointerup", fimTraco);
  tela.addEventListener("pointercancel", fimTraco);
})();
