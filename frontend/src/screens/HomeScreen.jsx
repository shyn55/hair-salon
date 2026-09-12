import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Calendar, Scissors, Image as ImageIcon, MapPin, Phone, Instagram, MessageCircle, Info } from 'lucide-react';
import { fetchProfile, fetchServices } from '../api';

const SkeletonBlock = ({ width, height, style = {} }) => (
    <div aria-busy="true" style={{
        width, height,
        borderRadius: '12px',
        backgroundColor: '#232325',
        backgroundImage: 'linear-gradient(90deg, #232325 25%, #2a2a2c 50%, #232325 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s ease-in-out infinite',
        ...style
    }} />
);

const HomeScreenSkeleton = () => (
    <div style={{ padding: '32px 22px 20px' }}>
        <SkeletonBlock width="80px" height="8px" style={{ marginBottom: 12 }} />
        <SkeletonBlock width="160px" height="28px" style={{ marginBottom: 10 }} />
        <SkeletonBlock width="28px" height="1px" style={{ marginTop: 12, marginBottom: 10 }} />
        <SkeletonBlock width="70px" height="10px" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '4px 14px 0', marginTop: 24 }}>
            <SkeletonBlock width="100%" height="76px" style={{ borderRadius: 18 }} />
            <SkeletonBlock width="100%" height="76px" style={{ borderRadius: 18 }} />
            <SkeletonBlock width="100%" height="76px" style={{ borderRadius: 18 }} />
            <SkeletonBlock width="100%" height="76px" style={{ borderRadius: 18 }} />
        </div>
    </div>
);

const HomeScreen = ({ onNavigate }) => {
    const screenRef = useRef(null);
    const cardsRef = useRef(null);
    const [profile, setProfile] = useState(null);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetchProfile().then(r => setProfile(r.data)),
            fetchServices().then(r => setServices(r.data || []))
        ]).catch(() => {}).finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (screenRef.current && !loading) {
            const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (prefersReduced) return;

            // Hero entrance
            gsap.fromTo(screenRef.current.querySelector('.hero-section'),
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.6, ease: [0.16, 1, 0.3, 1] }
            );

            // Divider entrance
            gsap.fromTo(screenRef.current.querySelector('.divider'),
                { scaleX: 0, transformOrigin: 'left' },
                { scaleX: 1, duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }
            );

            // Cards staggered entrance
            if (cardsRef.current) {
                const cards = cardsRef.current.querySelectorAll('.home-card');
                gsap.fromTo(cards,
                    { opacity: 0, y: 16, scale: 0.97 },
                    {
                        opacity: 1, y: 0, scale: 1,
                        duration: 0.5,
                        stagger: 0.06,
                        delay: 0.3,
                        ease: [0.16, 1, 0.3, 1]
                    }
                );
            }
        }
    }, [loading]);

    const name = profile ? `${profile.firstName} ${profile.lastName}` : 'HAMID STUDIO';
    const title = profile?.title || 'HAIR ARTIST';
    const phone = profile?.phone || '';
    const address = profile?.address || '';
    const socialLinks = profile?.socialLinks || [];
    const heroImage = profile?.heroImage;

    const cardBase = {
        backgroundColor: '#232325',
        borderRadius: '18px',
        border: '1px solid rgba(255,255,255,0.04)',
        padding: '18px 16px',
        color: '#F7F5F0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        cursor: 'pointer',
        transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        opacity: 0,
    };

    const goldCardStyle = {
        ...cardBase,
        backgroundColor: '#D4AF37',
        gridColumn: '1 / -1',
        padding: '24px 16px',
        borderRadius: '18px',
    };

    if (loading) {
        return (
            <div style={{ position: 'absolute', inset: 0, zIndex: 10, overflowY: 'auto', paddingBottom: 70 }}>
                <HomeScreenSkeleton />
            </div>
        );
    }

    return (
        <div ref={screenRef} style={{ position: 'absolute', inset: 0, zIndex: 10, display: 'flex', flexDirection: 'column', paddingBottom: '70px', overflowY: 'auto' }}>
            {/* Hero — Asymmetric Typography */}
            <div className="hero-section" style={{ position: 'relative', padding: '36px 22px 24px', overflow: 'hidden', opacity: 0 }}>
                {heroImage ? (
                    <img src={heroImage} alt={`${profile?.firstName || ''} ${profile?.lastName || ''} - ${title}`}
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: -2, opacity: 0.25, filter: 'blur(1px)' }} />
                ) : (
                    <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 20% 80%, rgba(212,175,55,0.05) 0%, transparent 60%)', zIndex: -2 }} />
                )}

                <div style={{ position: 'relative', zIndex: 1 }}>
                    <p style={{
                        color: '#D4AF37',
                        fontSize: 'var(--text-xs)',
                        letterSpacing: '5px',
                        textTransform: 'uppercase',
                        margin: '0 0 12px 0',
                        fontWeight: 500
                    }}>{title}</p>

                    <h1 style={{
                        color: '#F7F5F0',
                        fontSize: 'var(--text-display)',
                        fontWeight: 300,
                        letterSpacing: '-0.5px',
                        margin: '0 0 8px 0',
                        lineHeight: 1.1
                    }}>{name}</h1>

                    <div style={{
                        width: '32px', height: '1px',
                        backgroundColor: '#D4AF37',
                        marginTop: '14px', marginBottom: '10px',
                        boxShadow: '0 0 6px rgba(212,175,55,0.3)'
                    }} />

                    <p style={{
                        color: '#A3A099',
                        fontSize: 'var(--text-xs)',
                        margin: 0,
                        letterSpacing: '2px'
                    }}>Men • Women</p>
                </div>
            </div>

            {/* Gold accent divider */}
            <div className="divider" style={{ padding: '0 22px', margin: '4px 0 8px' }}>
                <div style={{
                    height: '1px',
                    background: 'linear-gradient(to right, rgba(212,175,55,0.4), rgba(212,175,55,0.08))'
                }} />
            </div>

            {/* Cards Grid */}
            <div ref={cardsRef} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '4px 14px 0', flex: 1, alignContent: 'start' }}>
                {/* Book Now - Primary CTA */}
                <button className="home-card" onClick={() => onNavigate('booking')} style={goldCardStyle}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(212,175,55,0.25)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
                    <Calendar size={24} color="#1A1A1C" strokeWidth={1.5} />
                    <h3 style={{ color: '#1A1A1C', fontSize: 'var(--text-base)', margin: 0, fontWeight: 600 }}>رزرو وقت</h3>
                </button>

                {/* Services */}
                <button className="home-card" onClick={() => onNavigate('services')} style={cardBase}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.25)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
                    <Scissors size={20} color="#D4AF37" strokeWidth={1.5} />
                    <h3 style={{ fontSize: 'var(--text-sm)', margin: 0, fontWeight: 500 }}>خدمات</h3>
                    <p style={{ fontSize: 'var(--text-xs)', color: '#888', margin: 0 }}>{services.length} سرویس</p>
                </button>

                {/* Gallery */}
                <button className="home-card" onClick={() => onNavigate('gallery')} style={cardBase}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.25)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
                    <ImageIcon size={20} color="#D4AF37" strokeWidth={1.5} />
                    <h3 style={{ fontSize: 'var(--text-sm)', margin: 0, fontWeight: 500 }}>نمونه‌کارها</h3>
                </button>

                {/* About */}
                <button className="home-card" onClick={() => onNavigate('about')} style={cardBase}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.25)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
                    <Info size={20} color="#D4AF37" strokeWidth={1.5} />
                    <h3 style={{ fontSize: 'var(--text-sm)', margin: 0, fontWeight: 500 }}>درباره من</h3>
                </button>

                {/* Address */}
                {address && (
                    <button className="home-card" onClick={() => window.open(profile?.googleMapsUrl || '#', '_blank')} style={cardBase}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.25)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
                        <MapPin size={20} color="#D4AF37" strokeWidth={1.5} />
                        <h3 style={{ fontSize: 'var(--text-sm)', margin: 0, fontWeight: 500, textAlign: 'center' }}>آدرس</h3>
                        <p style={{ fontSize: '9px', color: '#888', margin: 0, textAlign: 'center', lineHeight: 1.4 }}>{address}</p>
                    </button>
                )}

                {/* Phone */}
                {phone && (
                    <a href={`tel:${phone}`} className="home-card" style={{ ...cardBase, textDecoration: 'none' }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.25)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
                        <Phone size={20} color="#D4AF37" strokeWidth={1.5} />
                        <h3 style={{ fontSize: 'var(--text-sm)', margin: 0, fontWeight: 500 }}>تماس</h3>
                        <p style={{ fontSize: 'var(--text-xs)', color: '#888', margin: 0, direction: 'ltr' }}>{phone}</p>
                    </a>
                )}

                {/* Social Links Row */}
                {socialLinks.length > 0 && (
                    <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'center', gap: '12px', padding: '8px 0 12px' }}>
                        {socialLinks.map(link => {
                            const icons = { instagram: Instagram, whatsapp: MessageCircle, telegram: MessageCircle, phone: Phone };
                            const Icon = icons[link.platform] || MessageCircle;
                            return (
                                <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" aria-label={link.platform}
                                    style={{
                                        width: '42px', height: '42px', borderRadius: '14px',
                                        backgroundColor: 'rgba(212,175,55,0.08)',
                                        border: '1px solid rgba(212,175,55,0.15)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: '#D4AF37', textDecoration: 'none',
                                        transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)'; e.currentTarget.style.backgroundColor = 'rgba(212,175,55,0.15)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.backgroundColor = ''; }}>
                                    <Icon size={18} strokeWidth={1.5} />
                                </a>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomeScreen;
