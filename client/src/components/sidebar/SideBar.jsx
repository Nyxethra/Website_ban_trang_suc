import React, { useEffect, useState } from 'react'
import "./sidebar.css"
import axios from '../../axios'
import { Link, useLocation } from 'react-router-dom'

export default function SideBar() {
  const [data, setData] = useState([])
  const location = useLocation()
  
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

  const isActive = (categoryId) => {
    return location.pathname === `/product/category/${categoryId}`
  }

  return (
    <nav className="category-nav">
      <ul className="category-menu">
        {data?.map(c => (
          <li className={`category-item ${isActive(c._id) ? 'active' : ''}`} key={c._id}>
            <Link to={`/product/category/${c._id}`}>
              {c.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
