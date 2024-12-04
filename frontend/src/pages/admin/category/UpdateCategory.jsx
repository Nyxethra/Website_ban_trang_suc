import React, { useEffect, useState } from 'react'
import axios from '../../../axios'
import 'bootstrap/dist/css/bootstrap.min.css'

export default function UpdateCategory({ openUpdate, selectId, getAll }) {
  const [input, setInput] = useState({})

  useEffect(() => {
    const getCategory = async () => {
      try {
        const res = await axios.get(`/category/${selectId}`)
        setInput({
          name: res.data.name
        })
      } catch (err) {
        console.log(err)
      }
    }
    if (selectId) {
      getCategory()
    }
  }, [selectId])

  const handleChange = (e) => {
    setInput(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleUpdate = async () => {
    try {
      await axios.put(`/category/update/${selectId}`, input)
      getAll()
      openUpdate(false)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    
    <div className='modal show d-block' tabIndex='-1' role='dialog'>
      <div className='modal-dialog' role='document'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h5 className='modal-title'>Update Category</h5>
            <button type='button' className='close' onClick={() => openUpdate(false)}>
              <span>&times;</span>
            </button>
          </div>
          <div className='modal-body'>
            <div className='form-group'>
              <label htmlFor='categoryName'>Name</label>
              <input
                type='text'
                className='form-control'
                id='categoryName'
                name='name'
                value={input.name || ''}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className='modal-footer'>
            <button type='button' className='btn btn-primary' onClick={handleUpdate}>Update</button>
            <button type='button' className='btn btn-secondary' onClick={() => openUpdate(false)}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  )
} 
