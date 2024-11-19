import React, { useEffect, useState } from 'react'
import axios from '../../axios'
import numeral from 'numeral';
import './Order.css'

export default function Order() {
    const [data,setData]=useState([])
    const getData=async()=>{
        try {
            const res=await axios.get('/order/getByUser')
            const ordersWithProducts = await Promise.all(res.data.map(async order => {
                const productMap = new Map();
                
                await Promise.all(order.product
                    .filter(p => p.productId)
                    .map(async p => {
                        try {
                            const productRes = await axios.get(`/product/${p.productId}`)
                            
                            if (productMap.has(p.productId)) {
                                const existingProduct = productMap.get(p.productId);
                                productMap.set(p.productId, {
                                    ...existingProduct,
                                    quantity: existingProduct.quantity + (p.quantity || 1)
                                });
                            } else {
                                productMap.set(p.productId, {
                                    ...p,
                                    productDetails: productRes.data,
                                    quantity: p.quantity || 1
                                });
                            }
                        } catch (err) {
                            console.log(`Error fetching product ${p.productId}:`, err)
                        }
                    }))

                const mergedProducts = Array.from(productMap.values());
                
                return {
                    ...order,
                    product: mergedProducts
                }
            }))
            setData(ordersWithProducts)
        } catch (err) {
            console.log("Error fetching orders:", err)
        }
    }
    const handleDelete=async(id)=>{
        try {
            await axios.delete(`/order/delete/${id}`)
            getData()
            alert("success")
        } catch (err) {
            console.log(err)
        }
    }
    useEffect(()=>{
        getData()
    },[])
  return (
    <div className='w-100'>
        <p>List Order</p>
      <table className="table table-bordered">
        <thead>
            <tr>
                <th scope="col">OrderId</th>
                <th scope="col">Products</th>
                <th scope="col">CreateAt</th>
                <th scope="col">Price</th>
                <th scope="col">Status</th>
                <th scope="col">Payment</th>
                <th scope="col">Action</th>
            </tr>
        </thead>
        <tbody>
            {data.length>0 
            ? (data.map(o=>(
                <tr key={o._id}>
                    <th scope="row">{o._id}</th>
                    <td>
                        <div className="d-flex flex-wrap gap-2">
                            {o.product.map((p, index) => (
                                <div key={index} className="product-thumbnail-container">
                                    {p.productDetails?.image ? (
                                        <div className="product-thumbnail">
                                            <img 
                                                src={p.productDetails.image}
                                                alt={p.productDetails.name || 'Product image'}
                                                className="product-image"
                                            />
                                            <span className="quantity-badge">
                                                {p.quantity || 1}
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="product-thumbnail placeholder">
                                            <span>No image</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </td>
                    <td>{new Date(o.createdAt).toLocaleString('vi-VN')}</td>
                    <td>{numeral(o.price).format('0,0')} ₫</td>
                    <td>{o.confimationStatus}</td>
                    <td>{o.paymentStatus}</td>
                    <td>
                        <button className="btn btn-link text-danger p-0 me-2" onClick={() => handleDelete(o._id)}>
                            <i className="fa fa-trash"></i>
                        </button>
                        <button className="btn btn-link text-primary p-0">
                            <i className="fa fa-eye"></i>
                        </button>
                    </td>
                </tr>
                )))
            : (<tr>
                <td colSpan="7" className='text-center'>Danh sách đơn hàng của bạn trống.</td>
               </tr>
              )}
            
        </tbody>
        </table>
    </div>
  )
}
