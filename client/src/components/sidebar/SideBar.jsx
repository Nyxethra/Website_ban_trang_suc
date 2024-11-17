import React, { useEffect, useState } from 'react'
import "./sidebar.css"
import axios from '../../axios'

export default function SideBar() {
  const [data,setData]=useState()
  useEffect(()=>{
    const getData=async()=>{
      try {
        const res=await axios.get('/category')
        setData(res.data)
      } catch (err) {
        console.log(err)
      }
    }
    getData()
  },[])
  return (
    <div className='h-100 rounded-3' style={{backgroundColor:"#d9d9d9"}}>
      <ul className='list-unstyled p-2 fs-5 sidebar_ul'>
        {data?.map(c=>(
          <li className=' px-1 d-flex align-items-center' key={c._id}>
            <a className='text-decoration-none position-relative w-100 p-1 py-2' href={`product/category/${c._id}`}>{c.name}</a>
            <i className='fa fa-caret-right text-secondary position-absolute'></i>
        </li>
        ))}
      </ul>
      
    </div>
  )
}
