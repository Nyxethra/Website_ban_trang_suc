import React, { useEffect, useState } from 'react'
import axios from '../../../axios'

export default function Dashboard() {
    const [countUser,setCountUser]=useState(0)
    useEffect(()=>{
        const getUser=async()=>{
            try {
                const res=await axios.get('/user')
                setCountUser(res.data.length)
            } catch (err) {
                console.log(err)
            }
        }
        getUser()
    },[])
  return (
    <div className='container-fluid'>
        <div className='row py-4' style={{height:"200px"}}>
            <div className='col-3 h-100 position-relative'>
                <div className='px-2 my-4 w-100 h-75 bg-white' style={{boxShadow:'0 1px 4px 0 rgba(0,0,0,.14)'}}>
                    <div className='bg-danger position-absolute rounded-3 d-flex justify-content-center' style={{zIndex:"2",top:"0",boxShadow:"0 4px 20px 0 rgba(0,0,0,.14), 0 7px 10px -5px rgba(255,152,0,.4)",background:"linear-gradient(60deg, #ffa726, #fb8c00",width:"76px",height:"76px"}}>
                        <i className='fa fa-user text-white fs-1 align-self-center'></i>
                    </div>
                    <div className='w-50 h-100 d-flex ' style={{float:"right"}}>
                        <span className='align-self-center fs-5 '>User: {countUser}</span>
                    </div>
                </div>
            </div>
            <div className='col-3 h-100 position-relative'>
                <div className='px-2 my-4 w-100 h-75 bg-white' style={{boxShadow:'0 1px 4px 0 rgba(0,0,0,.14)'}}>
                    <div className='bg-danger position-absolute rounded-3 d-flex justify-content-center' style={{zIndex:"2",top:"0",boxShadow:"0 4px 20px 0 rgba(0,0,0,.14), 0 7px 10px -5px rgba(255,152,0,.4)",background:"linear-gradient(60deg, #66bb6a, #43a047",width:"76px",height:"76px"}}>
                        <i className='fa fa-tags text-white fs-1 align-self-center'></i>
                    </div>
                    <div className='w-50 h-100 d-flex ' style={{float:"right"}}>
                        <span className='align-self-center fs-5 '>User: 50</span>
                    </div>
                </div>
            </div>
            <div className='col-3 h-100 position-relative'>
                <div className='px-2 my-4 w-100 h-75 bg-white' style={{boxShadow:'0 1px 4px 0 rgba(0,0,0,.14)'}}>
                    <div className='bg-danger position-absolute rounded-3 d-flex justify-content-center' style={{zIndex:"2",top:"0",boxShadow:"0 4px 20px 0 rgba(0,0,0,.14), 0 7px 10px -5px rgba(255,152,0,.4)",background:"linear-gradient(60deg, #ef5350, #e53935",width:"76px",height:"76px"}}>
                        <i className='fa fa-shopping-cart text-white fs-1 align-self-center'></i>
                    </div>
                    <div className='w-50 h-100 d-flex ' style={{float:"right"}}>
                        <span className='align-self-center fs-5 '>User: 50</span>
                    </div>
                </div>
            </div>
            <div className='col-3 h-100 position-relative'>
                <div className='px-2 my-4 w-100 h-75 bg-white' style={{boxShadow:'0 1px 4px 0 rgba(0,0,0,.14)'}}>
                    <div className='bg-danger position-absolute rounded-3 d-flex justify-content-center' style={{zIndex:"2",top:"0",boxShadow:"0 4px 20px 0 rgba(0,0,0,.14), 0 7px 10px -5px rgba(255,152,0,.4)",background:"linear-gradient(60deg, #26c6da, #00acc1",width:"76px",height:"76px"}}>
                        <i className='fa fa-truck text-white fs-1 align-self-center'></i>
                    </div>
                    <div className='w-50 h-100 d-flex ' style={{float:"right"}}>
                        <span className='align-self-center fs-5 '>User: 50</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
