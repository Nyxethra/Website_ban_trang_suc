import React, { useEffect, useState } from 'react'
import axios from '../../axios'
import {Route, Routes, useLocation, useNavigate} from 'react-router-dom'
import ListItem from '../../components/listItem/ListItem'


export default function Search({getCart}) {
  const [data, setData] = useState([])
  const [count, setCount] = useState(0)
  const [min, setMin] = useState(0)
  const [max, setMax] = useState(100000000)
  const [sort, setSort] = useState("")
  const [limit, setLimit] = useState(10)
  const [page, setPage] = useState(1)
  const location = useLocation()
  const q = new URLSearchParams(location.search).get('q')

  // Thêm useEffect để lấy params từ URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const minParam = params.get('min');
    if(minParam) setMin(Number(minParam));
    const maxParam = params.get('max');
    if(maxParam) setMax(Number(maxParam));
    const pageParam = params.get('page');
    if(pageParam) setPage(Number(pageParam));
    const limitParam = params.get('limit');
    if(limitParam) setLimit(Number(limitParam));
  }, [location.search]);

  const getData = async() => {
    try {
      const res = await axios.get(`/product/search?q=${q}&page=${page}&limit=${limit}&min=${min}&max=${max}&sort=${sort}`)
      setData(res.data.data)
      setCount(res.data.count)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getData()
  }, [q, min, max, sort, page, limit])

  return (
    <div className='w-100 h-auto'>
      <div className='w-100 bg-light' style={{height:"40px"}}>
        <div className='container d-flex justify-content-between align-items-center p-2'>
          <div className='breadcrumb mb-0'>
            <span className='fs-6'>
              <a className="text-decoration-none" style={{color:"#b8860b"}} href="/">Trang chủ</a>
              <span className="mx-2" style={{color:"#b8860b"}}>/</span>
              <span style={{color:"#b8860b"}}>Kết quả tìm kiếm cho "{q}"</span>
            </span>
          </div>
        </div>
      </div>

      <div className='container'>
        {count > 0 ? (
          <>
            <div className="filter-container">
              <div className="filter-group">
                <label className="filter-label">Lọc theo giá:</label>
                <select 
                  className="filter-select"
                  value={max}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "all") {
                      setMin(0);
                      setMax(100000000);
                    } else {
                      const [minVal, maxVal] = value.split("-");
                      setMin(Number(minVal));
                      setMax(maxVal ? Number(maxVal) : 100000000);
                    }
                  }}
                >
                  <option value="all">Tất cả giá</option>
                  <option value="0-3000000">Dưới 3,000,000 đ</option>
                  <option value="3000000-5000000">3,000,000 đ - 5,000,000 đ</option>
                  <option value="5000000-10000000">5,000,000 đ - 10,000,000 đ</option>
                  <option value="10000000-15000000">10,000,000 đ - 15,000,000 đ</option>
                  <option value="15000000-20000000">15,000,000 đ - 20,000,000 đ</option>
                  <option value="20000000">Trên 20,000,000 đ</option>
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">Sắp xếp:</label>
                <select 
                  className="filter-select"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  <option value="">Tùy chọn</option>
                  <option value="popular">Thứ tự theo mức độ phổ biến</option>
                  <option value="asc">Thứ tự theo giá: thấp đến cao</option>
                  <option value="desc">Thứ tự theo giá: cao xuống thấp</option>
                  <option value="new">Mới nhất</option>
                  <option value="az">Theo bảng chữ cái A-Z</option>
                  <option value="za">Theo bảng chữ cái Z-A</option>
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">Hiển thị:</label>
                <select 
                  className="filter-select"
                  value={limit}
                  onChange={(e) => setLimit(Number(e.target.value))}
                >
                  <option value="10">10 sản phẩm</option>
                  <option value="20">20 sản phẩm</option>
                  <option value="30">30 sản phẩm</option>
                  <option value="40">40 sản phẩm</option>
                </select>
              </div>
            </div>

            <div className='w-100' style={{boxSizing:"border-box"}}>
              <div className='container p-0'>
                <div className='row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4'>
                  <ListItem data={data} getCart={getCart}/>
                </div>
              </div>
            </div>

            <div className="pagination-container">
              <button 
                onClick={() => setPage(1)}
                disabled={page === 1}
                className="pagination-button"
                title="Trang đầu"
              >
                <i className="fa fa-angle-double-left"></i>
              </button>
              
              <button 
                onClick={() => setPage(prev => Math.max(1, prev - 1))}
                disabled={page === 1}
                className="pagination-button"
                title="Trang trước"
              >
                <i className="fa fa-angle-left"></i>
              </button>

              {Array.from({ length: Math.min(5, Math.ceil(count / limit)) }, (_, i) => {
                const pageNumber = i + 1;
                return (
                  <button
                    key={pageNumber}
                    onClick={() => setPage(pageNumber)}
                    className={`pagination-button ${page === pageNumber ? 'active' : ''}`}
                    style={page === pageNumber ? {
                      backgroundColor: '#b8860b',
                      color: 'white'
                    } : {}}
                  >
                    {pageNumber}
                  </button>
                );
              })}
              
              {Math.ceil(count / limit) > 5 && <span className="pagination-dots">...</span>}

              <button 
                onClick={() => setPage(prev => prev + 1)}
                disabled={page * limit >= count}
                className="pagination-button"
                title="Trang sau"
              >
                <i className="fa fa-angle-right"></i>
              </button>

              <button 
                onClick={() => setPage(Math.ceil(count / limit))}
                disabled={page * limit >= count}
                className="pagination-button"
                title="Trang cuối"
              >
                <i className="fa fa-angle-double-right"></i>
              </button>
            </div>
          </>
        ) : (
          <div className="no-results-container text-center py-5">
            <div className="no-results-icon mb-4">
              <i className="fa fa-search" style={{
                fontSize: '48px',
                color: '#ddd'
              }}></i>
            </div>
            <h3 className="mb-3" style={{color: '#666'}}>
              Không tìm thấy kết quả nào
            </h3>
            <p className="text-muted mb-4">
              Không tìm thấy sản phẩm nào phù hợp với từ khóa "{q}"
            </p>
            <div className="suggestions">
              <p className="mb-2">Bạn có thể thử:</p>
              <ul className="list-unstyled">
                <li>• Kiểm tra lỗi chính tả</li>
                <li>• Sử dụng các từ khóa khác</li>
                <li>• Sử dụng từ khóa ngắn gọn hơn</li>
              </ul>
            </div>
            <a href="/" className="btn mt-4" style={{
              backgroundColor: '#b8860b',
              color: 'white',
              padding: '10px 30px',
              borderRadius: '4px',
              textDecoration: 'none'
            }}>
              Quay lại trang chủ
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
