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
        // 1. Lấy dữ liệu đơn hàng và tính toán thống kê cơ bản
        const ordersResponse = await axios.get('/order/all'); // Lấy tất cả đơn hàng
        const ordersData = ordersResponse.data;
        setOrders(ordersData); // Lưu danh sách đơn hàng vào state
        
        const totalOrders = ordersData.length; // Tổng số đơn hàng
        // Tính tổng doanh thu từ các đơn đã thanh toán
        const totalRevenue = ordersData
          .filter(order => order.paymentStatus === "Đã thanh toán")
          .reduce((sum, order) => sum + order.price, 0);
  
        // 2. Tính toán đơn hàng và doanh thu của ngày hôm nay
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset về đầu ngày
        
        // Lọc đơn hàng của ngày hôm nay
        const todayOrdersData = ordersData.filter(order => {
          const orderDate = new Date(order.createdAt);
          return orderDate >= today;
        });
        
        setTodayOrders(todayOrdersData.length); // Lưu số đơn hàng hôm nay
        // Tính doanh thu hôm nay
        setTodayRevenue(
          todayOrdersData
            .filter(order => order.paymentStatus === "Đã thanh toán")
            .reduce((sum, order) => sum + order.price, 0)
        );
  
        // 3. Tính tỷ lệ hoàn thành đơn hàng
        const completedOrders = ordersData.filter(order => 
          order.confimationStatus === "Đã xác nhận" || order.confimationStatus === "Hoàn thành"
        ).length;
        setCompletionRate(((completedOrders / totalOrders) * 100).toFixed(1));
  
        // 4. Lấy thông tin sản phẩm
        const productsResponse = await axios.get('/product');
        const products = productsResponse.data;
        const totalProducts = products.length;
  
        // 5. Tìm sản phẩm bán chạy nhất
        const productSales = {}; // Object lưu số lượng bán của từng sản phẩm
        ordersData.forEach(order => {
          order.product.forEach(item => {
            if (item.productId) {
              productSales[item.productId] = (productSales[item.productId] || 0) + item.quantity;
            }
          });
        });
        
        // Tìm sản phẩm có số lượng bán cao nhất
        if (Object.keys(productSales).length > 0) {
          const topProductId = Object.entries(productSales)
            .sort(([,a], [,b]) => b - a)[0][0];
          const topProductData = products.find(p => p._id === topProductId);
          setTopProduct(topProductData);
        }
  
        // 6. Lấy thông tin người dùng
        const usersResponse = await axios.get('/user');
        const totalUsers = usersResponse.data.length;
  
        // Cập nhật state thống kê tổng quan
        setStats({
          totalUsers,
          totalOrders,
          totalRevenue,
          totalProducts
        });
  
        // 7. Tính toán dữ liệu biểu đồ doanh số theo tháng
        const monthlyData = new Array(12).fill(0); // Tạo mảng 12 tháng với giá trị ban đầu = 0
        ordersData.forEach(order => {
          const orderDate = new Date(order.createdAt);
          const monthIndex = orderDate.getMonth();
          monthlyData[monthIndex]++; // Tăng số đơn hàng của tháng tương ứng
        });
  
        // Định dạng dữ liệu cho biểu đồ doanh số
        setSalesData([
          /* Chuyển đổi dữ liệu sang format {month: 'Tx', sales: value} */
        ]);
  
        // 8. Tính toán dữ liệu phân bố danh mục
        const categoryStats = {};
        const categoryResponse = await axios.get('/category');
        const categories = categoryResponse.data;
  
        // Khởi tạo số lượng sản phẩm = 0 cho mỗi danh mục
        categories.forEach(category => {
          categoryStats[category._id] = 0;
        });
  
        // Đếm số lượng sản phẩm trong từng danh mục
        products.forEach(product => {
          if (product.categoryId) {
            categoryStats[product.categoryId]++;
          }
        });
  
        // Chuyển đổi dữ liệu sang định dạng cho biểu đồ tròn
        const categoryChartData = categories
          .map(category => ({
            category: category.name,
            value: categoryStats[category._id]
          }))
          .filter(item => item.value > 0); // Chỉ giữ lại danh mục có sản phẩm
  
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
    <div className="dashboard-container">
      <h2 className="dashboard-title">Tổng quan</h2>
      
      <Row gutter={[16, 16]} className="stats-row">
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic
              title={<span className="stat-title">Tổng người dùng</span>}
              value={stats.totalUsers}
              prefix={<UserOutlined className="stat-icon user-icon" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng đơn hàng"
              value={stats.totalOrders}
              prefix={<ShoppingCartOutlined className="order-icon" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Doanh thu"
              value={stats.totalRevenue.toLocaleString()}
              prefix={<DollarCircleOutlined className="revenue-icon" />}
              suffix="VNĐ"
            />
          </Card>
        </Col>
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

      <Row gutter={[16, 16]} className="charts-row">
        <Col xs={24} lg={15}>
          <Card 
            title={<span className="chart-title">Biểu đồ doanh số</span>} 
            className="chart-card"
            bordered={false}
          >
            <Line {...lineConfig} />
          </Card>
        </Col>
        <Col xs={24} lg={9}>
          <Card 
            title={<span className="chart-title">Phân bố danh mục</span>} 
            className="chart-card"
            bordered={false}
          >
            <Pie {...pieConfig} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="details-row">
        <Col xs={24} lg={14}>
          <Card 
            title={<span className="chart-title">Đơn hàng gần đây</span>} 
            className="detail-card"
            bordered={false}
          >
            <div className="recent-orders">
              {/* Hiển thị 5 đơn hàng gần nhất */}
              {orders?.slice(0, 5).map((order, index) => (
                <div key={index} className="order-item">
                  <div className="order-info">
                    <span className="order-id">#{order._id.slice(-6)}</span>
                    <span className="order-date">
                      {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  <div className="order-amount">
                    {order.price.toLocaleString()} VNĐ
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
        
        <Col xs={24} lg={10}>
          <Card 
            title={<span className="chart-title">Thống kê nhanh</span>} 
            className="detail-card"
            bordered={false}
          >
            <div className="quick-stats">
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
