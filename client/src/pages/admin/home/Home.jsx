import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Dashboard from '../dashboard/Dashboard';
import Product from '../product/Product';
import User from '../user/User';
import Category from '../category/Category';
import Order from '../order/Order';

export default function Home() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    setShowUserMenu(false);
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
    setShowNotifications(false);
  };

  const isActive = (path) => {
    return location.pathname === path ? 'menu-item active' : 'menu-item';
  };

  return (
    <div className='w-100'>
      <div className='row h-100'>
        <div className='col-3 admin-sidebar'>
          <div className='sidebar-header'>
            <a href='/'>QUẢN TRỊ VIÊN</a>
          </div>
          
          <div className='sidebar-menu'>
            <a href="/admin" className={isActive('/admin')}>
              <i className='fa fa-dashboard'></i>
              <span>Trang Chủ</span>
            </a>
            
            <a href="/admin/user" className={isActive('/admin/user')}>
              <i className='fa fa-user'></i>
              <span>Người Dùng</span>
            </a>
            
            <a href="/admin/product" className={isActive('/admin/product')}>
              <i className='fa fa-tags'></i>
              <span>Sản Phẩm</span>
            </a>
            
            <a href="/admin/category" className={isActive('/admin/category')}>
              <i className='fa fa-list'></i>
              <span>Danh Mục</span>
            </a>
            
            <a href="/admin/order" className={isActive('/admin/order')}>
              <i className='fa fa-shopping-cart'></i>
              <span>Đơn Hàng</span>
            </a>
          </div>
        </div>

        <div className='col-9'>
          <div className='admin-header d-flex justify-content-between align-items-center'>
            <div className='search-wrapper'>
              <input 
                type="text"
                className='admin-search'
                placeholder='Tìm kiếm...'
              />
              <button className='search-btn'>
                <i className='fa fa-search'></i>
              </button>
            </div>

            <div className='user-controls'>
              <div className='notification-badge' onClick={toggleNotifications}>
                <i className='fa fa-bell'></i>
                <span className='badge'>1</span>
                
                <div className={`dropdown-menu ${showNotifications ? 'show' : ''}`}>
                  <div className='dropdown-item'>
                    <i className='fa fa-shopping-cart'></i>
                    <div>
                      <div>Đơn hàng mới #1234</div>
                      <small className='text-muted'>2 phút trước</small>
                    </div>
                  </div>
                  <div className='dropdown-divider'></div>
                  <div className='dropdown-item'>
                    <i className='fa fa-user'></i>
                    <div>
                      <div>Người dùng mới đăng ký</div>
                      <small className='text-muted'>1 giờ trước</small>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className='user-dropdown' onClick={toggleUserMenu}>
                <i className='fa fa-user'></i>
                
                <div className={`dropdown-menu ${showUserMenu ? 'show' : ''}`}>
                  <div className='dropdown-item'>
                    <i className='fa fa-user-circle'></i>
                    <span>Thông tin tài khoản</span>
                  </div>
                  <div className='dropdown-item'>
                    <i className='fa fa-cog'></i>
                    <span>Cài đặt</span>
                  </div>
                  <div className='dropdown-divider'></div>
                  <div className='dropdown-item'>
                    <i className='fa fa-sign-out'></i>
                    <span>Đăng xuất</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='p-4'>
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
  );
}
