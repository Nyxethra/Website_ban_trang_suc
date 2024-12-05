// Import các thư viện cần thiết từ React và React Router
import React, { useState } from 'react';                    // Import React và hook useState
import { Routes, Route, useLocation } from 'react-router-dom'; // Import các components từ react-router-dom
import Dashboard from '../dashboard/Dashboard';             // Import component Dashboard
import Product from '../product/Product';                   // Import component Product
import User from '../user/User';                           // Import component User
import Category from '../category/Category';                // Import component Category
import Order from '../order/Order';                        // Import component Order

export default function Home() {
  // Khởi tạo state cho việc hiển thị notifications và user menu
  const [showNotifications, setShowNotifications] = useState(false);  // State quản lý hiển thị thông báo
  const [showUserMenu, setShowUserMenu] = useState(false);           // State quản lý hiển thị menu user
  const location = useLocation();                                    // Hook lấy thông tin về location hiện tại

  // Hàm toggle hiển thị notifications
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);  // Đảo ngược trạng thái hiển thị thông báo
    setShowUserMenu(false);                    // Đóng user menu
  };

  // Hàm toggle hiển thị user menu
  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);            // Đảo ngược trạng thái hiển thị user menu
    setShowNotifications(false);               // Đóng notifications
  };

  // Hàm kiểm tra menu item có đang active hay không
  const isActive = (path) => {
    return location.pathname === path ? 'menu-item active' : 'menu-item';  // Trả về class tương ứng
  };

  return (
    <div className='w-100'>
      <div className='row h-100'>
        {/* Phần sidebar bên trái */}
        <div className='col-3 admin-sidebar'>
          <div className='sidebar-header'>
            <a href='/admin'>QUẢN TRỊ VIÊN</a>
          </div>
          
          {/* Menu điều hướng */}
          <div className='sidebar-menu'>
            {/* Các link điều hướng với class active được xác định động */}
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

        {/* Phần nội dung chính bên phải */}
        <div className='col-9'>
          {/* Header của phần nội dung */}
          <div className='admin-header d-flex justify-content-between align-items-center'>
            {/* Thanh tìm kiếm */}
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

            {/* Phần controls bên phải */}
            <div className='user-controls'>
              {/* Nút thông báo với dropdown */}
              <div className='notification-badge' onClick={toggleNotifications}>
                <i className='fa fa-bell'></i>
                <span className='badge'>1</span>
                
                {/* Dropdown menu thông báo */}
                <div className={`dropdown-menu ${showNotifications ? 'show' : ''}`}>
                  {/* Các mục thông báo */}
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
              
              {/* User dropdown menu */}
              <div className='user-dropdown' onClick={toggleUserMenu}>
                <i className='fa fa-user'></i>
                
                {/* Dropdown menu người dùng */}
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

          {/* Phần nội dung chính */}
          <div className='p-4'>
            {/* Định nghĩa các routes */}
            <Routes>
              <Route index element={<Dashboard/>}/>          {/* Route mặc định */}
              <Route path='/product' element={<Product/>}/> {/* Route sản phẩm */}
              <Route path='/user' element={<User/>}/>       {/* Route người dùng */}
              <Route path='/category' element={<Category/>}/> {/* Route danh mục */}
              <Route path='/order' element={<Order/>}/>     {/* Route đơn hàng */}
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}