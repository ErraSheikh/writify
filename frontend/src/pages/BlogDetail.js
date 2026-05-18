import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import API from '../api/axios'
import { useAuth } from '../context/AuthContext'

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

const BlogDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [blog, setBlog] = useState(null)
  const [comments, setComments] = useState([])
  const [relatedBlogs, setRelatedBlogs] = useState([])
  const [commentText, setCommentText] = useState('')
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [commentLoading, setCommentLoading] = useState(false)
  const [commentFocused, setCommentFocused] = useState(false)

  useEffect(() => {
    loadBlog()
    loadComments()
    loadRelated()
  }, [id])

  const loadBlog = () => {
    API.get('/blogs/' + id).then((res) => {
      setBlog(res.data.blog)
      setLikeCount(res.data.blog.likes?.length || 0)
      if (user) setLiked(res.data.blog.likes?.includes(user.id))
      setLoading(false)
    }).catch(() => setLoading(false))
  }

  const loadComments = () => {
    API.get('/comments/' + id).then((res) => setComments(res.data.comments))
  }

  const loadRelated = () => {
    API.get('/blogs/' + id + '/related').then((res) => setRelatedBlogs(res.data.blogs))
  }

  const handleLike = () => {
    if (!user) return navigate('/login')
    API.put('/blogs/' + id + '/like').then((res) => {
      setLiked(!liked)
      setLikeCount(res.data.likes)
    })
  }

  const handleSave = () => {
    if (!user) return navigate('/login')
    API.put('/blogs/' + id + '/save').then(() => setSaved(!saved))
  }

  const handleComment = async (e) => {
    e.preventDefault()
    if (!user) return navigate('/login')
    if (!commentText.trim()) return
    setCommentLoading(true)
    try {
      const res = await API.post('/comments/' + id, { text: commentText })
      setComments([res.data.comment, ...comments])
      setCommentText('')
    } catch {
      alert('Failed to post comment')
    }
    setCommentLoading(false)
  }

  const handleDeleteComment = (commentId) => {
    if (!window.confirm('Delete this comment?')) return
    API.delete('/comments/' + commentId).then(() =>
      setComments(comments.filter(c => c._id !== commentId))
    )
  }

  const handleDeleteBlog = () => {
    if (!window.confirm('Delete this blog?')) return
    API.delete('/blogs/' + id).then(() => navigate('/'))
  }

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '80px', color: 'var(--ink-muted)', fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ marginBottom: 12 }}>
        <span className="loading-dot" /><span className="loading-dot" /><span className="loading-dot" />
      </div>
      <p>Loading story…</p>
    </div>
  )

  if (!blog) return (
    <div style={{ textAlign: 'center', padding: '80px', color: 'var(--ink-muted)' }}>Blog not found</div>
  )

  const accentColor = catColors[blog.category] || '#7a7a8a'

  return (
    <div className="page">
      <div style={{ display: 'flex', gap: '36px', alignItems: 'flex-start' }}>

        {/* ── MAIN ── */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Thumbnail */}
          {blog.thumbnail && (
            <div style={{ borderRadius: '18px', overflow: 'hidden', marginBottom: '32px', border: '1.5px solid var(--border)' }}>
              <img src={blog.thumbnail} alt={blog.title}
                style={{ width: '100%', height: '360px', objectFit: 'cover', display: 'block' }}
                onError={(e) => e.target.style.display = 'none'} />
            </div>
          )}

          {/* Category + tags row */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '18px' }}>
            <span style={{
              padding: '4px 14px', borderRadius: '999px',
              fontSize: '12px', fontWeight: 700,
              background: accentColor + '18', color: accentColor,
              border: `1.5px solid ${accentColor}30`,
            }}>
              {blog.category}
            </span>
            {blog.tags?.map((tag, i) => (
              <span key={i} className="badge">#{tag}</span>
            ))}
          </div>

          {/* Title */}
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '38px', fontWeight: 900,
            color: 'var(--ink)', lineHeight: 1.2,
            marginBottom: '22px',
          }}>
            {blog.title}
          </h1>

          {/* Author row */}
          <div style={{
            display: 'flex', alignItems: 'center',
            gap: '12px', marginBottom: '28px',
            paddingBottom: '24px', borderBottom: '1.5px solid var(--border)',
            flexWrap: 'wrap',
          }}>
            {/* Avatar */}
            <div
              onClick={() => navigate('/profile/' + blog.author?._id)}
              style={{
                width: '46px', height: '46px', borderRadius: '50%',
                background: avatarBg(blog.author?.name),
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontSize: '14px', fontWeight: 700,
                flexShrink: 0, overflow: 'hidden', cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
              }}>
              {blog.author?.profileImage
                ? <img src={blog.author.profileImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => e.target.style.display = 'none'} />
                : getInitials(blog.author?.name)}
            </div>

            <div style={{ lineHeight: 1.35 }}>
              <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ink)', cursor: 'pointer' }}
                onClick={() => navigate('/profile/' + blog.author?._id)}>
                {blog.author?.name}
              </p>
              <p style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>
                {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                {' · '}{blog.views || 0} views
              </p>
            </div>

            {user && (user.id === blog.author?._id?.toString() || user.role === 'admin') && (
              <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
                {user.id === blog.author?._id?.toString() && (
                  <button onClick={() => navigate('/edit/' + blog._id)} style={{
                    padding: '7px 18px', borderRadius: '999px', fontSize: '13px', fontWeight: 600,
                    border: '1.5px solid var(--border)', background: 'white', color: 'var(--ink)',
                    cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                    display: 'flex', alignItems: 'center', gap: '5px',
                  }}>
                    <img src="https://cdn-icons-png.flaticon.com/16/1159/1159633.png" alt="" width="12" style={{ opacity: 0.6 }} />
                    Edit
                  </button>
                )}
                <button onClick={handleDeleteBlog} style={{
                  padding: '7px 18px', borderRadius: '999px', fontSize: '13px', fontWeight: 600,
                  border: '1.5px solid #ff5c57', background: '#fff1f0', color: '#ff5c57',
                  cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                  display: 'flex', alignItems: 'center', gap: '5px',
                }}>
                  <img src="https://cdn-icons-png.flaticon.com/16/3096/3096673.png" alt="" width="12" style={{ opacity: 0.7 }} />
                  Delete
                </button>
              </div>
            )}
          </div>

          {/* Blog Content */}
          <div
            style={{
              fontSize: '17px', lineHeight: '1.9', color: '#2d2d3a',
              marginBottom: '36px',
              fontFamily: "'Playfair Display', serif",
            }}
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* Like + Save */}
          <div style={{
            display: 'flex', gap: '10px',
            padding: '20px 0', borderTop: '1.5px solid var(--border)',
            marginBottom: '40px',
          }}>
            <button onClick={handleLike} style={{
              padding: '10px 22px', borderRadius: '999px', fontSize: '14px', fontWeight: 700,
              border: `1.5px solid ${liked ? '#ff5c57' : 'var(--border)'}`,
              background: liked ? '#fff1f0' : 'white',
              color: liked ? '#ff5c57' : 'var(--ink-muted)',
              cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
              display: 'flex', alignItems: 'center', gap: '7px',
              boxShadow: liked ? '0 2px 12px rgba(255,92,87,0.2)' : 'none',
              transition: 'all 0.18s',
            }}>
              <img
                src={liked
                  ? 'https://cdn-icons-png.flaticon.com/16/2589/2589175.png'
                  : 'https://cdn-icons-png.flaticon.com/16/2589/2589197.png'}
                alt="" width="15"
                style={{ opacity: liked ? 1 : 0.5 }} />
              {liked ? 'Liked' : 'Like'} · {likeCount}
            </button>

            <button onClick={handleSave} style={{
              padding: '10px 22px', borderRadius: '999px', fontSize: '14px', fontWeight: 700,
              border: `1.5px solid ${saved ? '#f5a623' : 'var(--border)'}`,
              background: saved ? '#fffbf0' : 'white',
              color: saved ? '#f5a623' : 'var(--ink-muted)',
              cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
              display: 'flex', alignItems: 'center', gap: '7px',
              boxShadow: saved ? '0 2px 12px rgba(245,166,35,0.2)' : 'none',
              transition: 'all 0.18s',
            }}>
              <img
                src="https://cdn-icons-png.flaticon.com/16/1828/1828884.png"
                alt="" width="14" style={{ opacity: saved ? 1 : 0.45 }} />
              {saved ? 'Saved' : 'Save'}
            </button>
          </div>

          {/* ── Comments ── */}
          <div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              marginBottom: '24px', paddingBottom: '16px',
              borderBottom: '1.5px solid var(--border)',
            }}>
              <img src="https://cdn-icons-png.flaticon.com/20/709/709612.png" alt="" width="16" style={{ opacity: 0.6 }} />
              <h3 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '20px', fontWeight: 700, color: 'var(--ink)',
              }}>
                Comments
              </h3>
              <span style={{
                background: 'var(--accent-light)', color: 'var(--accent)',
                borderRadius: '999px', padding: '2px 10px',
                fontSize: '12px', fontWeight: 700,
              }}>{comments.length}</span>
            </div>

            {user ? (
              <div style={{ marginBottom: '28px' }}>
                <textarea
                  placeholder="Share your thoughts…"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onFocus={() => setCommentFocused(true)}
                  onBlur={() => setCommentFocused(false)}
                  rows={3}
                  style={{
                    width: '100%', padding: '14px 18px',
                    fontSize: '14px', fontFamily: "'DM Sans', sans-serif",
                    border: commentFocused ? '2px solid #5b4de8' : '2px solid var(--border)',
                    borderRadius: '12px', outline: 'none', resize: 'vertical',
                    background: commentFocused ? '#faf9ff' : 'white',
                    color: 'var(--ink)',
                    boxShadow: commentFocused ? '0 0 0 4px rgba(91,77,232,0.1)' : 'none',
                    transition: 'all 0.18s', boxSizing: 'border-box',
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                  <button onClick={handleComment} disabled={commentLoading} style={{
                    padding: '10px 24px', borderRadius: '999px',
                    background: 'linear-gradient(135deg, #5b4de8, #8b7cf8)',
                    color: 'white', border: 'none', fontSize: '14px', fontWeight: 700,
                    cursor: commentLoading ? 'not-allowed' : 'pointer',
                    fontFamily: "'DM Sans', sans-serif",
                    boxShadow: '0 4px 16px rgba(91,77,232,0.3)',
                    opacity: commentLoading ? 0.7 : 1,
                  }}>
                    {commentLoading ? 'Posting…' : 'Post Comment'}
                  </button>
                </div>
              </div>
            ) : (
              <div style={{
                padding: '16px 20px', borderRadius: '12px',
                background: 'white', border: '1.5px solid var(--border)',
                marginBottom: '24px', fontSize: '14px', color: 'var(--ink-muted)',
              }}>
                <span style={{ color: '#5b4de8', cursor: 'pointer', fontWeight: 700 }}
                  onClick={() => navigate('/login')}>Sign in</span>
                {' '}to leave a comment
              </div>
            )}

            {/* Comment list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {comments.map((comment) => (
                <div key={comment._id} style={{
                  background: 'white', borderRadius: '14px',
                  padding: '18px 20px', border: '1.5px solid var(--border)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '36px', height: '36px', borderRadius: '50%',
                        background: avatarBg(comment.author?.name),
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontSize: '12px', fontWeight: 700,
                        flexShrink: 0, overflow: 'hidden',
                      }}>
                        {comment.author?.profileImage
                          ? <img src={comment.author.profileImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => e.target.style.display = 'none'} />
                          : getInitials(comment.author?.name)}
                      </div>
                      <div style={{ lineHeight: 1.3 }}>
                        <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink)' }}>{comment.author?.name}</p>
                        <p style={{ fontSize: '11px', color: 'var(--ink-muted)' }}>
                          {new Date(comment.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    {user && (user.id === comment.author?._id?.toString() || user.role === 'admin') && (
                      <button onClick={() => handleDeleteComment(comment._id)} style={{
                        background: 'none', border: 'none', color: '#ff5c57',
                        cursor: 'pointer', fontSize: '12px', fontWeight: 600,
                        padding: '4px 8px', borderRadius: '6px',
                        fontFamily: "'DM Sans', sans-serif",
                      }}>Delete</button>
                    )}
                  </div>
                  <p style={{ fontSize: '14px', color: '#3a3a4a', lineHeight: 1.65 }}>{comment.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── SIDEBAR ── */}
        <div style={{ width: '268px', flexShrink: 0 }}>

          {/* Author card */}
          <div style={{
            background: 'white', borderRadius: '18px',
            padding: '24px', border: '1.5px solid var(--border)',
            marginBottom: '20px', position: 'sticky', top: '88px',
            textAlign: 'center',
          }}>
            {/* Avatar */}
            <div
              onClick={() => navigate('/profile/' + blog.author?._id)}
              style={{
                width: '72px', height: '72px', borderRadius: '50%',
                background: avatarBg(blog.author?.name),
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontSize: '24px', fontWeight: 800,
                margin: '0 auto 14px', overflow: 'hidden', cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
              }}>
              {blog.author?.profileImage
                ? <img src={blog.author.profileImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => e.target.style.display = 'none'} />
                : getInitials(blog.author?.name)}
            </div>

            <p style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 800, fontSize: '16px', color: 'var(--ink)',
              marginBottom: '6px', cursor: 'pointer',
            }} onClick={() => navigate('/profile/' + blog.author?._id)}>
              {blog.author?.name}
            </p>

            {blog.author?.bio && (
              <p style={{ fontSize: '13px', color: 'var(--ink-muted)', lineHeight: 1.55, marginBottom: '16px' }}>
                {blog.author.bio}
              </p>
            )}

            <button onClick={() => navigate('/profile/' + blog.author?._id)} style={{
              width: '100%', padding: '9px', borderRadius: '999px',
              border: '1.5px solid var(--border)', background: 'white',
              color: 'var(--ink)', fontSize: '13px', fontWeight: 700,
              cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
              transition: 'all 0.15s',
            }}>
              View Profile
            </button>
          </div>

          {/* Related blogs */}
          {relatedBlogs.length > 0 && (
            <div style={{
              background: 'white', borderRadius: '18px',
              padding: '22px', border: '1.5px solid var(--border)',
            }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                marginBottom: '16px', paddingBottom: '14px',
                borderBottom: '1.5px solid var(--border)',
              }}>
                <img src="https://cdn-icons-png.flaticon.com/20/2950/2950657.png" alt="" width="14" style={{ opacity: 0.6 }} />
                <h3 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '15px', fontWeight: 700, color: 'var(--ink)',
                }}>Related Stories</h3>
              </div>

              {relatedBlogs.map((related, idx) => (
                <div key={related._id}
                  onClick={() => navigate('/blog/' + related._id)}
                  style={{
                    display: 'flex', gap: '10px', alignItems: 'flex-start',
                    marginBottom: idx < relatedBlogs.length - 1 ? '14px' : 0,
                    paddingBottom: idx < relatedBlogs.length - 1 ? '14px' : 0,
                    borderBottom: idx < relatedBlogs.length - 1 ? '1px solid var(--border)' : 'none',
                    cursor: 'pointer',
                  }}>
                  {related.thumbnail && (
                    <img src={related.thumbnail} alt="" style={{
                      width: '58px', height: '44px', objectFit: 'cover',
                      borderRadius: '8px', flexShrink: 0,
                      border: '1px solid var(--border)',
                    }} onError={(e) => e.target.style.display = 'none'} />
                  )}
                  <div>
                    <p style={{
                      fontSize: '13px', fontWeight: 600, color: 'var(--ink)',
                      lineHeight: 1.4, marginBottom: '3px',
                      display: '-webkit-box', WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical', overflow: 'hidden',
                    }}>{related.title}</p>
                    <p style={{ fontSize: '11px', color: 'var(--ink-muted)' }}>{related.author?.name}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BlogDetail