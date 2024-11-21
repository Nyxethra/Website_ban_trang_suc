import React, { useEffect, useState } from 'react'
import axios from '../../axios'
import {Route, Routes, useLocation} from 'react-router-dom'
import ListItem from '../../components/listItem/ListItem'

export default function Category({getCart}) {
    const [category,setCategory]=useState()
    const [count,setCount]=useState(0)
    const [countAll,setCountAll]=useState(0)
    const [categoryId,setCategoryId]=useState(undefined)
    const [min,setMin]=useState(0)
    const [max,setMax]=useState(100000000)
    const [sort,setSort]=useState("")
    const [page,setPage]=useState(1)
    const [limit,setLimit]=useState(10)
    const [data,setData]=useState()
    const location=useLocation()
    const id=location.pathname.split("/")[3]
    const [categoryName, setCategoryName] = useState("");

    useEffect(() => {
      const params = new URLSearchParams(window.location.search);
      const min = params.get('min');
      if(min){
        setMin(min)
      }
      const max = params.get('max');
      if(max){
        setMax(max)
      }
      const page = params.get('page');
      if(page){
        setPage(page)
      }
      const limit = params.get('limit');
      if(limit){
        setLimit(limit)
      }
      if (id !== undefined) {
          setCategoryId(id);
      }
  }, [id]);
    const getData=async()=>{
        try {
            const res=await axios.get(`/product/category/${categoryId}?page=${page}&limit=${limit}&min=${min}&max=${max}&sort=${sort}`)
            setData(res.data)
            setCount(res.data.count)
          } catch (err) {
            console.log(err)
          }
    }
    useEffect(()=>{
        getData()
    },[categoryId,min,max,sort,page,limit])
    useEffect(()=>{
      const getCategory=async()=>{
        try {
          const res=await axios.get('/category')
          setCategory(res.data)
          const currentCategory = res.data.find(cat => cat._id === categoryId);
          if (currentCategory) {
            setCategoryName(currentCategory.name);
          }
        } catch (err) {
          console.log(err)
        }
      }
      getCategory()
    },[categoryId])
    useEffect(()=>{
      const getProduct=async()=>{
        try {
          const res=await axios.get('/product')
          setCountAll(res.data.length)
        } catch (err) {
          console.log(err)
        }
      }
      getProduct()
    },[])

  return (
    <div className='w-100 h-auto'>
      <div className='w-100 bg-light' style={{height:"40px"}}>
        <div className='container d-flex justify-content-between align-items-center p-2'>
            <div className='breadcrumb mb-0'>
                <span className='fs-6'>
                    <a className="text-decoration-none" style={{color:"#b8860b"}} href="/">Trang chủ</a>
                    <span className="mx-2" style={{color:"#b8860b"}}>/</span>
                    <span style={{color:"#b8860b"}}>{categoryName}</span>
                </span>
            </div>
            <div>
                <span className='mx-1' style={{fontSize: '14px', color: '#666'}}>
                    Hiển thị {(page-1)*limit + 1}-{Math.min(page*limit, countAll)} trong số {countAll} sản phẩm
                </span>
            </div>
        </div>
      </div>
      <div className='container'>
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

          {/* Hiển thị số trang */}
          {Array.from({ length: Math.min(5, Math.ceil(countAll / limit)) }, (_, i) => {
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
          
          {Math.ceil(countAll / limit) > 5 && <span className="pagination-dots">...</span>}

          <button 
            onClick={() => setPage(prev => prev + 1)}
            disabled={page * limit >= countAll}
            className="pagination-button"
            title="Trang sau"
          >
            <i className="fa fa-angle-right"></i>
          </button>

          <button 
            onClick={() => setPage(Math.ceil(countAll / limit))}
            disabled={page * limit >= countAll}
            className="pagination-button"
            title="Trang cuối"
          >
            <i className="fa fa-angle-double-right"></i>
          </button>
        </div>
      </div>
    </div>
  )
}
