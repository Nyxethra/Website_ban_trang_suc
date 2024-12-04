import React, { useEffect,useState } from 'react'
import ListCart from '../../components/listCart/ListCart'
import axios from '../../axios'
import numeral from 'numeral'

export default function Cart({getCart,data,total}) {
  useEffect(()=>{
    getCart()
  },[total])
  return (
    <div className='container' style={{minHeight:"300px"}}>
      <div className="row">
        <div className="col-7 mb-5">
          <div className='px-2'>
          <table class="table">
            <thead>
              <tr style={{borderBottom:"3px solid #ececec",lineHeight:"1.9",fontWeight:"700"}}>
                <th scope="col">Sản phẩm</th>
                <th></th>
                <th scope="col">Giá</th>
                <th scope="col">Số lượng</th>
                <th scope="col">Tạm tính</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data?.data?.length>0 
              ? data?.data?.map((item,index)=>(
                <ListCart item={item} key={index} getCart={getCart} total={total}/>
              ))
            : <tr>
              <th className='text-#b8860b text-center'>Giỏ hàng trống</th>
            </tr>
            }
            </tbody>
          </table>
          <div className='w-100'>
            <a href='/' className='d-flex align-items-center text-decoration-none border border-2 border-#b8860b rounded-3 justify-content-center text-uppercase fw-bold text-#b8860b' style={{width:"40%", height:"35px",cursor:"pointer"}}>
              <i className="fa fa-long-arrow-left"></i>
              <span>Tiếm tục xem sản phẩm</span>
            </a>
          </div>
          </div>
        </div>
        
        <div className="col-5">
          <div className='px-2'>
            <h4 style={{borderBottom:"3px solid #ececec",lineHeight:"1.9",textTransform:"uppercase",fontWeight:"700"}}>Cộng giỏ hàng</h4>
            <div className='w-100 d-flex justify-content-between py-2' style={{borderBottom:"1px solid #ececec",lineHeight:"1.9"}}>
              <h6>Tạm tính</h6>
              <h6 className='text-#b8860b'>{numeral(total).format('0,0')} đ</h6>
            </div>
            <div className='w-100 d-flex justify-content-between py-2' style={{borderBottom:"3px solid #ececec",lineHeight:"1.9"}}>
              <h6>Tổng</h6>
              <h6 className='text-#b8860b'>{numeral(total).format('0,0')} đ</h6>
            </div>
            {data?.data?.length>0 &&
            <a href='/cart/checkout' className='text-decoration-none text-uppercase fw-bold text-white w-100 bg-info mt-3 rounded-3 d-flex justify-content-center align-items-center' style={{height:"40px",cursor:"pointer"}}>Tiến hành thanh toán</a>
            }
            </div>
        </div>
      </div>
    </div>
  )
}
