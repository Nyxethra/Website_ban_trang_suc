import React, { useEffect, useState } from 'react'
import axios from '../../axios'
import numeral from 'numeral';
export default function Hightlight({getCart}) {
    const [data,setData]=useState()
    const getData=async()=>{
        try {
            const res=await axios.get('/product/new')
            setData(res.data)
        } catch (err) {
            console.log(err)
        }
    }
    useEffect(()=>{
        getData()
    },[])
    const handleAdd=async(id,price)=>{
        try {
          await axios.post("/cart/create",{
            productId:id,
            totalAmount:price
          })
          getCart()
          alert("Add to cart success")
        } catch (err) {
          console.log(err)
        }
      }
  return (
    <div className='row row-cols-5 m-1 '>
        {data?.map(p=>(
            <div className='p-1'>
            <div className="border d-flex flex-column rounded-3 bg-white p-1" style={{height:"350px"}}>
                <div className='h-75 w-100' style={{borderBottom:"1px solid black"}}>
                    <a href={`product/productDetail/${p._id}`} className='w-100 h-100 d-flex flex-column text-decoration-none text-dark'>
                        <img src={p.image} alt="" className='w-100 h-75' />
                        <div className='h-25' style={{fontSize:"12px"}}>{p.name}</div>
                    </a>
                </div>
                <div className='py-2 d-flex flex-column h-25 w-100'>
                    <div className='text-danger fw-bold h-50'>{numeral(p.price).format('0,0')} ₫</div>
                    <div type="button" className='fw-bold bg-secondary rounded-3 h-50 d-flex justify-content-center align-items-center' style={{fontSize:"14px"}} onClick={()=>handleAdd(p?._id,p.price)}>Thêm vào giỏ hàng</div>
                </div>
            </div>
        </div>       
        )) }
    </div>
  )
}
