// Import các dependencies cần thiết
import React, { useEffect, useState } from 'react'  // Import React và các hooks
import axios from '../../../axios'                  // Import axios đã được cấu hình
import 'bootstrap/dist/css/bootstrap.min.css'      // Import CSS Bootstrap

// Component nhận vào 3 props: openUpdate (để đóng/mở modal), selectId (id category cần update), getAll (hàm refresh data)
export default function UpdateCategory({ openUpdate, selectId, getAll }) {
  // State lưu trữ dữ liệu input
  const [input, setInput] = useState({})

  // useEffect hook để lấy thông tin category khi selectId thay đổi
  useEffect(() => {
    const getCategory = async () => {
      try {
        // Gọi API lấy thông tin category theo ID
        const res = await axios.get(`/category/${selectId}`)
        // Cập nhật state input với tên category
        setInput({
          name: res.data.name
        })
      } catch (err) {
        console.log(err)
      }
    }
    // Chỉ gọi API khi có selectId
    if (selectId) {
      getCategory()
    }
  }, [selectId])

  // Hàm xử lý khi người dùng thay đổi input
  const handleChange = (e) => {
    setInput(prev => ({
      ...prev,                    // Giữ lại các giá trị cũ
      [e.target.name]: e.target.value  // Cập nhật giá trị mới
    }))
  }

  // Hàm xử lý khi người dùng nhấn nút Update
  const handleUpdate = async () => {
    try {
      // Gọi API cập nhật category
      await axios.put(`/category/update/${selectId}`, input)
      getAll()           // Refresh lại danh sách
      openUpdate(false)  // Đóng modal
    } catch (err) {
      console.log(err)
    }
  }

  // Render modal Bootstrap
  return (
    <div className='modal show d-block' tabIndex='-1' role='dialog'>
      <div className='modal-dialog' role='document'>
        <div className='modal-content'>
          {/* Header của modal */}
          <div className='modal-header'>
            <h5 className='modal-title'>Update Category</h5>
            <button type='button' className='close' onClick={() => openUpdate(false)}>
              <span>&times;</span>
            </button>
          </div>
          
          {/* Body của modal - chứa form input */}
          <div className='modal-body'>
            <div className='form-group'>
              <label htmlFor='categoryName'>Name</label>
              <input
                type='text'
                className='form-control'
                id='categoryName'
                name='name'
                value={input.name || ''}  // Sử dụng giá trị từ state, mặc định là rỗng
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Footer của modal - chứa các nút action */}
          <div className='modal-footer'>
            <button type='button' className='btn btn-primary' onClick={handleUpdate}>Update</button>
            <button type='button' className='btn btn-secondary' onClick={() => openUpdate(false)}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  )
}