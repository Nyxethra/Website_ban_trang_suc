import React, { useEffect, useState } from 'react'
import axios from '../../axios'
import numeral from 'numeral';

export default function Order() {
    const [data,setData]=useState([])
    const getData=async()=>{
        try {
            const res=await axios.get('/order/getByUser')
            setData(res.data)
        } catch (err) {
            console.log(err)
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
      <table class="table table-bordered">
        <thead>
            <tr>
                <th scope="col">OrderId</th>
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
                    <td>{o.createdAt}</td>
                    <td>{numeral(o.price).format('0,0')}</td>
                    <td>{o.confimationStatus}</td>
                    <td>{o.paymentStatus}</td>
                    <td>
                        <th><i type="button" className='fa fa-trash text-danger' onClick={()=>handleDelete(o._id)}></i></th>
                        <th><i type="button" className='fa fa-eye text-primary mx-1'></i></th>
                    </td>
                </tr>
                )))
            : (<tr>
                <td colspan="6" className='text-center'>Danh sách đơn hàng của bạn trống.</td>
               </tr>
              )}
            
        </tbody>
        </table>
    </div>
  )
}
