/* Interactive particle network background (Three.js r134)
   - theme colours (gold + emerald), drifting particles joined by faint lines
   - mouse + scroll parallax, pauses when the tab is hidden, lighter on phones */
(function () {
  const container = document.getElementById("three-container");
  if (!container || typeof THREE === "undefined") return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = window.innerWidth < 768;
  const COUNT = isMobile ? 70 : 130;
  const LINK_DIST = isMobile ? 22 : 24;
  const BOUND = 70;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 55;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !isMobile });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  // particles
  const pos = new Float32Array(COUNT * 3);
  const vel = new Float32Array(COUNT * 3);
  const col = new Float32Array(COUNT * 3);
  const gold = new THREE.Color(0xf5b942), green = new THREE.Color(0x10d9a0);
  for (let i = 0; i < COUNT; i++) {
    pos[i * 3]     = (Math.random() - 0.5) * BOUND * 2;
    pos[i * 3 + 1] = (Math.random() - 0.5) * BOUND * 1.3;
    pos[i * 3 + 2] = (Math.random() - 0.5) * BOUND;
    vel[i * 3]     = (Math.random() - 0.5) * 0.06;
    vel[i * 3 + 1] = (Math.random() - 0.5) * 0.06;
    vel[i * 3 + 2] = (Math.random() - 0.5) * 0.03;
    const c = Math.random() < 0.3 ? gold : green;
    col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  pGeo.setAttribute("color", new THREE.BufferAttribute(col, 3));
  // soft round sprite so particles are dots, not squares
  const cv = document.createElement("canvas");
  cv.width = cv.height = 64;
  const cx = cv.getContext("2d");
  const grad = cx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.35, "rgba(255,255,255,.85)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  cx.fillStyle = grad; cx.fillRect(0, 0, 64, 64);
  const points = new THREE.Points(pGeo, new THREE.PointsMaterial({
    size: isMobile ? 1.5 : 1.3, map: new THREE.CanvasTexture(cv), vertexColors: true,
    transparent: true, opacity: 0.85, sizeAttenuation: true, depthWrite: false, alphaTest: 0.02
  }));
  scene.add(points);

  // connecting lines
  const MAX_LINES = COUNT * 6;
  const lPos = new Float32Array(MAX_LINES * 6);
  const lGeo = new THREE.BufferGeometry();
  lGeo.setAttribute("position", new THREE.BufferAttribute(lPos, 3));
  lGeo.setDrawRange(0, 0);
  const lines = new THREE.LineSegments(lGeo, new THREE.LineBasicMaterial({
    color: 0x10d9a0, transparent: true, opacity: 0.12
  }));
  scene.add(lines);

  // input
  let mx = 0, my = 0, tx = 0, ty = 0, scrollY = 0;
  window.addEventListener("mousemove", (e) => {
    mx = (e.clientX / window.innerWidth - 0.5) * 2;
    my = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });
  window.addEventListener("scroll", () => { scrollY = window.scrollY; }, { passive: true });

  function updateLines() {
    let n = 0;
    const d2max = LINK_DIST * LINK_DIST;
    for (let i = 0; i < COUNT && n < MAX_LINES; i++) {
      const ax = pos[i * 3], ay = pos[i * 3 + 1], az = pos[i * 3 + 2];
      for (let j = i + 1; j < COUNT && n < MAX_LINES; j++) {
        const dx = ax - pos[j * 3], dy = ay - pos[j * 3 + 1], dz = az - pos[j * 3 + 2];
        if (dx * dx + dy * dy + dz * dz < d2max) {
          const o = n * 6;
          lPos[o] = ax; lPos[o + 1] = ay; lPos[o + 2] = az;
          lPos[o + 3] = pos[j * 3]; lPos[o + 4] = pos[j * 3 + 1]; lPos[o + 5] = pos[j * 3 + 2];
          n++;
        }
      }
    }
    lGeo.setDrawRange(0, n * 2);
    lGeo.attributes.position.needsUpdate = true;
  }

  let running = true;
  document.addEventListener("visibilitychange", () => {
    running = !document.hidden;
    if (running) animate();
  });

  function animate() {
    if (!running) return;
    requestAnimationFrame(animate);

    if (!reduceMotion) {
      for (let i = 0; i < COUNT; i++) {
        for (let k = 0; k < 3; k++) {
          const idx = i * 3 + k;
          pos[idx] += vel[idx];
          const lim = k === 0 ? BOUND : k === 1 ? BOUND * 0.65 : BOUND * 0.5;
          if (pos[idx] > lim || pos[idx] < -lim) vel[idx] *= -1;
        }
      }
      pGeo.attributes.position.needsUpdate = true;
      updateLines();
    }

    // eased parallax towards the mouse, plus a gentle scroll-driven drift
    tx += (mx - tx) * 0.04;
    ty += (my - ty) * 0.04;
    const rotY = tx * 0.18 + scrollY * 0.00035;
    const rotX = ty * 0.1;
    points.rotation.y = lines.rotation.y = rotY;
    points.rotation.x = lines.rotation.x = rotX;
    camera.position.y = -scrollY * 0.004 % 20;

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();
