/* Canon Prima: o cursor entrando dispara o flash uma vez; o clique puxa/recolhe a ponta do filme.
   No toque: flash rápido e, logo depois, a ponta do filme; o toque seguinte recolhe. */
(function () {
  const cam = document.querySelector(".camera");
  if (!cam) return;
  let ultimoTipo = "mouse";

  function flash() {
    cam.classList.remove("disparou");
    void cam.offsetWidth; // reinicia a animação
    cam.classList.add("disparou");
  }
  cam.querySelector(".flash").addEventListener("animationend", () => cam.classList.remove("disparou"));

  const filme = (abrir) => cam.setAttribute("aria-pressed", String(abrir));

  cam.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") flash(); });
  cam.addEventListener("pointerdown", (e) => { ultimoTipo = e.pointerType || "mouse"; });
  cam.addEventListener("click", () => {
    const aberto = cam.getAttribute("aria-pressed") === "true";
    if (ultimoTipo !== "mouse" && !aberto) {
      flash();
      setTimeout(() => filme(true), 260);
    } else {
      filme(!aberto);
    }
    ultimoTipo = "mouse";
  });
  // teclado: Enter/Espaço também disparam o flash ao abrir
  cam.addEventListener("keydown", (e) => {
    if ((e.key === "Enter" || e.key === " ") && cam.getAttribute("aria-pressed") !== "true") flash();
  });
})();
