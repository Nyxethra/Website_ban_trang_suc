import React from 'react'

export default function Exp() {
  const reviews = [
    {
      name: "Nguyenquoctien",
      service: "Nhẫn kim cương",
      review: "Nhẫn kim cương tuyệt đẹp, giá cả hợp lý và dịch vụ rất tốt!",
    },
    {
      name: "Lê Thị Lành",
      service: "Dây chuyền vàng",
      review: "Dây chuyền vàng tinh xảo, tôi rất hài lòng với chất lượng sản phẩm.",
    },
    {
      name: "Nguyễn Dũng",
      service: "Bông tai bạc",
      review: "Bông tai bạc rất đẹp, dịch vụ chăm sóc khách hàng chu đáo.",
    },
    {
      name: "Trần Đỗ Đức Nghĩa",
      service: "Lắc tay ngọc trai",
      review: "Lắc tay ngọc trai sang trọng, tôi sẽ quay lại mua thêm sản phẩm khác.",
    },
  ];

  return (
    <div className='my-3 w-100 h-100'>
      <h2 className='text-center text-uppercase text-dark'>Đánh giá của khách hàng</h2>
      <p className='text-center text-muted'>Được tin tưởng bởi hơn 10.000 khách hàng!</p>
      <div className='row'>
        {reviews.map((review, index) => (
          <div key={index} className='col-lg-3 col-md-4 col-sm-6 mb-4'>
            <div className='card border-0 shadow h-100'>
              <div className='card-body'>
                <div className='d-flex align-items-center mb-3'>
                  <img
                    src='https://via.placeholder.com/50'
                    alt='avatar'
                    className='rounded-circle me-3'
                  />
                  <div>
                    <h5 className='card-title mb-0'>{review.name}</h5>
                    <p className='card-subtitle text-muted'>{review.service}</p>
                  </div>
                </div>
                <div className='d-flex align-items-center mb-2'>
                  <span className='badge bg-success me-2'>Đã sử dụng dịch vụ</span>
                  <div className='text-warning'>
                    <i className='fa fa-star'></i>
                    <i className='fa fa-star'></i>
                    <i className='fa fa-star'></i>
                    <i className='fa fa-star'></i>
                    <i className='fa fa-star'></i>
                  </div>
                </div>
                <p className='card-text'>{review.review}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
