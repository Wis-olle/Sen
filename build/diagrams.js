const fs = require('fs');
const sharp = require('sharp');
const F = 'Arial, Segoe UI, Helvetica, sans-serif';
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function box(x, y, w, h, lines, opt = {}) {
  const fill = opt.fill || '#eef2ff', stroke = opt.stroke || '#3730a3', fs = opt.fs || 17;
  const dash = opt.dash ? ' stroke-dasharray="8,5"' : '';
  const lh = fs * 1.3; const total = lines.length * lh; const y0 = y + h / 2 - total / 2 + lh * 0.75;
  const t = lines.map((l, i) => `<text x="${x + w / 2}" y="${y0 + i * lh}" font-family="${F}" font-size="${fs}" text-anchor="middle" fill="#111"${(i === 0 && opt.titleBold) || opt.bold ? ' font-weight="bold"' : ''}>${esc(l)}</text>`).join('');
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${opt.rx ?? 10}" fill="${fill}" stroke="${stroke}" stroke-width="2"${dash}/>` + t;
}
function ellipse(cx, cy, rx, ry, lines, opt = {}) {
  const fs = opt.fs || 15; const lh = fs * 1.3; const total = lines.length * lh; const y0 = cy - total / 2 + lh * 0.75;
  const t = lines.map((l, i) => `<text x="${cx}" y="${y0 + i * lh}" font-family="${F}" font-size="${fs}" text-anchor="middle" fill="#111">${esc(l)}</text>`).join('');
  return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${opt.fill || '#fff7ed'}" stroke="${opt.stroke || '#c2410c'}" stroke-width="2"${opt.dash ? ' stroke-dasharray="8,5"' : ''}/>` + t;
}
function label(x, y, text, opt = {}) {
  const fs = opt.fs || 16; let s = '';
  if (opt.bg) {
    const w = text.length * fs * 0.52 + 10; const ax = opt.anchor === 'middle' ? x - w / 2 : opt.anchor === 'end' ? x - w : x - 5;
    s += `<rect x="${ax}" y="${y - fs * 0.85}" width="${w}" height="${fs * 1.15}" fill="#ffffff" fill-opacity="0.92"/>`;
  }
  return s + `<text x="${x}" y="${y}" font-family="${F}" font-size="${fs}" text-anchor="${opt.anchor || 'start'}" fill="${opt.color || '#111'}"${opt.bold ? ' font-weight="bold"' : ''}${opt.italic ? ' font-style="italic"' : ''}>${esc(text)}</text>`;
}
function arrow(x1, y1, x2, y2, lbl, opt = {}) {
  const dash = opt.dash ? ' stroke-dasharray="7,5"' : ''; const col = opt.color || '#374151';
  let s = `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${col}" stroke-width="2.2"${dash} marker-end="url(#ah)"/>`;
  if (lbl) {
    const mx = (x1 + x2) / 2 + (opt.dx || 0), my = (y1 + y2) / 2 + (opt.dy ?? -8);
    s += label(mx, my, lbl, { fs: 14, anchor: 'middle', italic: true, color: '#1f2937', bg: true });
  }
  return s;
}
function line(x1, y1, x2, y2, opt = {}) {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${opt.color || '#374151'}" stroke-width="2"${opt.dash ? ' stroke-dasharray="7,5"' : ''}/>`;
}
function actor(cx, cy, name, opt = {}) {
  const c = opt.color || '#111'; const dash = opt.dash ? ' stroke-dasharray="6,4"' : '';
  return `<g stroke="${c}" stroke-width="2.5" fill="none"${dash}><circle cx="${cx}" cy="${cy}" r="14"/><line x1="${cx}" y1="${cy + 14}" x2="${cx}" y2="${cy + 60}"/><line x1="${cx - 26}" y1="${cy + 30}" x2="${cx + 26}" y2="${cy + 30}"/><line x1="${cx}" y1="${cy + 60}" x2="${cx - 22}" y2="${cy + 95}"/><line x1="${cx}" y1="${cy + 60}" x2="${cx + 22}" y2="${cy + 95}"/></g>` +
    name.map((n, i) => `<text x="${cx}" y="${cy + 120 + i * 19}" font-family="${F}" font-size="16" font-weight="bold" text-anchor="middle" fill="${c}">${esc(n)}</text>`).join('');
}
function svg(w, h, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs><marker id="ah" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L10,5 L0,10 z" fill="#374151"/></marker></defs><rect width="${w}" height="${h}" fill="#ffffff"/>${body}</svg>`;
}

// ---------- D1: Architecture ----------
{
  let b = '';
  b += box(20, 40, 230, 90, ['Cổng thông tin đào tạo', 'daotao.utt.edu.vn', '(lịch học, lịch thi, điểm)'], { fill: '#f3f4f6', stroke: '#6b7280', fs: 15 });
  b += box(20, 160, 230, 90, ['Thư viện số DSpace', 'thuvien.utt.edu.vn:8080', '(danh mục, bài giảng PDF)'], { fill: '#f3f4f6', stroke: '#6b7280', fs: 15 });
  b += label(735, 30, 'Lớp trình bày (client)', { anchor: 'middle', bold: true, fs: 16, color: '#374151' });
  b += box(300, 45, 270, 80, ['Browser extension', '(Chrome, Manifest V3)'], { fill: '#ecfdf5', stroke: '#047857', fs: 16 });
  b += box(600, 45, 270, 80, ['Web app', '(Next.js)'], { fill: '#ecfdf5', stroke: '#047857', fs: 16 });
  b += box(900, 45, 270, 80, ['Mobile app', '(React Native / Expo)'], { fill: '#ecfdf5', stroke: '#047857', fs: 16 });
  b += arrow(250, 85, 300, 85, '');
  b += label(275, 70, 'đọc trang', { anchor: 'middle', fs: 12, italic: true });
  b += arrow(250, 205, 300, 120, '');
  b += label(80, 280, 'nhập PDF sau khi đăng nhập', { anchor: 'start', fs: 12, italic: true });
  b += box(300, 190, 870, 330, [''], { fill: '#f8fafc', stroke: '#1e3a8a', rx: 12 });
  b += label(735, 218, 'Backend: modular monolith (Node.js / TypeScript), API REST + hàng đợi', { anchor: 'middle', bold: true, fs: 16, color: '#1e3a8a' });
  const mods = [['Identity', 'tài khoản, hồ sơ'], ['Integration', 'cổng đào tạo, DSpace'], ['Content', 'tài liệu, OCR, RAG'], ['Knowledge', 'bản đồ, thành thạo'],
    ['Personalization', 'lộ trình, soạn bài học'], ['Tutor', 'chat, trí nhớ'], ['Practice', 'quiz, flashcard, SRS'], ['Progress', 'tiến độ, thông báo']];
  mods.forEach((m, i) => { const col = i % 4, row = Math.floor(i / 4); b += box(320 + col * 212, 240 + row * 95, 195, 78, [m[0], m[1]], { fill: '#e0e7ff', stroke: '#3730a3', fs: 15, titleBold: true }); });
  b += box(320, 435, 405, 70, ['Admin: người dùng, cấu hình, nhật ký'], { fill: '#e0e7ff', stroke: '#3730a3', fs: 15 });
  b += box(745, 435, 405, 70, ['Worker: xử lý tài liệu, sinh bài học trước, nhắc lịch'], { fill: '#fef3c7', stroke: '#b45309', fs: 15 });
  b += arrow(435, 125, 435, 190, ''); b += arrow(735, 125, 735, 190, ''); b += arrow(1035, 125, 1035, 190, '');
  b += label(760, 165, 'HTTPS / JSON', { fs: 12, italic: true });
  b += line(60, 250, 60, 600); b += arrow(60, 600, 300, 600, '');
  b += label(70, 590, 'OAI-PMH: danh mục,', { fs: 12, italic: true });
  b += label(70, 620, 'không cần đăng nhập', { fs: 12, italic: true });
  b += box(300, 580, 240, 80, ['PostgreSQL + pgvector', '(dữ liệu, chỉ mục vector)'], { fill: '#fef2f2', stroke: '#b91c1c', fs: 15 });
  b += box(560, 580, 200, 80, ['Redis', '(cache, hàng đợi)'], { fill: '#fef2f2', stroke: '#b91c1c', fs: 15 });
  b += box(780, 580, 190, 80, ['Object storage', '(file gốc)'], { fill: '#fef2f2', stroke: '#b91c1c', fs: 15 });
  b += box(990, 580, 180, 80, ['LLM API', '(Claude)'], { fill: '#fdf4ff', stroke: '#7e22ce', fs: 15 });
  b += arrow(420, 520, 420, 580, ''); b += arrow(660, 520, 660, 580, ''); b += arrow(875, 520, 875, 580, ''); b += arrow(1080, 520, 1080, 580, '');
  b += label(735, 685, 'Lớp dữ liệu và dịch vụ ngoài', { anchor: 'middle', bold: true, fs: 15, color: '#374151' });
  fs.writeFileSync('d1_architecture.svg', svg(1200, 700, b));
}

// ---------- D2: Personalization loop ----------
{
  let b = '';
  b += box(30, 40, 330, 110, ['Tài liệu môn học', '(thư viện số, sinh viên tải lên,', 'link YouTube, ảnh chụp)'], { fill: '#f3f4f6', stroke: '#6b7280', fs: 16 });
  b += box(30, 200, 330, 110, ['Cổng đào tạo', '(môn học, lịch thi, điểm đã thi)'], { fill: '#f3f4f6', stroke: '#6b7280', fs: 16 });
  b += box(430, 40, 320, 110, ['Bản đồ kiến thức', '+ chỉ mục RAG', '(khái niệm theo chương)'], { fill: '#e0e7ff', stroke: '#3730a3', fs: 16, titleBold: true });
  b += box(430, 200, 320, 150, ['Hồ sơ người học', '(Learner Model)', 'mức thành thạo, lỗi cũ,', 'sở thích, nhịp học, mục tiêu'], { fill: '#dbeafe', stroke: '#1d4ed8', fs: 16, titleBold: true });
  b += arrow(360, 95, 430, 95, '');
  b += arrow(360, 255, 430, 255, '');
  b += box(830, 120, 340, 150, ['Bộ soạn bài học', '(Lesson Composer + LLM)', 'chọn khái niệm, lấy đoạn tài liệu,', 'soạn theo hồ sơ, kiểm tra bám nguồn'], { fill: '#fef3c7', stroke: '#b45309', fs: 16, titleBold: true });
  b += arrow(750, 95, 830, 160, '');
  b += label(790, 78, 'quyết định NỘI DUNG ĐÚNG', { anchor: 'middle', fs: 14, italic: true, color: '#1f2937', bg: true });
  b += arrow(750, 255, 830, 215, '');
  b += label(790, 300, 'quyết định HÌNH DẠNG bài học', { anchor: 'middle', fs: 14, italic: true, color: '#1f2937', bg: true });
  b += box(830, 330, 340, 110, ['Bài học cá nhân', 'sinh tại thời điểm học, cho đúng', 'một sinh viên, một khái niệm'], { fill: '#fff7ed', stroke: '#c2410c', fs: 16, titleBold: true });
  b += arrow(1000, 270, 1000, 330, '');
  b += box(830, 490, 340, 110, ['Sinh viên học, làm quiz,', 'hỏi trợ giảng, đọc trên extension'], { fill: '#ecfdf5', stroke: '#047857', fs: 16 });
  b += arrow(1000, 440, 1000, 490, '');
  b += box(430, 490, 320, 110, ['Tín hiệu học tập', 'đúng/sai, thời gian, câu hỏi đặt ra,', 'lỗi lặp lại, đánh giá bài học'], { fill: '#dbeafe', stroke: '#1d4ed8', fs: 16, titleBold: true });
  b += arrow(830, 545, 750, 545, '');
  b += arrow(590, 490, 590, 350, 'cập nhật hồ sơ', { dx: 70 });
  b += label(600, 650, 'Vòng lặp: mỗi tín hiệu mới làm bài học tiếp theo khác đi. Cùng một chương, hai sinh viên nhận hai bài khác nhau.', { anchor: 'middle', fs: 15, italic: true, color: '#374151' });
  fs.writeFileSync('d2_loop.svg', svg(1200, 680, b));
}

// ---------- D3: Use case ----------
{
  let b = '';
  b += `<rect x="250" y="20" width="700" height="960" rx="14" fill="#fcfcfd" stroke="#1e3a8a" stroke-width="2"/>`;
  b += label(600, 50, 'Hệ thống hỗ trợ học tập cá nhân hóa bằng AI', { anchor: 'middle', bold: true, fs: 17, color: '#1e3a8a' });
  b += actor(110, 330, ['Sinh viên']);
  b += actor(1090, 430, ['Giảng viên', '(giai đoạn 2)'], { dash: true, color: '#6b7280' });
  b += actor(1090, 760, ['Quản trị viên']);
  const sv = [['UC01 Đăng nhập,', 'cập nhật hồ sơ học tập'], ['UC02 Đồng bộ dữ liệu', 'từ cổng đào tạo'], ['UC03 Nhập tài liệu', '(tải lên, thư viện số, link)'], ['UC04 Làm bài', 'chẩn đoán đầu vào'],
    ['UC05 Nhận bài học', 'cá nhân hóa'], ['UC06 Hỏi đáp', 'với trợ giảng AI'], ['UC07 Làm quiz,', 'ôn flashcard'], ['UC08 Xem lộ trình', 'và tiến độ'], ['UC09 Nhận nhắc nhở,', 'deadline'], ['UC10 Quản lý dữ liệu', 'cá nhân, quyền riêng tư']];
  sv.forEach((u, i) => { const col = i % 2, row = Math.floor(i / 2); const cx = 420 + col * 300, cy = 110 + row * 125; b += line(140, 420, cx - 130, cy); b += ellipse(cx, cy, 130, 42, u); });
  const gv = [['UC14 Đăng bài giảng,', 'đề cương (GĐ2)'], ['UC15 Xem thống kê', 'lớp học (GĐ2)']];
  b += line(1060, 525, 690, 730, { dash: true, color: '#6b7280' }); b += ellipse(560, 730, 130, 40, gv[0], { dash: true, fill: '#f3f4f6', stroke: '#6b7280' });
  b += line(1060, 525, 940, 730, { dash: true, color: '#6b7280' }); b += ellipse(830, 730, 110, 40, gv[1], { dash: true, fill: '#f3f4f6', stroke: '#6b7280' });
  const ad = [['UC11 Quản lý', 'người dùng'], ['UC12 Cấu hình', 'hệ thống và AI'], ['UC13 Xem nhật ký,', 'thống kê']];
  const adPos = [[420, 840], [650, 915], [880, 840]];
  ad.forEach((u, i) => { const [cx, cy] = adPos[i]; b += line(1060, 850, cx + 120, cy); b += ellipse(cx, cy, 120, 40, u, { fill: '#f3e8ff', stroke: '#7e22ce' }); });
  fs.writeFileSync('d3_usecase.svg', svg(1200, 1000, b));
}

// ---------- D4: Data model ----------
{
  let b = '';
  const W = 200; const C = [20, 260, 500, 740, 980]; const R = [30, 200, 370, 540];
  const E = (ci, ri, name, attrs, opt = {}) => {
    const x = C[ci], y = R[ri]; const h = 30 + attrs.length * 20 + 12;
    let s = `<rect x="${x}" y="${y}" width="${W}" height="${h}" fill="#fff" stroke="${opt.stroke || '#1e3a8a'}" stroke-width="2"/><rect x="${x}" y="${y}" width="${W}" height="30" fill="${opt.fill || '#e0e7ff'}" stroke="${opt.stroke || '#1e3a8a'}" stroke-width="2"/>`;
    s += `<text x="${x + W / 2}" y="${y + 21}" font-family="${F}" font-size="14" font-weight="bold" text-anchor="middle" fill="#111">${esc(name)}</text>`;
    attrs.forEach((a, i) => { s += `<text x="${x + 8}" y="${y + 50 + i * 20}" font-family="${F}" font-size="12.5" fill="#1f2937">${esc(a)}</text>`; });
    return s;
  };
  const relH = (x1, x2, y, l1, l2) => line(x1, y, x2, y, { color: '#6b7280' }) + label(x1 + 6, y - 6, l1, { fs: 12, color: '#374151' }) + label(x2 - 6, y - 6, l2, { fs: 12, anchor: 'end', color: '#374151' });
  const relV = (x, y1, y2, l1, l2) => line(x, y1, x, y2, { color: '#6b7280' }) + label(x + 8, y1 + 16, l1, { fs: 12, color: '#374151' }) + label(x + 8, y2 - 6, l2, { fs: 12, color: '#374151' });
  E; b += E(0, 0, 'SinhVien (Student)', ['id, họ tên, MSSV, ngành', 'mục tiêu, giờ rảnh, sở thích']);
  b += E(1, 0, 'DangKy (Enrollment)', ['sinh_vien_id, mon_hoc_id', 'học kỳ, ngày thi, điểm cũ']);
  b += E(2, 0, 'MonHoc (Course)', ['id, mã môn, tên, giảng viên', 'nguồn: cổng đào tạo']);
  b += E(3, 0, 'TaiLieu (Material)', ['id, mon_hoc_id, sinh_vien_id', 'loại, nguồn, trạng thái xử lý']);
  b += E(4, 0, 'Doan (Chunk)', ['id, tai_lieu_id, nội dung', 'embedding (vector)'], { fill: '#fee2e2', stroke: '#b91c1c' });
  b += E(0, 1, 'HoSoNguoiHoc (Profile)', ['sinh_vien_id', 'nhịp học, định dạng ưa thích'], { fill: '#dbeafe', stroke: '#1d4ed8' });
  b += E(1, 1, 'TriNho (Memory)', ['id, sinh_vien_id, khai_niem_id', 'loại: hiểu sai / sở thích', 'nội dung, ngày ghi'], { fill: '#dbeafe', stroke: '#1d4ed8' });
  b += E(2, 1, 'KhaiNiem (Concept)', ['id, mon_hoc_id, tên, chương', 'tiên quyết, đoạn liên quan']);
  b += E(3, 1, 'ThanhThao (Mastery)', ['sinh_vien_id, khai_niem_id', 'điểm 0..100, lần ôn cuối', 'độ ổn định (quên)'], { fill: '#dbeafe', stroke: '#1d4ed8' });
  b += E(0, 2, 'KeHoach (StudyPlan)', ['id, sinh_vien_id, tuần', 'sinh bởi AI, phiên bản']);
  b += E(1, 2, 'MucKeHoach (PlanItem)', ['ke_hoach_id, khai_niem_id', 'ngày, thời lượng, trạng thái']);
  b += E(2, 2, 'BaiHoc (Lesson)', ['id, sinh_vien_id, khai_niem_id', 'nội dung sinh ra, đoạn trích dẫn', 'đánh giá của SV, phiên bản prompt'], { fill: '#fff7ed', stroke: '#c2410c' });
  b += E(3, 2, 'CauHoi (Quiz item)', ['id, bai_hoc_id | khai_niem_id', 'câu hỏi, đáp án, giải thích']);
  b += E(4, 2, 'LanLam (Attempt)', ['cau_hoi_id, sinh_vien_id', 'kết quả, thời gian']);
  b += E(0, 3, 'Flashcard + LichOn', ['sinh_vien_id, khai_niem_id', 'lần ôn tới, khoảng cách (SRS)']);
  b += E(1, 3, 'SuKienHoc (Event)', ['sinh_vien_id, nguồn', 'URL, tiêu đề, khai_niem_id', 'thời lượng']);
  b += E(2, 3, 'HoiThoai (TutorMessage)', ['sinh_vien_id, vai, nội dung', 'ngữ cảnh: khai_niem, đoạn']);
  b += E(3, 3, 'Deadline / ThongBao', ['sinh_vien_id, mon_hoc_id', 'hạn, nguồn: nhập tay / AI rút']);
  b += E(4, 3, 'NguoiDung (User)', ['id, email, vai trò', 'SV / Admin / GV (GĐ2)'], { fill: '#f3e8ff', stroke: '#7e22ce' });
  b += relH(220, 260, 60, '1', 'n'); b += relH(460, 500, 60, 'n', '1'); b += relH(700, 740, 60, '1', 'n'); b += relH(940, 980, 60, '1', 'n');
  b += relV(120, 112, 200, '1', '1');
  b += relV(600, 112, 200, '1', 'n'); b += label(612, 160, '1 môn có n khái niệm', { fs: 12, italic: true });
  b += relH(700, 740, 230, '1', 'n');
  b += relH(220, 260, 400, '1', 'n'); b += relH(700, 740, 410, '1', 'n'); b += relH(940, 980, 410, '1', 'n');
  b += line(360, 302, 560, 370, { color: '#6b7280' }); b += label(380, 345, 'lỗi cũ đưa vào bài học', { fs: 12, italic: true, bg: true });
  b += line(840, 302, 640, 370, { color: '#6b7280' }); b += label(700, 352, 'thành thạo quyết định bài học', { fs: 12, italic: true, bg: true });
  b += relV(840, 302, 370, '', ''); b += label(850, 328, 'sinh câu hỏi theo điểm yếu', { fs: 12, italic: true, bg: true });
  b += label(600, 690, 'Sơ đồ rút gọn: chỉ các thực thể chính và thuộc tính tiêu biểu. Chi tiết trong bảng ở mục 9.2.', { anchor: 'middle', fs: 14, italic: true, color: '#374151' });
  fs.writeFileSync('d4_erd.svg', svg(1200, 710, b));
}

(async () => {
  for (const n of ['d1_architecture', 'd2_loop', 'd3_usecase', 'd4_erd']) {
    const info = await sharp(n + '.svg', { density: 192 }).png().toFile(n + '.png');
    console.log(n, info.width, info.height);
  }
})();
