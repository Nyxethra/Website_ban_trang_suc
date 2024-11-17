import React, { useState,useEffect } from 'react'
import axios from '../../../axios'
import numeral from 'numeral'

export default function Order() {
    const [data,setData]=useState([])
    const [status,setStatus]=useState()
    const [payment,setPayment]=useState()

    const getData=async()=>{
        try {
            const res=await axios.get('/order/all')
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
    const handleStatus=async(id,status)=>{
        try {
            let newStatus;
            if(status==="Chưa xác nhận"){
                newStatus="Đã xác nhận"
            }else{
                newStatus="Đã xác nhận"
            }
            await axios.put(`/order/update/${id}`,{confimationStatus:newStatus})
            getData()
        } catch (err) {
            console.log(err)
        }
    }
    const handlePayment=async(id,statusPayment)=>{
        try {
            let newStatusPayment;
            if(statusPayment==="Chưa thanh toán"){
                newStatusPayment="Đã thanh toán"
            }else{
                newStatusPayment="Đã thanh toán"
            }
            await axios.put(`/order/update/${id}`,{paymentStatus:newStatusPayment})
            getData()
        } catch (err) {
            console.log(err)
        }
    }
  return (
    <div className='w-100 mt-3'>
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
                    <td><button className='' onClick={()=>handleStatus(o._id,o.confimationStatus)} style={{fontSize:"12px"}}>{o.confimationStatus}</button></td>
                    <td><button  style={{fontSize:"12px"}} onClick={()=>handlePayment(o._id,o.paymentStatus)}>{o.paymentStatus}</button></td>
                    <td>
                        <th><i type="button" className='fa fa-trash text-danger' onClick={()=>handleDelete(o._id)}></i></th>
                        <th><i type="button" className='fa fa-eye text-primary mx-1'></i></th>
                    </td>
                </tr>
                )))
            : (<tr>
                <td colspan="6" className='text-center'>Danh sách đơn hàng trống.</td>
               </tr>
              )}
            
        </tbody>
        </table>
    </div>
  )
}
