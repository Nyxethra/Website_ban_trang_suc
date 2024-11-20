const bcrypt = require('bcrypt');
const User = require('../model/User');

async function adminRoutes(fastify, options) {
    // Middleware kiểm tra quyền admin
    async function verifyAdmin(request, reply) {
        try {
            const adminId = request.session.get('adminId');
            const isAdmin = request.session.get('isAdmin');

            if (!adminId || !isAdmin) {
                return reply.code(401).send({
                    success: false,
                    message: 'Vui lòng đăng nhập với tài khoản admin'
                });
            }

            // Sử dụng Mongoose thay vì MongoDB trực tiếp
            const admin = await User.findOne({ 
                _id: adminId,
                admin: true
            });

            if (!admin) {
                return reply.code(403).send({
                    success: false,
                    message: 'Không có quyền truy cập'
                });
            }

            request.admin = admin;
        } catch (err) {
            console.error('Lỗi xác thực admin:', err);
            return reply.code(500).send({
                success: false,
                message: 'Lỗi server'
            });
        }
    }

    // Đăng nhập admin
    fastify.post('/login', async (request, reply) => {
        try {
            const { email, password } = request.body;
            console.log('Login attempt:', email, password); // Debug log

            // Tìm user trong database
            const user = await User.findOne({ email });
            console.log('Found user:', user); // Debug log
            
            if (!user) {
                console.log('User not found'); // Debug log
                return reply.code(404).send({
                    success: false,
                    message: 'Tài khoản không tồn tại'
                });
            }

            // Kiểm tra quyền admin
            if (!user.admin) {
                return reply.code(403).send({
                    success: false,
                    message: 'Tài khoản không có quyền admin'
                });
            }

            // Kiểm tra mật khẩu
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return reply.code(400).send({
                    success: false,
                    message: 'Mật khẩu không chính xác'
                });
            }

            // Tạo session cho admin
            request.session.set('adminId', user._id);
            request.session.set('isAdmin', true);

            // Loại bỏ password trước khi gửi response
            const { password: _, ...adminData } = user.toObject();

            return reply.send({
                success: true,
                admin: adminData
            });

        } catch (err) {
            console.error('Login error:', err);
            return reply.code(500).send({
                success: false,
                message: 'Lỗi server'
            });
        }
    });

    // Đăng xuất admin
    fastify.post('/logout', async (request, reply) => {
        try {
            request.session.delete();
            return reply.send({
                success: true,
                message: 'Đăng xuất thành công'
            });
        } catch (err) {
            console.error('Lỗi đăng xuất admin:', err);
            return reply.code(500).send({
                success: false, 
                message: 'Lỗi server'
            });
        }
    });

    // Lấy thông tin admin hiện tại
    fastify.get('/me', { preHandler: verifyAdmin }, async (request, reply) => {
        try {
            const { password: _, ...adminData } = request.admin;
            return reply.send({
                success: true,
                admin: adminData
            });
        } catch (err) {
            console.error('Lỗi lấy thông tin admin:', err);
            return reply.code(500).send({
                success: false,
                message: 'Lỗi server'
            });
        }
    });
}

module.exports = adminRoutes; 