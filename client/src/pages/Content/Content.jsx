import React, { useEffect, useState } from 'react'
import Hightlight from '../../components/highlight/Hightlight'
import Category from '../../components/category/Category'
import Exp from '../../components/exp_user/Exp'
import Banner from '../../components/banner/Banner'
import SideBar from '../../components/sidebar/SideBar'
import axios from '../../axios'

export default function Content({getCart}) {

  const [data,setData]=useState()
  useEffect(()=>{
    const getData=async()=>{
      try {
        const res=await axios.get('/product/productByAllCategory')
        setData(res.data)
      } catch (err) {
        console.log(err)
      }
    }
    getData()
  },[])
  return (
    <div className="content">
      <div className='container'>
        <div className='row g-2 h-100'>
          <Banner/>
        </div>
        <div className='mt-5 pt-5 w-100 border-0 p-0 h-auto'>
          <div className='text-center position-relative mb-4'>
            <h4 className='section-title d-inline-block m-0 position-relative'>
              Sản phẩm mới
            </h4>
          </div>
          <div className='w-100 mt-4'>
            <Hightlight getCart={getCart}/>
          </div>
        </div>
        {/* product category */}
        <div className='w-100'>
          {data?.map((item, index) => (
            <Category key={index} item={item} getCart={getCart}/>
          ))}
        </div>
        {/* exp user */}
        <div className='w-100'>
          <Exp/>
        </div>
      </div>
    </div>
  )
}
