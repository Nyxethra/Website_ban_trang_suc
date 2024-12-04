import React, { useEffect, useState } from 'react'
import axios from '../../axios'
import {Route, Routes, useLocation, useNavigate} from 'react-router-dom'
import ListItem from '../../components/listItem/ListItem'
import './Search.css'

export default function Search({getCart}) {
    const [category,setCategory]=useState()
    const [count,setCount]=useState(0)
    const [categoryId,setCategoryId]=useState("")
    const [min,setMin]=useState(0)
    const [max,setMax]=useState(100000000)
    const [q,setQ]=useState("")
    const [sort,setSort]=useState("")
    const [limit, setLimit] = useState(10)
    const [page, setPage] = useState(1)
    const navigation=useNavigate()
    const [data,setData]=useState([])
    const [filteredData, setFilteredData] = useState([]);
    const location=useLocation()
    const id=location.pathname.split("/")[3]
    useEffect(() => {
      const params = new URLSearchParams(window.location.search);
      const q = params.get('q');
      if(q){
        setQ(q)
      }
      const min = params.get('min');
      if(min){
        setMin(min)
      }
      const max = params.get('max');
      if(max){
        setMax(max)
      }
      if (id !== "") {
          setCategoryId(id);
      }
  }, [id]);
    const getData=async()=>{
        try {
              const res=await axios.get(`/product?q=${q}&min=${min}&max=${max}`)
              const products = res.data;
              setData(products);
              applyFilters(products);
          } catch (err) {
            console.log(err)
          }
    }
    const applyFilters = (products) => {
        let filtered = [...products];

        // Lọc theo giá
        filtered = filtered.filter(product => 
            product.price >= min && product.price <= max
        );

        // Sắp xếp
        if (sort) {
            switch(sort) {
                case 'popular':
                    // Thêm logic sắp xếp theo độ phổ biến 
                    break;
                case 'asc':
                    filtered.sort((a, b) => a.price - b.price);
                    break;
                case 'desc':
                    filtered.sort((a, b) => b.price - a.price);
                    break;
                case 'new':
                    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    break;
                default:
                    break;
            }
        }

        // Phân trang
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedData = filtered.slice(startIndex, endIndex);

        setFilteredData(paginatedData);
        setCount(filtered.length);
    }
    useEffect(()=>{
        getData()
    },[q])
    useEffect(()=>{
      const getCategory=async()=>{
        try {
          const res=await axios.get('/category')
          setCategory(res.data)
        } catch (err) {
          console.log(err)
        }
      }
      getCategory()
    },[])
    useEffect(() => {
        if (data.length > 0) {
            applyFilters(data);
        }
    }, [min, max, sort, page, limit]);

  return (
    <div className='w-100 h-auto'>
      <div className='w-100 bg-light' style={{height:"40px"}}>
        <div className='container d-flex justify-content-between align-items-center p-2'>
            <div className='breadcrumb mb-0'>
                <span className='fs-6'>
                    <a className="text-decoration-none" style={{color:"#b8860b"}} href="/">Trang chủ</a>
                    <span className="mx-2" style={{color:"#b8860b"}}>/</span>
                    <span style={{color:"#b8860b"}}>Kết quả tìm kiếm cho: "{q}"</span>
                </span>
            </div>
            <div>
                <span className='mx-1' style={{fontSize: '14px', color: '#666'}}>
                    Hiển thị {count > 0 ? `${(page-1)*limit + 1}-${Math.min(page*limit, count)}` : '0'} trong số {count} sản phẩm
                </span>
            </div>
        </div>
      </div>

      <div className='container'>
          <div className="filter-container my-3">
              <div className="filter-group">
                  <label className="filter-label">Lọc theo giá:</label>
                  <select 
                      className="filter-select"
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
                  </select>
              </div>

              <div className="filter-group">
                  <label className="filter-label">Hiển thị:</label>
                  <select 
                      className="filter-select"
                      value={limit}
                      onChange={(e) => {
                          setLimit(Number(e.target.value));
                          setPage(1);
                      }}
                  >
                      <option value="10">Hiển thị 10 sản phẩm</option>
                      <option value="20">Hiển thị 20 sản phẩm</option>
                      <option value="30">Hiển thị 30 sản phẩm</option>
                      <option value="40">Hiển thị 40 sản phẩm</option>
                  </select>
              </div>
          </div>

          {filteredData && filteredData.length > 0 ? (
              <div className='w-100' style={{boxSizing:"border-box"}}>
                  <div className='container p-0'>
                      <div className='row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4'>
                          <ListItem data={filteredData} getCart={getCart}/>
                      </div>
                  </div>
              </div>
          ) : (
              <div className="no-results-container text-center py-5">
                  <i className="fa fa-search no-results-icon mb-3" style={{fontSize: '48px', color: '#b8860b'}}></i>
                  <h4>Không tìm thấy kết quả nào</h4>
                  <p className="text-muted">Không tìm thấy sản phẩm nào phù hợp với từ khóa "{q}"</p>
                  <div className="suggestions">
                      <p>Bạn có thể thử:</p>
                      <ul>
                          <li>Kiểm tra lỗi chính tả</li>
                          <li>Sử dụng các từ khóa khác</li>
                          <li>Sử dụng từ khóa ngắn gọn hơn</li>
                      </ul>
                  </div>
                  <a href="/" className="btn btn-custom mt-3">Quay lại trang chủ</a>
              </div>
          )}

          {filteredData && filteredData.length > 0 && (
              <div className="pagination-container my-4">
                  <button 
                      onClick={() => setPage(1)}
                      disabled={page === 1}
                      className="pagination-button"
                      title="Trang đầu"
                  >
                      <i className="fa fa-angle-double-left"></i>
                  </button>

                  <button 
                      onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                      disabled={page === 1}
                      className="pagination-button"
                      title="Trang trước"
                  >
                      <i className="fa fa-angle-left"></i>
                  </button>

                  {Array.from({ length: Math.ceil(count / limit) }, (_, i) => i + 1)
                      .filter(pageNum => {
                          if (pageNum === 1 || pageNum === Math.ceil(count / limit)) return true;
                          return Math.abs(pageNum - page) <= 2;
                      })
                      .map((pageNum, index, array) => {
                          if (index > 0 && array[index - 1] !== pageNum - 1) {
                              return [
                                  <span key={`ellipsis-${pageNum}`} className="pagination-ellipsis">...</span>,
                                  <button
                                      key={pageNum}
                                      onClick={() => setPage(pageNum)}
                                      className={`pagination-button ${page === pageNum ? 'active' : ''}`}
                                  >
                                      {pageNum}
                                  </button>
                              ];
                          }
                          return (
                              <button
                                  key={pageNum}
                                  onClick={() => setPage(pageNum)}
                                  className={`pagination-button ${page === pageNum ? 'active' : ''}`}
                              >
                                  {pageNum}
                              </button>
                          );
                      })}

                  <button 
                      onClick={() => setPage(prev => Math.min(prev + 1, Math.ceil(count / limit)))}
                      disabled={page === Math.ceil(count / limit)}
                      className="pagination-button"
                      title="Trang sau"
                  >
                      <i className="fa fa-angle-right"></i>
                  </button>

                  <button 
                      onClick={() => setPage(Math.ceil(count / limit))}
                      disabled={page === Math.ceil(count / limit)}
                      className="pagination-button"
                      title="Trang cuối"
                  >
                      <i className="fa fa-angle-double-right"></i>
                  </button>
              </div>
          )}
      </div>
    </div>
  )
}
