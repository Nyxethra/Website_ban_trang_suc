const Product=require('../model/Product')
const Category =require('../model/Category')

exports.create=async(req,reply)=>{
    try {
        const {name,categoryId,price,description,color,image,sub_image}=req.body
        const newProduct=new Product({
            name:name,
            categoryId:categoryId,
            price:price,
            description:description,
            color:color,
            image:image,
            sub_image:sub_image
        })
        const product=await newProduct.save()
        reply.code(200).send(product)
    } catch (err) {
        reply.code(500).send(err)
    }
}
exports.update=async(req,reply)=>{
    try {
        const product=await Product.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true})
        reply.code(200).send(product)
    } catch (err) {
        reply.code(500).send(err)
    }
}

exports.getAll=async(req,reply)=>{
    try {
        const product=await Product.find()
        reply.code(200).send(product)
    } catch (err) {
        reply.code(500).send(err)
    }
}

exports.getOne=async(req,reply)=>{
    try {
        const product=await Product.findById(req.params.id)
        reply.code(200).send(product)
    } catch (err) {
        reply.code(500).send(err)
    }
}

exports.delete=async(req,reply)=>{
    try {
        const product=await Product.findByIdAndDelete(req.params.id)
        reply.code(200).send("Delete success")
    } catch (err) {
        reply.code(500).send(err)
    }
}
exports.getByCategoryId=async(req,reply)=>{
    try {

        const id=req.params.id
        const {min,max,sort,page,limit}=req.query
        const Page = page ? parseInt(page) : 1;
        const Limit= limit ? limit :10 
        const skip = (Page - 1) * Limit; 
        const product=await Product.find(
            {categoryId:id,price:{$gt: min |1,$lt: max || 100000000  }}
            )
        .sort({price:sort==="desc" ? -1 :1})
        .sort({createdAt:sort==='new' ? -1 : 1}).skip(skip).limit(Limit)
    
        reply.code(200).send(product)
    } catch (err) {
        reply.code(500).send(err)
    }
}
exports.findProduct=async(req,reply)=>{
    try {
        const {q,min,max,sort}=req.query
        let query = {};

        if (q && q!==undefined) {
            const name = { $regex: q, $options: 'i' };
            query.name = name;
        }
            const product=await Product.find({
                ...query,price:{$gt: min |1,$lt: max || 100000000}
            })
            .sort({price:sort==="desc" ? -1 :1})
            .sort({createdAt:sort==='new' ? -1 : 1})

        reply.code(200).send(product)
    } catch (err) {
        reply.code(500).send(err)
    }
}
exports.ProductByCategory=async(req,reply)=>{
    try {
        const category=await Category.find()
        const data = [];

        for (const item of category) {
            const products = await Product.find({ categoryId: item._id }).limit(15);
            
            data.push({ category: item.name,categoryId: item._id, products });
        }
        reply.code(200).send(data)
    } catch (err) {
        reply.code(500).send(err)
    }
}
exports.ProductNew=async(req,reply)=>{
    try {
        const {limit = 15, page = 1} = req.query
        const skip = (page - 1) * limit
        
        const product = await Product.find()
            .sort({createdAt: -1})
            .skip(skip)
            .limit(parseInt(limit))
            
        reply.code(200).send(product)
    } catch (err) {
        reply.code(500).send(err)
    }
}