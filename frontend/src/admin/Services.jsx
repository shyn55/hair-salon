import React, { useEffect, useState } from 'react';
import { fetchAllServices, createService, updateService, deleteService, fetchAllCategories, createCategory } from '../api';

const Services = () => {
    const [services, setServices] = useState([]);
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({ title: '', description: '', duration: 45, price: 0, categoryId: '', isActive: true });
    const [editingId, setEditingId] = useState(null);
    const [catForm, setCatForm] = useState({ name: '', gender: 'male' });

    const load = () => {
        fetchAllServices().then(r => setServices(r.data || [])).catch(() => {});
        fetchAllCategories().then(r => setCategories(r.data || [])).catch(() => {});
    };
    useEffect(() => { load(); }, []);

    const handleSubmit = async () => {
        if (!form.title || !form.categoryId) return;
        if (editingId) { await updateService(editingId, form); setEditingId(null); }
        else { await createService(form); }
        setForm({ title: '', description: '', duration: 45, price: 0, categoryId: '', isActive: true });
        load();
    };

    const handleEdit = (s) => { setForm({ title: s.title, description: s.description || '', duration: s.duration, price: s.price, categoryId: s.categoryId, isActive: s.isActive }); setEditingId(s.id); };
    const handleDelete = async (id) => { if (confirm('Delete?')) { await deleteService(id); load(); } };
    const handleAddCategory = async () => { if (!catForm.name) return; await createCategory(catForm); setCatForm({ name: '', gender: 'male' }); load(); };

    const inputStyle = { padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: '#1e1e20', color: '#F7F5F0', fontSize: '13px', outline: 'none', width: '100%' };
    const btnStyle = { padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600 };

    return (
        <div style={{ padding: '30px' }}>
            <h2 style={{ fontSize: '20px', color: '#F7F5F0', marginBottom: '20px' }}>Services</h2>

            {/* Add Category */}
            <div style={{ backgroundColor: '#1e1e20', borderRadius: '12px', padding: '20px', marginBottom: '20px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <h3 style={{ fontSize: '14px', color: '#D4AF37', marginBottom: '12px' }}>Add Category</h3>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input value={catForm.name} onChange={e => setCatForm({...catForm, name: e.target.value})} placeholder="Category name" style={{ ...inputStyle, width: '200px' }} />
                    <select value={catForm.gender} onChange={e => setCatForm({...catForm, gender: e.target.value})} style={{ ...inputStyle, width: '120px' }}>
                        <option value="male">Male</option><option value="female">Female</option><option value="unisex">Unisex</option>
                    </select>
                    <button onClick={handleAddCategory} style={{ ...btnStyle, backgroundColor: '#D4AF37', color: '#1A1A1C' }}>Add</button>
                </div>
            </div>

            {/* Add/Edit Service */}
            <div style={{ backgroundColor: '#1e1e20', borderRadius: '12px', padding: '20px', marginBottom: '20px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <h3 style={{ fontSize: '14px', color: '#D4AF37', marginBottom: '12px' }}>{editingId ? 'Edit Service' : 'Add Service'}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 100px 120px 1fr', gap: '10px', alignItems: 'center' }}>
                    <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Title" style={inputStyle} />
                    <select value={form.categoryId} onChange={e => setForm({...form, categoryId: e.target.value})} style={inputStyle}>
                        <option value="">Category</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <input type="number" value={form.duration} onChange={e => setForm({...form, duration: parseInt(e.target.value) || 0})} placeholder="Min" style={inputStyle} />
                    <input type="number" value={form.price} onChange={e => setForm({...form, price: parseInt(e.target.value) || 0})} placeholder="Price" style={inputStyle} />
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={handleSubmit} style={{ ...btnStyle, backgroundColor: editingId ? '#f59e0b' : '#10b981', color: '#fff', flex: 1 }}>{editingId ? 'Update' : 'Add'}</button>
                        {editingId && <button onClick={() => { setEditingId(null); setForm({ title: '', description: '', duration: 45, price: 0, categoryId: '', isActive: true }); }} style={{ ...btnStyle, backgroundColor: '#333', color: '#fff' }}>Cancel</button>}
                    </div>
                </div>
            </div>

            {/* Services List */}
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                            {['Title', 'Category', 'Duration', 'Price', 'Active', 'Actions'].map(h => (
                                <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: '12px', color: '#888', fontWeight: 500 }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {services.map(s => (
                            <tr key={s.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                <td style={{ padding: '10px 12px', fontSize: '13px', color: '#F7F5F0' }}>{s.title}</td>
                                <td style={{ padding: '10px 12px', fontSize: '13px', color: '#A3A099' }}>{s.category?.name}</td>
                                <td style={{ padding: '10px 12px', fontSize: '13px', color: '#A3A099' }}>{s.duration}m</td>
                                <td style={{ padding: '10px 12px', fontSize: '13px', color: '#D4AF37' }}>{s.price?.toLocaleString()}</td>
                                <td style={{ padding: '10px 12px', fontSize: '13px', color: s.isActive ? '#10b981' : '#ef4444' }}>{s.isActive ? 'Yes' : 'No'}</td>
                                <td style={{ padding: '10px 12px' }}>
                                    <div style={{ display: 'flex', gap: '4px' }}>
                                        <button onClick={() => handleEdit(s)} style={{ padding: '4px 8px', borderRadius: '6px', border: 'none', backgroundColor: '#6366f120', color: '#6366f1', fontSize: '11px', cursor: 'pointer' }}>Edit</button>
                                        <button onClick={() => updateService(s.id, { isActive: !s.isActive }).then(load)} style={{ padding: '4px 8px', borderRadius: '6px', border: 'none', backgroundColor: '#f59e0b20', color: '#f59e0b', fontSize: '11px', cursor: 'pointer' }}>{s.isActive ? 'Disable' : 'Enable'}</button>
                                        <button onClick={() => handleDelete(s.id)} style={{ padding: '4px 8px', borderRadius: '6px', border: 'none', backgroundColor: '#ef444420', color: '#ef4444', fontSize: '11px', cursor: 'pointer' }}>Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Services;
