import React, { useEffect, useState } from 'react'
import "./sidebar.css"
import axios from '../../axios'
import { Link } from 'react-router-dom'

export default function SideBar({ isVisible }) {
  const [data, setData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10 // Số lượng items mỗi trang
  
  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get('/category')
        setData(res.data)
      } catch (err) {
        console.log(err)
      }
    }
    getData()
  }, [])

  // Tính toán items cho trang hiện tại
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = data?.slice(indexOfFirstItem, indexOfLastItem)

  // Xử lý chuyển trang
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  return (
    <div className={`sidebar ${isVisible ? 'visible' : 'hidden'}`}>
      <ul className='list-unstyled p-2 fs-5 sidebar_ul'>
        {currentItems?.map(c => (
          <li className='px-1 d-flex align-items-center' key={c._id}>
            <Link 
              className='text-decoration-none position-relative w-100 p-1 py-2' 
              to={`/product/category/${c._id}`}
            >
              {c.name}
            </Link>
          </li>
        ))}
      </ul>
      {/* Thêm phân trang nếu cần */}
      {data?.length > itemsPerPage && (
        <div className="pagination d-flex justify-content-center">
          {Array(Math.ceil(data.length / itemsPerPage))
            .fill()
            .map((_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`btn btn-sm mx-1 ${currentPage === index + 1 ? 'btn-primary' : 'btn-outline-primary'}`}
              >
                {index + 1}
              </button>
            ))}
        </div>
      )}
    </div>
  )
}
