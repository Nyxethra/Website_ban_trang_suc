import React, { useEffect, useState } from 'react'
import axios from '../../axios'
import numeral from 'numeral'
import Slider from 'react-slick'
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

export default function Hightlight({getCart}) {
    const [data,setData]=useState()
    
    const settings = {
        dots: false,
        infinite: true,
        speed: 800,
        slidesToShow: 5,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        cssEase: "linear",
        pauseOnHover: true,
        arrows: false,
        waitForAnimate: false,
        variableWidth: false,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                }
            }
        ]
    }

    const getData=async()=>{
        try {
            const res=await axios.get('/product/new', {
                params: {
                    limit: 15,
                    page: 1
                }
            })
            console.log("New products response:", res.data)
            setData(res.data)
        } catch (err) {
            console.log("Error fetching new products:", err)
        }
    }

    useEffect(()=>{
        getData()
    },[])

    const handleAdd=async(id,price)=>{
        try {
            await axios.post("/cart/create",{
                productId:id,
                totalAmount:price
            })
            getCart()
            alert("Add to cart success")
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <Slider {...settings}>
            {data?.map(p => (
                <div key={p._id} className="px-2">
                    <div className="card h-100 border">
                        <div className='p-3'>
                            <a href={`product/productDetail/${p._id}`} className='text-decoration-none'>
                                <img src={p.image} alt={p.name} 
                                     className='img-fluid' 
                                     style={{height: '180px', objectFit: 'contain', width: '100%'}}/>
                            </a>
                        </div>
                        <div className='card-body text-center'>
                            <a href={`product/productDetail/${p._id}`} 
                               className='text-decoration-none text-dark'>
                                <h6 className='card-title mb-2'>{p.name}</h6>
                            </a>
                            <p className='text-danger fw-bold mb-3'>
                                {numeral(p.price).format('0,0')} ₫
                            </p>
                            <button 
                                className='btn btn-warning w-100'
                                style={{backgroundColor: 'rgb(212, 165, 86)', borderColor: '#B8860B'}}
                                onClick={() => handleAdd(p?._id, p.price)}>
                                Thêm vào giỏ hàng
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </Slider>
    )
}
