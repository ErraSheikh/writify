// import { useState, useEffect, useRef } from 'react'
// import { useNavigate } from 'react-router-dom'
// import API from '../api/axios'
// import { useAuth } from '../context/AuthContext'

// const catColors = {
//   Technology: '#5b4de8', Health: '#00b4a6', Travel: '#f5a623',
//   Food: '#ff5c57', Lifestyle: '#a259ff', Business: '#0ea5e9',
//   Education: '#16a34a', Sports: '#f97316', Entertainment: '#ec4899',
//   General: '#7a7a8a'
// }

// const avatarBg = (name = '') => {
//   const colors = ['#5b4de8', '#ff5c57', '#00b4a6', '#f5a623', '#a259ff', '#0ea5e9']
//   return colors[name.charCodeAt(0) % colors.length]
// }

// const getInitials = (name = '') =>
//   name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

// const TABS = [
//   { key: 'myblogs',  label: 'My Blogs',  icon: 'https://cdn-icons-png.flaticon.com/20/1584/1584942.png' },
//   { key: 'liked',    label: 'Liked',     icon: 'https://cdn-icons-png.flaticon.com/20/2589/2589175.png' },
//   { key: 'saved',    label: 'Saved',     icon: 'https://cdn-icons-png.flaticon.com/20/2099/2099183.png' },
//   { key: 'profile',  label: 'Profile',   icon: 'https://cdn-icons-png.flaticon.com/20/1077/1077012.png' },
// ]

// const StatCard = ({ label, value, color, icon }) => (
//   <div style={{
//     background: 'white', borderRadius: '16px',
//     padding: '22px 20px', border: '1.5px solid var(--border)',
//     boxShadow: 'var(--shadow-sm)', display: 'flex',
//     flexDirection: 'column', gap: '10px', position: 'relative', overflow: 'hidden',
//   }}>
//     <div style={{
//       position: 'absolute', top: '-18px', right: '-18px',
//       width: '80px', height: '80px', borderRadius: '50%',
//       background: color + '12', pointerEvents: 'none',
//     }} />
//     <div style={{
//       width: '36px', height: '36px', borderRadius: '10px',
//       background: color + '18', display: 'flex',
//       alignItems: 'center', justifyContent: 'center',
//     }}>
//       <img src={icon} alt="" width="18" style={{ opacity: 0.85 }} />
//     </div>
//     <div>
//       <p style={{ fontSize: '12px', color: 'var(--ink-muted)', fontWeight: 600,
//         textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>
//         {label}
//       </p>
//       <p style={{ fontSize: '32px', fontWeight: 900, color,
//         fontFamily: "'Playfair Display', serif", lineHeight: 1 }}>
//         {value}
//       </p>
//     </div>
//   </div>
// )

// const BlogRow = ({ blog, onEdit, onDelete, showActions, onClick }) => {
//   const getPreview = (content) => {
//     const stripped = content.replace(/<[^>]+>/g, '')
//     return stripped.length > 100 ? stripped.substring(0, 100) + '…' : stripped
//   }
//   const color = catColors[blog.category] || '#7a7a8a'

//   return (
//     <div style={{
//       background: 'white', borderRadius: '14px', padding: '20px 22px',
//       marginBottom: '14px', border: '1.5px solid var(--border)',
//       boxShadow: 'var(--shadow-sm)', transition: 'box-shadow 0.2s, transform 0.2s',
//       cursor: 'pointer', position: 'relative', overflow: 'hidden',
//     }}
//       onMouseEnter={e => {
//         e.currentTarget.style.boxShadow = 'var(--shadow-md)'
//         e.currentTarget.style.transform = 'translateY(-1px)'
//       }}
//       onMouseLeave={e => {
//         e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
//         e.currentTarget.style.transform = 'translateY(0)'
//       }}
//       onClick={onClick}
//     >
//       <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px', background: color }} />

//       <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
//         <div style={{ flex: 1, minWidth: 0 }}>
//           <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
//             <span style={{
//               padding: '2px 10px', borderRadius: '999px', fontSize: '11px',
//               fontWeight: 700, background: color + '18', color,
//             }}>{blog.category}</span>
//             <span style={{ fontSize: '11px', color: 'var(--ink-muted)' }}>
//               {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
//             </span>
//           </div>

//           <h3 style={{
//             fontFamily: "'Playfair Display', serif",
//             fontSize: '16px', fontWeight: 700, color: 'var(--ink)',
//             marginBottom: '5px', lineHeight: 1.4,
//           }}>
//             {blog.title}
//           </h3>

//           <p style={{ fontSize: '13px', color: 'var(--ink-muted)', lineHeight: 1.6, marginBottom: '10px' }}>
//             {getPreview(blog.content)}
//           </p>

//           <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
//             {blog.author && (
//               <span style={{ fontSize: '12px', color: 'var(--ink-muted)', fontWeight: 500 }}>
//                 By {blog.author.name}
//               </span>
//             )}
//             <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--ink-muted)' }}>
//               <img src="https://cdn-icons-png.flaticon.com/16/2589/2589175.png" alt="" width="12" style={{ opacity: 0.5 }} />
//               {blog.likes?.length || 0}
//             </span>
//             <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--ink-muted)' }}>
//               <img src="https://cdn-icons-png.flaticon.com/16/709/709612.png" alt="" width="12" style={{ opacity: 0.5 }} />
//               {blog.views || 0}
//             </span>

//             {showActions && (
//               <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}
//                 onClick={e => e.stopPropagation()}>
//                 <button onClick={onEdit} style={{
//                   padding: '5px 14px', borderRadius: '999px', cursor: 'pointer',
//                   fontSize: '12px', fontWeight: 600,
//                   border: '1.5px solid var(--accent)', background: 'white', color: 'var(--accent)',
//                   transition: 'all 0.15s',
//                 }}
//                   onMouseEnter={e => { e.target.style.background = 'var(--accent)'; e.target.style.color = 'white' }}
//                   onMouseLeave={e => { e.target.style.background = 'white'; e.target.style.color = 'var(--accent)' }}>
//                   Edit
//                 </button>
//                 <button onClick={onDelete} style={{
//                   padding: '5px 14px', borderRadius: '999px', cursor: 'pointer',
//                   fontSize: '12px', fontWeight: 600,
//                   border: '1.5px solid var(--coral)', background: 'white', color: 'var(--coral)',
//                   transition: 'all 0.15s',
//                 }}
//                   onMouseEnter={e => { e.target.style.background = 'var(--coral)'; e.target.style.color = 'white' }}
//                   onMouseLeave={e => { e.target.style.background = 'white'; e.target.style.color = 'var(--coral)' }}>
//                   Delete
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>

//         {blog.thumbnail && (
//           <img src={blog.thumbnail} alt=""
//             style={{
//               width: '84px', height: '64px', objectFit: 'cover',
//               borderRadius: '10px', flexShrink: 0,
//               border: '1.5px solid var(--border)',
//             }}
//             onError={e => e.target.style.display = 'none'}
//           />
//         )}
//       </div>
//     </div>
//   )
// }

// const EmptyState = ({ message, icon }) => (
//   <div style={{
//     textAlign: 'center', padding: '60px 20px',
//     background: 'white', borderRadius: '16px',
//     border: '1.5px dashed var(--border)',
//   }}>
//     <img src={icon} alt="" width="52" style={{ opacity: 0.3, marginBottom: '12px' }} />
//     <p style={{ color: 'var(--ink-muted)', fontSize: '15px', fontWeight: 500 }}>{message}</p>
//   </div>
// )

// /* ─────────────────────────────────────── */

// const Dashboard = () => {
//   const { user } = useAuth()
//   const navigate = useNavigate()

//   const [myBlogs, setMyBlogs] = useState([])
//   const [likedBlogs, setLikedBlogs] = useState([])
//   const [savedBlogs, setSavedBlogs] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [activeTab, setActiveTab] = useState('myblogs')

//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   useEffect(() => { loadAll() }, [])

//   const loadAll = () => {
//     API.get('/blogs/user/' + user.id).then(res => setMyBlogs(res.data.blogs))
//     API.get('/blogs/liked').then(res => setLikedBlogs(res.data.blogs))
//     API.get('/blogs/saved').then(res => {
//       setSavedBlogs(res.data.blogs)
//       setLoading(false)
//     }).catch(() => setLoading(false))
//   }

//   const handleDelete = (id) => {
//     if (!window.confirm('Delete this blog?')) return
//     API.delete('/blogs/' + id).then(() =>
//       setMyBlogs(myBlogs.filter(b => b._id !== id))
//     )
//   }

//   if (loading) return (
//     <div className="loading-state">
//       <div style={{ marginBottom: 12 }}>
//         <span className="loading-dot" /><span className="loading-dot" /><span className="loading-dot" />
//       </div>
//       <p>Loading dashboard…</p>
//     </div>
//   )

//   return (
//     <div className="page">

//       {/* ── Header ── */}
//       <div style={{
//         background: 'linear-gradient(135deg, #0f0f0f 0%, #2d2060 100%)',
//         borderRadius: '20px', padding: '36px 40px',
//         marginBottom: '32px', position: 'relative', overflow: 'hidden',
//         display: 'flex', alignItems: 'center', gap: '24px',
//       }}>
//         <div style={{
//           position: 'absolute', right: '-40px', top: '-40px',
//           width: '200px', height: '200px', borderRadius: '50%',
//           background: 'rgba(91,77,232,0.2)', pointerEvents: 'none',
//         }} />
//         <div style={{
//           position: 'absolute', right: '100px', bottom: '-60px',
//           width: '140px', height: '140px', borderRadius: '50%',
//           background: 'rgba(162,89,255,0.15)', pointerEvents: 'none',
//         }} />

//         {/* Avatar */}
//         <div style={{
//           width: '64px', height: '64px', borderRadius: '50%',
//           background: avatarBg(user?.name),
//           display: 'flex', alignItems: 'center', justifyContent: 'center',
//           color: 'white', fontSize: '22px', fontWeight: 700,
//           flexShrink: 0, border: '3px solid rgba(255,255,255,0.2)',
//           overflow: 'hidden',
//         }}>
//           {user?.profileImage
//             ? <img src={user.profileImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
//             : getInitials(user?.name)
//           }
//         </div>

//         <div style={{ position: 'relative', zIndex: 1 }}>
//           <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontWeight: 600,
//             letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>
//             Dashboard
//           </p>
//           <h1 style={{
//             fontFamily: "'Playfair Display', serif",
//             fontSize: '28px', fontWeight: 900, color: 'white', lineHeight: 1.2,
//           }}>
//             Welcome back, {user?.name?.split(' ')[0]}
//           </h1>
//           <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', marginTop: '4px' }}>
//             {user?.email}
//           </p>
//         </div>
//       </div>

//       {/* ── Stat Cards ── */}
//       <div style={{
//         display: 'grid',
//         gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))',
//         gap: '16px', marginBottom: '32px',
//       }}>
//         <StatCard label="My Blogs"    value={myBlogs.length}   color="#5b4de8" icon="https://cdn-icons-png.flaticon.com/20/1584/1584942.png" />
//         <StatCard label="Liked"       value={likedBlogs.length} color="#ff5c57" icon="https://cdn-icons-png.flaticon.com/20/2589/2589175.png" />
//         <StatCard label="Saved"       value={savedBlogs.length} color="#f5a623" icon="https://cdn-icons-png.flaticon.com/20/2099/2099183.png" />
//         <StatCard label="Total Views" value={myBlogs.reduce((s, b) => s + (b.views || 0), 0)} color="#00b4a6" icon="https://cdn-icons-png.flaticon.com/20/709/709612.png" />
//       </div>

//       {/* ── Tabs ── */}
//       <div style={{
//         display: 'flex', gap: '6px', marginBottom: '28px',
//         background: 'white', padding: '6px', borderRadius: '14px',
//         border: '1.5px solid var(--border)', width: 'fit-content',
//       }}>
//         {TABS.map(tab => {
//           const active = activeTab === tab.key
//           return (
//             <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
//               display: 'flex', alignItems: 'center', gap: '7px',
//               padding: '9px 20px', borderRadius: '10px', cursor: 'pointer',
//               fontSize: '13px', fontWeight: 600, transition: 'all 0.18s',
//               border: 'none',
//               background: active ? 'var(--accent)' : 'transparent',
//               color: active ? 'white' : 'var(--ink-muted)',
//               boxShadow: active ? '0 3px 12px rgba(91,77,232,0.3)' : 'none',
//             }}>
//               <img src={tab.icon} alt="" width="14"
//                 style={{ opacity: active ? 1 : 0.5, filter: active ? 'brightness(10)' : 'none' }} />
//               {tab.label}
//             </button>
//           )
//         })}
//       </div>

//       {/* ── My Blogs ── */}
//       {activeTab === 'myblogs' && (
//         <div>
//           <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
//             <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', fontWeight: 700, color: 'var(--ink)' }}>
//               Your Stories
//               <span style={{
//                 marginLeft: '10px', background: 'var(--accent-light)', color: 'var(--accent)',
//                 borderRadius: '999px', padding: '2px 10px', fontSize: '13px', fontWeight: 700,
//               }}>{myBlogs.length}</span>
//             </h2>
//             <button className="btn btn-primary" onClick={() => navigate('/create')}
//               style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
//               <img src="https://cdn-icons-png.flaticon.com/16/1828/1828919.png" alt="" width="13"
//                 style={{ filter: 'brightness(10)' }} />
//               Write New Blog
//             </button>
//           </div>

//           {myBlogs.length === 0
//             ? <EmptyState message="You haven't written any blogs yet" icon="https://cdn-icons-png.flaticon.com/64/4076/4076432.png" />
//             : myBlogs.map(blog => (
//               <BlogRow key={blog._id} blog={blog} showActions
//                 onClick={() => navigate('/blog/' + blog._id)}
//                 onEdit={() => navigate('/edit/' + blog._id)}
//                 onDelete={() => handleDelete(blog._id)}
//               />
//             ))
//           }
//         </div>
//       )}

//       {/* ── Liked ── */}
//       {activeTab === 'liked' && (
//         <div>
//           <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', fontWeight: 700, color: 'var(--ink)', marginBottom: '20px' }}>
//             Liked Stories
//             <span style={{
//               marginLeft: '10px', background: '#fff0f0', color: 'var(--coral)',
//               borderRadius: '999px', padding: '2px 10px', fontSize: '13px', fontWeight: 700,
//             }}>{likedBlogs.length}</span>
//           </h2>
//           {likedBlogs.length === 0
//             ? <EmptyState message="You haven't liked any blogs yet" icon="https://cdn-icons-png.flaticon.com/64/2589/2589175.png" />
//             : likedBlogs.map(blog => (
//               <BlogRow key={blog._id} blog={blog}
//                 onClick={() => navigate('/blog/' + blog._id)} />
//             ))
//           }
//         </div>
//       )}

//       {/* ── Saved ── */}
//       {activeTab === 'saved' && (
//         <div>
//           <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', fontWeight: 700, color: 'var(--ink)', marginBottom: '20px' }}>
//             Saved Stories
//             <span style={{
//               marginLeft: '10px', background: '#fff8e6', color: 'var(--amber)',
//               borderRadius: '999px', padding: '2px 10px', fontSize: '13px', fontWeight: 700,
//             }}>{savedBlogs.length}</span>
//           </h2>
//           {savedBlogs.length === 0
//             ? <EmptyState message="You haven't saved any blogs yet" icon="https://cdn-icons-png.flaticon.com/64/2099/2099183.png" />
//             : savedBlogs.map(blog => (
//               <BlogRow key={blog._id} blog={blog}
//                 onClick={() => navigate('/blog/' + blog._id)} />
//             ))
//           }
//         </div>
//       )}

//       {/* ── Profile ── */}
//       {activeTab === 'profile' && <ProfileEdit user={user} />}
//     </div>
//   )
// }

// /* ─────────────────────────────────────── */

// const ProfileEdit = ({ user }) => {
  
//   const fileRef = useRef()
//   const [name, setName] = useState('')
//   const [bio, setBio] = useState('')
//   const [profileImage, setProfileImage] = useState('')
//   const [profileImageFile, setProfileImageFile] = useState(null)
//   const [profileImagePreview, setProfileImagePreview] = useState('')
//   const [twitter, setTwitter] = useState('')
//   const [instagram, setInstagram] = useState('')
//   const [linkedin, setLinkedin] = useState('')
//   const [success, setSuccess] = useState('')
//   const [error, setError] = useState('')
//   const [loading, setLoading] = useState(false)

//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   useEffect(() => {
//     API.get('/auth/profile/' + user.id).then(res => {
//       const u = res.data.user
//       setName(u.name || '')
//       setBio(u.bio || '')
//       setProfileImage(u.profileImage || '')
//       setProfileImagePreview(u.profileImage || '')
//       setTwitter(u.socialLinks?.twitter || '')
//       setInstagram(u.socialLinks?.instagram || '')
//       setLinkedin(u.socialLinks?.linkedin || '')
//     })
//   }, [])

//   const handleImageChange = (e) => {
//     const file = e.target.files[0]
//     if (!file) return
//     setProfileImageFile(file)
//     setProfileImagePreview(URL.createObjectURL(file))
//   }

//   const uploadProfileImage = async () => {
//     if (!profileImageFile) return profileImage
//     const formData = new FormData()
//     formData.append('image', profileImageFile)
//     const res = await API.post('/auth/upload', formData, {
//       headers: { 'Content-Type': 'multipart/form-data' }
//     })
//     return res.data.imageUrl
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setSuccess(''); setError(''); setLoading(true)
//     try {
//       let imageUrl = profileImage
//       if (profileImageFile) imageUrl = await uploadProfileImage()
//       await API.put('/auth/profile', {
//         name, bio, profileImage: imageUrl,
//         socialLinks: { twitter, instagram, linkedin }
//       })
//       setSuccess('Profile updated successfully')
//     } catch {
//       setError('Failed to update profile')
//     }
//     setLoading(false)
//   }

//   const socialFields = [
//     { label: 'Twitter / X', val: twitter, set: setTwitter, placeholder: 'https://twitter.com/username', icon: 'https://cdn-icons-png.flaticon.com/16/5968/5968830.png', color: '#1da1f2' },
//     { label: 'Instagram',   val: instagram, set: setInstagram, placeholder: 'https://instagram.com/username', icon: 'https://cdn-icons-png.flaticon.com/16/2111/2111463.png', color: '#e1306c' },
//     { label: 'LinkedIn',    val: linkedin, set: setLinkedin,   placeholder: 'https://linkedin.com/in/username', icon: 'https://cdn-icons-png.flaticon.com/16/174/174857.png', color: '#0077b5' },
//   ]

//   return (
//     <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }}>

//       {/* Left: avatar + basic info */}
//       <div style={{
//         background: 'white', borderRadius: '18px', padding: '30px',
//         border: '1.5px solid var(--border)', boxShadow: 'var(--shadow-sm)',
//       }}>
//         <h3 style={{
//           fontFamily: "'Playfair Display', serif",
//           fontSize: '18px', fontWeight: 700, color: 'var(--ink)',
//           marginBottom: '24px', paddingBottom: '16px',
//           borderBottom: '1.5px solid var(--border)',
//         }}>
//           Edit Profile
//         </h3>

//         {success && <div className="alert alert-success">{success}</div>}
//         {error   && <div className="alert alert-error">{error}</div>}

//         <form onSubmit={handleSubmit}>
//           {/* Avatar upload */}
//           <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '28px' }}>
//             <div style={{
//               width: '96px', height: '96px', borderRadius: '50%',
//               background: avatarBg(user?.name),
//               display: 'flex', alignItems: 'center', justifyContent: 'center',
//               color: 'white', fontSize: '30px', fontWeight: 700,
//               overflow: 'hidden', cursor: 'pointer', marginBottom: '14px',
//               border: '3px solid var(--accent-light)',
//               boxShadow: '0 0 0 4px rgba(91,77,232,0.1)',
//               transition: 'box-shadow 0.2s',
//             }} onClick={() => fileRef.current.click()}>
//               {profileImagePreview
//                 ? <img src={profileImagePreview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
//                 : getInitials(user?.name)
//               }
//             </div>
//             <button type="button" onClick={() => fileRef.current.click()} style={{
//               display: 'flex', alignItems: 'center', gap: '6px',
//               padding: '7px 18px', borderRadius: '999px', cursor: 'pointer',
//               fontSize: '12px', fontWeight: 600,
//               border: '1.5px solid var(--accent)', background: 'white', color: 'var(--accent)',
//             }}>
//               <img src="https://cdn-icons-png.flaticon.com/16/1665/1665680.png" alt="" width="12" />
//               Change Photo
//             </button>
//             <p style={{ fontSize: '11px', color: 'var(--ink-muted)', marginTop: '6px' }}>JPG, PNG · max 5MB</p>
//             <input type="file" ref={fileRef} onChange={handleImageChange} accept="image/*" style={{ display: 'none' }} />
//           </div>

//           <div className="form-group">
//             <label>Full Name</label>
//             <input type="text" value={name} onChange={e => setName(e.target.value)} required />
//           </div>

//           <div className="form-group">
//             <label>Bio</label>
//             <textarea value={bio} onChange={e => setBio(e.target.value)} rows={4} placeholder="Tell readers about yourself…" />
//           </div>

//           <button type="submit" className="btn btn-primary"
//             style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
//             {loading ? 'Saving…' : 'Save Changes'}
//           </button>
//         </form>
//       </div>

//       {/* Right: social links */}
//       <div style={{
//         background: 'white', borderRadius: '18px', padding: '30px',
//         border: '1.5px solid var(--border)', boxShadow: 'var(--shadow-sm)',
//       }}>
//         <h3 style={{
//           fontFamily: "'Playfair Display', serif",
//           fontSize: '18px', fontWeight: 700, color: 'var(--ink)',
//           marginBottom: '24px', paddingBottom: '16px',
//           borderBottom: '1.5px solid var(--border)',
//         }}>
//           Social Links
//         </h3>

//         {socialFields.map(({ label, val, set, placeholder, icon, color }) => (
//           <div key={label} className="form-group">
//             <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
//               <img src={icon} alt="" width="13" style={{ filter: 'none' }} />
//               {label}
//             </label>
//             <div style={{ position: 'relative' }}>
//               <input
//                 type="text" value={val}
//                 onChange={e => set(e.target.value)}
//                 placeholder={placeholder}
//                 style={{ paddingLeft: '38px' }}
//               />
//               <img src={icon} alt="" width="14"
//                 style={{
//                   position: 'absolute', left: '13px', top: '50%',
//                   transform: 'translateY(-50%)', opacity: 0.5,
//                 }} />
//             </div>
//           </div>
//         ))}

//         {/* Social preview chips */}
//         <div style={{ marginTop: '10px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
//           {twitter   && <a href={twitter}   target="_blank" rel="noopener noreferrer" style={{ padding: '5px 14px', borderRadius: '999px', fontSize: '12px', fontWeight: 600, background: '#e8f5fe', color: '#1da1f2', textDecoration: 'none' }}>Twitter</a>}
//           {instagram && <a href={instagram} target="_blank" rel="noopener noreferrer" style={{ padding: '5px 14px', borderRadius: '999px', fontSize: '12px', fontWeight: 600, background: '#fce4ec', color: '#e1306c', textDecoration: 'none' }}>Instagram</a>}
//           {linkedin  && <a href={linkedin}  target="_blank" rel="noopener noreferrer" style={{ padding: '5px 14px', borderRadius: '999px', fontSize: '12px', fontWeight: 600, background: '#e3f2fd', color: '#0077b5', textDecoration: 'none' }}>LinkedIn</a>}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Dashboard

import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
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

const TABS = [
  { key: 'myblogs',  label: 'My Blogs',  icon: 'https://cdn-icons-png.flaticon.com/20/1584/1584942.png' },
  { key: 'liked',    label: 'Liked',     icon: 'https://cdn-icons-png.flaticon.com/20/2589/2589175.png' },
  { key: 'saved',    label: 'Saved',     icon: 'https://cdn-icons-png.flaticon.com/20/2099/2099183.png' },
  { key: 'profile',  label: 'Profile',   icon: 'https://cdn-icons-png.flaticon.com/20/1077/1077012.png' },
]

const StatCard = ({ label, value, color, icon }) => (
  <div style={{
    background: 'white', borderRadius: '16px',
    padding: '22px 20px', border: '1.5px solid var(--border)',
    boxShadow: 'var(--shadow-sm)', display: 'flex',
    flexDirection: 'column', gap: '10px', position: 'relative', overflow: 'hidden',
  }}>
    <div style={{
      position: 'absolute', top: '-18px', right: '-18px',
      width: '80px', height: '80px', borderRadius: '50%',
      background: color + '12', pointerEvents: 'none',
    }} />
    <div style={{
      width: '36px', height: '36px', borderRadius: '10px',
      background: color + '18', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
    }}>
      <img src={icon} alt="" width="18" style={{ opacity: 0.85 }} />
    </div>
    <div>
      <p style={{ fontSize: '12px', color: 'var(--ink-muted)', fontWeight: 600,
        textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>
        {label}
      </p>
      <p style={{ fontSize: '32px', fontWeight: 900, color,
        fontFamily: "'Playfair Display', serif", lineHeight: 1 }}>
        {value}
      </p>
    </div>
  </div>
)

const BlogRow = ({ blog, onEdit, onDelete, showActions, onClick }) => {
  const getPreview = (content) => {
    const stripped = content.replace(/<[^>]+>/g, '')
    return stripped.length > 100 ? stripped.substring(0, 100) + '…' : stripped
  }
  const color = catColors[blog.category] || '#7a7a8a'

  return (
    <div style={{
      background: 'white', borderRadius: '14px', padding: '20px 22px',
      marginBottom: '14px', border: '1.5px solid var(--border)',
      boxShadow: 'var(--shadow-sm)', transition: 'box-shadow 0.2s, transform 0.2s',
      cursor: 'pointer', position: 'relative', overflow: 'hidden',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = 'var(--shadow-md)'
        e.currentTarget.style.transform = 'translateY(-1px)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
      onClick={onClick}
    >
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px', background: color }} />

      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{
              padding: '2px 10px', borderRadius: '999px', fontSize: '11px',
              fontWeight: 700, background: color + '18', color,
            }}>{blog.category}</span>
            <span style={{ fontSize: '11px', color: 'var(--ink-muted)' }}>
              {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>

          <h3 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '16px', fontWeight: 700, color: 'var(--ink)',
            marginBottom: '5px', lineHeight: 1.4,
          }}>
            {blog.title}
          </h3>

          <p style={{ fontSize: '13px', color: 'var(--ink-muted)', lineHeight: 1.6, marginBottom: '10px' }}>
            {getPreview(blog.content)}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            {blog.author && (
              <span style={{ fontSize: '12px', color: 'var(--ink-muted)', fontWeight: 500 }}>
                By {blog.author.name}
              </span>
            )}
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--ink-muted)' }}>
              <img src="https://cdn-icons-png.flaticon.com/16/2589/2589175.png" alt="" width="12" style={{ opacity: 0.5 }} />
              {blog.likes?.length || 0}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--ink-muted)' }}>
              <img src="https://cdn-icons-png.flaticon.com/16/709/709612.png" alt="" width="12" style={{ opacity: 0.5 }} />
              {blog.views || 0}
            </span>

            {showActions && (
              <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}
                onClick={e => e.stopPropagation()}>
                <button onClick={onEdit} style={{
                  padding: '5px 14px', borderRadius: '999px', cursor: 'pointer',
                  fontSize: '12px', fontWeight: 600,
                  border: '1.5px solid var(--accent)', background: 'white', color: 'var(--accent)',
                  transition: 'all 0.15s',
                }}
                  onMouseEnter={e => { e.target.style.background = 'var(--accent)'; e.target.style.color = 'white' }}
                  onMouseLeave={e => { e.target.style.background = 'white'; e.target.style.color = 'var(--accent)' }}>
                  Edit
                </button>
                <button onClick={onDelete} style={{
                  padding: '5px 14px', borderRadius: '999px', cursor: 'pointer',
                  fontSize: '12px', fontWeight: 600,
                  border: '1.5px solid var(--coral)', background: 'white', color: 'var(--coral)',
                  transition: 'all 0.15s',
                }}
                  onMouseEnter={e => { e.target.style.background = 'var(--coral)'; e.target.style.color = 'white' }}
                  onMouseLeave={e => { e.target.style.background = 'white'; e.target.style.color = 'var(--coral)' }}>
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {blog.thumbnail && (
          <img src={blog.thumbnail} alt=""
            style={{
              width: '84px', height: '64px', objectFit: 'cover',
              borderRadius: '10px', flexShrink: 0,
              border: '1.5px solid var(--border)',
            }}
            onError={e => e.target.style.display = 'none'}
          />
        )}
      </div>
    </div>
  )
}

const EmptyState = ({ message, icon }) => (
  <div style={{
    textAlign: 'center', padding: '60px 20px',
    background: 'white', borderRadius: '16px',
    border: '1.5px dashed var(--border)',
  }}>
    <img src={icon} alt="" width="52" style={{ opacity: 0.3, marginBottom: '12px' }} />
    <p style={{ color: 'var(--ink-muted)', fontSize: '15px', fontWeight: 500 }}>{message}</p>
  </div>
)

const Dashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [myBlogs, setMyBlogs] = useState([])
  const [likedBlogs, setLikedBlogs] = useState([])
  const [savedBlogs, setSavedBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('myblogs')

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { loadAll() }, [])

  const loadAll = () => {
    API.get('/blogs/user/' + user.id).then(res => setMyBlogs(res.data.blogs))
    API.get('/blogs/liked').then(res => setLikedBlogs(res.data.blogs))
    API.get('/blogs/saved').then(res => {
      setSavedBlogs(res.data.blogs)
      setLoading(false)
    }).catch(() => setLoading(false))
  }

  const handleDelete = (id) => {
    if (!window.confirm('Delete this blog?')) return
    API.delete('/blogs/' + id).then(() =>
      setMyBlogs(myBlogs.filter(b => b._id !== id))
    )
  }

  if (loading) return (
    <div className="loading-state">
      <div style={{ marginBottom: 12 }}>
        <span className="loading-dot" /><span className="loading-dot" /><span className="loading-dot" />
      </div>
      <p>Loading dashboard…</p>
    </div>
  )

  return (
    <div className="page">

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0f0f0f 0%, #2d2060 100%)',
        borderRadius: '20px', padding: '36px 40px',
        marginBottom: '32px', position: 'relative', overflow: 'hidden',
        display: 'flex', alignItems: 'center', gap: '24px',
      }}>
        <div style={{
          position: 'absolute', right: '-40px', top: '-40px',
          width: '200px', height: '200px', borderRadius: '50%',
          background: 'rgba(91,77,232,0.2)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', right: '100px', bottom: '-60px',
          width: '140px', height: '140px', borderRadius: '50%',
          background: 'rgba(162,89,255,0.15)', pointerEvents: 'none',
        }} />

        <div style={{
          width: '64px', height: '64px', borderRadius: '50%',
          background: avatarBg(user?.name),
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontSize: '22px', fontWeight: 700,
          flexShrink: 0, border: '3px solid rgba(255,255,255,0.2)',
          overflow: 'hidden',
        }}>
          {user?.profileImage
            ? <img src={user.profileImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
            : getInitials(user?.name)
          }
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontWeight: 600,
            letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>
            Dashboard
          </p>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '28px', fontWeight: 900, color: 'white', lineHeight: 1.2,
          }}>
            Welcome back, {user?.name?.split(' ')[0]}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', marginTop: '4px' }}>
            {user?.email}
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))',
        gap: '16px', marginBottom: '32px',
      }}>
        <StatCard label="My Blogs"    value={myBlogs.length}   color="#5b4de8" icon="https://cdn-icons-png.flaticon.com/20/1584/1584942.png" />
        <StatCard label="Liked"       value={likedBlogs.length} color="#ff5c57" icon="https://cdn-icons-png.flaticon.com/20/2589/2589175.png" />
        <StatCard label="Saved"       value={savedBlogs.length} color="#f5a623" icon="https://cdn-icons-png.flaticon.com/20/2099/2099183.png" />
        <StatCard label="Total Views" value={myBlogs.reduce((s, b) => s + (b.views || 0), 0)} color="#00b4a6" icon="https://cdn-icons-png.flaticon.com/20/709/709612.png" />
      </div>

      {/* Tabs */}
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
              fontSize: '13px', fontWeight: 600, transition: 'all 0.18s',
              border: 'none',
              background: active ? 'var(--accent)' : 'transparent',
              color: active ? 'white' : 'var(--ink-muted)',
              boxShadow: active ? '0 3px 12px rgba(91,77,232,0.3)' : 'none',
            }}>
              <img src={tab.icon} alt="" width="14"
                style={{ opacity: active ? 1 : 0.5, filter: active ? 'brightness(10)' : 'none' }} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* My Blogs */}
      {activeTab === 'myblogs' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', fontWeight: 700, color: 'var(--ink)' }}>
              Your Stories
              <span style={{
                marginLeft: '10px', background: 'var(--accent-light)', color: 'var(--accent)',
                borderRadius: '999px', padding: '2px 10px', fontSize: '13px', fontWeight: 700,
              }}>{myBlogs.length}</span>
            </h2>
            <button className="btn btn-primary" onClick={() => navigate('/create')}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <img src="https://cdn-icons-png.flaticon.com/16/1828/1828919.png" alt="" width="13"
                style={{ filter: 'brightness(10)' }} />
              Write New Blog
            </button>
          </div>

          {myBlogs.length === 0
            ? <EmptyState message="You haven't written any blogs yet" icon="https://cdn-icons-png.flaticon.com/64/4076/4076432.png" />
            : myBlogs.map(blog => (
              <BlogRow key={blog._id} blog={blog} showActions
                onClick={() => navigate('/blog/' + blog._id)}
                onEdit={() => navigate('/edit/' + blog._id)}
                onDelete={() => handleDelete(blog._id)}
              />
            ))
          }
        </div>
      )}

      {/* Liked */}
      {activeTab === 'liked' && (
        <div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', fontWeight: 700, color: 'var(--ink)', marginBottom: '20px' }}>
            Liked Stories
            <span style={{
              marginLeft: '10px', background: '#fff0f0', color: 'var(--coral)',
              borderRadius: '999px', padding: '2px 10px', fontSize: '13px', fontWeight: 700,
            }}>{likedBlogs.length}</span>
          </h2>
          {likedBlogs.length === 0
            ? <EmptyState message="You haven't liked any blogs yet" icon="https://cdn-icons-png.flaticon.com/64/2589/2589175.png" />
            : likedBlogs.map(blog => (
              <BlogRow key={blog._id} blog={blog}
                onClick={() => navigate('/blog/' + blog._id)} />
            ))
          }
        </div>
      )}

      {/* Saved */}
      {activeTab === 'saved' && (
        <div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', fontWeight: 700, color: 'var(--ink)', marginBottom: '20px' }}>
            Saved Stories
            <span style={{
              marginLeft: '10px', background: '#fff8e6', color: 'var(--amber)',
              borderRadius: '999px', padding: '2px 10px', fontSize: '13px', fontWeight: 700,
            }}>{savedBlogs.length}</span>
          </h2>
          {savedBlogs.length === 0
            ? <EmptyState message="You haven't saved any blogs yet" icon="https://cdn-icons-png.flaticon.com/64/2099/2099183.png" />
            : savedBlogs.map(blog => (
              <BlogRow key={blog._id} blog={blog}
                onClick={() => navigate('/blog/' + blog._id)} />
            ))
          }
        </div>
      )}

      {/* Profile */}
      {activeTab === 'profile' && <ProfileEdit user={user} />}
    </div>
  )
}

/* ─────────────────────────────────────── */

const ProfileEdit = ({ user }) => {
  const { login } = useAuth()
  const fileRef = useRef()
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [profileImage, setProfileImage] = useState('')
  const [profileImageFile, setProfileImageFile] = useState(null)
  const [profileImagePreview, setProfileImagePreview] = useState('')
  const [twitter, setTwitter] = useState('')
  const [instagram, setInstagram] = useState('')
  const [linkedin, setLinkedin] = useState('')
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    API.get('/auth/profile/' + user.id).then(res => {
      const u = res.data.user
      setName(u.name || '')
      setBio(u.bio || '')
      setProfileImage(u.profileImage || '')
      setProfileImagePreview(u.profileImage || '')
      setTwitter(u.socialLinks?.twitter || '')
      setInstagram(u.socialLinks?.instagram || '')
      setLinkedin(u.socialLinks?.linkedin || '')
    })
  }, [])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setProfileImageFile(file)
    setProfileImagePreview(URL.createObjectURL(file))
  }

  const uploadProfileImage = async () => {
    if (!profileImageFile) return profileImage
    const formData = new FormData()
    formData.append('image', profileImageFile)
    const res = await API.post('/auth/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return res.data.imageUrl
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSuccess(''); setError(''); setLoading(true)
    try {
      let imageUrl = profileImage
      if (profileImageFile) imageUrl = await uploadProfileImage()
      await API.put('/auth/profile', {
        name, bio, profileImage: imageUrl,
        socialLinks: { twitter, instagram, linkedin }
      })
      setProfileImage(imageUrl)
      setProfileImagePreview(imageUrl)
      setProfileImageFile(null)

      // Update AuthContext so navbar and header refresh
      login({ ...user, name, profileImage: imageUrl })

      setSuccess('Profile updated successfully')
    } catch {
      setError('Failed to update profile')
    }
    setLoading(false)
  }

  const socialFields = [
    { label: 'Twitter / X', val: twitter, set: setTwitter, placeholder: 'https://twitter.com/username', icon: 'https://cdn-icons-png.flaticon.com/16/5968/5968830.png', color: '#1da1f2' },
    { label: 'Instagram',   val: instagram, set: setInstagram, placeholder: 'https://instagram.com/username', icon: 'https://cdn-icons-png.flaticon.com/16/2111/2111463.png', color: '#e1306c' },
    { label: 'LinkedIn',    val: linkedin, set: setLinkedin,   placeholder: 'https://linkedin.com/in/username', icon: 'https://cdn-icons-png.flaticon.com/16/174/174857.png', color: '#0077b5' },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }}>

      {/* Left: avatar + basic info */}
      <div style={{
        background: 'white', borderRadius: '18px', padding: '30px',
        border: '1.5px solid var(--border)', boxShadow: 'var(--shadow-sm)',
      }}>
        <h3 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '18px', fontWeight: 700, color: 'var(--ink)',
          marginBottom: '24px', paddingBottom: '16px',
          borderBottom: '1.5px solid var(--border)',
        }}>
          Edit Profile
        </h3>

        {success && <div className="alert alert-success">{success}</div>}
        {error   && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Avatar upload */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '28px' }}>
            <div style={{
              width: '96px', height: '96px', borderRadius: '50%',
              background: avatarBg(user?.name),
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontSize: '30px', fontWeight: 700,
              overflow: 'hidden', cursor: 'pointer', marginBottom: '14px',
              border: '3px solid var(--accent-light)',
              boxShadow: '0 0 0 4px rgba(91,77,232,0.1)',
              transition: 'box-shadow 0.2s',
            }} onClick={() => fileRef.current.click()}>
              {profileImagePreview
                ? <img src={profileImagePreview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
                : getInitials(user?.name)
              }
            </div>
            <button type="button" onClick={() => fileRef.current.click()} style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '7px 18px', borderRadius: '999px', cursor: 'pointer',
              fontSize: '12px', fontWeight: 600,
              border: '1.5px solid var(--accent)', background: 'white', color: 'var(--accent)',
            }}>
              <img src="https://cdn-icons-png.flaticon.com/16/1665/1665680.png" alt="" width="12" />
              Change Photo
            </button>
            <p style={{ fontSize: '11px', color: 'var(--ink-muted)', marginTop: '6px' }}>JPG, PNG · max 5MB</p>
            <input type="file" ref={fileRef} onChange={handleImageChange} accept="image/*" style={{ display: 'none' }} />
          </div>

          <div className="form-group">
            <label>Full Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>Bio</label>
            <textarea value={bio} onChange={e => setBio(e.target.value)} rows={4} placeholder="Tell readers about yourself…" />
          </div>

          <button type="submit" className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
            {loading ? 'Saving…' : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* Right: social links */}
      <div style={{
        background: 'white', borderRadius: '18px', padding: '30px',
        border: '1.5px solid var(--border)', boxShadow: 'var(--shadow-sm)',
      }}>
        <h3 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '18px', fontWeight: 700, color: 'var(--ink)',
          marginBottom: '24px', paddingBottom: '16px',
          borderBottom: '1.5px solid var(--border)',
        }}>
          Social Links
        </h3>

        {socialFields.map(({ label, val, set, placeholder, icon, color }) => (
          <div key={label} className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <img src={icon} alt="" width="13" style={{ filter: 'none' }} />
              {label}
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text" value={val}
                onChange={e => set(e.target.value)}
                placeholder={placeholder}
                style={{ paddingLeft: '38px' }}
              />
              <img src={icon} alt="" width="14"
                style={{
                  position: 'absolute', left: '13px', top: '50%',
                  transform: 'translateY(-50%)', opacity: 0.5,
                }} />
            </div>
          </div>
        ))}

        <div style={{ marginTop: '10px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {twitter   && <a href={twitter}   target="_blank" rel="noopener noreferrer" style={{ padding: '5px 14px', borderRadius: '999px', fontSize: '12px', fontWeight: 600, background: '#e8f5fe', color: '#1da1f2', textDecoration: 'none' }}>Twitter</a>}
          {instagram && <a href={instagram} target="_blank" rel="noopener noreferrer" style={{ padding: '5px 14px', borderRadius: '999px', fontSize: '12px', fontWeight: 600, background: '#fce4ec', color: '#e1306c', textDecoration: 'none' }}>Instagram</a>}
          {linkedin  && <a href={linkedin}  target="_blank" rel="noopener noreferrer" style={{ padding: '5px 14px', borderRadius: '999px', fontSize: '12px', fontWeight: 600, background: '#e3f2fd', color: '#0077b5', textDecoration: 'none' }}>LinkedIn</a>}
        </div>
      </div>
    </div>
  )
}

export default Dashboard