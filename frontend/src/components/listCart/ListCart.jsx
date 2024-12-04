import React, { useEffect, useState } from 'react'
import numeral from 'numeral';
import axios from '../../axios'

export default function ListCart({item,getCart}) {
  const [quantity, setQuantity] = useState(item.quantity)
  const [total,setTotal]=useState(0)

  useEffect(()=>{
    setTotal(item?.product[0]?.price * quantity)
    getCart()
  },[quantity,item?.product[0]?.price])
  useEffect(()=>{
    const updateCart=async()=>{
      try {
        await axios.put(`/cart/update/${item.cartId}`,{
          quantity:quantity,
          totalAmount:total
        })
      } catch (err) {
        console.log(err)
      }
    }
      updateCart();
  },[quantity,total,item])
  const handleDelete=async(id)=>{
    try {
      await axios.delete(`/cart/delete/${id}`)
      getCart()
      alert("success")
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <tr className=''>
        <td className='text-center align-middle'>
          <img src={item?.product[0]?.image} alt="" className='w-50'/>
        </td>
        <td className='text-#b8860b' style={{fontSize:"14px"}}>{item?.product[0]?.name}</td>
        <td>{numeral(item?.product[0]?.price).format('0,0')} ₫</td>
        <td className='text-center align-middle'><input type="number" min="1" className='w-50' onChange={(e) => setQuantity(e.target.value)} value={quantity}/></td>
        <td>{numeral(total).format('0,0')} ₫</td>
        <td className='text-center align-middle'>
          <i type="button" className='fa fa-trash fs-3' 
            style={{color:"#b8860b"}} 
            onClick={()=>handleDelete(item.cartId)}/>
        </td>
    </tr>
  )
}
