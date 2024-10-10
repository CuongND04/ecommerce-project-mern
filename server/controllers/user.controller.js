const User = require("../models/user.model");
const asyncHandler = require("express-async-handler");
const sendMail = require("../utils/sendMail");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../middlewares/jwt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
// hàm tạo ra token bằng thư viện uniquid
const makeToken = require("uniqid")



const register = asyncHandler(async (req, res) => {
  // kiểm tra đầu vào xem có thiếu trường nào ko
  const { email, password, firstname, lastname, mobile } = req.body;
  if (!email || !password || !lastname || !firstname || !mobile) {
    return res.status(400).json({
      success: false,
      mes: 'Missing inputs'
    })
  }
  // kiểm tra xem email đã tồn tại chưa
  const user = await User.findOne({ email });
  if (user) {
    throw new Error('User has existed');
  } else {
    // tạo token thông qua thu viện
    const token = makeToken();
    // lưu dữ liệu bước đầu đăng ký vào trong cookie
    res.cookie('dataregister', { ...req.body, token }, { httpOnly: true, maxAge: 15 * 60 * 1000 });
    // nếu nó bấm vào link URL_SERVER nó sẽ chạy đến final register
    const html = `Xin vui lòng click vào link dưới đây để hoàn tất quá trình đăng ký. Link này sẽ hết hạn sau 15 phút kể từ bây giờ. 
    <a href=${process.env.URL_SERVER}/api/user/finalregister/${token}>Click here</a>`
    // gửi email đến người dùng
    await sendMail({ email, html, subject: 'Hoàn tất đăng ký Digital World' })
    return res.json({
      success: true,
      mes: "Please check your email to active account"
    })
  }
})

// bước cuối này kiểm tra token được gửi đến qua link trong email có giống 
// với token lưu trong cookie không
const finalRegister = asyncHandler(async (req, res) => {
  // lấy cookie
  const cookie = req.cookies;
  // lấy token trong router được gửi lên
  const { token } = req.params;
  // nếu không có cookie hoặc token trong email không giống
  if (!cookie || cookie?.dataregister?.token !== token) {
    // dù đúng hay sai thì vẫn phải xóa thằng cookie đi, vì nó là otp
    res.clearCookie('dataregister');

    return res.redirect(`${process.env.CLIENT_URL}/finalregister/failed`);
  }
  // tạo user mới
  const newUser = await User.create({
    email: cookie?.dataregister?.email,
    password: cookie?.dataregister?.password,
    mobile: cookie?.dataregister?.mobile,
    firstname: cookie?.dataregister?.firstname,
    lastname: cookie?.dataregister?.lastname
  });
  res.clearCookie('dataregister')
  if (newUser) {
    return res.redirect(`${process.env.CLIENT_URL}/finalregister/success`);
  } else {
    return res.redirect(`${process.env.CLIENT_URL}/finalregister/failed`)
  }
})
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
    const { password, role, refreshToken, ...userData } = response.toObject();
    // Tạo access token
    const accessToken = generateAccessToken(response._id, role);
    // Tạo refresh token
    const newRefreshToken = generateRefreshToken(response._id);
    // Lưu refresh token vào database
    await User.findByIdAndUpdate(
      response._id,
      { refreshToken: newRefreshToken },
      { new: true }
    );
    // Lưu refresh token vào cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
      success: true,
      accessToken,
      userData: userData,
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
    success: user ? true : false,
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
  const { email } = req.body;
  if (!email) throw new Error("Missing email");
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");
  const resetToken = user.createPasswordChangedToken();
  // cần phải save thì nó mới lưu 2 field mình tạo trong method
  await user.save();

  const html = `Xin vui lòng click vào link dưới đây để thay đổi mật khẩu của bạn.Link này sẽ hết hạn sau 15 phút kể từ bây giờ. 
    <a href=${process.env.CLIENT_URL}/reset-password/${resetToken}>Click here</a>`;
  const data = {
    email,
    html,
    subject: "Forgot Password",
  };
  const rs = await sendMail(data);
  return res.status(200).json({
    success: rs.response?.includes('OK') ? true : false,
    mes: rs.response?.includes('OK') ? 'Check your email address' : 'Something went wrong, please try again'
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

// Xem danh sách người dùng
const getUsers = asyncHandler(async (req, res) => {
  const response = await User.find().select("-refreshToken -password -role");
  return res.status(200).json({
    success: response ? true : false,
    users: response,
  });
});

// Xóa user
const deleteUser = asyncHandler(async (req, res) => {
  console.log(req.query);
  const { _id } = req.query;
  if (!_id) throw new Error("Missing inputs");
  const response = await User.findByIdAndDelete(_id);
  return res.status(200).json({
    success: response ? true : false,
    mes: response
      ? `User with email ${response.email} deleted`
      : "No user delete",
  });
});

// chỉnh sửa thông tin user đang login
const updateUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  if (Object.keys(req.body).length === 0 || !_id)
    throw new Error("Missing inputs");
  const response = await User.findByIdAndUpdate(_id, req.body, {
    new: true,
  }).select("-password -role -refreshToken");
  return res.status(200).json({
    success: response ? true : false,
    updatedUser: response ? response : "Cannot update user",
  });
});

// Cập nhật thông tin user
const updateUserByAdmin = asyncHandler(async (req, res) => {
  const { uid } = req.params;
  if (Object.keys(req.body).length === 0) throw new Error("Missing inputs");
  const response = await User.findByIdAndUpdate(uid, req.body, {
    new: true,
  }).select("-password -role -refreshToken");
  return res.status(200).json({
    success: response ? true : false,
    mes: response,
  });
});

const updateUserAddress = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  if (!req.body.address) throw new Error("Missing inputs");
  const response = await User.findByIdAndUpdate(
    _id,
    { $push: { address: req?.body?.address } },
    { new: true }
  ).select("-password -role -refreshToken");
  return res.status(200).json({
    success: response ? true : false,
    updatedUser: response ? response : "Cannot update address",
  });
});

const updateCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { pid, quantity, color } = req.body;
  if (!pid || !quantity || !color) throw new Error("Missing inputs");
  const user = await User.findById(_id).select("cart");
  const alreadyProduct = user?.cart.find((el) => el.product.toString() === pid);
  if (alreadyProduct) {
    if (alreadyProduct.color === color) {
      console.log("1");
      // trường hợp thay đổi mỗi số lượng
      const response = await User.updateOne(
        { cart: { $elemMatch: alreadyProduct } },
        {
          $set: {
            "cart.$.quantity": quantity,
          },
        },
        { new: true }
      );
      return res.status(200).json({
        success: response ? true : false,
        updatedUser: response ? response : "Something went wrong",
      });
    } else {
      console.log("2");

      // trường hợp thay đổi màu sắc
      const response = await User.findByIdAndUpdate(
        _id,
        { $push: { cart: { product: pid, quantity, color } } },
        { new: true }
      );
      return res.status(200).json({
        success: response ? true : false,
        updatedUser: response ? response : "Something went wrong",
      });
    }
  } else {
    console.log("3");

    const response = await User.findByIdAndUpdate(
      _id,
      { $push: { cart: { product: pid, quantity, color } } },
      { new: true }
    );
    return res.status(200).json({
      success: response ? true : false,
      updatedUser: response ? response : "Something went wrong",
    });
  }
});

module.exports = {
  register,
  login,
  getCurrent,
  refreshAccessToken,
  logout,
  forgotPassword,
  resetPassword,
  getUsers,
  deleteUser,
  updateUser,
  updateUserByAdmin,
  updateUserAddress,
  updateCart,
  finalRegister
};
