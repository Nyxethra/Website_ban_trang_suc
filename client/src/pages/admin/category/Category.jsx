import React, { useEffect,useRef,useState } from 'react'
import axios from '../../../axios'

export default function Category() {
  const [data,setData]=useState()
  const [name,setName]=useState("")
  const AddModal=useRef()
  const handleAdd=()=>{
    AddModal.current.classList.remove('d-none')
  }
  const getdata=async()=>{
    try {
      const res=await axios.get('/category')
      setData(res.data)
    } catch (err) {
      console.log(err)
    }
  }
  const handleDelete=async(id)=>{
    try {
      await axios.delete(`/category/delete/${id}`)
      getdata()
    } catch (err) {
      console.log(err)
    }
  }
  const handleCreate=async()=>{
    try {
      await axios.post(`/category/create`,{name:name})
      getdata()
    } catch (err) {
      console.log(err)
    }
  }
  useEffect(()=>{
    getdata()
  },[])
  return (
    <div className='container mt-3'>
      <div type="button" className='btn btn-primary' onClick={ handleAdd}>Add Category</div>
      <div className='mt-2 w-50 border border-3 d-flex flex-column bg-white p-2 d-none' ref={AddModal} style={{height:"100px",boxShadow:'0 4px 20px 0 rgba(0,0,0,.14), 0 7px 10px -5px rgba(156,39,176,.4)'}}>
        <input type="text" placeholder='Enter name...' name='name' onChange={e=>setName(e.target.value)} className='border-0 border-bottom w-50' style={{outline:"none"}}/>
        <div type="button" className='btn btn-primary w-25 m-3' onClick={handleCreate}>Add New</div>
      </div>
      <div className='mt-3'>
        <table className='table table-bordered'>
          <thead>
            <tr>
              <th scope='col'>#</th>
              <th scope='col'>Name</th>
              <th scope='col'>Action</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((c,index)=>(
              <tr key={c._id}>
                <th>{index+1}</th>
                <th>{c.name}</th>
                <th>
                  <td><i className='fa fa-trash' type="button" style={{color:"red"}} onClick={()=>handleDelete(c._id)}></i></td>
                </th>
             </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
