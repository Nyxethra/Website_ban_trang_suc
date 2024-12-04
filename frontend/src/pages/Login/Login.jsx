import Login from '../../components/login/Login'
import Register from '../../components/register/Register'

import React, { useState } from 'react'

export default function SignIn() {
  const [open,setOpen]=useState(false)
  const handleNext=()=>{
    setOpen(!open)
  }
  return (
    <div className=" d-flex flex-column align-items-center justify-content-center" style={{width:"100%",height:"600px",backgroundImage:'url("/assets/bg/bg-1.png")',fontFamily: 'Comic Sans MS'}}>
      <Login open={open}/>
      <Register open={open}/>
      <div onClick={handleNext} className='border border-3 border-white rounded-circle d-flex justify-content-center align-items-center' style={{width:"32px",height:"32px",cursor:"pointer"}}><i className={`fa fa-long-arrow-${open ? "left":"right"} text-white`}></i></div>
    </div>
  )
}
