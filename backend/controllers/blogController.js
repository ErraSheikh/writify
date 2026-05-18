const Blog = require('../models/Blog')
const User = require('../models/User')

const createBlog = async (req, res) => {
    const {title, content, thumbnail, category, tags} = req.body

    if(!title || !content) {
        return res.status(400).json({message: 'Title and content are required'})
    }

    const blog = await Blog.create({
        title,
        content,
        thumbnail,
        category: category || 'General',
        tags: tags || [],
        author: req.user._id
    })

    res.status(201).json({message: 'Blog created', blog})
}

const getAllBlogs = async (req, res) => {
    const blogs = await Blog.find()
        .populate('author', 'name profileImage')
        .sort({createdAt: -1})

    res.status(200).json({count: blogs.length, blogs})
}

const getBlogById = async (req, res) => {
    const blog = await Blog.findById(req.params.id)
        .populate('author', 'name profileImage bio')

    if(!blog) {
        return res.status(404).json({message: 'Blog not found'})
    }

    blog.views = blog.views + 1
    await blog.save()

    res.status(200).json({blog})
}

const updateBlog = async (req, res) => {
    const blog = await Blog.findById(req.params.id)

    if(!blog) {
        return res.status(404).json({message: 'Blog not found'})
    }

    if(blog.author.toString() !== req.user._id.toString()) {
        return res.status(403).json({message: 'You can only edit your own blogs'})
    }

    const {title, content, thumbnail, category, tags} = req.body

    if(title) blog.title = title
    if(content) blog.content = content
    if(thumbnail) blog.thumbnail = thumbnail
    if(category) blog.category = category
    if(tags) blog.tags = tags

    await blog.save()

    res.status(200).json({message: 'Blog updated', blog})
}

const deleteBlog = async (req, res) => {
    const blog = await Blog.findById(req.params.id)

    if(!blog) {
        return res.status(404).json({message: 'Blog not found'})
    }

    if(blog.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({message: 'Not authorized to delete this blog'})
    }

    await Blog.findByIdAndDelete(req.params.id)
    res.status(200).json({message: 'Blog deleted'})
}

const likeBlog = async (req, res) => {
    const blog = await Blog.findById(req.params.id)

    if(!blog) {
        return res.status(404).json({message: 'Blog not found'})
    }

    const alreadyLiked = blog.likes.includes(req.user._id)

    if(alreadyLiked) {
        blog.likes = blog.likes.filter(id => id.toString() !== req.user._id.toString())
        await blog.save()
        return res.status(200).json({message: 'Blog unliked', likes: blog.likes.length})
    } else {
        blog.likes.push(req.user._id)
        await blog.save()
        return res.status(200).json({message: 'Blog liked', likes: blog.likes.length})
    }
}

const saveBlog = async (req, res) => {
    const user = await User.findById(req.user._id)
    const blogId = req.params.id

    const alreadySaved = user.savedBlogs.includes(blogId)

    if(alreadySaved) {
        user.savedBlogs = user.savedBlogs.filter(id => id.toString() !== blogId)
        await user.save()
        return res.status(200).json({message: 'Blog unsaved'})
    } else {
        user.savedBlogs.push(blogId)
        await user.save()
        return res.status(200).json({message: 'Blog saved'})
    }
}

const searchBlogs = async (req, res) => {
    const keyword = req.query.keyword

    if(!keyword) {
        return res.status(400).json({message: 'Please provide a search keyword'})
    }

    const blogs = await Blog.find({
        $or: [
            {title: {$regex: keyword, $options: 'i'}},
            {content: {$regex: keyword, $options: 'i'}},
            {category: {$regex: keyword, $options: 'i'}},
            {tags: {$in: [new RegExp(keyword, 'i')]}}
        ]
    }).populate('author', 'name profileImage').sort({createdAt: -1})

    res.status(200).json({count: blogs.length, blogs})
}

const getRecentBlogs = async (req, res) => {
    const blogs = await Blog.find()
        .populate('author', 'name profileImage')
        .sort({createdAt: -1})
        .limit(5)

    res.status(200).json({blogs})
}

const getBlogsByCategory = async (req, res) => {
    const blogs = await Blog.find({category: req.params.category})
        .populate('author', 'name profileImage')
        .sort({createdAt: -1})

    res.status(200).json({count: blogs.length, blogs})
}

const getRelatedBlogs = async (req, res) => {
    const blog = await Blog.findById(req.params.id)

    if(!blog) {
        return res.status(404).json({message: 'Blog not found'})
    }

    const related = await Blog.find({
        category: blog.category,
        _id: {$ne: blog._id}
    }).populate('author', 'name profileImage').limit(3)

    res.status(200).json({blogs: related})
}

const getUserBlogs = async (req, res) => {
    const blogs = await Blog.find({author: req.params.userId})
        .populate('author', 'name profileImage')
        .sort({createdAt: -1})

    res.status(200).json({count: blogs.length, blogs})
}

const getSavedBlogs = async (req, res) => {
    const user = await User.findById(req.user._id).populate({
        path: 'savedBlogs',
        populate: {path: 'author', select: 'name profileImage'}
    })

    res.status(200).json({blogs: user.savedBlogs})
}

const getLikedBlogs = async (req, res) => {
    const blogs = await Blog.find({likes: req.user._id})
        .populate('author', 'name profileImage')
        .sort({createdAt: -1})

    res.status(200).json({blogs})
}

module.exports = {
    createBlog,
    getAllBlogs,
    getBlogById,
    updateBlog,
    deleteBlog,
    likeBlog,
    saveBlog,
    searchBlogs,
    getRecentBlogs,
    getBlogsByCategory,
    getRelatedBlogs,
    getUserBlogs,
    getSavedBlogs,
    getLikedBlogs
}