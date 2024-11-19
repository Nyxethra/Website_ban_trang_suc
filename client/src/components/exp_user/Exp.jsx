import React from 'react'

export default function Exp() {
  const reviews = [
    {
      name: 'Nguyễn Quốc Tiến',
      role: 'Khách hàng thân thiết',
      review: 'Nhẫn kim cương tuyệt đẹp, giá cả hợp lý và dịch vụ tư vấn rất tốt!'
    },
    {
      name: 'Lê Thị Linh',
      role: 'Khách hàng mới',
      review: 'Dây chuyền vàng tinh xảo, tôi rất hài lòng với chất lượng sản phẩm'
    },
    {
      name: 'Nguyễn Dũng',
      role: 'Khách hàng VIP',
      review: 'Bông tai rất đẹp, dịch vụ chăm sóc khách hàng tuyệt vời'
    },
    {
      name: 'Trần Đỗ Đức Nghĩa',
      role: 'Khách hàng thường xuyên',
      review: 'Lắc tay ngọc trai sáng bóng, tôi rất quý shop'
    }
  ]

  return (
    <div className='my-5'>
      <div className='text-center position-relative mb-4'>
        <h4 className='section-title d-inline-block m-0 position-relative'>
          Đánh giá của khách hàng
        </h4>
      </div>
      <p className='text-center text-muted mb-4'>Được tin tưởng bởi hơn 10.000 khách hàng!</p>
      
      <div className='row g-4'>
        {reviews.map((review, index) => (
          <div key={index} className='col-lg-3 col-md-6'>
            <div className='card border-0 h-100 p-3' style={{backgroundColor: '#f8f9fa'}}>
              <div className='d-flex align-items-center mb-3'>
                <div className='me-3'>
                  <div className='rounded-circle d-flex align-items-center justify-content-center' 
                       style={{
                         width: '50px', 
                         height: '50px', 
                         backgroundColor: '#B8860B',
                         color: 'white',
                         fontSize: '20px'
                       }}>
                    {review.name.charAt(0)}
                  </div>
                </div>
                <div>
                  <h6 className='mb-1' style={{color: '#333'}}>{review.name}</h6>
                  <small className='text-muted'>{review.role}</small>
                </div>
              </div>
              
              <div className='mb-3'>
                <div className='text-warning'>
                  ★★★★★
                </div>
              </div>
              
              <p className='card-text text-muted mb-0' style={{fontSize: '0.9rem'}}>
                {review.review}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
