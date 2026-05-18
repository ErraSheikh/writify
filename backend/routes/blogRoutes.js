const express = require('express')
const router = express.Router()

const {
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
} = require('../controllers/blogController')

const {protect} = require('../middleware/authMiddleware')
const upload = require('../middleware/uploadMiddleware')

router.post('/upload', protect, upload.single('image'), (req, res) => {
    if(!req.file) {
        return res.status(400).json({message: 'No file uploaded'})
    }
    res.status(200).json({
        message: 'Image uploaded',
        imageUrl: 'http://localhost:5000/uploads/' + req.file.filename
    })
})


router.get('/', getAllBlogs)
router.get('/search', searchBlogs)
router.get('/recent', getRecentBlogs)
router.get('/category/:category', getBlogsByCategory)
router.get('/user/:userId', getUserBlogs)
router.get('/saved', protect, getSavedBlogs)
router.get('/liked', protect, getLikedBlogs)
router.get('/:id', getBlogById)
router.get('/:id/related', getRelatedBlogs)
router.post('/', protect, createBlog)
router.put('/:id', protect, updateBlog)
router.delete('/:id', protect, deleteBlog)
router.put('/:id/like', protect, likeBlog)
router.put('/:id/save', protect, saveBlog)



module.exports = router