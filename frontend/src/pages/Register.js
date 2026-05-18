import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../api/axios'
import { useAuth } from '../context/AuthContext'

const Register = () => {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [focusedField, setFocusedField] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) return setError('Passwords do not match')
    if (password.length < 6) return setError('Password must be at least 6 characters')

    setLoading(true)
    try {
      const res = await API.post('/auth/register', { name, email, password })
      login({ ...res.data.user, token: res.data.token })
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    }
    setLoading(false)
  }

  const fields = [
    { id: 'name',            label: 'Full Name',       type: 'text',     placeholder: 'Your full name',      value: name,            setter: setName },
    { id: 'email',           label: 'Email Address',   type: 'email',    placeholder: 'you@example.com',     value: email,           setter: setEmail },
    { id: 'password',        label: 'Password',        type: 'password', placeholder: 'Min. 6 characters',   value: password,        setter: setPassword },
    { id: 'confirmPassword', label: 'Confirm Password',type: 'password', placeholder: 'Re-enter password',   value: confirmPassword, setter: setConfirmPassword },
  ]

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      fontFamily: "'DM Sans', sans-serif",
      background: '#f7f6ff',
    }}>

      {/* ── Left Panel (decorative) ── */}
      <div style={{
        width: '42%',
        background: 'linear-gradient(145deg, #5b4de8 0%, #8b7cf8 55%, #c084fc 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '52px 48px',
        position: 'relative',
        overflow: 'hidden',
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
            Your ideas<br />deserve an<br />audience.
          </h2>
          <p style={{ color:'rgba(255,255,255,0.7)', fontSize:'15px', lineHeight:1.6 }}>
            Join thousands of writers sharing stories,<br />knowledge, and expertise every day.
          </p>
        </div>

        {/* stats row */}
        <div style={{ position:'relative', zIndex:1, display:'flex', gap:'32px' }}>
          {[['12k+','Writers'],['48k+','Stories'],['200k+','Readers']].map(([num, label]) => (
            <div key={label}>
              <div style={{ fontFamily:"'Playfair Display', serif", fontSize:'26px', fontWeight:900, color:'white' }}>{num}</div>
              <div style={{ fontSize:'12px', color:'rgba(255,255,255,0.6)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.08em' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right Panel (form) ── */}
      <div style={{
        flex:1,
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        padding:'48px 64px',
        overflowY:'auto',
      }}>
        <div style={{ width:'100%', maxWidth:'480px' }}>

          <div style={{ marginBottom:'36px' }}>
            <h1 style={{
              fontFamily:"'Playfair Display', serif",
              fontSize:'36px', fontWeight:900, color:'#0f0f1a',
              marginBottom:'8px', lineHeight:1.2,
            }}>
              Create your account
            </h1>
            <p style={{ color:'#7a7a8a', fontSize:'15px', fontWeight:400 }}>
              Already have one?{' '}
              <Link to="/login" style={{ color:'#5b4de8', fontWeight:700, textDecoration:'none' }}>
                Sign in
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

          <div style={{ display:'flex', flexDirection:'column', gap:'20px', marginBottom:'28px' }}>
            {fields.map(({ id, label, type, placeholder, value, setter }) => {
              const focused = focusedField === id
              return (
                <div key={id}>
                  <label style={{
                    display:'block', fontSize:'13px', fontWeight:700,
                    color: focused ? '#5b4de8' : '#3a3a4a',
                    marginBottom:'7px', letterSpacing:'0.02em',
                    textTransform:'uppercase', transition:'color 0.15s',
                  }}>
                    {label}
                  </label>
                  <input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    onFocus={() => setFocusedField(id)}
                    onBlur={() => setFocusedField(null)}
                    required
                    style={{
                      width:'100%', padding:'14px 18px',
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
              width:'100%', padding:'15px',
              fontSize:'16px', fontWeight:700,
              fontFamily:"'DM Sans', sans-serif",
              background: loading
                ? 'linear-gradient(135deg, #9b8ff0, #b8a8f5)'
                : 'linear-gradient(135deg, #5b4de8 0%, #8b7cf8 100%)',
              color:'white', border:'none', borderRadius:'10px',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow:'0 6px 24px rgba(91,77,232,0.35)',
              transition:'all 0.2s',
              letterSpacing:'0.01em',
            }}
          >
            {loading ? 'Creating your account…' : 'Create Account'}
          </button>

          <p style={{
            textAlign:'center', marginTop:'20px',
            fontSize:'12px', color:'#aaa', lineHeight:1.6,
          }}>
            By signing up, you agree to our{' '}
            <span style={{ color:'#5b4de8', cursor:'pointer', fontWeight:600 }}>Terms</span>
            {' '}and{' '}
            <span style={{ color:'#5b4de8', cursor:'pointer', fontWeight:600 }}>Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register