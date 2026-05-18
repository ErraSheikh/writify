import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api/axios'

const categories = [
  'General', 'Technology', 'Health', 'Travel',
  'Food', 'Lifestyle', 'Business', 'Education', 'Sports', 'Entertainment'
]

/* Category colour map — indigo accent for selected, subtle tints per category */
const catColors = {
  Technology: '#5b4de8', Health: '#00b4a6', Travel: '#f5a623',
  Food: '#ff5c57',       Lifestyle: '#a259ff', Business: '#0ea5e9',
  Education: '#16a34a',  Sports: '#f97316',   Entertainment: '#ec4899',
  General: '#7a7a8a'
}

const Home = () => {
  const navigate = useNavigate()

  const [blogs, setBlogs] = useState([])
  const [recentBlogs, setRecentBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  useEffect(() => {
    loadBlogs()
    loadRecentBlogs()
  }, [])

  const loadBlogs = () => {
    API.get('/blogs').then((res) => {
      setBlogs(res.data.blogs)
      setLoading(false)
    }).catch(() => setLoading(false))
  }

  const loadRecentBlogs = () => {
    API.get('/blogs/recent').then((res) => setRecentBlogs(res.data.blogs))
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (!search.trim()) return
    API.get('/blogs/search?keyword=' + search).then((res) => {
      setBlogs(res.data.blogs)
      setSelectedCategory('')
    })
  }

  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat)
    API.get('/blogs/category/' + cat).then((res) => setBlogs(res.data.blogs))
  }

  const handleClearFilter = () => {
    setSelectedCategory('')
    setSearch('')
    loadBlogs()
  }

  const getPreview = (content) => {
    const stripped = content.replace(/<[^>]+>/g, '')
    return stripped.length > 130 ? stripped.substring(0, 130) + '…' : stripped
  }

  const getInitials = (name = '') =>
    name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

  const avatarBg = (name = '') => {
    const colors = ['#5b4de8', '#ff5c57', '#00b4a6', '#f5a623', '#a259ff', '#0ea5e9']
    return colors[name.charCodeAt(0) % colors.length]
  }

  if (loading) {
    return (
      <div className="loading-state">
        <div style={{ marginBottom: 12 }}>
          <span className="loading-dot" />
          <span className="loading-dot" />
          <span className="loading-dot" />
        </div>
        <p>Loading stories…</p>
      </div>
    )
  }

  return (
    <div className="page">

      {/* ── Hero Banner ── */}
      <div style={{
        background: 'linear-gradient(135deg, #5b4de8 0%, #8b7cf8 50%, #c084fc 100%)',
        borderRadius: '20px',
        padding: '52px 48px',
        marginBottom: '36px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* decorative blobs */}
        <div style={{
          position: 'absolute', right: '-60px', top: '-60px',
          width: '260px', height: '260px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.08)', pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', right: '80px', bottom: '-80px',
          width: '180px', height: '180px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)', pointerEvents: 'none'
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '580px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: 'rgba(255,255,255,0.18)', borderRadius: '999px',
            padding: '4px 14px', marginBottom: '18px',
            fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.9)',
            letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>
            <img src="https://cdn-icons-png.flaticon.com/16/3176/3176298.png"
              alt="" width="12" style={{ opacity: 0.85 }} />
            Community Blog
          </div>

          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '42px', fontWeight: 900, color: 'white',
            lineHeight: 1.15, marginBottom: '12px',
          }}>
            Where Great<br />Ideas Come Alive
          </h1>

          <p style={{
            color: 'rgba(255,255,255,0.75)', fontSize: '15px',
            marginBottom: '28px', fontWeight: 400,
          }}>
            Discover stories, thinking, and expertise from voices that matter.
          </p>

          <form onSubmit={handleSearch} style={{
            display: 'flex', gap: '8px',
            background: 'white', borderRadius: '999px',
            padding: '6px 6px 6px 20px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.18)',
            maxWidth: '460px',
          }}>
            <img src="https://cdn-icons-png.flaticon.com/16/54/54481.png"
              alt="" width="15" style={{ opacity: 0.4, flexShrink: 0, alignSelf: 'center' }} />
            <input
              type="text"
              placeholder="Search stories, topics, tags…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                flex: 1, border: 'none', outline: 'none',
                fontSize: '14px', background: 'transparent',
                color: '#0f0f0f', fontFamily: "'DM Sans', sans-serif",
              }}
            />
            <button type="submit" className="btn btn-primary"
              style={{ padding: '9px 22px', fontSize: '13px' }}>
              Search
            </button>
          </form>
        </div>
      </div>

      {/* ── Body: Main + Sidebar ── */}
      <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>

        {/* ── MAIN ── */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Category chips */}
          <div style={{
            display: 'flex', gap: '7px', flexWrap: 'wrap',
            alignItems: 'center', marginBottom: '24px',
          }}>
            <span style={{
              fontSize: '11px', fontWeight: 700, color: 'var(--ink-muted)',
              letterSpacing: '0.08em', textTransform: 'uppercase', marginRight: '4px'
            }}>Topics</span>

            {categories.map((cat) => {
              const active = selectedCategory === cat
              const color = catColors[cat] || '#7a7a8a'
              return (
                <button key={cat} onClick={() => handleCategoryClick(cat)} style={{
                  padding: '5px 15px', borderRadius: '999px', cursor: 'pointer',
                  fontSize: '12px', fontWeight: 600, transition: 'all 0.18s',
                  border: `1.5px solid ${active ? color : 'var(--border)'}`,
                  background: active ? color : 'white',
                  color: active ? 'white' : 'var(--ink-muted)',
                  boxShadow: active ? `0 3px 12px ${color}40` : 'none',
                }}>
                  {cat}
                </button>
              )
            })}

            {(selectedCategory || search) && (
              <button onClick={handleClearFilter} style={{
                padding: '5px 14px', borderRadius: '999px',
                border: '1.5px solid var(--coral)', background: 'white',
                color: 'var(--coral)', cursor: 'pointer', fontSize: '12px', fontWeight: 600,
              }}>
                ✕ Clear
              </button>
            )}
          </div>

          {/* Section label */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            marginBottom: '18px',
          }}>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '20px', fontWeight: 700, color: 'var(--ink)'
            }}>
              {selectedCategory ? `${selectedCategory} Stories` : 'All Stories'}
            </h2>
            <span style={{
              background: 'var(--accent-light)', color: 'var(--accent)',
              borderRadius: '999px', padding: '2px 10px',
              fontSize: '12px', fontWeight: 700,
            }}>{blogs.length}</span>
          </div>

          {/* Empty state */}
          {blogs.length === 0 && (
            <div style={{
              textAlign: 'center', padding: '60px 20px',
              background: 'white', borderRadius: '16px',
              border: '1.5px dashed var(--border)',
            }}>
              <img src="https://cdn-icons-png.flaticon.com/64/4076/4076432.png"
                alt="" width="52" style={{ opacity: 0.35, marginBottom: '12px' }} />
              <p style={{ color: 'var(--ink-muted)', fontSize: '15px', fontWeight: 500 }}>
                No stories found
              </p>
            </div>
          )}

          {/* Blog Cards */}
          {blogs.map((blog) => (
            <div key={blog._id} className="blog-card"
              onClick={() => navigate('/blog/' + blog._id)}>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>

                  {/* Author row */}
                  <div style={{
                    display: 'flex', alignItems: 'center',
                    gap: '9px', marginBottom: '12px',
                  }}>
                    <div style={{
                      width: '34px', height: '34px', borderRadius: '50%',
                      background: avatarBg(blog.author?.name),
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white', fontSize: '12px', fontWeight: 700,
                      flexShrink: 0, overflow: 'hidden',
                    }}>
                      {blog.author?.profileImage
                        ? <img src={blog.author.profileImage} alt=""
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => e.target.style.display = 'none'} />
                        : getInitials(blog.author?.name)
                      }
                    </div>
                    <div style={{ lineHeight: 1.3 }}>
                      <span style={{
                        fontSize: '13px', fontWeight: 600, color: 'var(--ink-soft)',
                        display: 'block',
                      }}>
                        {blog.author?.name}
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--ink-muted)' }}>
                        {new Date(blog.createdAt).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric'
                        })}
                      </span>
                    </div>

                    {/* Category chip inline */}
                    <span style={{
                      marginLeft: 'auto', padding: '3px 12px', borderRadius: '999px',
                      fontSize: '11px', fontWeight: 700,
                      background: (catColors[blog.category] || '#7a7a8a') + '18',
                      color: catColors[blog.category] || '#7a7a8a',
                    }}>
                      {blog.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '18px', fontWeight: 700, color: 'var(--ink)',
                    lineHeight: 1.4, marginBottom: '8px',
                  }}>
                    {blog.title}
                  </h2>

                  {/* Preview */}
                  <p style={{
                    color: 'var(--ink-muted)', fontSize: '13.5px',
                    lineHeight: 1.65, marginBottom: '14px',
                  }}>
                    {getPreview(blog.content)}
                  </p>

                  {/* Footer row */}
                  <div style={{
                    display: 'flex', alignItems: 'center',
                    gap: '8px', flexWrap: 'wrap',
                  }}>
                    {blog.tags?.slice(0, 3).map((tag, i) => (
                      <span key={i} className="badge">#{tag}</span>
                    ))}

                    <div style={{
                      marginLeft: 'auto', display: 'flex', alignItems: 'center',
                      gap: '14px',
                    }}>
                      <span style={{
                        display: 'flex', alignItems: 'center', gap: '4px',
                        fontSize: '12px', color: 'var(--ink-muted)', fontWeight: 500,
                      }}>
                        <img src="https://cdn-icons-png.flaticon.com/16/2589/2589175.png"
                          alt="" width="13" style={{ opacity: 0.5 }} />
                        {blog.likes?.length || 0}
                      </span>
                      <span style={{
                        display: 'flex', alignItems: 'center', gap: '4px',
                        fontSize: '12px', color: 'var(--ink-muted)', fontWeight: 500,
                      }}>
                        <img src="https://cdn-icons-png.flaticon.com/16/709/709612.png"
                          alt="" width="13" style={{ opacity: 0.5 }} />
                        {blog.views || 0}
                      </span>
                      <span style={{
                        fontSize: '12px', color: 'var(--accent)',
                        fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px',
                      }}>
                        Read more
                        <img src="https://cdn-icons-png.flaticon.com/16/130/130882.png"
                          alt="" width="10" style={{ opacity: 0.7 }} />
                      </span>
                    </div>
                  </div>
                </div>

                {/* Thumbnail */}
                {blog.thumbnail && (
                  <img src={blog.thumbnail} alt={blog.title}
                    style={{
                      width: '120px', height: '84px',
                      objectFit: 'cover', borderRadius: '10px',
                      flexShrink: 0, border: '1.5px solid var(--border)',
                    }}
                    onError={(e) => e.target.style.display = 'none'}
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ── SIDEBAR ── */}
        <div style={{ width: '272px', flexShrink: 0 }}>

          {/* Recently Published */}
          <div style={{
            background: 'white', borderRadius: '16px',
            padding: '22px', border: '1.5px solid var(--border)',
            marginBottom: '20px', position: 'sticky', top: '88px',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              marginBottom: '18px', paddingBottom: '14px',
              borderBottom: '1.5px solid var(--border)',
            }}>
              <img src="https://cdn-icons-png.flaticon.com/20/2950/2950657.png"
                alt="" width="16" style={{ opacity: 0.7 }} />
              <h3 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '15px', fontWeight: 700, color: 'var(--ink)',
              }}>
                Recently Published
              </h3>
            </div>

            {recentBlogs.length === 0 && (
              <p style={{ fontSize: '13px', color: 'var(--ink-muted)' }}>No blogs yet</p>
            )}

            {recentBlogs.map((blog, idx) => (
              <div key={blog._id}
                onClick={() => navigate('/blog/' + blog._id)}
                style={{
                  display: 'flex', gap: '12px', alignItems: 'flex-start',
                  marginBottom: '14px', paddingBottom: '14px',
                  borderBottom: idx < recentBlogs.length - 1 ? '1px solid var(--border)' : 'none',
                  cursor: 'pointer',
                }}>
                {/* Number */}
                <span style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '22px', fontWeight: 900, color: 'var(--border)',
                  lineHeight: 1, flexShrink: 0, minWidth: '24px',
                }}>
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <div>
                  <p style={{
                    fontSize: '13px', fontWeight: 600, color: 'var(--ink)',
                    lineHeight: 1.4, marginBottom: '4px',
                    display: '-webkit-box', WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  }}>
                    {blog.title}
                  </p>
                  <p style={{ fontSize: '11px', color: 'var(--ink-muted)' }}>
                    {blog.author?.name} · {new Date(blog.createdAt).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Topics quick-pick */}
          <div style={{
            background: 'white', borderRadius: '16px',
            padding: '22px', border: '1.5px solid var(--border)',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              marginBottom: '16px', paddingBottom: '14px',
              borderBottom: '1.5px solid var(--border)',
            }}>
              <img src="https://cdn-icons-png.flaticon.com/20/1055/1055644.png"
                alt="" width="15" style={{ opacity: 0.7 }} />
              <h3 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '15px', fontWeight: 700, color: 'var(--ink)',
              }}>
                Browse Topics
              </h3>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {categories.map((cat) => {
                const color = catColors[cat] || '#7a7a8a'
                return (
                  <button key={cat} onClick={() => handleCategoryClick(cat)} style={{
                    padding: '5px 13px', borderRadius: '999px', cursor: 'pointer',
                    fontSize: '12px', fontWeight: 600,
                    background: color + '15',
                    color: color,
                    border: `1.5px solid ${color}30`,
                    transition: 'all 0.15s',
                  }}
                    onMouseEnter={e => {
                      e.target.style.background = color
                      e.target.style.color = 'white'
                    }}
                    onMouseLeave={e => {
                      e.target.style.background = color + '15'
                      e.target.style.color = color
                    }}>
                    {cat}
                  </button>
                )
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Home