import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { fetchDayStatus } from '../../api';

const DAY_NAMES = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'];

const STATUS_STYLES = {
    available: { bg: '#10b981', dotColor: '#10b981' },
    limited: { bg: '#f59e0b', dotColor: '#f59e0b' },
    booked: { bg: '#ef4444', dotColor: '#ef4444' },
    closed: { bg: '#555', dotColor: '#555' },
    past: { bg: '#333', dotColor: '' },
    loading: { bg: '#232325', dotColor: '' },
};

const DateSelector = ({ onSelect, selectedDate, serviceId }) => {
    const [statuses, setStatuses] = useState({});
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dates = [];
    for (let i = 0; i < 14; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        dates.push(d);
    }

    useEffect(() => {
        dates.forEach(date => {
            const key = formatDate(date);
            setStatuses(prev => ({ ...prev, [key]: 'loading' }));
            fetchDayStatus(key, serviceId).then(r => {
                setStatuses(prev => ({ ...prev, [key]: r.data?.status || 'closed' }));
            }).catch(() => {
                setStatuses(prev => ({ ...prev, [key]: 'closed' }));
            });
        });
    }, [serviceId]);

    const formatDate = (date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
    };

    const isDisabled = (date) => {
        const key = formatDate(date);
        const s = statuses[key];
        if (!s || s === 'loading') return false; // allow selection while loading
        return s === 'past' || s === 'closed' || s === 'booked';
    };

    return (
        <div style={{ height: '100%', overflowY: 'auto', paddingBottom: '100px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <Calendar size={20} color="#D4AF37" />
                <h3 style={{ fontSize: '16px', color: '#F7F5F0', margin: 0 }}>انتخاب تاریخ</h3>
            </div>

            {/* Legend */}
            <div role="status" aria-label="راهنمای وضعیت تقویم" style={{ display: 'flex', gap: '12px', marginBottom: '15px', flexWrap: 'wrap' }}>
                {[
                    { status: 'available', label: 'آزاد' },
                    { status: 'limited', label: 'محدود' },
                    { status: 'booked', label: 'تمام' },
                    { status: 'closed', label: 'بسته' },
                ].map(({ status, label }) => (
                    <div key={status} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: '#888' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: STATUS_STYLES[status].dotColor, display: 'inline-block' }} />
                        <span>{label}</span>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
                {dates.map((date, index) => {
                    const key = formatDate(date);
                    const status = statuses[key] || 'loading';
                    const style = STATUS_STYLES[status] || STATUS_STYLES.loading;
                    const disabled = isDisabled(date);
                    const selected = selectedDate && formatDate(date) === formatDate(selectedDate);

                    return (
                        <button key={index}
                            role="gridcell"
                            aria-label={`${DAY_NAMES[date.getDay()]} ${date.getDate()} - ${status === 'available' ? 'آزاد' : status === 'limited' ? 'محدود' : status === 'closed' ? 'بسته' : 'در حال بارگذاری'}`}
                            aria-selected={selected}
                            aria-disabled={disabled}
                            onClick={() => !disabled && onSelect(date)}
                            style={{
                                backgroundColor: selected ? '#D4AF37' : style.bg + '20',
                                borderRadius: '10px',
                                padding: '10px 2px',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px',
                                cursor: disabled ? 'not-allowed' : 'pointer',
                                opacity: disabled ? 0.4 : 1,
                                border: selected ? '2px solid #D4AF37' : '1px solid transparent',
                                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                                color: 'inherit',
                                fontFamily: 'inherit',
                                WebkitTapHighlightColor: 'transparent'
                            }}>
                            <span style={{ fontSize: '8px', color: selected ? '#1A1A1C' : '#A3A099' }}>{DAY_NAMES[date.getDay()]}</span>
                            <span style={{ fontSize: '14px', fontWeight: selected ? 700 : 400, color: selected ? '#1A1A1C' : '#F7F5F0' }}>{date.getDate()}</span>
                            {style.dotColor && <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: style.dotColor, display: 'inline-block' }} />}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default DateSelector;
