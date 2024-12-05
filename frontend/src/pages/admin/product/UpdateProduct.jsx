// Import các thư viện cần thiết
import React,{ useEffect, useState } from 'react' // Import React và hooks
import {imgDb} from '../../../firebase' // Import cấu hình firebase storage
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage' // Import các hàm xử lý storage từ firebase
import axios from '../../../axios' // Import axios đã được cấu hình

// Component UpdateProduct nhận vào các props để xử lý
export default function UpdateProduct({openUpdate, setOpenUpdate, selectId, getAll}) {
    // Khai báo các state quản lý ảnh
    const [image,setImage] = useState("") // Ảnh chính
    const [imageUrl,setImageUrl] = useState("") // URL ảnh chính
    const [subImage,setSubImage] = useState("") // Ảnh phụ
    const [subImageUrl,setSubImageUrl] = useState([]) // Mảng URL ảnh phụ
    
    // Các state khác
    const [input,setInput] = useState({}) // Dữ liệu form
    const [category,setCategory] = useState() // Danh mục sản phẩm
    const [data,setData] = useState([]) // Dữ liệu sản phẩm
    const [percent, setPercent] = useState(0) // Phần trăm upload
    const [size,setSize] = useState([]) // Kích thước sản phẩm

    // Hàm xử lý thay đổi input
    const handleChange = (e) => {
        setInput(prev => ({...prev, [e.target.name]: e.target.value}))
    }

    // Hàm xử lý chọn size
    const handleSize = (event) => {
        const selectedSize = event.target.value
        if (size.includes(selectedSize)) {
            setSize(size.filter(s => s !== selectedSize)) // Bỏ chọn size
        } else {
            setSize([...size, selectedSize]) // Thêm size mới
        }
    }

    // Hook lấy thông tin sản phẩm khi selectId thay đổi
    useEffect(() => {
        const getProduct = async () => {
            try {
                const res = await axios.get(`/product/${selectId}`)
                // Cập nhật các state với dữ liệu từ API
                setData(res.data)
                setSize(res.data.size || [])
                setImageUrl(res.data.image || "")
                setSubImageUrl(res.data.sub_image || [])
                setInput({
                    name: res.data.name,
                    categoryId: res.data.categoryId,
                    price: res.data.price,
                    description: res.data.description,
                })
            } catch (err) {
                console.log(err)
            }
        }
        getProduct()
    }, [selectId])

    // Hook lấy danh sách danh mục
    useEffect(() => {
        const getCategory = async () => {
            try {
                const res = await axios.get('/category')
                setCategory(res.data)
            } catch (err) {
                console.log(err)
            }
        }
        getCategory()
    }, [])

    // Hàm upload ảnh lên firebase
    const upload = async (file, urlType) => {
        try {
            const imgRef = ref(imgDb, `/product/${file.name}`)
            const uploadTask = uploadBytesResumable(imgRef, file)
            
            // Theo dõi tiến trình upload
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
                    setPercent(percent)
                },
                (err) => console.log(err),
                async () => {
                    // Lấy URL sau khi upload thành công
                    const url = await getDownloadURL(uploadTask.snapshot.ref)
                    if(urlType === "sub_image") {
                        setSubImageUrl(prev => [...prev, url])
                    }
                    if(urlType === "image") {
                        setImageUrl(url)
                    }
                }
            )
        } catch (err) {
            console.error("Error uploading image:", err)
        }
    }

    // Hàm xử lý cập nhật sản phẩm
    const handleUpdate = async (e) => {
        e.preventDefault()
        try {
            await axios.put(`/product/update/${selectId}`, {
                name: input.name,
                categoryId: input.categoryId,
                price: input.price,
                description: input.description,
                size: size,
                image: imageUrl,
                sub_image: subImageUrl
            })
            getAll() // Refresh danh sách
            alert("success")
            // Reset các state
            setImage('')
            setImageUrl("")
            setSubImage("")
            setSubImageUrl("")
        } catch (err) {
            console.log(err)
        }
    }

    // Hooks xử lý upload ảnh khi có thay đổi
    useEffect(() => {
        image && upload(image, "image")
    }, [image])

    useEffect(() => {
        subImage && upload(subImage, "sub_image")
    }, [subImage])

    // Hàm đóng modal
    const close = () => {
        setOpenUpdate(false)
    }

    // Hàm xóa ảnh phụ
    const handleDeleteSubImage = (indexToDelete) => {
        setSubImageUrl(prevImages => prevImages.filter((_, index) => index !== indexToDelete))
    }

    // Phần return JSX hiển thị form cập nhật trong modal
    // Gồm các input cho tên, danh mục, giá, mô tả, size và ảnh
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
