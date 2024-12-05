// Import các dependencies cần thiết
import React, { useEffect, useRef, useState } from 'react' // Import React và các hooks
import axios from '../../../axios'                         // Import axios đã được cấu hình
import UpdateCategory from './UpdateCategory'              // Import component UpdateCategory

export default function Category() {
  // Khai báo các state cần thiết
  const [data, setData] = useState([])         // State lưu trữ danh sách categories
  const [name, setName] = useState("")         // State lưu tên category khi thêm mới
  const [selectId, setSelectId] = useState('') // State lưu ID category được chọn để cập nhật
  const [openUpdate, setOpenUpdate] = useState(false) // State điều khiển hiển thị form cập nhật
  const AddModal = useRef()                    // Ref để truy cập trực tiếp đến DOM của modal thêm mới

  // Các hàm xử lý

  const handleAdd = () => {
    // Hiển thị form thêm mới bằng cách xóa class d-none
    AddModal.current.classList.remove('d-none')
  }

  const getdata = async () => {
    // Gọi API lấy danh sách categories và cập nhật vào state data
    try {
      const res = await axios.get('/category')
      setData(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  const handleDelete = async (id) => {
    // Gọi API xóa category theo ID và refresh lại danh sách
    try {
      await axios.delete(`/category/delete/${id}`)
      getdata() 
    } catch (err) {
      console.log(err)
    }
  }

  const handleCreate = async () => {
    // Gọi API tạo category mới với tên từ state name
    try {
      await axios.post(`/category/create`, { name: name })
      getdata()
    } catch (err) {
      console.log(err)
    }
  }

  const handleUpdate = (id) => {
    // Mở form cập nhật và lưu ID category được chọn
    setOpenUpdate(true)
    setSelectId(id)
  }

  // useEffect hook để lấy dữ liệu khi component được mount
  useEffect(() => {
    getdata()
  }, [])

  // Phần return JSX
  return (
    <div className='container mt-3'>
      {/* Nút "Add Category" để mở form thêm mới */}
      <div type="button" className='btn btn-primary' onClick={handleAdd}>Add Category</div>

      {/* Form thêm mới category - mặc định ẩn với class d-none */}
      <div className='mt-2 w-50 border border-3 d-flex flex-column bg-white p-2 d-none' 
           ref={AddModal}>
        {/* Input nhập tên category mới */}
        <input type="text" 
               onChange={e => setName(e.target.value)} 
               className='border-0 border-bottom w-50'/>
        {/* Nút xác nhận thêm mới */}
        <div type="button" className='btn btn-primary w-25 m-3' onClick={handleCreate}>Add New</div>
      </div>

      {/* Bảng hiển thị danh sách categories */}
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
            {/* Render danh sách categories bằng map */}
            {data?.map((c, index) => (
              <tr key={c._id}>
                <th>{index + 1}</th>
                <th>{c.name}</th>
                <th>
                  {/* Icons để xóa và cập nhật */}
                  <i className='fa fa-trash' onClick={() => handleDelete(c._id)}></i>
                  <i className='fa fa-pencil' onClick={() => handleUpdate(c._id)}></i>
                </th>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Render component UpdateCategory khi openUpdate = true */}
      {openUpdate && <UpdateCategory openUpdate={setOpenUpdate} selectId={selectId} getAll={getdata} />}
    </div>
  )
}