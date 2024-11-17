const Category=require('../model/Category')


exports.create=async(req,reply)=>{
    try {
        const newCatygory=new Category({name:req.body.name})
        const result=await newCatygory.save()
        reply.code(200).send(result)
    } catch (err) {
        reply.code(500).send(err)
    }
}
exports.delete=async(req,reply)=>{
    try {
        await Category.findByIdAndDelete(req.params.id)
        reply.code(200).send("delete success")
    } catch (err) {
        reply.code(500).send(err)
    }
}
exports.findAll=async(req,reply)=>{
    try {
        const category=await Category.find()
        reply.code(200).send(category)
    } catch (err) {
        reply.code(500).send(err)
    }
}