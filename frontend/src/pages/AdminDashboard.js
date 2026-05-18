import { useState, useEffect } from 'react'
import API from '../api/axios'

const catColors = {
  Technology: '#5b4de8', Health: '#00b4a6', Travel: '#f5a623',
  Food: '#ff5c57', Lifestyle: '#a259ff', Business: '#0ea5e9',
  Education: '#16a34a', Sports: '#f97316', Entertainment: '#ec4899',
  General: '#7a7a8a'
}

const avatarBg = (name = '') => {
  const colors = ['#5b4de8', '#ff5c57', '#00b4a6', '#f5a623', '#a259ff', '#0ea5e9']
  return colors[(name.charCodeAt(0) || 0) % colors.length]
}

const getInitials = (name = '') =>
  name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

const TABS = [
  { key: 'stats',    label: 'Statistics', icon: 'https://cdn-icons-png.flaticon.com/20/1828/1828919.png' },
  { key: 'users',    label: 'Users',      icon: 'https://cdn-icons-png.flaticon.com/20/1077/1077012.png' },
  { key: 'blogs',    label: 'Blogs',      icon: 'https://cdn-icons-png.flaticon.com/20/1584/1584942.png' },
  { key: 'comments', label: 'Comments',   icon: 'https://cdn-icons-png.flaticon.com/20/1380/1380338.png' },
]

/* ── Stat card ── */
const StatCard = ({ label, value, color, icon, sub }) => (
  <div style={{
    background: 'white', borderRadius: '18px', padding: '26px 24px',
    border: '1.5px solid var(--border)', boxShadow: 'var(--shadow-sm)',
    position: 'relative', overflow: 'hidden',
  }}>
    <div style={{
      position: 'absolute', top: '-20px', right: '-20px',
      width: '90px', height: '90px', borderRadius: '50%',
      background: color + '10', pointerEvents: 'none',
    }} />
    <div style={{
      width: '40px', height: '40px', borderRadius: '12px',
      background: color + '18', display: 'flex', alignItems: 'center',
      justifyContent: 'center', marginBottom: '14px',
    }}>
      <img src={icon} alt="" width="20" style={{ opacity: 0.85 }} />
    </div>
    <p style={{
      fontSize: '11px', fontWeight: 700, color: 'var(--ink-muted)',
      letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '6px',
    }}>{label}</p>
    <p style={{
      fontFamily: "'Playfair Display', serif",
      fontSize: '38px', fontWeight: 900, color, lineHeight: 1,
    }}>{value}</p>
    {sub && <p style={{ fontSize: '12px', color: 'var(--ink-muted)', marginTop: '6px' }}>{sub}</p>}
  </div>
)

/* ── Delete button ── */
const DeleteBtn = ({ onClick }) => (
  <button onClick={onClick} style={{
    display: 'flex', alignItems: 'center', gap: '5px',
    padding: '6px 14px', borderRadius: '999px', cursor: 'pointer',
    fontSize: '12px', fontWeight: 600, flexShrink: 0,
    border: '1.5px solid rgba(255,92,87,0.35)',
    background: 'rgba(255,92,87,0.08)', color: 'var(--coral)',
    transition: 'all 0.15s',
  }}
    onMouseEnter={e => {
      e.currentTarget.style.background = 'var(--coral)'
      e.currentTarget.style.color = 'white'
    }}
    onMouseLeave={e => {
      e.currentTarget.style.background = 'rgba(255,92,87,0.08)'
      e.currentTarget.style.color = 'var(--coral)'
    }}>
    <img src="https://cdn-icons-png.flaticon.com/12/1828/1828843.png" alt="" width="10"
      style={{ filter: 'none', opacity: 0.8 }} />
    Delete
  </button>
)

/* ── Row wrapper ── */
const Row = ({ children }) => (
  <div style={{
    background: 'white', borderRadius: '14px', padding: '16px 20px',
    marginBottom: '10px', border: '1.5px solid var(--border)',
    boxShadow: 'var(--shadow-sm)', display: 'flex',
    justifyContent: 'space-between', alignItems: 'center',
    flexWrap: 'wrap', gap: '12px',
    transition: 'box-shadow 0.2s',
  }}
    onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
    onMouseLeave={e => e.currentTarget.style.boxShadow = 'var(--shadow-sm)'}>
    {children}
  </div>
)

/* ── Section header ── */
const SectionHeader = ({ count, label }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
    <h2 style={{
      fontFamily: "'Playfair Display', serif",
      fontSize: '20px', fontWeight: 700, color: 'var(--ink)',
    }}>{label}</h2>
    <span style={{
      background: 'var(--accent-light)', color: 'var(--accent)',
      borderRadius: '999px', padding: '2px 10px',
      fontSize: '12px', fontWeight: 700,
    }}>{count}</span>
  </div>
)

/* ─────────────────────────────────────── */

const AdminDashboard = () => {
  const [users, setUsers]       = useState([])
  const [blogs, setBlogs]       = useState([])
  const [comments, setComments] = useState([])
  const [loading, setLoading]   = useState(true)
  const [activeTab, setActiveTab] = useState('stats')

  useEffect(() => { loadAll() }, [])

  const loadAll = () => {
    API.get('/auth/users').then(res => setUsers(res.data.users))
    API.get('/blogs').then(res => setBlogs(res.data.blogs))
    API.get('/comments/all').then(res => {
      setComments(res.data.comments)
      setLoading(false)
    }).catch(() => setLoading(false))
  }

  const handleDeleteUser = (id) => {
    if (!window.confirm('Delete this user?')) return
    API.delete('/auth/users/' + id).then(() => setUsers(users.filter(u => u._id !== id)))
  }

  const handleDeleteBlog = (id) => {
    if (!window.confirm('Delete this blog?')) return
    API.delete('/blogs/' + id).then(() => setBlogs(blogs.filter(b => b._id !== id)))
  }

  const handleDeleteComment = (id) => {
    if (!window.confirm('Delete this comment?')) return
    API.delete('/comments/' + id).then(() => setComments(comments.filter(c => c._id !== id)))
  }

  const totalLikes  = blogs.reduce((s, b) => s + (b.likes?.length || 0), 0)
  const totalViews  = blogs.reduce((s, b) => s + (b.views || 0), 0)

  if (loading) return (
    <div className="loading-state">
      <div style={{ marginBottom: 12 }}>
        <span className="loading-dot" /><span className="loading-dot" /><span className="loading-dot" />
      </div>
      <p>Loading admin data…</p>
    </div>
  )

  return (
    <div className="page">

      {/* ── Page header ── */}
      <div style={{
        background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1040 100%)',
        borderRadius: '20px', padding: '32px 36px',
        marginBottom: '30px', position: 'relative', overflow: 'hidden',
        display: 'flex', alignItems: 'center', gap: '18px',
      }}>
        <div style={{
          position: 'absolute', right: '-30px', top: '-30px',
          width: '180px', height: '180px', borderRadius: '50%',
          background: 'rgba(245,166,35,0.12)', pointerEvents: 'none',
        }} />
        <div style={{
          width: '48px', height: '48px', borderRadius: '14px',
          background: 'rgba(245,166,35,0.2)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <img src="https://cdn-icons-png.flaticon.com/24/2099/2099058.png" alt="" width="24"
            style={{ filter: 'sepia(1) saturate(5) hue-rotate(10deg)', opacity: 0.9 }} />
        </div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ fontSize: '11px', color: 'rgba(245,166,35,0.7)', fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>
            Control Panel
          </p>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '26px', fontWeight: 900, color: 'white', lineHeight: 1.2,
          }}>
            Admin Dashboard
          </h1>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={{
        display: 'flex', gap: '6px', marginBottom: '28px',
        background: 'white', padding: '6px', borderRadius: '14px',
        border: '1.5px solid var(--border)', width: 'fit-content',
      }}>
        {TABS.map(tab => {
          const active = activeTab === tab.key
          return (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
              display: 'flex', alignItems: 'center', gap: '7px',
              padding: '9px 20px', borderRadius: '10px', cursor: 'pointer',
              fontSize: '13px', fontWeight: 600, border: 'none',
              background: active ? '#f5a623' : 'transparent',
              color: active ? 'white' : 'var(--ink-muted)',
              boxShadow: active ? '0 3px 12px rgba(245,166,35,0.35)' : 'none',
              transition: 'all 0.18s',
            }}>
              <img src={tab.icon} alt="" width="14"
                style={{ opacity: active ? 1 : 0.45, filter: active ? 'brightness(10)' : 'none' }} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* ── Statistics ── */}
      {activeTab === 'stats' && (
        <div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '18px', marginBottom: '32px',
          }}>
            <StatCard label="Total Users"    value={users.length}    color="#5b4de8" icon="https://cdn-icons-png.flaticon.com/20/1077/1077012.png"  sub={`${users.filter(u => u.role === 'admin').length} admin(s)`} />
            <StatCard label="Total Blogs"    value={blogs.length}    color="#00b4a6" icon="https://cdn-icons-png.flaticon.com/20/1584/1584942.png"  sub="across all categories" />
            <StatCard label="Total Comments" value={comments.length} color="#f5a623" icon="https://cdn-icons-png.flaticon.com/20/1380/1380338.png"  sub="community interactions" />
            <StatCard label="Total Likes"    value={totalLikes}      color="#ff5c57" icon="https://cdn-icons-png.flaticon.com/20/2589/2589175.png"  sub={`${totalViews} total views`} />
          </div>

          {/* Category breakdown */}
          <div style={{
            background: 'white', borderRadius: '16px', padding: '24px',
            border: '1.5px solid var(--border)', boxShadow: 'var(--shadow-sm)',
          }}>
            <h3 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '16px', fontWeight: 700, color: 'var(--ink)',
              marginBottom: '18px', paddingBottom: '14px',
              borderBottom: '1.5px solid var(--border)',
            }}>
              Blogs by Category
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {Object.entries(
                blogs.reduce((acc, b) => {
                  acc[b.category] = (acc[b.category] || 0) + 1
                  return acc
                }, {})
              ).sort((a, b) => b[1] - a[1]).map(([cat, count]) => {
                const color = catColors[cat] || '#7a7a8a'
                const pct = Math.round((count / blogs.length) * 100)
                return (
                  <div key={cat}>
                    <div style={{
                      display: 'flex', justifyContent: 'space-between',
                      marginBottom: '5px', alignItems: 'center',
                    }}>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink-soft)' }}>{cat}</span>
                      <span style={{ fontSize: '12px', color: 'var(--ink-muted)', fontWeight: 500 }}>
                        {count} blog{count !== 1 ? 's' : ''} · {pct}%
                      </span>
                    </div>
                    <div style={{ height: '6px', background: 'var(--surface-2)', borderRadius: '999px', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', width: pct + '%',
                        background: color, borderRadius: '999px',
                        transition: 'width 0.6s ease',
                      }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Users ── */}
      {activeTab === 'users' && (
        <div>
          <SectionHeader count={users.length} label="Registered Users" />
          {users.map(u => (
            <Row key={u._id}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '50%',
                  background: avatarBg(u.name),
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontSize: '14px', fontWeight: 700,
                  overflow: 'hidden', flexShrink: 0,
                }}>
                  {u.profileImage
                    ? <img src={u.profileImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={e => e.target.style.display = 'none'} />
                    : getInitials(u.name)
                  }
                </div>
                <div>
                  <p style={{ fontWeight: 600, color: 'var(--ink)', marginBottom: '2px', fontSize: '14px' }}>{u.name}</p>
                  <p style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>{u.email}</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{
                  padding: '3px 12px', borderRadius: '999px', fontSize: '11px', fontWeight: 700,
                  background: u.role === 'admin' ? 'rgba(245,166,35,0.15)' : 'var(--surface-2)',
                  color: u.role === 'admin' ? '#f5a623' : 'var(--ink-muted)',
                  border: u.role === 'admin' ? '1px solid rgba(245,166,35,0.3)' : '1px solid var(--border)',
                }}>
                  {u.role}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>
                  Joined {new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                {u.role !== 'admin' && <DeleteBtn onClick={() => handleDeleteUser(u._id)} />}
              </div>
            </Row>
          ))}
        </div>
      )}

      {/* ── Blogs ── */}
      {activeTab === 'blogs' && (
        <div>
          <SectionHeader count={blogs.length} label="All Blogs" />
          {blogs.map(blog => {
            const color = catColors[blog.category] || '#7a7a8a'
            return (
              <Row key={blog._id}>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flex: 1, minWidth: 0 }}>
                  {blog.thumbnail && (
                    <img src={blog.thumbnail} alt=""
                      style={{
                        width: '62px', height: '46px', objectFit: 'cover',
                        borderRadius: '8px', flexShrink: 0,
                        border: '1.5px solid var(--border)',
                      }}
                      onError={e => e.target.style.display = 'none'}
                    />
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontFamily: "'Playfair Display', serif",
                      fontWeight: 700, color: 'var(--ink)', marginBottom: '4px',
                      fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>{blog.title}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>
                        By {blog.author?.name}
                      </span>
                      <span style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>
                        {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '12px', color: 'var(--ink-muted)' }}>
                        <img src="https://cdn-icons-png.flaticon.com/12/2589/2589175.png" alt="" width="11" style={{ opacity: 0.4 }} />
                        {blog.likes?.length || 0}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '12px', color: 'var(--ink-muted)' }}>
                        <img src="https://cdn-icons-png.flaticon.com/12/709/709612.png" alt="" width="11" style={{ opacity: 0.4 }} />
                        {blog.views || 0}
                      </span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                  <span style={{
                    padding: '3px 11px', borderRadius: '999px', fontSize: '11px', fontWeight: 700,
                    background: color + '18', color,
                  }}>{blog.category}</span>
                  <DeleteBtn onClick={() => handleDeleteBlog(blog._id)} />
                </div>
              </Row>
            )
          })}
        </div>
      )}

      {/* ── Comments ── */}
      {activeTab === 'comments' && (
        <div>
          <SectionHeader count={comments.length} label="All Comments" />
          {comments.map(comment => (
            <Row key={comment._id}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '50%',
                    background: avatarBg(comment.author?.name || '?'),
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontSize: '11px', fontWeight: 700, flexShrink: 0,
                  }}>
                    {getInitials(comment.author?.name || '?')}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink-soft)' }}>
                        {comment.author?.name}
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--ink-muted)' }}>
                        {new Date(comment.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <p style={{
                      fontSize: '13.5px', color: 'var(--ink-soft)', lineHeight: 1.55,
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>
                      {comment.text}
                    </p>
                  </div>
                </div>
              </div>
              <DeleteBtn onClick={() => handleDeleteComment(comment._id)} />
            </Row>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminDashboard