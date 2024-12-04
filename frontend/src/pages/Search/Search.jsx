import React, { useEffect, useState } from 'react' // Import React và các hooks useEffect, useState từ thư viện React
import axios from '../../axios' // Import axios để thực hiện các yêu cầu HTTP
import {Route, Routes, useLocation, useNavigate} from 'react-router-dom' // Import các component và hooks từ react-router-dom để điều hướng và quản lý route
import ListItem from '../../components/listItem/ListItem' // Import component ListItem từ thư mục components
import './Search.css' // Import file CSS cho component Search

// Định nghĩa và xuất mặc định component Search, nhận prop getCart
export default function Search({getCart}) {
    const [category, setCategory] = useState() // Khởi tạo state category
    const [count, setCount] = useState(0) // Khởi tạo state count với giá trị ban đầu là 0
    const [categoryId, setCategoryId] = useState("") // Khởi tạo state categoryId với chuỗi rỗng
    const [min, setMin] = useState(0) // Khởi tạo state min với giá trị ban đầu là 0
    const [max, setMax] = useState(100000000) // Khởi tạo state max với giá trị ban đầu là 100 triệu
    const [q, setQ] = useState("") // Khởi tạo state q để lưu từ khóa tìm kiếm
    const [sort, setSort] = useState("") // Khởi tạo state sort để lưu phương thức sắp xếp
    const [limit, setLimit] = useState(10) // Khởi tạo state limit để giới hạn số sản phẩm hiển thị mỗi trang
    const [page, setPage] = useState(1) // Khởi tạo state page để quản lý trang hiện tại
    const navigation = useNavigate() // Sử dụng hook useNavigate để điều hướng
    const [data, setData] = useState([]) // Khởi tạo state data để lưu dữ liệu sản phẩm
    const [filteredData, setFilteredData] = useState([]) // Khởi tạo state filteredData để lưu dữ liệu đã lọc
    const location = useLocation() // Sử dụng hook useLocation để lấy thông tin về vị trí hiện tại
    const id = location.pathname.split("/")[3] // Lấy categoryId từ URL

    // useEffect để lấy các tham số từ URL khi component được mount hoặc khi id thay đổi
    useEffect(() => {
      const params = new URLSearchParams(window.location.search); // Tạo đối tượng URLSearchParams từ chuỗi truy vấn
      const q = params.get('q'); // Lấy giá trị của tham số 'q'
      if(q){
        setQ(q) // Cập nhật state q nếu tồn tại
      }
      const min = params.get('min'); // Lấy giá trị của tham số 'min'
      if(min){
        setMin(min) // Cập nhật state min nếu tồn tại
      }
      const max = params.get('max'); // Lấy giá trị của tham số 'max'
      if(max){
        setMax(max) // Cập nhật state max nếu tồn tại
      }
      if (id !== "") {
          setCategoryId(id); // Cập nhật state categoryId nếu id không rỗng
      }
  }, [id]); // Chạy effect khi id thay đổi

    // Hàm để lấy dữ liệu sản phẩm từ API
    const getData = async () => {
        try {
              const res = await axios.get(`/product?q=${q}&min=${min}&max=${max}`) // Thực hiện yêu cầu GET đến API với các tham số tìm kiếm
              const products = res.data; // Lấy dữ liệu sản phẩm từ phản hồi
              setData(products); // Cập nhật state data
              applyFilters(products); // Áp dụng các bộ lọc lên sản phẩm
          } catch (err) {
            console.log(err) // In lỗi ra console nếu có
          }
    }

    // Hàm để áp dụng các bộ lọc vào dữ liệu sản phẩm
    const applyFilters = (products) => {
        let filtered = [...products]; // Tạo một bản sao của mảng sản phẩm

        // Lọc theo giá
        filtered = filtered.filter(product => 
            product.price >= min && product.price <= max // Chỉ giữ lại sản phẩm có giá giữa min và max
        );

        // Sắp xếp
        if (sort) { // Nếu có phương thức sắp xếp được chọn
            switch(sort) {
                case 'popular':
                    // Thêm logic sắp xếp theo độ phổ biến
                    break;
                case 'asc':
                    filtered.sort((a, b) => a.price - b.price); // Sắp xếp giá tăng dần
                    break;
                case 'desc':
                    filtered.sort((a, b) => b.price - a.price); // Sắp xếp giá giảm dần
                    break;
                case 'new':
                    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sắp xếp theo ngày tạo mới nhất
                    break;
                default:
                    break;
            }
        }

        // Phân trang
        const startIndex = (page - 1) * limit; // Tính chỉ số bắt đầu
        const endIndex = startIndex + limit; // Tính chỉ số kết thúc
        const paginatedData = filtered.slice(startIndex, endIndex); // Lấy phần dữ liệu cho trang hiện tại

        setFilteredData(paginatedData); // Cập nhật state filteredData
        setCount(filtered.length); // Cập nhật số lượng sản phẩm sau khi lọc
    }

    // useEffect để gọi hàm getData khi giá trị q thay đổi
    useEffect(() => {
        getData()
    }, [q])

    // useEffect để lấy danh mục sản phẩm khi component được mount
    useEffect(() => {
      const getCategory = async () => {
        try {
          const res = await axios.get('/category') // Yêu cầu GET danh mục từ API
          setCategory(res.data) // Cập nhật state category với dữ liệu nhận được
        } catch (err) {
          console.log(err) // In lỗi ra console nếu có
        }
      }
      getCategory()
    }, []) // Chạy effect chỉ một lần khi component được mount

    // useEffect để áp dụng bộ lọc khi các giá trị min, max, sort, page hoặc limit thay đổi
    useEffect(() => {
        if (data.length > 0) { // Nếu có dữ liệu sản phẩm
            applyFilters(data); // Áp dụng bộ lọc
        }
    }, [min, max, sort, page, limit]);

  return (
    <div className='w-100 h-auto'> {/* Container chính với chiều rộng 100% và chiều cao tự động */}
      <div className='w-100 bg-light' style={{height:"40px"}}> {/* Thanh breadcrumb với chiều cao 40px */}
        <div className='container d-flex justify-content-between align-items-center p-2'> {/* Nội dung breadcrumb */}
            <div className='breadcrumb mb-0'>
                <span className='fs-6'>
                    <a className="text-decoration-none" style={{color:"#b8860b"}} href="/">Trang chủ</a> {/* Liên kết về trang chủ */}
                    <span className="mx-2" style={{color:"#b8860b"}}>/</span>
                    <span style={{color:"#b8860b"}}>Kết quả tìm kiếm cho: "{q}"</span> {/* Hiển thị từ khóa tìm kiếm */}
                </span>
            </div>
            <div>
                <span className='mx-1' style={{fontSize: '14px', color: '#666'}}>
                    Hiển thị {count > 0 ? `${(page-1)*limit + 1}-${Math.min(page*limit, count)}` : '0'} trong số {count} sản phẩm {/* Thông tin số lượng sản phẩm hiển thị */}
                </span>
            </div>
        </div>
      </div>

      <div className='container'> {/* Container cho nội dung chính */}
          <div className="filter-container my-3"> {/* Container cho các bộ lọc */}
              {/* Phần lọc sắp xếp sản phẩm */}
              <div className="filter-group">
                  <label className="filter-label">Sắp xếp:</label>
                  <select 
                      className="filter-select"
                      value={sort} // Giá trị hiện tại của state sort
                      onChange={(e) => setSort(e.target.value)} // Cập nhật state sort khi người dùng chọn option mới
                  >
                      {/* Các tùy chọn sắp xếp:
                          - "": Không sắp xếp (mặc định)
                          - popular: Sắp xếp theo độ phổ biến
                          - asc: Sắp xếp giá tăng dần
                          - desc: Sắp xếp giá giảm dần
                          - new: Sắp xếp theo thời gian tạo mới nhất
                      */}
                      <option value="">Tùy chọn</option>
                      <option value="popular">Thứ tự theo mức độ phổ biến</option>
                      <option value="asc">Thứ tự theo giá: thấp đến cao</option>
                      <option value="desc">Thứ tự theo giá: cao xuống thấp</option>
                      <option value="new">Mới nhất</option>
                  </select>
              </div>

              {/* Phần lọc theo khoảng giá */}
              <div className="filter-group">
                  <label className="filter-label">Lọc theo giá:</label>
                  <select 
                      className="filter-select"
                      onChange={(e) => { 
                          const value = e.target.value;
                          // Nếu chọn "Tất cả giá", set khoảng giá từ 0 đến 100 triệu
                          if (value === "all") {
                              setMin(0);
                              setMax(100000000);
                          } else {
                              // Tách giá trị min-max từ value của option được chọn
                              const [minVal, maxVal] = value.split("-");
                              // Cập nhật state min với giá trị tối thiểu
                              setMin(Number(minVal));
                              // Nếu không có maxVal (trường hợp "Trên 20 triệu"), 
                              // set max là 100 triệu, ngược lại lấy giá trị maxVal
                              setMax(maxVal ? Number(maxVal) : 100000000);
                          }
                      }}
                  >
                      {/* Các tùy chọn khoảng giá:
                          - all: Hiển thị tất cả mức giá
                          - Các khoảng giá được định nghĩa sẵn từ dưới 3 triệu đến trên 20 triệu
                          Value của mỗi option là chuỗi chứa giá min và max, phân cách bởi dấu "-"
                      */}
                      <option value="all">Tất cả giá</option>
                      <option value="0-3000000">Dưới 3,000,000 đ</option>
                      <option value="3000000-5000000">3,000,000 đ - 5,000,000 đ</option>
                      <option value="5000000-10000000">5,000,000 đ - 10,000,000 đ</option>
                      <option value="10000000-15000000">10,000,000 đ - 15,000,000 đ</option>
                      <option value="15000000-20000000">15,000,000 đ - 20,000,000 đ</option>
                      <option value="20000000">Trên 20,000,000 đ</option>
                  </select>
              </div>

              <div className="filter-group">
                  <label className="filter-label">Hiển thị:</label>
                  <select 
                      className="filter-select"
                      value={limit}
                      onChange={(e) => { // Xử lý sự kiện khi thay đổi số lượng hiển thị
                          setLimit(Number(e.target.value));
                          setPage(1); // Thiết lập lại trang về 1 khi thay đổi limit
                      }}
                  >
                      <option value="10">Hiển thị 10 sản phẩm</option>
                      <option value="20">Hiển thị 20 sản phẩm</option>
                      <option value="30">Hiển thị 30 sản phẩm</option>
                      <option value="40">Hiển thị 40 sản phẩm</option>
                  </select>
              </div>
          </div>

          {filteredData && filteredData.length > 0 ? ( // Kiểm tra nếu có dữ liệu sau khi lọc
              // Container chính cho danh sách sản phẩm
              <div className='w-100' style={{boxSizing:"border-box"}}>
                  {/* Container Bootstrap với padding 0 */}
                  <div className='container p-0'>
                      {/* 
                          Grid system của Bootstrap:
                          - row-cols-1: 1 cột trên màn hình nhỏ
                          - row-cols-md-2: 2 cột trên màn hình medium
                          - row-cols-lg-3: 3 cột trên màn hình large
                          - row-cols-xl-4: 4 cột trên màn hình extra large
                          - g-4: gap (khoảng cách) giữa các items là 4 (1.5rem)
                      */}
                      <div className='row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4'>
                          {/* Component ListItem nhận props:
                              - data: danh sách sản phẩm đã được lọc
                              - getCart: function để cập nhật giỏ hàng
                          */}
                          <ListItem data={filteredData} getCart={getCart}/>
                      </div>
                  </div>
              </div>
          ) : (
              // Hiển thị khi không tìm thấy sản phẩm nào
              <div className="no-results-container text-center py-5">
                  {/* Icon tìm kiếm với màu vàng nâu (#b8860b) */}
                  <i className="fa fa-search no-results-icon mb-3" style={{fontSize: '48px', color: '#b8860b'}}></i>
                  
                  {/* Thông báo không tìm thấy kết quả */}
                  <h4>Không tìm thấy kết quả nào</h4>
                  
                  {/* Hiển thị từ khóa tìm kiếm của người dùng */}
                  <p className="text-muted">Không tìm thấy sản phẩm nào phù hợp với từ khóa "{q}"</p>
                  
                  {/* Phần gợi ý cho người dùng */}
                  <div className="suggestions">
                      <p>Bạn có thể thử:</p>
                      <ul>
                          <li>Kiểm tra lỗi chính tả</li>
                          <li>Sử dụng các từ khóa khác</li>
                          <li>Sử dụng từ khóa ngắn gọn hơn</li>
                      </ul>
                  </div>
                  
                  {/* Nút quay về trang chủ với class btn-custom tùy chỉnh */}
                  <a href="/" className="btn btn-custom mt-3">Quay lại trang chủ</a>
              </div>
          )}

          {filteredData && filteredData.length > 0 && ( // Kiểm tra nếu có dữ liệu để hiển thị phân trang
              <div className="pagination-container my-4"> {/* Container cho phân trang */}
                  <button 
                      onClick={() => setPage(1)} // Chuyển đến trang đầu
                      disabled={page === 1} // Vô hiệu hóa nếu đang ở trang đầu
                      className="pagination-button"
                      title="Trang đầu"
                  >
                      <i className="fa fa-angle-double-left"></i> {/* Icon cho trang đầu */}
                  </button>

                  <button 
                      onClick={() => setPage(prev => Math.max(prev - 1, 1))} // Chuyển đến trang trước
                      disabled={page === 1} // Vô hiệu hóa nếu đang ở trang đầu
                      className="pagination-button"
                      title="Trang trước"
                  >
                      <i className="fa fa-angle-left"></i> {/* Icon cho trang trước */}
                  </button>

                  {Array.from({ length: Math.ceil(count / limit) }, (_, i) => i + 1) // Tạo mảng số trang
                      .filter(pageNum => { // Lọc các số trang để hiển thị
                          if (pageNum === 1 || pageNum === Math.ceil(count / limit)) return true; // Luôn hiển thị trang đầu và cuối
                          return Math.abs(pageNum - page) <= 2; // Hiển thị các trang gần trang hiện tại
                      })
                      .map((pageNum, index, array) => { // Tạo các nút trang
                          if (index > 0 && array[index - 1] !== pageNum - 1) { // Kiểm tra để thêm dấu "..."
                              return [
                                  <span key={`ellipsis-${pageNum}`} className="pagination-ellipsis">...</span>, // Dấu "..."
                                  <button
                                      key={pageNum}
                                      onClick={() => setPage(pageNum)} // Chuyển đến trang được chọn
                                      className={`pagination-button ${page === pageNum ? 'active' : ''}`} // Đánh dấu trang hiện tại
                                  >
                                      {pageNum} {/* Số trang */}
                                  </button>
                              ];
                          }
                          return (
                              <button
                                  key={pageNum}
                                  onClick={() => setPage(pageNum)} // Chuyển đến trang được chọn
                                  className={`pagination-button ${page === pageNum ? 'active' : ''}`} // Đánh dấu trang hiện tại
                              >
                                  {pageNum} {/* Số trang */}
                              </button>
                          );
                      })}

                  <button 
                      onClick={() => setPage(prev => Math.min(prev + 1, Math.ceil(count / limit)))} // Chuyển đến trang sau
                      disabled={page === Math.ceil(count / limit)} // Vô hiệu hóa nếu đang ở trang cuối
                      className="pagination-button"
                      title="Trang sau"
                  >
                      <i className="fa fa-angle-right"></i> {/* Icon cho trang sau */}
                  </button>

                  <button 
                      onClick={() => setPage(Math.ceil(count / limit))} // Chuyển đến trang cuối
                      disabled={page === Math.ceil(count / limit)} // Vô hiệu hóa nếu đang ở trang cuối
                      className="pagination-button"
                      title="Trang cuối"
                  >
                      <i className="fa fa-angle-double-right"></i> {/* Icon cho trang cuối */}
                  </button>
              </div>
          )}
      </div>
    </div>
  )
}