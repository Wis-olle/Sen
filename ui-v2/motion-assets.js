/* Sen — motion-assets.js: minh hoạ "sống" (RESEARCH-asset-motion.md).
   Nội tuyến các <img> SVG (assets/spot, assets/doodles, assets/ico) rồi animate từng path/lớp bằng GSAP:
   g1 nét tự vẽ + thân blob pop (spot, icon) · g2 nhân vật lắp ráp theo lớp Accent→Ink (Open Doodles) · g3 sống nền (thở, gật/hop thưa)
   g4 rê chuột (nảy/wiggle) · g5 nét vẽ lại nhanh khi rê (thay line boil — người dùng chê nhòe) · phản hồi one-shot theo sự kiện trang (sen:finish, sen:submit, sen:upload-done).
   Nạp SAU motion.js. Khóa họ bật/tắt chung bảng thử ?lab. ?static / reduced-motion / fetch lỗi (file://) → giữ nguyên <img>. */
(function () {
  const SEN = window.SEN || {}, G = window.gsap;
  if (!G || SEN.rm || !SEN.mOn) return;
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const on = SEN.mOn, warm = !!SEN.warm, inView = SEN.inView || (el => el.getBoundingClientRect().top < innerHeight * .92);
  // minh hoạ ló ra ở mép dưới là vẽ ngay (top < 100% vh): thẻ chứa đã hiện (shell reveal ở 90%) mà hình còn giấu thì thành ô trống
  const seen = el => inView(el) || el.getBoundingClientRect().top < innerHeight;
  const onView = (el, fn) => { if (seen(el) || !window.ScrollTrigger) fn(); else ScrollTrigger.create({ trigger: el, start: 'top 100%', once: true, onEnter: fn }); };
  const kind = src => /\/doodles\//.test(src) ? 'doodle' : /\/spot\//.test(src) ? 'spot' : 'ico';
  const cache = new Map();
  const load = src => { if (!cache.has(src)) cache.set(src, fetch(src).then(r => r.ok ? r.text() : Promise.reject(r.status))); return cache.get(src); };
  const prep = ps => ps.forEach(p => { const L = p.getTotalLength(); p.style.strokeDasharray = L; p.style.strokeDashoffset = L; });
  const rnd = (a, b) => a + Math.random() * (b - a);
  let smallSeq = 0; // thứ tự đọc của icon nhỏ đang trong tầm nhìn → tự vẽ so le

  /* ---------- nội tuyến ---------- */
  const imgs = $$('img[src*="/spot/"], img[src*="/doodles/"], img[src*="/ico/"]').filter(i => !i.closest('.prof .av') && !i.hasAttribute('data-noinline'));
  // tab ẩn (Browser pane, tab nền) không cấp rAF → chờ có thời hạn để vòng nội tuyến không đứng
  const nextFrame = () => new Promise(r => { let done = false; const f = () => { if (!done) { done = true; r(); } }; requestAnimationFrame(f); setTimeout(f, 60); });
  (async () => { for (let idx = 0; idx < imgs.length; idx++) { const img = imgs[idx]; try { const txt = await load(img.getAttribute('src')); inline(img, idx, txt); } catch (e) { (window.__inlErr = window.__inlErr || []).push(String(e && e.stack || e)); /* file:// hoặc lỗi mạng → giữ <img>; lỗi khác xem window.__inlErr */ } await nextFrame(); } })();
  function inline(img, idx, txt) {
    if (!img.isConnected) return;
    const doc = new DOMParser().parseFromString(txt, 'image/svg+xml'), svg = doc.documentElement;
    if (!svg || svg.nodeName !== 'svg') return;
    const el = document.importNode(svg, true);
    el.removeAttribute('width'); el.removeAttribute('height'); el.removeAttribute('id');
    el.setAttribute('class', 'inl ' + (img.getAttribute('class') || '')); el.setAttribute('src', img.getAttribute('src')); el.dataset.kind = kind(img.getAttribute('src'));
    [...img.attributes].forEach(a => { if (/^data-/.test(a.name)) el.setAttribute(a.name, a.value); });
    if (img.id) el.id = img.id; if (img.getAttribute('style')) el.setAttribute('style', img.getAttribute('style'));
    if (img.alt) { el.setAttribute('role', 'img'); el.setAttribute('aria-label', img.alt); } else el.setAttribute('aria-hidden', 'true');
    G.killTweensOf(img); img.replaceWith(el);
    setup(el, idx);
  }

  /* ---------- các pha ---------- */
  function setup(el, idx) {
    const k = el.dataset.kind, small = el.getBoundingClientRect().width < 70;
    const reading = !!el.closest('.lesson, .chat, .list, table'); // REVIEW-29 P1: vùng đọc không có vòng lặp nào (kể cả trôi/đung đưa)
    // trôi + đung đưa (thay cho tween cũ trên <img>)
    if (el.hasAttribute('data-float') && !reading) G.to(el, { y: idx % 2 ? 6 : -6, duration: 3.6 + (idx % 4) * .4, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1.5 });
    if (on('a3') && !small && !reading) G.to(el, { rotation: idx % 2 ? 1.6 : -1.6, duration: 5.2 + (idx % 3) * .5, ease: 'sine.inOut', yoyo: true, repeat: -1, transformOrigin: '50% 100%', delay: 1.2 });

    const strokes = $$('path[stroke], line[stroke], polyline[stroke], circle[stroke], ellipse[stroke]', el).filter(p => p.getAttribute('stroke') !== 'none');
    const fills = $$('path, circle, ellipse, polygon', el).filter(p => { const f = p.getAttribute('fill'); return f && f !== 'none' && !strokes.includes(p); });
    const accent = $('g[id="Accent"], g[id$="Accent"]', el), ink = $('g[id="Ink"], g[id$="Ink"]', el);

    /* VÀO: g1 tự vẽ (spot/ico) · g2 lắp ráp (doodle) */
    const enter = () => { if (el._entered) return; el._entered = true;
      const tl = G.timeline({ defaults: { ease: 'power2.out' } });
      if (k !== 'doodle' && on('g1')) {
        if (strokes.length) prep(strokes); if (fills.length) G.set(fills, { scale: 0, transformOrigin: '50% 60%' }); el.style.opacity = '';
        if (fills.length) tl.fromTo(fills, { scale: 0, transformOrigin: '50% 60%' }, { scale: 1, duration: .5, ease: 'back.out(1.6)', stagger: .04 }, 0);
        if (strokes.length) { el._drawing = true; const n = strokes.length, st = Math.min(.06, .45 / n), d = small ? .4 : .5; tl.to(strokes, { strokeDashoffset: 0, duration: d, stagger: st, onComplete: () => { el._drawing = false; } }, fills.length ? .12 : 0); }
      } else if (k === 'doodle' && on('g2')) {
        el.style.opacity = '';
        if (accent && ink) { tl.fromTo(accent, { scale: .55, transformOrigin: '50% 70%', opacity: 0 }, { scale: 1, opacity: 1, duration: .5, ease: 'back.out(1.6)' }, 0)
          .fromTo(ink, { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: .45 }, .18); }
        else tl.fromTo(el, { scale: .8, opacity: 0, transformOrigin: '50% 100%' }, { scale: 1, opacity: 1, duration: .5, ease: 'back.out(1.6)' }, 0);
      } else return;
      tl.add(() => idle(), '>-.1');
    };
    const visibleNow = seen(el);
    if ((k !== 'doodle' && on('g1')) || (k === 'doodle' && on('g2'))) {
      // giấu tới lúc vào bằng opacity (rẻ); getTotalLength/prep để tới lúc VÀO cho khỏi dồn việc lúc tải. Tab đang ẩn → không giấu (không ai xem, tránh kẹt ẩn)
      if (!document.hidden) el.style.opacity = '0';
      el._enter = enter;
      const seq = small && visibleNow ? smallSeq++ : 0;
      onView(el, () => G.delayedCall(visibleNow ? (warm ? .3 : .8) + (small ? Math.min(seq * .08, .7) : (idx % 3) * .06) : .05, enter));
    } else idle();

    /* NỀN: g3 — thân thở (spot), gật/hop thưa (không áp cho icon nhỏ và minh hoạ trong sidebar) */
    function idle() {
      if (!on('g3') || small) return;
      const quiet = reading || !!el.closest('.sb'), body = k === 'spot' ? fills.slice(0, 1) : []; // RESEARCH-asset-motion: không gật/hop trong sidebar & vùng đọc
      if (body.length && !reading) G.to(body, { scale: 1.035, transformOrigin: '50% 60%', duration: rnd(3.4, 4.6), ease: 'sine.inOut', yoyo: true, repeat: -1 });
      if (quiet) return;
      const beat = () => { if (!el.isConnected) return;
        if (k === 'doodle') G.to(el, { y: '-=7', duration: .22, ease: 'power2.out', yoyo: true, repeat: 1 });
        else G.to(el, { rotation: '+=3', duration: .28, ease: 'sine.inOut', yoyo: true, repeat: 1 });
        G.delayedCall(rnd(7, 12), beat); };
      G.delayedCall(rnd(4, 9), beat);
    }

    /* RÊ CHUỘT: g4 nảy/wiggle · g5 nét run 1 nhịp */
    const host = el.closest('.tcard, .card, .promo, .row, .lib-item, .doc, tr, .pr, .step, .empty-chat') || el;
    host.addEventListener('mouseenter', () => {
      if (on('g4')) {
        if (small) G.fromTo(el, { rotation: -9 }, { rotation: 0, duration: .55, ease: 'elastic.out(1,.4)', transformOrigin: '50% 50%' });
        else if (k === 'doodle') G.to(el, { y: '-=8', rotation: '+=2', duration: .28, ease: 'power2.out', yoyo: true, repeat: 1 });
        else G.fromTo(el, { scale: 1 }, { scale: 1.06, duration: .3, ease: 'back.out(3)', yoyo: true, repeat: 1, transformOrigin: '50% 80%' });
      }
      if (on('g5') && !small && strokes.length && !el._drawing) redraw(el, strokes);
    });

    /* PHẢN HỒI one-shot */
    const src = el.getAttribute('src');
    if (/party\.svg/.test(src)) document.addEventListener('sen:finish', () => pop(el, 1.28));
    if (/thinker\.svg/.test(src)) document.addEventListener('sen:submit', () => pop(el, 1.2));
    if (/note\.svg|upload\.svg/.test(src)) document.addEventListener('sen:upload-done', () => pop(el, 1.2));
    if (/timer\.svg|alarm\.svg/.test(src) && !small) document.addEventListener('sen:hurry', () => G.fromTo(el, { rotation: -6 }, { rotation: 6, duration: .08, repeat: 7, yoyo: true, ease: 'sine.inOut', onComplete: () => G.set(el, { rotation: 0 }) }));
  }
  if (document.body.dataset.page === 'dashboard' && !sessionStorage.getItem('sen.hurried')) G.delayedCall(warm ? 1.6 : 2.6, () => { sessionStorage.setItem('sen.hurried', '1'); document.dispatchEvent(new CustomEvent('sen:hurry')); }); // REVIEW-29 P2: 1 lần/phiên
  document.addEventListener('click', e => { const b = e.target.closest('.qi .opt'); if (b && b.classList.contains('is-wrong')) $$('svg.inl[src*="clumsy"]').forEach(el => G.fromTo(el, { rotation: -4 }, { rotation: 4, duration: .09, repeat: 5, yoyo: true, ease: 'sine.inOut', onComplete: () => G.set(el, { rotation: 0 }) })); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) return; $$('svg.inl').forEach(el => { if (el._enter && !el._entered) el._enter(); }); });
  const pop = (el, s) => G.fromTo(el, { scale: 1 }, { scale: s, duration: .32, ease: 'back.out(3)', yoyo: true, repeat: 1, transformOrigin: '50% 80%' });

  /* ---------- rê chuột: nét vẽ lại nhanh (0,35 s, so le 20 ms) — sạch, đúng ngữ pháp 'nét tự vẽ' của MONAC ---------- */
  function redraw(el, strokes) {
    el._drawing = true; prep(strokes);
    G.to(strokes, { strokeDashoffset: 0, duration: .35, stagger: Math.min(.02, .25 / strokes.length), ease: 'power2.out', onComplete: () => { el._drawing = false; } });
  }
})();
