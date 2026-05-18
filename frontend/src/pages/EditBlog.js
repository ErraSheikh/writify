import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'
import API from '../api/axios'
import { useAuth } from '../context/AuthContext'

const categories = [
  'General', 'Technology', 'Health', 'Travel', 'Food',
  'Lifestyle', 'Business', 'Education', 'Sports', 'Entertainment'
]

const catColors = {
  Technology: '#5b4de8', Health: '#00b4a6', Travel: '#f5a623',
  Food: '#ff5c57', Lifestyle: '#a259ff', Business: '#0ea5e9',
  Education: '#16a34a', Sports: '#f97316', Entertainment: '#ec4899',
  General: '#7a7a8a'
}

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['blockquote', 'code-block'],
    ['link'],
    ['clean'],
  ]
}

const EditBlog = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const fileRef = useRef()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [thumbnailPreview, setThumbnailPreview] = useState('')
  const [thumbnailFile, setThumbnailFile] = useState(null)
  const [category, setCategory] = useState('General')
  const [tags, setTags] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [titleFocused, setTitleFocused] = useState(false)
  const [tagsFocused, setTagsFocused] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  // eslint-disable-next-line react-hooks/exhaustive-deps
useEffect(() => {
    API.get('/blogs/' + id).then((res) => {
        const blog = res.data.blog
        if (blog.author?._id?.toString() !== user?.id) { navigate('/'); return }
        setTitle(blog.title)
        setContent(blog.content)
        setThumbnailPreview(blog.thumbnail || '')
        setCategory(blog.category || 'General')
        setTags(blog.tags?.join(', ') || '')
    })
}, [id])
  useEffect(() => {
    API.get('/blogs/' + id).then((res) => {
      const blog = res.data.blog
      if (blog.author?._id?.toString() !== user?.id) { navigate('/'); return }
      setTitle(blog.title)
      setContent(blog.content)
      setThumbnailPreview(blog.thumbnail || '')
      setCategory(blog.category || 'General')
      setTags(blog.tags?.join(', ') || '')
    })
  }, [id])

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
    if (!thumbnailFile) return null
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
      let thumbnailUrl = thumbnailPreview
      if (thumbnailFile) thumbnailUrl = await uploadThumbnail()
      const tagsArray = tags.split(',').map(t => t.trim()).filter(Boolean)
      await API.put('/blogs/' + id, { title, content, thumbnail: thumbnailUrl, category, tags: tagsArray })
      navigate('/blog/' + id)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update blog')
    }
    setLoading(false)
  }

  const inputStyle = (focused) => ({
    width: '100%', padding: '13px 18px',
    fontSize: '15px', fontFamily: "'DM Sans', sans-serif",
    border: focused ? '2px solid #5b4de8' : '2px solid var(--border)',
    borderRadius: '10px', outline: 'none',
    background: focused ? '#faf9ff' : 'white',
    color: 'var(--ink)',
    boxShadow: focused ? '0 0 0 4px rgba(91,77,232,0.1)' : 'none',
    transition: 'all 0.18s', boxSizing: 'border-box',
  })

  const labelStyle = (focused) => ({
    display: 'block', fontSize: '12px', fontWeight: 700,
    color: focused ? '#5b4de8' : '#3a3a4a',
    marginBottom: '7px', letterSpacing: '0.06em',
    textTransform: 'uppercase', transition: 'color 0.15s',
    fontFamily: "'DM Sans', sans-serif",
  })

  return (
    <div className="page">

      {/* ── Page Header ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: '28px',
      }}>
        <div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: 'rgba(91,77,232,0.08)', borderRadius: '999px',
            padding: '4px 14px', marginBottom: '10px',
            fontSize: '12px', fontWeight: 700, color: '#5b4de8',
            letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>
            <img src="https://cdn-icons-png.flaticon.com/16/1159/1159633.png" alt="" width="11" style={{ opacity: 0.8 }} />
            Editing Story
          </div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '30px', fontWeight: 900, color: 'var(--ink)', lineHeight: 1.2,
          }}>
            Update your post
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="button" onClick={() => navigate('/blog/' + id)} style={{
            padding: '10px 22px', borderRadius: '999px',
            border: '1.5px solid var(--border)', background: 'white',
            color: 'var(--ink-muted)', cursor: 'pointer',
            fontSize: '14px', fontWeight: 600,
            fontFamily: "'DM Sans', sans-serif",
          }}>
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={loading} style={{
            padding: '10px 26px', borderRadius: '999px',
            background: loading
              ? 'linear-gradient(135deg, #9b8ff0, #b8a8f5)'
              : 'linear-gradient(135deg, #5b4de8, #8b7cf8)',
            color: 'white', border: 'none',
            fontSize: '14px', fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: "'DM Sans', sans-serif",
            boxShadow: '0 4px 16px rgba(91,77,232,0.3)',
            display: 'flex', alignItems: 'center', gap: '7px',
          }}>
            <img src="https://cdn-icons-png.flaticon.com/16/5525/5525545.png" alt="" width="13" style={{ opacity: 0.9 }} />
            {loading ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* ── Error ── */}
      {error && (
        <div style={{
          background: '#fff1f0', border: '1.5px solid #ff5c57',
          color: '#cc1f1a', borderRadius: '12px',
          padding: '13px 18px', fontSize: '14px', fontWeight: 500,
          marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px',
        }}>
          <img src="https://cdn-icons-png.flaticon.com/16/564/564619.png" alt="" width="14" />
          {error}
        </div>
      )}

      {/* ── Form card ── */}
      <div style={{
        background: 'white', borderRadius: '20px',
        padding: '36px', border: '1.5px solid var(--border)',
        boxShadow: '0 2px 20px rgba(0,0,0,0.05)',
        display: 'flex', flexDirection: 'column', gap: '28px',
      }}>

        {/* Title */}
        <div>
          <label style={labelStyle(titleFocused)}>Title</label>
          <input
            type="text"
            placeholder="Give your story a compelling title…"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={() => setTitleFocused(true)}
            onBlur={() => setTitleFocused(false)}
            required
            style={{ ...inputStyle(titleFocused), fontSize: '17px', fontWeight: 600 }}
          />
        </div>

        {/* Thumbnail */}
        <div>
          <label style={labelStyle(false)}>Thumbnail Image</label>
          <div
            onClick={() => fileRef.current.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            style={{
              border: `2px dashed ${dragOver ? '#5b4de8' : 'var(--border)'}`,
              borderRadius: '14px', cursor: 'pointer',
              background: dragOver ? '#faf9ff' : '#fafafa',
              overflow: 'hidden', transition: 'all 0.18s',
              minHeight: thumbnailPreview ? 'auto' : '140px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
            {thumbnailPreview ? (
              <img src={thumbnailPreview} alt="preview"
                style={{ width: '100%', height: '220px', objectFit: 'cover', display: 'block' }}
                onError={(e) => e.target.style.display = 'none'} />
            ) : (
              <div style={{ textAlign: 'center', padding: '32px 20px' }}>
                <img src="https://cdn-icons-png.flaticon.com/48/1665/1665680.png" alt="" width="36"
                  style={{ opacity: 0.3, marginBottom: '10px' }} />
                <p style={{ color: 'var(--ink-muted)', fontSize: '14px', fontWeight: 500, marginBottom: '4px' }}>
                  Click or drag to upload thumbnail
                </p>
                <p style={{ color: '#bbb', fontSize: '12px' }}>JPG, PNG, WEBP · max 5MB</p>
              </div>
            )}
          </div>
          <input type="file" ref={fileRef} onChange={handleThumbnailChange}
            accept="image/*" style={{ display: 'none' }} />
          {thumbnailPreview && (
            <button type="button" onClick={() => { setThumbnailFile(null); setThumbnailPreview('') }}
              style={{
                marginTop: '8px', background: 'none', border: 'none',
                color: '#ff5c57', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
                fontFamily: "'DM Sans', sans-serif", padding: '0',
                display: 'flex', alignItems: 'center', gap: '4px',
              }}>
              <img src="https://cdn-icons-png.flaticon.com/16/3096/3096673.png" alt="" width="11" style={{ opacity: 0.7 }} />
              Remove image
            </button>
          )}
        </div>

        {/* Category + Tags row */}
        <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle(false)}>Category</label>
            <div style={{ position: 'relative' }}>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
    width: '100%', padding: '13px 40px 13px 18px',
    fontSize: '14px', fontFamily: "'DM Sans', sans-serif",
    fontWeight: 600,
    border: '2px solid var(--border)', borderRadius: '10px',
    outline: 'none', background: 'white',
    cursor: 'pointer', appearance: 'none', boxSizing: 'border-box',
    color: catColors[category] || 'var(--ink)',
}}>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <img src="https://cdn-icons-png.flaticon.com/12/2985/2985150.png" alt="" width="11"
                style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4, pointerEvents: 'none' }} />
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <label style={labelStyle(tagsFocused)}>Tags <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: '#aaa' }}>(comma separated)</span></label>
            <input
              type="text"
              placeholder="e.g. coding, react, tips"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              onFocus={() => setTagsFocused(true)}
              onBlur={() => setTagsFocused(false)}
              style={inputStyle(tagsFocused)}
            />
          </div>
        </div>

        {/* Content editor */}
        <div>
          <label style={labelStyle(false)}>Content</label>
          <div style={{
            border: '2px solid var(--border)', borderRadius: '10px',
            overflow: 'hidden',
          }}>
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              modules={modules}
              placeholder="Write your story here…"
              style={{ height: '360px', fontFamily: "'DM Sans', sans-serif" }}
            />
          </div>
        </div>

      </div>

      {/* Bottom action bar */}
      <div style={{
        display: 'flex', justifyContent: 'flex-end',
        gap: '10px', marginTop: '20px',
      }}>
        <button type="button" onClick={() => navigate('/blog/' + id)} style={{
          padding: '11px 26px', borderRadius: '999px',
          border: '1.5px solid var(--border)', background: 'white',
          color: 'var(--ink-muted)', cursor: 'pointer',
          fontSize: '14px', fontWeight: 600,
          fontFamily: "'DM Sans', sans-serif",
        }}>
          Discard Changes
        </button>
        <button onClick={handleSubmit} disabled={loading} style={{
          padding: '11px 28px', borderRadius: '999px',
          background: loading
            ? 'linear-gradient(135deg, #9b8ff0, #b8a8f5)'
            : 'linear-gradient(135deg, #5b4de8, #8b7cf8)',
          color: 'white', border: 'none',
          fontSize: '14px', fontWeight: 700,
          cursor: loading ? 'not-allowed' : 'pointer',
          fontFamily: "'DM Sans', sans-serif",
          boxShadow: '0 4px 16px rgba(91,77,232,0.3)',
        }}>
          {loading ? 'Saving…' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}

export default EditBlog