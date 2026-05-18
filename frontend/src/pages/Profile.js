import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import API from '../api/axios'

const catColors = {
  Technology: '#5b4de8', Health: '#00b4a6', Travel: '#f5a623',
  Food: '#ff5c57', Lifestyle: '#a259ff', Business: '#0ea5e9',
  Education: '#16a34a', Sports: '#f97316', Entertainment: '#ec4899',
  General: '#7a7a8a'
}

const avatarBg = (name = '') => {
  const colors = ['#5b4de8', '#ff5c57', '#00b4a6', '#f5a623', '#a259ff', '#0ea5e9']
  return colors[name.charCodeAt(0) % colors.length]
}

const getInitials = (name = '') =>
  name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

const getPreview = (content) => {
  const stripped = content.replace(/<[^>]+>/g, '')
  return stripped.length > 110 ? stripped.substring(0, 110) + '…' : stripped
}

const socialMeta = {
  twitter:   { label: 'Twitter',   icon: 'https://cdn-icons-png.flaticon.com/16/5968/5968830.png',  color: '#1da1f2', bg: '#e8f5fe' },
  instagram: { label: 'Instagram', icon: 'https://cdn-icons-png.flaticon.com/16/2111/2111463.png',  color: '#e1306c', bg: '#fce4ec' },
  linkedin:  { label: 'LinkedIn',  icon: 'https://cdn-icons-png.flaticon.com/16/174/174857.png',    color: '#0077b5', bg: '#e3f2fd' },
}

const Profile = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [profile, setProfile] = useState(null)
  const [blogs, setBlogs]     = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    API.get('/auth/profile/' + id).then(res => setProfile(res.data.user))
    API.get('/blogs/user/' + id).then(res => {
      setBlogs(res.data.blogs)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="loading-state">
      <div style={{ marginBottom: 12 }}>
        <span className="loading-dot" /><span className="loading-dot" /><span className="loading-dot" />
      </div>
      <p>Loading profile…</p>
    </div>
  )

  if (!profile) return (
    <div style={{ textAlign: 'center', padding: '80px 20px' }}>
      <img src="https://cdn-icons-png.flaticon.com/64/1077/1077012.png" alt="" width="52" style={{ opacity: 0.2, marginBottom: '12px' }} />
      <p style={{ color: 'var(--ink-muted)', fontSize: '16px', fontWeight: 500 }}>User not found</p>
    </div>
  )

  const bg = avatarBg(profile.name)
  const hasSocial = profile.socialLinks?.twitter || profile.socialLinks?.instagram || profile.socialLinks?.linkedin

  return (
    <div className="page">

      {/* ── Profile Hero Banner ── */}
      <div style={{
        borderRadius: '20px', marginBottom: '32px', overflow: 'hidden',
        border: '1.5px solid var(--border)', boxShadow: 'var(--shadow-md)',
      }}>
        {/* Cover strip */}
        <div style={{
          height: '120px',
          background: `linear-gradient(135deg, ${bg} 0%, ${bg}99 60%, #c084fc 100%)`,
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute', right: '-30px', top: '-30px',
            width: '180px', height: '180px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)', pointerEvents: 'none',
          }} />
        </div>

        {/* Info row */}
        <div style={{
          background: 'white', padding: '0 32px 28px',
          display: 'flex', gap: '24px', alignItems: 'flex-end',
        }}>
          {/* Avatar — overlapping the cover */}
          <div style={{
            width: '88px', height: '88px', borderRadius: '50%',
            background: bg, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontSize: '28px', fontWeight: 700,
            border: '4px solid white', marginTop: '-44px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)', overflow: 'hidden',
          }}>
            {profile.profileImage
              ? <img src={profile.profileImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={e => e.target.style.display = 'none'} />
              : getInitials(profile.name)
            }
          </div>

          <div style={{ flex: 1, paddingTop: '14px' }}>
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '24px', fontWeight: 900, color: 'var(--ink)',
              marginBottom: '4px',
            }}>
              {profile.name}
            </h1>

            {profile.bio && (
              <p style={{ fontSize: '14px', color: 'var(--ink-muted)', lineHeight: 1.6, maxWidth: '500px' }}>
                {profile.bio}
              </p>
            )}
          </div>

          {/* Stats chips */}
          <div style={{ display: 'flex', gap: '12px', paddingTop: '14px', flexShrink: 0 }}>
            <div style={{
              textAlign: 'center', padding: '10px 20px',
              background: 'var(--accent-light)', borderRadius: '12px',
            }}>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', fontWeight: 900, color: 'var(--accent)', lineHeight: 1 }}>{blogs.length}</p>
              <p style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: 600, marginTop: '3px' }}>Stories</p>
            </div>
            <div style={{
              textAlign: 'center', padding: '10px 20px',
              background: '#fff0f0', borderRadius: '12px',
            }}>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', fontWeight: 900, color: 'var(--coral)', lineHeight: 1 }}>
                {blogs.reduce((s, b) => s + (b.likes?.length || 0), 0)}
              </p>
              <p style={{ fontSize: '11px', color: 'var(--coral)', fontWeight: 600, marginTop: '3px' }}>Likes</p>
            </div>
            <div style={{
              textAlign: 'center', padding: '10px 20px',
              background: 'var(--teal-light)', borderRadius: '12px',
            }}>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', fontWeight: 900, color: 'var(--teal)', lineHeight: 1 }}>
                {blogs.reduce((s, b) => s + (b.views || 0), 0)}
              </p>
              <p style={{ fontSize: '11px', color: 'var(--teal)', fontWeight: 600, marginTop: '3px' }}>Views</p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '28px', alignItems: 'flex-start' }}>

        {/* ── Sidebar ── */}
        <div style={{ width: '240px', flexShrink: 0 }}>

          {/* Social links */}
          {hasSocial && (
            <div style={{
              background: 'white', borderRadius: '16px', padding: '20px',
              border: '1.5px solid var(--border)', boxShadow: 'var(--shadow-sm)',
              marginBottom: '18px', position: 'sticky', top: '88px',
            }}>
              <h3 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '14px', fontWeight: 700, color: 'var(--ink)',
                marginBottom: '14px', paddingBottom: '12px',
                borderBottom: '1.5px solid var(--border)',
              }}>
                Connect
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {['twitter', 'instagram', 'linkedin'].map(key => {
                  const url = profile.socialLinks?.[key]
                  if (!url) return null
                  const meta = socialMeta[key]
                  return (
                    <a key={key} href={url} target="_blank" rel="noreferrer" style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '9px 14px', borderRadius: '10px',
                      background: meta.bg, textDecoration: 'none',
                      transition: 'opacity 0.15s',
                    }}
                      onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
                      onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                      <img src={meta.icon} alt="" width="15" />
                      <span style={{ fontSize: '13px', fontWeight: 600, color: meta.color }}>
                        {meta.label}
                      </span>
                      <img src="https://cdn-icons-png.flaticon.com/12/130/130882.png" alt="" width="9"
                        style={{ marginLeft: 'auto', opacity: 0.4 }} />
                    </a>
                  )
                })}
              </div>
            </div>
          )}

          {/* Category breakdown */}
          {blogs.length > 0 && (
            <div style={{
              background: 'white', borderRadius: '16px', padding: '20px',
              border: '1.5px solid var(--border)', boxShadow: 'var(--shadow-sm)',
              position: 'sticky', top: hasSocial ? '280px' : '88px',
            }}>
              <h3 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '14px', fontWeight: 700, color: 'var(--ink)',
                marginBottom: '14px', paddingBottom: '12px',
                borderBottom: '1.5px solid var(--border)',
              }}>
                Writes About
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {[...new Set(blogs.map(b => b.category))].map(cat => {
                  const color = catColors[cat] || '#7a7a8a'
                  return (
                    <span key={cat} style={{
                      padding: '4px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 600,
                      background: color + '18', color,
                    }}>{cat}</span>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* ── Blog list ── */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '20px', fontWeight: 700, color: 'var(--ink)',
            }}>
              Stories by {profile.name?.split(' ')[0]}
            </h2>
            <span style={{
              background: 'var(--accent-light)', color: 'var(--accent)',
              borderRadius: '999px', padding: '2px 10px',
              fontSize: '12px', fontWeight: 700,
            }}>{blogs.length}</span>
          </div>

          {blogs.length === 0 && (
            <div style={{
              textAlign: 'center', padding: '60px 20px',
              background: 'white', borderRadius: '16px',
              border: '1.5px dashed var(--border)',
            }}>
              <img src="https://cdn-icons-png.flaticon.com/64/4076/4076432.png" alt=""
                width="48" style={{ opacity: 0.25, marginBottom: '12px' }} />
              <p style={{ color: 'var(--ink-muted)', fontSize: '15px', fontWeight: 500 }}>
                No stories published yet
              </p>
            </div>
          )}

          {blogs.map(blog => {
            const color = catColors[blog.category] || '#7a7a8a'
            return (
              <div key={blog._id}
                onClick={() => navigate('/blog/' + blog._id)}
                style={{
                  background: 'white', borderRadius: '14px', padding: '22px 24px',
                  marginBottom: '16px', border: '1.5px solid var(--border)',
                  boxShadow: 'var(--shadow-sm)', cursor: 'pointer',
                  transition: 'box-shadow 0.2s, transform 0.2s',
                  position: 'relative', overflow: 'hidden',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}>
                {/* left accent bar */}
                <div style={{
                  position: 'absolute', left: 0, top: 0, bottom: 0,
                  width: '3px', background: color,
                }} />

                <div style={{ display: 'flex', gap: '18px', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>

                    {/* Meta row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span style={{
                        padding: '2px 10px', borderRadius: '999px', fontSize: '11px',
                        fontWeight: 700, background: color + '18', color,
                      }}>{blog.category}</span>
                      <span style={{ fontSize: '11px', color: 'var(--ink-muted)' }}>
                        {new Date(blog.createdAt).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric'
                        })}
                      </span>
                    </div>

                    <h3 style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: '17px', fontWeight: 700, color: 'var(--ink)',
                      lineHeight: 1.4, marginBottom: '7px',
                    }}>
                      {blog.title}
                    </h3>

                    <p style={{
                      fontSize: '13px', color: 'var(--ink-muted)',
                      lineHeight: 1.65, marginBottom: '12px',
                    }}>
                      {getPreview(blog.content)}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--ink-muted)' }}>
                        <img src="https://cdn-icons-png.flaticon.com/16/2589/2589175.png" alt="" width="12" style={{ opacity: 0.45 }} />
                        {blog.likes?.length || 0}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--ink-muted)' }}>
                        <img src="https://cdn-icons-png.flaticon.com/16/709/709612.png" alt="" width="12" style={{ opacity: 0.45 }} />
                        {blog.views || 0}
                      </span>
                      <span style={{
                        marginLeft: 'auto', fontSize: '12px', color: 'var(--accent)',
                        fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px',
                      }}>
                        Read more
                        <img src="https://cdn-icons-png.flaticon.com/12/130/130882.png" alt="" width="9" style={{ opacity: 0.7 }} />
                      </span>
                    </div>
                  </div>

                  {blog.thumbnail && (
                    <img src={blog.thumbnail} alt=""
                      style={{
                        width: '100px', height: '72px', objectFit: 'cover',
                        borderRadius: '10px', flexShrink: 0,
                        border: '1.5px solid var(--border)',
                      }}
                      onError={e => e.target.style.display = 'none'}
                    />
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Profile