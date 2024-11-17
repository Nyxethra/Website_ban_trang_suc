import React from 'react'

export default function Exp() {
  return (
    <div className='my-3 w-100 h-100'>
    {/* category title */}
    <div className='d-flex justify-content-between border bg-light px-2 py-1'>
      <h3 className='text-danger'>Trải nghiệm người dùng</h3>
      <div className='border border-1 rounded-3 my-1 d-flex align-items-center'>
        <a href="" className='text-decoration-none mx-2 text-danger'>Xem thêm</a>
        <i className='fa fa-angle-right text-danger'></i>
      </div>
    </div>
    {/* category product list */}
    <div className='row m-1 px-1 d-flex justify-content-between'style={{height:"300px"}}>
        <div className="col-6 ">
            <iframe src="https://www.youtube.com/embed/lZMiD4gBC4M?list=PLzIvXH9OQtJMLZqwjqwKeiUtsrbit5O-k" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen frameborder="0" className='w-100 h-100' >
            </iframe>
        </div>
        <div className="col-6">
            <div className='row'>
                <iframe className="col-6" src="https://www.youtube.com/embed/lZMiD4gBC4M?list=PLzIvXH9OQtJMLZqwjqwKeiUtsrbit5O-k" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen frameborder="0" >
                </iframe>
                <iframe className="col-6" src="https://www.youtube.com/embed/JFJWj80aWjk?list=PLzIvXH9OQtJMLZqwjqwKeiUtsrbit5O-k" allowFullScreen frameborder="0">
                </iframe>
                <iframe className="col-6" src="https://www.youtube.com/embed/bUTktW_EwSw" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen frameborder="0" >
                </iframe>
                <iframe className="col-6" src="https://www.youtube.com/embed/RpIkEKDgh2o" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen frameborder="0">
                </iframe>
            </div>
        </div>
    </div>
  </div>
  )
}
