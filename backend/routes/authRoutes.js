const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')

const {registerUser, loginUser, getAllUsers, deleteUser, updateProfile, getUserProfile} = require('../controllers/authController')
const {protect, adminOnly} = require('../middleware/authMiddleware')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({storage})

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/users', protect, adminOnly, getAllUsers)
router.delete('/users/:id', protect, adminOnly, deleteUser)
router.put('/profile', protect, updateProfile)
router.get('/profile/:id', getUserProfile)

router.post('/upload', protect, upload.single('image'), (req, res) => {
    if(!req.file) {
        return res.status(400).json({message: 'No file uploaded'})
    }
    res.status(200).json({
        message: 'Image uploaded',
        imageUrl: 'http://localhost:5000/uploads/' + req.file.filename
    })
})

module.exports = router