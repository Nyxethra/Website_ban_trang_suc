import React from 'react'
import numeral from 'numeral'
import axios from '../../axios'

export default function Category({item,getCart}) {
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
    <div className='my-3 w-100 h-100'>
    {/* category title */}
    <div className='d-flex justify-content-between border bg-light px-2 py-1'>
      <h3 className='text-#b8860b'>{item.category}</h3>
      <div className='border border-1 rounded-3 my-1 d-flex align-items-center'>
        <a href={`product/category/${item.categoryId}`} className='text-decoration-none mx-2 text-#b8860b'>Xem thêm</a>
        <i className='fa fa-angle-right text-#b8860b'></i>
      </div>
    </div>
    {/* category product list */}
    <div className='row row-cols-5 m-1'>
        {item.products.map(p=>(
            <div className='p-1' key={p._id}>
                <div className="border d-flex flex-column rounded-3 bg-white p-1" style={{height:"350px"}}>
                    <div className='h-75 w-100' style={{borderBottom:"1px solid black"}}>
                        <a href="" className='w-100 h-100 d-flex flex-column text-decoration-none text-dark'>
                            <img src={p.image} alt="" className='w-100 h-75' />
                            <div className='h-25'>{p.name}</div>
                        </a>
                    </div>
                    <div className='py-2 d-flex flex-column h-25 w-100'>
                        <div className='text-#b8860b fw-bold h-50'>{numeral(p.price).format('0,0')} ₫</div>
                        <div type="button" className='fw-bold bg-secondary rounded-3 h-50 d-flex justify-content-center align-items-center' style={{fontSize:"14px"}} onClick={()=>handleAdd(p._id,p.price)}>Thêm vào giỏ hàng</div>
                    </div>
                </div>
            </div>
        ))}
        </div>
  </div>
  )
}
