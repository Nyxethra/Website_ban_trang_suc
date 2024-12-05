import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { UserOutlined, ShoppingCartOutlined, DollarCircleOutlined, TagsOutlined } from '@ant-design/icons';
import { Line, Pie } from '@ant-design/plots';
import axios from '../../../axios';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0
  });
  
  const [salesData, setSalesData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [todayOrders, setTodayOrders] = useState(0);
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [topProduct, setTopProduct] = useState(null);
  const [completionRate, setCompletionRate] = useState(0);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lấy và tính toán các thống kê
        const ordersResponse = await axios.get('/order/all');
        const ordersData = ordersResponse.data;
        setOrders(ordersData);
        
        const totalOrders = ordersData.length;
        const totalRevenue = ordersData
          .filter(order => order.paymentStatus === "Đã thanh toán")
          .reduce((sum, order) => sum + order.price, 0);

        // Tính toán đơn hàng và doanh thu hôm nay
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const todayOrdersData = ordersData.filter(order => {
          const orderDate = new Date(order.createdAt);
          return orderDate >= today;
        });
        
        setTodayOrders(todayOrdersData.length);
        setTodayRevenue(
          todayOrdersData
            .filter(order => order.paymentStatus === "Đã thanh toán")
            .reduce((sum, order) => sum + order.price, 0)
        );

        // Tính tỷ lệ hoàn thành
        const completedOrders = ordersData.filter(order => 
          order.confimationStatus === "Đã xác nhận" || order.confimationStatus === "Hoàn thành"
        ).length;
        setCompletionRate(((completedOrders / totalOrders) * 100).toFixed(1));

        const productsResponse = await axios.get('/product');
        const products = productsResponse.data;
        const totalProducts = products.length;

        // Tìm sản phẩm bán chạy nhất
        const productSales = {};
        ordersData.forEach(order => {
          order.product.forEach(item => {
            if (item.productId) {
              productSales[item.productId] = (productSales[item.productId] || 0) + item.quantity;
            }
          });
        });
        
        if (Object.keys(productSales).length > 0) {
          const topProductId = Object.entries(productSales)
            .sort(([,a], [,b]) => b - a)[0][0];
          const topProductData = products.find(p => p._id === topProductId);
          setTopProduct(topProductData);
        }

        const usersResponse = await axios.get('/user');
        const totalUsers = usersResponse.data.length;

        setStats({
          totalUsers,
          totalOrders,
          totalRevenue,
          totalProducts
        });

        // Tính toán dữ liệu biểu đồ doanh số theo tháng
        const monthlyData = new Array(12).fill(0);
        ordersData.forEach(order => {
          const orderDate = new Date(order.createdAt);
          const monthIndex = orderDate.getMonth();
          monthlyData[monthIndex]++;
        });

        setSalesData([
          { month: 'T1', sales: monthlyData[0] },
          { month: 'T2', sales: monthlyData[1] },
          { month: 'T3', sales: monthlyData[2] },
          { month: 'T4', sales: monthlyData[3] },
          { month: 'T5', sales: monthlyData[4] },
          { month: 'T6', sales: monthlyData[5] },
          { month: 'T7', sales: monthlyData[6] },
          { month: 'T8', sales: monthlyData[7] },
          { month: 'T9', sales: monthlyData[8] },
          { month: 'T10', sales: monthlyData[9] },
          { month: 'T11', sales: monthlyData[10] },
          { month: 'T12', sales: monthlyData[11] },
        ]);

        // Tính toán dữ liệu phân bố danh mục
        const categoryStats = {};
        const categoryResponse = await axios.get('/category');
        const categories = categoryResponse.data;

        // Khởi tạo tất cả danh mục với giá trị 0
        categories.forEach(category => {
          categoryStats[category._id] = 0;
        });

        // Đếm số lượng sản phẩm cho mỗi danh mục
        products.forEach(product => {
          if (product.categoryId) {
            categoryStats[product.categoryId]++;
          }
        });

        // Chuyển đổi dữ liệu sang định dạng cho biểu đồ
        const categoryChartData = categories
          .map(category => ({
            category: category.name,
            value: categoryStats[category._id]
          }))
          .filter(item => item.value > 0); // Chỉ hiển thị các danh mục có sản phẩm

        setCategoryData(categoryChartData);

        // Sắp xếp ordersData theo ngày tạo giảm dần để hiển thị các đơn hàng gần đây nhất
        ordersData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, []);

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
