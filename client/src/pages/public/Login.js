import React, { useState, useCallback } from "react";
import { InputField, Button } from "../../components";
import { apiLogin, apiRegister, apiForgotPassword } from "../../apis/user";
import Swal from "sweetalert2"
import path from "../../ultils/path";
import { useNavigate } from "react-router-dom";
import { register } from "../../store/user/userSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";


const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [payload, setPayload] = useState({
    email: "",
    password: "",
    firstname: "",
    lastname: "",
    mobile: ""
  })
  // kiểm tra có phải chức năng quên mk ko
  const [isForgotPassWord, setisForgotPassWord] = useState(false);
  // kiểm tra có phải chức năng đăg ký ko
  const [isRegister, setIsRegister] = useState(false)
  const resetPayload = () => {
    setPayload({
      email: "",
      password: "",
      firstname: "",
      lastname: "",
      mobile: ""
    })
  }
  const [email, setEmail] = useState('');
  // xử lí khi nhấp vào nút gửi email đi trong mục quên mật khẩu
  const handleForgotPassword = async () => {
    const response = await apiForgotPassword({ email });
    // console.log(response)
    if (response.success) {
      setisForgotPassWord(false);
      toast.success(response.mes)
    } else {
      toast.error(response.mes)
    }
  }
  // dùng useCallBack để truyền hàm này đi component khác mà không làm re render lại
  const handleSubmit = useCallback(async () => {
    const { firstname, lastname, mobile, ...data } = payload
    if (isRegister) {
      const response = await apiRegister(payload)
      if (response.success) {
        Swal.fire("Congratulation", response.mes, "success").then(() => {
          setIsRegister(false)
          resetPayload()
        })
      } else Swal.fire("Oops!", response.mes, "error")
    } else {
      const rs = await apiLogin(data)
      if (rs.success) {
        dispatch(register({ isLoggedIn: true, token: rs.accessToken, userData: rs.userData }));
        navigate(`/${path.HOME}`)
      } else Swal.fire("Oops!", rs.mes, "error")
    }
  }, [payload, isRegister])
  return (
    <div className="w-screen h-screen relative">
      {isForgotPassWord && <div className='absolute animate-slide-right top-0 left-0 bottom-0 right-0 bg-white flex flex-col items-center py-8 z-50'>
        <div className='flex flex-col gap-4'>
          <label htmlFor='email'>Enter your email:</label>
          <input type='text' id='email'
            className='w-[800px] pb-2 border-b outline-none placeholder:text-sm'
            placeholder='email@gmail.com'
            value={email}
            // sử dụng state để lưu lại email 
            onChange={e => setEmail(e.target.value)}
          />
          <div className='flex items-center justify-end gap-4'>
            <Button
              name='Submit'
              handleOnClick={handleForgotPassword}
              style='px-4 py-2 rounded-md text-white bg-blue-500 font-semibold my-2'
            />
            <Button
              name='Cancel'
              handleOnClick={() => setisForgotPassWord(false)}
            />
          </div>
        </div>
      </div>}
      <img
        src="https://raw.githubusercontent.com/DucNT17/E-commerce/refs/heads/main/frontend/src/assets/background.jpg"
        alt=""
        className="w-full h-full object-cover"
      />
      <div className="absolute top-0 bottom-0 left-0 right-1/2 items-center justify-center flex">
        <div className="p-8 bg-white flex flex-col items-center rounded-md min-w-[500px] ">
          <h1 className="text-[28px] font-semibold text-main mb-8">{isRegister ? 'Register' : 'Login'}</h1>
          {isRegister &&
            <div className="flex items-center gap-2">
              <InputField value={payload.firstname} setValue={setPayload} nameKey="firstname" />
              <InputField value={payload.lastname} setValue={setPayload} nameKey="lastname" />
            </div>}
          <InputField value={payload.email} setValue={setPayload} nameKey="email" />
          {isRegister && <InputField value={payload.mobile} setValue={setPayload} nameKey="mobile" />}
          <InputField value={payload.password} setValue={setPayload} nameKey="password" type="password" />
          <Button name={isRegister ? 'Register' : 'Login'} handleOnClick={handleSubmit} fw />
          <div className='w-full flex items-center justify-between my-2 text-sm'>
            {!isRegister && <span onClick={() => setisForgotPassWord(true)} className='text-blue-500 hover:underline cursor-pointer'  >Forgot your account?</span>}
            {!isRegister && <span className='text-blue-500 hover:underline cursor-pointer'
              onClick={() => setIsRegister(true)}
            >Create account</span>}
            {isRegister && <span className='text-blue-500 hover:underline cursor-pointer w-full text-center'
              onClick={() => setIsRegister(false)}
            >Go login</span>}
          </div>
        </div>
      </div>
    </div >);
};

export default Login;
