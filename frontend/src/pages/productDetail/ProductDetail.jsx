import React, { useEffect, useRef, useState } from 'react'
import ListItem from '../../components/listItem/ListItem';
import {useLocation} from 'react-router-dom'
import axios from '../../axios'
import numeral from 'numeral';
import {useSelector} from 'react-redux'
import {imgDb} from '../../firebase'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import CircularProgress from '@mui/material/CircularProgress';
import { addToCart } from '../../utils/cartUtils';

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
    const [quantity, setQuantity] = useState(1)
    const [activeTab, setActiveTab] = useState('description')

    const handleAdd = async() => {
        const success = await addToCart(id, data?.price, quantity);
        if (success) {
            getCart();
            alert("Add to cart success");
        }
    }

    const [relatedProducts, setRelatedProducts] = useState([]);

    useEffect(() => {
        const getRelatedProducts = async () => {
            if (data?.categoryId) {
                try {
                    const res = await axios.get(`/product/category/${data.categoryId}`);
                    const filtered = res.data
                        .filter(product => product._id !== id)
                        .slice(0, 5);
                    setRelatedProducts(filtered);
                } catch (err) {
                    console.log(err);
                }
            }
        };
        getRelatedProducts();
    }, [data, id]);

    const handleRelatedAdd = async(productId, price) => {
        const success = await addToCart(productId, price, 1);
        if (success) {
            getCart();
            alert("Add to cart success");
        }
    }

  return (
    <div className='product-detail-page'>
      <div className='container'>
        <div className='breadcrumb mb-4'>
          <a href="/" className='text-decoration-none'>Trang chủ</a>
          <span className="mx-2">/</span>
          <span>Chi tiết sản phẩm</span>
        </div>

        <div className='product-detail-container'>
          <div className='row'>
            {/* Gallery Section */}
            <div className='col-md-6'>
              <div className='product-gallery'>
                <img 
                  src={mainImage || data?.image} 
                  alt={data?.name}
                  className="product-detail-image"
                />
                <div className='product-thumbnails'>
                  <img 
                    src={data?.image}
                    alt="Main"
                    className={`product-thumbnail ${!mainImage ? 'active' : ''}`}
                    onClick={() => setMainImage(data?.image)}
                  />
                  {data?.sub_image?.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      className={`product-thumbnail ${mainImage === img ? 'active' : ''}`}
                      onClick={() => setMainImage(img)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Product Info Section */}
            <div className='col-md-6'>
              <div className='product-info-container'>
                <h1 className='product-title'>{data?.name}</h1>
                <div className='product-price'>
                  {numeral(data?.price).format('0,0')} ₫
                </div>
                <div className='product-description'>
                  {data?.description}
                </div>

                <div className='quantity-selector'>
                  <button 
                    className='quantity-btn'
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  >-</button>
                  <input 
                    type="number"
                    className='quantity-input'
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                  />
                  <button 
                    className='quantity-btn'
                    onClick={() => setQuantity(prev => prev + 1)}
                  >+</button>
                </div>

                <div className='action-buttons'>
                  <button className='add-to-cart-btn' onClick={handleAdd}>
                    <i className='fa fa-shopping-cart me-2'></i>
                    Thêm vào giỏ
                  </button>
                  <button className='buy-now-btn'>
                  <a href='/cart/checkout' className='text-decoration-none text-white'>
                    Mua ngay
                  </a>
                  </button>
                </div>

                <div className='product-meta'>
                  <div className='meta-item'>
                    <span className='meta-label'>Mã sản phẩm:</span>
                    <span>{data?.sku || 'N/A'}</span>
                  </div>
                  <div className='meta-item'>
                    <span className='meta-label'>Danh mục:</span>
                    <span>{data?.category?.name || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className='product-tabs'>
            <div className='tab-buttons'>
              <button 
                className={`tab-button ${activeTab === 'description' ? 'active' : ''}`}
                onClick={() => setActiveTab('description')}
              >
                Mô tả sản phẩm
              </button>
              <button 
                className={`tab-button ${activeTab === 'reviews' ? 'active' : ''}`}
                onClick={() => setActiveTab('reviews')}
              >
                Đánh giá
              </button>
            </div>

            <div className='tab-content'>
              {activeTab === 'description' ? (
                <div className='description-content'>
                  {data?.description}
                </div>
              ) : (
                <div className='reviews-content'>
                  {/* Existing reviews content */}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
            <div className='related-products mt-5'>
                <div className='section-header d-flex justify-content-between align-items-center mb-4'>
                    <h3 className='section-title m-0'>Sản phẩm tương tự</h3>
                    <a href={`/product/category/${data?.categoryId}`} className='view-all-link'>
                        Xem tất cả <i className='fa fa-angle-right ms-2'></i>
                    </a>
                </div>
                
                <div className='row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4'>
                    {relatedProducts.map((product) => (
                        <div className='col' key={product._id}>
                            <div className="product-item">
                                <a href={`/product/productDetail/${product._id}`} className='text-decoration-none'>
                                    <div className='product-image-container'>
                                        <img src={product.image} alt={product.name} className="product-image"/>
                                    </div>
                                    <div className='product-info'>
                                        <h3 className='product-name'>{product.name}</h3>
                                        <div className='product-price'>
                                            {numeral(product.price).format('0,0')} ₫
                                        </div>
                                    </div>
                                </a>
                                <button 
                                    className='add-to-cart-btn'
                                    onClick={() => handleRelatedAdd(product._id, product.price)}
                                >
                                    Thêm vào giỏ hàng
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}
      </div>
    </div>
  )
}
