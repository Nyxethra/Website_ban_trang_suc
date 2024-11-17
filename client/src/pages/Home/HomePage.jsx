import React, { useEffect,useState } from 'react'
import Footer from '../footer/Footer'
import Login from '../Login/Login'
import Header from '../Header/Header'
import Content from '../Content/Content'
import Cart from '../Cart/Cart'
import Search from '../Search/Search'
import Category from '../Category/Category'
import {BrowserRouter,Routes,Route,Navigate} from 'react-router-dom'
import ProductDetail from '../productDetail/ProductDetail'
import Profile from '../Profile/Profile'
import { useSelector } from 'react-redux'
import axios from '../../axios'
import {useDispatch} from 'react-redux'
import {loginSuccess } from '../../redux/userSlice'
import Payment from '../payment/Payment'

function HomePage() {
  const {currentUser}=useSelector(state=>state.user)
  const [count,setCount]=useState(0)
  const [total,setTotal]=useState(0)
  const [data,setData]=useState([])
  const dispatch=useDispatch()
useEffect(()=>{
    const handleGoogle=async()=>{
      try {
        const res=await axios.get("/login/success")
        dispatch(loginSuccess(res.data))
      } catch (err) {
        console.log(err)
      }
    };
    handleGoogle();
  },[dispatch])

  const getCart=async()=>{
      try {
        const res=await axios.get('cart/find')
        setData(res.data)
        setCount(res.data.count)
        setTotal(res.data.totalAmount)
      } catch (err) {
        console.log(err)
      }
    }
  useEffect(()=>{
    getCart()
  },[])
  return (
    <div className='w-100 d-flex flex-column'>
        <Header count={count} getCart={getCart} total={total} data={data}/>
         <div className='content-wrapper'>
            <div className='bg-light' >
                <Routes>
                    <Route index element={<Content getCart={getCart}/>}/>
                    <Route path='login' element={!currentUser ?<Login/>:<Navigate to="/"/>}/>
                    <Route path='cart' element={currentUser ? <Cart getCart={getCart} data={data} total={total}/>: <Navigate to="/login"/>}/>
                    <Route path='product/productDetail/:id' element={<ProductDetail getCart={getCart}/>}/>
                    <Route path='product/search/*' element={<Search getCart={getCart}/>}/>
                    <Route path='product/category/:id' element={<Category getCart={getCart}/>}/>
                    <Route path='/profile/*' element={currentUser ?<Profile/>:<Navigate to="/login"/>}/>
                    <Route path='/cart/checkout' element={<Payment total={total} getCart={getCart} data={data}/>}/>
                </Routes>
            </div>
         </div> 
        <Footer/> 
    </div>
  )
}


export default HomePage;
