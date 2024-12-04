const mongoose=require('mongoose')

const connect=async()=>{
    try {
        await mongoose.connect(process.env.DB_URL)
        console.log('Connected to server')
    } catch (err) {
        console.log(err)
    }
}
module.exports=connect