/* Caneta Fake Blonde — um gesto só.
   Pressione a caneta na margem e arraste direto para o papel: ela acompanha o mouse
   ou o dedo com a ponta no ponto exato e desenha enquanto você segura.
   Ao soltar (em qualquer lugar), ela volta para a margem e o traço some aos poucos. */
(function () {
  const caneta = document.querySelector(".caneta");
  const tela = document.querySelector(".rabisco");
  if (!caneta || !tela) return;
  const folha = tela.parentElement;
  const ctx = tela.getContext("2d");
  const COR = "#e0709f";
  const SOME = 1400;
  let tracos = [], atual = null, rodando = false, segurando = null;

  document.body.appendChild(caneta); // fixa na tela: margem ou na mão
  const ponta = () => ({ x: caneta.offsetWidth / 2, y: caneta.offsetHeight * (148 / 150) });

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
  const noPapel = (x, y) => { const r = tela.getBoundingClientRect(); return { x: x - r.left, y: y - r.top }; };

  function segue(x, y) {
    const p = ponta();
    caneta.style.left = x - p.x + "px";
    caneta.style.top = y - p.y + "px";
  }
  function naMargem() {
    if (segurando !== null) return;
    const r = folha.getBoundingClientRect();
    caneta.classList.remove("na-mao");
    caneta.classList.add("na-margem");
    caneta.style.left = (innerWidth <= 900 ? 2 : Math.max(4, r.left - caneta.offsetWidth - 8)) + "px";
    caneta.style.top = Math.round(innerHeight * 0.42 - caneta.offsetHeight / 2) + "px";
  }
  addEventListener("resize", naMargem);
  setTimeout(naMargem, 0);

  // pressionar a caneta já começa o gesto
  caneta.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    segurando = e.pointerId;
    try { caneta.setPointerCapture(e.pointerId); } catch (_) {}
    caneta.classList.remove("na-margem");
    caneta.classList.add("na-mao");
    document.body.classList.add("caneta-ativa");
    segue(e.clientX, e.clientY);
    atual = { pts: [noPapel(e.clientX, e.clientY)], fim: null };
    tracos.push(atual);
    anima();
  });
  caneta.addEventListener("pointermove", (e) => {
    if (e.pointerId !== segurando) return;
    const lista = e.getCoalescedEvents ? e.getCoalescedEvents() : [];
    for (const ev of lista.length ? lista : [e]) atual.pts.push(noPapel(ev.clientX, ev.clientY));
    segue(e.clientX, e.clientY);
  });
  function soltar(e) {
    if (segurando === null || (e && e.pointerId !== segurando)) return;
    segurando = null;
    if (atual) { atual.fim = performance.now(); atual = null; anima(); }
    document.body.classList.remove("caneta-ativa");
    naMargem();
  }
  caneta.addEventListener("pointerup", soltar);
  caneta.addEventListener("pointercancel", soltar);
  caneta.addEventListener("lostpointercapture", soltar);
  caneta.addEventListener("click", (e) => e.preventDefault());
  caneta.addEventListener("dragstart", (e) => e.preventDefault());
})();
