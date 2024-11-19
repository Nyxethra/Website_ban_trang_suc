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
    <div className='row g-4 mx-1'>
        {data?.map(p => (
            <div className='col' key={p._id}>
                <div className="product-card border rounded-3 bg-white p-3 shadow-sm h-100">
                    <div className='product-image-container mb-3'>
                        <a href={`product/productDetail/${p._id}`} className='text-decoration-none'>
                            <img src={p.image} alt={p.name} 
                                 className='product-image w-100 h-100 object-fit-contain' />
                        </a>
                    </div>
                    <div className='product-info'>
                        <a href={`product/productDetail/${p._id}`} 
                           className='text-decoration-none text-dark'>
                            <h5 className='product-name mb-2'>{p.name}</h5>
                        </a>
                        <div className='product-price text-danger fw-bold mb-3'>
                            {numeral(p.price).format('0,0')} ₫
                        </div>
                        <button 
                            className='btn btn-warning w-100 fw-bold text-white'
                            onClick={() => handleAdd(p?._id, p.price)}>
                            Thêm vào giỏ hàng
                        </button>
                    </div>
                </div>
            </div>
        ))}
    </div>
  )
}
