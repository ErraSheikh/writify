const express = require('express')
const router = express.Router()
const multer = require('multer')
const cloudinary = require('../config/cloudinary')
const {protect} = require('../middleware/authMiddleware')

const {
    createBlog, getAllBlogs, getBlogById, updateBlog, deleteBlog,
    likeBlog, saveBlog, searchBlogs, getRecentBlogs, getBlogsByCategory,
    getRelatedBlogs, getUserBlogs, getSavedBlogs, getLikedBlogs
} = require('../controllers/blogController')

const storage = multer.memoryStorage()
const upload = multer({storage})

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

// Cloudinary upload for blog thumbnail
router.post('/upload', protect, upload.single('image'), async (req, res) => {
    if(!req.file) {
        return res.status(400).json({message: 'No file uploaded'})
    }
    try {
        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {folder: 'writify'},
                (error, result) => {
                    if(error) reject(error)
                    else resolve(result)
                }
            ).end(req.file.buffer)
        })
        res.status(200).json({message: 'Image uploaded', imageUrl: result.secure_url})
    } catch(err) {
        res.status(500).json({message: 'Upload failed'})
    }
})

module.exports = router