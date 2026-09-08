const fs = require('fs');
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell,
  WidthType, ShadingType, BorderStyle, ImageRun, PageBreak, Footer, PageNumber, TableOfContents,
  LevelFormat, VerticalAlign,
} = require('docx');

const FONT = 'Times New Roman';
const BODY = 26; // 13pt
const SMALL = 22; // 11pt

let numInstance = 0;

function runs(text, base = {}) {
  const out = [];
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let last = 0; let m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(new TextRun({ text: text.slice(last, m.index), font: FONT, size: BODY, ...base }));
    const tok = m[0];
    if (tok.startsWith('**')) out.push(new TextRun({ text: tok.slice(2, -2), bold: true, font: FONT, size: BODY, ...base }));
    else out.push(new TextRun({ text: tok.slice(1, -1), italics: true, font: FONT, size: BODY, ...base }));
    last = m.index + tok.length;
  }
  if (last < text.length) out.push(new TextRun({ text: text.slice(last), font: FONT, size: BODY, ...base }));
  return out;
}
const P = (text, opt = {}) => new Paragraph({
  children: runs(text, opt.run || {}),
  alignment: opt.align || AlignmentType.JUSTIFIED,
  spacing: { after: opt.after ?? 120, line: 300, before: opt.before ?? 0 },
  indent: opt.indent,
});
const B = (text, level = 0) => new Paragraph({
  children: runs(text), numbering: { reference: 'bullets', level },
  alignment: AlignmentType.JUSTIFIED, spacing: { after: 60, line: 300 },
});
function NL(items) {
  numInstance += 1; const inst = numInstance;
  return items.map(t => new Paragraph({
    children: runs(t), numbering: { reference: 'numbers', level: 0, instance: inst },
    alignment: AlignmentType.JUSTIFIED, spacing: { after: 60, line: 300 },
  }));
}
const H1 = t => new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: t, font: FONT })], spacing: { before: 360, after: 200 }, keepNext: true });
const H2 = t => new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: t, font: FONT })], spacing: { before: 240, after: 120 }, keepNext: true });
const H3 = t => new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun({ text: t, font: FONT })], spacing: { before: 200, after: 100 }, keepNext: true });
const BR = () => new Paragraph({ children: [new PageBreak()] });
const SP = () => new Paragraph({ children: [new TextRun('')], spacing: { after: 0 } });

const border = { style: BorderStyle.SINGLE, size: 4, color: '808080' };
function T(headers, rows, widths, opt = {}) {
  const total = widths.reduce((a, b) => a + b, 0);
  const cell = (text, w, head) => new TableCell({
    width: { size: w, type: WidthType.DXA },
    shading: head ? { fill: 'D9E2F3', type: ShadingType.CLEAR, color: 'auto' } : undefined,
    verticalAlign: VerticalAlign.TOP,
    margins: { top: 60, bottom: 60, left: 90, right: 90 },
    children: String(text).split('\n').map(line => new Paragraph({
      children: runs(line, { size: opt.size || SMALL, bold: head ? true : undefined }),
      alignment: AlignmentType.LEFT, spacing: { after: 40, line: 260 },
    })),
  });
  return new Table({
    width: { size: total, type: WidthType.DXA }, columnWidths: widths,
    borders: { top: border, bottom: border, left: border, right: border, insideHorizontal: border, insideVertical: border },
    rows: [
      new TableRow({ tableHeader: true, children: headers.map((h, i) => cell(h, widths[i], true)) }),
      ...rows.map(r => new TableRow({ cantSplit: true, children: r.map((c, i) => cell(c, widths[i], false)) })),
    ],
  });
}
const TCAP = t => new Paragraph({ children: [new TextRun({ text: t, italics: true, font: FONT, size: SMALL })], alignment: AlignmentType.LEFT, spacing: { before: 120, after: 80 }, keepNext: true });
const AFTER_T = () => new Paragraph({ children: [], spacing: { after: 120 } });

function FIG(file, caption, widthPx) {
  const buf = fs.readFileSync(file);
  const meta = { d1_architecture: [3200, 1867], d2_loop: [3200, 1813], d3_usecase: [3200, 2667], d4_erd: [3200, 1893] };
  const [w, h] = meta[file.replace('.png', '')];
  const height = Math.round(widthPx * h / w);
  return [
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 120, after: 60 }, keepNext: true, children: [new ImageRun({ type: 'png', data: buf, transformation: { width: widthPx, height } })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [new TextRun({ text: caption, italics: true, font: FONT, size: SMALL })] }),
  ];
}
const CODE = lines => lines.map(l => new Paragraph({
  children: [new TextRun({ text: l || ' ', font: 'Consolas', size: 19 })],
  spacing: { after: 0, line: 240 }, indent: { left: 360 },
  shading: { fill: 'F3F4F6', type: ShadingType.CLEAR, color: 'auto' },
}));

// =====================================================================
// CONTENT
// =====================================================================
const cover = [
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 0 }, children: [new TextRun({ text: 'TRƯỜNG ĐẠI HỌC CÔNG NGHỆ GIAO THÔNG VẬN TẢI', bold: true, font: FONT, size: 28 })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0 }, children: [new TextRun({ text: '[Khoa / Bộ môn]', font: FONT, size: 26 })] }),
  new Paragraph({ spacing: { after: 1800 }, children: [] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [new TextRun({ text: 'ĐỀ XUẤT DỰ ÁN (PROPOSAL)', bold: true, font: FONT, size: 30 })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 120 }, children: [new TextRun({ text: 'HỆ THỐNG HỖ TRỢ HỌC TẬP', bold: true, font: FONT, size: 40 })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 120 }, children: [new TextRun({ text: 'CÁ NHÂN HÓA BẰNG AI', bold: true, font: FONT, size: 40 })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 400 }, children: [new TextRun({ text: 'cho sinh viên Trường Đại học Công nghệ Giao thông Vận tải', font: FONT, size: 28 })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 1800 }, children: [new TextRun({ text: 'Môn học: Hệ thống thông tin', italics: true, font: FONT, size: 28 })] }),
  new Paragraph({ alignment: AlignmentType.LEFT, indent: { left: 3600 }, spacing: { after: 80 }, children: [new TextRun({ text: 'Sinh viên thực hiện: [Họ và tên]', font: FONT, size: 26 })] }),
  new Paragraph({ alignment: AlignmentType.LEFT, indent: { left: 3600 }, spacing: { after: 80 }, children: [new TextRun({ text: 'Mã sinh viên: [MSSV]', font: FONT, size: 26 })] }),
  new Paragraph({ alignment: AlignmentType.LEFT, indent: { left: 3600 }, spacing: { after: 80 }, children: [new TextRun({ text: 'Lớp: [Lớp]', font: FONT, size: 26 })] }),
  new Paragraph({ alignment: AlignmentType.LEFT, indent: { left: 3600 }, spacing: { after: 1600 }, children: [new TextRun({ text: 'Giảng viên hướng dẫn: [Họ và tên giảng viên]', font: FONT, size: 26 })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0 }, children: [new TextRun({ text: 'Hà Nội, tháng 9 năm 2026', italics: true, font: FONT, size: 26 })] }),
  BR(),
];

const toc = [
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [new TextRun({ text: 'MỤC LỤC', bold: true, font: FONT, size: 28 })] }),
  new TableOfContents('Mục lục', { hyperlink: true, headingStyleRange: '1-2' }),
  BR(),
];

const body = [];
const add = (...xs) => xs.forEach(x => Array.isArray(x) ? body.push(...x) : body.push(x));

// ---------- Preface ----------
add(H1('Đôi lời về cách đọc tài liệu này'));
add(P('Tài liệu này viết theo cách tôi hay giải thích một thiết kế cho người ngồi cạnh: định nghĩa từ trước khi dùng, nói rõ mỗi lựa chọn tùy vào gì, và nói thẳng chỗ nào tôi chỉ đang đoán. Vì thế nó dài hơn một bản proposal thông thường, và có nhiều đoạn văn hơn gạch đầu dòng. Ai chỉ cần danh sách chức năng thì Bảng 6.1 và Phụ lục A là đủ; phần còn lại dành cho người muốn biết vì sao.'));
add(P('Có một điều tôi muốn nói ngay để không ai hiểu nhầm về sau. Tôi không có bằng chứng rằng hệ thống này giúp sinh viên học tốt hơn. Tôi có một luận điểm, một cách xây để kiểm luận điểm đó rẻ nhất, và một cách đo sau ba tuần thử. Với một đồ án, tôi nghĩ nói thế trung thực hơn bất kỳ con số nào tôi có thể hứa.'));

// ---------- 1 ----------
add(H1('1. Tóm tắt đề xuất'));
add(P('Ý tưởng của hệ thống này gói được trong một câu: bài học nên được soạn cho một người, không phải cho một lớp. Sinh viên UTT hiện có cổng đào tạo cho lịch và điểm, thư viện số cho bài giảng, và Zalo cho mọi thứ còn lại. Không có gì nối ba thứ đó với việc một sinh viên cụ thể đang yếu ở chỗ nào. Hệ thống tôi đề xuất nối chúng lại, rồi dùng mô hình ngôn ngữ lớn để soạn bài học, câu hỏi và câu trả lời theo hồ sơ của từng người.'));
add(P('Từ "cá nhân hóa" đã bị dùng rộng đến mức gần hết nghĩa, nên tôi phải nói rõ tôi dùng nó thế nào. Một chatbot đọc slide rồi trả lời câu hỏi là cá nhân hóa theo tài liệu: nó biết môn, không biết người. Thứ tôi muốn xây là cá nhân hóa theo người học. Giáo trình quyết định nội dung nào là đúng; hồ sơ người học quyết định bài học có hình dạng thế nào; và mỗi lần làm quiz hay đặt câu hỏi, bài kế tiếp đổi theo. Hai sinh viên cùng chương nhận hai bài khác nhau, và đó là điều tôi muốn giảng viên kiểm tra được bằng mắt ở Bảng 7.3.'));
add(P('Phần còn lại đi từ bối cảnh, định nghĩa, usecase, chức năng, đến cơ chế cá nhân hóa ở mục 7, kiến trúc ở mục 8, và cách kiểm chứng ở mục 15. Phạm vi chia hai giai đoạn. Giai đoạn một là đồ án, dùng những gì trường đã có mà không cần trường thay đổi gì; giai đoạn hai là khi trường muốn hợp tác. Tôi cố ý đẩy nhiều thứ hấp dẫn sang giai đoạn hai, vì thứ cần chứng minh trước là luận điểm ở câu đầu tiên, không phải bề rộng tính năng.'));

// ---------- 2 ----------
add(H1('2. Bối cảnh và vấn đề'));
add(H2('2.1. Sinh viên UTT thật sự có gì trong tay'));
add(P('Mọi lựa chọn thiết kế về sau đều tựa vào những gì trường đã có, nên tôi bắt đầu bằng việc mô tả chúng. Tôi ghi ngày khảo sát, vì các hệ thống này có thể đổi và tài liệu này sẽ phải sửa theo.'));
add(TCAP('Bảng 2.1. Các hệ thống hiện có, khảo sát ngày 02/09/2026'));
add(T(['Hệ thống', 'Địa chỉ', 'Cung cấp gì', 'Hạn chế'], [
  ['Cổng thông tin đào tạo', 'daotao.utt.edu.vn', 'Danh sách môn theo học kỳ, thời khóa biểu, lịch thi, điểm các môn đã thi', 'Không có bài giảng, không có bài tập. Chỉ xem sau khi đăng nhập.'],
  ['Thư viện số (DSpace)', 'thuvien.utt.edu.vn:8080', 'Khoảng 1.900 tài liệu có file: giáo trình, bài giảng, luận văn, ebook. Danh mục mở qua giao thức OAI-PMH', 'File PDF ở chế độ "giới hạn truy cập", phải đăng nhập hoặc gửi yêu cầu. Không có API REST.'],
  ['Kênh của giảng viên', 'Zalo, email, Google Drive', 'Slide, đề cương, thông báo bài tập và deadline', 'Không có cấu trúc, mỗi giảng viên một cách, dễ thất lạc.'],
  ['Hệ quản lý học tập (LMS)', 'Không có', 'Không có', 'Không có nguồn tự động cho bài tập và deadline.'],
], [2000, 2000, 2800, 2271]));
add(AFTER_T());
add(P('Hai chi tiết trong bảng quyết định khá nhiều thứ về sau. Thư viện số mở giao thức OAI-PMH, nghĩa là danh mục bài giảng lấy được tự động mà không cần xin ai. Nhưng file PDF cần đăng nhập, nghĩa là nội dung chỉ lấy được khi chính sinh viên đang mở nó. Kiến trúc ở mục 8 là hệ quả trực tiếp của hai chi tiết này, chứ không phải của một sở thích công nghệ nào.'));
add(H2('2.2. Vấn đề, nhìn từ một sinh viên cụ thể'));
add(P('Tôi thấy mô tả vấn đề bằng một người dễ hơn bằng một danh sách. Hãy lấy một sinh viên năm hai đang học Cơ sở dữ liệu, thi sau ba tuần. Bài giảng của môn nằm trên thư viện số, chung cho mấy trăm người. Slide bổ sung nằm trong một nhóm Zalo. Lịch thi nằm ở cổng đào tạo. Và điểm Toán rời rạc khá thấp của em ấy ở kỳ trước, thứ có lẽ giải thích vì sao phần phụ thuộc hàm khó vào, nằm ở một trang khác của cùng cổng đó.'));
add(P('Không hệ thống nào trong số đó biết em ấy yếu chỗ nào, vì không hệ thống nào được thiết kế để biết. Em ấy sẽ phát hiện ra khi thi, lúc không còn thời gian sửa. Nếu em ấy hỏi một chatbot chung, câu trả lời sẽ đúng và vô hồn: nó không nhớ em đã hỏi gì tuần trước, và không biết còn ba tuần.'));
add(P('Vấn đề vì thế không phải là thiếu tài liệu. Vấn đề là tài liệu không có hình dạng của người học. Đây là điều tôi muốn hệ thống giải quyết, và cũng là thước đo để biết nó có giải quyết được không.'));
add(H2('2.3. Vì sao bài toán này đáng thử vào lúc này'));
add(P('Ba điều kiện cùng lúc mới làm bài toán này đáng thử. Mô hình ngôn ngữ lớn soạn được nội dung theo từng người với giá tính bằng xu, điều mà soạn tay không bao giờ làm nổi cho vài trăm sinh viên. Dữ liệu học vụ của trường đã ở dạng máy đọc được, dù chưa ai đọc. Và extension trình duyệt cho phép đọc nó ngay trên máy sinh viên sau khi họ tự đăng nhập, nên không cần trường cấp quyền gì.'));
add(P('Tôi cũng nên nói điều kiện ngược. Nếu trường có LMS đầy đủ thì phần tích hợp sẽ khác hẳn, và có lẽ đơn giản hơn. Nếu giá mô hình ngôn ngữ tăng gấp mười thì luận điểm về chi phí sụp. Tôi viết dựa trên tình hình tháng 9 năm 2026, và sẽ sửa tại chỗ nếu tình hình đổi, thay vì giả vờ là mình đã đoán trước.'));

// ---------- 3 ----------
add(H1('3. Định nghĩa các khái niệm dùng trong tài liệu'));
add(P('Tôi có thói quen hơi phiền là định nghĩa từ trước khi tranh luận (giảng viên nào đã quen thì có thể lướt qua mục này). Lý do là phần lớn tranh cãi về "AI trong giáo dục" mà tôi đọc được đều là hai bên dùng cùng một từ với hai nghĩa, và cách rẻ nhất để tránh là nói rõ mình dùng nghĩa nào. Eric Evans gọi việc này là xây dựng ngôn ngữ chung của miền nghiệp vụ (Evans, 2003); tôi thấy nó hữu ích cho tài liệu không kém gì cho mã.'));
add(TCAP('Bảng 3.1. Thuật ngữ và nghĩa tôi dùng trong tài liệu này'));
add(T(['Thuật ngữ', 'Nghĩa dùng trong tài liệu này'], [
  ['Cá nhân hóa theo ngữ cảnh\n(contextual retrieval)', 'Trả lời hoặc soạn nội dung dựa trên đúng tài liệu của môn mà sinh viên đang học. Cá nhân hóa ở mức "đúng tài liệu", chưa phải "đúng người".'],
  ['Cá nhân hóa theo người học\n(learner-adapted generation)', 'Soạn nội dung mà cấu trúc, ví dụ, độ khó, độ dài và trình tự thay đổi theo hồ sơ của từng sinh viên. Hai sinh viên cùng môn, cùng chương nhận nội dung khác nhau. Đây là trọng tâm của hệ thống.'],
  ['Hồ sơ người học\n(learner model)', 'Trạng thái được lưu và cập nhật liên tục về một sinh viên: mức thành thạo từng khái niệm, lỗi và hiểu sai từng mắc, cách giải thích từng có hiệu quả, nhịp học, mục tiêu, lịch thi.'],
  ['Bản đồ kiến thức\n(concept map)', 'Danh sách khái niệm của một môn, nhóm theo chương, có quan hệ tiên quyết, được AI rút ra từ tài liệu môn học. Là khung để gắn tiến độ, quiz và bài học.'],
  ['Mức thành thạo\n(mastery)', 'Số từ 0 đến 100 gắn với một cặp (sinh viên, khái niệm), ước lượng khả năng trả lời đúng câu hỏi về khái niệm đó tại thời điểm hiện tại. Giảm dần nếu không ôn.'],
  ['Bài học\n(lesson)', 'Một đơn vị nội dung được sinh cho một sinh viên, về một hoặc vài khái niệm, tại một thời điểm. Không phải file có sẵn; được soạn từ tài liệu và hồ sơ, rồi lưu lại.'],
  ['Tín hiệu học tập\n(learning signal)', 'Sự kiện quan sát được cho biết sinh viên đang học gì và hiểu đến đâu: kết quả quiz, câu hỏi đặt cho trợ giảng, thời gian đọc, lỗi lặp lại, đánh giá bài học.'],
  ['RAG\n(Retrieval-Augmented Generation)', 'Kỹ thuật cho mô hình ngôn ngữ trả lời dựa trên các đoạn tài liệu được tìm ra trước bằng tìm kiếm ngữ nghĩa, thay vì chỉ dựa vào kiến thức sẵn có của mô hình (Lewis và cộng sự, 2020).'],
  ['Ôn tập ngắt quãng\n(spaced repetition)', 'Lên lịch ôn từng khái niệm với khoảng cách tăng dần, dựa trên bằng chứng rằng ôn giãn cách nhớ lâu hơn ôn dồn (Cepeda và cộng sự, 2006).'],
  ['OAI-PMH', 'Giao thức chuẩn để thu thập siêu dữ liệu (tên, tác giả, từ khóa, đường dẫn) từ kho tài liệu số như DSpace. Thư viện số UTT đang mở giao thức này.'],
  ['Extension trình duyệt', 'Phần mềm nhỏ cài vào Chrome hoặc Edge, chỉ hoạt động trên danh sách trang được phép, có thể đọc nội dung trang, đo thời gian đọc và hiển thị thanh bên.'],
  ['Modular monolith', 'Một ứng dụng triển khai thành một khối nhưng chia thành các module có ranh giới rõ, để sau này tách thành dịch vụ riêng nếu thật sự cần (Fowler, 2015).'],
], [2800, 6271]));
add(AFTER_T());
add(P('Cặp định nghĩa quan trọng nhất là hai nghĩa của cá nhân hóa. Cả hai đều cần, vì bài học sai môn thì vô dụng dù hợp người đến đâu. Nhưng nghĩa thứ hai mới là thứ làm hệ thống này khác một cuốn giáo trình biết nói (mà một cuốn giáo trình biết nói thì vẫn là giáo trình). Mục 7 dành riêng cho nghĩa thứ hai.'));

// ---------- 4 ----------
add(H1('4. Mục tiêu, phạm vi và những gì tôi cố ý để ngoài'));
add(H2('4.1. Mục tiêu'));
add(P('Tôi muốn hệ thống làm được bốn việc, xếp theo thứ tự quan trọng giảm dần. Nếu phải cắt, cắt từ dưới lên.'));
add(NL([
  'Soạn bài học, câu hỏi ôn tập và câu trả lời của trợ giảng theo hồ sơ từng người, trên tài liệu của đúng môn.',
  'Cho mỗi sinh viên một kế hoạch tuần bám lịch thi thật và mức thành thạo hiện tại của chính họ.',
  'Giảm công nhập liệu bằng cách lấy dữ liệu có sẵn từ cổng đào tạo và thư viện số.',
  'Để sinh viên kiểm soát được dữ liệu của mình: biết hệ thống thu gì, tắt được, xóa được.',
]));
add(H2('4.2. Phạm vi hai giai đoạn'));
add(P('Giai đoạn một là những gì tôi tin một đội nhỏ làm được trong một học kỳ mà không cần trường thay đổi gì. Nó có hai tác nhân, sinh viên và quản trị viên; ba nền tảng, gồm web đầy đủ chức năng, mobile cho ôn tập và thông báo, extension cho tích hợp với hệ thống trường và hỗ trợ ngay trên trang đang đọc; và mười một nhóm chức năng ở mục 6. Dữ liệu lấy từ cổng đào tạo qua extension, từ thư viện số qua OAI-PMH và extension, và từ tài liệu sinh viên tự tải lên.'));
add(P('Giai đoạn hai bắt đầu khi trường muốn hợp tác, và tôi không định đoán khi nào. Lúc đó thêm tác nhân giảng viên để đăng bài giảng, đề cương và xem thống kê lớp; thêm truy cập trực tiếp vào thư viện số và cổng đào tạo qua API trường cấp; thêm một tác tử trên máy tính để thu ngữ cảnh học tập ngoài trình duyệt; và có thể thêm kho học liệu chia sẻ theo mã môn giữa các khóa. Mỗi thứ trong đó đều có chỗ cắm sẵn trong kiến trúc, nhưng chưa thứ nào được xây.'));
add(H2('4.3. Ngoài phạm vi, và vì sao'));
add(P('Tôi cố ý để bốn thứ ngoài phạm vi, và muốn nói lý do vì "ngoài phạm vi" hay bị đọc thành "chưa nghĩ tới". Hệ thống không thay giảng viên và không chấm điểm chính thức, vì việc đó đòi hỏi trách nhiệm mà một mô hình ngôn ngữ không gánh được. Nó không theo dõi gì ngoài trình duyệt ở giai đoạn một, vì chi phí về riêng tư cao hơn giá trị tín hiệu thu được, ít nhất là cho tới khi tôi biết tín hiệu trong trình duyệt đã đủ chưa.'));
add(P('Nó không chia sẻ tài liệu giữa sinh viên, vì việc đó kéo theo duyệt nội dung và bản quyền, hai thứ tôi chưa cần để kiểm luận điểm chính. Và nó không hứa "học nhanh hơn bao nhiêu lần", vì mức cải thiện là điều cần đo chứ không phải điều hứa trước. Nguyên tắc chung tôi theo là YAGNI: không xây trước một tính năng chỉ vì có thể sẽ cần, nhưng vẫn giữ mã dễ sửa để thêm khi thật cần (Fowler, 2015).'));

// ---------- 5 ----------
add(H1('5. Tác nhân và usecase'));
add(H2('5.1. Tác nhân'));
add(P('Sơ đồ usecase ở đây khá kinh điển, và tôi không định làm nó thú vị hơn mức cần. Có hai điều đáng chú ý. Giảng viên vẽ nét đứt vì thuộc giai đoạn hai. Hai hệ thống của trường không phải tác nhân, vì chúng không chủ động làm gì cả; chúng được đọc.'));
add(TCAP('Bảng 5.1. Tác nhân của hệ thống'));
add(T(['Tác nhân', 'Giai đoạn', 'Mô tả', 'Điều họ cần'], [
  ['Sinh viên', '1', 'Người dùng chính. Học, ôn tập, hỏi đáp và theo dõi tiến độ qua web, mobile và extension.', 'Học đúng chỗ còn yếu, kịp lịch thi, không phải tự nhập liệu.'],
  ['Quản trị viên', '1', 'Vận hành hệ thống. Quản lý tài khoản, cấu hình danh sách trang được phép, mô hình AI, hạn mức chi phí, xem nhật ký.', 'Hệ thống chạy ổn, chi phí AI trong ngưỡng, dữ liệu an toàn.'],
  ['Giảng viên', '2', 'Đăng bài giảng, đề cương; xem thống kê lớp về những khái niệm cả lớp đang yếu.', 'Biết lớp đang vướng ở đâu để điều chỉnh giảng dạy.'],
  ['Cổng đào tạo, thư viện số', '1', 'Hệ thống ngoài. Không tương tác trực tiếp; được đọc qua extension và OAI-PMH.', '—'],
], [1800, 1000, 3600, 2671]));
add(AFTER_T());
add(H2('5.2. Sơ đồ usecase'));
add(FIG('d3_usecase.png', 'Hình 5.1. Sơ đồ usecase tổng quát. Nét đứt là phần thuộc giai đoạn hai.', 540));
add(H2('5.3. Danh sách usecase'));
add(P('Bảng dưới là danh sách để tra cứu. Usecase UC05 là usecase tôi coi là trung tâm; nếu nó không tạo ra khác biệt giữa hai sinh viên thì các usecase còn lại chỉ là một ứng dụng lịch có gắn chatbot.'));
add(TCAP('Bảng 5.2. Usecase chính'));
add(T(['Mã', 'Tên usecase', 'Tác nhân', 'Mô tả ngắn', 'Ưu tiên'], [
  ['UC01', 'Đăng nhập, cập nhật hồ sơ học tập', 'Sinh viên', 'Tạo tài khoản, khai mục tiêu học kỳ, khung giờ rảnh, định dạng ưa thích.', 'Cốt lõi'],
  ['UC02', 'Đồng bộ dữ liệu từ cổng đào tạo', 'Sinh viên (qua extension)', 'Sinh viên mở cổng đào tạo; extension đọc môn học, thời khóa biểu, lịch thi, điểm và gửi về hệ thống.', 'Cốt lõi'],
  ['UC03', 'Nhập tài liệu', 'Sinh viên', 'Tải lên PDF, Word, PowerPoint, ảnh; dán link; nhập bài giảng đang mở trên thư viện số.', 'Cốt lõi'],
  ['UC04', 'Làm bài chẩn đoán đầu vào', 'Sinh viên', 'Trả lời 10 đến 15 câu do AI sinh từ bản đồ kiến thức để xác lập mức thành thạo ban đầu.', 'Cốt lõi'],
  ['UC05', 'Nhận bài học cá nhân hóa', 'Sinh viên', 'Hệ thống soạn bài học cho khái niệm tiếp theo trong lộ trình, theo hồ sơ người học.', 'Cốt lõi'],
  ['UC06', 'Hỏi đáp với trợ giảng AI', 'Sinh viên', 'Chat trên tài liệu môn học; trợ giảng nhớ lỗi cũ và ngữ cảnh trang đang đọc.', 'Cốt lõi'],
  ['UC07', 'Làm quiz, ôn flashcard', 'Sinh viên', 'Quiz sinh từ tài liệu và điểm yếu; flashcard theo lịch ôn ngắt quãng.', 'Cốt lõi'],
  ['UC08', 'Xem lộ trình và tiến độ', 'Sinh viên', 'Kế hoạch tuần, bản đồ thành thạo, thời gian học, cảnh báo tụt tiến độ.', 'Cốt lõi'],
  ['UC09', 'Nhận nhắc nhở, deadline', 'Sinh viên', 'Nhắc ôn, nhắc deadline và lịch thi qua web, mobile, trình duyệt.', 'Cốt lõi'],
  ['UC10', 'Quản lý dữ liệu cá nhân', 'Sinh viên', 'Xem dữ liệu đã thu, tạm dừng theo dõi, xóa dữ liệu.', 'Cốt lõi'],
  ['UC11', 'Quản lý người dùng', 'Quản trị viên', 'Tạo, khóa, mở tài khoản; phân vai trò.', 'Cốt lõi'],
  ['UC12', 'Cấu hình hệ thống và AI', 'Quản trị viên', 'Danh sách trang được phép, mô hình AI, hạn mức chi phí, tham số thuật toán.', 'Cốt lõi'],
  ['UC13', 'Xem nhật ký, thống kê', 'Quản trị viên', 'Nhật ký hoạt động, chi phí AI, lỗi, mức sử dụng.', 'Cốt lõi'],
  ['UC14', 'Đăng bài giảng, đề cương', 'Giảng viên', 'Giai đoạn hai.', 'Giai đoạn 2'],
  ['UC15', 'Xem thống kê lớp học', 'Giảng viên', 'Giai đoạn hai.', 'Giai đoạn 2'],
], [800, 2300, 1500, 3471, 1000]));
add(AFTER_T());

// ---------- 6 ----------
add(H1('6. Yêu cầu chức năng'));
add(P('Mười một nhóm chức năng dưới đây là kết quả của quá trình làm rõ yêu cầu, không phải danh sách ước. Nhóm ghi "Cốt lõi" phải có trong giai đoạn một. Nhóm ghi "Mở rộng" làm khi còn thời gian, và tôi đã kiểm rằng bỏ chúng đi thì phần còn lại vẫn trọn vẹn. Với mỗi nhóm, tôi viết nó làm gì, vì sao có, và cái bẫy tôi thấy khi làm nó; ai cần bảng thì Phụ lục A có phân bổ theo nền tảng.'));
add(TCAP('Bảng 6.1. Tổng hợp nhóm chức năng'));
add(T(['Mã', 'Nhóm chức năng', 'Nền tảng chính', 'Ưu tiên'], [
  ['F1', 'Tài khoản và hồ sơ học tập', 'Web, Mobile', 'Cốt lõi'],
  ['F2', 'Đồng bộ dữ liệu từ hệ thống trường', 'Extension, Backend', 'Cốt lõi'],
  ['F3', 'Kho học liệu cá nhân', 'Web, Extension', 'Cốt lõi'],
  ['F4', 'Bản đồ kiến thức và mô hình thành thạo', 'Backend', 'Cốt lõi'],
  ['F5', 'Lộ trình học cá nhân hóa', 'Web, Mobile', 'Cốt lõi'],
  ['F6', 'Bài học cá nhân hóa và trợ giảng AI', 'Web, Extension, Mobile', 'Cốt lõi'],
  ['F7', 'Luyện tập và ôn tập', 'Web, Mobile', 'Cốt lõi (quiz sau đọc: Mở rộng)'],
  ['F8', 'Theo dõi tiến độ và phân tích', 'Web, Extension', 'Cốt lõi (chế độ tập trung: Mở rộng)'],
  ['F9', 'Thông báo và nhắc nhở', 'Mobile, Web, Extension', 'Cốt lõi'],
  ['F10', 'Quyền riêng tư và dữ liệu cá nhân', 'Tất cả', 'Cốt lõi'],
  ['F11', 'Quản trị hệ thống', 'Web', 'Cốt lõi'],
], [800, 4000, 2600, 1671]));
add(AFTER_T());

add(H2('6.1. F1. Tài khoản và hồ sơ học tập'));
add(P('Hồ sơ học tập là nơi mọi cá nhân hóa bắt đầu, nên tôi muốn nó nhỏ và đúng hơn là đầy đủ và bị bỏ trống. Sinh viên đăng ký bằng email hoặc tài khoản Google, rồi khai ba thứ: mục tiêu học kỳ (qua môn, hay đạt điểm A), khung giờ rảnh trong tuần, và định dạng ưa thích như đọc, ví dụ thực tế, hay bài tập. Ngành, khóa, học kỳ lấy từ cổng đào tạo qua F2, không hỏi lại.'));
add(P('Có một câu hỏi tôi cố ý không đặt: "bạn học theo kiểu nhìn, nghe hay vận động". Cơ sở của nó không được nghiên cứu ủng hộ (Pashler và cộng sự, 2008), và tôi không muốn xây cá nhân hóa trên một thứ không đo được. Kiến thức nền, tốc độ, mục tiêu và định dạng ưa thích thì đo được, nên tôi dùng chúng.'));

add(H2('6.2. F2. Đồng bộ dữ liệu từ hệ thống trường'));
add(P('Phần này tồn tại để sinh viên không phải nhập tay thời khóa biểu, và tôi nghi nó là lý do nhiều người sẽ dùng hệ thống hơn là bất kỳ tính năng AI nào (một nhận xét hơi buồn cho phần AI, nhưng có lẽ đúng). Khi sinh viên mở cổng đào tạo và đã đăng nhập, extension đọc bảng đang hiển thị: môn, giảng viên, tiết học, lịch thi, điểm đã thi. Nó không giữ mật khẩu, và không làm gì khi sinh viên chưa mở trang.'));
add(P('Với thư viện số, backend thu danh mục qua OAI-PMH mỗi đêm. Khi cổng đào tạo báo có môn Cơ sở dữ liệu, hệ thống gợi ý ngay bài giảng khớp tên hoặc từ khóa. Mỗi lần đồng bộ được ghi phiên bản, và sinh viên xem được hệ thống đã đọc gì để sửa tay nếu trang trường hiển thị sai.'));
add(P('Bộ đọc trang là chỗ dễ hỏng nhất của cả hệ thống, vì nó phụ thuộc vào HTML mà tôi không kiểm soát. Tôi tách nó thành module riêng có kiểm thử với HTML mẫu lưu sẵn, để khi trường đổi giao diện thì có thứ báo hỏng trước khi sinh viên báo. Các cổng đào tạo kiểu này thường đổi chậm, dù tôi không dám hứa thay cho phòng đào tạo.'));

add(H2('6.3. F3. Kho học liệu cá nhân'));
add(P('Sinh viên tải PDF, Word, PowerPoint, ảnh chụp trang sách, hoặc dán link YouTube và bài viết; trên thư viện số thì bấm "Nhập vào hệ thống" khi đang mở bài giảng. Mỗi tài liệu gắn với một môn và đi qua bốn trạng thái: đã tải, đã trích xuất, đã lập chỉ mục, đã có bản đồ kiến thức. Tôi hiển thị trạng thái này cho sinh viên vì xử lý mất vài phút, và một thanh "đang xử lý" không lời giải thích là cách nhanh nhất làm người ta bỏ đi.'));
add(P('Về kỹ thuật, văn bản được trích xuất (kèm OCR với ảnh và PDF scan), cắt thành đoạn 300 đến 500 từ có chồng lấn, tạo vector nhúng và lưu vào chỉ mục tìm kiếm ngữ nghĩa. Con số 300 đến 500 là mặc định hợp lý lấy từ kinh nghiệm chung của cộng đồng RAG, không phải kết quả đo trên tài liệu UTT; nó nằm trong cấu hình để đổi khi có số liệu thật. Tài liệu là riêng tư của người tải, kể cả khi lấy từ thư viện số.'));

add(H2('6.4. F4. Bản đồ kiến thức và mô hình thành thạo'));
add(P('Đây là phần tôi coi là nền theo nghĩa đen: mọi thứ khác gắn lên nó. Sau khi tài liệu được lập chỉ mục, mô hình ngôn ngữ đọc toàn bộ và rút ra danh sách khái niệm theo chương, quan hệ tiên quyết, và các đoạn liên quan đến từng khái niệm. Sinh viên làm một bài chẩn đoán 10 đến 15 câu trải đều các chương để gán mức thành thạo ban đầu. Ai bỏ qua thì mọi khái niệm bắt đầu ở mức thấp và được điều chỉnh dần qua sử dụng.'));
add(P('Mức thành thạo là một số từ 0 đến 100 cho mỗi cặp sinh viên và khái niệm. Nó tăng khi trả lời đúng, giảm khi sai, và giảm dần theo thời gian không ôn. Điểm cũ từ cổng đào tạo được dùng làm dấu hiệu nền: điểm Toán rời rạc thấp làm hệ thống nghi phần phụ thuộc hàm sẽ khó, và ưu tiên ôn lại. Đó là nghi ngờ, không phải kết luận; bài chẩn đoán mới là thứ xác nhận.'));
add(P('Có một quy tắc tôi giữ nghiêm: bản đồ do máy rút ra phải sửa được, và sửa của người luôn thắng. Mô hình ngôn ngữ đọc slide khá tốt, nhưng nó không biết giảng viên đã gộp chương ba và chương bốn thành một buổi.'));

add(H2('6.5. F5. Lộ trình học cá nhân hóa'));
add(P('Kế hoạch tuần là chỗ ba nguồn dữ liệu gặp nhau: lịch thi từ cổng đào tạo, giờ rảnh từ hồ sơ, mức thành thạo từ F4. Mỗi mục là một bộ ba khái niệm, ngày, thời lượng. Ưu tiên tính từ ba yếu tố với chiều đẩy rõ: ngày thi càng gần càng lên trước, mức thành thạo càng thấp càng lên trước, và khái niệm là tiên quyết của nhiều khái niệm khác thì lên trước cả hai thứ kia. Kế hoạch không xếp đè lên giờ lên lớp.'));
add(P('Deadline bài tập không có nguồn tự động, nên tôi cho sinh viên dán tin nhắn Zalo, email hoặc ảnh thông báo để mô hình rút ra tên bài, môn và hạn nộp. Luôn có bước xác nhận với văn bản gốc hiển thị cạnh kết quả, vì mô hình đọc sai ngày là chuyện tôi mặc định sẽ xảy ra, chứ không phải có thể xảy ra.'));
add(P('Khi sinh viên trễ tiến độ, kế hoạch được tính lại: dồn về khái niệm quan trọng nhất, bỏ bớt khái niệm ít ảnh hưởng, và nói rõ đã bỏ gì. Mỗi lần tính lại ghi một phiên bản mới kèm lý do. Tôi coi trọng phần "kèm lý do" hơn phần "tính lại", vì một kế hoạch tự đổi mà không nói vì sao sẽ bị bỏ qua sau lần thứ hai.'));

add(H2('6.6. F6. Bài học cá nhân hóa và trợ giảng AI'));
add(P('Đây là nhóm chức năng mang luận điểm chính, và tôi để cơ chế ở mục 7 để khỏi lặp. Ở đây chỉ nói sinh viên thấy gì. Với mỗi mục trong kế hoạch, hệ thống soạn một bài học riêng: mục tiêu, giải thích ở mức phù hợp, ví dụ theo ngành sinh viên, một phần "lỗi bạn từng mắc" nếu hồ sơ có, và ba đến năm câu kiểm tra ngay. Bài học sinh tại thời điểm học và lưu lại để xem lại.'));
add(P('Trợ giảng hỏi đáp chạy trên đúng tài liệu môn và trả lời có trích dẫn đoạn nguồn. Nó có trí nhớ dài hạn: nhớ cặp khái niệm sinh viên hay nhầm, nhớ kiểu giải thích từng hiệu quả, và nhắc lại đúng lỗi cũ khi liên quan. Từ thanh bên của extension, câu hỏi đi kèm nội dung trang đang đọc. Bôi đen một đoạn thì có ba lệnh: giải thích, tóm tắt, tạo flashcard; với YouTube, hỏi theo phụ đề và mốc thời gian.'));
add(P('Sau mỗi bài, sinh viên chấm bốn mức: dễ hiểu, quá dễ, quá khó, sai. Bốn nút này rẻ hơn mọi khảo sát và là tín hiệu quan trọng nhất để chỉnh prompt. Quy tắc cứng duy nhất của nhóm này: mọi khẳng định chính phải bám vào đoạn được trích dẫn, và câu hỏi ngoài tài liệu được trả lời với nhãn "Ngoài tài liệu môn học" đứng trước.'));

add(H2('6.7. F7. Luyện tập và ôn tập'));
add(P('Quiz và flashcard là nơi tín hiệu học tập được tạo ra đều đặn, nên tôi coi chúng là bộ cảm biến của hệ thống hơn là tính năng phụ. Quiz sinh từ tài liệu và ưu tiên khái niệm yếu; có chấm, giải thích và trích dẫn; kết quả đi thẳng vào mức thành thạo. Flashcard tạo từ bài học hoặc đoạn bôi đen, lịch ôn tính riêng cho từng thẻ theo thuật toán ôn tập ngắt quãng kiểu SM-2 hoặc FSRS.'));
add(P('Có nhiều dạng câu hỏi hơn trắc nghiệm: đúng sai, điền khuyết, tự luận ngắn do mô hình chấm kèm giải thích. Quiz ba câu tự hiện sau khi đọc một trang đủ lâu là mở rộng. Tôi để nó sau vì chưa chắc sinh viên thích bị hỏi khi đang đọc, và tôi muốn biết điều đó từ họ chứ không tự đoán.'));

add(H2('6.8. F8. Theo dõi tiến độ và phân tích'));
add(P('Dashboard trả lời một câu hỏi: tôi đang ở đâu so với kế hoạch và so với ngày thi. Nó hiển thị bản đồ thành thạo theo môn và chương, thời gian học theo ngày, tiến độ so với kế hoạch, và số khái niệm còn yếu trước mỗi kỳ thi. Extension ghi thời gian đọc trên các trang được phép và gán vào khái niệm gần nhất theo nội dung trang.'));
add(P('Cảnh báo chỉ có hai loại, vì cảnh báo nhiều thì người ta tắt hết: tụt tiến độ ba ngày liên tiếp, và còn dưới bảy ngày đến thi mà hơn một phần ba khái niệm còn yếu. Chế độ tập trung, nhắc nhẹ khi chuyển sang trang giải trí trong phiên học, là mở rộng.'));

add(H2('6.9. F9. Thông báo và nhắc nhở'));
add(P('Nhắc nhở gồm ba loại: thẻ đến hạn ôn, mục kế hoạch hôm nay, deadline và lịch thi. Kênh chính là thông báo đẩy trên điện thoại, vì đó là nơi sinh viên thật sự nhìn; web và extension là kênh phụ. Sinh viên chọn khung giờ nhận và tắt từng loại. Tôi coi việc tắt được là điều kiện để được bật.'));

add(H2('6.10. F10. Quyền riêng tư và dữ liệu cá nhân'));
add(P('Tôi muốn việc thu tín hiệu học tập là điều sinh viên hiểu và đồng ý, không phải điều họ phát hiện ra sau. Khi cài extension, màn hình xin phép nói rõ đọc gì, trên trang nào, để làm gì, và có nút tạm dừng mọi lúc. Extension chỉ chạy trên danh sách trang được phép do quản trị cấu hình và sinh viên bổ sung; không chụp màn hình; không đọc trang ngân hàng, tin nhắn, ẩn danh.'));
add(P('Hệ thống chỉ lưu tín hiệu suy ra, gồm trang, thời lượng, khái niệm, và không lưu nội dung trang trừ khi sinh viên chủ động nhập tài liệu. Sinh viên xem được toàn bộ dữ liệu về mình, tải về, và xóa tài khoản kèm toàn bộ dữ liệu trong 24 giờ. Tài liệu từ thư viện số dùng trong phạm vi tài khoản sinh viên, đúng như thư viện yêu cầu về bản quyền.'));

add(H2('6.11. F11. Quản trị hệ thống'));
add(P('Phần quản trị nhỏ, nhưng có một thứ tôi muốn nhấn: bộ kiểm thử prompt. Quản trị viên quản lý người dùng, cấu hình danh sách trang, chọn mô hình cho từng loại tác vụ, đặt hạn mức chi phí theo ngày và theo người, xem nhật ký lỗi và chi phí, và xem lại các bài học sinh viên đã đánh dấu "sai". Mỗi lần ai đó sửa prompt, họ chạy lại 15 đến 20 hồ sơ mẫu để so kết quả. Sửa prompt mà không kiểm thử thì giống sửa mã mà không chạy test, chỉ khác là lỗi khó thấy hơn.'));

// ---------- 7 ----------
add(H1('7. Cơ chế cá nhân hóa bằng AI'));
add(H2('7.1. Nguyên tắc'));
add(P('Có một cách làm dễ và một cách làm đúng. Cách dễ là cho mô hình ngôn ngữ đọc giáo trình rồi trả lời câu hỏi; kết quả là một cuốn giáo trình biết nói, vẫn giống nhau với mọi sinh viên. Cách đúng là tách hai nguồn quyết định: **tài liệu môn học quyết định nội dung nào là đúng; hồ sơ người học quyết định bài học có hình dạng thế nào.** Mô hình ngôn ngữ đứng giữa hai nguồn đó và soạn ra thứ chỉ có nghĩa với một sinh viên tại một thời điểm.'));
add(P('Từ nguyên tắc này suy ra ba hệ quả thiết kế. Thứ nhất, bài học không phải file có sẵn; nó được sinh khi sinh viên đến lượt học khái niệm đó, và lần sau sẽ khác vì hồ sơ đã khác. Thứ hai, hồ sơ người học là thực thể trung tâm của mô hình dữ liệu, không phải một bảng phụ. Thứ ba, mọi tương tác của sinh viên đều phải trả về một tín hiệu cập nhật hồ sơ; nếu không, vòng lặp đứt và cá nhân hóa chỉ dừng ở lần đầu.'));
add(P('Tôi phải nói rõ hai giới hạn. Mô hình ngôn ngữ không "hiểu" sinh viên; nó nhận một bản mô tả có cấu trúc và soạn theo bản mô tả đó, nên chất lượng cá nhân hóa phụ thuộc vào hồ sơ nhiều hơn vào mô hình. Và tôi không có giai thoại từ đội nào đã làm học thích ứng ở quy mô thật; phần này suy từ nguyên tắc và từ tài liệu về theo dõi tri thức, nên hãy đọc nó với mức tin tương ứng.'));
add(H2('7.2. Hồ sơ người học gồm những gì'));
add(P('Tôi liệt kê hồ sơ theo ba cột, thành phần, nguồn, và dùng để quyết định gì, vì một thành phần không có nguồn thu thì là mơ ước, và một thành phần không quyết định gì thì là rác.'));
add(TCAP('Bảng 7.1. Thành phần của hồ sơ người học'));
add(T(['Thành phần', 'Nguồn', 'Dùng để quyết định'], [
  ['Mức thành thạo từng khái niệm (0 đến 100), lần ôn cuối, độ ổn định', 'Bài chẩn đoán, quiz, câu hỏi trong chat, thời gian trôi qua', 'Học khái niệm nào tiếp, giải thích ở mức nào, có cần nhắc lại tiên quyết không'],
  ['Lỗi và hiểu sai đã ghi nhận (ví dụ "nhầm phụ thuộc bắc cầu với phụ thuộc hàm đầy đủ")', 'Câu trả lời sai lặp lại, lỗi trợ giảng phát hiện trong chat', 'Đưa phần "lỗi bạn từng mắc" vào bài học, chọn ví dụ đối chiếu'],
  ['Cách giải thích từng có hiệu quả (ví dụ "hiểu nhanh hơn khi có bảng dữ liệu thật")', 'Đánh giá bài học, kết quả quiz sau mỗi kiểu giải thích', 'Chọn kiểu giải thích và ví dụ cho bài tiếp theo'],
  ['Nền tảng: ngành, môn đã học, điểm cũ', 'Cổng đào tạo, hồ sơ', 'Chọn ví dụ theo ngành; ưu tiên ôn khái niệm nền khi điểm môn tiên quyết thấp'],
  ['Mục tiêu và ràng buộc: mục tiêu học kỳ, lịch thi, giờ rảnh, deadline', 'Hồ sơ, cổng đào tạo, deadline nhập', 'Độ dài bài học, mức chi tiết, thứ tự ưu tiên trong tuần'],
  ['Nhịp học: thời lượng một phiên, giờ hay học, tần suất', 'Tín hiệu từ web, mobile, extension', 'Chia bài học thành phần vừa một phiên; chọn giờ nhắc'],
], [3200, 2700, 3171]));
add(AFTER_T());
add(H2('7.3. Vòng lặp cá nhân hóa'));
add(FIG('d2_loop.png', 'Hình 7.1. Vòng lặp cá nhân hóa: hai nguồn quyết định, một bộ soạn, và tín hiệu quay về cập nhật hồ sơ.', 600));
add(H2('7.4. Quy trình sinh một bài học'));
add(P('Tôi liệt kê đủ tám bước vì muốn giảng viên thấy mô hình ngôn ngữ chỉ chiếm một bước, bước năm. Bảy bước còn lại là mã thường, có kiểm thử thường, và đó là chỗ phần lớn công sức nằm. Ai nghĩ hệ thống AI là "gọi API rồi hiển thị" thường ngạc nhiên ở điểm này.'));
add(TCAP('Bảng 7.2. Các bước sinh bài học cho một sinh viên'));
add(T(['Bước', 'Việc làm', 'Đầu vào', 'Kết quả'], [
  ['1. Chọn khái niệm', 'Lấy mục tiếp theo trong kế hoạch tuần; kiểm tra tiên quyết còn yếu thì chèn ôn nhanh trước', 'Kế hoạch, mức thành thạo', 'Khái niệm mục tiêu, danh sách tiên quyết cần nhắc'],
  ['2. Lấy nội dung đúng', 'Tìm các đoạn tài liệu liên quan nhất bằng tìm kiếm ngữ nghĩa (RAG), giới hạn 5 đến 8 đoạn', 'Chỉ mục vector, bản đồ kiến thức', 'Tập đoạn nguồn có mã để trích dẫn'],
  ['3. Lấy hình dạng', 'Rút từ hồ sơ: mức thành thạo, lỗi cũ liên quan, kiểu giải thích hiệu quả, ngành, thời gian còn đến kỳ thi, thời lượng phiên', 'Hồ sơ người học', 'Bản mô tả người học có cấu trúc (JSON)'],
  ['4. Soạn prompt', 'Ghép ba phần: quy tắc cố định, đoạn nguồn, bản mô tả người học; yêu cầu đầu ra theo khuôn (Phụ lục B)', 'Kết quả bước 2 và 3', 'Prompt hoàn chỉnh, có phiên bản'],
  ['5. Gọi mô hình', 'Gửi tới LLM, nhận bài học dạng JSON: mục tiêu, giải thích, ví dụ, lỗi thường gặp của chính sinh viên, câu kiểm tra, trích dẫn', 'Prompt', 'Bài học thô'],
  ['6. Kiểm tra bám nguồn', 'Kiểm tra mọi khẳng định chính có gắn mã đoạn nguồn; đúng khuôn; độ dài trong ngưỡng. Không đạt thì sinh lại một lần rồi báo lỗi', 'Bài học thô, đoạn nguồn', 'Bài học đã duyệt hoặc lỗi được ghi'],
  ['7. Giao và thu tín hiệu', 'Hiển thị; ghi thời gian đọc, kết quả câu kiểm tra, đánh giá của sinh viên', 'Bài học đã duyệt', 'Tín hiệu học tập'],
  ['8. Cập nhật hồ sơ', 'Điều chỉnh mức thành thạo; ghi lỗi mới nếu lặp; cập nhật kiểu giải thích hiệu quả; tính lại kế hoạch nếu cần', 'Tín hiệu học tập', 'Hồ sơ mới, dùng cho bài kế tiếp'],
], [1600, 3400, 2100, 1971]));
add(AFTER_T());
add(H2('7.5. Ví dụ: hai sinh viên, cùng một chương'));
add(P('Tôi thích ví dụ nhỏ chỉ một ý hơn ví dụ lớn nhiều ý, nên ví dụ này chỉ có một khái niệm. Cả hai sinh viên học "Dạng chuẩn 3NF" trong môn Cơ sở dữ liệu, cùng một bài giảng lấy từ thư viện số. Bài học họ nhận khác nhau vì hồ sơ khác nhau, và bảng dưới là cách tôi kiểm tra bằng mắt xem luận điểm có đứng vững không.'));
add(TCAP('Bảng 7.3. Cùng khái niệm, hai bài học'));
add(T(['', 'Sinh viên A', 'Sinh viên B'], [
  ['Hồ sơ', 'Thành thạo "phụ thuộc hàm" 35/100. Từng nhầm phụ thuộc bắc cầu. Hiểu nhanh hơn khi có bảng dữ liệu thật. Ngành Công nghệ thông tin. Thi sau 5 ngày. Phiên học 20 phút.', 'Thành thạo "2NF" 85/100, "phụ thuộc hàm" 80/100. Chưa có lỗi ghi nhận về 3NF nhưng hay nhầm 3NF với BCNF. Thích định nghĩa hình thức. Thi sau 3 tuần. Phiên học 45 phút.'],
  ['Mở đầu', 'Ôn nhanh phụ thuộc hàm bằng một bảng "SinhVien, Lop, GiaoVienChuNhiem" trước khi vào 3NF.', 'Vào thẳng định nghĩa 3NF theo ký hiệu, nhắc lại 2NF một dòng.'],
  ['Giải thích', 'Ngắn, tập trung điều kiện "không có phụ thuộc bắc cầu vào khóa", dùng chính bảng vừa ôn để chỉ ra chỗ vi phạm.', 'Đầy đủ, so sánh 3NF và BCNF trên cùng một lược đồ, nêu trường hợp đạt 3NF nhưng không đạt BCNF.'],
  ['Phần "lỗi bạn từng mắc"', 'Nhắc lại lần nhầm phụ thuộc bắc cầu ở bài trước và cho một ví dụ đối chiếu.', 'Không có; thay bằng "bẫy thường gặp" về BCNF vì hệ thống ghi nhận xu hướng nhầm.'],
  ['Câu kiểm tra', '3 câu nhận diện vi phạm 3NF trên bảng cụ thể.', '5 câu, trong đó 2 câu yêu cầu phân biệt 3NF và BCNF.'],
  ['Sau bài', 'Nếu đúng 3/3, thành thạo tăng, xếp ôn lại sau 2 ngày vì sắp thi. Nếu sai, ghi lỗi và bài tiếp theo quay lại phụ thuộc hàm.', 'Nếu vẫn nhầm BCNF, ghi thành lỗi mới; bài tiếp theo chuyển sang BCNF với ví dụ đối chiếu.'],
], [1600, 3735, 3736]));
add(AFTER_T());
add(H2('7.6. Cập nhật hồ sơ từ tín hiệu học tập'));
add(P('Các quy tắc cập nhật là mặc định hợp lý, không phải giá trị tối ưu; chúng nằm trong cấu hình để chỉnh khi có dữ liệu. Trả lời đúng làm mức thành thạo tăng, nhiều hơn nếu câu khó và nếu đã lâu không ôn. Trả lời sai làm giảm, mạnh hơn nếu là lần sai thứ hai về cùng khái niệm. Mức thành thạo giảm dần theo hàm mũ kể từ lần ôn cuối, với tốc độ phụ thuộc độ ổn định của khái niệm đó với người đó; đây là bản rút gọn của các thuật toán ôn tập ngắt quãng.'));
add(P('Một dạng sai xuất hiện hai lần trở lên được ghi thành mục "hiểu sai" có mô tả, và được đưa vào prompt của các bài liên quan cho tới khi sinh viên trả lời đúng ba lần liên tiếp. Kiểu giải thích nào cho kết quả tốt hơn ở câu kiểm tra và ở đánh giá của sinh viên được ưu tiên dần. Ngưỡng "yếu" là dưới 60, dùng cho cảnh báo và ưu tiên trong kế hoạch.'));
add(P('Cách làm này thuộc họ theo dõi tri thức mà Corbett và Anderson mô tả (1994). Tôi dùng phiên bản đơn giản, giải thích được cho sinh viên bằng một câu, thay vì mô hình học máy phức tạp mà với vài chục người dùng thì không có dữ liệu để huấn luyện. Khi có vài nghìn người dùng, câu trả lời có thể khác, và lúc đó tôi sẽ xem lại.'));
add(H2('7.7. Kiểm soát chất lượng đầu ra của AI'));
add(P('Mô hình ngôn ngữ viết trôi chảy kể cả khi sai, và đó là lý do tôi coi mỗi đầu ra của nó như bản nháp từ một cộng tác viên năng suất nhưng hơi bất lương (Fowler, 2025): đọc kỹ trước khi giao cho ai. Cụ thể, mỗi khẳng định chính phải gắn mã đoạn tài liệu, và đầu ra không có trích dẫn bị từ chối tự động. Câu hỏi ngoài tài liệu được trả lời với nhãn "Ngoài tài liệu môn học" đứng trước, để sinh viên biết mức tin.'));
add(P('Đầu ra phải đúng khuôn JSON, đủ phần, độ dài trong ngưỡng theo thời lượng phiên. Bộ kiểm thử prompt gồm 15 đến 20 hồ sơ mẫu kèm tài liệu mẫu, chạy lại sau mỗi lần sửa; một thay đổi làm bài học mất trích dẫn hoặc dài gấp đôi bị phát hiện trước khi lên hệ thống thật. Mọi prompt và đầu ra được lưu kèm phiên bản, và nút "bài này sai" đưa mục đó vào hàng đợi xem lại của quản trị.'));
add(P('Điều cuối cùng, và có lẽ quan trọng nhất: máy đề xuất, người quyết. Bản đồ kiến thức và kế hoạch đều sửa được, và bản sửa luôn được giữ.'));
add(H2('7.8. Lựa chọn mô hình và chi phí'));
add(P('Hệ thống gọi mô hình qua API, không tự huấn luyện. Mặc định là Claude Opus 5 cho các tác vụ cần lập luận: soạn bài học, trợ giảng, rút bản đồ kiến thức, chấm tự luận. Các tác vụ nhiều nhưng nhẹ như tạo flashcard, tóm tắt sự kiện đọc trang, rút deadline từ tin nhắn dùng mô hình rẻ hơn. Lựa chọn nằm trong cấu hình (F11) để đổi mà không sửa mã, vì thị trường mô hình đổi nhanh hơn bất kỳ đồ án nào.'));
add(TCAP('Bảng 7.4. Giá tham khảo và ước lượng chi phí (giá API công bố, tháng 6/2026; ước lượng cần đo lại khi chạy thật)'));
add(T(['Mô hình', 'Giá đầu vào (USD / 1 triệu token)', 'Giá đầu ra (USD / 1 triệu token)', 'Dùng cho'], [
  ['Claude Opus 5', '5,00', '25,00', 'Bài học, trợ giảng, bản đồ kiến thức, chấm tự luận'],
  ['Claude Sonnet 5', '2,00', '10,00', 'Quiz, giải thích đáp án'],
  ['Claude Haiku 4.5', '1,00', '5,00', 'Flashcard, tóm tắt sự kiện, rút deadline'],
], [2200, 2300, 2300, 2271]));
add(AFTER_T());
add(P('Một bài học điển hình dùng khoảng 6.000 token đầu vào và 1.500 token đầu ra. Với Claude Opus 5, chi phí xấp xỉ 0,07 USD một bài; bộ nhớ đệm prompt cho phần quy tắc và đoạn nguồn lặp lại sẽ giảm phần đầu vào đáng kể. Một sinh viên học ba bài mỗi ngày tốn khoảng 0,2 USD một ngày trước khi tối ưu. Tôi đưa con số này không phải vì tin nó, mà vì nó đủ để thấy chi phí đáng kể ở quy mô trường và chấp nhận được ở quy mô thử nghiệm; hạn mức theo người dùng ở F11 vì thế là bắt buộc, không phải tùy chọn.'));

// ---------- 8 ----------
add(H1('8. Kiến trúc hệ thống'));
add(H2('8.1. Nguyên tắc thiết kế'));
add(P('Tôi dùng từ **modular monolith** để chỉ một ứng dụng triển khai thành một khối nhưng chia thành module có ranh giới rõ, mỗi module không đọc thẳng bảng của module khác. Lý do chọn nó thay vì microservices là lý do Martin Fowler nêu và tôi thấy thuyết phục: phần lớn hệ thống microservices thành công bắt đầu từ một monolith đã lớn quá mức, còn hệ thống tách nhỏ từ đầu thường gặp rắc rối (Fowler, 2015). Với một đội nhỏ và một luồng nghiệp vụ trung tâm, phí phân tán là phí trả trước cho một vấn đề chưa có.'));
add(P('Ranh giới module rõ ngay từ đầu là cái giá tôi trả để giữ cửa mở. Nếu sau này module Content cần mở rộng riêng vì xử lý tài liệu nặng, việc tách là tách một thứ đã có ranh giới, không phải gỡ một đống rối. Kiến trúc, theo cách Ralph Johnson nói mà Fowler hay trích, là về những thứ khó thay đổi; việc của người thiết kế là làm cho càng ít thứ khó đổi càng tốt (Fowler, 2003).'));
add(P('Thiết kế tiến hóa đi kèm hai điều kiện, thiếu thì nó thành đống bùn: mã tự kiểm thử, và tích hợp lên nhánh chính hằng ngày (Fowler, 2014). Tôi cũng tách phần đổi nhanh khỏi phần ổn định. Prompt, bộ đọc trang và bộ gọi mô hình đổi nhiều nhất, nên nằm ở lớp mỏng phía ngoài; mô hình miền ở giữa, gồm hồ sơ, khái niệm, bài học, kế hoạch, không biết HTML của trường hay tên mô hình AI là gì.'));
add(H2('8.2. Sơ đồ kiến trúc'));
add(FIG('d1_architecture.png', 'Hình 8.1. Kiến trúc tổng thể: ba client, một backend dạng modular monolith, lớp dữ liệu, và hai hệ thống của trường.', 600));
add(H2('8.3. Thành phần và trách nhiệm'));
add(P('Bảng dưới là để tra cứu. Điều đáng nói nhất không nằm trong bảng: worker và backend là cùng một mã nguồn chạy thành hai tiến trình, để việc nặng như xử lý tài liệu không làm chậm người đang học, mà vẫn không phải quản hai hệ thống.'));
add(TCAP('Bảng 8.1. Thành phần hệ thống'));
add(T(['Thành phần', 'Trách nhiệm', 'Ghi chú'], [
  ['Web app', 'Toàn bộ chức năng cho sinh viên và quản trị: kho học liệu, bản đồ kiến thức, lộ trình, bài học, chat, quiz, dashboard, quản trị.', 'Giao diện chính; nơi cấu hình extension và mobile.'],
  ['Mobile app', 'Ôn flashcard, làm quiz ngắn, xem kế hoạch hôm nay, chat nhanh, nhận thông báo đẩy.', 'Không có tích hợp trường, vì Chrome trên Android không hỗ trợ extension.'],
  ['Browser extension', 'Đọc cổng đào tạo; nhập bài giảng từ thư viện số; thanh bên trợ giảng có ngữ cảnh trang; bôi đen để hỏi; ghi thời gian đọc trên trang được phép; nhắc nhở.', 'Manifest V3. Quyền host giới hạn theo danh sách, gồm cả địa chỉ HTTP có cổng 8080 của thư viện.'],
  ['Backend (modular monolith)', 'Module: Identity, Integration, Content, Knowledge, Personalization, Tutor, Practice, Progress, Admin. API REST cho ba client.', 'Node.js / TypeScript. Mỗi module có thư mục riêng, giao diện riêng, kiểm thử riêng.'],
  ['Worker', 'Việc chạy nền: trích xuất và lập chỉ mục tài liệu, rút bản đồ kiến thức, sinh trước bài học cho ngày mai, gửi nhắc nhở, đồng bộ OAI-PMH.', 'Cùng mã nguồn với backend, chạy như tiến trình riêng đọc hàng đợi.'],
  ['PostgreSQL + pgvector', 'Dữ liệu nghiệp vụ và chỉ mục vector trong cùng một cơ sở dữ liệu.', 'Tránh thêm một hệ vector riêng khi chưa cần.'],
  ['Redis', 'Cache, hàng đợi việc nền, giới hạn tốc độ gọi AI.', ''],
  ['Object storage', 'File gốc sinh viên tải lên.', 'Có thể là thư mục máy chủ ở giai đoạn thử nghiệm.'],
  ['LLM API', 'Soạn bài học, trợ giảng, bản đồ kiến thức, quiz, chấm tự luận, rút deadline.', 'Gọi qua một lớp thích ứng duy nhất để đổi mô hình mà không sửa nghiệp vụ.'],
], [2100, 4300, 2671]));
add(AFTER_T());
add(H2('8.4. Ba luồng dữ liệu chính'));
add(P('Ba luồng dưới đây là ba thứ tôi sẽ viết kiểm thử tích hợp cho trước tiên, vì chúng đi qua nhiều module nhất.'));
add(H3('8.4.1. Nhập tài liệu và tạo bản đồ kiến thức'));
add(NL([
  'Sinh viên tải file, dán link, hoặc bấm "Nhập" trên thư viện số. File gốc lưu vào object storage, bản ghi tài liệu ở trạng thái "đã tải".',
  'Worker trích xuất văn bản (kèm OCR nếu cần), cắt đoạn, tạo vector nhúng, lưu vào bảng đoạn với pgvector. Trạng thái "đã lập chỉ mục".',
  'Worker gửi toàn văn, hoặc tóm tắt từng chương với tài liệu dài, cho LLM để rút danh sách khái niệm, chương, tiên quyết, và gán đoạn liên quan. Trạng thái "đã có bản đồ".',
  'Sinh viên xem bản đồ, sửa nếu cần, rồi làm bài chẩn đoán.',
]));
add(H3('8.4.2. Sinh bài học và cập nhật hồ sơ'));
add(NL([
  'Tối hôm trước, worker đọc kế hoạch ngày mai của từng sinh viên và sinh trước bài học cho mục đầu tiên, để sáng mở ra là có ngay.',
  'Khi sinh viên học, module Personalization thực hiện tám bước ở Bảng 7.2 cho các mục còn lại theo thời gian thực.',
  'Kết quả câu kiểm tra và đánh giá bài học đi qua module Progress thành tín hiệu, rồi module Knowledge cập nhật mức thành thạo và trí nhớ.',
  'Nếu hồ sơ thay đổi đủ lớn, ví dụ phát hiện tiên quyết yếu, module Personalization tính lại kế hoạch tuần và ghi phiên bản mới kèm lý do.',
]));
add(H3('8.4.3. Đồng bộ từ cổng đào tạo'));
add(NL([
  'Sinh viên mở cổng đào tạo và đăng nhập như bình thường. Extension nhận ra trang thuộc danh sách được phép.',
  'Bộ đọc trang tương ứng (thời khóa biểu, lịch thi, điểm) trích bảng HTML thành dữ liệu có cấu trúc ngay trên trình duyệt.',
  'Extension gửi dữ liệu kèm token của sinh viên tới module Integration; module này đối chiếu với dữ liệu cũ, tạo hoặc cập nhật môn học, kỳ thi, điểm.',
  'Module Integration phát sự kiện "học kỳ đã cập nhật"; Personalization tính lại ưu tiên, Content gợi ý bài giảng từ danh mục thư viện số đã đồng bộ qua OAI-PMH.',
]));
add(H2('8.5. Tích hợp với hệ thống của trường'));
add(P('Tôi ghi cả cách xử lý khi mỗi nguồn hỏng, vì với hệ thống ngoài thì câu hỏi không phải "có hỏng không" mà là "hỏng thì sinh viên còn dùng được gì".'));
add(TCAP('Bảng 8.2. Cách lấy dữ liệu từ hệ thống hiện có'));
add(T(['Hệ thống', 'Dữ liệu', 'Cách lấy', 'Khi hỏng thì sao'], [
  ['Cổng đào tạo (ASP.NET)', 'Môn học, thời khóa biểu, lịch thi, điểm', 'Extension đọc bảng HTML sau khi sinh viên đăng nhập; không lưu mật khẩu', 'Trường đổi giao diện thì bộ đọc hỏng. Bộ đọc tách riêng, có kiểm thử với HTML mẫu, báo lỗi rõ cho sinh viên, cho nhập tay thay thế.'],
  ['Thư viện số (DSpace)', 'Danh mục bài giảng: tên, từ khóa, bộ sưu tập, đường dẫn', 'Backend thu thập qua OAI-PMH theo lịch', 'Giao thức chuẩn, ít thay đổi. Nếu trường tắt OAI-PMH, chuyển sang đọc trang tìm kiếm qua extension.'],
  ['Thư viện số (DSpace)', 'Nội dung PDF bài giảng', 'Extension gửi nội dung khi sinh viên đã đăng nhập và đang mở file; hoặc sinh viên tải về rồi tải lên', 'File "giới hạn truy cập" cần quyền của sinh viên. Hệ thống không vượt quyền; giai đoạn hai xin cấp truy cập chính thức.'],
  ['Kênh giảng viên (Zalo, email)', 'Deadline, thông báo', 'Sinh viên dán văn bản hoặc ảnh; AI rút thông tin; sinh viên xác nhận', 'AI đọc sai ngày. Luôn có bước xác nhận, hiển thị văn bản gốc cạnh kết quả.'],
], [1800, 2000, 2500, 2771]));
add(AFTER_T());
add(H2('8.6. Vì sao chưa dùng microservices'));
add(P('Câu hỏi "vì sao không microservices" hay đến với hệ thống có AI, như thể AI đòi hỏi phân tán. Câu trả lời của tôi bắt đầu bằng "còn tùy", và tùy vào ba thứ: hệ thống đã quá phức tạp cho một tiến trình chưa; có nhiều đội cần triển khai độc lập không; và đã có sẵn cấp phát hạ tầng nhanh, giám sát cơ bản, triển khai nhanh chưa (Fowler, 2014; 2015). Cả ba câu trả lời hiện nay đều là chưa.'));
add(P('Microservices đem lại lợi ích thật khi một trong ba điều kiện đó đổi, và đổi lại là chi phí về vận hành, tính nhất quán dữ liệu, và độ phức tạp của gọi qua mạng. Ở giai đoạn một, hệ thống có một đội nhỏ, khoảng hai chục bảng dữ liệu và một luồng nghiệp vụ trung tâm. Tôi sẽ đổi ý khi một trong ba điều kiện đổi, và kiến trúc module là để lúc đó đổi ý không quá đau.'));

// ---------- 9 ----------
add(H1('9. Mô hình dữ liệu'));
add(H2('9.1. Sơ đồ thực thể'));
add(P('Tôi vẽ sơ đồ rút gọn, vì sơ đồ đầy đủ chỉ làm người đọc mỏi mắt mà không thêm hiểu biết. Ba thực thể tô màu xanh nhạt hợp thành hồ sơ người học; bài học tô màu cam vì nó là đầu ra trung tâm. Phần còn lại là dữ liệu quản trị và tín hiệu.'));
add(FIG('d4_erd.png', 'Hình 9.1. Sơ đồ thực thể rút gọn. Các thực thể màu xanh nhạt hợp thành hồ sơ người học.', 600));
add(H2('9.2. Mô tả thực thể'));
add(TCAP('Bảng 9.1. Thực thể chính'));
add(T(['Thực thể', 'Ý nghĩa', 'Thuộc tính chính', 'Quan hệ'], [
  ['NguoiDung (User)', 'Tài khoản đăng nhập và vai trò', 'id, email, mật khẩu băm, vai trò, trạng thái', '1 người dùng là 1 sinh viên hoặc 1 quản trị viên'],
  ['SinhVien (Student)', 'Thông tin sinh viên', 'id, họ tên, MSSV, ngành, khóa, mục tiêu học kỳ, giờ rảnh, định dạng ưa thích', 'Có nhiều DangKy, TaiLieu, KeHoach; có 1 HoSoNguoiHoc'],
  ['MonHoc (Course)', 'Môn học theo cổng đào tạo', 'id, mã môn, tên, giảng viên, học kỳ, nguồn', 'Có nhiều KhaiNiem, TaiLieu, DangKy'],
  ['DangKy (Enrollment)', 'Sinh viên học môn trong học kỳ', 'sinh_vien_id, mon_hoc_id, học kỳ, ngày thi, phòng thi, điểm (nếu đã thi)', 'Nối SinhVien và MonHoc'],
  ['TaiLieu (Material)', 'Một tài liệu đã nhập', 'id, mon_hoc_id, sinh_vien_id, loại, nguồn (tải lên / thư viện số / link), đường dẫn file, trạng thái xử lý', 'Có nhiều Doan'],
  ['Doan (Chunk)', 'Đoạn văn bản của tài liệu để tìm kiếm ngữ nghĩa', 'id, tai_lieu_id, thứ tự, nội dung, trang, vector nhúng', 'Thuộc 1 TaiLieu; gắn với nhiều KhaiNiem'],
  ['KhaiNiem (Concept)', 'Một nút trong bản đồ kiến thức', 'id, mon_hoc_id, tên, mô tả, chương, thứ tự, do AI sinh / do người sửa', 'Có nhiều tiên quyết (tự tham chiếu); gắn nhiều Doan'],
  ['ThanhThao (Mastery)', 'Mức thành thạo của sinh viên với khái niệm', 'sinh_vien_id, khai_niem_id, điểm 0..100, độ ổn định, lần ôn cuối, số lần đúng / sai', 'Thuộc hồ sơ người học'],
  ['TriNho (Memory)', 'Điều hệ thống ghi nhớ về sinh viên', 'id, sinh_vien_id, khai_niem_id (tùy chọn), loại (hiểu sai / kiểu giải thích hiệu quả / sở thích), nội dung, bằng chứng, ngày ghi, còn hiệu lực', 'Thuộc hồ sơ người học'],
  ['HoSoNguoiHoc (Profile)', 'Phần tổng hợp của hồ sơ người học', 'sinh_vien_id, nhịp học, thời lượng phiên trung bình, giờ hay học, cập nhật lần cuối', 'Cùng ThanhThao và TriNho tạo thành hồ sơ'],
  ['KeHoach (StudyPlan)', 'Kế hoạch một tuần', 'id, sinh_vien_id, tuần, phiên bản, lý do thay đổi, tạo lúc', 'Có nhiều MucKeHoach'],
  ['MucKeHoach (PlanItem)', 'Một việc trong kế hoạch', 'ke_hoach_id, khai_niem_id, ngày, thời lượng, trạng thái, bai_hoc_id (khi đã sinh)', 'Thuộc KeHoach; trỏ tới 1 BaiHoc'],
  ['BaiHoc (Lesson)', 'Bài học đã sinh cho một sinh viên', 'id, sinh_vien_id, khai_niem_id, nội dung (JSON), các đoạn trích dẫn, phiên bản prompt, mô hình, chi phí, đánh giá của sinh viên', 'Có nhiều CauHoi'],
  ['CauHoi (Quiz item)', 'Câu hỏi luyện tập', 'id, bai_hoc_id hoặc khai_niem_id, dạng, nội dung, đáp án, giải thích, đoạn trích dẫn, độ khó', 'Có nhiều LanLam'],
  ['LanLam (Attempt)', 'Một lần trả lời', 'cau_hoi_id, sinh_vien_id, câu trả lời, đúng / sai, thời gian, lúc', 'Sinh tín hiệu cập nhật ThanhThao'],
  ['Flashcard, LichOn', 'Thẻ ôn và lịch ôn ngắt quãng', 'sinh_vien_id, khai_niem_id, mặt trước, mặt sau, lần ôn tới, khoảng cách, độ dễ', ''],
  ['SuKienHoc (ActivityEvent)', 'Tín hiệu từ web, mobile, extension', 'sinh_vien_id, nguồn, loại, URL hoặc màn hình, tiêu đề, khai_niem_id (suy ra), thời lượng, lúc', 'Xóa được theo yêu cầu'],
  ['HoiThoai (TutorMessage)', 'Tin nhắn với trợ giảng', 'id, sinh_vien_id, vai (sinh viên / AI), nội dung, ngữ cảnh (khai_niem, đoạn, trang), lúc', ''],
  ['Deadline, ThongBao', 'Hạn nộp và thông báo', 'sinh_vien_id, mon_hoc_id, tiêu đề, hạn, nguồn, văn bản gốc; loại thông báo, kênh, đã đọc', ''],
], [1900, 2200, 3100, 1871]));
add(AFTER_T());
add(H2('9.3. Vài lưu ý về dữ liệu'));
add(P('Mọi bảng chứa dữ liệu cá nhân đều có cột sinh_vien_id, để xóa toàn bộ dữ liệu một người trong một thao tác; tôi coi việc xóa được là một yêu cầu thiết kế, không phải một màn hình thêm sau. Bài học lưu cả phiên bản prompt và mô hình đã dùng, để so chất lượng giữa các phiên bản và để giải thích được vì sao bài học có nội dung như vậy.'));
add(P('Vector nhúng lưu trong PostgreSQL với pgvector và chỉ mục HNSW. Khi số đoạn vượt vài triệu mới đáng xem lại lựa chọn này, và tôi nghi đồ án không đi tới đó. Nội dung tài liệu từ thư viện số không sao chép vào bảng dùng chung; mỗi sinh viên có bản trích xuất riêng gắn với tài khoản của họ.'));

// ---------- 10 ----------
add(H1('10. Công nghệ đề xuất'));
add(P('Những lựa chọn dưới đây là mặc định hợp lý, tức là thứ tôi chọn khi chưa có lý do làm khác, chứ không phải "best practice" (một cụm tôi tránh vì nó ngụ ý có câu trả lời đúng cho mọi bối cảnh). Người xây dựng đổi được, miễn ranh giới module và hợp đồng API giữ nguyên. Tôi cũng ghi lựa chọn thay thế để cho thấy mỗi lựa chọn có thể đảo được.'));
add(TCAP('Bảng 10.1. Công nghệ mặc định'));
add(T(['Thành phần', 'Lựa chọn mặc định', 'Lý do', 'Có thể thay bằng'], [
  ['Web', 'Next.js (React, TypeScript)', 'Một ngôn ngữ cho cả web, backend, extension; hệ sinh thái lớn', 'Vue / Nuxt'],
  ['Backend', 'Node.js, TypeScript, khung web nhẹ (NestJS hoặc Fastify), Prisma ORM', 'Chia module rõ, kiểu tĩnh giúp giữ ranh giới; Prisma sinh kiểu từ schema', 'Django, Spring Boot'],
  ['Cơ sở dữ liệu', 'PostgreSQL 16 + pgvector', 'Dữ liệu nghiệp vụ và vector trong một nơi; giao dịch nhất quán', 'Thêm hệ vector riêng khi cần'],
  ['Cache, hàng đợi', 'Redis + BullMQ', 'Đơn giản, đủ cho việc nền và giới hạn tốc độ', 'RabbitMQ'],
  ['Mobile', 'React Native (Expo)', 'Dùng lại kiểu dữ liệu và một phần mã với web', 'Flutter'],
  ['Extension', 'Chrome Manifest V3, TypeScript, side panel API', 'Chạy trên Chrome và Edge; quyền host giới hạn', 'Thêm Firefox sau'],
  ['AI', 'Claude qua API (Opus 5 mặc định), lớp thích ứng riêng', 'Chất lượng lập luận; đổi mô hình qua cấu hình', 'Mô hình khác qua cùng lớp thích ứng'],
  ['Xử lý tài liệu', 'pdf-parse hoặc pdf.js, mammoth (Word), OCR (Tesseract hoặc dịch vụ)', 'Mã nguồn mở, đủ cho tài liệu học tập', 'Dịch vụ OCR thương mại nếu ảnh xấu'],
  ['Kiểm thử', 'Vitest hoặc Jest, Playwright cho giao diện, bộ kiểm thử prompt riêng', 'Chạy tự động trong CI', ''],
  ['Triển khai', 'Docker Compose cho thử nghiệm; một máy chủ; CI trên GitHub Actions', 'Đủ cho giai đoạn một, ít việc vận hành', 'Kubernetes khi có nhiều đội'],
], [1700, 2600, 2900, 1871]));
add(AFTER_T());

// ---------- 11 ----------
add(H1('11. Lộ trình triển khai'));
add(P('Tôi xây theo lát cắt dọc: mỗi lát đi từ giao diện xuống cơ sở dữ liệu cho một việc dùng được, thay vì làm xong toàn bộ backend rồi mới làm giao diện. Cách này cho phản hồi sớm và làm cho việc cắt bớt về sau là cắt cả lát, không phải cắt dở một lớp. Thứ tự lát cắt quan trọng hơn thời lượng từng lát.'));
add(P('Tôi vẫn ghi thời lượng vì giảng viên sẽ hỏi, nhưng muốn nói rõ tôi nghĩ gì về nó. Ước lượng chỉ đáng làm khi nó đổi được một quyết định (Fowler, 2013), và ở đây quyết định duy nhất nó đổi là có bỏ lát 6 và 7 hay không. Con số chỉ đáng tin sau khi lát cắt đầu tiên xong và cho thấy tốc độ thật của đội.'));
add(TCAP('Bảng 11.1. Lát cắt dọc theo thứ tự'));
add(T(['Lát cắt', 'Nội dung', 'Có thể demo gì khi xong', 'Gợi ý'], [
  ['0. Bộ khung', 'Đăng nhập, cấu trúc module, CI chạy kiểm thử, triển khai một máy chủ, lớp gọi AI có bộ kiểm thử prompt rỗng', 'Đăng nhập được; một API trả lời "xin chào" đi qua đủ các lớp', '1 tuần'],
  ['1. Vòng lõi', 'Tải một PDF, lập chỉ mục, rút bản đồ kiến thức, bài chẩn đoán, sinh một bài học theo hồ sơ, câu kiểm tra, cập nhật thành thạo', 'Hai hồ sơ mẫu, cùng một chương, hai bài học khác nhau; làm quiz thấy điểm thành thạo đổi', '3 tuần'],
  ['2. Lộ trình', 'Nhập tay môn học và ngày thi, kế hoạch tuần, tính lại khi trễ, deadline từ văn bản dán', 'Kế hoạch tuần thay đổi khi đổi ngày thi hoặc làm sai quiz', '2 tuần'],
  ['3. Extension', 'Đọc cổng đào tạo (môn, thời khóa biểu, lịch thi, điểm), nhập bài giảng từ thư viện số, đồng bộ OAI-PMH, ghi thời gian đọc', 'Mở cổng đào tạo, học kỳ tự xuất hiện trong hệ thống; gợi ý bài giảng từ thư viện', '2 tuần'],
  ['4. Trợ giảng', 'Chat có trích dẫn, trí nhớ dài hạn, thanh bên extension, bôi đen để hỏi, YouTube', 'Hỏi cùng câu hai lần cách nhau, lần hai AI nhắc lỗi cũ', '2 tuần'],
  ['5. Ôn tập', 'Flashcard, lịch ôn ngắt quãng, nhiều dạng câu hỏi, dashboard tiến độ, cảnh báo', 'Dashboard và lịch ôn cho một sinh viên sau một tuần dùng', '2 tuần'],
  ['6. Mobile', 'Ứng dụng di động: kế hoạch hôm nay, flashcard, quiz, thông báo đẩy', 'Nhận thông báo và ôn thẻ trên điện thoại', '2 tuần'],
  ['7. Quản trị và riêng tư', 'Màn hình quản trị, cấu hình AI, hạn mức, nhật ký; màn hình dữ liệu cá nhân, tạm dừng, xóa', 'Xóa tài khoản và kiểm tra dữ liệu đã sạch; xem chi phí AI theo ngày', '1 tuần'],
], [1500, 3500, 3000, 1071]));
add(AFTER_T());
add(P('Lát cắt 1 là quan trọng nhất và cũng rủi ro nhất, vì nó kiểm luận điểm trung tâm: hồ sơ khác nhau có thật cho bài học khác nhau, và khác đó có ích hơn không. Nếu sau lát cắt 1 câu trả lời là không, các lát sau phải xem lại. Đó là lý do nó đứng trước extension và mobile, dù hai phần này dễ gây ấn tượng hơn khi demo.'));

// ---------- 12 ----------
add(H1('12. Kiểm thử và bảo đảm chất lượng'));
add(P('Câu hỏi tôi dùng để biết đã đủ kiểm thử chưa là: nếu tôi làm hỏng dòng này, có kiểm thử nào báo không (Fowler, 2014). Với thuật toán thành thạo, lịch ôn và tính ưu tiên, câu trả lời phải là có, bằng kiểm thử đơn vị với đầu vào cố định và đầu ra cố định, chạy dưới một giây. Với bộ đọc trang cổng đào tạo, câu trả lời là kiểm thử hợp đồng trên HTML mẫu lưu sẵn; khi trường đổi giao diện, thêm HTML mẫu mới chứ không sửa kiểm thử cũ.'));
add(P('Prompt cũng là mã, nên cũng có kiểm thử. Bộ kiểm thử prompt gồm 15 đến 20 hồ sơ mẫu kèm tài liệu mẫu, kiểm tra đầu ra đúng khuôn, có trích dẫn, độ dài trong ngưỡng, và có phần "lỗi bạn từng mắc" khi hồ sơ có lỗi. Nó chạy trước khi bất kỳ prompt mới nào lên hệ thống thật. Tôi không kỳ vọng nó bắt được mọi câu sai của mô hình; tôi kỳ vọng nó bắt được những thay đổi làm mọi thứ tệ đi cùng lúc.'));
add(P('Ba luồng ở mục 8.4 có kiểm thử tích hợp với cơ sở dữ liệu thật trong Docker, và các đường đi chính trên giao diện có kiểm thử tự động. Mọi thay đổi gộp vào nhánh chính hằng ngày và chạy toàn bộ kiểm thử; tôi không giữ nhánh dài, vì tích hợp đau thì cách chữa là tích hợp thường xuyên hơn (Fowler, 2011). Khi chạy thật, hệ thống theo dõi chi phí AI theo ngày và theo người, tỷ lệ đầu ra bị từ chối vì thiếu trích dẫn, tỷ lệ sinh viên bấm "bài này sai", và thời gian sinh một bài học.'));

// ---------- 13 ----------
add(H1('13. Quyền riêng tư, bảo mật và bản quyền'));
add(P('Nguyên tắc tôi theo là tối thiểu hóa: thu ít nhất có thể, giữ ngắn nhất có thể, và để người bị thu quyết định. Không có tín hiệu nào được thu trước khi sinh viên đồng ý trên một màn hình nói rõ thu gì, ở đâu, để làm gì, và sự đồng ý rút lại được bất cứ lúc nào. Extension chỉ chạy trên danh sách trang được phép, chỉ lưu tín hiệu suy ra, không chụp màn hình, không đọc trang ngân hàng, tin nhắn, ẩn danh.'));
add(P('Sinh viên xem, tải về, và xóa toàn bộ dữ liệu; tạm dừng theo dõi; xem và sửa bản đồ kiến thức lẫn kế hoạch mà máy đề xuất. Về bảo mật, mật khẩu băm bằng thuật toán chậm, token có hạn, HTTPS bắt buộc, extension chỉ gửi tới máy chủ của hệ thống, và khóa API của mô hình chỉ ở backend, không bao giờ ở client. Prompt gửi cho mô hình chỉ chứa hồ sơ ở dạng mô tả cần cho bài học, không chứa họ tên, MSSV, email.'));
add(P('Bài giảng từ thư viện số dùng trong phạm vi tài khoản sinh viên, đúng như thư viện yêu cầu "tuân thủ Luật bản quyền": không công khai, không chia sẻ, không dùng để huấn luyện mô hình. Giai đoạn hai sẽ xin thỏa thuận chính thức với trường, và tới lúc đó tôi coi phần này là ràng buộc chứ không phải chi tiết.'));

// ---------- 14 ----------
add(H1('14. Rủi ro và giả định'));
add(P('Rủi ro lớn nhất không phải kỹ thuật. Đó là luận điểm chính sai: bài học "cá nhân hóa" hóa ra không khác nhau đáng kể, hoặc khác nhưng không có ích hơn. Tôi xếp nó đầu bảng và đặt cách xử lý ở lát cắt 1, vì rủi ro loại này càng phát hiện sớm càng rẻ. Các rủi ro còn lại là loại tôi khá quen: phần mềm hỏng theo những cách phần mềm hay hỏng.'));
add(TCAP('Bảng 14.1. Rủi ro chính'));
add(T(['Rủi ro', 'Khả năng', 'Ảnh hưởng', 'Giảm thiểu'], [
  ['Bài học "cá nhân hóa" không khác nhau đáng kể, hoặc khác nhưng không có ích hơn', 'Trung bình', 'Cao: mất luận điểm trung tâm', 'Làm lát cắt 1 trước; thử với hồ sơ mẫu đối lập; đo bằng thử nghiệm ở mục 15; sẵn sàng thu về thành trợ giảng có trí nhớ nếu kết quả yếu'],
  ['AI sinh nội dung sai nhưng trôi chảy', 'Cao', 'Cao: sinh viên học sai', 'Bám nguồn bắt buộc, nói rõ khi ngoài tài liệu, nút báo sai, bộ kiểm thử prompt, nhật ký để xem lại'],
  ['Cổng đào tạo đổi giao diện', 'Thấp', 'Trung bình: mất đồng bộ tự động', 'Bộ đọc tách riêng có kiểm thử; cho nhập tay; thông báo rõ khi hỏng'],
  ['Thư viện số tắt OAI-PMH hoặc chặn đọc', 'Thấp', 'Thấp: mất gợi ý bài giảng', 'Sinh viên vẫn tải lên được; giai đoạn hai xin truy cập chính thức'],
  ['Chi phí AI vượt dự kiến', 'Trung bình', 'Trung bình', 'Hạn mức theo người và theo ngày; bộ nhớ đệm prompt; mô hình rẻ cho tác vụ nhẹ; sinh trước bài học theo lô'],
  ['Sinh viên không cài extension vì lo riêng tư', 'Trung bình', 'Trung bình: mất tín hiệu tự động', 'Mọi chức năng cốt lõi vẫn dùng được không cần extension; màn hình đồng ý minh bạch; nút tạm dừng'],
  ['Bản đồ kiến thức do AI rút ra không khớp cách giảng viên dạy', 'Trung bình', 'Trung bình', 'Cho sinh viên sửa; giai đoạn hai để giảng viên duyệt'],
  ['Phạm vi quá rộng so với thời gian đồ án', 'Trung bình', 'Cao', 'Thứ tự lát cắt cố định; các mục "Mở rộng" và lát cắt 6, 7 lùi được mà phần còn lại vẫn trọn vẹn'],
], [2700, 1100, 1900, 3371]));
add(AFTER_T());
add(P('Tôi giả định sinh viên có tài khoản cổng đào tạo và thư viện số, học chủ yếu trên máy tính có Chrome hoặc Edge, giảng viên vẫn gửi tài liệu qua Zalo hoặc email, và trường không phản đối việc sinh viên dùng dữ liệu của chính mình. Hai điều tôi chưa biết là hạn nộp đồ án và số thành viên nhóm; thời lượng ở Bảng 11.1 sẽ đổi theo hai điều này, và tôi thà nói chưa biết còn hơn điền một con số cho đẹp.'));

// ---------- 15 ----------
add(H1('15. Đánh giá kết quả'));
add(P('Ngành phần mềm chưa bao giờ đo được năng suất lập trình viên, và tôi nghi "hiệu quả học tập" cũng khó đo tương tự (Fowler, 2003). Điều đó không có nghĩa là không đo gì. Nó có nghĩa là hỏi vài câu cụ thể, mỗi câu có tín hiệu quan sát được và cách thu, rồi không cộng chúng lại thành một con số để trông có vẻ khoa học.'));
add(TCAP('Bảng 15.1. Câu hỏi đánh giá và tín hiệu'));
add(T(['Câu hỏi', 'Tín hiệu quan sát', 'Cách thu'], [
  ['Bài học cá nhân hóa có ích hơn bài học tĩnh không?', 'Điểm trên quiz ẩn (câu hỏi chưa từng thấy) sau mỗi bài; đánh giá "dễ hiểu" của sinh viên', 'Thử nghiệm nhỏ 10 đến 20 sinh viên trong 3 tuần: mỗi sinh viên nhận xen kẽ bài cá nhân hóa và bài tĩnh cùng nội dung, không biết bài nào là loại nào'],
  ['Hệ thống có nhận ra điểm yếu trước kỳ thi không?', 'Tỷ lệ khái niệm hệ thống đánh dấu "yếu" mà sinh viên cũng tự nhận là yếu; kết quả thi thật ở các khái niệm đó', 'Khảo sát ngắn trước thi; đối chiếu điểm sau thi khi sinh viên đồng ý'],
  ['Sinh viên có dùng lại không?', 'Số ngày có hoạt động trong tuần; số bài học hoàn thành; tỷ lệ bỏ giữa chừng', 'Nhật ký hệ thống'],
  ['AI có sai nhiều không?', 'Tỷ lệ đầu ra bị từ chối tự động; tỷ lệ bấm "bài này sai"; số lỗi tìm thấy khi xem lại mẫu', 'Nhật ký; xem lại 30 bài học ngẫu nhiên mỗi tuần'],
  ['Chi phí có chấp nhận được không?', 'USD trên một sinh viên một tuần', 'Nhật ký chi phí theo tác vụ'],
], [2600, 3200, 3271]));
add(AFTER_T());
add(P('Kết quả thử nghiệm với mười hay hai mươi người không phải bằng chứng thống kê, và tôi không định trình bày nó như vậy. Bằng chứng giai thoại vẫn là bằng chứng nếu ta nói rõ nó là gì và không đòi nó gánh nhiều hơn sức nó (Fowler, 2005). Nó đủ để trả lời câu hỏi thực dụng: có nên tiếp tục hướng này không, và nếu có thì sửa gì trước.'));

// ---------- 16 ----------
add(H1('16. Kết luận'));
add(P('Hệ thống này đặt hồ sơ người học vào trung tâm và dùng mô hình ngôn ngữ lớn để soạn bài học riêng cho từng sinh viên, trên tài liệu của đúng môn và dữ liệu học vụ thật của trường. Khác biệt so với một chatbot đọc giáo trình nằm ở vòng lặp: mỗi tín hiệu học tập làm bài học tiếp theo khác đi. Nó dùng cổng đào tạo và thư viện số hiện có mà không cần trường thay đổi gì, và để ngỏ cửa hợp tác sâu hơn.'));
add(P('Về kỹ thuật, tôi chọn một khối có module rõ, xây theo lát cắt dọc, kiểm thử ở mọi tầng kể cả prompt, và coi đầu ra của AI như bản nháp cần đọc kỹ. Về giá trị, tôi trình bày lợi ích cá nhân hóa như một giả thuyết có cách kiểm ngay từ lát cắt đầu tiên. Nếu giả thuyết đứng vững, các lát sau mở rộng nó ra extension, mobile và ôn tập. Nếu không, thứ còn lại vẫn là một trợ giảng có trí nhớ và một công cụ lập kế hoạch bám lịch thi thật, và tôi nghĩ tự thân nó đã đáng làm.'));
add(P('Ai muốn đọc thêm về những lựa chọn kiến trúc ở đây thì các bài của Martin Fowler về monolith first, YAGNI và self-testing code là chỗ tôi lấy phần lớn lập luận; về theo dõi tri thức thì Corbett và Anderson (1994) vẫn là bài nền; về vì sao tôi không hỏi "phong cách học tập" thì Pashler và cộng sự (2008) nói kỹ hơn tôi. Danh sách đầy đủ ở phần tài liệu tham khảo.'));

// ---------- References ----------
add(H1('Tài liệu tham khảo'));
add(NL([
  'Cepeda, N. J., Pashler, H., Vul, E., Wixted, J. T., Rohrer, D. (2006). Distributed practice in verbal recall tasks: A review and quantitative synthesis. *Psychological Bulletin*, 132(3), 354–380.',
  'Corbett, A. T., Anderson, J. R. (1994). Knowledge tracing: Modeling the acquisition of procedural knowledge. *User Modeling and User-Adapted Interaction*, 4(4), 253–278.',
  'Evans, E. (2003). *Domain-Driven Design: Tackling Complexity in the Heart of Software*. Addison-Wesley.',
  'Fowler, M. (2003). Who Needs an Architect? *IEEE Software*, 20(5), 11–13.',
  'Fowler, M. (2003). *Cannot Measure Productivity*. martinfowler.com.',
  'Fowler, M. (2005). *Anecdotal Evidence*. martinfowler.com.',
  'Fowler, M. (2011). *Frequency Reduces Difficulty*. martinfowler.com.',
  'Fowler, M. (2013). *Purpose of Estimation*. martinfowler.com.',
  'Fowler, M. (2014). *Self-Testing Code*. martinfowler.com.',
  'Fowler, M. (2014). *Microservice Prerequisites*. martinfowler.com.',
  'Fowler, M. (2015). *Monolith First*. martinfowler.com.',
  'Fowler, M. (2015). *Microservice Premium*. martinfowler.com.',
  'Fowler, M. (2015). *Yagni*. martinfowler.com.',
  'Fowler, M. (2025). *Some thoughts on LLMs and Software Development*. martinfowler.com.',
  'Lewis, P. và cộng sự (2020). Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks. *Advances in Neural Information Processing Systems*, 33.',
  'Pashler, H., McDaniel, M., Rohrer, D., Bjork, R. (2008). Learning styles: Concepts and evidence. *Psychological Science in the Public Interest*, 9(3), 105–119.',
  'Trường Đại học Công nghệ Giao thông Vận tải. Cổng thông tin đào tạo, daotao.utt.edu.vn; Thư viện số, thuvien.utt.edu.vn:8080 (truy cập 02/09/2026).',
  'Anthropic (2026). Tài liệu và bảng giá API Claude (truy cập tháng 6/2026).',
]));

// ---------- Appendix A ----------
add(H1('Phụ lục A. Phân bổ chức năng theo nền tảng'));
add(T(['Chức năng', 'Web', 'Mobile', 'Extension'], [
  ['Hồ sơ, tài khoản', 'Đầy đủ', 'Xem, sửa cơ bản', 'Đăng nhập'],
  ['Đồng bộ cổng đào tạo, thư viện số', 'Xem kết quả, sửa tay', 'Xem kết quả', 'Thực hiện đọc và nhập'],
  ['Kho học liệu', 'Tải lên, quản lý, sửa bản đồ kiến thức', 'Xem', 'Nhập từ thư viện số'],
  ['Lộ trình và bài học', 'Đầy đủ', 'Kế hoạch hôm nay, đọc bài học ngắn', 'Không'],
  ['Trợ giảng AI', 'Chat đầy đủ có trích dẫn', 'Chat nhanh', 'Thanh bên có ngữ cảnh trang, bôi đen để hỏi'],
  ['Quiz, flashcard', 'Đầy đủ', 'Đầy đủ, kênh chính cho ôn tập', 'Quiz nhanh sau đọc (mở rộng)'],
  ['Dashboard tiến độ', 'Đầy đủ', 'Rút gọn', 'Ghi nhận thời gian đọc'],
  ['Thông báo', 'Có', 'Kênh chính (đẩy)', 'Có'],
  ['Quyền riêng tư', 'Xem, tải, xóa dữ liệu', 'Tạm dừng, xóa', 'Đồng ý, tạm dừng, danh sách trang'],
  ['Quản trị', 'Đầy đủ', 'Không', 'Không'],
], [2800, 2200, 2000, 2071]));
add(AFTER_T());

// ---------- Appendix B ----------
add(H1('Phụ lục B. Khuôn prompt sinh bài học (rút gọn)'));
add(P('Khuôn dưới đây cho thấy ba phần được ghép thế nào: quy tắc cố định, đoạn nguồn, và bản mô tả người học. Phần quy tắc và đoạn nguồn đặt trước để dùng được bộ nhớ đệm prompt; phần người học đặt sau vì thay đổi theo từng bài. Tôi để nó trong phụ lục vì nó là chi tiết cài đặt, và chi tiết cài đặt thì nên nằm sau lập luận, không nằm trước.'));
add(CODE([
  '[QUY TẮC]',
  'Bạn soạn một bài học ngắn cho một sinh viên đại học, về đúng một khái niệm.',
  'Chỉ dùng thông tin trong [ĐOẠN NGUỒN]. Mỗi khẳng định chính phải ghi mã đoạn, ví dụ [D3].',
  'Nếu cần nói điều không có trong đoạn nguồn, mở đầu câu đó bằng "Ngoài tài liệu:".',
  'Điều chỉnh theo [NGƯỜI HỌC]: mức hiện tại, lỗi cũ, kiểu giải thích hiệu quả, thời lượng.',
  'Trả về JSON đúng khuôn [ĐẦU RA]. Không thêm lời dẫn.',
  '',
  '[ĐOẠN NGUỒN]',
  '[D1] (trang 41) Một lược đồ quan hệ ở dạng chuẩn 3 nếu ... ',
  '[D2] (trang 42) Phụ thuộc bắc cầu là ... ',
  '[D3] (trang 43) Ví dụ: bảng SinhVien(MaSV, MaLop, TenGVCN) ... ',
  '',
  '[NGƯỜI HỌC]',
  '{ "khai_niem": "Dạng chuẩn 3NF", "muc_hien_tai": 35,',
  '  "tien_quyet_yeu": ["Phụ thuộc hàm"],',
  '  "loi_cu": ["Nhầm phụ thuộc bắc cầu với phụ thuộc hàm đầy đủ (2 lần)"],',
  '  "giai_thich_hieu_qua": "ví dụ bảng dữ liệu thật",',
  '  "nganh": "Công nghệ thông tin", "ngay_toi_ky_thi": 5,',
  '  "thoi_luong_phut": 20 }',
  '',
  '[ĐẦU RA]',
  '{ "muc_tieu": "...", "on_tien_quyet": "...", "giai_thich": "...",',
  '  "vi_du": "...", "loi_ban_tung_mac": "...",',
  '  "cau_kiem_tra": [ { "hoi": "...", "lua_chon": [...], "dap_an": 0, "giai_thich": "...", "nguon": ["D1"] } ],',
  '  "nguon_da_dung": ["D1", "D2", "D3"] }',
]));
add(SP());
add(P('Sau khi nhận đầu ra, bước kiểm tra bám nguồn xác nhận mọi mã đoạn trong "nguon_da_dung" tồn tại, mỗi câu kiểm tra có ít nhất một nguồn, và trường "loi_ban_tung_mac" không rỗng khi hồ sơ có lỗi cũ. Không đạt thì sinh lại một lần rồi ghi lỗi, không giao cho sinh viên thứ chưa qua kiểm.'));

// =====================================================================
// DOCUMENT
// =====================================================================
const doc = new Document({
  creator: 'Sinh viên UTT',
  title: 'Đề xuất dự án: Hệ thống hỗ trợ học tập cá nhân hóa bằng AI',
  features: { updateFields: true },
  styles: {
    default: { document: { run: { font: FONT, size: BODY } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 32, bold: true, font: FONT, color: '1F3864' }, paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 28, bold: true, font: FONT, color: '2F5496' }, paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 1 } },
      { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 26, bold: true, italics: true, font: FONT, color: '2F5496' }, paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 2 } },
    ],
  },
  numbering: {
    config: [
      { reference: 'bullets', levels: [
        { level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
      ] },
      { reference: 'numbers', levels: [
        { level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
      ] },
    ],
  },
  sections: [{
    properties: {
      page: { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 1701, right: 1134 } },
    },
    footers: {
      default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 22 })] })] }),
    },
    children: [...toc, ...body],
  }],
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync('proposal.docx', buf);
  console.log('written proposal.docx', buf.length);
});


