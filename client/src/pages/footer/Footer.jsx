import React, { useEffect, useState ,useRef} from 'react'


export default function Footer() {

  return (
    <div className='mt-0 position-relative'style={{height:"250px",backgroundColor:"#2f2f2f", color:"#b0b0b0"}}>
      <div className='row mx-5'>
        <div className='col-5 my-4 d-flex flex-column'>
          <h6 className='text-white'> MARY JEWELRY FROM Nhom12_trua_t5.VN</h6>
          
          <ul className='my-4 list-unstyled'>
            <li className='text-white'>Địa chỉ: Cộng Hòa, phường 4, quận Tân Bình, thành phố Hồ Chí Minh, Việt Nam</li>
            <li className='text-white'>Email: nhom12@gmail.com</li>
          </ul>
        </div>
        <div className='col-2 my-4 d-flex flex-column'>
        <h6 className='text-white'>CHÍNH SÁCH</h6>
          <ul className='my-4 list-unstyled'>
            <li><a className='list-group-item text-white' href="">Giới thiệu</a></li>
            <li><a className='list-group-item text-white' href="">Tin tức</a></li>
            <li><a className='list-group-item text-white' href="">Tra cứu đơn hàng</a></li>
            <li><a className='list-group-item text-white' href="">Tuyển dụng</a></li>
          </ul>
        </div>
        <div className='col-2 my-4 d-flex flex-column'>
        <h6 className='text-white'>DỊCH VỤ VÀ HỖ TRỢ</h6>
          <ul className='my-4 list-unstyled'>
            <li><a className='list-group-item text-white' href="">Hướng dẫn mua hàng</a></li>
            <li><a className='list-group-item text-white' href="">Giới thiệu công ty</a></li>
            <li><a className='list-group-item text-white' href="">Liên hệ</a></li>
            <li><a className='list-group-item text-white' href="">Tin tức</a></li>
          </ul>
        </div>
        <div className='col-3 my-4 d-flex flex-column'>
          <h6 className='text-white'>MẠNG XÃ HỘI FACEBOOK</h6>
          <div className='my-4 border rounded-circle border-primary d-flex justify-content-center bg-primary' style={{width:"30px",height:"30px",cursor:"pointer"}}>
            <i className='fa fa-facebook text-white align-self-center'/>
          </div>
        </div>
      </div>
      </div>
  )
}
