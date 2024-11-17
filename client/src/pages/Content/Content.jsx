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
    <div className='container' style={{ marginTop: "15px" }}>
      <div className='row g-2 h-100'>

          <Banner/>

      </div>
      <div className=' mt-4 w-100 border p-2 h-auto' style={{ backgroundColor: "#011a33" }}>
              <h4 className='text-white px-2'>News</h4>
              <div className='w-100'>
              <Hightlight getCart={getCart}/>
              </div>
           </div>
           {/* product category */}
           <div className='w-100'>
            {data?.map((item,index)=>(
              <Category key={index} item={item} getCart={getCart}/>
            ))}
           </div>
           {/* exp user */}
           <div className=' w-100'>
            <Exp/>
           </div>
    </div>
  )
}
