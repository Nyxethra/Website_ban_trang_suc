import React, { useEffect, useRef, useState } from 'react'
import ListItem from '../../components/listItem/ListItem';
import {useLocation} from 'react-router-dom'
import axios from '../../axios'
import numeral from 'numeral';
import {useSelector} from 'react-redux'
import {imgDb} from '../../firebase'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import CircularProgress from '@mui/material/CircularProgress';



export default function ProductDetail({getCart}) {
    const {currentUser}=useSelector(state=>state.user)
    const tabHome=useRef()
    const tabProfile=useRef()

   const homeTabRef=useRef()
   const profileTabRef=useRef()

   const handleProfileTab=()=>{
    homeTabRef.current.classList.add("d-none");
    profileTabRef.current.classList.add("d-block");

    homeTabRef.current.classList.remove("d-block");
    profileTabRef.current.classList.remove("d-none");

    tabHome.current.classList.remove("border-top", "border-4","border-danger");
    tabProfile.current.classList.add("border-top", "border-4","border-danger");
   }
   const handleHomeTab=()=>{
    homeTabRef.current.classList.remove("d-none");
    profileTabRef.current.classList.remove("d-block");

    homeTabRef.current.classList.add("d-block");
    profileTabRef.current.classList.add("d-none");

    tabHome.current.classList.add("border-top", "border-4","border-danger");
    tabProfile.current.classList.remove("border-top", "border-4","border-danger");
   }
   const [data,setData]=useState()
   const location = useLocation();
   const id=location.pathname.split('/')[3]
   
   const [mainImage, setMainImage] = useState(); 
    
    const handleSubImageClick = (subImageUrl) => {
        setMainImage(subImageUrl);
    };
   useEffect(()=>{
    const getData=async()=>{
        try {
            const res=await axios.get(`/product/${id}`)
            setData(res.data)
        } catch (err) {
            console.log(err)
        }
    }
    getData()
   },[id])
   
   const [image,setImage]=useState()
   const [imageUrl,setImageUrl]=useState([])
   const [video,setVideo]=useState()
   const [videoUrl,setVideoUrl]=useState([])
   const [imgPerc,setImgPerc]=useState(0)
   const [videoPerc,setVideoPerc]=useState(0)

   const upload=async(file,urlType)=>{
    try {
        const imgref=ref(imgDb,`/comment/${file.name}`)
        const uploadTask=uploadBytesResumable(imgref,file)
        uploadTask.on(
            "state_changed",
            (snapshot)=>{
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                urlType === "image" ? setImgPerc(Math.round(progress)) : setVideoPerc(Math.round(progress))
            },
            (err)=>console.log(err),
            async ()=> {
                const url = await getDownloadURL(uploadTask.snapshot.ref);
                if(urlType === "image")
                {
                  const newImageUrl=[...imageUrl]
                  newImageUrl.push(url)
                  setImageUrl(newImageUrl)
                }
                if(urlType === "video")
                {
                    const newVideoUrl=[...videoUrl]
                    newVideoUrl.push(url)
                    setVideoUrl(newVideoUrl)
                }
              }
        );
        } catch(err){
            console.log(err)
        }
    }
   useEffect(()=>{
    {image && upload(image,"image")}
   },[image])
   useEffect(()=>{
    {video && upload(video,"video")}
   },[video])
   console.log(imageUrl)

   const [value,setvalue]=useState({})
   const [page,setPage]=useState(1)
   const [limit,setLimit]=useState(10)

   const changeInput=(e)=>{
    setvalue(prev=>{
        return {...prev,[e.target.name]:e.target.value}
    })
   }
   const [comments,setComments]=useState([])
   const getComment=async()=>{
       try {
           const res=await axios.get(`/comment/getAll/${id}?page=${page}&limit=${limit}`)
           setComments(res.data)
        } catch (err) {
            console.log(err)
        }
    }
    const handleClick=async()=>{
     try {
         const res=await axios.post(`/comment/create/${id}`,{
             star:value.star,
             description:value.description,
             image:imageUrl,
             video:videoUrl
         })
         getComment()
         setImageUrl([])
         setVideoUrl([])
         alert("success")
     } catch (err) {
         console.log(err)
     }
    }
    useEffect(()=>{
        getComment()
    },[id])
    const handleAdd=async(price)=>{
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
    <div className='w-100'>
      <div className='container' style={{height:"30px"}}>
        <span style={{color:"#ff8c00",textTransform:"uppercase"}}><a href="/" className='text-decoration-none' style={{color:"#ff8c00"}}>Trang chủ</a>/ Chi tiết sản phẩm</span>
      </div>
      <div className='w-100'>
        <div className='container'>
            <div className="row gx-0">
                <div className='col-10'>
                    <div className='row gx-0'>
                    <div className="col-6">
                        <div className='border border-1 text-center 'style={{height:"350px"}}>
                            <img src={mainImage ? mainImage : data?.image} alt="" className='w-100 h-100'/>
                        </div>
                    <div className='container bg-light my-2'>
                        <div className='row row-cols-4 p-1'>
                            {data?.sub_image.map(s=>(
                            <div className='col border border-1' style={{height:"100px"}} onClick={()=>handleSubImageClick(s)}>
                                <img src={s} alt="" className='w-100 h-100'/>
                            </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="col-6">
                    <div className='container'>
                        <div className='w-100'>
                            <h4>{data?.name}</h4>
                        </div>
                        <div className='w-100 text-danger'>
                            <h5 className='fw-bold'>{numeral(data?.price).format('0,0')} ₫</h5>
                        </div>
                        <div className='w-100 bg-light p-2'>
                            <h5>HỖ TRỢ KHÁCH HÀNG</h5>
                            <p>Mọi thắc mắc vui lòng liên hệ Hotline/ Zalo: 0826.123.xxx hoặc thông qua www.facebook.com/Nhanh.vn để được giải đáp và hỗ trợ.</p>
                        </div>
                        <div className='w-100 bg-light p-2 mt-2'>
                            <p  >Mẫu trang sức tôn lên sự dịu dàng, nhưng cũng không kém phần cá tính, nổi bật. Chúng tôi tin chắc rằng, nàng sẽ trông thật sự nổi bật và thu hút sự chú ý xung quanh.</p>
                        </div>
                        <div className='w-100 mt-2'>
                            <h6>Size</h6>
                            <div className='container row row-cols-6 gap-1'>
                                {data?.size.map(z=>(
                                <div className='col border border-2 w-auto p-1 rounded-3 bg-light' style={{height:"40px",cursor:"pointer"}}>
                                    Size {z}
                                </div>
                                ))}
                                
                            </div>
                        </div>
                        <div className='mt-3 w-100'>
                            <button className='fw-bold' style={{height:"40px",width:"40px",border:"none"}}>-</button>
                            <input type="text" disabled placeholder='1' min={1} style={{width:"40px",height:"40px",fontWeight:"700",fontSize:"18px",padding:"10px",backgroundColor:"white"}}/>
                            <button className='fw-bold' style={{height:"40px",width:"40px",border:"none"}}>+</button>
                        </div>
                        <div className='w-100 mt-2 d-flex'>
                            <div type="button" onClick={()=>handleAdd(data.price)} className='text-uppercase text-decoration-none fw-bold text-white w-50 bg-info mt-3 rounded-3 d-flex justify-content-center align-items-center' style={{height:"40px"}}>Thêm vào giỏ hàng</div>
                            <a href='/cart' className='text-uppercase text-decoration-none fw-bold text-white w-50 bg-warning mt-3 rounded-3 d-flex justify-content-center align-items-center mx-2' style={{height:"40px"}}>Mua ngay</a>
                        </div>
                    </div>
                    </div>
                </div>
                <div className='mb-4' style={{marginRight:"20px"}}>
                    <nav className='w-100 d-flex'>
                        <div className='bg-light border-top border-4 border-danger text-center' ref={tabHome} style={{width:"100px",height:"30px",cursor:"pointer"}} onClick={handleHomeTab}>Mô tả</div>
                        <div className='bg-light text-center' ref={tabProfile} style={{width:"100px",height:"30px",cursor:"pointer"}} onClick={handleProfileTab}>Đánh giá({comments.count})</div>
                    </nav>
                    <div className='mt-0 w-100'>
                        <div className='border border-1 d-block p-2' ref={homeTabRef} style={{minHeight:"50px"}}>
                            <span className='p-2'>{data?.description}</span>
                        </div>
                        <div className='border border-1 p-4 d-none' ref={profileTabRef}>
                            <h5 className='fw-bold'>Đánh giá ({comments?.average}/5)</h5>
                            <div className='w-100 border border-2 border-danger my-1 p-4'>
                                <div className='d-flex'>
                                    <p className='fw-bold'>Đánh giá của bạn:</p>
                                    <select name="star" onChange={changeInput} id="" className='mx-4' style={{width:"70px",height:"30px"}}>
                                        <option value="1" selected>1 sao</option>
                                        <option value="2">2 sao</option>
                                        <option value="3">3 sao</option>
                                        <option value="4">4 sao</option>
                                        <option value="5">5 sao</option>
                                    </select>
                                </div>
                                <p className='fw-bold'>Nhận xét của bạn</p>
                                <textarea className='w-100 px-2' name="description" onChange={changeInput} placeholder='Viết gì đó'></textarea>
                                <div className='w-100 mb-4'>
                                    <input type="file" id='image' accept="image/*" onChange={e=>setImage(e.target.files[0])} name='image' hidden/>
                                    <input type="file" id='video' accept="video/*" onChange={e=>setVideo(e.target.files[0])} name='video' hidden/>
                                    <label type="button" htmlFor="image" className='border border-2 border-danger py-2 text-center' style={{fontSize:"12px",width:'100px',height:'40px'}}><i className='fa fa-photo text-danger'></i>Thêm ảnh</label>
                                    <label type="button" htmlFor="video" className="border border-2 border-danger mx-2 py-2 text-center" style={{fontSize:"12px",width:'100px',height:'40px'}}><i className='fa fa-camera text-danger'></i>Thêm video</label>
                                    <div className='d-flex flex-wrap gap-2 mt-1 w-100 '>
                                        {imageUrl && imageUrl.map(i=>(
                                            <img src={i} alt="" style={{width:"70px",height:"70px"}}/>
                                        ))}
                                        {videoUrl && videoUrl.map((v)=>(
                                            <video controls autoPlay style={{width:"70px",height:"70px"}}>
                                             <source src={v} type="video/mp4" />
                                           </video>
                                        ))}
                                    </div>  
                                </div>
                                <div className='border border-1 border-dark bg-light fs-5 d-flex justify-content-center align-items-center' onClick={handleClick} style={{width:"100px",height:"40px",cursor:"pointer"}}>Gửi đi</div>
                                <div className='w-100 mt-3 border-top border-4 border-dark'>
                                     {comments?.data?.map((c,index)=>(
                                    <div className='w-100 border-bottom border-1' key={index}>
                                         <div className='d-flex mt-3 align-items-center' key={index}>
                                            <div className="border rounded-circle" style={{width:"40px",height:"40px"}}>
                                              <img src={c?.image} alt="" className='img-fluid rounded-circle'/> 
                                            </div>
                                            <div className='mx-2'>
                                                <span style={{fontSize:"13px"}}>{c.name}</span>
                                                <div className='rating text-warning' style={{fontSize:"10px"}}>
                                                {[...Array(c.comment.star)].map((_, starIndex) => (
                                                    <i className='fa fa-star' key={starIndex}></i>
                                                    ))}
                                                </div>
                                                <p style={{fontSize:"10px"}}>{c?.comment.createdAt}</p>
                                            </div>
                                        </div>
                                        <div className='w-100 mb-1 px-2'>
                                            <span>{c.comment.description}</span>
                                        </div>
                                        <div className='w-100 d-flex flex-wrap mx-2 mb-1 gap-2'>
                                            {c?.comment?.image?.map((i,index)=>(
                                                <img src={i} alt="" key={index} style={{width:"70px",height:"70px",border:"1px solid gray"}}/>
                                            ))}
                                            {c?.comment?.video?.map((v,index)=>(
                                                <video controls autoPlay width={70} height={70}>
                                                 < source src={v} type="video/mp4" />
                                                </video>
                                            ))}
                                        </div>
                                    </div>
                                ))} 
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='mb-4' style={{marginRight:"20px"}}>
                    <div className='container bg-light border'>
                        <div className='d-flex justify-content-between' style={{height:"50px"}}>
                            <h3 className='text-dark'>Sản phẩm tương tự</h3>
                            <div className='border border-1 rounded-3 my-1 d-flex align-items-center' style={{height:"35px"}}>
                                <a href="" className='text-decoration-none mx-2 text-danger'>Xem thêm</a>
                                <i className='fa fa-angle-right text-danger'></i>
                            </div>
                        </div>
                        <div className='row row-cols-5 g-2'>
                            <ListItem/>
                            <ListItem/>
                            <ListItem/>
                            <ListItem/>
                            <ListItem/>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-2 mb-0">
                    <div className='w-100 border border-1'>
                        <div className='w-100 text-center border-bottom' style={{height:"40px"}}>
                            <h6>Bài viết mới cập nhật</h6>
                        </div>
                        <div className='mt-2 w-100 d-flex border-bottom'>
                            <div className='mx-2 my-1' style={{height:"50px",width:"40%"}}>
                                <img src="/assets/paper/p1.png" alt="" style={{width:"50px"}} className=' h-100 rounded-circle' />
                            </div>
                            <span style={{fontSize:"12px",color:"red"}}>Kim cương rời là gì? Có nên mua kim cương rời không?</span>
                        </div>
                        <div className='mt-2 w-100 d-flex border-bottom'>
                            <div className='mx-2 my-1' style={{height:"50px",width:"40%"}}>
                                <img src="/assets/paper/p2.png" alt="" style={{width:"50px"}} className=' h-100 rounded-circle' />
                            </div>
                            <span style={{fontSize:"12px",color:"red"}}>Ghi trọn khoảnh khắc trăm năm với những mẫu trang sức mới nhất</span>
                        </div>
                        <div className='mt-2 w-100 d-flex border-bottom'>
                            <div className='mx-2 my-1' style={{height:"50px",width:"40%"}}>
                                <img src="/assets/paper/p3.png" alt="" style={{width:"50px"}} className=' h-100 rounded-circle' />
                            </div>
                            <span style={{fontSize:"12px",color:"red"}}>Bí quyết phối áo len sành điệu cho thời trang dạo phố cuối năm</span>
                        </div>
                        <div className='mt-2 w-100 d-flex border-bottom'>
                            <div className='mx-2 my-1' style={{height:"50px",width:"40%"}}>
                                <img src="/assets/paper/p4.png" alt="" style={{width:"50px"}} className=' h-100 rounded-circle' />
                            </div>
                            <span style={{fontSize:"12px",color:"red"}}>PHÙ PHÉP KIM CƯƠNG ĐỂ MÓC TÚI NGƯỜI MUA</span>
                        </div>
                        <div className='mt-2 w-100 d-flex border-bottom'>
                            <div className='mx-2 my-1' style={{height:"50px",width:"40%"}}>
                                <img src="/assets/paper/p5.png" alt="" style={{width:"50px"}} className=' h-100 rounded-circle' />
                            </div>
                            <span style={{fontSize:"12px",color:"red"}}>VÀNG TRẮNG LÀ GÌ? GIÁ BAO NHIÊU? CÓ BỊ ĐEN HAY KHÔNG</span>
                        </div>
                        <div className='mt-2 w-100 d-flex border-bottom'>
                            <div className='mx-2 my-1' style={{height:"50px",width:"40%"}}>
                                <img src="/assets/paper/p6.png" alt="" style={{width:"50px"}} className=' h-100 rounded-circle' />
                            </div>
                            <span style={{fontSize:"12px",color:"red"}}>Hướng dẫn phân biệt kim cương thiên nhiên và kim cương nhân tạo</span>
                        </div>
                        <div className='mt-2 w-100 d-flex border-bottom'>
                            <div className='mx-2 my-1' style={{height:"50px",width:"40%"}}>
                                <img src="/assets/paper/p7.png" alt="" style={{width:"50px"}} className=' h-100 rounded-circle' />
                            </div>
                            <span style={{fontSize:"12px",color:"red"}}>Mặc áo dài truyền thống, những phụ kiện nào sẽ phù hợp nhất với nàng?</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}
