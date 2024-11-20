import React, { useState } from 'react';
import { Form, Input, message } from 'antd';
import { useDispatch } from 'react-redux';
import axios from '../../../axios';
import { adminLoginSuccess } from '../../../redux/adminRedux';
import './AdminLogin.css';

export default function AdminLogin() {
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
 
    const onFinish = async (values) => {
        setLoading(true);
        try {
            console.log('Sending login request:', values); // Debug log
            const res = await axios.post('/admin/login', values);
            console.log('Login response:', res.data); // Debug log
            
            if (res.data.success) {
                dispatch(adminLoginSuccess(res.data.admin));
                message.success('Đăng nhập thành công');
                window.location.href = '/admin';
            }
        } catch (err) {
            console.error('Login error:', err); // Debug log
            if (err.response) {
                message.error(err.response.data.message || 'Đăng nhập thất bại');
            } else if (err.request) {
                message.error('Không thể kết nối đến server');
            } else {
                message.error('Có lỗi xảy ra');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-container">
            <div className="admin-login-box">
                <div className="admin-login-header">
                    <h1>Đăng nhập Admin</h1>
                    <p>Vui lòng đăng nhập để tiếp tục</p>
                </div>

                <Form
                    name="admin_login"
                    onFinish={onFinish}
                    layout="vertical"
                >
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: 'Vui lòng nhập email' },
                            { type: 'email', message: 'Email không hợp lệ' }
                        ]}
                    >
                        <Input placeholder="admin@example.com" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Mật khẩu"
                        rules={[
                            { required: true, message: 'Vui lòng nhập mật khẩu' }
                        ]}
                    >
                        <Input.Password placeholder="••••••••" />
                    </Form.Item>

                    <Form.Item>
                        <button 
                            type="submit" 
                            className="admin-login-button"
                            disabled={loading}
                        >
                            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                        </button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
} 