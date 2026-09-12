import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { CalendarDays, Phone, Home } from 'lucide-react';

const StepSuccess = ({ finalData, onFinish }) => {
    const circleRef = useRef(null);
    const checkRef = useRef(null);

    useEffect(() => {
        const tl = gsap.timeline();
        tl.fromTo(circleRef.current, { strokeDasharray: '200', strokeDashoffset: '200' }, { strokeDashoffset: '0', duration: 0.6, ease: 'power2.out' })
          .fromTo(checkRef.current, { strokeDasharray: '50', strokeDashoffset: '50' }, { strokeDashoffset: '0', duration: 0.4, ease: 'power2.out' })
          .fromTo('.success-detail', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, stagger: 0.08, ease: 'power2.out' }, '-=0.2');
    }, []);

    const formatDate = (date) => {
        if (!date) return '';
        if (date instanceof Date) return date.toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });
        return date;
    };

    const detailRow = (label, value) => (
        <div className="success-detail" style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ fontSize: '13px', color: '#A3A099' }}>{label}</span>
            <span style={{ fontSize: '13px', color: '#F7F5F0', fontWeight: 500 }}>{value}</span>
        </div>
    );

    const addToCalendar = () => {
        if (!finalData.date || !finalData.startTime || !finalData.service) return;
        const d = finalData.date instanceof Date ? finalData.date : new Date(finalData.date);
        const [h, m] = finalData.startTime.split(':').map(Number);
        d.setHours(h, m, 0, 0);
        const end = new Date(d);
        end.setMinutes(end.getMinutes() + (finalData.service.duration || 60));
        const fmt = (dt) => dt.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(finalData.service.title)}&dates=${fmt(d)}/${fmt(end)}&details=${encodeURIComponent('Hamid Hair Studio')}`;
        window.open(url, '_blank');
    };

    const callSalon = () => { window.open('tel:+989121234567', '_self'); };

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '25px', overflowY: 'auto', paddingBottom: '100px' }}>
            <svg width="80" height="80" viewBox="0 0 80 80" style={{ marginBottom: '15px' }}>
                <circle ref={circleRef} cx="40" cy="40" r="36" fill="none" stroke="#D4AF37" strokeWidth="4" />
                <path ref={checkRef} d="M25 40 L35 50 L55 30" fill="none" stroke="#D4AF37" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>

            <h2 className="success-detail" style={{ fontSize: '18px', color: '#F7F5F0', margin: '0 0 5px' }}>رزرو شما با موفقیت ثبت شد</h2>
            <p className="success-detail" style={{ fontSize: '11px', color: '#666', margin: '0 0 20px' }}>کد پیگیری: {finalData.bookingId?.slice(0, 8) || '---'}</p>

            <div className="success-detail" style={{ width: '100%', backgroundColor: '#232325', borderRadius: '16px', padding: '16px 20px', marginBottom: '20px' }}>
                {finalData.service && detailRow('سرویس', finalData.service.title)}
                {finalData.date && detailRow('تاریخ', formatDate(finalData.date))}
                {finalData.startTime && detailRow('ساعت', finalData.startTime)}
                {finalData.service && detailRow('مدت', `${finalData.service.duration} دقیقه`)}
                {finalData.service && detailRow('هزینه', `${finalData.service.price.toLocaleString('fa-IR')} تومان`)}
                {finalData.customerName && detailRow('نام', finalData.customerName)}
                {finalData.phone && detailRow('تلفن', finalData.phone)}
            </div>

            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button onClick={addToCalendar}
                    className="success-detail"
                    style={{ padding: '14px', width: '100%', borderRadius: '14px', border: 'none', backgroundColor: '#D4AF37', color: '#1A1A1C', fontSize: '14px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <CalendarDays size={18} /> افزودن به تقویم
                </button>
                <button onClick={callSalon}
                    className="success-detail"
                    style={{ padding: '14px', width: '100%', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'transparent', color: '#F7F5F0', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <Phone size={18} /> تماس با آرایشگر
                </button>
                <button onClick={onFinish}
                    className="success-detail"
                    style={{ padding: '14px', width: '100%', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'transparent', color: '#A3A099', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <Home size={18} /> بازگشت به صفحه اصلی
                </button>
            </div>
        </div>
    );
};

export default StepSuccess;
