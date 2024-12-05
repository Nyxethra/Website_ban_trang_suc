// Import các thư viện cần thiết từ React
import React, { useEffect, useState } from 'react'  // Import React và hooks để quản lý state và side effects
import axios from '../../../axios'                  // Import instance axios đã được cấu hình sẵn
import 'bootstrap/dist/css/bootstrap.min.css'      // Import styles của Bootstrap

// Component UpdateCategory nhận vào 3 props:
// - openUpdate: function để điều khiển việc hiển thị modal
// - selectId: ID của category cần cập nhật
// - getAll: function để refresh lại danh sách category
export default function UpdateCategory({ openUpdate, selectId, getAll }) {
  // Khởi tạo state input để lưu thông tin category
  const [input, setInput] = useState({})

  // useEffect sẽ chạy khi selectId thay đổi  
  useEffect(() => {
    // Hàm async để lấy thông tin category từ API
    const getCategory = async () => {
      try {
        // Gọi API với ID được chọn
        const res = await axios.get(`/category/${selectId}`)
        // Cập nhật state input với tên category từ response
        setInput({
          name: res.data.name
        })
      } catch (err) {
        console.log(err) // Log lỗi nếu có
      }
    }
    // Chỉ gọi API khi có selectId
    if (selectId) {
      getCategory()
    }
  }, [selectId]) // Dependencies array chỉ chứa selectId

  // Hàm xử lý sự kiện khi người dùng nhập liệu
  const handleChange = (e) => {
    setInput(prev => ({
      ...prev,                         // Giữ nguyên các giá trị cũ
      [e.target.name]: e.target.value  // Cập nhật giá trị mới dựa vào name của input
    }))
  }

  // Hàm xử lý khi người dùng nhấn nút Update
  const handleUpdate = async () => {
    try {
      // Gọi API để cập nhật category
      await axios.put(`/category/update/${selectId}`, input)
      getAll()           // Gọi hàm refresh danh sách
      openUpdate(false)  // Đóng modal sau khi cập nhật thành công
    } catch (err) {
      console.log(err)   // Log lỗi nếu có
    }
  }

  // Return JSX - Giao diện modal sử dụng Bootstrap
  return (
    <div className='modal show d-block' tabIndex='-1' role='dialog'>
      <div className='modal-dialog' role='document'>
        <div className='modal-content'>
          {/* Phần header của modal */}
          <div className='modal-header'>
            <h5 className='modal-title'>Update Category</h5>
            <button type='button' className='close' onClick={() => openUpdate(false)}>
              <span>&times;</span>
            </button>
          </div>
          
          {/* Phần body của modal - chứa form input */}
          <div className='modal-body'>
            <div className='form-group'>
              <label htmlFor='categoryName'>Name</label>
              <input
                type='text'
                className='form-control'
                id='categoryName'
                name='name'
                value={input.name || ''}  // Binding giá trị từ state, mặc định là rỗng
                onChange={handleChange}    // Gọi handleChange khi người dùng nhập
              />
            </div>
          </div>

          {/* Phần footer của modal - chứa các nút thao tác */}
          <div className='modal-footer'>
            <button type='button' className='btn btn-primary' onClick={handleUpdate}>Update</button>
            <button type='button' className='btn btn-secondary' onClick={() => openUpdate(false)}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  )
}