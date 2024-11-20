const mongoose = require('mongoose');
const User = require('../model/User');
const bcrypt = require('bcrypt');

async function createAdmin() {
    try {
        await mongoose.connect('mongodb://localhost:27017/shop', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        // Kiểm tra xem admin đã tồn tại chưa
        const existingAdmin = await User.findOne({ email: 'admin@gmail.com' });
        if (existingAdmin) {
            console.log('Admin account already exists');
            process.exit(0);
        }

        // Tạo mật khẩu hash
        const hashedPassword = await bcrypt.hash('123456', 10);

        // Tạo tài khoản admin mới
        const admin = new User({
            email: 'admin@gmail.com',
            password: hashedPassword,
            admin: true
        });

        await admin.save();
        console.log('Admin account created successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
}

createAdmin(); 