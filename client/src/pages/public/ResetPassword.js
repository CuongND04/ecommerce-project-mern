import React, { useState } from 'react'
import { Button } from '../../components';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { apiResetPassword } from '../../apis/user';
// khi người dùng bấm vào link trong email gưi khi quên mk
const ResetPassword = () => {
  const [password, setPassword] = useState('');
  // lấy token được gưi thông qua params
  const { token } = useParams();
  const handleResetPassword = async () => {
    // gửi password và token thông qua api
    const response = await apiResetPassword({ password, token });
    if (response.success) {
      toast.success(response.mes)
    } else {
      toast.error(response.mes)
    }
  }
  return (
    <div className='absolute animate-slide-right top-0 left-0 bottom-0 right-0 bg-white flex flex-col items-center py-8 z-50'>
      <div className='flex flex-col gap-4'>
        <label htmlFor='password'>Enter your new password:</label>
        <input type='password' id='password'
          className='w-[800px] pb-2 border-b outline-none placeholder:text-sm'
          placeholder='Type here'
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <div className='flex items-center justify-end gap-4'>
          <Button
            name='Submit'
            // khi bấm submit nó sẽ chạy vào hàm handleResetPassword
            handleOnClick={handleResetPassword}
            style='px-4 py-2 rounded-md text-white bg-blue-500 font-semibold my-2'
          />
        </div>
      </div>
    </div>
  )
}

export default ResetPassword