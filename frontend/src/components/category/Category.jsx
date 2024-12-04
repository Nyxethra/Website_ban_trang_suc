import React from 'react'
import numeral from 'numeral'
import axios from '../../axios'
import './Category.css'

export default function Category({item, getCart}) {
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

  const handleImageError = (e) => {
    e.target.src = '/path/to/fallback-image.jpg'
    e.target.onerror = null
  }

  return (
    <div className='my-5'>
      {/* Category Header */}
      <div className='mb-4'>
        <h3 className='category-title mb-0'>{item.category}</h3>
        <div className='category-divider mt-2'></div>
      </div>

      {/* Category Products */}
      <div className='row g-4'>
        {item.products.map(p => (
          <div className='col-lg-3 col-md-4 col-sm-6' key={p._id}>
            <div className='category-product-card'>
              <a href={`/product/productDetail/${p._id}`} className='product-link' style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                <div className='product-image-wrapper'>
                  <img 
                    src={p.image} 
                    alt={p.name} 
                    className='product-image'
                    onError={handleImageError}
                    loading="lazy"
                    style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                  />
                </div>
                
                <div className='product-details'>
                  <h4 className='product-name' style={{ margin: '10px 0', fontSize: '1rem' }}>{p.name}</h4>
                  
                  <div className='product-price mb-3' style={{ color: '#d4a556', fontWeight: 'bold' }}>
                    {numeral(p.price).format('0,0')} ₫
                  </div>
                </div>
              </a>
              
              <button 
                className='add-to-cart-btn mt-auto'
                onClick={() => handleAdd(p._id, p.price)}
                style={{
                  width: '100%',
                  padding: '8px',
                  backgroundColor: '#d4a556',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}>
                Thêm vào giỏ hàng
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* View More Button */}
      <div className='text-center mt-4'>
        <a href={`product/category/${item.categoryId}`} 
           className='view-more-link'>
          Xem thêm sản phẩm
        </a>
      </div>
    </div>
  )
}
