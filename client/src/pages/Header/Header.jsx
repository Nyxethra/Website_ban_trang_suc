import React, { useState,useEffect } from 'react'
import axios from '../../axios'
import { useSelector } from 'react-redux';
import numeral from 'numeral';

export default function Header({count,total,data}) {
  const {currentUser}=useSelector(state=>state.user)
  const [searchInput,setSearchInput]=useState("")
  const [isHovered, setIsHover] = useState(false);
  const handleMouseEnter = () => {
      setIsHover(true);
    };
    const handleMouseLeave = () => {
      setIsHover(false);
    }
    
  return (
    <div>
      <div className='container d-flex py-4' style={{height:"100px"}}>
        <div className='row w-100 h-100'>
            <div className='col-3 h-100'>
                <a href="/"><img src="/assets/bg/logo.png" alt="" className='img-fluid h-100 w-100'/></a>
            </div>
            <div className='col-5 d-flex py-2 h-100'>
                <input type="text" placeholder='Bạn tìm gì...' onChange={e=>setSearchInput(e.target.value)} className='form-control border border-2 border-danger'/>
                <a href={`/product/search?q=${searchInput}`} className='btn btn-danger'><i className='fa fa-search text-white fs-4'></i></a>
            </div>
            <div className='col-4 d-flex flex-row h-100 justify-content-between'>
                <div className='d-flex h-100 align-items-center py-2'>
                    <i className='fa fa-user fs-2 mx-2'></i>
                    <div className='d-flex flex-column justify-content-center'>
                        <a href="/profile" style={{textDecoration:"none"}}><span className='fw-bold text-dark' style={{fontSize:"14px"}}>Tài khoản</span></a>
                        {!currentUser
                        ? (<span style={{fontSize:"12px"}}> <a href="/login" className='text-dark' style={{textDecoration:"none"}}>Đăng ký</a>/<a href="/login" className='text-dark' style={{textDecoration:"none"}}>Đăng nhập</a></span>)
                        : (<span style={{fontSize:"12px"}}>Hi: {currentUser.name}</span>)
                        }
                    </div>
                </div>
                <div className='d-flex h-100 align-items-center py-2'>
                <div className='mx-3 position-relative' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                    <a href="/cart" className='text-dark'><i className='fa fa-shopping-cart fs-2'></i></a>
                    <span className='border rounded-circle bg-warning position-absolute translate-middle d-flex justify-content-center align-items-center' style={{fontSize:"16px",height:"20px",width:"20px",top:"5px",right:"-20px"}}>{count}</span>
                    <div className={`position-absolute  bg-light rounded-2 p-2 shadow-lg border ${isHovered ? "d-block":"d-none"}`} style={{width:"300px",left:"-200%"}}>
                      {data?.data?.map((item,index)=>(
                          <div className='w-100 d-flex border-bottom' key={index}>
                                <div className='w-25'>
                                    <img src={item?.product[0]?.image} alt="" className='img-fluid'/>
                                </div>
                                <div className='w-75 text-danger d-flex flex-column'>
                                    <span className='' style={{fontSize:"12px"}}>{item?.product[0]?.name} x{item.quantity}</span>
                                    <span className='fw-bold'>{numeral(item?.product[0]?.price).format('0,0')} đ</span>
                                </div>
                            </div>
                          ))  
                            }
                        
                        <div className='border-bottom fs-5 text-center py-2'>Tổng: {numeral(total).format('0,0')} đ</div>
                        <div className='container my-2 d-flex flex-column '>
                            <a href="/cart" className='text-decoration-none text-white bg-danger rounded-3 py-1 fw-bold text-center mb-1'>Xem Giỏ Hàng</a>
                            <a href="" className='text-decoration-none text-white bg-danger rounded-3 py-1 fw-bold text-center mb-1'>Thanh Toán</a>
                        </div>
                    </div>
                </div>
                    <div className='h-100 d-flex flex-column justify-content-center'>
                        <a href="/cart" style={{textDecoration:"none"}}><span className='fw-bold text-dark' style={{fontSize:"14px"}}>Giỏ hàng</span></a>
                        <a href="#" style={{textDecoration:"none"}}><span className='text-dark' style={{fontSize:"12px"}}>Vận chuyển toàn quốc</span></a>
                    </div>
                </div>
            </div>
        </div>
        </div>
        <div className='container-fluid text-white' style={{height:"50px",backgroundColor:"red"}}>
     <div className='container d-flex h-100'>
        <div className='d-flex w-25 h-100 py-2'>
            <i className=' fa fa-bars mx-2 align-self-center fs-4'/>
            <h2 className='fs-6 align-self-center my-1'>Danh mục sản phẩm</h2>
        </div>
        <div className='w-75 h-100 d-flex py-2'>
            <ul className='d-flex list-unstyled py-1'>
                <li className='px-2'><a href="" className='text-white' style={{textDecoration:"none"}}>Về chúng tôi</a></li>
                <li className='px-2'><a href="" className='text-white' style={{textDecoration:"none"}}>Khuyễn mại</a></li>
                <li className='px-2'><a href="" className='text-white' style={{textDecoration:"none"}}>Tin tức</a></li>
            </ul>
        </div>
     </div>
    </div>
    </div>
  )
}
