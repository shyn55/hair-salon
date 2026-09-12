import React, { useState } from 'react';
import Login from './Login';
import Dashboard from './Dashboard';
import Bookings from './Bookings';
import Services from './Services';
import Gallery from './Gallery';
import Staff from './Staff';
import Settings from './Settings';

const MENU = [
    { id: 'dashboard', label: 'Dashboard', icon: '\u25A6' },
    { id: 'bookings', label: 'Bookings', icon: '\u2611' },
    { id: 'services', label: 'Services', icon: '\u2702' },
    { id: 'gallery', label: 'Gallery', icon: '\u25A3' },
    { id: 'staff', label: 'Staff', icon: '\u260E' },
    { id: 'settings', label: 'Settings', icon: '\u2699' },
];

const pages = {
    dashboard: Dashboard,
    bookings: Bookings,
    services: Services,
    gallery: Gallery,
    staff: Staff,
    settings: Settings,
};

const AdminApp = () => {
    const [token, setToken] = useState(localStorage.getItem('admin_token'));
    const [page, setPage] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(true);

    if (!token) return <Login onLogin={(t) => { localStorage.setItem('admin_token', t); setToken(t); }} />;

    const Page = pages[page] || Dashboard;

    return (
        <div style={{ display: 'flex', height: '100vh', backgroundColor: '#0a0a0b', color: '#e5e7eb', fontFamily: 'Inter, sans-serif' }}>
            {/* Sidebar */}
            <aside style={{ width: sidebarOpen ? '240px' : '60px', backgroundColor: '#111113', borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', transition: 'width 0.3s', overflow: 'hidden', flexShrink: 0 }}>
                <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', color: '#D4AF37', fontSize: '20px', cursor: 'pointer' }}>\u2630</button>
                    {sidebarOpen && <span style={{ fontSize: '14px', fontWeight: 600, color: '#D4AF37' }}>Admin Panel</span>}
                </div>
                <nav style={{ flex: 1, padding: '8px' }}>
                    {MENU.map(item => (
                        <div key={item.id} onClick={() => setPage(item.id)}
                            style={{ padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: page === item.id ? 'rgba(212,175,55,0.12)' : 'transparent', color: page === item.id ? '#D4AF37' : '#888', fontSize: '13px', transition: 'all 0.15s' }}>
                            <span style={{ fontSize: '16px', width: '24px', textAlign: 'center' }}>{item.icon}</span>
                            {sidebarOpen && <span>{item.label}</span>}
                        </div>
                    ))}
                </nav>
                <div style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <div onClick={() => { localStorage.removeItem('admin_token'); setToken(null); }}
                        style={{ padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', color: '#ef4444', fontSize: '13px' }}>
                        <span style={{ fontSize: '16px', width: '24px', textAlign: 'center' }}>\u2190</span>
                        {sidebarOpen && <span>Logout</span>}
                    </div>
                </div>
            </aside>

            {/* Main */}
            <main style={{ flex: 1, overflowY: 'auto' }}>
                <Page />
            </main>
        </div>
    );
};

export default AdminApp;
