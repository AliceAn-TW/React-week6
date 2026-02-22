export const emailValidation = {
  required: "請輸入 Email",
  pattern: {
    value: /^\S+@\S+$/i,
    message: "Email 格式不正確",
  },
};

export const passwordValidation = {
  required: "請輸入密碼",
  minLength: {
    value: 8,
    message: "密碼長度至少需 8 碼",
  },
  pattern: {
    // 至少一個字母 + 至少一個數字，長度 >= 8
    value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
    message: "密碼需包含字母與數字",
  },
};

// 結帳
export const nameValidation = {
  required: "請輸入姓名",
  minLength: {
    value: 2,
    message: "姓名最少 2 個字",
  },
};

export const telValidation = {
  required: "請輸入電話",
  minLength: {
    value: 8,
    message: "電話最少 8 個字",
  },
  pattern: {
    value: /^\d+$/,
    message: "電話僅可輸入數字",
  },
};

export const addressValidation = {
  required: "請輸入收件地址",
};
