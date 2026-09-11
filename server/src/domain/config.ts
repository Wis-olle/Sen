// Mọi hệ số của ba thuật toán thuần nằm ở đây (02-ke-hoach-demo.md §5). Đổi số, không đổi mã.
export const CONFIG = {
  weakThreshold: 60,
  // Khởi tạo từ bài chẩn đoán: bằng chứng kiểu Beta, tiên nghiệm a0/(a0+b0) ≈ 33
  init: {
    stability: 30, // ngày; điểm còn 37% sau chừng đó ngày không ôn (suy giảm exp(-days/stability))
    priorA: 1,
    priorB: 1.8, // tiên nghiệm ≈ 36/100: chưa biết gì thì coi là yếu
    difficultyWeight: { 1: 1, 2: 1.3, 3: 2.2 } as Record<number, number>,
    prereqEvidence: 0.5, // đúng câu về khái niệm con → cộng nửa bằng chứng cho tiên quyết trực tiếp
    repeatWrongFactor: 2, // sai liên tiếp về cùng khái niệm → bằng chứng sai nhân đôi
    prereqCap: 20, // điểm khái niệm ≤ điểm tiên quyết thấp nhất + 20
  },
  // Cập nhật sau mỗi câu kiểm tra (mục 7.6 proposal)
  update: {
    gain: 0.25,
    loss: 0.2,
    repeatWrongFactor: 2,
    difficultyFactor: { 1: 0.8, 2: 1, 3: 1.2 } as Record<number, number>,
    staleBoostDays: 30, // lâu chưa ôn mà đúng → thưởng thêm, tối đa gấp đôi sau 30 ngày
    stabilityUp: 1.3,
    stabilityDown: 0.8,
    stabilityMin: 3,
    stabilityMax: 60,
    deactivateAfterCorrect: 3,
  },
  planner: {
    lessonThreshold: 40, // dưới mức này ("Yếu") mới cần một buổi học trọn; 40–59 ("Cần ôn") chỉ xếp buổi ôn
    wExam: 30, // w1 / daysToExam
    wMastery: 1, // w2 * (100 - mastery) / 100
    wDependents: 0.5, // w3 * số khái niệm phụ thuộc / tổng
    horizonDays: 14, // khi chưa có ngày thi
    maxReviewsPerConcept: 1,
  },
  ai: {
    dailyBudgetUsd: 5,
    groundingRetries: 1,
    lessonWordsPerMinuteMin: 10,
    lessonWordsPerMinuteMax: 120,
  },
};
