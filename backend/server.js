require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path') 

const app = express()

// app.use(cors())
app.use(cors({
    origin: ['https://writify-mnu6.vercel.app', 'http://localhost:3000'],
    credentials: true
}))
app.use(express.json())
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

const authRoutes = require('./routes/authRoutes')
const blogRoutes = require('./routes/blogRoutes')
const commentRoutes = require('./routes/commentRoutes')

app.use('/api/auth', authRoutes)
app.use('/api/blogs', blogRoutes)
app.use('/api/comments', commentRoutes)

app.get('/', (req, res) => {
    res.send('Writify server is running')
})

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('MongoDB connected')
    const PORT = process.env.PORT || 5000
    app.listen(PORT, '0.0.0.0', () => {
        console.log('Server started on port ' + PORT)
    })
}).catch((err) => {
    console.log('Connection failed', err)
})

// mongoose.connect(process.env.MONGO_URI).then(() => {
//     console.log('MongoDB connected')
//     app.listen(process.env.PORT || 5000, () => {
//         console.log('Server started on port 5000')
//     })
// }).catch((err) => {
//     console.log('Connection failed', err)
// })

// mongoose.connect(process.env.MONGO_URI).then(() => {
//     console.log('MongoDB connected')
//     const PORT = process.env.PORT || 5000
//     app.listen(PORT, () => {
//         console.log('Server started on port ' + PORT)
//     })
// }).catch((err) => {
//     console.log('Connection failed', err)
// })
