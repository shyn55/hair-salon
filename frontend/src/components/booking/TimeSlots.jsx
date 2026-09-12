import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { fetchAvailability } from '../../api';

const TimeSlots = ({ date, serviceId, onSelect, selectedTime }) => {
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!date || !serviceId) return;

        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const formatDate = (d) => {
                    const y = d.getFullYear();
                    const m = String(d.getMonth() + 1).padStart(2, '0');
                    const day = String(d.getDate()).padStart(2, '0');
                    return `${y}-${m}-${day}`;
                };
                const res = await fetchAvailability(formatDate(date), serviceId);
                setSlots(res.data?.slots || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [date, serviceId]);

    if (loading) {
        return (
            <div aria-busy="true" aria-label="در حال بارگذاری ساعت‌ها" style={{ height: '100%', overflowY: 'auto', paddingBottom: 100 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                    <Clock size={20} color="#D4AF37" />
                    <h3 style={{ fontSize: '16px', color: '#F7F5F0', margin: 0 }}>انتخاب ساعت</h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                    {[1,2,3,4,5,6].map(i => (
                        <div key={i} className="shimmer" style={{ borderRadius: '12px', height: '44px' }} />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: '#E74C3C', fontSize: '14px' }}>{error}</p>
            </div>
        );
    }

    if (slots.length === 0) {
        return (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                <Clock size={32} color="#A3A099" />
                <p style={{ color: '#A3A099', fontSize: '14px' }}>ساعت خالی برای این تاریخ وجود ندارد</p>
                <p style={{ color: '#666', fontSize: '12px' }}>تاریخ دیگری انتخاب کنید</p>
            </div>
        );
    }

    return (
        <div style={{ height: '100%', overflowY: 'auto', paddingBottom: '100px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <Clock size={20} color="#D4AF37" />
                <h3 style={{ fontSize: '16px', color: '#F7F5F0', margin: 0 }}>انتخاب ساعت</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                {slots.map((time) => {
                    const selected = selectedTime === time;
                    return (
                        <button
                            key={time}
                            role="radio"
                            aria-checked={selected}
                            aria-label={`ساعت ${time}`}
                            onClick={() => onSelect(time)}
                            style={{
                                backgroundColor: selected ? '#D4AF37' : '#232325',
                                borderRadius: '12px',
                                padding: '14px 8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                border: selected ? 'none' : '1px solid rgba(255,255,255,0.03)',
                                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                                color: selected ? '#1A1A1C' : '#F7F5F0',
                                fontSize: '14px',
                                fontWeight: 500,
                                fontFamily: 'inherit',
                                direction: 'ltr',
                                WebkitTapHighlightColor: 'transparent'
                            }}
                        >
                            {time}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default TimeSlots;
