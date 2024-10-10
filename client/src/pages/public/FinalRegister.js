import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import path from '../../ultils/path'
import Swal from 'sweetalert2'
// đây là trang mà người dùng phải thông qua để hoàn tất đăng nhập
const FinalRegister = () => {
  // lấy status từ router gửi lên
  // do đây là ko phải backend nên không lấy ở req được
  const { status } = useParams();
  // sử dụng nó để điều hướng
  const navigate = useNavigate()
  // sử dụng nó để component này chỉ render lại khi navigate và login thay đổi
  useEffect(() => {
    if (status === 'failed') {
      // hiển thị thông báo xong rồi điều hướng
      Swal.fire('Oops', 'Đăng ký không thành công', 'error').then(() => {
        navigate(`/${path.LOGIN}`)
      })
    }
    if (status === 'success') {
      Swal.fire('Congratulations!', 'Đăng ký thành công, hãy đăng nhập', 'success').then(() => {
        navigate(`/${path.LOGIN}`)
      })
    }
  }, [navigate, status])
  return (

    // chỉ là một lớp màn hình trắng
    <div className='h-screen w-screen bg-gray-100'>
    </div>
  )
}
export default FinalRegister