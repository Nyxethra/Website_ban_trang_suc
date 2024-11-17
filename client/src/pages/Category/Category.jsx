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
            const res=await axios.get(`/product/category/${categoryId}?min=${min}&max=${max}&sort=${sort}&page=${page}&limit=${limit}`)
            setData(res.data)
            setCount(res.data.length)
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
        } catch (err) {
          console.log(err)
        }
      }
      getCategory()
    },[])
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
            <div className=''>
                <span className='fs-5 '><a className="text-decoration-none mx-1 text-dark" href="/">Trang chủ</a></span>
            </div>
            <div>
                <span className='mx-1'>Hiển thị 1-{count} trong số {countAll} sản phẩm</span>
                <select name="" id="" onChange={e=>setSort(e.target.value)}>
                    <option value="">Tùy chọn</option>
                    <option value="">Thứ tự theo mức độ phổ biến</option>
                    <option value="asc">Thứ tự theo giá: thấp đến cao</option>
                    <option value="desc">Thứ tự theo giá: cao xuống thấp</option>
                    <option value="new">Mới nhất</option>
                    <option value="">Theo bảng chữ cái A-Z</option>
                    <option value="">Theo bảng chữ cái Z-A</option>
                </select>
            </div>
        </div>
      </div>
      <div className='container my-2'>
        <div className='row'>
            <div className="col-2 d-flex flex-column">
                <div className='w-100 h-auto border border-1 bg-light p-1'>
                    <div className='fw-bold' style={{color:"#ff8c00"}}>Danh mục sản phẩm</div>
                    <ul className='list-unstyled mt-3' style={{fontSize:"14px"}}>
                        {category?.map(c=>(
                            <li key={c._id} className='py-1'><a href={`/product/category/${c?._id}`} className='text-decoration-none'><input type="radio" checked={categoryId === c._id}/> {c?.name}</a></li>
                        ))}
                    </ul>
                </div>
                <div className='w-100 h-auto border border-1 bg-light p-1 my-2'>
                    <div className='fw-bold' style={{color:"#ff8c00"}}>Lọc theo giá</div>
                    <ul className='list-unstyled mt-3' style={{fontSize:"12px"}}>
                        <li className='pb-3'><a href={`/product/category/${categoryId}?max=3000000`} className='text-decoration-none'><input type="checkbox" checked={max == 3000000}/> Dưới 3,000,000 đ</a></li>
                        <li className='pb-3'><a href={`/product/category/${categoryId}?min=3000000&max=5000000`} className='text-decoration-none'><input type="checkbox" checked={max == 5000000}/> 3,000,000 - 5,000,000 đ</a></li>
                        <li className='pb-3'><a href={`/product/category/${categoryId}?min=5000000&max=10000000`} className='text-decoration-none'><input type="checkbox" checked={max == 10000000}/> 5,000,000 - 10,000,000 đ</a></li>
                        <li className='pb-3'><a href={`/product/category/${categoryId}?min=10000000&max=15000000`} className='text-decoration-none'><input type="checkbox" checked={max == 15000000}/> 10,000,000 - 15,000,000 đ</a></li>
                        <li className='pb-3'><a href={`/product/category/${categoryId}?min=15000000&max=20000000`} className='text-decoration-none'><input type="checkbox" checked={max == 20000000}/> 15,000,000 - 20,000,000 đ</a></li>
                        <li className='pb-3'><a href={`/product/category/${categoryId}?min=20000000`} className='text-decoration-none'><input type="checkbox" checked={min == 20000000}/> Trên 20,000,000 đ</a></li>
                    </ul>
                </div>
            </div>
            <div className="col-10 bg-light">
            <div className='w-100' style={{boxSizing:"border-box"}}>
              <div className='container'>
                  <div className='row row-cols-5'>
                    <ListItem data={data} getCart={getCart}/>
                  </div>
                </div>
               </div>
                <div className='container my-2 d-flex justify-content-center align-items-center' style={{height:"50px"}}>
                        <a href={`/product/category/${categoryId}?min=${min}&max=${max}&page=${page-1}&limit=${limit}`} className={`border border-2 border-danger text-danger fw-bold fs-5 rounded-circle d-flex justify-content-center align-items-center text-decoration-none ${page>1 ? "" : "visually-hidden"}`} style={{width:"40px",height:"40px"}}><i className='fa fa-angle-left'></i></a>
                        <a href={`/product/category/${categoryId}?min=${min}&max=${max}&page=${page+1}&limit=${limit}`} className={`mx-2 border border-2 border-danger text-danger fw-bold fs-5 rounded-circle d-flex justify-content-center align-items-center text-decoration-none ${page<limit ? "" : "visually-hidden"}`} style={{width:"40px",height:"40px"}}><i className='fa fa-angle-right'></i></a>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}
