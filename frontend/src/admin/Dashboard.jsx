import React, { useEffect, useState } from 'react';
import { fetchDashboardStats } from '../api';

const StatCard = ({ label, value, color }) => (
    <div style={{ backgroundColor: '#1e1e20', borderRadius: '12px', padding: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
        <p style={{ fontSize: '12px', color: '#888', margin: '0 0 6px' }}>{label}</p>
        <p style={{ fontSize: '24px', fontWeight: 700, color: color || '#F7F5F0', margin: 0 }}>{value}</p>
    </div>
);

const Dashboard = () => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        fetchDashboardStats().then(r => setStats(r.data)).catch(() => {});
    }, []);

    if (!stats) return <div style={{ padding: '40px', color: '#888' }}>Loading...</div>;

    return (
        <div style={{ padding: '30px' }}>
            <h2 style={{ fontSize: '20px', color: '#F7F5F0', marginBottom: '20px' }}>Dashboard</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                <StatCard label="Today's Bookings" value={stats.todayBookings} color="#10b981" />
                <StatCard label="Total Bookings" value={stats.totalBookings} color="#6366f1" />
                <StatCard label="Pending" value={stats.pendingBookings} color="#f59e0b" />
                <StatCard label="Active Services" value={stats.totalServices} color="#D4AF37" />
                <StatCard label="Today's Revenue" value={`${(stats.todayRevenue || 0).toLocaleString()}`} color="#10b981" />
                <StatCard label="Total Revenue" value={`${(stats.totalRevenue || 0).toLocaleString()}`} color="#6366f1" />
            </div>
        </div>
    );
};

export default Dashboard;
