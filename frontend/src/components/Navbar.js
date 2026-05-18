import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const avatarBg = (name = '') => {
  const colors = ['#5b4de8', '#ff5c57', '#00b4a6', '#f5a623', '#a259ff', '#0ea5e9']
  return colors[name.charCodeAt(0) % colors.length]
}

const getInitials = (name = '') =>
  name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav style={{
      background: 'rgba(15,15,15,0.97)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
      padding: '0',
      position: 'sticky',
      top: 0,
      zIndex: 200,
      boxShadow: '0 2px 24px rgba(0,0,0,0.35)',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px',
        height: '60px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '20px',
      }}>

        {/* ── Logo ── */}
        <Link to="/" style={{
          textDecoration: 'none',
          display: 'flex', alignItems: 'center', gap: '10px',
          flexShrink: 0,
        }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '8px',
           // background: 'linear-gradient(135deg, #5b4de8, #a259ff)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <img src="/logo.png" alt="" style={{ height: '80px', borderRadius: '1px' }}
              onError={e => e.target.style.display = 'none'} />
          </div>
          <span style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '20px', fontWeight: 900,
            color: 'white', letterSpacing: '-0.01em',
          }}>
            Writify
          </span>
        </Link>

        {/* ── Nav links (center) ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px', flex: 1, justifyContent: 'center' }}>
          <NavItem to="/"          label="Home"      icon="https://cdn-icons-png.flaticon.com/16/1946/1946436.png" />
          {user && (
            <>
              <NavItem to="/create"    label="Write"     icon="https://cdn-icons-png.flaticon.com/16/1828/1828919.png" />
              <NavItem to="/dashboard" label="Dashboard" icon="https://cdn-icons-png.flaticon.com/16/1584/1584942.png" />
              {user.role === 'admin' && (
                <NavItem to="/admin" label="Admin" icon="https://cdn-icons-png.flaticon.com/16/2099/2099058.png" accent />
              )}
            </>
          )}
          {!user && (
            <NavItem to="/login" label="Login" icon="https://cdn-icons-png.flaticon.com/16/1077/1077012.png" />
          )}
        </div>

        {/* ── Right: user actions ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          {user ? (
            <>
              {/* Avatar + name */}
              <Link to={'/profile/' + user.id} style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                textDecoration: 'none', padding: '4px 10px 4px 4px',
                borderRadius: '999px', background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                transition: 'background 0.15s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: avatarBg(user.name),
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontSize: '11px', fontWeight: 700,
                  flexShrink: 0, overflow: 'hidden',
                }}>
                  {user.profileImage
                    ? <img src={user.profileImage} alt=""
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={e => e.target.style.display = 'none'} />
                    : getInitials(user.name)
                  }
                </div>
                <span style={{
                  color: 'rgba(255,255,255,0.85)', fontSize: '13px', fontWeight: 600,
                  fontFamily: "'DM Sans', sans-serif", maxWidth: '90px',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {user.name?.split(' ')[0]}
                </span>
              </Link>

              {/* Logout */}
              <button onClick={handleLogout} style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                padding: '7px 14px', borderRadius: '999px',
                background: 'rgba(255,92,87,0.15)', border: '1px solid rgba(255,92,87,0.3)',
                color: '#ff8a87', cursor: 'pointer',
                fontSize: '13px', fontWeight: 600,
                fontFamily: "'DM Sans', sans-serif",
                transition: 'all 0.15s',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#ff5c57'
                  e.currentTarget.style.color = 'white'
                  e.currentTarget.style.borderColor = '#ff5c57'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,92,87,0.15)'
                  e.currentTarget.style.color = '#ff8a87'
                  e.currentTarget.style.borderColor = 'rgba(255,92,87,0.3)'
                }}>
                <img src="https://cdn-icons-png.flaticon.com/12/1828/1828427.png" alt=""
                  width="11" style={{ filter: 'brightness(0) invert(1)', opacity: 0.85 }} />
                Logout
              </button>
            </>
          ) : (
            <Link to="/register" style={{
              padding: '8px 20px', borderRadius: '999px',
              background: 'linear-gradient(135deg, #5b4de8, #8b7cf8)',
              color: 'white', textDecoration: 'none',
              fontSize: '13px', fontWeight: 700,
              fontFamily: "'DM Sans', sans-serif",
              boxShadow: '0 3px 14px rgba(91,77,232,0.4)',
              transition: 'opacity 0.15s, transform 0.15s',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.opacity = '0.9'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.opacity = '1'
                e.currentTarget.style.transform = 'translateY(0)'
              }}>
              Get Started
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}

/* Small helper for center nav items */
const NavItem = ({ to, label, icon, accent }) => (
  <Link to={to} style={{
    display: 'flex', alignItems: 'center', gap: '5px',
    padding: '5px 14px', borderRadius: '8px',
    textDecoration: 'none', fontSize: '13px', fontWeight: 500,
    fontFamily: "'DM Sans', sans-serif",
    color: accent ? '#f5a623' : 'rgba(255,255,255,0.65)',
    background: 'transparent',
    transition: 'color 0.15s, background 0.15s',
  }}
    onMouseEnter={e => {
      e.currentTarget.style.color = accent ? '#fbbf24' : 'white'
      e.currentTarget.style.background = 'rgba(255,255,255,0.07)'
    }}
    onMouseLeave={e => {
      e.currentTarget.style.color = accent ? '#f5a623' : 'rgba(255,255,255,0.65)'
      e.currentTarget.style.background = 'transparent'
    }}>
    <img
      src={icon}
      alt=""
      width="13"
      style={{
        filter: accent
          ? 'brightness(0) saturate(100%) invert(78%) sepia(60%) saturate(500%) hue-rotate(5deg)'
          : 'brightness(0) invert(1)',
        opacity: 0.75,
      }}
    />
    {label}
  </Link>
)

export default Navbar