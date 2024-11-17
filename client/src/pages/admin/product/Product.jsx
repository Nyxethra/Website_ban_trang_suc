import React, { useEffect, useState } from 'react'
import AddProduct from './AddProduct'
import axios from '../../../axios'
import numeral from 'numeral'
import UpdateProduct from './UpdateProduct'

export default function Product() {
  const [open,setOpen]=useState(false)
  const [data,setData]=useState([])
  const [selectId,setSelectId]=useState('')
  const [openUpdate,setOpenUpdate]=useState(false)
  const tabAll=()=>{
    setOpen(false)
  }
  const tabAdd=()=>{
    setOpen(true)
  }
  const getData=async()=>{
    try {
      const res=await axios.get('/product')
      setData(res.data)
    } catch (err) {
      console.log(err)
    }
  }
  useEffect(()=>{
    getData()
  },[])
  
  const handleDelete=async(id)=>{
    try {
      axios.delete(`/product/delete/${id}`)
      getData()
    } catch (err) {
      console.log(err)
    }
  }
  const handleUpdate=(id)=>{
    setOpenUpdate(true)
    setSelectId(id)
  }

  return (
    <div className='w-100 h-100 mt-2'>  
      <div className='d-flex w-100' style={{height:"40px"}}>
        <div type="button" className={`${!open ? "border-top border-4 border-danger":""} bg-white fw-bold p-2 text-center`} onClick={tabAll} style={{width:"100px"}}>Tất cả</div>
        <div type="button" className={`${open ? "border-top border-4 border-danger":""} bg-white fw-bold p-2 text-center`} onClick={tabAdd} style={{width:"100px"}}>Thêm mới</div>
      </div>
      <div className='w-100'>
        {!open 
        ? (
          <div className='mt-3'>
          <table className='table table-bordered '>
            <thead>
              <tr>
                <th scope='col'>#</th>
                <th scope='col'>Name</th>
                <th scope='col'>Price</th>
                <th scope='col'>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((p,index)=>(
                <tr key={p._id} style={{fontSize:"12px"}}>
                  <th>{index}</th>
                  <th>{p.name}</th>
                  <th>{numeral(p.price).format('0,0')}</th>
                  <th className='fs-6'>
                    <td><i className='fa fa-trash text-danger' onClick={()=>handleDelete(p._id)}></i></td>
                    <td><i className='fa fa-pencil mx-2 text-primary' onClick={()=>handleUpdate(p._id)}></i></td>
                  </th>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )
      :(<AddProduct/>)
      }
      </div>
      {openUpdate&&<UpdateProduct openUpdate={setOpenUpdate} selectId={selectId} getAll={getData}/>}
    </div>
  )
}
