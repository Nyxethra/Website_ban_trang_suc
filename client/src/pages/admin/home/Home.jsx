import React from 'react'
import {Routes,Route} from 'react-router-dom'
import Dashboard from '../dashboard/Dashboard'
import Product from '../product/Product'
import User from '../user/User'
import Category from '../category/Category'
import Order from '../order/Order'



export default function Home() {
  return (
    <div className='w-100 bg-light' style={{minHeight:"100vh"}}>
      <div className=' row h-100 w-100' style={{minHeight:"100vh"}}>
        <div className='col-3' style={{boxShadow:"0 16px 38px -12px rgba(0,0,0,.56), 0 4px 25px 0 rgba(0,0,0,.12), 0 8px 10px -5px rgba(0,0,0,.2)",zIndex:"1"}}>
            <div className='container py-2'>
                <div className='border-bottom text-center py-3'>
                    <a href='/' className='text-decoration-none text-black'>QUẢN TRỊ VIÊN</a>
                </div>
                <ul className='list-unstyled py-2'>
                    <li className='d-flex align-items-center fs-5 p-2'>
                        <a href="/admin" className='d-block text-decoration-none w-100'>
                            <i className='fa fa-dashboard' style={{marginRight:"15px",width:"30px"}}></i>
                            Trang Chủ
                        </a>
                    </li>
                    <li className='d-flex align-items-center fs-5 p-2'>
                        <a href="/admin/user" className='d-block text-decoration-none w-100'>
                            <i className='fa fa-user' style={{marginRight:"15px",width:"30px"}}></i>
                            Người Dùng
                        </a>
                    </li>
                    <li className='d-flex align-items-center fs-5 p-2'>
                        <a href="/admin/product" className='d-block text-decoration-none w-100'>
                            <i className='fa fa-tags' style={{marginRight:"15px",width:"30px"}}></i>
                            Sản Phẩm
                        </a>
                    </li>
                    <li className='d-flex align-items-center fs-5 p-2'>
                        <a href="/admin/category" className='d-block text-decoration-none w-100'>
                            <i className='fa fa-tags' style={{marginRight:"15px",width:"30px"}}></i>
                            Danh Mục
                        </a>
                    </li>
                    <li className='d-flex align-items-center fs-5 p-2'>
                        <a href="/admin/order" className='d-block text-decoration-none w-100'>
                            <i className='fa fa-truck' style={{marginRight:"15px",width:"30px"}}></i>
                            Đơn Hàng
                        </a>
                    </li>
                </ul>
            </div>
        </div>
        <div className='col-9'>
            <div className='container'>
                <div className='w-100 d-flex justify-content-between pt-4 border-bottom' style={{height:"70px"}}>
                    <p className='w-50'>Trang quản trị</p>
                    <div className='d-flex align-items-center w-50'>
                        <div className='position-relative h-75 d-flex align-items-center ' style={{width:"200px"}}>
                            <input type="text" placeholder='Tìm kiếm...' className='bg-light w-75 h-100 border-bottom' style={{border:"none",outline:"none"}}/>
                            <button className='position-absolute rounded-circle border-0 bg-white' style={{zIndex:"1",width:"40px",height:"40px",right:"0",boxShadow:"0 4px 20px 0 rgba(0,0,0,.14), 0 7px 10px -5px rgba(255,152,0,.4)"}}><i className='fa fa-search'></i></button>
                        </div>
                        <div className='mx-5 position-relative p-1 dropdown'>
                            <i className='fa fa-bell fs-5' type="button" id="dropdownMenu2" data-bs-toggle="dropdown" aria-expanded="false"></i>
                            <span className='position-absolute border-1 rounded-circle d-flex justify-content-center align-items-center top-0 text-white' style={{height:"17px",width:"17px",background:"red",right:"0",fontSize:"12px"}}>1</span>
                            <ul class="dropdown-menu" aria-labelledby="dropdownMenu2">
                                <li><a href='' class="dropdown-item" type="button">Thông Báo 1</a></li>
                                <li><a href='' class="dropdown-item" type="button">Thông Báo 2</a></li>
                                <li><a href='' class="dropdown-item" type="button">Xem Tất Cả</a></li>
                            </ul>
                        </div>
                        <div className='dropdown '>
                            <i type="button" className='fa fa-user fs-5' data-bs-toggle="dropdown" aria-expanded="false"></i>
                            <ul className='dropdown-menu'>
                                <li><a href="" class="dropdown-item">Hồ Sơ</a></li>
                                <li><a href="" class="dropdown-item border-bottom">Cài Đặt</a></li>
                                <li><a href="" class="dropdown-item">Đăng Xuất</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className='w-100'>
                    <Routes>
                        <Route index element={<Dashboard/>}/>
                        <Route path='/product' element={<Product/>}/>
                        <Route path='/user' element={<User/>}/>
                        <Route path='/category' element={<Category/>}/>
                        <Route path='/order' element={<Order/>}/>
                    </Routes>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}
