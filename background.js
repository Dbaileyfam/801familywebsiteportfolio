(function () {
  const canvas = document.getElementById("bg-canvas");
  const scene = document.querySelector(".bg-scene");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;

  if (!canvas || reducedMotion) {
    if (canvas) canvas.remove();
    return;
  }

  const ctx = canvas.getContext("2d");
  let width = 0;
  let height = 0;
  let particles = [];
  let mouseX = 0.5;
  let mouseY = 0.3;
  let scrollY = 0;

  const COUNT = coarsePointer ? 28 : 52;
  const CONNECT_DIST = coarsePointer ? 90 : 120;

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    initParticles();
  }

  function initParticles() {
    particles = Array.from({ length: COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.8 + 0.6,
      hue: Math.random() > 0.5 ? 18 : 280,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    const parallaxX = (mouseX - 0.5) * 18;
    const parallaxY = (mouseY - 0.5) * 12 + scrollY * 0.02;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      const px = p.x + parallaxX;
      const py = p.y + parallaxY;

      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = px - (q.x + parallaxX);
        const dy = py - (q.y + parallaxY);
        const dist = Math.hypot(dx, dy);
        if (dist < CONNECT_DIST) {
          const alpha = (1 - dist / CONNECT_DIST) * 0.12;
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(q.x + parallaxX, q.y + parallaxY);
          ctx.stroke();
        }
      }

      const glow = ctx.createRadialGradient(px, py, 0, px, py, p.r * 4);
      glow.addColorStop(0, `hsla(${p.hue}, 90%, 65%, 0.35)`);
      glow.addColorStop(1, "transparent");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(px, py, p.r * 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = `hsla(${p.hue}, 80%, 75%, 0.55)`;
      ctx.beginPath();
      ctx.arc(px, py, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize);
  window.addEventListener(
    "scroll",
    () => {
      scrollY = window.scrollY;
    },
    { passive: true }
  );

  if (window.matchMedia("(pointer: fine)").matches) {
    scene?.classList.add("is-parallax");
    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX / window.innerWidth;
      mouseY = e.clientY / window.innerHeight;
      if (scene) {
        const aurora = scene.querySelector(".bg-aurora");
        if (aurora) {
          aurora.style.transform = `translate(${(mouseX - 0.5) * -24}px, ${(mouseY - 0.5) * -16}px)`;
        }
      }
    });
  }

  resize();
  draw();
})();
