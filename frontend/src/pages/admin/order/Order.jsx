// Import các thư viện React cần thiết
import React, { useState, useEffect } from 'react'
// Import axios đã được cấu hình
import axios from '../../../axios'
// Import thư viện để format số
import numeral from 'numeral'
// Import CSS
import './Order.css'

export default function Order() {
    // Khởi tạo state lưu danh sách đơn hàng
    const [data,setData]=useState([])
    // State lưu trạng thái xác nhận đơn hàng
    const [status,setStatus]=useState()
    // State lưu trạng thái thanh toán
    const [payment,setPayment]=useState()

    // Hàm lấy dữ liệu đơn hàng từ server
    const getData=async()=>{
        try {
            // Gọi API lấy tất cả đơn hàng
            const res=await axios.get('/order/all')
            // Xử lý thông tin chi tiết sản phẩm cho mỗi đơn hàng
            const ordersWithProducts = await Promise.all(res.data.map(async order => {
                // Tạo Map để lưu và gom nhóm sản phẩm
                const productMap = new Map();
                
                // Lặp qua từng sản phẩm trong đơn hàng
                await Promise.all(order.product
                    .filter(p => p.productId) // Lọc bỏ sản phẩm không có ID
                    .map(async p => {
                        try {
                            // Lấy thông tin chi tiết của sản phẩm
                            const productRes = await axios.get(`/product/${p.productId}`)
                            
                            // Kiểm tra nếu sản phẩm đã tồn tại trong Map
                            if (productMap.has(p.productId)) {
                                const existingProduct = productMap.get(p.productId);
                                // Cập nhật số lượng nếu sản phẩm đã tồn tại
                                productMap.set(p.productId, {
                                    ...existingProduct,
                                    quantity: existingProduct.quantity + (p.quantity || 1)
                                });
                            } else {
                                // Thêm sản phẩm mới vào Map
                                productMap.set(p.productId, {
                                    ...p,
                                    productDetails: productRes.data,
                                    quantity: p.quantity || 1
                                });
                            }
                        } catch (err) {
                            console.log(`Error fetching product ${p.productId}:`, err)
                        }
                    }))

                // Chuyển đổi Map thành mảng
                const mergedProducts = Array.from(productMap.values());
                
                // Trả về đơn hàng với danh sách sản phẩm đã được xử lý
                return {
                    ...order,
                    product: mergedProducts
                }
            }))
            // Cập nhật state với dữ liệu mới
            setData(ordersWithProducts)
        } catch (err) {
            console.log(err)
        }
    }

    // Hàm xóa đơn hàng
    const handleDelete=async(id)=>{
        try {
            await axios.delete(`/order/delete/${id}`)
            getData() // Cập nhật lại danh sách sau khi xóa
            alert("success")
        } catch (err) {
            console.log(err)
        }
    }

    // Gọi API lấy dữ liệu khi component được mount
    useEffect(()=>{
        getData()
    },[])

    // Hàm cập nhật trạng thái xác nhận đơn hàng
    const handleStatus=async(id,status)=>{
        try {
            let newStatus;
            // Luôn chuyển sang trạng thái "Đã xác nhận" (có vẻ như có lỗi logic ở đây)
            if(status==="Chưa xác nhận"){
                newStatus="Đã xác nhận"
            }else{
                newStatus="Đã xác nhận"
            }
            // Gọi API cập nhật trạng thái
            await axios.put(`/order/update/${id}`,{confimationStatus:newStatus})
            getData() // Cập nhật lại danh sách
        } catch (err) {
            console.log(err)
        }
    }

    // Hàm cập nhật trạng thái thanh toán
    const handlePayment=async(id,statusPayment)=>{
        try {
            let newStatusPayment;
            // Luôn chuyển sang trạng thái "Đã thanh toán" (có vẻ như có lỗi logic ở đây)
            if(statusPayment==="Chưa thanh toán"){
                newStatusPayment="Đã thanh toán"
            }else{
                newStatusPayment="Đã thanh toán"
            }
            // Gọi API cập nhật trạng thái thanh toán
            await axios.put(`/order/update/${id}`,{paymentStatus:newStatusPayment})
            getData() // Cập nhật lại danh sách
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className='w-100 mt-3'>
            <p>List Order</p>
            {/* Tạo bảng hiển thị danh sách đơn hàng */}
            <table className="table table-bordered">
                <thead>
                    {/* Header của bảng */}
                    <tr>
                        <th scope="col">OrderId</th>
                        <th scope="col">Products</th>
                        <th scope="col">CreateAt</th>
                        <th scope="col">Price</th>
                        <th scope="col">Status</th>
                        <th scope="col">Payment</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Kiểm tra và hiển thị dữ liệu */}
                    {data.length>0 
                    ? (data.map(o=>(
                        // Hiển thị thông tin từng đơn hàng
                        <tr key={o._id}>
                            <th scope="row">{o._id}</th>
                            <td>
                                {/* Hiển thị danh sách hình ảnh sản phẩm */}
                                <div className="d-flex flex-wrap gap-2">
                                    {o.product.map((p, index) => (
                                        <div key={index} className="product-thumbnail-container">
                                            {/* Hiển thị hình ảnh sản phẩm và số lượng */}
                                            {p.productDetails?.image ? (
                                                <div className="product-thumbnail">
                                                    <img 
                                                        src={p.productDetails.image}
                                                        alt={p.productDetails.name || 'Product image'}
                                                        className="product-image"
                                                    />
                                                    <span className="quantity-badge">
                                                        {p.quantity || 1}
                                                    </span>
                                                </div>
                                            ) : (
                                                <div className="product-thumbnail placeholder">
                                                    <span>No image</span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </td>
                            {/* Hiển thị ngày tạo đơn hàng theo định dạng Việt Nam */}
                            <td>{new Date(o.createdAt).toLocaleString('vi-VN')}</td>
                            {/* Hiển thị giá tiền đã được format */}
                            <td>{numeral(o.price).format('0,0')} ₫</td>
                            {/* Nút cập nhật trạng thái xác nhận */}
                            <td>
                                <button 
                                    className={`btn btn-sm ${o.confimationStatus === "Đã xác nhận" ? 'btn-success' : 'btn-warning'}`}
                                    onClick={() => handleStatus(o._id, o.confimationStatus)}
                                >
                                    {o.confimationStatus}
                                </button>
                            </td>
                            {/* Nút cập nhật trạng thái thanh toán */}
                            <td>
                                <button 
                                    className={`btn btn-sm ${o.paymentStatus === "Đã thanh toán" ? 'btn-success' : 'btn-warning'}`}
                                    onClick={() => handlePayment(o._id, o.paymentStatus)}
                                >
                                    {o.paymentStatus}
                                </button>
                            </td>
                            {/* Các nút thao tác */}
                            <td>
                                <button className="btn btn-link text-danger p-0 me-2" onClick={() => handleDelete(o._id)}>
                                    <i className="fa fa-trash"></i>
                                </button>
                                <button className="btn btn-link text-primary p-0">
                                    <i className="fa fa-eye"></i>
                                </button>
                            </td>
                        </tr>
                        )))
                    : (
                        // Hiển thị khi không có dữ liệu
                        <tr>
                            <td colSpan="7" className="text-center">
                                Danh sách đơn hàng trống.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}