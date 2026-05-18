import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../api/axios'
import { useAuth } from '../context/AuthContext'

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [focusedField, setFocusedField] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await API.post('/auth/login', { email, password })
      login({ ...res.data.user, token: res.data.token })
      if (res.data.user.role === 'admin') navigate('/admin')
      else navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight:'100vh',
      display:'flex',
      fontFamily:"'DM Sans', sans-serif",
      background:'#f7f6ff',
    }}>

      {/* ── Left Panel (decorative) ── */}
      <div style={{
        width:'42%',
        background:'linear-gradient(145deg, #5b4de8 0%, #8b7cf8 55%, #c084fc 100%)',
        display:'flex',
        flexDirection:'column',
        justifyContent:'space-between',
        padding:'52px 48px',
        position:'relative',
        overflow:'hidden',
      }}>
        {/* blobs */}
        <div style={{ position:'absolute', top:'-80px', left:'-80px', width:'300px', height:'300px', borderRadius:'50%', background:'rgba(255,255,255,0.07)' }} />
        <div style={{ position:'absolute', bottom:'60px', right:'-60px', width:'220px', height:'220px', borderRadius:'50%', background:'rgba(255,255,255,0.07)' }} />
        <div style={{ position:'absolute', bottom:'-40px', left:'80px', width:'160px', height:'160px', borderRadius:'50%', background:'rgba(255,92,87,0.18)' }} />

        {/* logo */}
        <div style={{ position:'relative', zIndex:1 }}>
          <div style={{
            display:'inline-flex', alignItems:'center', gap:'8px',
            background:'rgba(255,255,255,0.15)', borderRadius:'999px',
            padding:'8px 18px',
          }}>
            <img src="https://cdn-icons-png.flaticon.com/20/3176/3176298.png" alt="" width="16" style={{ opacity:0.9 }} />
            <span style={{ color:'white', fontWeight:800, fontSize:'15px', letterSpacing:'0.02em' }}>Writify</span>
          </div>
        </div>

        {/* headline */}
        <div style={{ position:'relative', zIndex:1 }}>
          <h2 style={{
            fontFamily:"'Playfair Display', serif",
            fontSize:'44px', fontWeight:900, color:'white',
            lineHeight:1.15, marginBottom:'16px',
          }}>
            Welcome<br />back to<br />your stories.
          </h2>
          <p style={{ color:'rgba(255,255,255,0.7)', fontSize:'15px', lineHeight:1.6 }}>
            Pick up where you left off.<br />Your readers are waiting.
          </p>
        </div>

        {/* decorative quote */}
        <div style={{
          position:'relative', zIndex:1,
          background:'rgba(255,255,255,0.12)', borderRadius:'14px',
          padding:'20px 22px', borderLeft:'3px solid rgba(255,255,255,0.4)',
        }}>
          <p style={{ color:'rgba(255,255,255,0.85)', fontSize:'14px', lineHeight:1.65, fontStyle:'italic', margin:0 }}>
            "The scariest moment is always just before you start. After that, things can only get better."
          </p>
          <p style={{ color:'rgba(255,255,255,0.5)', fontSize:'12px', marginTop:'10px', fontWeight:600, margin:'10px 0 0' }}>
            — Stephen King
          </p>
        </div>
      </div>

      {/* ── Right Panel (form) ── */}
      <div style={{
        flex:1,
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        padding:'48px 64px',
      }}>
        <div style={{ width:'100%', maxWidth:'440px' }}>

          <div style={{ marginBottom:'40px' }}>
            <h1 style={{
              fontFamily:"'Playfair Display', serif",
              fontSize:'38px', fontWeight:900, color:'#0f0f1a',
              marginBottom:'8px', lineHeight:1.2,
            }}>
              Sign in
            </h1>
            <p style={{ color:'#7a7a8a', fontSize:'15px', fontWeight:400 }}>
              New to Writify?{' '}
              <Link to="/register" style={{ color:'#5b4de8', fontWeight:700, textDecoration:'none' }}>
                Create an account
              </Link>
            </p>
          </div>

          {error && (
            <div style={{
              background:'#fff1f0', border:'1.5px solid #ff5c57',
              color:'#cc1f1a', borderRadius:'10px',
              padding:'12px 16px', fontSize:'14px', fontWeight:500,
              marginBottom:'24px', display:'flex', alignItems:'center', gap:'8px',
            }}>
              <img src="https://cdn-icons-png.flaticon.com/16/564/564619.png" alt="" width="14" />
              {error}
            </div>
          )}

          <div style={{ display:'flex', flexDirection:'column', gap:'22px', marginBottom:'32px' }}>
            {[
              { id:'email',    label:'Email Address', type:'email',    placeholder:'you@example.com',    value:email,    setter:setEmail },
              { id:'password', label:'Password',      type:'password', placeholder:'Enter your password', value:password, setter:setPassword },
            ].map(({ id, label, type, placeholder, value, setter }) => {
              const focused = focusedField === id
              return (
                <div key={id}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'7px' }}>
                    <label style={{
                      fontSize:'13px', fontWeight:700,
                      color: focused ? '#5b4de8' : '#3a3a4a',
                      letterSpacing:'0.02em', textTransform:'uppercase',
                      transition:'color 0.15s',
                    }}>
                      {label}
                    </label>
                    {id === 'password' && (
                      <span style={{ fontSize:'12px', color:'#5b4de8', fontWeight:600, cursor:'pointer' }}>
                        Forgot password?
                      </span>
                    )}
                  </div>
                  <input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    onFocus={() => setFocusedField(id)}
                    onBlur={() => setFocusedField(null)}
                    required
                    style={{
                      width:'100%', padding:'15px 18px',
                      fontSize:'15px', fontFamily:"'DM Sans', sans-serif",
                      border: focused ? '2px solid #5b4de8' : '2px solid #e4e4f0',
                      borderRadius:'10px', outline:'none',
                      background: focused ? '#faf9ff' : 'white',
                      color:'#0f0f1a',
                      boxShadow: focused ? '0 0 0 4px rgba(91,77,232,0.1)' : 'none',
                      transition:'all 0.18s',
                      boxSizing:'border-box',
                    }}
                  />
                </div>
              )
            })}
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width:'100%', padding:'16px',
              fontSize:'16px', fontWeight:700,
              fontFamily:"'DM Sans', sans-serif",
              background: loading
                ? 'linear-gradient(135deg, #9b8ff0, #b8a8f5)'
                : 'linear-gradient(135deg, #5b4de8 0%, #8b7cf8 100%)',
              color:'white', border:'none', borderRadius:'10px',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow:'0 6px 24px rgba(91,77,232,0.35)',
              transition:'all 0.2s',
            }}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>

        </div>
      </div>
    </div>
  )
}

export default Login