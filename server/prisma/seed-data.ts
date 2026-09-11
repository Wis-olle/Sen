// Dữ liệu seed cho luồng demo (11-hop-dong-du-lieu-demo.md §5). Mọi id cố định để URL demo ổn định.
// Trích dẫn trong bài học chỉ ghi MÃ đoạn (D4); API mở rộng thành {code, page, doc, snippet} từ bảng Chunk.
import type { LessonDoc } from '../src/domain/grounding.ts';

export const PASSWORD_DEFAULT = 'demo1234';

export const STUDENTS = [
  {
    userId: 'us_an', id: 'st_an', email: 'an@sv.utt.edu.vn',
    fullName: 'Nguyễn Văn An', studentCode: 'UTT-CN-01', major: 'Công nghệ thông tin', cohort: 'K64',
    goal: 'Qua môn, hiểu để làm được bài tập lớn',
    preferredFormat: 'example', // ví dụ chạy thử + bài tập
    sessionMinutes: 30,
    freeSlots: { mon: ['20:00-22:00'], tue: ['20:00-22:00'], wed: ['20:00-22:00'], thu: ['20:00-22:00'], fri: ['20:00-22:00'], sat: ['14:00-17:00'] },
  },
  {
    userId: 'us_binh', id: 'st_binh', email: 'binh@sv.utt.edu.vn',
    fullName: 'Trần Thị Bình', studentCode: 'UTT-CN-02', major: 'Kỹ thuật phần mềm', cohort: 'K63',
    goal: 'Điểm A, nắm chắc con trỏ để học tiếp Cấu trúc dữ liệu',
    preferredFormat: 'reading', // đọc lý thuyết + phân tích bộ nhớ
    sessionMinutes: 60,
    freeSlots: { mon: ['06:00-08:00', '12:00-13:00'], tue: ['06:00-08:00', '12:00-13:00'], wed: ['06:00-08:00', '12:00-13:00'], thu: ['06:00-08:00', '12:00-13:00'], fri: ['06:00-08:00', '12:00-13:00'], sat: ['06:00-08:00'], sun: ['06:00-08:00'] },
  },
];

export const ADMIN = { id: 'us_admin', email: 'admin@utt.edu.vn' };

export const COURSES = [
  { id: 'c-lang', code: 'IT2101', name: 'Lập trình C', lecturer: 'ThS. Trần Văn Dũng', term: '20261', examDate: '2026-09-20', examRoom: 'A3-205' },
  { id: 'c-math', code: 'MA1102', name: 'Toán rời rạc', lecturer: 'TS. Phạm Thị Lan', term: '20261', examDate: '2026-09-25', examRoom: 'B1-102' },
  { id: 'c-net', code: 'IT2205', name: 'Mạng máy tính', lecturer: 'TS. Lê Minh Hòa', term: '20261', examDate: null, examRoom: null },
];
// An học 3 môn, Bình chỉ Lập trình C
export const ENROLLMENTS: Array<[string, string]> = [['st_an', 'c-lang'], ['st_an', 'c-math'], ['st_an', 'c-net'], ['st_binh', 'c-lang']];

export const MATERIAL_TITLE = 'Giáo trình Ngôn ngữ lập trình C';
export const MATERIALS = [
  { id: 'm_clang', studentId: 'st_an', courseId: 'c-lang', title: MATERIAL_TITLE, kind: 'pdf', path: 'data/utt_1630_giao_trinh_C.pdf', status: 'mapped' },
  { id: 'm_clang_b', studentId: 'st_binh', courseId: 'c-lang', title: MATERIAL_TITLE, kind: 'pdf', path: 'data/utt_1630_giao_trinh_C.pdf', status: 'mapped' },
  { id: 'm_math', studentId: 'st_an', courseId: 'c-math', title: 'Bài giảng Toán rời rạc — Chương 1–3', kind: 'pdf', path: 'data/toan-roi-rac.pdf', status: 'indexed' },
];

export const CONCEPTS = [
  { id: 'c1', name: 'Biến và kiểu dữ liệu', chapter: 'Chương 1 — Cơ bản về C', ord: 1, source: 'ai', description: 'Ô nhớ có tên và kiểu; kiểu quyết định dải giá trị và phép toán hợp lệ.' },
  { id: 'c2', name: 'Toán tử và biểu thức', chapter: 'Chương 1 — Cơ bản về C', ord: 2, source: 'ai', description: 'Toán tử số học, quan hệ, logic và thứ tự ưu tiên khi kết hợp.' },
  { id: 'c3', name: 'Câu lệnh điều kiện', chapter: 'Chương 2 — Cấu trúc điều khiển', ord: 3, source: 'human', description: 'if, else, switch — chọn nhánh thực thi theo giá trị biểu thức.' },
  { id: 'c4', name: 'Vòng lặp', chapter: 'Chương 2 — Cấu trúc điều khiển', ord: 4, source: 'ai', description: 'for, while, do…while — lặp một khối lệnh tới khi điều kiện sai.' },
  { id: 'c5', name: 'Hàm', chapter: 'Chương 3 — Hàm', ord: 5, source: 'ai', description: 'Đóng gói một đoạn việc thành khối gọi lại được, có tham số và giá trị trả về.' },
  { id: 'c6', name: 'Mảng', chapter: 'Chương 4 — Mảng và chuỗi', ord: 6, source: 'ai', description: 'Dãy phần tử cùng kiểu, truy cập bằng chỉ số từ 0 đến n−1.' },
  { id: 'c7', name: 'Chuỗi ký tự', chapter: 'Chương 4 — Mảng và chuỗi', ord: 7, source: 'ai', description: 'Mảng char kết thúc bằng ký tự \\0; mọi hàm chuỗi dựa vào ký tự đó.' },
  { id: 'c8', name: 'Con trỏ', chapter: 'Chương 5 — Con trỏ', ord: 8, source: 'ai', description: 'Biến chứa địa chỉ của biến khác; nền của mảng động và truyền tham chiếu.' },
];
// conceptId cần prereqId
export const EDGES: Array<[string, string]> = [['c2', 'c1'], ['c3', 'c2'], ['c4', 'c3'], ['c5', 'c4'], ['c6', 'c4'], ['c7', 'c6'], ['c8', 'c6'], ['c8', 'c5']];

// Đoạn nguồn D1–D8 (§5.6); D4 có hai câu cùng trang, giữ chung một mã
export const CHUNKS = [
  { code: 'D1', page: 9, ord: 1, concepts: ['c1'], title: 'Biến, kiểu dữ liệu cơ sở và phạm vi', text: 'Mỗi biến trong C phải được khai báo kiểu trước khi dùng; kiểu quyết định kích thước ô nhớ và tập phép toán hợp lệ.' },
  { code: 'D2', page: 13, ord: 2, concepts: ['c2'], title: 'Toán tử số học, quan hệ, logic và độ ưu tiên', text: 'Phép chia hai số nguyên cho kết quả nguyên, phần thập phân bị cắt bỏ chứ không làm tròn.' },
  { code: 'D3', page: 18, ord: 3, concepts: ['c3'], title: 'Toán tử so sánh và phép gán', text: 'Toán tử == so sánh hai giá trị; toán tử = là phép gán và trả về chính giá trị vừa gán. Mọi giá trị khác 0 được coi là đúng.' },
  { code: 'D4', page: 23, ord: 4, concepts: ['c4'], title: 'Ba thành phần của for', text: 'Câu lệnh for gồm ba thành phần cách nhau bởi dấu chấm phẩy: khởi tạo, điều kiện tiếp tục và bước nhảy. Điều kiện được kiểm tra trước mỗi lần lặp. Nếu điều kiện sai ngay từ lần kiểm tra đầu tiên, thân vòng lặp không được thực hiện lần nào.' },
  { code: 'D5', page: 25, ord: 5, concepts: ['c4'], title: 'while, do…while và điều kiện dừng', text: 'Vòng lặp không kết thúc khi biểu thức điều kiện không bao giờ nhận giá trị sai; nguyên nhân thường gặp là quên cập nhật biến đếm.' },
  { code: 'D6', page: 31, ord: 6, concepts: ['c5'], title: 'Hàm và truyền tham số theo giá trị', text: 'Tham số của hàm trong C được truyền theo giá trị: hàm nhận một bản sao, nên thay đổi bên trong hàm không ảnh hưởng biến ở nơi gọi.' },
  { code: 'D7', page: 38, ord: 7, concepts: ['c6'], title: 'Mảng một chiều và chỉ số', text: 'Mảng a có n phần tử được đánh chỉ số từ 0 đến n−1; truy cập a[n] là ngoài vùng nhớ hợp lệ.' },
  { code: 'D8', page: 46, ord: 8, concepts: ['c7', 'c8'], title: 'Chuỗi ký tự và char *', text: "Chuỗi trong C là mảng ký tự kết thúc bằng ký tự '\\0'; vì thế chuỗi \"abc\" chiếm 4 byte." },
];

// 10 câu chẩn đoán (§3.6, §5.7). answer = chỉ số phương án đúng. misconception: sai câu này thì ghi Memory.
export const DIAG_ITEMS = [
  { ord: 1, conceptId: 'c1', difficulty: 1, answer: 0, sources: ['D1'], question: 'Trong C, <code>sizeof(char)</code> luôn bằng bao nhiêu?', options: ['1 byte', '2 byte', '4 byte', 'Tùy trình biên dịch'], explanation: 'Chuẩn C định nghĩa sizeof(char) luôn là 1.' },
  { ord: 2, conceptId: 'c1', difficulty: 2, answer: 1, sources: ['D2'], question: 'Sau <code>int a = 7; float b = a / 2;</code> thì <code>b</code> nhận giá trị nào?', options: ['3.5', '3.0', '4.0', 'Lỗi biên dịch'], explanation: 'a / 2 là phép chia nguyên, ra 3 rồi mới ép sang float.' },
  { ord: 3, conceptId: 'c2', difficulty: 2, answer: 1, sources: ['D2'], question: '<code>int x = 5; x += 3 * 2;</code> — sau lệnh này <code>x</code> bằng bao nhiêu?', options: ['16', '11', '13', '10'], explanation: 'Nhân trước, cộng dồn sau: 5 + 6 = 11.' },
  { ord: 4, conceptId: 'c3', difficulty: 3, answer: 1, sources: ['D3'], question: '<code>if (x = 0) printf("A"); else printf("B");</code> in ra gì với mọi giá trị của <code>x</code>?', options: ['Luôn in A', 'Luôn in B', 'Tùy giá trị x', 'Lỗi biên dịch'], explanation: 'x = 0 là phép gán, biểu thức nhận giá trị 0 (sai) nên luôn vào else.', misconception: 'Viết if (x = 0) là phép gán, không phải so sánh if (x == 0)' },
  { ord: 5, conceptId: 'c4', difficulty: 1, answer: 2, sources: ['D4'], question: '<code>for (int i = 0; i &lt; 5; i++)</code> chạy thân vòng lặp bao nhiêu lần?', options: ['4 lần', '6 lần', '5 lần', 'Vô hạn'], explanation: 'i nhận 0,1,2,3,4 — năm lần; tới 5 thì điều kiện sai.' },
  { ord: 6, conceptId: 'c4', difficulty: 2, answer: 0, sources: ['D7'], question: 'Câu lệnh nào duyệt <b>đúng</b> toàn bộ mảng <code>int a[5]</code>?', options: ['<code>for (i = 0; i &lt; 5; i++)</code>', '<code>for (i = 0; i &lt;= 5; i++)</code>', '<code>for (i = 1; i &lt;= 5; i++)</code>', '<code>for (i = 1; i &lt; 5; i++)</code>'], explanation: 'Chỉ số hợp lệ 0..4 nên điều kiện phải là i < 5.', misconception: 'Dùng i <= n khi duyệt mảng n phần tử nên chạy thừa một vòng và đọc ra ngoài mảng' },
  { ord: 7, conceptId: 'c5', difficulty: 3, answer: 1, sources: ['D6'], question: 'Hàm <code>void f(int n) { n = 100; }</code>; gọi <code>f(a)</code> thì <code>a</code> ở hàm gọi có đổi không?', options: ['Có, vì n trỏ tới a', 'Không, C truyền tham số theo giá trị', 'Chỉ đổi nếu a là biến toàn cục', 'Lỗi biên dịch'], explanation: 'Hàm nhận bản sao của a; sửa n không chạm tới a.' },
  { ord: 8, conceptId: 'c6', difficulty: 1, answer: 0, sources: ['D7'], question: 'Khai báo <code>int a[5];</code> — dải chỉ số hợp lệ là gì?', options: ['0 đến 4', '1 đến 5', '0 đến 5', '1 đến 4'], explanation: 'Mảng n phần tử đánh chỉ số 0..n−1.' },
  { ord: 9, conceptId: 'c7', difficulty: 2, answer: 1, sources: ['D8'], question: 'Chuỗi hằng <code>"abc"</code> chiếm bao nhiêu byte trong bộ nhớ?', options: ['3', '4', '5', 'Tùy hệ điều hành'], explanation: 'Ba ký tự cộng ký tự kết thúc \\0 là 4 byte.' },
  { ord: 10, conceptId: 'c8', difficulty: 3, answer: 1, sources: ['D8'], question: '<code>int x = 3; int *p = &amp;x; *p = 7;</code> — sau đó <code>x</code> bằng bao nhiêu?', options: ['3', '7', 'Địa chỉ của x', 'Không xác định'], explanation: '*p là chính ô nhớ của x; gán *p = 7 là gán x = 7.' },
];
export const DEMO_ANSWERS: Record<string, number[]> = {
  st_an: [0, 0, 1, 0, 1, 1, 0, 0, 0, 0], // 3/10
  st_binh: [0, 1, 1, 1, 2, 0, 1, 0, 0, 0], // 8/10
};

// Memory của An có sẵn từ trước bài chẩn đoán (đánh giá sau bài Câu lệnh điều kiện 08/09)
export const MEMORIES_AN = [
  { id: 'mem3', studentId: 'st_an', conceptId: 'c4', kind: 'effective_explanation', text: 'Hiểu nhanh khi xem bảng lần lặp liệt kê i, điều kiện và giá trị sau mỗi vòng', evidence: 'đánh giá "dễ hiểu" sau bài Câu lệnh điều kiện ({{date}})' },
];

// ---------- Bài học "Vòng lặp" của An: ngắn, bảng lần lặp, ví dụ chạy thử, phần lỗi từng mắc dày (§3.11) ----------
export const LESSON_AN: LessonDoc = {
  chapterLabel: 'Chương 2 — Cấu trúc điều khiển',
  estimatedMinutes: 30,
  sections: [
    { key: 'goal', title: 'Sau bài này bạn làm được gì', blocks: [
      { type: 'list', items: [
        'Đọc một vòng <code>for</code> và nói đúng nó chạy bao nhiêu lần, không phải đoán.',
        'Chỉ ra ba thành phần của <code>for</code> và chuyện gì xảy ra khi thiếu một trong ba.',
        'Duyệt hết mảng <code>int a[5]</code> mà không chạm <code>a[5]</code>.',
      ] },
    ] },
    { key: 'prereq', title: 'Ôn nhanh tiên quyết: Câu lệnh điều kiện', tag: 'bạn đang {{c3}}/100', blocks: [
      { type: 'para', html: 'Vòng lặp sống bằng một biểu thức điều kiện, y hệt <code>if</code>. Nhớ hai điều: <code>==</code> là so sánh, <code>=</code> là gán; và trong C mọi giá trị khác 0 đều được coi là đúng.', cite: 'D3' },
      { type: 'para', html: 'Bạn từng đánh giá bài Câu lệnh điều kiện là “dễ hiểu”, nên bài hôm nay không giảng lại từ đầu, chỉ dùng lại. <a href="#" data-soon>Ôn lại 5 phút</a>' },
    ] },
    { key: 'explain', title: 'Giải thích', blocks: [
      { type: 'para', html: 'Một vòng <code>for</code> có <b>ba thành phần</b> cách nhau bởi dấu chấm phẩy: khởi tạo chạy đúng một lần, điều kiện được kiểm tra <b>trước</b> mỗi vòng, bước nhảy chạy <b>sau</b> mỗi vòng.', cite: 'D4' },
      { type: 'chain', nodes: ['i = 0', 'i < 5', 'i++'], keyIndex: 0, note: 'khởi tạo một lần → kiểm tra trước mỗi vòng → bước nhảy sau mỗi vòng' },
      { type: 'para', html: 'Hai chỗ hỏng thường gặp: điều kiện <b>sai ngay từ đầu</b> thì thân vòng lặp không chạy lần nào; <b>thiếu bước nhảy</b> thì điều kiện không bao giờ sai và vòng lặp chạy mãi.', cite: 'D5' },
    ] },
    { key: 'example', title: 'Ví dụ trong ngành của bạn', tag: 'CNTT · bài tập lớn', blocks: [
      { type: 'para', html: 'Tính điểm trung bình của 5 sinh viên — đúng kiểu vòng lặp bạn sẽ viết trong bài tập lớn. Bảng dưới là giá trị sau <b>mỗi</b> lần lặp:' },
      { type: 'table', headers: ['i', 'i < 5', 'a[i]', 'tong sau vòng'], rows: [['0', 'đúng', '8.0', '8.0'], ['1', 'đúng', '6.5', '14.5'], ['2', 'đúng', '7.0', '21.5'], ['3', 'đúng', '9.0', '30.5'], ['4', 'đúng', '5.5', '36.0'], ['5', 'SAI → dừng', '—', '36.0']], highlightCells: [[5, 1], [5, 2]], highlightLabel: 'dừng', caption: 'Vòng thứ 6 không chạy: điều kiện <code>5 &lt; 5</code> sai. Nếu viết <code>i &lt;= 5</code> thì chương trình đọc <code>a[5]</code> — ô không thuộc mảng.', cite: 'D7' },
      { type: 'para', html: 'Kết: chia <code>tong / 5</code> được 7.2. Cả vòng lặp chỉ đúng khi điều kiện dừng khớp với số phần tử thật của mảng.', cite: 'D4' },
    ] },
    { key: 'mistakes', title: 'Lỗi bạn từng mắc', blocks: [
      { type: 'para', html: 'Hệ thống nhớ những chỗ bạn hay nhầm — bài này đã viết lại phần giải thích và câu kiểm tra để nhắm đúng vào đó.' },
      // Các khối memory được API chèn từ bảng Memory đang hiệu lực của sinh viên (không seed cứng ở đây)
    ] },
    { key: 'outside', title: 'Mở rộng', blocks: [
      { type: 'callout', label: 'Ngoài tài liệu môn học', html: 'Bật cảnh báo trình biên dịch (<code>gcc -Wall</code>) thì cả hai lỗi trên đều bị nhắc ngay lúc dịch, trước khi chương trình chạy sai. Ý này không có trong giáo trình, chỉ để bạn biết công cụ đỡ được phần nào.' },
    ] },
  ],
  quiz: [
    { question: 'Đoạn <code>int a[5], tong = 0, i; for (i = 0; i &lt;= 5; i++) tong += a[i];</code> có vấn đề gì?', options: ['Không có lỗi, đoạn chạy đúng', '<code>i &lt;= 5</code> làm vòng lặp chạy 6 lần và đọc <code>a[5]</code> nằm ngoài mảng', 'Phải khai báo <code>i</code> bên trong <code>for</code>', 'Phải dùng <code>while</code> thay cho <code>for</code>'], answer: 1, difficulty: 2, cite: 'D7', explanationOk: 'Đúng. Mảng 5 phần tử có chỉ số 0 đến 4; <code>i &lt;= 5</code> chạm tới <code>a[5]</code>.', explanationWrong: 'Đây đúng chỗ bạn từng nhầm: mảng n phần tử chỉ có chỉ số 0 đến n−1, nên điều kiện phải là <code>i &lt; 5</code>.', misconception: 'Dùng i <= n khi duyệt mảng n phần tử nên chạy thừa một vòng và đọc ra ngoài mảng' },
    { question: '<code>for (int i = 0; i &lt; 3; ) printf("%d", i);</code> in ra gì?', options: ['012', 'Không in gì', 'In số 0 mãi không dừng', 'Lỗi biên dịch'], answer: 2, difficulty: 2, cite: 'D5', explanationOk: 'Đúng. Thiếu bước nhảy nên <code>i</code> không đổi, điều kiện luôn đúng.', explanationWrong: 'Ba thành phần của <code>for</code> được phép để trống, nhưng thiếu bước nhảy thì <code>i</code> đứng yên ở 0, điều kiện <code>i &lt; 3</code> luôn đúng — vòng lặp vô hạn.' },
    { question: '<code>int i = 5; while (i &lt; 3) { printf("x"); i++; }</code> in ra bao nhiêu chữ x?', options: ['0', '1', '3', 'Vô hạn'], answer: 0, difficulty: 1, cite: 'D4', explanationOk: 'Đúng. Điều kiện sai ngay lần kiểm tra đầu nên thân vòng lặp không chạy lần nào.', explanationWrong: '<code>while</code> kiểm tra điều kiện <b>trước</b> mỗi vòng; <code>5 &lt; 3</code> sai ngay nên không in gì. (<code>do…while</code> mới chạy ít nhất một lần.)' },
  ],
};

// ---------- Bài học "Vòng lặp" của Bình: dài hơn, đọc lý thuyết, phân tích bộ nhớ và điều kiện biên, không ôn tiên quyết, không có lỗi từng mắc ----------
export const LESSON_BINH: LessonDoc = {
  chapterLabel: 'Chương 2 — Cấu trúc điều khiển',
  estimatedMinutes: 60,
  sections: [
    { key: 'goal', title: 'Sau bài này bạn làm được gì', blocks: [
      { type: 'list', items: [
        'Phân biệt ba dạng lặp <code>for</code>, <code>while</code>, <code>do…while</code> theo <b>thời điểm kiểm tra điều kiện</b>, và chọn đúng dạng cho từng bài.',
        'Chứng minh một vòng lặp dừng bằng cách chỉ ra <b>biến đếm</b> và <b>bất biến vòng lặp</b> của nó.',
        'Đọc một vòng lặp duyệt mảng và nói ngay nó có đọc ra ngoài vùng nhớ hợp lệ hay không.',
        'Nối vòng lặp với con trỏ: hiểu vì sao <code>for (p = a; p &lt; a + n; p++)</code> duyệt mảng đúng — nền cho Cấu trúc dữ liệu.',
      ] },
    ] },
    { key: 'explain', title: 'Giải thích', blocks: [
      { type: 'para', html: 'Cả ba dạng lặp trong C đều là một <b>biểu thức điều kiện</b> được đánh giá lặp lại; khác nhau duy nhất ở <b>thời điểm</b> đánh giá. <code>for</code> và <code>while</code> kiểm tra trước mỗi vòng, nên thân có thể không chạy lần nào; <code>do…while</code> kiểm tra sau, nên thân chạy ít nhất một lần. Chọn dạng lặp trước hết là chọn thời điểm này.', cite: 'D4' },
      { type: 'para', html: 'Về bộ nhớ, biến điều khiển <code>i</code> là một ô <code>int</code> bình thường trên ngăn xếp; <code>for (int i = 0; …)</code> giới hạn phạm vi của nó trong vòng lặp. Sau vòng lặp, giá trị cuối của <code>i</code> là giá trị <b>làm điều kiện sai lần đầu</b>, không phải phần tử cuối được xử lý. Đọc sai điểm này là nguồn của phần lớn lỗi lệch một đơn vị.', cite: 'D4' },
      { type: 'chain', nodes: ['khởi tạo', 'điều kiện?', 'thân', 'bước nhảy'], keyIndex: 1, note: 'điều kiện là nút quyết định; for và while đi vào nút này trước, do…while đi vào sau thân' },
      { type: 'para', html: 'Một vòng lặp <b>dừng</b> khi tồn tại một đại lượng tiến đơn điệu về phía làm điều kiện sai — thường là biến đếm. Thiếu bước cập nhật, hoặc cập nhật sai chiều (<code>i--</code> khi điều kiện là <code>i &lt; n</code>), thì đại lượng đó không tiến và vòng lặp vô hạn. Khi đọc mã người khác, việc đầu tiên là tìm đại lượng này.', cite: 'D5' },
      { type: 'para', html: 'Bất biến vòng lặp là mệnh đề đúng trước và sau mỗi vòng. Với <code>for (i = 0; i &lt; n; i++) tong += a[i];</code> bất biến là “<code>tong</code> bằng tổng của <code>a[0..i-1]</code>”. Khi vòng lặp dừng, <code>i == n</code> nên <code>tong</code> là tổng cả mảng. Đây là cách chứng minh chương trình đúng thay vì chạy thử vài trường hợp.' },
    ] },
    { key: 'example', title: 'Ví dụ trong ngành của bạn', tag: 'Kỹ thuật phần mềm · cấu trúc dữ liệu', blocks: [
      { type: 'para', html: 'Duyệt mảng bằng con trỏ, cách viết bạn sẽ gặp trong mọi cài đặt danh sách và chuỗi: <code>for (int *p = a; p &lt; a + n; p++) tong += *p;</code>. Điều kiện <code>p &lt; a + n</code> đúng vì <code>a + n</code> là địa chỉ <b>ngay sau</b> phần tử cuối — C cho phép tính địa chỉ đó nhưng không cho đọc.', cite: 'D7' },
      { type: 'table', headers: ['vòng', 'p', 'p < a + n', '*p', 'tong'], rows: [['1', 'a + 0', 'đúng', 'a[0]', 'a[0]'], ['2', 'a + 1', 'đúng', 'a[1]', 'a[0]+a[1]'], ['…', '…', 'đúng', '…', '…'], ['n', 'a + (n−1)', 'đúng', 'a[n−1]', 'tổng cả mảng'], ['n+1', 'a + n', 'SAI → dừng', 'không đọc', 'không đổi']], highlightCells: [[4, 2], [4, 3]], highlightLabel: 'biên', caption: 'Ô <code>a + n</code> là biên: được so sánh, không được giải tham chiếu. Viết <code>p &lt;= a + n</code> là đọc ngoài mảng — cùng bản chất với <code>i &lt;= n</code> ở chỉ số.', cite: 'D7' },
      { type: 'para', html: 'Với chuỗi, điều kiện dừng không phải độ dài mà là ký tự kết thúc: <code>while (*s) s++;</code> chạy tới khi gặp <code>\'\\0\'</code>. Vì thế một chuỗi thiếu ký tự kết thúc làm vòng lặp đọc tiếp sang vùng nhớ khác — lỗi kinh điển mà bạn sẽ phải phòng khi cài đặt chuỗi động.', cite: 'D8' },
      { type: 'para', html: 'Bài tập nhỏ để tự kiểm: viết hàm đảo ngược mảng tại chỗ bằng hai con trỏ <code>lo</code>, <code>hi</code> tiến về nhau với điều kiện <code>lo &lt; hi</code>. Viết ra bất biến của vòng lặp trước khi viết thân.' },
    ] },
    { key: 'outside', title: 'Mở rộng', blocks: [
      { type: 'callout', label: 'Ngoài tài liệu môn học', html: 'Trình biên dịch tối ưu có thể hoán đổi hoặc gộp các vòng lặp khi chứng minh được bất biến không đổi; đó là lý do viết vòng lặp “sạch” (một biến đếm, một điều kiện) không chỉ dễ đọc mà còn chạy nhanh hơn. Chủ đề này thuộc môn Trình biên dịch, không nằm trong giáo trình.' },
    ] },
  ],
  quiz: [
    { question: 'Sau <code>int i; for (i = 0; i &lt; n; i++) {}</code> với <code>n = 4</code>, giá trị của <code>i</code> là gì?', options: ['3', '4', '5', 'Không xác định'], answer: 1, difficulty: 3, cite: 'D4', explanationOk: 'Đúng. i là giá trị đầu tiên làm điều kiện sai, tức bằng n.', explanationWrong: 'Vòng lặp dừng khi điều kiện <code>i &lt; n</code> sai lần đầu, lúc đó <code>i == n == 4</code>; phần tử cuối được xử lý là <code>a[3]</code> nhưng <code>i</code> đã là 4.' },
    { question: 'Đoạn <code>for (int *p = a; p &lt;= a + n; p++) tong += *p;</code> sai ở đâu?', options: ['Không được so sánh hai con trỏ', 'Đọc <code>*(a + n)</code> là ngoài mảng; điều kiện phải là <code>p &lt; a + n</code>', 'Phải khai báo <code>p</code> ngoài vòng lặp', 'Không sai'], answer: 1, difficulty: 3, cite: 'D7', explanationOk: 'Đúng. a + n chỉ được dùng để so sánh, không được giải tham chiếu.', explanationWrong: 'Cùng bản chất với <code>i &lt;= n</code>: mảng n phần tử hợp lệ tới <code>a + (n−1)</code>; <code>a + n</code> là biên, so sánh được nhưng đọc là ngoài vùng nhớ hợp lệ.' },
    { question: '<code>char s[3] = {\'a\', \'b\', \'c\'}; while (*s) s++;</code> — nhận xét nào đúng?', options: ['Dừng sau 3 vòng', 'Lỗi biên dịch vì không tăng được mảng', 'Có thể chạy quá 3 vòng vì thiếu ký tự kết thúc', 'Không chạy vòng nào'], answer: 2, difficulty: 3, cite: 'D8', explanationOk: 'Đúng về bản chất: không có \\0 nên điều kiện dừng phụ thuộc vùng nhớ kế tiếp (chưa kể s là mảng, cần con trỏ riêng để tăng).', explanationWrong: 'Chuỗi hợp lệ phải kết thúc bằng <code>\\0</code>; mảng 3 ký tự không có chỗ cho nó, nên vòng lặp không có điều kiện dừng đáng tin.' },
  ],
};

// ---------- Bài học "Câu lệnh điều kiện" của An: bài ĐẦU sau chẩn đoán (planner xếp khái niệm Yếu đứng trước trong tô-pô) ----------
export const LESSON_AN_C3: LessonDoc = {
  chapterLabel: 'Chương 2 — Cấu trúc điều khiển',
  estimatedMinutes: 30,
  sections: [
    { key: 'goal', title: 'Sau bài này bạn làm được gì', blocks: [
      { type: 'list', items: [
        'Đọc một câu <code>if</code> và nói đúng nhánh nào chạy với một giá trị cho trước, kể cả khi điều kiện là số chứ không phải phép so sánh.',
        'Phân biệt <code>=</code> và <code>==</code> trong điều kiện, và nhận ra lỗi này khi đọc mã người khác.',
        'Chọn giữa <code>if…else if</code> và <code>switch</code> cho một bài phân loại đơn giản.',
      ] },
    ] },
    { key: 'prereq', title: 'Ôn nhanh tiên quyết: Toán tử và biểu thức', tag: 'bạn đang {{c2}}/100', blocks: [
      { type: 'para', html: 'Điều kiện của <code>if</code> là một <b>biểu thức</b>, và C không có kiểu logic riêng: biểu thức cho ra số, số khác 0 là đúng, số 0 là sai. Nhớ luôn là phép chia hai số nguyên cho kết quả nguyên, nên <code>7 / 2</code> trong điều kiện là 3, không phải 3.5.', cite: 'D2' },
    ] },
    { key: 'explain', title: 'Giải thích', blocks: [
      { type: 'para', html: '<code>if (điều kiện) A; else B;</code> tính điều kiện <b>một lần</b>, rồi chạy đúng một trong hai nhánh. Điều kiện là bất kỳ biểu thức nào: <code>x &gt; 5</code>, <code>n % 2 == 0</code>, hay chỉ <code>x</code>. Khi viết <code>if (x)</code> bạn đang hỏi “x có khác 0 không”.', cite: 'D3' },
      { type: 'chain', nodes: ['tính điều kiện', 'khác 0?', 'nhánh if', 'nhánh else'], keyIndex: 1, note: 'điều kiện được tính một lần; khác 0 đi nhánh if, bằng 0 đi nhánh else' },
      { type: 'para', html: 'Cái bẫy lớn nhất: <code>=</code> là <b>phép gán</b> và trả về chính giá trị vừa gán. <code>if (x = 0)</code> gán 0 vào <code>x</code> rồi kiểm tra số 0, nên <b>luôn</b> đi nhánh else, bất kể <code>x</code> trước đó là gì. So sánh phải viết <code>==</code>. Trình biên dịch không coi đây là lỗi vì cú pháp hoàn toàn hợp lệ.', cite: 'D3' },
      { type: 'para', html: 'Khi nhiều hơn hai nhánh, nối <code>else if</code> theo thứ tự từ trên xuống: nhánh đầu tiên có điều kiện đúng sẽ chạy, các nhánh sau bị bỏ qua. Vì thế thứ tự viết điều kiện quyết định kết quả khi các khoảng giá trị chồng nhau.' },
    ] },
    { key: 'example', title: 'Ví dụ trong ngành của bạn', tag: 'CNTT · bài tập lớn', blocks: [
      { type: 'para', html: 'Xếp loại điểm học phần — đoạn mã bạn sẽ viết trong bài tập lớn quản lý sinh viên. Bảng dưới chạy thử với ba giá trị để thấy thứ tự điều kiện quan trọng thế nào:' },
      { type: 'table', headers: ['diem', 'diem >= 8.5', 'diem >= 7.0', 'diem >= 5.5', 'kết quả'], rows: [['9.0', 'đúng → A', '—', '—', 'A'], ['7.0', 'sai', 'đúng → B', '—', 'B'], ['5.0', 'sai', 'sai', 'sai', 'F (nhánh else)']], highlightCells: [[1, 2]], highlightLabel: 'biên', caption: 'Với <code>diem = 7.0</code>, điều kiện <code>diem &gt;= 7.0</code> đúng ngay tại biên. Viết <code>&gt;</code> thay <code>&gt;=</code> là 7.0 rơi xuống loại C — lỗi lệch một đơn vị kinh điển của <code>if</code>.', cite: 'D3' },
      { type: 'para', html: 'Nếu <code>diem</code> là <code>int</code> và bạn tính trung bình bằng <code>tong / 3</code>, phần thập phân bị cắt trước khi vào <code>if</code>: 8.4 thành 8, và “8.5 trở lên” không bao giờ đạt được. Kiểu dữ liệu quyết định điều kiện có ý nghĩa hay không.', cite: 'D1' },
    ] },
    { key: 'mistakes', title: 'Lỗi bạn từng mắc', blocks: [
      { type: 'para', html: 'Hệ thống nhớ những chỗ bạn hay nhầm — phần giải thích và câu kiểm tra bên dưới nhắm đúng vào đó.' },
    ] },
    { key: 'outside', title: 'Mở rộng', blocks: [
      { type: 'callout', label: 'Ngoài tài liệu môn học', html: 'Nhiều lập trình viên viết điều kiện ngược, <code>if (0 == x)</code>, để nếu gõ nhầm thành <code>0 = x</code> thì trình biên dịch báo lỗi ngay (không gán được vào hằng số). Thói quen này không có trong giáo trình, nhưng đỡ được đúng lỗi bạn từng mắc.' },
    ] },
  ],
  quiz: [
    { question: '<code>int x = 5; if (x = 0) printf("A"); else printf("B");</code> in ra gì?', options: ['In ra “A”, vì x ban đầu là 5', 'In ra “B”, vì x = 0 là phép gán và cho giá trị 0', 'Lỗi biên dịch', 'Không in gì'], answer: 1, difficulty: 3, cite: 'D3', explanationOk: 'Đúng. Phép gán trả về 0, số 0 là sai nên đi nhánh else.', explanationWrong: 'Đây đúng chỗ bạn từng nhầm: <code>x = 0</code> là gán, biểu thức nhận giá trị 0 (sai), nên luôn in B. So sánh phải là <code>x == 0</code>.', misconception: 'Viết if (x = 0) là phép gán, không phải so sánh if (x == 0)' },
    { question: '<code>int n = 7; if (n / 2 == 3.5) printf("bằng"); else printf("khác");</code> in ra gì?', options: ['bằng', 'khác, vì n / 2 là phép chia nguyên cho 3', 'Lỗi biên dịch vì so sánh int với double', 'Không xác định'], answer: 1, difficulty: 2, cite: 'D2', explanationOk: 'Đúng. Hai số nguyên chia nhau cho 3, so với 3.5 là khác.', explanationWrong: 'Phép chia hai số nguyên cắt bỏ phần thập phân: <code>7 / 2</code> là 3, không phải 3.5, nên điều kiện sai.' },
    { question: 'Với <code>if (diem &gt;= 8.5) loai = \'A\'; else if (diem &gt;= 7.0) loai = \'B\'; else loai = \'C\';</code>, <code>diem = 8.5</code> cho kết quả nào?', options: ['A', 'B', 'C', 'Cả A và B'], answer: 0, difficulty: 1, cite: 'D3', explanationOk: 'Đúng. Điều kiện đầu đúng ngay tại biên, các nhánh sau bị bỏ qua.', explanationWrong: '<code>&gt;=</code> đúng tại 8.5 nên vào nhánh đầu và dừng; <code>else if</code> chỉ được xét khi nhánh trước sai.' },
  ],
};

export const LESSONS = [
  { id: 'les_an_c3', studentId: 'st_an', conceptId: 'c3', doc: LESSON_AN_C3 },
  { id: 'les_an_c4', studentId: 'st_an', conceptId: 'c4', doc: LESSON_AN },
  { id: 'les_binh_c4', studentId: 'st_binh', conceptId: 'c4', doc: LESSON_BINH },
];
