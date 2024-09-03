const User = require("../models/user.model");
const asyncHandler = require("express-async-handler");
const sendMail = require("../utils/sendMail");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../middlewares/jwt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const register = asyncHandler(async (req, res) => {
  const { email, password, firstname, lastname } = req.body;
  // check input
  if (!email || !password || !lastname || !firstname)
    return res.status(400).json({
      success: false,
      mes: "Missing inputs",
    });
  // check exist email
  const user = await User.findOne({ email });
  if (user) {
    throw new Error("User has existed");
  } else {
    const newUser = await User.create(req.body);
    return res.status(200).json({
      success: newUser ? true : false,
      mes: newUser
        ? "Register successfully. Please go login"
        : "Something went wrong",
    });
  }
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({
      success: false,
      mes: "Missing inputs",
    });
  const response = await User.findOne({ email });
  // instance mà trả về từ hàm của mongo có thể dùng được các method trong model
  if (response && (await response.isCorrectPassword(password))) {
    // Tách password và role ra khỏi response
    // cái response trả về không phải plain object
    const { password, role, ...userData } = response.toObject();
    // Tạo access token
    const accessToken = generateAccessToken(response._id, role);
    // Tạo refresh token
    const refreshToken = generateRefreshToken(response._id);
    // Lưu refresh token vào database
    await User.findByIdAndUpdate(response._id, { refreshToken }, { new: true });
    // Lưu refresh token vào cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
      success: true,
      userData: userData,
      accessToken,
    });
  } else {
    throw new Error("Invalid credentials!");
  }
});
// lấy ra thông tin user hiện tại
const getCurrent = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const user = await User.findById(_id).select("-refreshToken -password -role");
  return res.status(200).json({
    success: false,
    rs: user ? user : "User not found",
  });
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  // Lấy token từ cookies
  const cookie = req.cookies;
  // Check xem có token hay không
  if (!cookie && !cookie.refreshToken)
    throw new Error("No refresh token in cookies");
  // Check token có hợp lệ hay không
  await jwt.verify(
    cookie.refreshToken,
    process.env.JWT_SECRET,
    async (err, decode) => {
      if (err) throw new Error("Refresh token expired");
      // check xem token có giúp trong db không
      const response = await User.findOne({
        _id: decode._id,
        refreshToken: cookie.refreshToken,
      });
      return res.status(200).json({
        success: response ? true : false,
        newAccessToken: response
          ? generateAccessToken(response._id, response.role)
          : "Refresh token not matched",
      });
    }
  );
});

const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie || !cookie.refreshToken)
    throw new Error("No refresh token in cookies");
  // Xóa refresh token ở db
  await User.findOneAndUpdate(
    { refreshToken: cookie.refreshToken },
    { refreshToken: "" },
    { new: true }
  );
  // Xóa refresh token ở cookie trình duyệt
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  return res.status(200).json({
    success: true,
    mes: "Logout is done",
  });
});

// Client gửi email
// Server check email có hợp lệ hay không => Gửi mail + kèm theo link (password change token)
// Client check mail => click link
// Client gửi api kèm token
// Check token có giống với token mà server gửi mail hay không
// Change password

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.query;
  if (!email) throw new Error("Missing email");
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");
  const resetToken = user.createPasswordChangedToken();
  // cần phải save thì nó mới lưu 2 field mình tạo trong method
  await user.save();

  const html = `Xin vui lòng click vào link dưới đây để thay đổi mật khẩu của bạn.Link này sẽ hết hạn sau 15 phút kể từ bây giờ. 
    <a href=${process.env.URL_SERVER}/api/user/reset-password/${resetToken}>Click here</a>`;
  const data = {
    email,
    html,
    subject: "Forgot Password",
  };
  const rs = await sendMail(data);
  return res.status(200).json({
    success: true,
    rs,
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { password, token } = req.body;
  if (!password || !token) throw new Error("Missing inputs");
  const passwordResetToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) throw new Error("Invalid reset token");
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordChangedAt = Date.now();
  user.passwordResetExpires = undefined;
  await user.save();
  return res.status(200).json({
    success: user ? true : false,
    mes: user ? "Updated password. Please go login" : "Something went wrong",
  });
});
module.exports = {
  register,
  login,
  getCurrent,
  refreshAccessToken,
  logout,
  forgotPassword,
  resetPassword,
};
