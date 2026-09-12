import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { fetchProfile, fetchSocialLinks } from '../api';
import { Instagram, MessageCircle, Send, Phone, MapPin } from 'lucide-react';
import BackButton from '../components/BackButton';

const platformIcons = {
    instagram: Instagram,
    whatsapp: MessageCircle,
    telegram: Send,
    phone: Phone,
    telephone: Phone,
};

const AboutSkeleton = () => (
    <div style={{ textAlign: 'center' }}>
        <div aria-busy="true" className="shimmer" style={{ width: 80, height: 80, borderRadius: '50%', margin: '0 auto 15px' }} />
        <div className="shimmer" style={{ width: 140, height: 18, borderRadius: 6, margin: '0 auto 8px' }} />
        <div className="shimmer" style={{ width: 80, height: 10, borderRadius: 6, margin: '0 auto 25px' }} />
        <div className="shimmer" style={{ width: '100%', height: 80, borderRadius: 16, marginBottom: 15 }} />
        <div className="shimmer" style={{ width: '100%', height: 60, borderRadius: 16, marginBottom: 15 }} />
        <div className="shimmer" style={{ width: 180, height: 44, borderRadius: 22, margin: '0 auto' }} />
    </div>
);

const About = ({ onBack }) => {
    const ref = useRef(null);
    const [profile, setProfile] = useState(null);
    const [socialLinks, setSocialLinks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetchProfile().then(r => r.data).catch(() => null),
            fetchSocialLinks().then(r => r.data || []).catch(() => []),
        ])
            .then(([p, links]) => { setProfile(p); setSocialLinks(links); })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (ref.current) {
            gsap.fromTo(ref.current.children, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out' });
        }
    }, [loading]);

    const topBar = (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
            <BackButton onBack={onBack} />
            <div style={{ width: 40 }} />
        </div>
    );

    const activeLinks = socialLinks.filter(l => l.isActive !== false && platformIcons[l.platform]);

    if (loading) {
        return (
            <div style={{ position: 'absolute', inset: 0, zIndex: 10, padding: '40px 20px 90px', overflowY: 'auto' }}>
                {topBar}
                <AboutSkeleton />
            </div>
        );
    }

    const cardBase = { backgroundColor: '#232325', borderRadius: '16px', padding: '20px', marginBottom: '15px', border: '1px solid rgba(255,255,255,0.03)' };

    return (
        <div ref={ref} style={{ position: 'absolute', inset: 0, zIndex: 10, padding: '36px 20px 90px', overflowY: 'auto' }}>
            {topBar}

            {/* Page title */}
            <h2 style={{ textAlign: 'center', color: '#D4AF37', fontSize: '17px', margin: '0 0 22px', fontWeight: 500 }}>درباره من</h2>

            {/* Avatar */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', margin: '0 auto 15px', overflow: 'hidden', border: '2px solid #D4AF37' }}>
                    {profile?.avatar ? (
                        <img src={profile.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        <div style={{ width: '100%', height: '100%', backgroundColor: '#232325', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', color: '#D4AF37' }}>
                            {profile?.firstName?.[0] || 'H'}
                        </div>
                    )}
                </div>
                <h3 style={{ color: '#F7F5F0', fontSize: '20px', margin: 0 }}>{profile?.firstName} {profile?.lastName}</h3>
                <p style={{ color: '#D4AF37', fontSize: '12px', margin: '5px 0 0', letterSpacing: '2px' }}>{profile?.title}</p>
            </div>

            {/* Short bio tagline */}
            {profile?.shortBio && (
                <p style={{ color: '#A3A099', fontSize: '13px', textAlign: 'center', margin: '0 0 20px', lineHeight: 1.8 }}>{profile.shortBio}</p>
            )}

            {/* Bio */}
            {profile?.bio && (
                <div style={cardBase}>
                    <p style={{ color: '#A3A099', fontSize: '13px', lineHeight: 1.8, margin: 0, whiteSpace: 'pre-line' }}>{profile.bio}</p>
                </div>
            )}

            {/* Social links */}
            {activeLinks.length > 0 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '20px' }}>
                    {activeLinks.map(link => {
                        const Icon = platformIcons[link.platform];
                        const isWeb = link.url.startsWith('http');
                        return (
                            <a
                                key={link.id}
                                href={link.url}
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '44px', height: '44px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#232325', color: '#D4AF37', transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}
                                onMouseEnter={(e) => e.target.style.transform = 'scale(1.08)'}
                                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                {...(isWeb ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                                aria-label={link.label || link.platform}
                            >
                                <Icon size={20} strokeWidth={1.5} />
                            </a>
                        );
                    })}
                </div>
            )}

            {/* Working Hours */}
            {profile?.workingHoursNote && (
                <div style={cardBase}>
                    <h3 style={{ color: '#D4AF37', fontSize: '14px', margin: '0 0 10px' }}>ساعات کاری</h3>
                    <p style={{ color: '#A3A099', fontSize: '13px', margin: 0, whiteSpace: 'pre-line', lineHeight: 1.6 }}>{profile.workingHoursNote}</p>
                </div>
            )}

            {/* Contact */}
            {(profile?.phone || profile?.address || profile?.googleMapsUrl) && (
                <div style={cardBase}>
                    <h3 style={{ color: '#D4AF37', fontSize: '14px', margin: '0 0 10px' }}>تماس</h3>
                    {profile.phone && <p style={{ color: '#A3A099', fontSize: '13px', margin: '8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}><Phone size={15} color="#D4AF37" strokeWidth={1.5} /><span style={{ direction: 'ltr' }}>{profile.phone}</span></p>}
                    {profile.email && <p style={{ color: '#A3A099', fontSize: '13px', margin: '8px 0' }}>{profile.email}</p>}
                    {profile.address && <p style={{ color: '#A3A099', fontSize: '13px', margin: '8px 0', display: 'flex', alignItems: 'flex-start', gap: '8px', lineHeight: 1.6 }}><MapPin size={15} color="#D4AF37" strokeWidth={1.5} />{profile.address}</p>}
                    {profile.googleMapsUrl && (
                        <a href={profile.googleMapsUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#D4AF37', fontSize: '13px', marginTop: '8px', textDecoration: 'none', fontWeight: 500 }}>
                            <MapPin size={15} strokeWidth={1.5} /> مشاهده روی نقشه
                        </a>
                    )}
                </div>
            )}
        </div>
    );
};

export default About;
