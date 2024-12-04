import './login.css'
import {Link,useNavigate} from 'react-router-dom'
import {useDispatch} from 'react-redux'
import axios from '../../axios'
import { useState } from 'react'
import { loginStart,loginFailure, loginSuccess } from '../../redux/userSlice'


export default function Login({open}) { 
  const [value,setValue]=useState({
    email:"",
    password:""
  })
  const handleInput=(e)=>{
    setValue(prev=>({...prev,[e.target.name]:e.target.value}))
  }
  const dispatch=useDispatch()
  const navigate=useNavigate()
  const handleLogin=async(e)=>{
    dispatch(loginStart())
    try {
      const res=await axios.post('/user/signin',value)
      dispatch(loginSuccess(res.data))
      navigate('/')
      alert("success")
      
    } catch (err) {
      dispatch(loginFailure(err))
      alert("failure")
    }
  }
  const google=async(e)=>{
    try {
      await window.open("http://localhost:5000/auth/google", "_self")

    } catch (err) {
      alert('failure')
    }
  }
  const github=async(e)=>{
    try {
      await window.open("http://localhost:5000/auth/github", "_self")

    } catch (err) {
      alert('failure')
    }
  }


  return (
      <div className={`${!open?"d-flex login_left":"login_right"} flex-column w-50 h-75 align-items-center justify-content-evenly`} style={{backgroundColor:"rgba(0,0,0,0.5)"}}>
        <h1 className='text-success'>LOGIN NOW</h1>
        <div className='w-75 border border-secondary d-flex flex-row justify-content-around bg-white'>
          <input type="email" placeholder="Enter your E-mail" onChange={handleInput} name='email' className="w-75" style={{outline:"none",border:"none"}} required/>
          <i className="fa fa-envelope align-self-center"/>
        </div>
        <div className='w-75 border border-secondary d-flex flex-row justify-content-around bg-white'>
          <input type="password" placeholder="Enter Password" onChange={handleInput} name='password' className="w-75" style={{outline:"none",border:"none"}} required/>
          <i className="fa fa-unlock-alt align-self-center"/>
        </div>
        <div className="w-75 d-flex flex-row justify-content-between" style={{height:"32px"}}>
          <div className="h-100 w-50 d-flex">
              <input type="checkbox" className='form-check-input'/>
              <p className='flex-grow-1 px-1 text-white'>Remember Me</p>
          </div>
          <Link href="" className='text-white'><p>Forgot Password?</p></Link>
        </div>
        <button className='btn btn-primary w-75 py-1' style={{height:"32px"}} onClick={handleLogin}>Sign In</button>
        <div className="d-flex w-75 justify-content-center" style={{height:"32px"}}>
          <div className='h-100 border border-3 border-white border-dark d-flex justify-content-center mx-2' style={{width:"32px",cursor:"pointer"}}><i className="fa fa-facebook text-white align-self-center"></i></div>
          <div className='h-100 border border-3 border-white border-dark d-flex justify-content-center mx-2' style={{width:"32px",cursor:"pointer"}} onClick={()=>github()}><i className="fa fa-github text-white align-self-center"></i></div>
          <div className='h-100 border border-3 border-white border-dark d-flex justify-content-center mx-2' style={{width:"32px",cursor:"pointer"}} onClick={()=>google()}><i className="fa fa-google text-white align-self-center"></i></div>
        </div>
      </div>
  )
}
