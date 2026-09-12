import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { fetchServices, fetchCategories } from '../api';
import BackButton from '../components/BackButton';

const SkeletonCard = ({ style = {} }) => (
    <div aria-busy="true" style={{
        backgroundColor: '#232325', borderRadius: '16px', padding: '18px', marginBottom: '12px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        border: '1px solid rgba(255,255,255,0.03)', ...style
    }}>
        <div style={{ flex: 1 }}>
            <div className="shimmer" style={{ width: '60%', height: '14px', borderRadius: 6, marginBottom: 8 }} />
            <div className="shimmer" style={{ width: '40%', height: '10px', borderRadius: 6 }} />
        </div>
        <div className="shimmer" style={{ width: '60px', height: '14px', borderRadius: 6 }} />
    </div>
);

const ServicesSkeleton = () => (
    <div style={{ padding: '10px 20px' }}>
        {[1,2,3,4,5].map(i => <SkeletonCard key={i} />)}
    </div>
);

const Services = ({ onBack }) => {
    const ref = useRef(null);
    const [services, setServices] = useState([]);
    const [categories, setCategories] = useState([]);
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetchCategories().then(r => setCategories(r.data || [])),
            fetchServices().then(r => setServices(r.data || []))
        ]).catch(() => {}).finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (ref.current) {
            gsap.fromTo(ref.current.querySelectorAll('.svc-card'),
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.4, stagger: 0.06, ease: 'power3.out' }
            );
        }
    }, [services, filter]);

    const filtered = filter === 'all' ? services : services.filter(s => s.categoryId === filter);

    return (
        <div style={{ position: 'absolute', inset: 0, zIndex: 10, display: 'flex', flexDirection: 'column', paddingBottom: '80px' }}>
            <div style={{ padding: '36px 20px 10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
                    <BackButton onBack={onBack} />
                    <h2 style={{ color: '#D4AF37', fontSize: '18px', margin: 0, textAlign: 'center', flex: 1 }}>خدمات</h2>
                    <div style={{ width: 40 }} />
                </div>
                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '5px' }}>
                    <button onClick={() => setFilter('all')}
                        style={{ flexShrink: 0, padding: '8px 16px', borderRadius: '20px', border: 'none', fontSize: '12px', cursor: 'pointer', backgroundColor: filter === 'all' ? '#D4AF37' : 'rgba(255,255,255,0.06)', color: filter === 'all' ? '#1A1A1C' : '#A3A099' }}>
                        همه
                    </button>
                    {categories.map(cat => (
                        <button key={cat.id} onClick={() => setFilter(cat.id)}
                            style={{ flexShrink: 0, padding: '8px 16px', borderRadius: '20px', border: 'none', fontSize: '12px', cursor: 'pointer', backgroundColor: filter === cat.id ? '#D4AF37' : 'rgba(255,255,255,0.06)', color: filter === cat.id ? '#1A1A1C' : '#A3A099' }}>
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            <div ref={ref} style={{ flex: 1, overflowY: 'auto', padding: '10px 20px 20px' }}>
                {loading ? <ServicesSkeleton /> : filtered.length === 0 ? (
                    <div style={{ textAlign: 'center', paddingTop: '60px', color: '#666' }}>
                        <p style={{ fontSize: '14px', margin: 0 }}>سرویسی یافت نشد</p>
                        <p style={{ fontSize: '12px', margin: '5px 0 0' }}>فیلتر را تغییر دهید</p>
                    </div>
                ) : filtered.map(svc => (
                    <div key={svc.id} className="svc-card"
                        style={{ backgroundColor: '#232325', borderRadius: '16px', padding: '18px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(255,255,255,0.03)' }}>
                        <div style={{ flex: 1 }}>
                            <h3 style={{ fontSize: '15px', color: '#F7F5F0', margin: 0 }}>{svc.title}</h3>
                            <div style={{ display: 'flex', gap: '12px', marginTop: '5px' }}>
                                <span style={{ fontSize: '11px', color: '#A3A099' }}>{svc.duration} دقیقه</span>
                                {svc.category && <span style={{ fontSize: '11px', color: '#D4AF37' }}>{svc.category.name}</span>}
                            </div>
                            {svc.description && <p style={{ fontSize: '11px', color: '#666', margin: '5px 0 0', lineHeight: 1.5 }}>{svc.description}</p>}
                        </div>
                        <div style={{ fontSize: '14px', color: '#D4AF37', fontWeight: 600, whiteSpace: 'nowrap', marginRight: '12px' }}>
                            {svc.price.toLocaleString('fa-IR')} <span style={{ fontSize: '10px', color: '#A3A099' }}>تومان</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Services;
