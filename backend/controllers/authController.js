const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const registerUser = async (req, res) => {
    const {name, email, password} = req.body

    if(!name || !email || !password) {
        return res.status(400).json({message: 'Please fill all fields'})
    }

    const userExists = await User.findOne({email})
    if(userExists) {
        return res.status(400).json({message: 'Email already exists'})
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: 'user'
    })

    const token = jwt.sign({id: user._id, role: user.role}, process.env.JWT_SECRET, {expiresIn: '7d'})

    res.status(201).json({
        message: 'User registered',
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    })
}

const loginUser = async (req, res) => {
    const {email, password} = req.body

    if(!email || !password) {
        return res.status(400).json({message: 'Please enter email and password'})
    }

    const user = await User.findOne({email})
    if(!user) {
        return res.status(400).json({message: 'Invalid credentials'})
    }

    const passwordMatch = await bcrypt.compare(password, user.password)
    if(!passwordMatch) {
        return res.status(400).json({message: 'Invalid credentials'})
    }

    const token = jwt.sign({id: user._id, role: user.role}, process.env.JWT_SECRET, {expiresIn: '7d'})

    res.status(200).json({
        message: 'Login successful',
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    })
}

const getAllUsers = async (req, res) => {
    const users = await User.find().select('-password')
    res.status(200).json({count: users.length,
         users})
}

const deleteUser = async (req, res) => {
    const user = await User.findById(req.params.id)

    if(!user) {
        return res.status(404).json({message: 'User not found'})
    }

    if(user._id.toString() === req.user._id.toString()) {
        return res.status(400).json({message: 'Cannot delete your own account'})
    }

    await User.findByIdAndDelete(req.params.id)
    res.status(200).json({message: 'User deleted'})
}

const updateProfile = async (req, res) => {
    const user = await User.findById(req.user._id)

    if(!user) {
        return res.status(404).json({message: 'User not found'})
    }

    const {name, bio, profileImage, socialLinks} = req.body

    if(name) user.name = name
    if(bio) user.bio = bio
    if(profileImage) user.profileImage = profileImage
    if(socialLinks) user.socialLinks = socialLinks

    await user.save()

    res.status(200).json({message: 'Profile updated', user})
}

const getUserProfile = async (req, res) => {
    const user = await User.findById(req.params.id).select('-password')

    if(!user) {
        return res.status(404).json({message: 'User not found'})
    }

    res.status(200).json({user})
}

module.exports = {registerUser, loginUser, getAllUsers, deleteUser, updateProfile, getUserProfile}