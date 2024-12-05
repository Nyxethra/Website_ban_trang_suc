// Import các thư viện và components cần thiết
import React, { useEffect, useState } from 'react'; // Import React và các hooks cơ bản
import { Card, Row, Col, Statistic } from 'antd'; // Import các components từ thư viện Ant Design
import { UserOutlined, ShoppingCartOutlined, DollarCircleOutlined, TagsOutlined } from '@ant-design/icons'; // Import các icons
import { Line, Pie } from '@ant-design/plots'; // Import biểu đồ từ thư viện @ant-design/plots
import axios from '../../../axios'; // Import axios đã được cấu hình
import './Dashboard.css'; // Import file CSS

// Component Dashboard chính
const Dashboard = () => {
  // Khởi tạo state cho các thống kê tổng quan
  const [stats, setStats] = useState({
    totalUsers: 0,    // Tổng số người dùng
    totalOrders: 0,   // Tổng số đơn hàng
    totalRevenue: 0,  // Tổng doanh thu
    totalProducts: 0  // Tổng số sản phẩm
  });
  
  // Khởi tạo các state khác
  const [salesData, setSalesData] = useState([]); // Dữ liệu biểu đồ doanh số
  const [categoryData, setCategoryData] = useState([]); // Dữ liệu danh mục
  const [todayOrders, setTodayOrders] = useState(0); // Số đơn hàng hôm nay
  const [todayRevenue, setTodayRevenue] = useState(0); // Doanh thu hôm nay
  const [topProduct, setTopProduct] = useState(null); // Sản phẩm bán chạy nhất
  const [completionRate, setCompletionRate] = useState(0); // Tỷ lệ hoàn thành
  const [orders, setOrders] = useState([]); // Danh sách đơn hàng

  useEffect(() => {
    // Hàm async để fetch dữ liệu từ server
    const fetchData = async () => {
      try {
                // PHẦN 1: XỬ LÝ DỮ LIỆU ĐƠN HÀNG
        // Gọi API để lấy tất cả đơn hàng
        const ordersResponse = await axios.get('/order/all');
        // Lấy dữ liệu đơn hàng từ response
        const ordersData = ordersResponse.data;
        // Lưu danh sách đơn hàng vào state để sử dụng sau này
        setOrders(ordersData);

        // Đếm tổng số đơn hàng
        const totalOrders = ordersData.length;
        // Tính tổng doanh thu bằng cách:
        // 1. Lọc ra các đơn hàng đã thanh toán
        // 2. Dùng reduce để cộng dồn giá trị price của từng đơn hàng
        const totalRevenue = ordersData
          .filter(order => order.paymentStatus === "Đã thanh toán")
          .reduce((sum, order) => sum + order.price, 0);

        // PHẦN 2: TÍNH TOÁN CHO NGÀY HÔM NAY
        // Tạo đối tượng Date cho ngày hôm nay
        const today = new Date();
        // Reset thời gian về 00:00:00 để so sánh chính xác theo ngày
        today.setHours(0, 0, 0, 0);

        // Lọc ra các đơn hàng của ngày hôm nay bằng cách:
        // So sánh thời gian tạo đơn với thời điểm đầu ngày hôm nay
        const todayOrdersData = ordersData.filter(order => {
          const orderDate = new Date(order.createdAt);
          return orderDate >= today;
        });

        // Lưu số lượng đơn hàng hôm nay vào state
        setTodayOrders(todayOrdersData.length);
        // Tính và lưu doanh thu của ngày hôm nay:
        // 1. Lọc các đơn đã thanh toán
        // 2. Cộng dồn giá trị các đơn hàng
        setTodayRevenue(
          todayOrdersData
            .filter(order => order.paymentStatus === "Đã thanh toán")
            .reduce((sum, order) => sum + order.price, 0)
        );
  
                // Tính tỷ lệ hoàn thành đơn hàng
        const completedOrders = ordersData.filter(order => 
          // Lọc ra các đơn hàng có trạng thái là "Đã xác nhận" hoặc "Hoàn thành"
          order.confimationStatus === "Đã xác nhận" || order.confimationStatus === "Hoàn thành"
        ).length; // Đếm số lượng đơn hàng thỏa điều kiện

        // Tính phần trăm đơn hàng hoàn thành:
        // 1. Lấy số đơn hoàn thành chia cho tổng số đơn
        // 2. Nhân với 100 để ra tỷ lệ phần trăm
        // 3. toFixed(1) làm tròn đến 1 chữ số thập phân
        setCompletionRate(((completedOrders / totalOrders) * 100).toFixed(1));
        // 4. Lấy thông tin sản phẩm
        const productsResponse = await axios.get('/product');
        const products = productsResponse.data;
        const totalProducts = products.length;
  
        // PHẦN 5: TÌM SẢN PHẨM BÁN CHẠY NHẤT
        // Tạo object rỗng để lưu số lượng bán của từng sản phẩm
        const productSales = {};
        // Duyệt qua từng đơn hàng và sản phẩm trong đơn để tính tổng số lượng bán
        ordersData.forEach(order => {
          order.product.forEach(item => {
            if (item.productId) {
              // Cộng dồn số lượng bán cho mỗi sản phẩm
              productSales[item.productId] = (productSales[item.productId] || 0) + item.quantity;
            }
          });
        });

        // Nếu có dữ liệu bán hàng
        if (Object.keys(productSales).length > 0) {
          // Chuyển object thành mảng, sắp xếp giảm dần và lấy ID sản phẩm bán chạy nhất
          const topProductId = Object.entries(productSales)
            .sort(([,a], [,b]) => b - a)[0][0];
          // Tìm thông tin chi tiết của sản phẩm bán chạy nhất
          const topProductData = products.find(p => p._id === topProductId);
          setTopProduct(topProductData);
        }
  
        // PHẦN 6: THỐNG KÊ NGƯỜI DÙNG
        // Lấy danh sách người dùng và đếm tổng số
        const usersResponse = await axios.get('/user');
        const totalUsers = usersResponse.data.length;
  
        // Cập nhật state chứa các thống kê tổng quan
        setStats({
          totalUsers,
          totalOrders,
          totalRevenue,
          totalProducts
        });
  
        // PHẦN 7: THỐNG KÊ DOANH SỐ THEO THÁNG
        // Tạo mảng 12 phần tử đại diện cho 12 tháng, giá trị ban đầu = 0
        const monthlyData = new Array(12).fill(0);
        // Duyệt qua từng đơn hàng để đếm số đơn theo tháng
        ordersData.forEach(order => {
          const orderDate = new Date(order.createdAt);
          const monthIndex = orderDate.getMonth();
          monthlyData[monthIndex]++; // Tăng số đơn của tháng tương ứng
        });
  
        // Định dạng dữ liệu cho biểu đồ doanh số
        setSalesData([
          /* Chuyển đổi dữ liệu sang format {month: 'Tx', sales: value} */
        ]);
  
        // PHẦN 8: THỐNG KÊ PHÂN BỐ DANH MỤC
        // Tạo object rỗng để lưu số lượng sản phẩm của từng danh mục
        const categoryStats = {};
        // Lấy danh sách danh mục từ server
        const categoryResponse = await axios.get('/category');
        const categories = categoryResponse.data;
  
        // Khởi tạo số lượng = 0 cho mỗi danh mục
        categories.forEach(category => {
          categoryStats[category._id] = 0;
        });
  
        // Đếm số sản phẩm trong từng danh mục
        products.forEach(product => {
          if (product.categoryId) {
            categoryStats[product.categoryId]++;
          }
        });
  
        // Chuyển đổi dữ liệu sang định dạng phù hợp cho biểu đồ tròn
        const categoryChartData = categories
          .map(category => ({
            category: category.name,
            value: categoryStats[category._id]
          }))
          .filter(item => item.value > 0); // Loại bỏ danh mục không có sản phẩm
  
        // Cập nhật state dữ liệu biểu đồ danh mục
        setCategoryData(categoryChartData);
  
        // Sắp xếp đơn hàng theo thời gian mới nhất
        ordersData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };
  
    // Gọi hàm fetchData khi component mount
    fetchData();
  }, []); // Dependencies rỗng -> chỉ chạy 1 lần khi component mount

  const lineConfig = {
    data: salesData,
    xField: 'month',
    yField: 'sales',
    smooth: true,
    point: {
      size: 5,
      shape: 'diamond',
    },
    color: '#1890ff',
    lineStyle: {
      stroke: '#1890ff',
      lineWidth: 3,
    },
    yAxis: {
      label: {
        formatter: (v) => {
          if (v >= 1000000) {
            return `${(v / 1000000).toFixed(1)}M`;
          }
          if (v >= 1000) {
            return `${(v / 1000).toFixed(1)}K`;
          }
          return v;
        },
      },
    },
    height: 300,
    padding: [20, 40, 50, 40],
    xAxis: {
      label: {
        style: {
          fontSize: 12,
        },
      },
    },
    yAxis: {
      grid: {
        line: {
          style: {
            stroke: '#E5E7EB',
            lineWidth: 1,
            lineDash: [4, 4],
          },
        },
      },
    },
  };

  const pieConfig = {
    data: categoryData,
    angleField: 'value',
    colorField: 'category',
    radius: 0.8,
    label: false,
    legend: {
      position: 'right',
      itemHeight: 16,
      itemWidth: 100,
      maxRow: 10,
    },
    color: ['#1890ff', '#52c41a', '#faad14', '#eb2f96'],
    height: 300,
    interactions: [{ type: 'element-active' }],
  };

  return (
    // Container chính của dashboard
    <div className="dashboard-container">
      // Tiêu đề chính của trang
      <h2 className="dashboard-title">Tổng quan</h2>
      
      // Row 1: Thống kê tổng quan - sử dụng Grid system của Ant Design
      // gutter=[16,16] tạo khoảng cách 16px giữa các cột và hàng
      <Row gutter={[16, 16]} className="stats-row">
        // Cột 1: Thống kê người dùng
        // xs=24 (full width trên mobile), sm=12 (1/2 width trên tablet), lg=6 (1/4 width trên desktop)
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            // Component Statistic của Ant Design để hiển thị số liệu
            <Statistic
              title={<span className="stat-title">Tổng người dùng</span>}
              value={stats.totalUsers} // Giá trị từ state
              prefix={<UserOutlined className="stat-icon user-icon" />} // Icon người dùng
            />
          </Card>
        </Col>

        // Cột 2: Thống kê đơn hàng - cấu trúc tương tự
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng đơn hàng"
              value={stats.totalOrders}
              prefix={<ShoppingCartOutlined className="order-icon" />}
            />
          </Card>
        </Col>

        // Cột 3: Thống kê doanh thu
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Doanh thu"
              value={stats.totalRevenue.toLocaleString()} // Format số có dấu phẩy
              prefix={<DollarCircleOutlined className="revenue-icon" />}
              suffix="VNĐ" // Đơn vị tiền tệ
            />
          </Card>
        </Col>

        // Cột 4: Thống kê sản phẩm
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng sản phẩm"
              value={stats.totalProducts}
              prefix={<TagsOutlined className="product-icon" />}
            />
          </Card>
        </Col>
      </Row>

      // Row 2: Biểu đồ thống kê
      <Row gutter={[16, 16]} className="charts-row">
        // Cột 1: Biểu đồ doanh số (chiếm 15/24 width)
        <Col xs={24} lg={15}>
          <Card 
            title={<span className="chart-title">Biểu đồ doanh số</span>}
            className="chart-card"
            bordered={false} // Không hiển thị viền
          >
            // Component Line chart từ @ant-design/plots
            <Line {...lineConfig} /> // Truyền cấu hình biểu đồ
          </Card>
        </Col>

        // Cột 2: Biểu đồ phân bố danh mục (chiếm 9/24 width)
        <Col xs={24} lg={9}>
          <Card 
            title={<span className="chart-title">Phân bố danh mục</span>}
            className="chart-card"
            bordered={false}
          >
            // Component Pie chart từ @ant-design/plots
            <Pie {...pieConfig} />
          </Card>
        </Col>
      </Row>

      // Row 3: Chi tiết thống kê
      <Row gutter={[16, 16]} className="details-row">
        // Cột 1: Đơn hàng gần đây (chiếm 14/24 width)
        <Col xs={24} lg={14}>
          <Card 
            title={<span className="chart-title">Đơn hàng gần đây</span>}
            className="detail-card"
            bordered={false}
          >
            <div className="recent-orders">
              // Lặp qua 5 đơn hàng gần nhất
              {orders?.slice(0, 5).map((order, index) => (
                <div key={index} className="order-item">
                  <div className="order-info">
                    // Hiển thị 6 ký tự cuối của ID đơn hàng
                    <span className="order-id">#{order._id.slice(-6)}</span>
                    // Format ngày tháng theo định dạng Việt Nam
                    <span className="order-date">
                      {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  // Format giá trị đơn hàng có dấu phẩy
                  <div className="order-amount">
                    {order.price.toLocaleString()} VNĐ
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
        
        // Cột 2: Thống kê nhanh (chiếm 10/24 width)
        <Col xs={24} lg={10}>
          <Card 
            title={<span className="chart-title">Thống kê nhanh</span>}
            className="detail-card"
            bordered={false}
          >
            <div className="quick-stats">
              // Hiển thị các thống kê nhanh
              <div className="stat-item">
                <span className="stat-label">Đơn hàng hôm nay</span>
                <span className="stat-value">{todayOrders}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Doanh thu hôm nay</span>
                <span className="stat-value">{todayRevenue.toLocaleString()} VNĐ</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Sản phẩm bán chạy nhất</span>
                // Hiển thị tên sản phẩm hoặc 'N/A' nếu không có
                <span className="stat-value">{topProduct?.name || 'N/A'}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Tỷ lệ hoàn thành</span>
                <span className="stat-value">{completionRate}%</span>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
