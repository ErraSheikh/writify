

const express = require('express')
const router = express.Router()
const multer = require('multer')
const cloudinary = require('../config/cloudinary')

const {registerUser, loginUser, getAllUsers, deleteUser, updateProfile, getUserProfile} = require('../controllers/authController')
const {protect, adminOnly} = require('../middleware/authMiddleware')

const storage = multer.memoryStorage()
const upload = multer({storage})

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/users', protect, adminOnly, getAllUsers)
router.delete('/users/:id', protect, adminOnly, deleteUser)
router.put('/profile', protect, updateProfile)
router.get('/profile/:id', getUserProfile)

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