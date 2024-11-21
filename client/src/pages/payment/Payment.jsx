import React, { useEffect,useState } from 'react'
import axio from '../../axios'
import numeral from 'numeral';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function Payment({data,total,getCart}) {
    const [paymentMethod, setPaymentMethod] = useState('');
    const handlePayment = (e) => {
        setPaymentMethod(e.target.value);
    };
    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [product,setProducts]=useState([{}])
    const [orderCreated, setOrderCreated] = useState(false);
    useEffect(()=>{
        if (data && data.data) {
            const updatedProducts = data.data.map(item => ({
                productId: item.product[0]._id,
                quantity: item.quantity
            }));
            setProducts(updatedProducts);
        }
    },[data])
    useEffect(()=>{
        const params = new URLSearchParams(window.location.search);
        const status = params.get('Message');
        setOrderCreated(true);
        if(status && status=="Success" && total!== 0 && product.length>0&& orderCreated){
            window.onload = createOrder
            setOrderCreated(false);
            Swal.fire({
                icon: 'success',
                title: 'Đơn hàng đã được tạo thành công!',
                showConfirmButton: false,
                timer: 5000 
            });
        }
    },[orderCreated,product,total,paymentMethod])
    const createOrder = async () => {
        try {
            await axio.post('/order/create', {
                product: product,
                price: total,
                paymentStatus: "Đã thanh toán"
            });
            getCart()
        } catch (error) {
            console.error("Error creating order:", error);
        }
    };
    const handleCheckout=async()=>{
    try {
        if(paymentMethod==""){
            return alert("Vui lòng chọn phương thức thanh toán")
        }
        if(data.data.length==0){
            return alert("Bạn không có đơn hàng nào")
        }   
        if(paymentMethod=="Chưa thanh toán"){
            await axio.post('/order/create', {
                product: product,
                price: total,
                paymentStatus: "Chưa thanh toán"
            });
            getCart()
            Swal.fire({
                icon: 'success',
                title: 'Đơn hàng đã được tạo thành công!',
                showConfirmButton: false,
                timer: 5000 
            });
        }else{
            const res= await axio.post('/create_payment_url',{
                amount :total,
                bankCode : "NCB",
                orderInfo : "fdfd",
                orderType : "dfdfd",
                language:"vn",
            })
            window.location.href = res.data.paymentUrl;
        }
    } catch (err) {
        console.log(err)
    }
    }

    useEffect(()=>{
        axios.get("https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json")
        .then(result=>setCities(result.data))
    },[])
    const handleCityChange = (e) => {
        const selectedCityName = e.target.value;
        const selectedCity = cities.find(city => city.Name === selectedCityName);
        if (selectedCity) {
          setDistricts(selectedCity.Districts);
        }
      };    
      const handleDistrictChange = (e) => {
        const selectedDistrictName = e.target.value;
        const selectedDistrict = districts.find(district => district.Name === selectedDistrictName);
        if (selectedDistrict) {
          setWards(selectedDistrict.Wards);
        }
      };
  return (
    <div className='w-100 my-2'>
      <div className='container'>
        <div className='w-100'>
            <span className='d-flex text-dark'>Bạn có mã ưu đãi? <div type="button" className='text-#b8860b'> Ấn vào đây để nhập mã</div></span>
            <div className='border border-2 border-#b8860b p-3 d-none'>
                <span className='text-dark'>Nếu bạn có mã giảm giá, vui lòng điền vào phía bên dưới.</span>
                <div className='w-100 d-flex mt-3'>
                    <input type="text" className='w-75' placeholder='Mã ưu đãi'/>
                    <div type="button" className='btn btn-primary mx-2' style={{width:"100px"}}>ÁP DỤNG</div>
                </div>
            </div>
        </div>
        <div className='my-4'>
            <div className='row'>
                <div className="col-7 border-top border-2 mt-2">
                    <h4>THÔNG TIN THANH TOÁN</h4>
                    <div>
                        <label htmlFor="" className='fw-bold'>Họ và tên *</label>
                        <input type="text" className='form-control form-control-sm mb-3' required/>
                    </div>
                    <div>
                        <label htmlFor="" className='fw-bold'>Tỉnh/ Thành phố*</label>
                        <select class="form-select form-select-sm mb-3" id="city" onChange={handleCityChange} aria-label=".form-select-sm">
                            <option value="" selected>Chọn tỉnh thành</option>  
                            {cities.map(city => (
                                <option key={city.Id} value={city.Name}>{city.Name}</option>
                            ))}         
                        </select>
                    </div>
                    <div>
                        <label htmlFor="" className='fw-bold'>Phường/ Xã*</label>
                        <select class="form-select form-select-sm mb-3" id="district" onChange={handleDistrictChange} aria-label=".form-select-sm">
                            <option value="" selected>Chọn quận huyện</option>
                            {districts.map(district => (
                                <option key={district.Id} value={district.Name}>{district.Name}</option>
                            ))}  
                        </select>
                    </div>
                    <div>
                        <label htmlFor="" className='fw-bold'>Địa chỉ *</label>
                        <select class="form-select form-select-sm mb-3" id="ward" aria-label=".form-select-sm">
                            <option value="" selected>Chọn phường xã</option>
                            {wards.map(ward => (
                                <option key={ward.Id} value={ward.Name}>{ward.Name}</option>
                            ))}  
                        </select>
                    </div>
                    <div>
                        <label htmlFor="" className='fw-bold'>Số điện thoại *</label>
                        <input type="text" className='form-control form-control-sm mb-3' required/>
                    </div>
                    <h4>THÔNG TIN BỔ SUNG</h4>
                    <div>
                        <label htmlFor="" className='fw-bold'>Ghi chú đơn hàng (tuỳ chọn)</label>
                        <textarea name="" id="" cols="30" rows="4" className='form-control form-control-sm mb-3'></textarea>
                    </div>
                </div>
                <div className="col-5 mt-2">
                    <div className='border border-2 border-#b8860b p-4'>
                        <h5>ĐƠN HÀNG CỦA BẠN</h5>
                        <table className='table'>
                            <thead>
                                <tr className='' style={{borderBottom:"2px solid gray"}}>
                                    <th>SẢN PHẨM</th>
                                    <th>TỔNG</th>
                                </tr>
                            </thead>
                            <tbody>
                               {data?.data?.length>0 
                               ? data?.data?.map((item,index)=>(
                                 <tr key={index} className=''>
                                    <th style={{fontWeight:"400"}}>{item?.product[0]?.name} x{item?.quantity}</th>
                                    <th className='text-#b8860b' style={{fontSize:"14px"}}>{numeral(item?.totalAmount).format('0,0')} đ</th>
                                 </tr>
                               ))
                               : <tr>
                                  <th className='text-#b8860b text-center'>Đơn hàng của bạn trống</th>
                               </tr>
                    
                            }
                               <tr className='' style={{borderBottom:"2px solid gray"}}>
                                    <th className=''>TỔNG</th>
                                    <th className='text-#b8860b' style={{fontSize:"14px"}}>{numeral(total).format('0,0')} đ</th>
                                 </tr>
                            </tbody>
                        </table>
                        <div className='w-100'>
                            <div className='w-100 mb-3'>
                                <input type="radio" name="paymentMethod" value="Chưa thanh toán" onChange={handlePayment} />
                                <span className='fw-bold mx-2'>Thanh toán khi nhận hàng</span>
                            </div>
                            <div className='w-100 mb-3'>
                                <input type="radio" className=''name="paymentMethod" value="Đã thanh toán" onChange={handlePayment}/>
                                <span className='fw-bold mx-2'>Thanh toán bằng hình thức trực tuyến</span>
                            </div>
                            <button  type="button" className='btn btn-primary mb-3'disabled={!data?.data || data?.data?.length === 0} onClick={handleCheckout}>Đặt hàng</button>
                            <div className=''>Thông tin cá nhân của bạn sẽ được sử dụng để xử lý đơn hàng, tăng trải nghiệm sử dụng website, và cho các mục đích cụ thể khác đã được mô tả trong <a href='#' style={{color:"#b8860b",textDecoration:"none"}}>chính sách riêng tư</a>.</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  ) 
}
