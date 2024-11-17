import React, { useRef, useState } from 'react'
import axios from '../../axios'
import { useSelector,useDispatch } from 'react-redux'
import {loginSuccess } from '../../redux/userSlice'

export default function ChangePass() {
    const {currentUser}=useSelector(state=>state.user)
    const createPassword=useRef()
    const email=useRef()
    const dispatch=useDispatch()
    const [value,setValue]=useState({
        oldPassword:"",
        newPassword1:"",
        password:""
    })
    const handleInput=(event)=>{
        setValue((prev)=>({...prev,[event.target.name]:event.target.value}))
    }

    const handleClick=async(e)=>{
        e.preventDefault()
        try {
            const res=await axios.put(`/user/update/password/${currentUser._id}`,value)
            dispatch(loginSuccess(res.data))
            alert("success")
        } catch (err) {
            alert("failure")
        }
    }
    const handleCreate=async(e)=>{
      e.preventDefault()
      try {
        const res=await axios.put(`/user/update/${currentUser._id}`,{
          email:email.current.value,
          password:createPassword.current.value
        })
        dispatch(loginSuccess(res.data))
        alert("success")
      } catch (err) {
        alert("failure")
      }
    }

  return (
    <div className='container'>
      {currentUser.password 
      ? (
        <>
        <h5>Thay đổi mật khẩu !</h5>
        <div className='row'>
          <div className="col-4 d-flex flex-column">
              <label htmlFor="oldPass" className='fs-5'>* Mật khẩu cũ:</label>
              <label htmlFor="newPass" className='fs-5'>* Mật khẩu mới:</label>
              <label htmlFor="pass" className='fs-5'>* Nhập lại mật khẩu mới:</label>
          </div>
          <div className="col-8 d-flex flex-column">
              <input type="text" name="oldPassword" onChange={handleInput} id="oldPass" className='w-50'/>
              <input type="text" name="newPassword1" onChange={handleInput} id="newPass" className='w-50'/>
              <input type="text" name="password" onChange={handleInput} id="pass" className='w-50'/>
          </div>
        </div>
        <div className='border bg-light fs-5 text-center py-1 mt-4 mx-5 ' style={{width:"100px",cursor:"pointer"}} onClick={handleClick}>Xác nhận</div>
        </>
        )
      : (
      <>
        <h5>Bạn cần tạo mật khẩu cho tài khoản !</h5>
        <div className='row'>
          <div className="col-4 d-flex flex-column">
              <label htmlFor="Email" className='fs-5'>* Email:</label>
              <label htmlFor="password" className='fs-5'>* Mật khẩu :</label>
          </div>
          <div className="col-8 d-flex flex-column">
              <input type="text" name="email" ref={email} disabled value={currentUser.email} id="Email" className='w-50'/>
              <input type="password" name="createPassword" ref={createPassword} id="password" className='w-50'/>
          </div>
        </div>
        <div className='border bg-light fs-5 text-center py-1 mt-4 mx-5 ' style={{width:"200px",cursor:"pointer"}} onClick={handleCreate}>Tạo mật khẩu</div>
        </>
        )
    }
    </div>
  )
}
