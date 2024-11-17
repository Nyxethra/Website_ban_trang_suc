import React,{ useEffect, useState } from 'react'
import {imgDb} from '../../../firebase'
import { ref, uploadBytesResumable,getDownloadURL } from 'firebase/storage'
import axios from '../../../axios'


export default function UpdateProduct({openUpdate,selectId,getAll}) {
    const [image,setImage]=useState("")
    const [imageUrl,setImageUrl]=useState("")
    const [subImage,setSubImage]=useState("")
    const [subImageUrl,setSubImageUrl]=useState([])
  const [input,setInput]=useState({})
  const [category,setCategory]=useState()
  const [data,setData]=useState([])
  const [percent, setPercent] = useState(0);
  const [size,setSize]=useState([])
  const handleChange=(e)=>{
    setInput(prev=>{
        return {...prev,[e.target.name]:e.target.value}
      })
  }
  const handleSize=(event)=>{
    const selectedSize = event.target.value;
    if (size.includes(selectedSize)) {
      setSize(size.filter(s => s !== selectedSize));
    } else{
      setSize([...size,selectedSize])
    }
  }

  useEffect(()=>{
    const getProduct=async()=>{
      try {
        const res=await axios.get(`/product/${selectId}`)
        setData(res.data)
        setSize(res.data.size)
        setImageUrl(res.data.image)
        setSubImageUrl(res.data.sub_image)
        setInput({
            name:res.data.name,
            categoryId:res.data.categoryId,
            price:res.data.price,
            description:res.data.description,

        })
      } catch (err) {
        console.log(err)
      }
    }
    getProduct()
   },[selectId])
 useEffect(()=>{
  const getCategory=async()=>{
    try {
      const res=await axios.get('/category')
      setCategory(res.data)
    } catch (err) {
      console.log(err)
    }
  }
  getCategory()
 },[])
  const upload=async(file,urlType)=>{
    try {
      const imgRef = ref(imgDb, `/product/${file.name}`);
      const uploadTask = uploadBytesResumable(imgRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
            const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            setPercent(percent);
        },
        (err) => console.log(err),
        async () => {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            if(urlType === "sub_image")
            {
                const newImageSub=[...subImageUrl]
                newImageSub.push(url)
                setSubImageUrl(newImageSub)
            }
            if(urlType === "image")
            {
                setImageUrl(url)
            }
          }
    );
  }catch (err) {
    console.error("Error uploading image:", err);
    }
  }

  const handleUpdate=async(e)=>{
    e.preventDefault()
    try {
      const res=await axios.put(`/product/update/${selectId}`,{
        name:input.name,
        categoryId:input.categoryId,
        price:input.price,
        description:input.description,
        size:size,
        image:imageUrl,
        sub_image:subImageUrl
      })
      getAll()
      alert("success")
      setImage('')
      setImageUrl("")
      setSubImage("")
      setSubImageUrl("")
    } catch (err) {
      console.log(err)
    }
  }
  useEffect(()=>{
    {image && upload(image,"image")}
  },[image])
  useEffect(()=>{
    {subImage && upload(subImage,"sub_image")}
  },[subImage])
  const close=()=>{
    openUpdate(false)
  }
  console.log(input.categoryId)
  return (
        <div className=' w-100 h-75 position-relative' style={{top:'-450px',zIndex:1000,display: openUpdate?'block':'none'}}>
            <div className='my-3 rounded-3 d-flex flex-column align-items-center'>
                <div className='w-75 rounded-3 fw-bold text-white position-absolute fs-4 text-center py-2' style={{zIndex:"1",height:"60px",top:"-15px",background:"linear-gradient(60deg, #ab47bc, #8e24aa)",boxShadow:'0 4px 20px 0 rgba(0,0,0,.14), 0 7px 10px -5px rgba(156,39,176,.4)'}}>
                Update Product
                </div>
                <div className='w-100 h-100 bg-white rounded-3 pb-5' style={{minHeight:"300px",boxShadow:"0 2px 2px 0 rgba(0,0,0,.14), 0 3px 1px -2px rgba(0,0,0,.2), 0 1px 5px 0 rgba(0,0,0,.12)"}}>
                <div className='container border-bottom pb-4' style={{marginTop:"70px"}}>
                    <div className='row row-cols-3'>
                    <div className=''>
                        <label htmlFor="name" className=''>Name</label>
                        <input type="text" name="name" id="name" placeholder='Enter Name...' value={input.name} onChange={handleChange} className='border-0 border-bottom mx-2 ' style={{outline:"none"}}/>
                    </div>
                    <div className=''>
                        <label htmlFor="category" className=''>Category</label>
                        <select name="category"onChange={handleChange} className='border-0 border-bottom mx-2 ' style={{outline:"none"}}>
                        <option disabled value>Select option</option>
                            {category && category.map((c)=>(
                                <option value={c._id} key={c._id}>{c.name}</option>
                            ))
                            }   
                        </select>
                    </div>
                    <div className=''>
                        <label htmlFor="price" className=''>Price</label>
                        <input type="Number" value={input.price} name="price" id="price" onChange={handleChange} placeholder='Enter price...' className='border-0 border-bottom mx-2 ' style={{outline:"none"}}/>
                    </div>
                    </div>
                    <div className='row row-cols-2 mt-3'>
                    <div className=''>
                        <label htmlFor="description" className=''>Description</label>
                        <textarea name="description" value={input.description} id="description" onChange={handleChange} rows="2" placeholder='Writing...' className='w-100 px-2 border-0 border-bottom' style={{outline:"none"}}></textarea>
                    </div>
                    <div className=''>
                        <label htmlFor="" className=''>Size</label>
                        <input type="text" disabled placeholder='choose size' value={size} className='border-0 border-bottom mx-2 ' style={{outline:"none"}}/>
                        <div className='mt-1 mx-5'>
                        {[...Array(6)].map((_, index) => (
                            <input type="button" key={index} name="size" id="size" value={index + 8} onClick={handleSize}/>
                        ))}
                        </div>
                    </div>
                    </div>
                    <div className='row row-cols-2 mt-3'>
                    <div className='d-flex flex-column'>
                        <label htmlFor="">Image</label>
                        <input type="file" name='image' id='image' onChange={e=>setImage(e.target.files[0])} hidden/>
                        <label type="button" htmlFor="image" className='btn btn-secondary my-2' style={{width:"80px",height:"35px"}}>Upload</label>
                        {imageUrl && 
                        <div className='border border-3 border-light' style={{width:"100px", height:"100px"}}>
                            <img src={imageUrl} alt="" style={{width:"100px", height:"100px"}}/>
                        </div>
                        }
                    </div>
                    <div className=''>
                        <label htmlFor="">Sub_image</label>
                        <input type="file" name='sub_image' id="sub_image" onChange={e=>setSubImage(e.target.files[0])} multiple  hidden/>
                        <div className='d-flex gap-1 w-100 flex-wrap'>
                        {subImageUrl && subImageUrl.map((i)=>(
                            <div className='border border-3 border-light' style={{width:"100px", height:"100px"}}>
                            <img src={i} alt="" style={{width:"100px", height:"100px"}}/>
                            </div>
                        ))}
                        <label htmlFor="sub_image" type="button" className='border border-3 border-light d-flex justify-content-center align-items-center' style={{width:"100px", height:"100px",fontSize:"100px",color:"gray"}}>+</label>
                        </div>
                    </div>
                    </div>
                </div>
                <div type="button" className='w-25 rounded-3 fw-bold text-white fs-4 text-center py-2 mx-4 mt-3' style={{zIndex:"1",height:"60px",background:"linear-gradient(60deg, #ab47bc, #8e24aa)",boxShadow:'0 4px 20px 0 rgba(0,0,0,.14), 0 7px 10px -5px rgba(156,39,176,.4)'}} onClick={handleUpdate}>Update</div>
                </div>
            </div>
            <div><i className='fa fa-close position-absolute p-4 fs-3' onClick={close} style={{top:0,right:0}}></i></div>
        </div>
  )
}
