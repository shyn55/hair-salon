import React, { useEffect, useState } from 'react';
import { fetchSettings, updateSettings, fetchProfile, updateProfile, fetchSocialLinks, addSocialLink, deleteSocialLink } from '../api';

const Settings = () => {
    const [settings, setSettings] = useState({});
    const [profile, setProfile] = useState({});
    const [socialLinks, setSocialLinks] = useState([]);
    const [saved, setSaved] = useState(false);
    const [newLink, setNewLink] = useState({ platform: 'instagram', url: '', label: '' });

    useEffect(() => {
        fetchSettings().then(r => setSettings(r.data || {})).catch(() => {});
        fetchProfile().then(r => setProfile(r.data || {})).catch(() => {});
        fetchSocialLinks().then(r => setSocialLinks(r.data || [])).catch(() => {});
    }, []);

    const saveProfile = async () => {
        await updateProfile(profile);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const saveSettings = async () => {
        await updateSettings(settings);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleAddLink = async () => {
        if (!newLink.url) return;
        await addSocialLink(newLink);
        setNewLink({ platform: 'instagram', url: '', label: '' });
        fetchSocialLinks().then(r => setSocialLinks(r.data || [])).catch(() => {});
    };

    const handleDeleteLink = async (id) => {
        await deleteSocialLink(id);
        fetchSocialLinks().then(r => setSocialLinks(r.data || [])).catch(() => {});
    };

    const inputStyle = { padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: '#1e1e20', color: '#F7F5F0', fontSize: '13px', outline: 'none', width: '100%' };
    const labelStyle = { fontSize: '12px', color: '#888', marginBottom: '4px' };

    return (
        <div style={{ padding: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '20px', color: '#F7F5F0', margin: 0 }}>Settings</h2>
                {saved && <span style={{ color: '#10b981', fontSize: '13px' }}>Saved!</span>}
            </div>

            {/* Profile */}
            <div style={{ backgroundColor: '#1e1e20', borderRadius: '12px', padding: '20px', marginBottom: '20px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <h3 style={{ fontSize: '14px', color: '#D4AF37', marginBottom: '16px' }}>Profile</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    {[
                        { key: 'firstName', label: 'First Name' },
                        { key: 'lastName', label: 'Last Name' },
                        { key: 'title', label: 'Title' },
                        { key: 'phone', label: 'Phone' },
                        { key: 'email', label: 'Email' },
                        { key: 'address', label: 'Address' },
                        { key: 'googleMapsUrl', label: 'Google Maps URL' },
                        { key: 'avatar', label: 'Avatar URL' },
                        { key: 'heroImage', label: 'Hero Image URL' },
                    ].map(f => (
                        <div key={f.key}>
                            <p style={labelStyle}>{f.label}</p>
                            <input value={profile[f.key] || ''} onChange={e => setProfile({...profile, [f.key]: e.target.value})} style={inputStyle} />
                        </div>
                    ))}
                    <div style={{ gridColumn: '1 / -1' }}>
                        <p style={labelStyle}>Bio</p>
                        <textarea value={profile.bio || ''} onChange={e => setProfile({...profile, bio: e.target.value})} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                        <p style={labelStyle}>Working Hours Note</p>
                        <input value={profile.workingHoursNote || ''} onChange={e => setProfile({...profile, workingHoursNote: e.target.value})} style={inputStyle} />
                    </div>
                </div>
                <button onClick={saveProfile} style={{ marginTop: '12px', padding: '10px 24px', borderRadius: '8px', border: 'none', backgroundColor: '#D4AF37', color: '#1A1A1C', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>Save Profile</button>
            </div>

            {/* Social Links */}
            <div style={{ backgroundColor: '#1e1e20', borderRadius: '12px', padding: '20px', marginBottom: '20px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <h3 style={{ fontSize: '14px', color: '#D4AF37', marginBottom: '16px' }}>Social Links</h3>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                    <select value={newLink.platform} onChange={e => setNewLink({...newLink, platform: e.target.value})} style={{ ...inputStyle, width: '120px' }}>
                        {['instagram','whatsapp','telegram','phone','email'].map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                    <input value={newLink.url} onChange={e => setNewLink({...newLink, url: e.target.value})} placeholder="URL" style={{ ...inputStyle, flex: 2 }} />
                    <input value={newLink.label} onChange={e => setNewLink({...newLink, label: e.target.value})} placeholder="Label" style={{ ...inputStyle, flex: 1 }} />
                    <button onClick={handleAddLink} style={{ padding: '10px 16px', borderRadius: '8px', border: 'none', backgroundColor: '#10b981', color: '#fff', cursor: 'pointer', fontSize: '13px' }}>Add</button>
                </div>
                {socialLinks.map(link => (
                    <div key={link.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <span style={{ fontSize: '12px', color: '#D4AF37', width: '80px' }}>{link.platform}</span>
                        <span style={{ fontSize: '13px', color: '#A3A099', flex: 1 }}>{link.url}</span>
                        <button onClick={() => handleDeleteLink(link.id)} style={{ padding: '4px 8px', borderRadius: '6px', border: 'none', backgroundColor: '#ef444420', color: '#ef4444', fontSize: '11px', cursor: 'pointer' }}>Delete</button>
                    </div>
                ))}
            </div>

            {/* Site Settings */}
            <div style={{ backgroundColor: '#1e1e20', borderRadius: '12px', padding: '20px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <h3 style={{ fontSize: '14px', color: '#D4AF37', marginBottom: '16px' }}>Site Settings</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    {Object.entries(settings).map(([key, value]) => (
                        <div key={key}>
                            <p style={labelStyle}>{key.replace(/_/g, ' ')}</p>
                            <input value={value} onChange={e => setSettings({...settings, [key]: e.target.value})} style={inputStyle} />
                        </div>
                    ))}
                </div>
                <button onClick={saveSettings} style={{ marginTop: '12px', padding: '10px 24px', borderRadius: '8px', border: 'none', backgroundColor: '#6366f1', color: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>Save Settings</button>
            </div>
        </div>
    );
};

export default Settings;
