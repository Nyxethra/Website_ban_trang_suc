import React, { useEffect, useState } from 'react'
import axios from '../../../axios'
import {useSelector} from 'react-redux'

export default function User() {
      const {currentUser}=useSelector(state=>state.user)
        const [data,setData]=useState()
        const getData=async()=>{
            try {
                const res=await axios.get('/user')
                setData(res.data)
            } catch (err) {
                console.log(err)
            }
        }
        useEffect(()=>{
            getData()
        },[])
        const handleUpdate=async(admin,id)=>{
            try {
                const res=await axios.put(`/user/update/${id}`,{admin:!admin})
                getData()
            } catch (err) {
                console.log(err)
            }
        }
        const handleDelete=async(id)=>{
            try {
                await axios.delete(`user/delete/${id}`)
                getData()
            } catch (err) {
                console.log(err)
            }
        }
  return (
    <div className=''>
      <table className='table table-bordered table-hover'>
        <thead>
            <tr>
                <th scope='col'>#</th>
                <th scope='col'>Name</th>
                <th scope='col'>Email</th>
                <th scope='col'>Address</th>
                <th scope='col'>Phone</th>
                <th scope='col'>Admin</th>
                <th scope='col'>Action</th>
            </tr>
        </thead>
        <tbody>
          {data?.map((u,index)=>(
            <tr key={u._id}>
              <th scope='row'>{index+1}</th>
              <th>{u?.name}</th>
              <th>{u?.email}</th>
              <th>{u?.address}</th>
              <th>{u?.phone}</th>
              <th>{currentUser._id!==u._id &&<input type="checkbox" checked={u.admin ? "true":""} onClick={()=>handleUpdate(u.admin,u._id)}/>}</th>
              <th>
                <td>{currentUser._id!==u._id &&<i className='fa fa-trash fs-5' style={{color:"red",cursor:"pointer"}} onClick={()=>handleDelete(u._id)}></i>}</td>
              </th>
          </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
