// Import React và các hooks cần thiết
import React,{ useEffect, useState } from 'react'
// Import cấu hình firebase storage đã được setup
import {imgDb} from '../../../firebase'
// Import các functions cần thiết từ firebase/storage để xử lý upload ảnh
import { ref, uploadBytesResumable,getDownloadURL } from 'firebase/storage'
// Import instance axios đã được cấu hình
import axios from '../../../axios'

export default function AddProduct() {
  // State lưu trữ file ảnh chính được chọn
  const [image,setImage]=useState("")
  // State lưu trữ URL của ảnh chính sau khi upload
  const [imageUrl,setImageUrl]=useState("")
  // State lưu trữ file ảnh phụ được chọn
  const [subImage,setSubImage]=useState("")
  // State lưu trữ mảng URL của các ảnh phụ sau khi upload
  const [subImageUrl,setSubImageUrl]=useState([])
  // State lưu trữ dữ liệu từ các input form
  const [input,setInput]=useState({})
  // State lưu trữ danh sách categories
  const [category,setCategory]=useState()
  // State theo dõi tiến trình upload ảnh (%)
  const [percent, setPercent] = useState(0);
  // State lưu trữ mảng các size được chọn
  const [size,setSize]=useState([])

  // Hàm xử lý khi người dùng nhập liệu vào form
  const handleChange=(e)=>{
    setInput(prev=>{
        return {...prev,[e.target.name]:e.target.value}
      })
  }

  // Hàm xử lý khi người dùng chọn/bỏ chọn size
  const handleSize=(event)=>{
    const selectedSize = event.target.value;
    // Kiểm tra nếu size đã tồn tại thì xóa, ngược lại thêm vào mảng
    if (size.includes(selectedSize)) {
      setSize(size.filter(s => s !== selectedSize));
    } else{
      setSize([...size,selectedSize])
    }
  }

  // useEffect chạy một lần khi component mount để lấy danh sách categories
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

  // Hàm xử lý upload ảnh lên firebase storage
  const upload=async(file,urlType)=>{
    try {
      // Tạo reference đến vị trí lưu file trên storage
      const imgRef = ref(imgDb, `/product/${file.name}`);
      // Bắt đầu upload file
      const uploadTask = uploadBytesResumable(imgRef, file);

      // Theo dõi tiến trình upload
      uploadTask.on(
        "state_changed",
        // Callback update tiến trình
        (snapshot) => {
            const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            setPercent(percent);
        },
        // Callback khi có lỗi
        (err) => console.log(err),
        // Callback khi upload hoàn tất
        async () => {
            // Lấy URL download của file vừa upload
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            // Nếu là ảnh phụ thì thêm vào mảng subImageUrl
            if(urlType === "sub_image")
            {
              const newImageSub=[...subImageUrl]
              newImageSub.push(url)
              setSubImageUrl(newImageSub)
            }
            // Nếu là ảnh chính thì set vào imageUrl
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

  // Hàm xử lý tạo sản phẩm mới
  const handleCreate=async(e)=>{
    e.preventDefault() // Ngăn chặn form submit mặc định
    try {
      // Gọi API tạo sản phẩm với dữ liệu từ form
      const res=await axios.post('/product/create',{
        name:input.name,           // Tên sản phẩm
        categoryId:input.category, // ID danh mục
        price:input.price,         // Giá
        description:input.description, // Mô tả
        size:size,                 // Mảng các size
        image:imageUrl,            // URL ảnh chính
        sub_image:subImageUrl      // Mảng URL ảnh phụ
      })
      alert("success")
      // Reset các state về giá trị mặc định sau khi tạo thành công
      setImage("")
      setImageUrl("")
      setSubImage("")
      setSubImageUrl("")
    } catch (err) {
      console.log(err)
    }
  }

  // useEffect theo dõi khi có ảnh chính mới được chọn
  useEffect(()=>{
    {image && upload(image,"image")} // Upload ảnh chính nếu có
  },[image])

  // useEffect theo dõi khi có ảnh phụ mới được chọn
  useEffect(()=>{
    {subImage && upload(subImage,"sub_image")} // Upload ảnh phụ nếu có
  },[subImage])

  return (
    // Container chính với chiều rộng và cao 100%, position relative để định vị các phần tử con
    <div className='w-100 h-100 position-relative'>
          <div className='my-3 rounded-3 d-flex flex-column align-items-center'>
            {/* Tiêu đề "Create New Product" với gradient background và shadow */}
            <div className='w-75 rounded-3 fw-bold text-white position-absolute fs-4 text-center py-2' 
                 style={{zIndex:"1",height:"60px",top:"-15px",
                        background:"linear-gradient(60deg, #ab47bc, #8e24aa)",
                        boxShadow:'0 4px 20px 0 rgba(0,0,0,.14), 0 7px 10px -5px rgba(156,39,176,.4)'}}>
              Create New Product
            </div>

            {/* Container chính của form với background trắng và shadow */}
            <div className='w-100 h-100 bg-white rounded-3 pb-5' 
                 style={{minHeight:"300px",
                        boxShadow:"0 2px 2px 0 rgba(0,0,0,.14), 0 3px 1px -2px rgba(0,0,0,.2), 0 1px 5px 0 rgba(0,0,0,.12)"}}>
              
              {/* Container của các input fields */}
              <div className='container border-bottom pb-4' style={{marginTop:"70px"}}>
                {/* Hàng 1: Name, Category, Price - chia làm 3 cột */}
                <div className='row row-cols-3'>
                  {/* Input tên sản phẩm */}
                  <div className=''>
                    <label htmlFor="name">Name</label>
                    <input type="text" name="name" id="name" placeholder='Enter Name...' 
                           onChange={handleChange} className='border-0 border-bottom mx-2' style={{outline:"none"}}/>
                  </div>

                  {/* Select box cho category */}
                  <div className=''>
                    <label htmlFor="category">Category</label>
                    <select name="category" id="category" onChange={handleChange} 
                            className='border-0 border-bottom mx-2' style={{outline:"none"}}>
                      <option value="">Select option</option>
                      {/* Map qua danh sách category để tạo các options */}
                      {category && category.map(c=>(
                        <option value={c._id} key={c._id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Input giá sản phẩm */}
                  <div className=''>
                    <label htmlFor="price">Price</label>
                    <input type="Number" name="price" id="price" onChange={handleChange} 
                           placeholder='Enter price...' className='border-0 border-bottom mx-2' style={{outline:"none"}}/>
                  </div>
                </div>

                {/* Hàng 2: Description và Size - chia làm 2 cột */}
                <div className='row row-cols-2 mt-3'>
                  {/* Textarea cho mô tả */}
                  <div className=''>
                    <label htmlFor="description">Description</label>
                    <textarea name="description" id="description" onChange={handleChange} rows="2" 
                              placeholder='Writing...' className='w-100 px-2 border-0 border-bottom' style={{outline:"none"}}></textarea>
                  </div>

                  {/* Phần chọn size */}
                  <div className=''>
                    <label>Size</label>
                    <input type="text" disabled placeholder='choose size' value={size} 
                           className='border-0 border-bottom mx-2' style={{outline:"none"}}/>
                    {/* Render 6 nút size từ 8-13 */}
                    <div className='mt-1 mx-5'>
                      {[...Array(6)].map((_, index) => (
                          <input type="button" key={index} name="size" id="size" 
                                 value={index + 8} onClick={handleSize}/>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Hàng 3: Upload ảnh - chia làm 2 cột */}
                <div className='row row-cols-2 mt-3'>
                  {/* Upload ảnh chính */}
                  <div className='d-flex flex-column'>
                    <label>Image</label>
                    <input type="file" name='image' id='image' onChange={e=>setImage(e.target.files[0])} hidden/>
                    <label type="button" htmlFor="image" className='btn btn-secondary my-2' 
                           style={{width:"80px",height:"35px"}}>Upload</label>
                    {/* Hiển thị % upload */}
                    {percent<100 && <span>{image && `${percent}%`}</span>}                    
                    {/* Preview ảnh đã upload */}
                    {imageUrl && 
                      <div className='border border-3 border-light' style={{width:"100px", height:"100px"}}>
                        <img src={imageUrl} alt="" style={{width:"100px", height:"100px"}}/>
                      </div>
                    }
                  </div>

                  {/* Upload nhiều ảnh phụ */}
                  <div className=''>
                    <label>Sub_image</label>
                    <input type="file" name='sub_image' id="sub_image" 
                           onChange={e=>setSubImage(e.target.files[0])} multiple hidden/>
                    <div className='d-flex gap-1 w-100 flex-wrap'>
                      {/* Preview các ảnh phụ đã upload */}
                      {subImageUrl && subImageUrl.map((i)=>(
                        <div className='border border-3 border-light' style={{width:"100px", height:"100px"}}>
                          <img src={i} alt="" style={{width:"100px", height:"100px"}}/>
                        </div>
                      ))}
                      {/* Hiển thị % upload */}
                      {percent<100 && <span>{subImage && `${percent}%`}</span>} 
                      {/* Nút thêm ảnh phụ */}
                      <label htmlFor="sub_image" type="button" 
                             className='border border-3 border-light d-flex justify-content-center align-items-center' 
                             style={{width:"100px", height:"100px",fontSize:"100px",color:"gray"}}>+</label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Nút Create để tạo sản phẩm mới */}
              <div type="button" className='w-25 rounded-3 fw-bold text-white fs-4 text-center py-2 mx-4 mt-3' 
                   style={{zIndex:"1",height:"60px",
                          background:"linear-gradient(60deg, #ab47bc, #8e24aa)",
                          boxShadow:'0 4px 20px 0 rgba(0,0,0,.14), 0 7px 10px -5px rgba(156,39,176,.4)'}} 
                   onClick={handleCreate}>Create</div>
            </div>
          </div>
        </div>
  )
}
