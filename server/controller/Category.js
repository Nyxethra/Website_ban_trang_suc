const Category = require('../model/Category')

exports.create = async (req, reply) => {
    try {
        const newCategory = new Category({ name: req.body.name })
        const result = await newCategory.save()
        reply.code(200).send(result)
    } catch (err) {
        reply.code(500).send(err)
    }
}

exports.delete = async (req, reply) => {
    try {
        await Category.findByIdAndDelete(req.params.id)
        reply.code(200).send("delete success")
    } catch (err) {
        reply.code(500).send(err)
    }
}

exports.findAll = async (req, reply) => {
    try {
        const category = await Category.find()
        reply.code(200).send(category)
    } catch (err) {
        reply.code(500).send(err)
    }
}

exports.update = async (req, reply) => {
    try {
        const { id } = req.params
        const { name } = req.body

        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            { name },
            { new: true }
        )

        if (!updatedCategory) {
            return reply.code(404).send({ message: 'Category not found' })
        }

        reply.code(200).send(updatedCategory)
    } catch (err) {
        reply.code(500).send({ message: 'Error updating category', error: err })
    }
}