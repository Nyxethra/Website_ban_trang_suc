const Comment=require('../model/Comment')
const User=require('../model/User')

exports.createComment=async(req,reply)=>{
    try {
        if(req.user){
            const newComment=new Comment({
                userId:req.user,
                productId:req.params.id,
                star:req.body.star,
                description:req.body.description,
                image:req.body.image,
                video:req.body.video
            })
            const comment=await newComment.save()
            reply.code(200).send(comment)
        }else{
            reply.code(401).send("authenrization")
        }
    } catch (err) {
        reply.code(500).send(err)
    }
}
exports.getAll=async(req,reply)=>{
    try {
        const page = req.query.page ? req.query.page : 1;
        const limit= req.query.limit ? req.query.limit :10

        const totalComments = await Comment.countDocuments(); // Tổng số bình luận

        const totalPages = Math.ceil(totalComments / limit); // Tổng số trang
        const skip = (page - 1) * limit; // Số lượng bản ghi bỏ qua

        const comments=await Comment.find({productId:req.params.id}).sort({ createdAt: -1 }).skip(skip).limit(limit);
        const data = [];

        for (const comment of comments) {
            const user = await User.findById(comment.userId);
            if (user) {
                data.push({ name: user.name, image: user.image, comment: comment });
            }
        }
        const result=await Comment.aggregate([
            { $match: {productId:req.params.id} },
            {$group:{
                _id:null,
                average:{$avg:"$star"},
                count:{$sum:1}
            }},
            {
                $project:{
                    _id:0,
                    averageRounded:{$round:["$average",1]},
                    count:1
                }
            }
        ])
        const average = result.length > 0 ? result[0].averageRounded : 0;
        const count = result.length > 0 ? result[0].count : 0;
        reply.code(200).send({data,totalPages,average,count})
    } catch (err) {
        reply.code(500).send(err)
    }
}

