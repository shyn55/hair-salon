import React, { useEffect, useState } from 'react';
import { fetchAllBookings, updateBookingStatus } from '../api';

const STATUS_COLORS = {
    CONFIRMED: '#10b981',
    PENDING: '#f59e0b',
    COMPLETED: '#6366f1',
    CANCELLED: '#ef4444',
    NO_SHOW: '#888',
};

const Bookings = () => {
    const [bookings, setBookings] = useState([]);
    const [filter, setFilter] = useState('');
    const [loading, setLoading] = useState(true);

    const load = () => {
        setLoading(true);
        fetchAllBookings({ status: filter || undefined, limit: 50 })
            .then(r => setBookings(r.data || []))
            .catch(() => {})
            .finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, [filter]);

    const handleStatus = async (id, status) => {
        await updateBookingStatus(id, status);
        load();
    };

    const filters = [
        { value: '', label: 'All' },
        { value: 'CONFIRMED', label: 'Confirmed' },
        { value: 'PENDING', label: 'Pending' },
        { value: 'COMPLETED', label: 'Completed' },
        { value: 'CANCELLED', label: 'Cancelled' },
    ];

    return (
        <div style={{ padding: '30px' }}>
            <h2 style={{ fontSize: '20px', color: '#F7F5F0', marginBottom: '20px' }}>Bookings</h2>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
                {filters.map(f => (
                    <button key={f.value} onClick={() => setFilter(f.value)}
                        style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', backgroundColor: filter === f.value ? '#6366f1' : '#1e1e20', color: filter === f.value ? '#fff' : '#888' }}>
                        {f.label}
                    </button>
                ))}
            </div>

            {loading ? <p style={{ color: '#888' }}>Loading...</p> : bookings.length === 0 ? (
                <p style={{ color: '#666' }}>No bookings found</p>
            ) : (
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                                {['Customer', 'Phone', 'Service', 'Date', 'Time', 'Price', 'Status', 'Actions'].map(h => (
                                    <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: '12px', color: '#888', fontWeight: 500 }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map(b => (
                                <tr key={b.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                    <td style={{ padding: '10px 12px', fontSize: '13px', color: '#F7F5F0' }}>{b.customer}</td>
                                    <td style={{ padding: '10px 12px', fontSize: '13px', color: '#A3A099', direction: 'ltr' }}>{b.phone}</td>
                                    <td style={{ padding: '10px 12px', fontSize: '13px', color: '#A3A099' }}>{b.service?.title}</td>
                                    <td style={{ padding: '10px 12px', fontSize: '13px', color: '#A3A099' }}>{new Date(b.date).toLocaleDateString('fa-IR')}</td>
                                    <td style={{ padding: '10px 12px', fontSize: '13px', color: '#A3A099', direction: 'ltr' }}>{b.startTime}</td>
                                    <td style={{ padding: '10px 12px', fontSize: '13px', color: '#D4AF37' }}>{b.price?.toLocaleString()}</td>
                                    <td style={{ padding: '10px 12px' }}>
                                        <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 600, backgroundColor: STATUS_COLORS[b.status] + '20', color: STATUS_COLORS[b.status] }}>{b.status}</span>
                                    </td>
                                    <td style={{ padding: '10px 12px' }}>
                                        <div style={{ display: 'flex', gap: '4px' }}>
                                            {b.status === 'PENDING' && <button onClick={() => handleStatus(b.id, 'CONFIRMED')} style={{ padding: '4px 8px', borderRadius: '6px', border: 'none', backgroundColor: '#10b98120', color: '#10b981', fontSize: '11px', cursor: 'pointer' }}>Confirm</button>}
                                            {(b.status === 'CONFIRMED' || b.status === 'PENDING') && <button onClick={() => handleStatus(b.id, 'CANCELLED')} style={{ padding: '4px 8px', borderRadius: '6px', border: 'none', backgroundColor: '#ef444420', color: '#ef4444', fontSize: '11px', cursor: 'pointer' }}>Cancel</button>}
                                            {b.status === 'CONFIRMED' && <button onClick={() => handleStatus(b.id, 'COMPLETED')} style={{ padding: '4px 8px', borderRadius: '6px', border: 'none', backgroundColor: '#6366f120', color: '#6366f1', fontSize: '11px', cursor: 'pointer' }}>Complete</button>}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Bookings;
