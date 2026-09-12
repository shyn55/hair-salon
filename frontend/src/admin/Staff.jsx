import React, { useEffect, useState } from 'react';
import { fetchWorkingHoursAdmin, updateWorkingHours, addBreak, removeBreak } from '../api';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const Staff = () => {
    const [hours, setHours] = useState([]);

    const load = () => { fetchWorkingHoursAdmin().then(r => setHours(r.data || [])).catch(() => {}); };
    useEffect(() => { load(); }, []);

    const toggleClosed = async (wh) => {
        await updateWorkingHours(wh.id, { isClosed: !wh.isClosed });
        load();
    };

    const updateTimes = async (wh, field, value) => {
        await updateWorkingHours(wh.id, { [field]: value });
    };

    const handleAddBreak = async (whId) => {
        const start = prompt('Break start (HH:MM):');
        const end = prompt('Break end (HH:MM):');
        if (start && end) { await addBreak({ workingHoursId: whId, startTime: start, endTime: end }); load(); }
    };

    const handleRemoveBreak = async (id) => { await removeBreak(id); load(); };

    const inputStyle = { padding: '6px 10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: '#1e1e20', color: '#F7F5F0', fontSize: '13px', outline: 'none', width: '80px', textAlign: 'center' };

    return (
        <div style={{ padding: '30px' }}>
            <h2 style={{ fontSize: '20px', color: '#F7F5F0', marginBottom: '20px' }}>Working Hours</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {hours.map(wh => (
                    <div key={wh.id} style={{ backgroundColor: '#1e1e20', borderRadius: '12px', padding: '16px', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                        <span style={{ width: '100px', fontSize: '14px', color: '#F7F5F0', fontWeight: 500 }}>{DAY_NAMES[wh.dayOfWeek]}</span>
                        <input type="time" defaultValue={wh.startTime} onChange={e => updateTimes(wh, 'startTime', e.target.value)} style={inputStyle} disabled={wh.isClosed} />
                        <span style={{ color: '#666' }}>to</span>
                        <input type="time" defaultValue={wh.endTime} onChange={e => updateTimes(wh, 'endTime', e.target.value)} style={inputStyle} disabled={wh.isClosed} />
                        <button onClick={() => toggleClosed(wh)} style={{ padding: '6px 14px', borderRadius: '6px', border: 'none', backgroundColor: wh.isClosed ? '#ef4444' : '#10b981', color: '#fff', fontSize: '12px', cursor: 'pointer' }}>
                            {wh.isClosed ? 'Closed' : 'Open'}
                        </button>
                        {!wh.isClosed && <button onClick={() => handleAddBreak(wh.id)} style={{ padding: '6px 14px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'transparent', color: '#888', fontSize: '12px', cursor: 'pointer' }}>+ Break</button>}
                        {wh.breaks && wh.breaks.length > 0 && (
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                {wh.breaks.map(b => (
                                    <span key={b.id} onClick={() => handleRemoveBreak(b.id)} style={{ padding: '4px 10px', borderRadius: '12px', backgroundColor: '#f59e0b20', color: '#f59e0b', fontSize: '11px', cursor: 'pointer' }}>
                                        {b.startTime}-{b.endTime} x
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Staff;
