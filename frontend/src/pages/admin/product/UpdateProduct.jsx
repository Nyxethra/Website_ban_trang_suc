import React,{ useEffect, useState } from 'react'
import {imgDb} from '../../../firebase'
import { ref, uploadBytesResumable,getDownloadURL } from 'firebase/storage'
import axios from '../../../axios'


export default function UpdateProduct({openUpdate, setOpenUpdate, selectId, getAll}) {
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
        setSize(res.data.size || [])
        setImageUrl(res.data.image || "")
        setSubImageUrl(res.data.sub_image || [])
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
  const close = () => {
    setOpenUpdate(false);
  }
  console.log(input.categoryId)

  const handleDeleteSubImage = (indexToDelete) => {
    setSubImageUrl(prevImages => prevImages.filter((_, index) => index !== indexToDelete));
  };

  return (
    <>
      {openUpdate && (
        <>
          <div className="modal-overlay" onClick={close}></div>
          <div className="update-product-modal">
            <div className="modal-header">
              <h5 className="modal-title">Cập nhật sản phẩm</h5>
              <button className="modal-close-btn" onClick={close}>×</button>
            </div>
            
            <div className="modal-body">
              <form onSubmit={handleUpdate}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">Tên sản phẩm</label>
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        value={input.name}
                        onChange={handleChange}
                        placeholder="Nhập tên sản phẩm..."
                      />
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">Danh mục</label>
                      <select 
                        name="categoryId"
                        className="form-control"
                        value={input.categoryId}
                        onChange={handleChange}
                      >
                        <option value="">Chọn danh mục</option>
                        {category?.map(c => (
                          <option key={c._id} value={c._id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">Giá</label>
                      <input
                        type="number"
                        name="price"
                        className="form-control"
                        value={input.price}
                        onChange={handleChange}
                        placeholder="Nhập giá..."
                      />
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="form-group">
                      <label className="form-label">Mô tả</label>
                      <textarea
                        name="description"
                        className="form-control"
                        rows="3"
                        value={input.description}
                        onChange={handleChange}
                        placeholder="Nhập mô tả sản phẩm..."
                      ></textarea>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="form-group">
                      <label className="form-label">Kích thước</label>
                      <div className="size-buttons">
                        {[...Array(6)].map((_, index) => (
                          <button
                            key={index}
                            type="button"
                            className={`size-button ${size.includes((index + 8).toString()) ? 'active' : ''}`}
                            value={index + 8}
                            onClick={handleSize}
                          >
                            {index + 8}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">Hình ảnh chính</label>
                      <input
                        type="file"
                        id="image"
                        onChange={e => setImage(e.target.files[0])}
                        hidden
                      />
                      <label htmlFor="image" className="image-preview">
                        {imageUrl ? (
                          <img src={imageUrl} alt="" className="img-fluid"/>
                        ) : (
                          <i className="fa fa-plus"></i>
                        )}
                      </label>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">Hình ảnh phụ</label>
                      <div className="d-flex gap-2 flex-wrap">
                        {Array.isArray(subImageUrl) && subImageUrl.map((url, index) => (
                          <div key={index} className="sub-image-container">
                            <button 
                              type="button"
                              className="delete-image-btn"
                              onClick={() => handleDeleteSubImage(index)}
                            >
                              ×
                            </button>
                            <div className="image-preview">
                              <img src={url} alt="" className="img-fluid"/>
                            </div>
                          </div>
                        ))}
                        <input
                          type="file"
                          id="sub_image"
                          onChange={e => setSubImage(e.target.files[0])}
                          hidden
                        />
                        <label htmlFor="sub_image" className="image-preview">
                          <i className="fa fa-plus"></i>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-end mt-4">
                  <button type="submit" className="update-btn">
                    <i className="fa fa-save me-2"></i>
                    Cập nhật
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  )
}
