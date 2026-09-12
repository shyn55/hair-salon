import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { fetchGallery } from '../api';
import BackButton from '../components/BackButton';

const GallerySkeleton = () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        {[1,2,3,4].map(i => (
            <div key={i} aria-busy="true" className="shimmer" style={{ borderRadius: '16px', aspectRatio: '1' }} />
        ))}
    </div>
);

const Gallery = ({ onBack }) => {
    const galleryRef = useRef(null);
    const [items, setItems] = useState([]);
    const [filter, setFilter] = useState('all');
    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const lightboxRef = useRef(null);

    const categories = [
        { id: 'all', label: 'همه' },
        { id: 'men', label: 'مردانه' },
        { id: 'women', label: 'زنانه' },
        { id: 'color', label: 'رنگ' },
        { id: 'cut', label: 'کوتاهی' },
        { id: 'style', label: 'استایل' },
    ];

    useEffect(() => {
        setLoading(true);
        fetchGallery({ category: filter !== 'all' ? filter : undefined })
            .then(r => setItems(r.data || []))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [filter]);

    useEffect(() => {
        if (galleryRef.current) {
            gsap.fromTo(galleryRef.current.children,
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: 'power3.out' }
            );
        }
    }, [items, filter]);

    const openImage = (item) => {
        setSelectedImage(item);
        requestAnimationFrame(() => {
            if (lightboxRef.current) {
                gsap.fromTo(lightboxRef.current, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.4, ease: 'power3.out' });
            }
        });
    };

    const closeImage = () => {
        if (lightboxRef.current) {
            gsap.to(lightboxRef.current, { opacity: 0, scale: 0.9, duration: 0.3, ease: 'power2.in', onComplete: () => setSelectedImage(null) });
        }
    };

    return (
        <div style={{ position: 'absolute', inset: 0, zIndex: 10, display: 'flex', flexDirection: 'column', paddingBottom: '80px' }}>
            {/* Header */}
            <div style={{ padding: '36px 20px 10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
                    <BackButton onBack={onBack} />
                    <h2 style={{ color: '#D4AF37', fontSize: '18px', margin: 0, textAlign: 'center', flex: 1 }}>نمونه‌کارها</h2>
                    <div style={{ width: 40 }} />
                </div>
                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '5px' }}>
                    {categories.map(cat => (
                        <button key={cat.id} onClick={() => setFilter(cat.id)}
                            style={{ flexShrink: 0, padding: '8px 16px', borderRadius: '20px', border: 'none', fontSize: '12px', cursor: 'pointer', backgroundColor: filter === cat.id ? '#D4AF37' : 'rgba(255,255,255,0.06)', color: filter === cat.id ? '#1A1A1C' : '#A3A099', fontWeight: filter === cat.id ? 600 : 400, transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <div ref={galleryRef} style={{ flex: 1, overflowY: 'auto', padding: '10px 20px 20px' }}>
                {loading ? <GallerySkeleton /> : items.length === 0 ? (
                    <div style={{ textAlign: 'center', paddingTop: '60px', color: '#666' }}>
                        <p>هنوز نمونه کاری اضافه نشده</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        {items.map((item) => (
                            <div key={item.id} onClick={() => openImage(item)}
                                style={{ borderRadius: '16px', aspectRatio: '1', overflow: 'hidden', cursor: 'pointer', position: 'relative', backgroundColor: '#232325' }}>
                                <img src={item.thumbnail || item.imageUrl} alt={item.title || ''}
                                    loading="lazy"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}
                                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                />
                                {item.title && (
                                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 10px 10px', background: 'linear-gradient(transparent, rgba(0,0,0,0.7))' }}>
                                        <span style={{ fontSize: '11px', color: '#fff' }}>{item.title}</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Lightbox */}
            {selectedImage && (
                <div ref={lightboxRef} onClick={closeImage}
                    style={{ position: 'fixed', inset: 0, zIndex: 100, backgroundColor: 'rgba(0,0,0,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', cursor: 'pointer' }}>
                    <img src={selectedImage.imageUrl} alt={selectedImage.title || ''}
                        style={{ maxWidth: '100%', maxHeight: '90vh', borderRadius: '12px', objectFit: 'contain' }} />
                </div>
            )}
        </div>
    );
};

export default Gallery;
