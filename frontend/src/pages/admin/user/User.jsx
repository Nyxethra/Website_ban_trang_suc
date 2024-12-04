import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Modal, Form, Input, Checkbox, message } from 'antd';
import axios from '../../../axios';
import './User.css';

export default function User() {
    const { currentUser } = useSelector(state => state.user);
    const [data, setData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [form] = Form.useForm();
    const [passwordModalVisible, setPasswordModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [passwordForm] = Form.useForm();

    const getData = async () => {
        try {
            const res = await axios.get('/user');
            setData(res.data);
        } catch (err) {
            console.log(err);
            message.error('Lỗi khi tải dữ liệu người dùng');
        }
    }

    useEffect(() => {
        getData();
    }, []);

    const handleUpdate = async (admin, id) => {
        try {
            await axios.put(`/user/update/${id}`, { admin: !admin });
            getData();
            message.success('Cập nhật quyền admin thành công');
        } catch (err) {
            console.log(err);
            message.error('Lỗi khi cập nhật quyền admin');
        }
    }

    const handleDelete = async (id) => {
        try {
            await axios.delete(`user/delete/${id}`);
            getData();
            message.success('Xóa người dùng thành công');
        } catch (err) {
            console.log(err);
            message.error('Lỗi khi xóa người dùng');
        }
    }

    // Mở modal để thêm/sửa người dùng
    const showModal = (user = null) => {
        setEditingUser(user);
        if (user) {
            form.setFieldsValue({
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                admin: user.admin
            });
        } else {
            form.resetFields();
        }
        setModalVisible(true);
    };

    // Xử lý khi submit form
    const handleSubmit = async (values) => {
        try {
            if (editingUser) {
                // Cập nhật người dùng
                await axios.put(`/user/update/${editingUser._id}`, values);
                message.success('Cập nhật người dùng thành công');
            } else {
                // Thêm người dùng mới
                await axios.post('/user/register', {
                    ...values,
                    password: values.password || '123456' // Mật khẩu mặc định
                });
                message.success('Thêm người dùng thành công');
            }
            setModalVisible(false);
            form.resetFields();
            getData();
        } catch (err) {
            console.log(err);
            message.error(err.response?.data?.message || 'Có lỗi xảy ra khi thêm người dùng');
        }
    };

    const handleChangePassword = async (values) => {
        try {
            await axios.put(`/user/update/${selectedUser._id}`, {
                password: values.newPassword
            });
            message.success('Đổi mật khẩu thành công');
            setPasswordModalVisible(false);
            passwordForm.resetFields();
        } catch (err) {
            console.log(err);
            message.error('Lỗi khi đổi mật khẩu');
        }
    };

    const showPasswordModal = (user) => {
        setSelectedUser(user);
        setPasswordModalVisible(true);
        passwordForm.resetFields();
    };

    return (
        <div className='user-management'>
            <div className='user-header'>
                <h2>Quản lý người dùng</h2>
                <button 
                    className='add-user-btn'
                    onClick={() => showModal()}
                >
                    <i className='fa fa-plus me-2'></i>
                    Thêm người dùng
                </button>
            </div>

            <div className='user-table'>
                <table className='table'>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Tên</th>
                            <th>Email</th>
                            <th>Địa chỉ</th>
                            <th>Điện thoại</th>
                            <th>Admin</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((u, index) => (
                            <tr key={u._id}>
                                <td>{index + 1}</td>
                                <td>{u.name}</td>
                                <td>{u.email}</td>
                                <td>{u.address}</td>
                                <td>{u.phone}</td>
                                <td>
                                    {currentUser._id !== u._id && (
                                        <input 
                                            type="checkbox" 
                                            className="admin-checkbox"
                                            checked={u.admin ? true : false}
                                            onChange={() => handleUpdate(u.admin, u._id)}
                                        />
                                    )}
                                </td>
                                <td>
                                    <div className='action-buttons'>
                                        <button 
                                            className='btn-action btn-edit'
                                            onClick={() => showModal(u)}
                                            title="Sửa"
                                        >
                                            <i className='fa fa-edit'></i>
                                        </button>
                                        <button 
                                            className='btn-action btn-password'
                                            onClick={() => showPasswordModal(u)}
                                            title="Đổi mật khẩu"
                                        >
                                            <i className='fa fa-key'></i>
                                        </button>
                                        {currentUser._id !== u._id && (
                                            <button 
                                                className='btn-action btn-delete'
                                                onClick={() => handleDelete(u._id)}
                                                title="Xóa"
                                            >
                                                <i className='fa fa-trash'></i>
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal
                title={editingUser ? 'Sửa người dùng' : 'Thêm người dùng mới'}
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        name="name"
                        label="Tên"
                        rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: 'Vui lòng nhập email' },
                            { type: 'email', message: 'Email không hợp lệ' }
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    {!editingUser && (
                        <Form.Item
                            name="password"
                            label="Mật khẩu"
                            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
                        >
                            <Input.Password />
                        </Form.Item>
                    )}

                    <Form.Item
                        name="phone"
                        label="Số điện thoại"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="address"
                        label="Địa chỉ"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="admin"
                        valuePropName="checked"
                    >
                        <Checkbox>Là admin</Checkbox>
                    </Form.Item>

                    <Form.Item className='modal-footer'>
                        <button 
                            type="button" 
                            className='btn-cancel'
                            onClick={() => setModalVisible(false)}
                        >
                            Hủy
                        </button>
                        <button 
                            type="submit" 
                            className='btn-submit'
                        >
                            {editingUser ? 'Cập nhật' : 'Thêm mới'}
                        </button>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Đổi mật khẩu người dùng"
                open={passwordModalVisible}
                onCancel={() => setPasswordModalVisible(false)}
                footer={null}
            >
                <Form
                    form={passwordForm}
                    layout="vertical"
                    onFinish={handleChangePassword}
                >
                    <Form.Item
                        name="newPassword"
                        label="Mật khẩu mới"
                        rules={[
                            { required: true, message: 'Vui lòng nhập mật khẩu mới' },
                            { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' }
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        name="confirmPassword"
                        label="Xác nhận mật khẩu"
                        dependencies={['newPassword']}
                        rules={[
                            { required: true, message: 'Vui lòng xác nhận mật khẩu' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('newPassword') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Mật khẩu xác nhận không khớp'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item className='modal-footer'>
                        <button 
                            type="button" 
                            className='btn-cancel'
                            onClick={() => setPasswordModalVisible(false)}
                        >
                            Hủy
                        </button>
                        <button 
                            type="submit" 
                            className='btn-submit'
                        >
                            Cập nhật mật khẩu
                        </button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
