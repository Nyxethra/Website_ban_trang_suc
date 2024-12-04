// Import model Product từ thư mục ../model để thao tác với collection products trong database
const Product = require('../model/Product')

// Import model Category từ thư mục ../model để thao tác với collection categories trong database, thường dùng để join/lookup với products
const Category = require('../model/Category')

// Export một hàm bất đồng bộ (async) để tạo sản phẩm mới, nhận vào request và reply
exports.create = async(req, reply) => {
    try {
        // Sử dụng destructuring để lấy các thông tin sản phẩm từ body của request
        // Bao gồm: tên, id danh mục, giá, mô tả, màu sắc, ảnh chính và ảnh phụ
        const {name, categoryId, price, description, color, image, sub_image} = req.body
        
        // Tạo một đối tượng Product mới với các thông tin đã lấy được
        // Sử dụng cú pháp ES6 để gán giá trị cho các thuộc tính
        const newProduct = new Product({
            name: name,          // Tên sản phẩm
            categoryId: categoryId,  // ID danh mục
            price: price,        // Giá sản phẩm
            description: description,  // Mô tả sản phẩm
            color: color,        // Màu sắc
            image: image,        // Ảnh chính
            sub_image: sub_image // Các ảnh phụ
        })
        
        // Lưu sản phẩm mới vào database
        // await để đợi quá trình lưu hoàn tất
        const product = await newProduct.save()
        // Trả về status code 200 (thành công) và dữ liệu sản phẩm đã lưu
        reply.code(200).send(product)
    } catch (err) {
        // Nếu có lỗi xảy ra, trả về status code 500 (lỗi server) và thông tin lỗi
        reply.code(500).send(err)
    }
}

// Export một hàm bất đồng bộ để cập nhật sản phẩm, nhận vào request và reply
exports.update = async(req, reply) => {
    try {
        // Sử dụng phương thức findByIdAndUpdate của Mongoose để tìm và cập nhật sản phẩm
        const product = await Product.findByIdAndUpdate(
            req.params.id,      // ID sản phẩm cần cập nhật, lấy từ params của URL
            {$set: req.body},   // Sử dụng toán tử $set để cập nhật các trường trong req.body
            {new: true}         // Option new: true để trả về document sau khi đã cập nhật
        )
        // Trả về status code 200 và sản phẩm đã được cập nhật
        reply.code(200).send(product)
    } catch (err) {
        // Nếu có lỗi xảy ra, trả về status code 500 và thông tin lỗi
        reply.code(500).send(err)
    }
}

// Export hàm bất đồng bộ để lấy tất cả sản phẩm
exports.getAll = async(req, reply) => {
    try {
        // Sử dụng phương thức find() của Mongoose để lấy tất cả sản phẩm từ database
        const product = await Product.find()
        // Trả về status code 200 và danh sách sản phẩm
        reply.code(200).send(product)
    } catch (err) {
        // Nếu có lỗi, trả về status code 500 và thông tin lỗi
        reply.code(500).send(err)
    }
}

// Export hàm bất đồng bộ để lấy một sản phẩm cụ thể theo ID
exports.getOne = async(req, reply) => {
    try {
        // Sử dụng findById để tìm sản phẩm theo ID từ params của request
        const product = await Product.findById(req.params.id)
        // Trả về status code 200 và thông tin sản phẩm
        reply.code(200).send(product)
    } catch (err) {
        // Nếu có lỗi, trả về status code 500 và thông tin lỗi
        reply.code(500).send(err)
    }
}

// Export hàm bất đồng bộ để xóa sản phẩm theo ID
exports.delete = async(req, reply) => {
    try {
        // Sử dụng findByIdAndDelete để tìm và xóa sản phẩm theo ID
        await Product.findByIdAndDelete(req.params.id)
        // Trả về status code 200 và thông báo thành công
        reply.code(200).send("Delete success")
    } catch (err) {
        // Nếu có lỗi, trả về status code 500 và thông tin lỗi
        reply.code(500).send(err)
    }
}

// Export hàm bất đồng bộ để lấy sản phẩm theo danh mục với các tùy chọn lọc và phân trang
exports.getByCategoryId = async(req, reply) => {
    try {
        // Lấy ID danh mục từ params của request
        const id = req.params.id
        // Destructuring các tham số query để lọc và phân trang
        const {min, max, sort, page, limit} = req.query
        
        // Xử lý logic phân trang
        const Page = page ? parseInt(page) : 1    // Nếu có page thì parse sang số, không thì mặc định là 1
        const Limit = limit ? limit : 10          // Nếu có limit thì dùng limit đó, không thì mặc định là 10
        const skip = (Page - 1) * Limit          // Tính số lượng document cần bỏ qua
        
        // Query database với nhiều điều kiện
        const product = await Product.find(
            {
                categoryId: id,     // Lọc theo ID danh mục
                price: {
                    $gt: min | 1,   // Giá lớn hơn min hoặc 1 (nếu không có min)
                    $lt: max || 100000000  // Giá nhỏ hơn max hoặc 100tr (nếu không có max)
                }
            }
        )
        .sort({price: sort === "desc" ? -1 : 1})     // Sắp xếp theo giá (giảm dần nếu desc, tăng dần nếu không)
        .sort({createdAt: sort === 'new' ? -1 : 1})  // Sắp xếp theo thời gian tạo (mới nhất nếu new)
        .skip(skip)    // Bỏ qua số lượng document theo skip đã tính
        .limit(Limit)  // Giới hạn số lượng document trả về
    
        // Trả về status code 200 và danh sách sản phẩm đã lọc
        reply.code(200).send(product)
    } catch (err) {
        // Nếu có lỗi, trả về status code 500 và thông tin lỗi
        reply.code(500).send(err)
    }
}

// Export hàm bất đồng bộ để tìm kiếm sản phẩm với các tùy chọn lọc
exports.findProduct = async(req, reply) => {
    try {
        // Lấy các tham số tìm kiếm từ query
        const {q, min, max, sort} = req.query
        let query = {}

        // Nếu có từ khóa tìm kiếm, thêm điều kiện tìm theo tên
        if (q && q !== undefined) {
            const name = { $regex: q, $options: 'i' }  // Tìm kiếm không phân biệt hoa thường
            query.name = name
        }
        
        // Query database với các điều kiện
        const product = await Product.find({
            ...query,
            price: {
                $gt: min | 1,  // Giá lớn hơn min hoặc 1
                $lt: max || 100000000  // Giá nhỏ hơn max hoặc 100tr
            }
        })
        .sort({price: sort === "desc" ? -1 : 1})  // Sắp xếp theo giá (giảm dần nếu desc, tăng dần nếu không)
        .sort({createdAt: sort === 'new' ? -1 : 1})  // Sắp xếp theo thời gian tạo (mới nhất nếu new)

        // Trả về status code 200 và danh sách sản phẩm đã tìm kiếm
        reply.code(200).send(product)
    } catch (err) {
        // Nếu có lỗi, trả về status code 500 và thông tin lỗi
        reply.code(500).send(err)
    }
}

// Export hàm bất đồng bộ để lấy sản phẩm theo danh mục
exports.ProductByCategory = async(req, reply) => {
    try {
        // Lấy tất cả danh mục
        const category = await Category.find()
        const data = []

        // Với mỗi danh mục, lấy 15 sản phẩm đầu tiên
        for (const item of category) {
            const products = await Product.find({ categoryId: item._id }).limit(15)
            data.push({ 
                category: item.name,  // Tên danh mục
                categoryId: item._id,  // ID danh mục
                products  // Danh sách sản phẩm
            })
        }
        // Trả về status code 200 và dữ liệu danh mục cùng sản phẩm
        reply.code(200).send(data)
    } catch (err) {
        // Nếu có lỗi, trả về status code 500 và thông tin lỗi
        reply.code(500).send(err)
    }
}

// Export hàm bất đồng bộ để lấy sản phẩm mới nhất
exports.ProductNew = async(req, reply) => {
    try {
        // Lấy tham số phân trang từ query
        const {limit = 15, page = 1} = req.query
        const skip = (page - 1) * limit  // Tính số lượng item cần bỏ qua
        
        // Query lấy sản phẩm, sắp xếp theo thời gian tạo mới nhất
        const product = await Product.find()
            .sort({createdAt: -1})  // Sắp xếp giảm dần theo thời gian tạo
            .skip(skip)  // Bỏ qua số lượng item
            .limit(parseInt(limit))  // Giới hạn số lượng trả về
            
        // Trả về status code 200 và danh sách sản phẩm mới nhất
        reply.code(200).send(product)
    } catch (err) {
        // Nếu có lỗi, trả về status code 500 và thông tin lỗi
        reply.code(500).send(err)
    }
}