// Import các thư viện và component cần thiết
import React, { useEffect, useState } from 'react' // Import React và các hooks
import AddProduct from './AddProduct' // Import component thêm sản phẩm
import axios from '../../../axios' // Import axios đã được cấu hình
import numeral from 'numeral' // Thư viện format số
import UpdateProduct from './UpdateProduct' // Import component cập nhật sản phẩm

export default function Product() {
  // Khai báo các state
  const [open, setOpen] = useState(false) // State điều khiển hiển thị form thêm mới
  const [data, setData] = useState([]) // State lưu trữ danh sách sản phẩm
  const [selectId, setSelectId] = useState('') // State lưu ID sản phẩm được chọn
  const [openUpdate, setOpenUpdate] = useState(false) // State điều khiển hiển thị form cập nhật

  // Hàm chuyển tab về danh sách sản phẩm
  const tabAll = () => {
    setOpen(false)
  }

  // Hàm chuyển tab sang thêm mới sản phẩm
  const tabAdd = () => {
    setOpen(true)
  }

  // Hàm lấy dữ liệu sản phẩm từ API
  const getData = async () => {
    try {
      const res = await axios.get('/product')
      setData(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  // Hook useEffect gọi getData khi component mount
  useEffect(() => {
    getData()
  }, [])

  // Hàm xóa sản phẩm
  const handleDelete = async (id) => {
    try {
      axios.delete(`/product/delete/${id}`)
      getData() // Refresh lại danh sách sau khi xóa
    } catch (err) {
      console.log(err)
    }
  }

  // Hàm mở form cập nhật sản phẩm
  const handleUpdate = (id) => {
    setOpenUpdate(true)
    setSelectId(id)
  }

  return (
    // Container chính
    <div className='w-100 h-100 mt-2'>
      {/* Phần tab menu */}
      <div className='d-flex w-100' style={{height:"40px"}}>
        {/* Tab danh sách sản phẩm */}
        <div type="button" className={`${!open ? "border-top border-4 border-#b8860b":""} bg-white fw-bold p-2 text-center`} onClick={tabAll} style={{width:"100px"}}>Tất cả</div>
        {/* Tab thêm mới sản phẩm */}
        <div type="button" className={`${open ? "border-top border-4 border-#b8860b":""} bg-white fw-bold p-2 text-center`} onClick={tabAdd} style={{width:"100px"}}>Thêm mới</div>
      </div>

      {/* Phần nội dung */}
      <div className='w-100'>
        {/* Điều kiện hiển thị bảng danh sách hoặc form thêm mới */}
        {!open ? (
          // Bảng danh sách sản phẩm
          <div className='mt-3'>
            <table className='table table-bordered'>
              {/* Header của bảng */}
              <thead>
                <tr>
                  <th scope='col'>#</th>
                  <th scope='col'>Name</th>
                  <th scope='col'>Price</th>
                  <th scope='col'>Action</th>
                </tr>
              </thead>
              {/* Body của bảng - hiển thị danh sách sản phẩm */}
              <tbody>
                {data.map((p, index) => (
                  <tr key={p._id} style={{fontSize:"12px"}}>
                    <th>{index}</th>
                    <th>{p.name}</th>
                    <th>{numeral(p.price).format('0,0')}</th>
                    <th className='fs-6'>
                      {/* Nút xóa và cập nhật */}
                      <td><i className='fa fa-trash' style={{color:"#b8860b"}} onClick={() => handleDelete(p._id)}></i></td>
                      <td><i className='fa fa-pencil mx-2 text-primary' onClick={() => handleUpdate(p._id)}></i></td>
                    </th>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          // Form thêm mới sản phẩm
          <AddProduct/>
        )}
      </div>

      {/* Component cập nhật sản phẩm - hiển thị khi openUpdate = true */}
      {openUpdate && (
        <UpdateProduct 
          openUpdate={openUpdate}
          setOpenUpdate={setOpenUpdate}
          selectId={selectId}
          getAll={getData}
        />
      )}
    </div>
  )
}