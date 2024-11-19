import React, { useRef, useState } from 'react'
import Acount from '../../components/acount/Acount'
import { Routes, Route, useLocation } from 'react-router-dom'
import ChangePass from '../../components/changePass/ChangePass'
import { useDispatch, useSelector } from 'react-redux'
import { logOut } from '../../redux/userSlice'
import './profile.css'
import axios from '../../axios'
import Order from '../../components/order/Order'


export default function Profile() {
    const {currentUser}=useSelector(state=>state.user)
    const dispatch=useDispatch()
    const handleLogout=async()=>{
        try {
            await axios.post('/user/logout')
            dispatch(logOut())
            alert("success")
            
        } catch (err) {
            alert("failure")
        }
    }
  return (
    <div className='container my-2'>
        <div className='w-100 text-center fs-4'>Trang cá nhân</div>
        <div className='row mt-3'>
            <div className="col-3 border border-1 p-0">
                <div className='p-2 d-flex' style={{backgroundColor:"#b8860b"}}>
                    <i className='fa fa-bars text-white fs-4'></i>
                    <span className='px-2 text-white fw-bold'>Quản lý tài khoản</span>
                </div>
                <div className='p-2'>
                    <ul className='list-unstyled profile'>
                        <li><a href="/profile" className='text-decoration-none d-block pb-2' ><i className='fa fa-fw fa-user mx-1'></i>Trang cá nhân</a></li>
                        {currentUser.admin && <li><a href="/admin" className='text-decoration-none d-block pb-2' ><i className='fa fa-fw fa-user mx-1'></i>Admin</a></li>}
                        <li><a href="/profile/changePass" className='text-decoration-none d-block pb-2' ><i className='fa fa-fw fa-wrench mx-1'></i>Thay đổi mật khẩu</a></li>
                        <li><a href="/profile/order" className='text-decoration-none d-block pb-2' ><i className='fa fa-fw fa-envelope mx-1'></i>Quản trị đơn hàng</a></li>
                        <li><a href="#" className='text-decoration-none d-block pb-2' ><i className='fa fa-search mx-2'></i>Tìm kiếm đơn hàng</a></li>
                        <li><a href="#" className='text-decoration-none d-block pb-2' onClick={()=>handleLogout()}><i className='fa fa-sign-out mx-2'></i>Đăng xuất</a></li>

                    </ul>
                </div>
            </div>
            <div className="col-9">
                <Routes>
                    <Route index element={<Acount/>}/>
                    <Route path='changePass' element={<ChangePass/>}/>
                    <Route path='order' element={<Order/>}/>
                </Routes>
            </div>
        </div>
      
    </div>
  )
}
