/* Sen — motion.js: lớp chuyển động bổ sung cho 8 màn app (theo ui-v2/RESEARCH-motion.md).
   Nạp SAU shell.js. Mỗi họ chuyển động có khóa (a1, b1…) bật/tắt qua localStorage 'sen.motion2' = {"a1":false,…};
   CSS gate bằng html[data-m~="a1"]. Bảng thử: thêm ?lab vào URL (ghi nhớ bằng localStorage 'sen.lab').
   ?static / prefers-reduced-motion → chỉ chèn nét vẽ tay ở trạng thái đã vẽ đủ và bảng thử. */
(function () {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const H = document.documentElement, B = document.body, SEN = window.SEN || {};
  const rm = SEN.rm !== undefined ? SEN.rm : (matchMedia('(prefers-reduced-motion: reduce)').matches || /[?&]static/.test(location.search));
  const FAM = [ // [khóa, họ, tên hiển thị, mặc định bật] — người dùng chốt 09/09: mặc định BẬT HẾT
    ['a1', 'A · Sự sống nền', 'Blob sidebar thở', 1],
    ['a2', 'A · Sự sống nền', 'Nét vẽ tay tự vẽ (gạch chân, khoanh tròn)', 1],
    ['a3', 'A · Sự sống nền', 'Doodle đung đưa nhẹ', 1],
    ['a4', 'A · Sự sống nền', 'Logo Sen tự vẽ khi vào', 1],
    ['a5', 'A · Sự sống nền', 'Lưới chấm bản đồ trôi chậm', 1],
    ['b1', 'B · Vi tương tác', 'Nút nhấn lún rồi bật lại', 1],
    ['b2', 'B · Vi tương tác', 'Chip gợi ý bay vào ô nhập (trợ giảng)', 1],
    ['b3', 'B · Vi tương tác', 'Công tắc nảy nhẹ', 1],
    ['b4', 'B · Vi tương tác', 'Chevron xoay khi mở menu', 1],
    ['b5', 'B · Vi tương tác', 'Badge / pip thông báo pop', 1],
    ['b7', 'B · Vi tương tác', 'Icon nav nhún khi rê chuột', 1],
    ['c1', 'C · Dữ liệu sống', 'Mọi số lớn đếm lên', 1],
    ['c2', 'C · Dữ liệu sống', 'Số đổi → nảy & đếm lại (lộ trình)', 1],
    ['c5', 'C · Dữ liệu sống', 'Cạnh bản đồ "chảy" vào nút đang chọn', 1],
    ['d1', 'D · Phản hồi & ăn mừng', 'Trả lời đúng: tick vẽ · sai: rung nhẹ', 1],
    ['d3', 'D · Phản hồi & ăn mừng', 'Hoàn thành bài: nổ doodle một lần', 1],
    ['d4', 'D · Phản hồi & ăn mừng', 'Tải lên xong: nổ doodle', 1],
    ['e1', 'E · Điều hướng', 'Chuyển trang mềm, sidebar không nháy', 1],
    ['e2', 'E · Điều hướng', 'Viên than trượt tới mục trước khi đổi trang', 1],
    ['e3', 'E · Điều hướng', 'Drawer mobile: mục nav so le', 1],
    ['e4', 'E · Điều hướng', 'Menu tài khoản mở scale-fade', 1],
    ['e5', 'E · Điều hướng', 'Cuộn mềm tới mục + chớp sáng đích', 1],
    ['f3', 'F · Theo cuộn', 'Số thứ tự mục bài học pop khi cuộn tới', 1],
    ['f4', 'F · Theo cuộn', 'Parallax doodle rất nhẹ', 1],
    ['g1', 'G · Minh hoạ sống', 'Nét blob/icon tự vẽ khi hiện', 1],
    ['g2', 'G · Minh hoạ sống', 'Nhân vật doodle lắp ráp theo lớp', 1],
    ['g3', 'G · Minh hoạ sống', 'Thở · gật · hop thưa (idle)', 1],
    ['g4', 'G · Minh hoạ sống', 'Nảy / wiggle khi rê chuột', 1],
    ['g5', 'G · Minh hoạ sống', 'Nét vẽ lại nhanh khi rê chuột', 1],
  ];
  let saved = {}; try { saved = JSON.parse(localStorage.getItem('sen.motion2') || '{}'); } catch (_) { }
  const def = k => !!(FAM.find(f => f[0] === k) || [])[3];
  const on = k => (k in saved ? !!saved[k] : def(k));
  H.dataset.m = FAM.filter(f => on(f[0])).map(f => f[0]).join(' ');
  if (window.SEN) window.SEN.mOn = on;
  const G = window.gsap;

  /* ---------- E1: chuyển trang — tắt khi người dùng bỏ chọn hoặc ở chế độ tĩnh ---------- */
  if (!on('e1') || rm) { const st = document.createElement('style'); st.textContent = '@view-transition{navigation:none}'; document.head.appendChild(st); }

  /* ---------- A2: nét vẽ tay (data-mark="underline|circle") ---------- */
  const MK = {
    underline: { vb: '0 0 100 12', d: 'M2 8C18 4 33 11 50 7S82 3 98 6', box: r => ({ left: -2, top: r.height - 3, width: r.width + 4, height: 12 }) },
    circle: { vb: '0 0 100 60', d: 'M52 6C78 3 98 15 96 32S66 58 40 56 3 43 5 27 30 3 60 6', box: r => ({ left: -12, top: -7, width: r.width + 24, height: r.height + 14 }) },
  };
  const marks = [], markEls = [];
  const layoutMark = (el, s, t) => { const r = el.getBoundingClientRect(), b = t.box({ width: el.offsetWidth || r.width, height: el.offsetHeight || r.height }); s.style.cssText = `left:${b.left}px;top:${b.top}px;width:${b.width}px;height:${b.height}px`; };
  $$('[data-mark]').forEach(el => {
    const t = MK[el.dataset.mark]; if (!t) return;
    if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
    const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('class', 'mk mk-' + el.dataset.mark); s.setAttribute('viewBox', t.vb); s.setAttribute('preserveAspectRatio', 'none'); s.setAttribute('aria-hidden', 'true');
    s.innerHTML = `<path d="${t.d}" vector-effect="non-scaling-stroke"/>`;
    el.appendChild(s); layoutMark(el, s, t); marks.push(s.firstChild); markEls.push([el, s, t]);
  });
  let rT; addEventListener('resize', () => { clearTimeout(rT); rT = setTimeout(() => markEls.forEach(([el, s, t]) => layoutMark(el, s, t)), 120); }); // đổi cỡ cửa sổ → đặt lại nét
  if (!on('a2')) marks.forEach(p => p.closest('svg').remove());

  /* ---------- bảng thử ---------- */
  if (/[?&]lab\b/.test(location.search)) localStorage.setItem('sen.lab', '1');
  if (localStorage.getItem('sen.lab') === '1') {
    const lab = document.createElement('aside'); lab.className = 'mlab'; lab.setAttribute('aria-label', 'Bảng thử chuyển động');
    const groups = [...new Set(FAM.map(f => f[1]))];
    lab.innerHTML = `<div class="mlab-h"><b>Bảng thử chuyển động</b><button type="button" data-act="hide" aria-label="Ẩn bảng">×</button></div>
      <div class="mlab-b">${groups.map(g => `<div class="mlab-g"><span>${g}</span>${FAM.filter(f => f[1] === g).map(f => `<label><input type="checkbox" data-k="${f[0]}" ${on(f[0]) ? 'checked' : ''}/><code>${f[0]}</code>${f[2]}</label>`).join('')}</div>`).join('')}</div>
      <div class="mlab-f"><button type="button" data-act="all">Bật hết</button><button type="button" data-act="none">Tắt hết</button><button type="button" data-act="def">Mặc định</button><button type="button" data-act="replay">Chạy lại</button></div>
      <p class="mlab-n">Đổi lựa chọn là trang tải lại. ${rm ? 'Đang ở chế độ TĨNH: ' + (/[?&]static/.test(location.search) ? 'bỏ ?static khỏi URL để xem chuyển động.' : 'hệ điều hành đang bật "giảm chuyển động" (reduced-motion).') : ''}
      ${matchMedia('(prefers-reduced-motion: reduce)').matches && !/[?&]static/.test(location.search) ? `<br><button type="button" data-act="force">${localStorage.getItem('sen.forceMotion') === '1' ? 'Tôn trọng reduced-motion (tắt chuyển động)' : 'Vẫn bật chuyển động dù hệ điều hành giảm chuyển động'}</button>` : ''}</p>`;
    B.appendChild(lab);
    const save = o => { localStorage.setItem('sen.motion2', JSON.stringify(o)); location.reload(); };
    lab.addEventListener('change', e => { const k = e.target.dataset.k; if (!k) return; saved[k] = e.target.checked; save(saved); });
    lab.addEventListener('click', e => { const a = e.target.dataset.act; if (!a) return;
      if (a === 'hide') { localStorage.setItem('sen.lab', '0'); lab.remove(); }
      if (a === 'all') save(Object.fromEntries(FAM.map(f => [f[0], true])));
      if (a === 'none') save(Object.fromEntries(FAM.map(f => [f[0], false])));
      if (a === 'def') { localStorage.removeItem('sen.motion2'); location.reload(); }
      if (a === 'replay') location.reload();
      if (a === 'force') { localStorage.setItem('sen.forceMotion', localStorage.getItem('sen.forceMotion') === '1' ? '0' : '1'); location.reload(); } });
  }

  if (rm || !G) { marks.forEach(p => p.style.strokeDashoffset = 0); return; }

  /* ---------- tiện ích ---------- */
  const warm = !!SEN.warm; // vào từ màn app khác (E1) → sidebar đứng yên, không vẽ lại logo
  const prep = ps => ps.forEach(p => { const L = p.getTotalLength(); p.style.strokeDasharray = L; p.style.strokeDashoffset = L; });
  const inView = el => innerWidth < 120 || innerHeight < 120 || !!el.closest('.rail') || el.getBoundingClientRect().top < (innerHeight > 120 ? innerHeight : 900) * .92; // rail dính: luôn coi là trong tầm nhìn; tab ẩn 0×0 → coi như 900
  window.SEN.inView = inView;
  const onView = (el, fn, start = 'top 88%') => { if (inView(el) || !window.ScrollTrigger) fn(); else ScrollTrigger.create({ trigger: el, start, once: true, onEnter: fn }); };
  let layer; const BITS = ['M2 2L10 10M10 2L2 10', 'M1 6C4 1 8 11 11 6', 'M6 1l1.5 3.5 3.5.5-2.5 2.5.5 3.5L6 9.3 3 11l.5-3.5L1 5l3.5-.5z', 'M1 7l3 3 7-7', 'M2 10Q6 2 10 10', 'M6 2v8M2 6h8'];
  const COL = ['var(--amber-deep)', '#3f7fd9', 'var(--ok)', 'var(--ink)', 'var(--amber)', '#3f7fd9'];
  const burst = (x, y, n = 6) => {
    if (!layer) { layer = document.createElement('div'); layer.className = 'mburst'; layer.setAttribute('aria-hidden', 'true'); B.appendChild(layer); }
    for (let i = 0; i < n; i++) {
      const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); s.setAttribute('viewBox', '0 0 12 12');
      s.innerHTML = `<path d="${BITS[i % BITS.length]}" stroke="${COL[i % COL.length]}" ${i % BITS.length === 2 ? `fill="${COL[i % COL.length]}"` : 'fill="none"'} stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`;
      s.style.cssText = `left:${x}px;top:${y}px`; layer.appendChild(s);
      const a = (-90 + (i - (n - 1) / 2) * (150 / Math.max(1, n - 1)) + (Math.random() * 24 - 12)) * Math.PI / 180, d = 44 + Math.random() * 40;
      G.fromTo(s, { x: 0, y: 0, scale: 0, rotation: 0, opacity: 1 }, { x: Math.cos(a) * d, y: Math.sin(a) * d - 8, scale: 1, rotation: Math.random() * 160 - 80, duration: .7, ease: 'power2.out' });
      G.to(s, { opacity: 0, scale: .5, duration: .3, delay: .55, onComplete: () => s.remove() });
    }
  };
  const burstAt = (el, n) => { const r = el.getBoundingClientRect(); burst(r.left + r.width / 2, r.top + r.height / 2, n); };
  const countTo = (el, to, from = 0, d = .8, at = 0) => {
    const raw = String(to), dec = (raw.split(/[.,]/)[1] || '').length, comma = raw.includes(',');
    const fmt = v => { let s = v.toFixed(dec); return comma ? s.replace('.', ',') : s; };
    const o = { v: from }; el._last = to;
    return G.to(o, { v: parseFloat(raw.replace(',', '.')), duration: d, ease: 'power3.out', delay: at, onUpdate: () => el.textContent = fmt(o.v) });
  };
  window.SEN.burst = burst; window.SEN.countTo = countTo;

  /* ---------- A2: vẽ nét — trên nếp gấp ở ~0,75 s, dưới nếp gấp khi cuộn tới ---------- */
  prep(marks);
  marks.forEach(p => onView(p.closest('svg'), () => G.to(p, { strokeDashoffset: 0, duration: .6, ease: 'power2.out', delay: inView(p.closest('svg')) && !warm ? .75 : .1 })));

  /* ---------- A4: logo Sen tự vẽ (chỉ khi vào lạnh) ---------- */
  if (on('a4') && !warm) { const ps = $$('.sb .brand svg path'); if (ps.length) { prep(ps); G.to(ps, { strokeDashoffset: 0, duration: .7, ease: 'power2.out', stagger: .1 }, 0); G.fromTo(ps[0], { fillOpacity: 0 }, { fillOpacity: 1, duration: .4, delay: .5 }); } }

  /* ---------- A3: doodle đung đưa ---------- */
  if (on('a3')) $$('img[src*="/spot/"], img[src*="/doodles/"]').forEach((im, i) => G.to(im, { rotation: i % 2 ? 1.6 : -1.6, duration: 5.2 + (i % 3) * .5, ease: 'sine.inOut', yoyo: true, repeat: -1, transformOrigin: '50% 100%', delay: 1.2 }));

  /* ---------- B1: nút nhấn lún (scale, không đụng x/y của nam châm) ---------- */
  if (on('b1')) {
    const SEL = '.btn, .ibtn, .opt, .chip-q, .fchip, .seg button, .tag[data-go], .toc a, .switch, .cite, .link-arrow, .promo .btn';
    document.addEventListener('pointerdown', e => { const el = e.target.closest(SEL); if (!el || el.disabled) return;
      G.to(el, { scale: .95, duration: .12, ease: 'power2.out', overwrite: 'auto' });
      const up = () => { G.to(el, { scale: 1, duration: .5, ease: 'elastic.out(1,.5)' }); el.removeEventListener('pointerup', up); el.removeEventListener('pointerleave', up); el.removeEventListener('pointercancel', up); };
      el.addEventListener('pointerup', up); el.addEventListener('pointerleave', up); el.addEventListener('pointercancel', up); });
  }

  /* ---------- B2: chip gợi ý bay vào ô nhập ---------- */
  if (on('b2')) document.addEventListener('click', e => { const c = e.target.closest('.chip-q'), inp = $('#input, .composer textarea, .composer input'); if (!c || !inp) return;
    const r = c.getBoundingClientRect(), t = inp.getBoundingClientRect(), k = c.cloneNode(true); k.classList.add('mfly'); k.style.cssText = `left:${r.left}px;top:${r.top}px;width:${r.width}px`; B.appendChild(k);
    G.to(k, { x: t.left + 24 - r.left, y: t.top + t.height / 2 - r.top - r.height / 2, scale: .55, opacity: 0, duration: .38, ease: 'power2.in', transformOrigin: '0 50%', onComplete: () => k.remove() }); }, true);

  /* ---------- B5: badge/pip pop ---------- */
  if (on('b5')) { const bd = $$('.sb-nav .badge, .sb-nav .dot, .tb-bell .pip'); if (bd.length) G.from(bd, { scale: 0, duration: .45, ease: 'back.out(2.2)', stagger: .06, delay: warm ? .3 : .9, transformOrigin: '50% 50%' }); }

  /* ---------- B7: icon nav nhún ---------- */
  if (on('b7')) $$('.sb-nav a').forEach(a => a.addEventListener('mouseenter', () => { const i = $('.ic', a); if (i) G.fromTo(i, { y: 0 }, { y: -2.5, duration: .14, yoyo: true, repeat: 1, ease: 'sine.inOut', overwrite: 'auto' }); }));

  /* ---------- C1: số lớn chưa có data-count → đếm lên ---------- */
  if (on('c1')) $$('.big, .stile .val, .mp .sc').forEach(w => { const el = w.matches('.stile .val') || w.matches('.big') ? (w.querySelector(':scope > span:first-child') || w) : w;
    if (el.hasAttribute('data-count') || el.querySelector('[data-count]') || el.closest('[data-count], [data-nocount]') || el._last !== undefined) return;
    const txt = el.textContent.trim(); if (!/^\d{1,3}([.,]\d{1,2})?$/.test(txt)) return;
    el._last = txt; el.textContent = txt.replace(/\d/g, '0'); onView(el, () => countTo(el, txt, 0, .8, inView(el) && !warm ? .9 : .05)); });

  /* ---------- C2: dữ liệu đổi (trang dispatch 'sen:data' với detail.els) → nảy + đếm lại ---------- */
  if (on('c2')) document.addEventListener('sen:data', e => (e.detail && e.detail.els || []).forEach((el, i) => { const to = el.textContent.trim(), from = parseFloat(String(el._last ?? to).replace(',', '.')) || 0;
    if (/^\d{1,3}([.,]\d{1,2})?$/.test(to) && from !== parseFloat(to.replace(',', '.'))) countTo(el, to, from, .7, i * .05);
    G.fromTo(el.closest('.stile') || el, { scale: 1 }, { scale: 1.04, duration: .22, yoyo: true, repeat: 1, ease: 'sine.inOut', delay: i * .05, transformOrigin: '50% 50%' }); }));

  /* ---------- C5: cạnh bản đồ chảy vào nút đang chọn ('sen:select', detail.id) ---------- */
  if (on('c5')) document.addEventListener('sen:select', e => { const id = e.detail && e.detail.id; $$('.edge').forEach(p => { G.killTweensOf(p); p.style.strokeDasharray = ''; p.style.strokeDashoffset = ''; p.classList.remove('is-flow'); });
    $$(`.edge[data-b="${id}"]`).forEach(p => { p.classList.add('is-flow'); p.style.strokeDasharray = '7 7'; G.fromTo(p, { strokeDashoffset: 0 }, { strokeDashoffset: -28, duration: 1.3, ease: 'none', repeat: 3, onComplete: () => { p.style.strokeDasharray = ''; p.classList.remove('is-flow'); } }); }); }); // tự dừng sau 4 vòng (REVIEW-27)

  /* ---------- D1: đúng/sai ở quiz bài học (chạy SAU handler của trang) ---------- */
  if (on('d1')) document.addEventListener('click', e => { const b = e.target.closest('.qi .opt'); if (!b) return; const qi = b.closest('.qi');
    const right = $('.opt.is-right', qi), k = right && $('.k', right);
    if (k && !$('svg', k)) { k.style.color = 'transparent'; k.insertAdjacentHTML('beforeend', '<svg class="mtick" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 12.5l4.3 4.3L18 8.5"/></svg>'); const p = $('.mtick path', k); prep([p]); G.to(p, { strokeDashoffset: 0, duration: .35, ease: 'power2.out', delay: b === right ? .05 : .35 }); }
    if (b === right) G.fromTo(b, { scale: 1 }, { scale: 1.02, duration: .18, yoyo: true, repeat: 1, ease: 'sine.inOut', transformOrigin: '50% 50%' });
    else if (b.classList.contains('is-wrong')) G.fromTo(b, { x: -5 }, { x: 5, duration: .07, repeat: 3, yoyo: true, ease: 'sine.inOut', onComplete: () => G.set(b, { x: 0 }) }); });

  /* ---------- D3 / D4: ăn mừng một lần ---------- */
  if (on('d3')) document.addEventListener('sen:finish', e => { const el = e.detail && e.detail.el; if (el) setTimeout(() => burstAt(el, 7), 350); });
  if (on('d4')) document.addEventListener('sen:upload-done', e => { const el = e.detail && e.detail.el; if (el) burstAt(el, 6); });

  /* ---------- E2: viên than trượt tới mục rồi mới đổi trang ---------- */
  if (on('e2') && SEN.placeGhost) $$('.sb-nav:not(.sb-more) a[href]:not([data-soon]):not(.is-active)').forEach(a => a.addEventListener('click', e => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button) return; e.preventDefault(); a.classList.add('is-hover'); SEN.placeGhost(a, .22);
    setTimeout(() => location.href = a.href, 120); }));

  /* ---------- E3: drawer mobile ---------- */
  if (on('e3')) { const bg = $('.tb-burger'); if (bg) bg.addEventListener('click', () => { if (innerWidth <= 900) G.from('.sb-nav li', { x: -12, opacity: 0, duration: .35, stagger: .03, delay: .12, ease: 'power2.out', clearProps: 'all' }); }); }

  /* ---------- E4: menu tài khoản ---------- */
  if (on('e4')) { const me = $('.me'), menu = $('.menu'); if (me && menu) me.addEventListener('click', () => { if (menu.classList.contains('open')) G.fromTo(menu, { scale: .94, opacity: 0, y: -4 }, { scale: 1, opacity: 1, y: 0, duration: .2, ease: 'power2.out', transformOrigin: '100% 0', clearProps: 'transform' }); }); }

  /* ---------- E5: chớp sáng mục đích sau khi cuộn ---------- */
  if (on('e5')) document.addEventListener('click', e => { const a = e.target.closest('a[href^="#"]'); if (!a) return; const t = $(a.getAttribute('href')); if (!t) return;
    const h = $('.sec-h', t) || t; setTimeout(() => G.fromTo(h, { backgroundColor: 'rgba(248,195,101,.45)' }, { backgroundColor: 'rgba(248,195,101,0)', duration: .9, ease: 'power2.out', clearProps: 'backgroundColor' }), 500); });

  /* ---------- F3: số mục bài học pop khi cuộn tới ---------- */
  if (on('f3')) $$('.sec-h .n').forEach(n => { if (inView(n)) return; G.from(n, { scale: .55, rotation: -14, duration: .45, ease: 'back.out(1.8)', transformOrigin: '50% 50%', scrollTrigger: window.ScrollTrigger ? { trigger: n, start: 'top 86%', once: true } : undefined }); });
})();
