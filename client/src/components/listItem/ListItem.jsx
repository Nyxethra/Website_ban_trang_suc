import React from 'react'
import numeral from 'numeral';
import axios from "../../axios"

export default function ListItem({data, getCart}) {
  const handleAdd = async(id, price) => {
    try {
      await axios.post("/cart/create", {
        productId: id,
        totalAmount: price
      })
      getCart()
      alert("Add to cart success")
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <>
      {data?.map(item => (
        <div className='col mb-4' key={item?._id}>
          <div className="product-item">
            <a href={`/product/productDetail/${item?._id}`} className='text-decoration-none'>
              <div className='product-image-container'>
                <img src={item?.image} alt={item?.name} />
              </div>
              <div className='product-info'>
                <h3 className='product-name'>{item?.name}</h3>
                <div className='product-price'>
                  {numeral(item?.price).format('0,0')} ₫
                </div>
              </div>
            </a>
            <button 
              className='add-to-cart-btn'
              onClick={() => handleAdd(item?._id, item?.price)}
            >
              Thêm vào giỏ hàng
            </button>
          </div>
        </div>
      ))}
    </>
  )
}
