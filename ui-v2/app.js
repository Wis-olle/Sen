/* Sen — chuyển động (GSAP 3.15 + ScrollTrigger). Mọi trạng thái ban đầu do JS đặt,
   nên nếu JS không chạy / người dùng tắt chuyển động, trang vẫn hiện đầy đủ. */
(function () {
  /* ?static → tắt mọi chuyển động (chụp ảnh tĩnh / review bố cục) */
  const rm = matchMedia('(prefers-reduced-motion: reduce)').matches || /[?&]static/.test(location.search);
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ---------- Nav ---------- */
  const nav = $('.site-nav');
  const onScroll = () => nav.classList.toggle('is-scrolled', scrollY > 24);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  const burger = $('.nav-burger'), mobile = $('.nav-mobile');
  if (burger) burger.addEventListener('click', () => {
    const open = mobile.classList.toggle('open'); burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
  });

  /* ảnh động (WebP) → đổi sang SVG tĩnh cùng tư thế khi tắt chuyển động */
  if (rm) { document.documentElement.classList.add('is-static'); $$('img[data-static]').forEach(i => { i.src = i.dataset.static; }); }
  // nhân vật hero: Lottie vector (Icons8 Open Doodles) thay ảnh SVG tĩnh sau khi dựng xong khung đầu
  // dữ liệu ở assets/anim/<key>.js (JSON bọc JS để mở file:// vẫn chạy), chỉ nạp cho nhân vật đang hiển thị (mobile ẩn Bình)
  if (!rm && window.lottie) $$('[data-lottie]').forEach(f => {
    if (getComputedStyle(f).display === 'none') return;
    const key = f.dataset.lottie, start = () => {
      const box = document.createElement('div'); box.className = 'lot';
      lottie.loadAnimation({ container: box, renderer: 'svg', loop: true, autoplay: true, animationData: SEN_ANIM[key] })
        .addEventListener('DOMLoaded', () => f.querySelector('img').replaceWith(box));
    };
    if (window.SEN_ANIM && SEN_ANIM[key]) start();
    else { const s = document.createElement('script'); s.src = 'assets/anim/' + key + '.js'; s.onload = start; document.head.appendChild(s); }
  });
  if (rm || !window.gsap) return;
  gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

  /* ---------- Nét vẽ tay tự vẽ (stroke-dashoffset) ---------- */
  const prepDraw = (paths) => paths.forEach(p => { const L = p.getTotalLength(); p.style.strokeDasharray = L; p.style.strokeDashoffset = L; });
  const drawPaths = $$('.hero .mark path'); prepDraw(drawPaths);

  /* ---------- Hero intro ---------- */
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
  tl.from('.site-nav .container > *', { y: -14, opacity: 0, duration: .7, stagger: .08 }, 0)
    .from('.hero .w > span', { yPercent: 115, duration: 1, stagger: .055 }, .15)
    .from('.hero .pill', { scale: .55, rotation: -8, duration: .9, ease: 'back.out(1.8)' }, .55)
    .to('.mk-sparkle path', { strokeDashoffset: 0, duration: .6, ease: 'power2.out' }, .8)
    .from('.hero-side > *', { y: 26, opacity: 0, duration: .9, stagger: .12 }, .5)
    .from('.figure', { y: 40, opacity: 0, scale: .96, transformOrigin: '50% 100%', duration: 1, stagger: .12 }, .5)
    .from('.fcard', { y: 46, opacity: 0, scale: .72, duration: 1, ease: 'back.out(1.5)', stagger: .09 }, .8)
    .from('.badge-rot', { scale: 0, opacity: 0, duration: .8, ease: 'back.out(2)' }, 1.3)
    .to('.hero-art .mark path, .mk-arrow path', { strokeDashoffset: 0, duration: .7, stagger: .12, ease: 'power2.out' }, 1.15)
    .from('.blob', { scale: .6, opacity: 0, transformOrigin: '50% 50%', duration: 1.6, ease: 'power3.out' }, 0);

  /* thanh thành thạo + số đếm trong thẻ */
  const bar = $('.fc-mastery .bar i'), num = $('.fc-mastery .num b');
  if (bar) {
    const o = { v: 0 };
    tl.from(bar, { scaleX: 0, transformOrigin: '0% 50%', duration: 1.2, ease: 'power3.out' }, 1.4)
      .to(o, { v: 62, duration: 1.2, ease: 'power3.out', onUpdate: () => num.textContent = Math.round(o.v) }, 1.4);
  }
  /* bản đồ nhỏ: đường nối vẽ, nút bật */
  const mapLines = $$('.mini-map line'); prepDraw(mapLines);
  tl.to(mapLines, { strokeDashoffset: 0, duration: .6, stagger: .1, ease: 'power2.out' }, 1.5)
    .from('.mini-map circle, .mini-map text', { scale: 0, transformOrigin: '50% 50%', duration: .5, stagger: .06, ease: 'back.out(2)' }, 1.6);

  /* máy bay giấy: đường chấm hiện dần (mask) + bay theo đường */
  const route = $('.flight .route'), routeMask = $('.flight .route-mask'), plane = $('.flight .plane');
  if (route && plane) {
    prepDraw([routeMask]);
    gsap.set(plane, { xPercent: 0, yPercent: 0, opacity: 0 }); // ẩn tới lúc cất cánh (transform gốc là điểm hạ cánh)
    tl.to(routeMask, { strokeDashoffset: 0, duration: 1.8, ease: 'power1.inOut' }, 1.2)
      .set(plane, { opacity: 1 }, 1.2)
      .to(plane, { motionPath: { path: route, align: route, alignOrigin: [.5, .5], autoRotate: true }, duration: 1.8, ease: 'power1.inOut' }, 1.2)
      .to(plane, { y: '-=6', duration: 3.2, ease: 'sine.inOut', yoyo: true, repeat: -1 }, 3);
  }

  /* ---------- Lơ lửng liên tục ---------- */
  $$('.fcard').forEach((c, i) => gsap.to(c, { y: i % 2 ? 8 : -8, duration: 3.2 + i * .5, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1.8 }));

  /* ---------- Parallax blob theo cuộn ---------- */
  gsap.to('.blob-l', { y: -90, rotation: 12, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .6 } });
  gsap.to('.blob-r', { y: -140, rotation: -10, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .6 } });
  gsap.to('.hero-top', { y: 60, opacity: .35, ease: 'none', scrollTrigger: { trigger: '.hero', start: '40% top', end: 'bottom top', scrub: true } });

  /* ---------- Số liệu đếm ---------- */
  $$('.stat b[data-count]').forEach(el => {
    const end = parseFloat(el.dataset.count), pre = el.dataset.prefix || '', suf = el.dataset.suffix || '';
    const fmt = v => pre + Math.round(v).toLocaleString('vi-VN') + suf;
    el.textContent = fmt(0);
    ScrollTrigger.create({ trigger: el, start: 'top 88%', once: true, onEnter: () => {
      const o = { v: 0 }; gsap.to(o, { v: end, duration: 1.6, ease: 'power3.out', onUpdate: () => el.textContent = fmt(o.v) });
    } });
  });
  gsap.from('.stat', { y: 24, opacity: 0, duration: .9, stagger: .1, ease: 'power3.out', scrollTrigger: { trigger: '.stats', start: 'top 85%', once: true } });

  /* ---------- Reveal chung cho các section sau ---------- */
  $$('[data-reveal]').forEach(el => {
    const kids = el.dataset.reveal === 'stagger' ? [...el.children] : [el];
    gsap.from(kids, { y: 30, opacity: 0, duration: 1, stagger: .1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 86%', once: true } });
  });

  /* ---------- Nét vẽ tự vẽ khi cuộn tới ([data-draw]) ---------- */
  $$('[data-draw]').forEach(svg => {
    const ps = $$('path, circle, line, polyline, ellipse', svg); prepDraw(ps);
    gsap.to(ps, { strokeDashoffset: 0, duration: 1.1, stagger: .08, ease: 'power2.out', scrollTrigger: { trigger: svg, start: 'top 90%', once: true } });
  });
  /* icon tính năng bật ra */
  $$('.feat-ic').forEach(el => gsap.from($$('img, i', el), { scale: .4, rotation: -14, opacity: 0, transformOrigin: '50% 50%', duration: .9, stagger: .08, ease: 'back.out(2)', scrollTrigger: { trigger: el, start: 'top 88%', once: true } }));
  /* nhấc thẻ tính năng khi hover (GSAP thay CSS transition transform — xem ghi chú ở .feat trong style.css) */
  $$('.feat').forEach(c => {
    const halo = c.querySelector('.feat-ic i'), o = { duration: .45, ease: 'power2.out', overwrite: 'auto' };
    c.addEventListener('mouseenter', () => { gsap.to(c, { y: -6, ...o }); gsap.to(halo, { scale: 1.25, ...o }); });
    c.addEventListener('mouseleave', () => { gsap.to(c, { y: 0, ...o }); gsap.to(halo, { scale: 1, ...o }); });
  });
  /* minh họa "về sản phẩm" lơ lửng + parallax nhẹ */
  gsap.to('.about-fig', { y: -10, duration: 3.6, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  $$('.doodle').forEach((d, i) => gsap.to(d, { y: i % 2 ? 40 : -40, ease: 'none', scrollTrigger: { trigger: '.about', start: 'top bottom', end: 'bottom top', scrub: .8 } }));

  /* minh họa "cách hoạt động": chip trạng thái bay vào theo thứ tự + lơ lửng */
  gsap.from('.how-chip', { y: 24, opacity: 0, scale: .8, duration: .9, stagger: .18, ease: 'back.out(1.6)', scrollTrigger: { trigger: '.how-art', start: 'top 80%', once: true } });
  $$('.how-chip').forEach((c, i) => gsap.to(c, { y: i % 2 ? 7 : -7, duration: 3 + i * .4, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
  gsap.to('.how-fig', { y: -8, duration: 3.8, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  /* đường nối các bước "vẽ" dần theo cuộn */
  if ($('.steps')) gsap.from('.step', { '--seg': 0, duration: .7, stagger: .3, ease: 'power2.inOut', scrollTrigger: { trigger: '.steps', start: 'top 78%', once: true } });

  /* CTA: nhân vật nhảy lên khi thẻ hiện, rồi nhún nhẹ */
  const ctaImg = $('.cta-art img');
  if (ctaImg) {
    gsap.from(ctaImg, { y: 60, scale: .8, opacity: 0, duration: 1, ease: 'back.out(1.6)', scrollTrigger: { trigger: '.cta', start: 'top 78%', once: true } });
    gsap.to(ctaImg, { y: -8, duration: 3.2, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1 });
    gsap.to(ctaImg, { rotation: 1.5, transformOrigin: '50% 80%', duration: .25, ease: 'sine.inOut', yoyo: true, repeat: -1 }); /* nhịp bước chạy, bù 4 khung */
  }

  /* ---------- Line boil: đổi seed nhiễu 8 lần/giây để nét vẽ "sôi" như hoạt hình tay ---------- */
  const noise = $('#boilNoise');
  if (noise) {
    document.documentElement.classList.add('boil-on');
    let seed = 1;
    setInterval(() => { if (document.hidden) return; seed = (seed % 7) + 1; noise.setAttribute('seed', seed); }, 125);
  }

  /* ---------- Icon tính năng cử động khi hiện và khi hover ---------- */
  const ICON_ANIM = {
    up: el => gsap.fromTo(el, { y: 0 }, { y: -8, duration: .35, yoyo: true, repeat: 3, ease: 'power1.inOut' }),
    bounce: el => gsap.fromTo(el, { scale: 1 }, { scale: 1.15, rotation: 8, duration: .25, yoyo: true, repeat: 3, ease: 'power1.inOut', transformOrigin: '50% 50%' }),
    write: el => gsap.fromTo(el, { x: 0, rotation: 0 }, { x: 6, rotation: -6, duration: .18, yoyo: true, repeat: 5, ease: 'sine.inOut', transformOrigin: '0% 100%' }),
    fly: el => gsap.timeline().to(el, { y: -14, x: 8, rotation: 8, duration: .4, ease: 'power2.out' }).to(el, { y: 0, x: 0, rotation: 0, duration: .6, ease: 'bounce.out' }),
    wobble: el => gsap.fromTo(el, { rotation: -8 }, { rotation: 8, duration: .16, yoyo: true, repeat: 5, ease: 'sine.inOut', transformOrigin: '50% 100%' }),
    pop: el => gsap.fromTo(el, { scale: .6, rotation: -15 }, { scale: 1, rotation: 0, duration: .7, ease: 'elastic.out(1,.4)', transformOrigin: '50% 50%' }),
  };
  $$('.feat [data-anim]').forEach(el => {
    const run = () => ICON_ANIM[el.dataset.anim](el);
    el.closest('.feat').addEventListener('mouseenter', run);
    ScrollTrigger.create({ trigger: el, start: 'top 85%', once: true, onEnter: () => setTimeout(run, 700) });
  });

  /* ---------- Nút "nam châm" ---------- */
  // không gate bằng matchMedia('(hover:hover)'): laptop màn cảm ứng báo hover:none dù đang dùng chuột → lọc theo pointerType từng sự kiện
  $$('.btn').forEach(b => {
    b.addEventListener('pointermove', e => { if (e.pointerType !== 'mouse') return; const r = b.getBoundingClientRect();
      gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * .18, y: (e.clientY - r.top - r.height / 2) * .28, duration: .4, ease: 'power2.out' }); });
    b.addEventListener('pointerleave', () => gsap.to(b, { x: 0, y: 0, duration: .6, ease: 'elastic.out(1,.4)' }));
  });
})();
