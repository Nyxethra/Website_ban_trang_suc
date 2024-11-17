import React,{useState} from 'react'
import numeral from 'numeral';
import axios from "../../axios"


export default function ListItem({data,getCart}) {
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
    <>
            {data?.map(item=>(
              <div className='p-1' key={item?._id}>
                <div className="border d-flex flex-column rounded-3 bg-white p-1" style={{height:"350px"}}>
                  <div className='h-75 w-100' style={{borderBottom:"1px solid black"}}>
                      <a href={`/product/productDetail/${item?._id}`} className='w-100 h-100 d-flex flex-column text-decoration-none text-dark'>
                          <img src={item?.image} alt="" className='w-100 h-75' />
                          <div className='h-25 ' style={{fontSize:"12px"}}>{item?.name}</div>
                      </a>
                  </div>
                  <div className='py-2 d-flex flex-column h-25 w-100'>
                      <div className='text-danger fw-bold h-50'>{numeral(item?.price).format('0,0')} ₫</div>
                      <div type="button" className='fw-bold bg-secondary rounded-3 h-50 d-flex justify-content-center align-items-center' style={{fontSize:"14px"}} onClick={()=>handleAdd(item?._id,item?.price)}>Thêm vào giỏ hàng</div>
                  </div>
              </div>
            </div>
            ))}
      </>
  )
}
