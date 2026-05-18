const Comment = require('../models/Comment')
const Blog = require('../models/Blog')

const getComments = async (req, res) => {
    const comments = await Comment.find({blog: req.params.blogId})
        .populate('author', 'name profileImage')
        .sort({createdAt: -1})

    res.status(200).json({count: comments.length, comments})
}

const addComment = async (req, res) => {
    const {text} = req.body

    if(!text) {
        return res.status(400).json({message: 'Comment text is required'})
    }

    const blog = await Blog.findById(req.params.blogId)
    if(!blog) {
        return res.status(404).json({message: 'Blog not found'})
    }

    const comment = await Comment.create({
        text,
        author: req.user._id,
        blog: req.params.blogId
    })

    const populated = await Comment.findById(comment._id)
        .populate('author', 'name profileImage')

    res.status(201).json({message: 'Comment added', comment: populated})
}

const deleteComment = async (req, res) => {
    const comment = await Comment.findById(req.params.id)

    if(!comment) {
        return res.status(404).json({message: 'Comment not found'})
    }

    if(comment.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({message: 'Not authorized to delete this comment'})
    }

    await Comment.findByIdAndDelete(req.params.id)
    res.status(200).json({message: 'Comment deleted'})
}

const getAllComments = async (req, res) => {
    const comments = await Comment.find()
        .populate('author', 'name')
        .populate('blog', 'title')
        .sort({createdAt: -1})

    res.status(200).json({count: comments.length, comments})
}

module.exports = {getComments, addComment, deleteComment, getAllComments}

