import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import BlogDetail from './pages/BlogDetail'
import CreateBlog from './pages/CreateBlog'
import EditBlog from './pages/EditBlog'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import AdminDashboard from './pages/AdminDashboard'

const ProtectedRoute = ({ children }) => {
    const { user } = useAuth()
    if(!user) return <Navigate to="/login" />
    return children
}

const AdminRoute = ({ children }) => {
    const { user } = useAuth()
    if(!user) return <Navigate to="/login" />
    if(user.role !== 'admin') return <Navigate to="/" />
    return children
}

const AppRoutes = () => {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/blog/:id" element={<BlogDetail />} />
                <Route path="/profile/:id" element={<Profile />} />
                <Route path="/create" element={<ProtectedRoute><CreateBlog /></ProtectedRoute>} />
                <Route path="/edit/:id" element={<ProtectedRoute><EditBlog /></ProtectedRoute>} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            </Routes>
        </>
    )
}

const App = () => {
    return (
        <AuthProvider>
            <BrowserRouter>
                <AppRoutes />
            </BrowserRouter>
        </AuthProvider>
    )
}

export default App