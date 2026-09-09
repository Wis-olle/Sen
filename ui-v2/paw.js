/* Sen — tay mèo thò ra vỗ nút CTA khi rê chuột (tham khảo nút "Get started" của rive.app).
   Đánh dấu nút bằng data-paw="left|right|top"; CSS ở style.css (.paw).
   Chỉ với chuột (bỏ qua chạm), tắt khi reduced-motion / ?static. */
(function () {
  if (!window.gsap || matchMedia('(prefers-reduced-motion: reduce)').matches || /[?&]static/.test(location.search)) return;
  // hình vẽ 1 lần: lớp viền (fill+stroke mực) rồi lớp trắng đè lên → các khối hợp thành một bàn tay liền nét
  const S = '<rect x="-40" y="11" width="70" height="14" rx="7"/><circle cx="34" cy="18" r="11"/><circle cx="46" cy="9.5" r="5.6"/><circle cx="50" cy="18" r="5.8"/><circle cx="46" cy="26.5" r="5.6"/>';
  const SVG = '<svg viewBox="0 0 64 36" aria-hidden="true"><g fill="#1d1d1d" stroke="#1d1d1d" stroke-width="4.4" stroke-linejoin="round">' + S + '</g><g fill="#fff">' + S + '</g>'
    + '<g fill="#f8c365"><ellipse cx="35" cy="18" rx="4.6" ry="4.2"/><circle cx="46.5" cy="9.5" r="2.6"/><circle cx="50.5" cy="18" r="2.7"/><circle cx="46.5" cy="26.5" r="2.6"/></g></svg>';
  const HID = { xPercent: 172, rotation: -14 }; // theo % bề rộng svg để tay to theo nút
  document.querySelectorAll('[data-paw]').forEach(btn => {
    const side = btn.dataset.paw || 'left';
    const box = document.createElement('span'); box.className = 'paw paw--' + side; box.innerHTML = SVG; btn.append(box);
    const paw = box.firstElementChild;
    gsap.set(paw, { ...HID, transformOrigin: '0% 50%' });
    // nút bị "đẩy" bằng xPercent/yPercent → không đụng x/y của nút nam châm (app.js)
    const push = side === 'top' ? { yPercent: 5 } : { xPercent: side === 'left' ? 1.8 : -1.8 };
    let tl;
    btn.addEventListener('pointerenter', e => {
      if (e.pointerType !== 'mouse') return;
      if (tl) tl.kill();
      tl = gsap.timeline().to(paw, { xPercent: 0, rotation: 0, duration: .45, ease: 'back.out(2)' });
      for (let i = 0; i < 2; i++) tl
        .to(paw, { xPercent: 11, duration: .12, ease: 'power2.in' }, i ? '+=.14' : '-=.05')
        .to(btn, { ...push, duration: .12, ease: 'power2.in' }, '<')
        .to(paw, { xPercent: 0, duration: .24, ease: 'power2.out' })
        .to(btn, { xPercent: 0, yPercent: 0, duration: .3, ease: 'power2.out' }, '<');
    });
    btn.addEventListener('pointerleave', () => {
      if (tl) tl.kill();
      tl = gsap.timeline().to(paw, { ...HID, duration: .3, ease: 'power2.in' })
        .to(btn, { xPercent: 0, yPercent: 0, duration: .5, ease: 'elastic.out(1,.4)' }, 0);
    });
  });
})();
