import React, { useState, useEffect, useRef } from 'react'
import axios from '../../axios'
import { useSelector } from 'react-redux';
import numeral from 'numeral';
import SideBar from '../../components/sidebar/SideBar';

export default function Header({ count, total, data }) {
  const { currentUser } = useSelector(state => state.user)
  const [searchInput, setSearchInput] = useState("")
  const [showCart, setShowCart] = useState(false);
  
  // Thêm ref để xử lý click outside
  const cartRef = useRef(null);

  // Xử lý click outside để đóng dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setShowCart(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="header">
      <div className='container d-flex py-4' style={{ height: "100px" }}>
        <div className='row w-100 h-100'>
          <div className='col-3 h-100'>
            <a href="/"><img src="/assets/bg/logo.png" alt="" className='img-fluid' style={{ objectFit: "contain",maxHeight: "113%",paddingLeft: "68px" }} /></a>
          </div>
          <div className='col-5 d-flex align-items-center'>
            <div className='search-box w-100'>
              <input 
                type="text" 
                placeholder='Bạn tìm gì...' 
                onChange={e=>setSearchInput(e.target.value)} 
                className='search-input'
              />
              <a href={`/product/search?q=${searchInput}`} className='search-button'>
                <i className='fa fa-search'></i>
              </a>
            </div>
          </div>
          <div className='col-4 d-flex flex-row h-100 justify-content-between'>
            <div className='header-account'>
              <a href="/profile" className='d-flex align-items-center text-decoration-none'>
                <i className='fa fa-user'></i>
                <div className='header-account-info'>
                  <span className='header-account-title'>Tài khoản</span>
                  {!currentUser 
                    ? <span className='header-account-subtitle'>
                        <a href="/login">Đăng ký</a>/<a href="/login">Đăng nhập</a>
                      </span>
                    : <span className='header-account-subtitle'>Hi: {currentUser.name}</span>
                  }
                </div>
              </a>
            </div>

            <div className='header-cart position-relative' ref={cartRef} onMouseLeave={() => setShowCart(false)}>
              <div 
                className='d-flex align-items-center' 
                style={{cursor: 'pointer'}}
                onMouseEnter={() => setShowCart(true)}
              >
                <i className='fa fa-shopping-cart'></i>
                <span className='header-cart-count'>{count}</span>
                <div className='header-cart-info'>
                  <span className='header-cart-title'>Giỏ hàng</span>
                  <span className='header-shipping'>Vận chuyển toàn quốc</span>
                </div>
              </div>
              
              {showCart && (
                <div className='cart-dropdown'>
                  {data?.data?.length > 0 ? (
                    <>
                      {data.data.slice(0, 3).map((item) => (
                        <div key={item.cartId} className='cart-item'>
                          <img src={item.product[0].image} alt={item.product[0].name} className='cart-item-image' />
                          <div className='cart-item-info'>
                            <div className='cart-item-name'>{item.product[0].name}</div>
                            <div className='cart-item-price'>
                              {numeral(item.product[0].price).format('0,0')}đ x {item.quantity}
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {data.data.length > 3 && (
                        <div className='text-center my-2'>
                          <small>và {data.data.length - 3} sản phẩm khác</small>
                        </div>
                      )}

                      <div className='cart-total'>
                        <span>Tổng tiền:</span>
                        <span className='text-#b8860b fw-bold'>{numeral(total).format('0,0')}đ</span>
                      </div>

                      <div className='cart-buttons'>
                        <a href='/cart' className='cart-button view-cart-btn'>Xem giỏ hàng</a>
                        <a href='/cart/checkout' className='cart-button checkout-btn'>Thanh toán</a>
                      </div>
                    </>
                  ) : (
                    <div className='empty-cart'>
                      <i className='fa fa-shopping-cart mb-2' style={{fontSize: '2rem', color: '#ddd'}}></i>
                      <p>Chưa có sản phẩm trong giỏ hàng</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className='container-fluid' style={{ borderBottom: "1px solid #e5e5e5" }}>
        <div className='container'>
          <SideBar />
        </div>
      </div>
    </div>
  )
}
