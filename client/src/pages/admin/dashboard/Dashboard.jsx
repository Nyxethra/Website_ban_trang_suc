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

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lấy tổng số đơn hàng và doanh thu
        const ordersResponse = await axios.get('/order/all');
        const orders = ordersResponse.data;
        const totalOrders = orders.length;
        const totalRevenue = orders
          .filter(order => order.paymentStatus === "Đã thanh toán")
          .reduce((sum, order) => sum + order.price, 0);

        // Lấy tổng số sản phẩm
        const productsResponse = await axios.get('/product');
        const totalProducts = productsResponse.data.length;

        // Lấy tổng số người dùng
        const usersResponse = await axios.get('/user');
        const totalUsers = usersResponse.data.length;

        setStats({
          totalUsers,
          totalOrders,
          totalRevenue,
          totalProducts
        });

        // Tính toán doanh số và số đơn hàng theo tháng
        const monthlyData = new Array(12).fill(0).map(() => ({ revenue: 0, orders: 0 }));
        orders
          .filter(order => order.paymentStatus === "Đã thanh toán")
          .forEach(order => {
            const month = new Date(order.createdAt).getMonth();
            monthlyData[month].revenue += order.price;
            monthlyData[month].orders += 1;
          });

        setSalesData([
          { month: 'T1', sales: monthlyData[0].revenue, orders: monthlyData[0].orders },
          { month: 'T2', sales: monthlyData[1].revenue, orders: monthlyData[1].orders },
          { month: 'T3', sales: monthlyData[2].revenue, orders: monthlyData[2].orders },
          { month: 'T4', sales: monthlyData[3].revenue, orders: monthlyData[3].orders },
          { month: 'T5', sales: monthlyData[4].revenue, orders: monthlyData[4].orders },
          { month: 'T6', sales: monthlyData[5].revenue, orders: monthlyData[5].orders },
          { month: 'T7', sales: monthlyData[6].revenue, orders: monthlyData[6].orders },
          { month: 'T8', sales: monthlyData[7].revenue, orders: monthlyData[7].orders },
          { month: 'T9', sales: monthlyData[8].revenue, orders: monthlyData[8].orders },
          { month: 'T10', sales: monthlyData[9].revenue, orders: monthlyData[9].orders },
          { month: 'T11', sales: monthlyData[10].revenue, orders: monthlyData[10].orders },
          { month: 'T12', sales: monthlyData[11].revenue, orders: monthlyData[11].orders }
        ]);

        // Phân loại sản phẩm theo danh mục
        const products = productsResponse.data;
        const categoriesResponse = await axios.get('/category');
        const categoriesMap = {};
        categoriesResponse.data.forEach(cat => {
          categoriesMap[cat._id] = cat.name;
        });

        const categories = {};
        products.forEach(product => {
          const categoryName = categoriesMap[product.categoryId] || 'Khác';
          categories[categoryName] = (categories[categoryName] || 0) + 1;
        });

        const categoryDataArray = Object.entries(categories).map(([category, count]) => ({
          category,
          value: count
        }));

        setCategoryData(categoryDataArray);

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
      size: 4,
      shape: 'diamond',
      style: {
        fill: '#1890ff',
        stroke: '#fff',
        lineWidth: 2,
      }
    },
    color: '#1890ff',
    lineStyle: {
      lineWidth: 2,
    },
    yAxis: {
      label: {
        formatter: (v) => {
          if (v >= 1000000) {
            return `${(v / 1000000).toFixed(1)}M`;
          }
          return `${(v / 1000).toFixed(0)}K`;
        },
        style: {
          fontSize: 12,
          fontWeight: 500
        }
      },
      title: {
        text: 'Doanh thu (VNĐ)',
        style: {
          fontSize: 12,
          fontWeight: 500
        }
      },
      grid: {
        line: {
          style: {
            stroke: '#f0f0f0',
            lineWidth: 1,
            lineDash: [4, 4],
          }
        }
      }
    },
    xAxis: {
      label: {
        style: {
          fontSize: 12,
          fontWeight: 500
        }
      }
    },
    tooltip: {
      customContent: (title, items) => {
        // Đảm bảo title là string và xử lý an toàn
        const monthLabel = String(title).replace('T', 'Tháng ');
        
        return `
          <div style="padding: 8px 12px;">
            <div style="margin-bottom: 8px; font-weight: 500;">${monthLabel}</div>
            ${items.map(item => {
              const value = item?.data?.sales || 0;
              const orders = item?.data?.orders || 0;
              let formattedValue;
              
              if (value >= 1000000) {
                formattedValue = `${(value / 1000000).toFixed(1)}M VNĐ`;
              } else {
                formattedValue = `${(value / 1000).toFixed(0)}K VNĐ`;
              }

              return `
                <div style="margin-bottom: 4px;">
                  <span>Doanh thu: ${formattedValue}</span>
                </div>
                <div>
                  <span>Số đơn hàng: ${orders} đơn</span>
                </div>
              `;
            }).join('')}
          </div>
        `;
      },
      showMarkers: true,
      marker: {
        fill: '#1890ff',
      },
      domStyles: {
        'g2-tooltip': {
          background: 'rgba(255, 255, 255, 0.95)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
          borderRadius: '4px',
          fontSize: '12px'
        }
      }
    },
    animation: {
      appear: {
        animation: 'wave-in',
        duration: 1000
      }
    }
  };

  const pieConfig = {
    data: categoryData,
    angleField: 'value',
    colorField: 'category',
    radius: 0.75,
    label: false,
    legend: {
      position: 'bottom',
      itemName: {
        style: {
          fontSize: 12,
        }
      }
    },
    color: ['#1890ff', '#52c41a', '#faad14', '#eb2f96'],
    statistic: {
      title: {
        style: {
          fontSize: '14px',
          lineHeight: '1.5',
          color: '#666',
        },
        formatter: () => 'Tổng'
      },
      content: {
        style: {
          fontSize: '24px',
          lineHeight: '1.5',
          color: '#333',
        }
      }
    }
  };

  return (
    <div style={{ padding: '0 24px' }}>
      <Row gutter={[24, 24]} className="stats-row">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng người dùng"
              value={stats.totalUsers}
              prefix={<UserOutlined className="user-icon" />}
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

      <Row gutter={[24, 24]} className="charts-row">
        <Col xs={24} lg={14}>
          <Card 
            title="Biểu đồ doanh số" 
            headStyle={{ borderBottom: 'none' }}
          >
            <Line {...lineConfig} />
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card 
            title="Phân bố danh mục" 
            headStyle={{ borderBottom: 'none' }}
          >
            <Pie {...pieConfig} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
