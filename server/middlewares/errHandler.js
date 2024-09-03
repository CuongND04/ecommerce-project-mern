// lỗi không tìm thấy trang
const notFound = (req, res, next) => {
  const error = new Error(`Route ${req.originalUrl} not found!`);
  res.status(404);
  next(error);
};
// tham số next không dùng nhưng phải để nó mới chạy
const errHandler = (error, req, res, next) => {
  // 200 là trạng thái thành công, 500 là lỗi server
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  return res.status(statusCode).json({
    success: false,
    mes: error?.message,
  });
};

module.exports = {
  notFound,
  errHandler,
};
