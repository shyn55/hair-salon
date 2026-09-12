import React, { useEffect, useState } from 'react';
import { fetchGallery, createGalleryItem, updateGalleryItem, deleteGalleryItem } from '../api';

const Gallery = () => {
    const [items, setItems] = useState([]);
    const [form, setForm] = useState({ imageUrl: '', title: '', category: 'all' });
    const [editingId, setEditingId] = useState(null);

    const load = () => { fetchGallery().then(r => setItems(r.data || [])).catch(() => {}); };
    useEffect(() => { load(); }, []);

    const handleSubmit = async () => {
        if (!form.imageUrl) return;
        if (editingId) { await updateGalleryItem(editingId, form); setEditingId(null); }
        else { await createGalleryItem(form); }
        setForm({ imageUrl: '', title: '', category: 'all' });
        load();
    };

    const handleDelete = async (id) => { if (confirm('Delete?')) { await deleteGalleryItem(id); load(); } };

    const inputStyle = { padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: '#1e1e20', color: '#F7F5F0', fontSize: '13px', outline: 'none' };

    return (
        <div style={{ padding: '30px' }}>
            <h2 style={{ fontSize: '20px', color: '#F7F5F0', marginBottom: '20px' }}>Gallery</h2>

            <div style={{ backgroundColor: '#1e1e20', borderRadius: '12px', padding: '20px', marginBottom: '20px', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input value={form.imageUrl} onChange={e => setForm({...form, imageUrl: e.target.value})} placeholder="Image URL" style={{ ...inputStyle, flex: 2 }} />
                <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Title" style={{ ...inputStyle, flex: 1 }} />
                <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} style={{ ...inputStyle, flex: 1 }}>
                    {['all','men','women','color','cut','style'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <button onClick={handleSubmit} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: editingId ? '#f59e0b' : '#10b981', color: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>{editingId ? 'Update' : 'Add'}</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                {items.map(item => (
                    <div key={item.id} style={{ backgroundColor: '#1e1e20', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <div style={{ aspectRatio: '1', backgroundColor: '#2a2a2c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <img src={item.imageUrl} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={{ padding: '12px' }}>
                            <p style={{ fontSize: '13px', color: '#F7F5F0', margin: 0 }}>{item.title || 'No title'}</p>
                            <p style={{ fontSize: '11px', color: '#888', margin: '4px 0 8px' }}>{item.category}</p>
                            <div style={{ display: 'flex', gap: '4px' }}>
                                <button onClick={() => { setForm({ imageUrl: item.imageUrl, title: item.title || '', category: item.category }); setEditingId(item.id); }} style={{ padding: '4px 8px', borderRadius: '6px', border: 'none', backgroundColor: '#6366f120', color: '#6366f1', fontSize: '11px', cursor: 'pointer' }}>Edit</button>
                                <button onClick={() => updateGalleryItem(item.id, { isActive: !item.isActive }).then(load)} style={{ padding: '4px 8px', borderRadius: '6px', border: 'none', backgroundColor: '#f59e0b20', color: '#f59e0b', fontSize: '11px', cursor: 'pointer' }}>{item.isActive ? 'Hide' : 'Show'}</button>
                                <button onClick={() => handleDelete(item.id)} style={{ padding: '4px 8px', borderRadius: '6px', border: 'none', backgroundColor: '#ef444420', color: '#ef4444', fontSize: '11px', cursor: 'pointer' }}>Delete</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Gallery;
