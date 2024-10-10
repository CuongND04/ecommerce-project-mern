import axios from "../axios";

export const apiRegister = (data) => axios({
  url: '/user/register',
  method: 'POST',
  data,
  //  thêm để nó lưu token vào cookie trình duyệt
  withCredentials: true
})

export const apiLogin = (data) => axios({
  url: '/user/login',
  method: 'POST',
  data
})
export const apiForgotPassword = (data) => axios({
  url: '/user/forgotpassword',
  method: 'POST',
  data
})
export const apiResetPassword = (data) => axios({
  url: '/user/resetpassword',
  method: 'PUT',
  data
})