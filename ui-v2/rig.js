/* Sen — rig cut-out cho doodle SVG tĩnh (v3, có lồng bộ phận)
   .rig[data-rig] chứa <img> gốc. Khi dựng: lớp tĩnh = ảnh gốc có mask khoét lỗ vùng các bộ phận cấp 1
   (lỗ thu vào `inset` px để phần chồng đen-trên-đen giấu mép); mỗi bộ phận = wrapper xoay quanh pivot
   chứa cùng ảnh cắt clip-path (khoét lỗ cho bộ phận con) + các bộ phận con lồng bên trong.
   Toạ độ theo viewBox SVG (1024×768). Tham số chốt theo REVIEW-06. */
(function () {
  const pct = (cfg) => ([x, y]) => `${(x / cfg.w * 100).toFixed(3)}% ${(y / cfg.h * 100).toFixed(3)}%`;
  const shrink = (poly, d) => {
    const cx = poly.reduce((s, p) => s + p[0], 0) / poly.length, cy = poly.reduce((s, p) => s + p[1], 0) / poly.length;
    return poly.map(([x, y]) => { const dx = cx - x, dy = cy - y, L = Math.hypot(dx, dy) || 1; return [x + dx / L * d, y + dy / L * d]; });
  };
  const maskStyle = (cfg, parts) => {
    if (!parts || !parts.length) return '';
    const holes = parts.map(p => 'M' + shrink(p.poly, p.inset).map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join('L') + 'Z').join(' ');
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${cfg.w} ${cfg.h}'><path fill='#fff' fill-rule='evenodd' d='M0 0H${cfg.w}V${cfg.h}H0Z ${holes}'/></svg>`;
    const u = `url("data:image/svg+xml,${encodeURIComponent(svg)}") 0 0/100% 100% no-repeat`;
    return `-webkit-mask:${u};mask:${u};`;
  };
  const imgLayer = (base, cls) => { const el = base.cloneNode(false); el.removeAttribute('data-static'); el.className = 'rig-layer ' + cls; el.src = base.currentSrc || base.src; return el; };

  window.SEN_RIGS = {
    /* An — cả người + ghế đung đưa quanh chân ghế sau; cẳng chân duỗi xoay thêm quanh gối, lệch pha */
    'an-rock': { w: 1024, h: 768, parts: [
      { name: 'rock', pivot: [600, 706], inset: 6, anim: 'rock',
        poly: [[0, 0], [700, 0], [706, 230], [690, 505], [676, 700], [676, 768], [0, 768]],
        children: [
          { name: 'shin', pivot: [286, 412], inset: 7, anim: 'shin',
            poly: [[300, 378], [336, 438], [214, 520], [150, 612], [58, 612], [18, 562], [58, 503], [176, 468], [240, 418]] }
        ] }
    ] },
    /* Bình — đầu yên (như bản gốc); tay chỉnh sách nhẹ, cây lắc là tiêu điểm, khói cà phê */
    'binh-life': { w: 1024, h: 768, parts: [
      { name: 'book', pivot: [468, 402], inset: 5, anim: 'book',
        poly: [[452, 228], [500, 222], [568, 244], [562, 392], [502, 452], [438, 446], [428, 396]] },
      { name: 'plant', pivot: [862, 492], inset: 6, anim: 'sway',
        poly: [[688, 290], [700, 150], [790, 112], [890, 150], [996, 188], [1002, 330], [952, 472], [882, 494], [810, 492], [770, 440], [700, 380]] }
    ], overlays: ['steam'] }
  };

  const OVERLAYS = {
    steam: (cfg) => { // khói bốc lên từ tách cà phê (~(520–620, 600–660))
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', `0 0 ${cfg.w} ${cfg.h}`); svg.setAttribute('class', 'rig-layer rig-overlay rig-steam');
      svg.innerHTML = `<g fill="none" stroke="#1d1d1d" stroke-width="3.2" stroke-linecap="round">
        <path class="wisp" d="M552 592c-8-10-2-20 4-28s8-18-2-26"/>
        <path class="wisp" d="M574 590c8-10 2-20-4-28s-8-18 2-26"/>
        <path class="wisp" d="M596 596c-6-8-2-16 3-22s6-14-1-20"/></g>`;
      return svg;
    }
  };

  function buildPart(cfg, base, p, out, debugDeg) {
    const wrap = document.createElement('div');
    wrap.className = 'rig-layer rig-part rig-' + p.name;
    wrap.style.cssText = `transform-origin:${pct(cfg)(p.pivot)}`;
    if (debugDeg) wrap.style.transform = `rotate(${debugDeg}deg)`;
    const img = imgLayer(base, 'rig-img');
    img.style.cssText = `clip-path:polygon(${p.poly.map(pct(cfg)).join(',')});${maskStyle(cfg, p.children)}`;
    wrap.appendChild(img);
    (p.children || []).forEach(c => wrap.appendChild(buildPart(cfg, base, c, out, debugDeg)));
    out.push({ el: wrap, part: p });
    return wrap;
  }

  window.buildRigs = function (opts) {
    const debugDeg = opts && opts.debugDeg; const out = [];
    document.querySelectorAll('.rig[data-rig]').forEach(fig => {
      const cfg = window.SEN_RIGS[fig.dataset.rig], base = fig.querySelector('img');
      if (!cfg || !base || fig.dataset.built) return;
      fig.dataset.built = '1';
      const body = imgLayer(base, 'rig-body'); body.style.cssText = maskStyle(cfg, cfg.parts); fig.appendChild(body);
      cfg.parts.forEach(p => fig.appendChild(buildPart(cfg, base, p, out, debugDeg)));
      (cfg.overlays || []).forEach(k => { const ov = OVERLAYS[k](cfg); fig.appendChild(ov); out.push({ el: ov, part: { name: k, anim: k } }); });
      base.classList.add('rig-base');
    });
    return out;
  };

  window.animateRigs = function (list) {
    list.forEach(({ el, part }) => {
      switch (part.anim) {
        case 'rock': // ngả ra sau rồi trở lại (span 3,6°, 1,9 s mỗi chiều)
          gsap.fromTo(el, { rotation: 0.8 }, { rotation: -2.8, duration: 1.9, ease: 'sine.inOut', yoyo: true, repeat: -1 }); break;
        case 'shin': // cẳng chân đung đưa theo sau ghế ~0,5 s
          gsap.fromTo(el, { rotation: -2 }, { rotation: 2.2, duration: 1.9, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: .5 }); break;
        case 'book': // chỉnh sách rất nhẹ (span 2°)
          gsap.fromTo(el, { rotation: -1 }, { rotation: 1, duration: 3.2, ease: 'sine.inOut', yoyo: true, repeat: -1 }); break;
        case 'sway':
          gsap.fromTo(el, { rotation: -1.6 }, { rotation: 1.6, duration: 4.4, ease: 'sine.inOut', yoyo: true, repeat: -1 }); break;
        case 'steam': {
          el.querySelectorAll('.wisp').forEach((w, i) => { const L = w.getTotalLength(); w.style.strokeDasharray = L; w.style.strokeDashoffset = L;
            gsap.timeline({ repeat: -1, delay: i * 0.9 })
              .to(w, { strokeDashoffset: 0, duration: 1.4, ease: 'power1.out' })
              .to(w, { y: -18, opacity: 0, duration: 1.6, ease: 'sine.in' }, 0.6)
              .set(w, { strokeDashoffset: L, y: 0, opacity: 1 }); });
          break; }
      }
    });
  };
})();
