import React, { useState, useEffect } from 'react';
import { fetchServices } from '../../api';

const StepServices = ({ onSelect }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchServices();
        setServices(res.data || []);
      } catch (err) {
        console.error('Failed to load services:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#A3A099', fontSize: '14px' }}>در حال بارگذاری...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
        <p style={{ color: '#E74C3C', fontSize: '14px' }}>{error}</p>
        <p style={{ color: '#A3A099', fontSize: '12px' }}>آیا سرور بک‌اند در حال اجراست؟</p>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#A3A099', fontSize: '14px' }}>سرویسی یافت نشد</p>
      </div>
    );
  }

  return (
    <div style={{ height: '100%', overflowY: 'auto', paddingBottom: '100px' }}>
      {services.map(service => (
        <button
          key={service.id}
          role="radio"
          aria-label={`${service.title} — ${service.duration} دقیقه — ${service.price.toLocaleString('fa-IR')} تومان`}
          onClick={() => onSelect(service)}
          style={{
            backgroundColor: '#232325',
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '15px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            cursor: 'pointer',
            border: '1px solid rgba(255,255,255,0.03)',
            textAlign: 'start',
            color: 'inherit',
            fontFamily: 'inherit',
            WebkitTapHighlightColor: 'transparent'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <h3 style={{ fontSize: '15px', color: '#F7F5F0', margin: 0 }}>{service.title}</h3>
            <p style={{ fontSize: '12px', color: '#A3A099', margin: 0 }}>{service.duration} دقیقه</p>
            {service.description && (
              <p style={{ fontSize: '11px', color: '#666', margin: 0 }}>{service.description}</p>
            )}
          </div>
          <div style={{ fontSize: '14px', color: '#D4AF37', fontWeight: 600, whiteSpace: 'nowrap' }}>
            {service.price.toLocaleString('fa-IR')} <span style={{ fontSize: '10px', color: '#A3A099' }}>تومان</span>
          </div>
        </button>
      ))}
    </div>
  );
};

export default StepServices;
