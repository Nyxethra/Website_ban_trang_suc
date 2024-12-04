import './register.css'
import axios from "../../axios"
import React, { useState } from 'react'

export default function Register({open}) {
  const [value,setValue]=useState()

  const changeInput=(e)=>{
    setValue(prev=>({...prev,[e.target.name]:e.target.value}))
  }
  const handleRegister=async(e)=>{
    e.preventDefault()
    try {
      await axios.post('/user/register',value)
      alert("success")
    } catch (err) {
      alert("failure")
    }
  }

  return (
    // <div className=" d-flex flex-column align-items-center justify-content-center" style={{width:"100%",height:"600px",backgroundImage:'url("/assets/bg/bg-1.png")',fontFamily: 'Comic Sans MS'}}>
      <div className={`${open?"d-flex register_left":"register_right"} flex-column w-50 h-75 align-items-center justify-content-evenly active`} style={{backgroundColor:"rgba(0,0,0,0.5)"}}>
        <h1 className='text-success'>SignUp NOW</h1>
        <div className='w-75 border border-secondary d-flex flex-row justify-content-around bg-white'>
          <input type="text" placeholder="Enter your Name" name='name' onChange={changeInput} className="w-75" style={{outline:"none",border:"none"}} required/>
          <i className="fa fa-user align-self-center"/>
        </div>
        <div className='w-75 border border-secondary d-flex flex-row justify-content-around bg-white'>
          <input type="email" placeholder="Enter your E-mail" name='email' onChange={changeInput} className="w-75" style={{outline:"none",border:"none"}} required/>
          <i className="fa fa-envelope align-self-center"/>
        </div>
        <div className='w-75 border border-secondary d-flex flex-row justify-content-around bg-white'>
          <input type="password" placeholder="Enter Password" name='password' onChange={changeInput} className="w-75" style={{outline:"none",border:"none"}} required/>
          <i className="fa fa-unlock-alt align-self-center"/>
        </div>
        <button className='btn btn-primary w-75 py-1' style={{height:"32px"}} onClick={handleRegister}>Sign Up</button>
      </div>
    // </div>
  )
}
