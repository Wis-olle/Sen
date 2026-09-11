/* Sen — api.js: lớp gọi /api dùng chung cho 4 màn của luồng demo (hợp đồng 11-hop-dong-du-lieu-demo.md §3).
   Phiên = cookie HttpOnly cùng origin (cách A) → credentials:'same-origin', không lưu token.
   Lỗi = {error:{code,message}}, message tiếng Việt hiện thẳng. 401 → về login.html.
   Nạp TRƯỚC shell.js và script riêng của trang. */
(function () {
  const onLogin = /login(\.html)?$/.test(location.pathname);

  class ApiError extends Error {
    constructor(code, message, status, body) { super(message); this.name = 'ApiError'; this.code = code; this.status = status; this.body = body; }
  }

  async function api(path, { method = 'GET', body } = {}) {
    let res;
    try {
      res = await fetch(path, {
        method, credentials: 'same-origin',
        headers: body ? { 'Content-Type': 'application/json' } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      });
    } catch (_) {
      throw new ApiError('NETWORK_ERROR', 'Không kết nối được máy chủ. Kiểm tra mạng rồi thử lại.', 0, null);
    }
    const data = res.status === 204 ? {} : await res.json().catch(() => ({}));
    if (res.ok) return data;
    // hợp đồng: {error:{code,message}} — vẫn đọc được {error:"chuỗi"} để không vỡ khi backend chưa đổi khuôn
    const e = data && data.error || {};
    const code = e.code || (res.status === 401 ? 'UNAUTHENTICATED' : 'INTERNAL_ERROR');
    const message = e.message || (typeof (data && data.error) === 'string' ? data.error : 'Có lỗi xảy ra, thử lại sau.');
    if (res.status === 401 && code !== 'INVALID_CREDENTIALS' && !onLogin) location.replace('login.html');
    throw new ApiError(code, message, res.status, data);
  }

  /* Vòng poll việc nền: 2 000 ms, nghỉ khi tab ẩn (gọi lại ngay khi hiện), trần 60 lần, dọn khi rời trang.
     ponytail: poll 2 s, đổi sang SSE nếu >20 người chờ đồng thời */
  function poll(jobId, onStep) {
    return new Promise((resolve, reject) => {
      let n = 0, id, vis;
      const stop = () => { clearInterval(id); removeEventListener('beforeunload', stop); document.removeEventListener('visibilitychange', vis); };
      const fail = err => { stop(); reject(err); };
      const tick = async () => {
        if (document.hidden) return;
        if (++n > 60) return fail(new ApiError('TIMEOUT', 'Chờ quá lâu chưa có bài. Bấm “Thử lại”.', 0, null));
        let j;
        try { j = await api('/api/jobs/' + encodeURIComponent(jobId)); } catch (err) { return fail(err); }
        if (onStep) onStep(j);
        if (j.status === 'done') { stop(); resolve(j); }
        else if (j.status === 'error') fail(new ApiError((j.error || {}).code || 'INTERNAL_ERROR', (j.error || {}).message || 'Sinh bài thất bại.', 0, j));
      };
      vis = () => { if (!document.hidden) tick(); };
      document.addEventListener('visibilitychange', vis);
      addEventListener('beforeunload', stop);
      id = setInterval(tick, 2000);
      tick();
    });
  }

  const param = k => new URLSearchParams(location.search).get(k);

  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* Biên tin cậy: trường `html` do AI sinh → chỉ giữ <b>, <code>, <a href>. Thẻ lạ bị bóc, chữ giữ lại. */
  const OK = { B: [], CODE: [], A: ['href', 'data-soon'] };
  function safe(html) {
    const t = document.createElement('template');
    t.innerHTML = String(html == null ? '' : html);
    // querySelectorAll trả danh sách tĩnh theo thứ tự tài liệu: bóc cha xong vẫn duyệt tới con
    t.content.querySelectorAll('*').forEach(n => {
      const allow = OK[n.tagName];
      if (!allow) return n.replaceWith(...n.childNodes);
      [...n.attributes].forEach(a => { if (!allow.includes(a.name)) n.removeAttributeNode(a); });
      if (n.tagName === 'A' && /^\s*(javascript|data|vbscript):/i.test(n.getAttribute('href') || '')) n.removeAttribute('href');
    });
    return t.innerHTML;
  }

  window.SEN_API = { api, poll, param, safe, esc, ApiError };

  /* Tự kiểm (mở console): SEN_API.check() — im lặng nếu bộ lọc HTML còn đúng */
  window.SEN_API.check = () => {
    const t = [
      ['<b>đậm</b> và <code>mã</code>', '<b>đậm</b> và <code>mã</code>'],
      ['<img src=x onerror=alert(1)>chữ', 'chữ'],
      ['<div><img onerror="x"></div>giữ', 'giữ'],
      ['<a href="#" data-soon onclick="x()">ôn</a>', '<a href="#" data-soon="">ôn</a>'],
      ['<a href="javascript:alert(1)">bẫy</a>', '<a>bẫy</a>'],
      ['<script>alert(1)<\/script>', 'alert(1)'],
    ];
    t.forEach(([i, o]) => { const g = safe(i); if (g !== o) console.error('safe() lệch:', i, '→', g, '· mong đợi', o); });
    return 'safe(): ' + t.length + ' ca đã chạy';
  };
})();
