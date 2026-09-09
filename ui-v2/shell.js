/* Sen — app shell v2 (khung B): sidebar hổ phách hẹp + panel trắng + rail; tiêu đề trang trong topbar.
   Trang khai báo: <body data-page="dashboard" data-role="student|admin" data-title="Trang chủ" [data-focus] [data-promo="tutor|lesson|none"]>
   và có sẵn <div class="app [no-rail]"><aside class="sb" id="sb"></aside><main class="main"><header class="tb" id="tb"></header><div class="content">…</div></main>[<aside class="rail">…</aside>]</div>
   ?static hoặc prefers-reduced-motion → html.is-static, không GSAP. */
(function () {
  // ?static luôn tĩnh; reduced-motion của hệ điều hành cũng tĩnh, trừ khi người dùng bật "Vẫn bật chuyển động" trong bảng thử (sen.forceMotion)
  let forceMotion = false; try { forceMotion = localStorage.getItem('sen.forceMotion') === '1'; } catch (_) { }
  const rm = /[?&]static/.test(location.search) || (matchMedia('(prefers-reduced-motion: reduce)').matches && !forceMotion);
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const body = document.body, page = body.dataset.page || '', role = body.dataset.role || 'student';
  // motion.js: cấu hình họ chuyển động + 'vào ấm' (đến từ màn app khác cùng origin → sidebar đứng yên, chỉ nội dung đổi)
  let M = {}; try { M = JSON.parse(localStorage.getItem('sen.motion2') || '{}'); } catch (_) { } // khóa v2: bỏ lựa chọn cũ, mặc định bật hết
  let warm = false; try { const ref = document.referrer && new URL(document.referrer); warm = M.e1 !== false && !!ref && ref.origin === location.origin && /\/(app|admin)-[a-z]+(\.html)?$/.test(ref.pathname); } catch (_) { }
  const ic = (n, cls = 'ic') => `<svg class="${cls}" aria-hidden="true"><use href="#i-${n}"/></svg>`;

  /* ---------- sprite icon (Lucide, ISC) ---------- */
  if (window.SEN_ICONS) {
    const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('style', 'position:absolute;width:0;height:0;overflow:hidden'); s.setAttribute('aria-hidden', 'true');
    s.innerHTML = Object.entries(SEN_ICONS).map(([k, v]) => `<symbol id="i-${k}" viewBox="0 0 24 24">${v}</symbol>`).join('');
    body.prepend(s);
  }

  /* ---------- điều hướng: 6 mục chính + nhóm "Khác" (RESEARCH §5 phương án B) ---------- */
  const NAV = {
    student: [
      { k: 'dashboard', l: 'Trang chủ', i: 'house', h: 'app-dashboard.html' },
      { k: 'library', l: 'Kho học liệu', i: 'library-big', h: 'app-library.html', badge: 1 },
      { k: 'map', l: 'Bản đồ kiến thức', i: 'waypoints', h: 'app-map.html' },
      { k: 'plan', l: 'Lộ trình', i: 'route', h: 'app-plan.html' },
      { k: 'lesson', l: 'Bài học hôm nay', i: 'book-open', h: 'app-lesson.html', dot: true },
      { k: 'tutor', l: 'Trợ giảng', i: 'message-circle', h: 'app-tutor.html' },
    ],
    studentMore: [
      { k: 'practice', l: 'Luyện tập', i: 'puzzle', soon: true, badge: 5 },
      { k: 'progress', l: 'Tiến độ', i: 'chart-column', soon: true },
      { k: 'term', l: 'Học kỳ của tôi', i: 'calendar-sync', soon: true },
    ],
    admin: [
      { k: 'users', l: 'Người dùng', i: 'users', soon: true },
      { k: 'config', l: 'Cấu hình AI', i: 'sliders-horizontal', soon: true },
      { k: 'costs', l: 'Chi phí & nhật ký', i: 'receipt', h: 'admin-costs.html' },
      { k: 'prompt-tests', l: 'Kiểm thử prompt', i: 'flask-conical', soon: true },
      { k: 'reports', l: 'Bài bị báo sai', i: 'flag', soon: true },
    ],
  };
  const USER = role === 'admin' ? { av: 'ad', ini: 'Q', name: 'Quản trị', sub: 'admin@utt.edu.vn', short: 'Quản trị' } : { av: 'a', ini: 'A', name: 'Nguyễn Văn An', sub: 'UTT-CN-01 · K64', short: 'An' };
  const LOTUS = '<svg viewBox="0 0 32 32" fill="none" stroke="#1d1d1d" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 27c-6.5 0-10-4.2-10-9.5 0-3 1.4-5.4 3.2-7.3.6 2.4 1.9 4 3.6 4.9C12.5 11.6 14 8 16 5c2 3 3.5 6.6 3.2 10.1 1.7-.9 3-2.5 3.6-4.9C24.6 12.1 26 14.5 26 17.5 26 22.8 22.5 27 16 27Z" fill="#fff6e5"/><path d="M16 27V15"/></svg>';
  // thẻ doodle đáy sidebar — đổi theo màn để không lặp hình
  const PROMO = {
    tutor: { img: 'assets/spot/coach.svg', t: 'Hỏi trợ giảng', p: 'Trả lời bám tài liệu, nhớ lỗi bạn từng mắc.', a: 'Mở trợ giảng', h: 'app-tutor.html' },
    lesson: { img: 'assets/spot/learning.svg', t: 'Bài học hôm nay', p: 'Phụ thuộc bắc cầu · 30 phút, soạn riêng cho An.', a: 'Học ngay', h: 'app-lesson.html' },
    plan: { img: 'assets/spot/strategy.svg', t: 'Lộ trình tuần', p: '5 buổi tới 20/09, tự tính lại khi bạn trễ.', a: 'Xem lộ trình', h: 'app-plan.html' },
    admin: { img: 'assets/spot/savings.svg', t: 'Hạn mức hôm nay', p: 'Đã dùng 1,84 / 5 USD · 37%.', a: 'Xem chi phí', h: 'admin-costs.html' },
  };
  const promoKey = body.dataset.promo || (role === 'admin' ? 'admin' : page === 'tutor' ? 'lesson' : page === 'lesson' ? 'plan' : 'tutor');
  const item = it => `<li><a href="${it.h || '#'}" class="${it.k === page ? 'is-active' : ''}"${it.soon ? ' data-soon' : ''}${it.k === page ? ' aria-current="page"' : ''} title="${it.l}">${ic(it.i)}<span class="lbl">${it.l}</span>${it.badge ? `<span class="badge">${it.badge}</span>` : it.dot ? '<span class="dot"></span>' : ''}</a></li>`;
  const sb = $('#sb'), tb = $('#tb'), appEl = $('.app');
  body.insertAdjacentHTML('afterbegin', '<a class="skip-link" href="#main">Tới nội dung chính</a>');
  const pr = PROMO[promoKey];
  if (sb) sb.innerHTML = `<div class="sb-in">
    <svg class="blob blob-1" viewBox="0 0 360 360" aria-hidden="true"><path d="M181 22c46-12 86 20 104 60 20 44 70 54 62 106-7 46-52 60-84 92-30 30-74 62-116 52C97 320 76 266 40 232 4 198-8 148 20 108 48 66 118 39 181 22Z"/></svg>
    <svg class="blob blob-2" viewBox="0 0 300 300" aria-hidden="true"><path d="M150 14c40 0 60 34 92 52 36 20 58 52 46 92-10 34-46 44-68 72-22 30-48 66-90 60-40-6-50-52-82-74C14 192-4 150 14 112 34 70 100 14 150 14Z"/></svg>
    <a class="brand" href="index.html" aria-label="Sen — trang chủ">${LOTUS}<span>Sen</span></a>
    <nav aria-label="Chính"><ul class="sb-nav"><div class="sb-ghost"></div>${NAV[role].map(item).join('')}</ul>
    ${role === 'admin' ? '' : `<div class="sb-sec">Khác</div><ul class="sb-nav sb-more">${NAV.studentMore.map(item).join('')}</ul>`}</nav>
    ${pr && promoKey !== 'none' ? `<a class="promo" href="${pr.h}"><img src="${pr.img}" alt="" width="500" height="500" data-float /><b>${pr.t}</b><p>${pr.p}</p><span class="btn btn-dark btn-xs">${pr.a}</span></a>` : ''}
    <div class="sb-user"><span class="av ${USER.av}">${USER.ini}</span><div><b>${USER.name}</b><small>${USER.sub}</small></div><a class="ibtn" href="login.html" aria-label="Đăng xuất" title="Đăng xuất">${ic('log-out')}</a></div>
  </div><div class="sb-backdrop"></div>`;
  if (tb) tb.innerHTML = `<button class="ibtn tb-burger" type="button" aria-label="Mở menu">${ic('menu')}</button>
    <h1>${body.dataset.title || 'Sen'}</h1><span class="sp"></span>
    <div class="search" role="search" data-soon>${ic('search')}Tìm khái niệm, tài liệu…</div>
    ${role === 'admin' ? `<span class="tag tag--ink">${ic('shield-check')}Quản trị</span>` : `<button class="ctx" type="button" data-soon title="Ngữ cảnh đang chọn">${ic('book-open')}CSDL <small>· Chương 4</small>${ic('chevron-down', 'ic chev')}</button>`}
    <button class="ibtn tb-bell" type="button" aria-label="Thông báo, 2 chưa đọc" data-soon>${ic('bell')}<span class="pip">2</span></button>
    <div class="me-wrap" style="position:relative"><button class="me" type="button" aria-haspopup="menu" aria-expanded="false"><span class="av ${USER.av}">${USER.ini}</span><span class="nm">${USER.short}</span>${ic('chevron-down', 'ic chev')}</button>
      <div class="menu" role="menu"><a href="#" data-soon>${ic('user-round')}Hồ sơ</a><a href="#" data-soon>${ic('bell')}Thông báo</a><a href="#" data-soon>${ic('shield-check')}Dữ liệu của tôi</a><hr><a href="login.html">${ic('log-out')}Đăng xuất</a></div></div>`;

  /* ---------- hành vi ---------- */
  const app = $('.app');
  let toastEl, toastT;
  const toast = (msg, icon = 'info') => {
    if (!toastEl) { toastEl = document.createElement('div'); toastEl.className = 'toast'; toastEl.setAttribute('role', 'status'); toastEl.style.transition = 'opacity .35s,transform .45s cubic-bezier(.22,1,.36,1)'; body.appendChild(toastEl); }
    toastEl.innerHTML = ic(icon) + msg; clearTimeout(toastT);
    requestAnimationFrame(() => { toastEl.classList.add('show'); toastT = setTimeout(() => toastEl.classList.remove('show'), 2800); });
  };
  window.SEN = { toast, rm, ic, warm, placeGhost: (el, d) => placeGhost(el, d) };

  /* ---------- popover trích dẫn: .cite[data-q] ---------- */
  let pop, popFor = null;
  const closePop = () => { if (!pop || !pop.classList.contains('show')) return; popFor = null;
    if (rm || !window.gsap) pop.classList.remove('show'); else gsap.to(pop, { scale: .96, opacity: 0, duration: .15, onComplete: () => { pop.classList.remove('show'); gsap.set(pop, { clearProps: 'all' }); } }); };
  document.addEventListener('click', e => {
    const c = e.target.closest('.cite[data-q]');
    if (!c) { if (!e.target.closest('.pop')) closePop(); return; }
    if (popFor === c) return closePop();
    if (!pop) { pop = document.createElement('div'); pop.className = 'pop'; pop.setAttribute('role', 'dialog'); pop.setAttribute('aria-label', 'Đoạn nguồn');
      pop.innerHTML = `<div class="h">${ic('file-text')}<span class="src-name"></span> · <b class="pg"></b><button class="x" type="button" aria-label="Đóng">${ic('x')}</button></div><q></q><div class="f"><span class="muted">Mã đoạn <b class="num code"></b> · trích nguyên văn</span><a class="u-draw" href="#" data-soon>Mở tài liệu</a></div>`;
      body.appendChild(pop); pop.querySelector('.x').addEventListener('click', closePop); }
    pop.querySelector('.src-name').textContent = c.dataset.doc || 'Giáo trình CSDL · Chương 4'; pop.querySelector('.pg').textContent = 'tr. ' + c.dataset.page; pop.querySelector('.code').textContent = c.dataset.src; pop.querySelector('q').textContent = c.dataset.q;
    const r = c.getBoundingClientRect(), w = Math.min(320, innerWidth - 32); let left = r.left + scrollX - 12; if (left + w > scrollX + innerWidth - 16) left = scrollX + innerWidth - 16 - w;
    pop.style.left = left + 'px'; pop.style.top = (r.bottom + scrollY + 10) + 'px'; pop.style.transformOrigin = `${Math.max(16, r.left + scrollX - left + r.width / 2)}px 0`;
    pop.classList.add('show'); popFor = c;
    if (!rm && window.gsap) gsap.fromTo(pop, { scale: .96, opacity: 0 }, { scale: 1, opacity: 1, duration: .2, ease: 'power2.out' });
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closePop(); });
  document.addEventListener('click', e => { const a = e.target.closest('[data-soon]'); if (a) { e.preventDefault(); toast('Màn này chưa dựng trong bản demo', 'clipboard-check'); } });
  const burger = $('.tb-burger'), bd = $('.sb-backdrop');
  if (burger) burger.addEventListener('click', () => app.classList.add('sb-open'));
  if (bd) bd.addEventListener('click', () => app.classList.remove('sb-open'));
  const me = $('.me'), menu = $('.menu');
  if (me) { me.addEventListener('click', e => { e.stopPropagation(); const o = menu.classList.toggle('open'); me.setAttribute('aria-expanded', o); });
    document.addEventListener('click', () => { menu.classList.remove('open'); me.setAttribute('aria-expanded', 'false'); }); }
  let placeGhost = () => {};
  if (rm) { document.documentElement.classList.add('is-static'); return; }
  if (!window.gsap) return;
  document.documentElement.classList.add('gsap');
  if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
  gsap.ticker.lagSmoothing(0); // tab nền/bị che → rAF bị bóp: nhảy tới đúng thời điểm thay vì bò từng khung (gây "mờ dở dang")
  const inRail = el => !!el.closest('.rail'); // rail dính (sticky) + tự cuộn → ScrollTrigger cửa sổ không bao giờ kích, phải cho vào timeline

  /* ---------- sidebar: viên than trượt ---------- */
  const ghost = $('.sb-ghost'), active = $('.sb-nav a.is-active'), navMain = $('.sb-nav:not(.sb-more)');
  const inMain = el => el && navMain && navMain.contains(el);
  // vị trí theo bounding rect so với <ul>: offsetTop sai vì <li> mang transform sau intro (trở thành offsetParent → luôn 0)
  const navY = el => Math.round(el.getBoundingClientRect().top - navMain.getBoundingClientRect().top);
  placeGhost = (el = active, d = .35) => { if (!ghost || !el || !inMain(el)) { if (ghost && !inMain(el)) gsap.to(ghost, { opacity: 0, duration: .2 }); return; } gsap.to(ghost, { y: navY(el), opacity: 1, duration: d, ease: 'power3.out', overwrite: 'auto' }); };
  if (ghost && active && inMain(active)) gsap.set(ghost, { y: navY(active), opacity: 1, scaleX: warm ? 1 : 0, transformOrigin: '0 50%' });
  $$('.sb-nav:not(.sb-more) a').forEach(a => {
    a.addEventListener('mouseenter', () => { placeGhost(a); a.classList.add('is-hover'); if (active && active !== a) active.classList.add('is-off'); });
    a.addEventListener('mouseleave', () => { a.classList.remove('is-hover'); if (active) active.classList.remove('is-off'); });
  });
  if (navMain) navMain.addEventListener('mouseleave', () => placeGhost(active, .45));
  addEventListener('resize', () => placeGhost(active, 0));

  /* ---------- nét vẽ tay tự vẽ ---------- */
  const prepDraw = ps => ps.forEach(p => { const L = p.getTotalLength(); p.style.strokeDasharray = L; p.style.strokeDashoffset = L; });
  prepDraw($$('.mark path'));

  /* ---------- vào trang (≤1,2 s): sidebar → topbar → hàng ngữ cảnh → NHÓM khối theo thứ tự → khối nhấn vào sau cùng (R11, R12) ---------- */
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  if (sb && !warm) tl.from('.sb .brand', { y: -10, opacity: 0, duration: .5 }, 0)
    .from('.sb-nav li', { x: -14, opacity: 0, duration: .5, stagger: .035 }, .05)
    .to(ghost, { scaleX: 1, duration: .45 }, .3)
    .from('.promo, .sb-user', { y: 12, opacity: 0, duration: .55, stagger: .08 }, .4);
  else if (sb) tl.from('.promo', { y: 8, opacity: 0, duration: .45 }, .25); // vào ấm: chỉ thẻ gợi ý (đổi theo trang) hiện lại
  if (tb) tl.from('.tb > *', { y: -8, opacity: 0, duration: .5, stagger: .05 }, .1);
  tl.from('.ph > *', { y: 10, opacity: 0, duration: .5, stagger: .06 }, .25)
    .to('.mark path', { strokeDashoffset: 0, duration: .55, stagger: .12, ease: 'power2.out' }, .6)
    .from('.alert', { y: 10, opacity: 0, duration: .5 }, .4);
  // tab ẩn (Browser pane) có viewport 0×0 → coi như 900 để khối vào timeline, không treo ở ScrollTrigger
  const unsized = innerWidth < 120 || innerHeight < 120; // tab ẩn 0×0: không biết bố cục → mọi khối vào timeline, không chờ cuộn
  const vh = innerHeight > 120 ? innerHeight : 900, all = $$('[data-reveal]'), accent = all.filter(c => c.matches('.card--ink, .card--amber, .card--warm, .t-ink, .t-hot, .stile.is-ink'));
  const cards = all.filter(c => !accent.includes(c));
  const above = cards.filter(c => unsized || inRail(c) || c.getBoundingClientRect().top < vh * .92), below = cards.filter(c => !above.includes(c));
  // gom theo hàng: các khối có cùng offsetTop (±8 px) vào cùng một nhịp
  const rowsOf = els => { const rows = []; els.forEach(el => { const t = el.getBoundingClientRect().top; const r = rows.find(x => Math.abs(x.t - t) < 8); r ? r.els.push(el) : rows.push({ t, els: [el] }); }); return rows.sort((a, b) => a.t - b.t).map(r => r.els); };
  rowsOf(above).forEach((els, i) => tl.from(els, { y: 22, opacity: 0, duration: .7, stagger: .05 }, .45 + i * .12));
  below.forEach(c => gsap.from(c, { y: 22, opacity: 0, duration: .7, scrollTrigger: window.ScrollTrigger ? { trigger: c, start: 'top 90%', once: true } : undefined, delay: window.ScrollTrigger ? 0 : .6 }));
  const accAbove = accent.filter(c => unsized || inRail(c) || c.getBoundingClientRect().top < vh * .92);
  if (accAbove.length) tl.from(accAbove, { scale: .96, opacity: 0, transformOrigin: '50% 50%', duration: .7, ease: 'power3.out', stagger: .08 }, .85);
  accent.filter(c => !accAbove.includes(c)).forEach(c => gsap.from(c, { scale: .96, opacity: 0, duration: .7, scrollTrigger: window.ScrollTrigger ? { trigger: c, start: 'top 90%', once: true } : undefined }));
  // "lắp ráp" nội dung con
  above.concat(accAbove).forEach((c, i) => { const kids = $$('[data-pop]', c); if (kids.length) tl.from(kids, { scale: .75, opacity: 0, transformOrigin: '50% 50%', duration: .55, stagger: .06, ease: 'back.out(1.7)' }, .8 + i * .06); });
  $$('[data-pop-row]').forEach((c, i) => { const rows = $$(':scope > *', c); if (rows.length && (unsized || inRail(c) || c.getBoundingClientRect().top < vh)) tl.from(rows, { x: -10, opacity: 0, duration: .45, stagger: .05, ease: 'power2.out' }, .85 + i * .06); });
  $$('[data-draw]').forEach(svg => {
    const ls = $$('line, path, polyline', svg).filter(p => !p.closest('[data-pop]')); prepDraw(ls);
    const v = { strokeDashoffset: 0, duration: .9, stagger: .06, ease: 'power2.out' };
    if (unsized || inRail(svg) || svg.getBoundingClientRect().top < vh * .92 || !window.ScrollTrigger) tl.to(ls, v, .9); else gsap.to(ls, { ...v, scrollTrigger: { trigger: svg, start: 'top 88%', once: true } });
  });

  /* ---------- số đếm (0,6–0,9 s), thanh & vòng ---------- */
  $$('[data-count]').forEach(el => {
    const end = parseFloat(el.dataset.count), dec = (el.dataset.count.split('.')[1] || '').length, pre = el.dataset.prefix || '', suf = el.dataset.suffix || '';
    const fmt = v => pre + v.toLocaleString('vi-VN', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suf;
    el.textContent = fmt(0); const o = { v: 0 };
    tl.to(o, { v: end, duration: .8, ease: 'power3.out', onUpdate: () => el.textContent = fmt(o.v) }, .9);
  });
  $$('.mbar i').forEach(b => tl.from(b, { scaleX: 0, duration: .8, ease: 'power3.out' }, .9));
  $$('.ring').forEach(r => { const p = parseFloat(r.style.getPropertyValue('--p')) || 0; tl.fromTo(r, { '--p': 0 }, { '--p': p, duration: .8, ease: 'power3.out' }, .9); });
  const bell = $('.tb-bell .ic'); if (bell) tl.fromTo(bell, { rotation: 0, transformOrigin: '50% 10%' }, { rotation: 14, duration: .12, yoyo: true, repeat: 5, ease: 'sine.inOut' }, 1.15);

  /* ---------- hover & lặp nhỏ ---------- */
  $$('.card[data-lift], .tcard').forEach(c => {
    c.addEventListener('mouseenter', () => gsap.to(c, { y: -4, duration: .45, ease: 'power2.out', overwrite: 'auto' }));
    c.addEventListener('mouseleave', () => gsap.to(c, { y: 0, duration: .45, ease: 'power2.out', overwrite: 'auto' }));
  });
  $$('.btn:not(.btn-xs)').forEach(b => {
    b.addEventListener('pointermove', e => { if (e.pointerType !== 'mouse') return; const r = b.getBoundingClientRect();
      gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * .14, y: (e.clientY - r.top - r.height / 2) * .24, duration: .4, ease: 'power2.out' }); });
    b.addEventListener('pointerleave', () => gsap.to(b, { x: 0, y: 0, duration: .6, ease: 'elastic.out(1,.4)' }));
  });
  $$('[data-float]').forEach((f, i) => gsap.to(f, { y: i % 2 ? 6 : -6, duration: 3.6 + i * .4, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1.5 }));

  /* ---------- failsafe: tab ẩn/bị bóp khung lúc vào trang → sau 3,2 s (hoặc khi hiện lại) ép intro về trạng thái cuối, không để khối mờ dở dang ---------- */
  const t0 = performance.now(), settle = () => { if (tl.progress() < 1) tl.progress(1); if (window.ScrollTrigger) ScrollTrigger.refresh(); };
  setTimeout(settle, 3200);
  document.addEventListener('visibilitychange', () => { if (!document.hidden && performance.now() - t0 > 2500) settle(); });
})();
