import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'
import API from '../api/axios'

const catColors = {
  Technology: '#5b4de8', Health: '#00b4a6', Travel: '#f5a623',
  Food: '#ff5c57', Lifestyle: '#a259ff', Business: '#0ea5e9',
  Education: '#16a34a', Sports: '#f97316', Entertainment: '#ec4899',
  General: '#7a7a8a'
}

const categories = [
  'General', 'Technology', 'Health', 'Travel', 'Food',
  'Lifestyle', 'Business', 'Education', 'Sports', 'Entertainment'
]

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['blockquote', 'code-block'],
    ['link'],
    ['clean']
  ]
}

const CreateBlog = () => {
  const navigate = useNavigate()

  const [title, setTitle]                   = useState('')
  const [content, setContent]               = useState('')
  const [thumbnail]           = useState('')
  const [thumbnailFile, setThumbnailFile]   = useState(null)
  const [thumbnailPreview, setThumbnailPreview] = useState('')
  const [category, setCategory]             = useState('General')
  const [tags, setTags]                     = useState('')
  const [error, setError]                   = useState('')
  const [loading, setLoading]               = useState(false)
  const [dragOver, setDragOver]             = useState(false)
  const fileRef = useRef()

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setThumbnailFile(file)
    setThumbnailPreview(URL.createObjectURL(file))
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (!file || !file.type.startsWith('image/')) return
    setThumbnailFile(file)
    setThumbnailPreview(URL.createObjectURL(file))
  }

  const uploadThumbnail = async () => {
    if (!thumbnailFile) return ''
    const formData = new FormData()
    formData.append('image', thumbnailFile)
    const res = await API.post('/blogs/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return res.data.imageUrl
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      let thumbnailUrl = thumbnail
      if (thumbnailFile) thumbnailUrl = await uploadThumbnail()
      const tagsArray = tags.split(',').map(t => t.trim()).filter(Boolean)
      const res = await API.post('/blogs', { title, content, thumbnail: thumbnailUrl, category, tags: tagsArray })
      navigate('/blog/' + res.data.blog._id)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create blog')
    }
    setLoading(false)
  }

  const selectedColor = catColors[category] || '#7a7a8a'

  return (
    <div className="page">

      {/* ── Page header ── */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          background: 'var(--accent-light)', borderRadius: '999px',
          padding: '4px 14px', marginBottom: '10px',
          fontSize: '11px', fontWeight: 700, color: 'var(--accent)',
          letterSpacing: '0.08em', textTransform: 'uppercase',
        }}>
          <img src="https://cdn-icons-png.flaticon.com/16/1828/1828919.png" alt="" width="11"
            style={{ opacity: 0.7 }} />
          New Story
        </div>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '32px', fontWeight: 900, color: 'var(--ink)',
        }}>
          Write Something Great
        </h1>
        <p style={{ color: 'var(--ink-muted)', fontSize: '14px', marginTop: '6px' }}>
          Share your ideas, stories, and expertise with the world.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px', alignItems: 'flex-start' }}>

        {/* ── Left: main editor card ── */}
        <div style={{
          background: 'white', borderRadius: '18px', padding: '32px',
          border: '1.5px solid var(--border)', boxShadow: 'var(--shadow-sm)',
        }}>
          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>

            {/* Title */}
            <div className="form-group">
              <label>Blog Title</label>
              <input
                type="text"
                placeholder="Write a compelling title…"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
                style={{ fontSize: '16px', fontWeight: 600, padding: '13px 16px' }}
              />
            </div>

            {/* Thumbnail upload */}
            <div className="form-group">
              <label>Cover Image</label>
              <div
                onClick={() => fileRef.current.click()}
                onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                style={{
                  border: `2px dashed ${dragOver ? 'var(--accent)' : 'var(--border)'}`,
                  borderRadius: '12px', cursor: 'pointer', overflow: 'hidden',
                  background: dragOver ? 'var(--accent-light)' : 'var(--surface-2)',
                  transition: 'border-color 0.2s, background 0.2s',
                  minHeight: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                {thumbnailPreview ? (
                  <img src={thumbnailPreview} alt="preview"
                    style={{ width: '100%', height: '220px', objectFit: 'cover', display: 'block' }} />
                ) : (
                  <div style={{ textAlign: 'center', padding: '32px 20px' }}>
                    <img src="https://cdn-icons-png.flaticon.com/48/1665/1665680.png" alt=""
                      width="40" style={{ opacity: 0.25, marginBottom: '10px' }} />
                    <p style={{ color: 'var(--ink-soft)', fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>
                      Click or drag to upload cover
                    </p>
                    <p style={{ color: 'var(--ink-muted)', fontSize: '12px' }}>JPG, PNG, WEBP · up to 5MB</p>
                  </div>
                )}
              </div>
              <input type="file" ref={fileRef} onChange={handleThumbnailChange} accept="image/*" style={{ display: 'none' }} />
              {thumbnailPreview && (
                <button type="button"
                  onClick={() => { setThumbnailFile(null); setThumbnailPreview('') }}
                  style={{
                    marginTop: '8px', background: 'none', border: 'none',
                    color: 'var(--coral)', cursor: 'pointer', fontSize: '12px',
                    fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px',
                  }}>
                  <img src="https://cdn-icons-png.flaticon.com/12/1828/1828843.png" alt="" width="10" style={{ opacity: 0.7 }} />
                  Remove image
                </button>
              )}
            </div>

            {/* Quill editor */}
            <div className="form-group">
              <label>Content</label>
              <div style={{
                borderRadius: '10px', overflow: 'hidden',
                border: '1.5px solid var(--border)',
              }}>
                <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={setContent}
                  modules={modules}
                  placeholder="Write your blog content here…"
                  style={{ height: '340px', fontFamily: "'DM Sans', sans-serif" }}
                />
              </div>
            </div>

            {/* Action buttons */}
            <div style={{
              display: 'flex', gap: '10px', marginTop: '60px',
              paddingTop: '20px', borderTop: '1.5px solid var(--border)',
            }}>
              <button type="submit" className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '11px 28px' }}
                disabled={loading}>
                <img src="https://cdn-icons-png.flaticon.com/16/3176/3176298.png" alt="" width="13"
                  style={{ filter: 'brightness(10)', opacity: loading ? 0.6 : 1 }} />
                {loading ? 'Publishing…' : 'Publish Story'}
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => navigate('/')}>
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* ── Right sidebar: meta options ── */}
        <div style={{ position: 'sticky', top: '88px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Category */}
          <div style={{
            background: 'white', borderRadius: '16px', padding: '22px',
            border: '1.5px solid var(--border)', boxShadow: 'var(--shadow-sm)',
          }}>
            <h3 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '15px', fontWeight: 700, color: 'var(--ink)',
              marginBottom: '16px', paddingBottom: '12px',
              borderBottom: '1.5px solid var(--border)',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              <img src="https://cdn-icons-png.flaticon.com/16/1055/1055644.png" alt="" width="14" style={{ opacity: 0.6 }} />
              Category
            </h3>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
              {categories.map(cat => {
                const active = category === cat
                const color = catColors[cat] || '#7a7a8a'
                return (
                  <button key={cat} type="button"
                    onClick={() => setCategory(cat)} style={{
                      padding: '5px 13px', borderRadius: '999px', cursor: 'pointer',
                      fontSize: '12px', fontWeight: 600, transition: 'all 0.18s',
                      border: `1.5px solid ${active ? color : 'var(--border)'}`,
                      background: active ? color : 'white',
                      color: active ? 'white' : 'var(--ink-muted)',
                      boxShadow: active ? `0 3px 10px ${color}40` : 'none',
                    }}>
                    {cat}
                  </button>
                )
              })}
            </div>

            {/* Selected indicator */}
            <div style={{
              marginTop: '14px', padding: '8px 14px', borderRadius: '10px',
              background: selectedColor + '12',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: selectedColor, flexShrink: 0 }} />
              <span style={{ fontSize: '12px', fontWeight: 600, color: selectedColor }}>
                {category}
              </span>
            </div>
          </div>

          {/* Tags */}
          <div style={{
            background: 'white', borderRadius: '16px', padding: '22px',
            border: '1.5px solid var(--border)', boxShadow: 'var(--shadow-sm)',
          }}>
            <h3 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '15px', fontWeight: 700, color: 'var(--ink)',
              marginBottom: '16px', paddingBottom: '12px',
              borderBottom: '1.5px solid var(--border)',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              <img src="https://cdn-icons-png.flaticon.com/16/2395/2395392.png" alt="" width="14" style={{ opacity: 0.6 }} />
              Tags
            </h3>
            <input
              type="text"
              placeholder="coding, react, tips…"
              value={tags}
              onChange={e => setTags(e.target.value)}
              style={{
                width: '100%', padding: '10px 14px',
                border: '1.5px solid var(--border)', borderRadius: '10px',
                fontSize: '13px', fontFamily: "'DM Sans', sans-serif",
                outline: 'none', color: 'var(--ink)',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
            <p style={{ fontSize: '11px', color: 'var(--ink-muted)', marginTop: '7px' }}>
              Separate tags with commas
            </p>

            {/* Live tag chips */}
            {tags.trim() && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '10px' }}>
                {tags.split(',').map(t => t.trim()).filter(Boolean).map((tag, i) => (
                  <span key={i} className="badge">#{tag}</span>
                ))}
              </div>
            )}
          </div>

          {/* Writing tips */}
          <div style={{
            background: 'linear-gradient(135deg, #ede9ff 0%, #f3f0ff 100%)',
            borderRadius: '16px', padding: '20px',
            border: '1.5px solid rgba(91,77,232,0.15)',
          }}>
            <p style={{
              fontSize: '12px', fontWeight: 700, color: 'var(--accent)',
              letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '10px',
            }}>
              Writing Tips
            </p>
            {[
              'Start with a strong hook in your first paragraph.',
              'Use short paragraphs to improve readability.',
              'Add a cover image to boost engagement.',
            ].map((tip, i) => (
              <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '18px', height: '18px', borderRadius: '50%', flexShrink: 0,
                  background: 'var(--accent)', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '10px', fontWeight: 700, color: 'white',
                }}>
                  {i + 1}
                </div>
                <p style={{ fontSize: '12px', color: 'var(--ink-soft)', lineHeight: 1.5 }}>{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateBlog