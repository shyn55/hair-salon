import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ChevronRight } from 'lucide-react';
import StepServices from '../components/booking/StepServices';
import DateSelector from '../components/booking/DateSelector';
import TimeSlots from '../components/booking/TimeSlots';
import BookingForm from '../components/booking/BookingForm';
import StepSuccess from '../components/booking/StepSuccess';
import { createBooking } from '../api';

const STEP_TITLES = { 1: 'خدمات', 2: 'تاریخ', 3: 'ساعت', 4: 'اطلاعات شما' };

const BookingScreen = ({ onBack }) => {
    const [step, setStep] = useState(1);
    const [bookingData, setBookingData] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const screenRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(screenRef.current, { yPercent: 100 }, { yPercent: 0, duration: 0.6, ease: 'power4.out' });
        }, screenRef);
        return () => ctx.revert();
    }, []);

    const handleBack = () => {
        if (step > 1 && step <= 4) { setStep(step - 1); setError(null); }
        else gsap.to(screenRef.current, { yPercent: 100, duration: 0.5, onComplete: onBack });
    };

    const handleClose = () => { gsap.to(screenRef.current, { yPercent: 100, duration: 0.5, onComplete: onBack }); };

    const handleServiceSelect = (service) => { setBookingData(prev => ({ ...prev, service })); setStep(2); };
    const handleDateSelect = (date) => { setBookingData(prev => ({ ...prev, date, startTime: undefined })); setStep(3); };
    const handleTimeSelect = (time) => { setBookingData(prev => ({ ...prev, startTime: time })); setStep(4); };

    const handleFormSubmit = async ({ customerName, phone }) => {
        setSubmitting(true); setError(null);
        try {
            const fmt = (d) => { const y = d.getFullYear(); const m = String(d.getMonth()+1).padStart(2,'0'); const day = String(d.getDate()).padStart(2,'0'); return `${y}-${m}-${day}`; };
            const result = await createBooking({ customerName, phone, date: fmt(bookingData.date), startTime: bookingData.startTime, serviceId: bookingData.service.id });
            setBookingData(prev => ({ ...prev, customerName, phone, bookingId: result.booking?.id }));
            setStep(5);
        } catch (err) {
            if (err.message.includes('رزرو شد')) { setError('این ساعت همین الان رزرو شد. لطفاً ساعت دیگری انتخاب کنید.'); setStep(3); }
            else setError(err.message);
        } finally { setSubmitting(false); }
    };

    return (
        <div ref={screenRef} className="glass-panel" style={{ position: 'absolute', inset: 0, zIndex: 20, display: 'flex', flexDirection: 'column', backgroundColor: '#1A1A1C' }}>
            {step >= 1 && step <= 4 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '36px 16px 14px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <button onClick={handleBack} aria-label="بازگشت" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}><ChevronRight size={22} color="#F7F5F0" strokeWidth={1.5} /></button>
                    <div style={{ textAlign: 'center' }}>
                        <h2 style={{ fontSize: '15px', color: '#D4AF37', margin: 0, fontWeight: 500 }}>{STEP_TITLES[step]}</h2>
                        <div style={{ display: 'flex', gap: '5px', justifyContent: 'center', marginTop: '8px' }}>
                            {[1,2,3,4].map(s => <div key={s} style={{ width: s === step ? '18px' : '5px', height: '5px', borderRadius: '3px', backgroundColor: s <= step ? '#D4AF37' : 'rgba(255,255,255,0.12)',                            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }} />)}
                        </div>
                    </div>
                    <div style={{ width: 40 }} />
                </div>
            )}
            {error && <div style={{ padding: '12px 20px', backgroundColor: 'rgba(231,76,60,0.15)', borderBottom: '1px solid rgba(231,76,60,0.3)' }}><p style={{ color: '#E74C3C', fontSize: '13px', margin: 0 }}>{error}</p></div>}
            <div style={{ flex: 1, padding: '16px', overflow: 'hidden' }}>
                {step === 1 && <StepServices onSelect={handleServiceSelect} />}
                {step === 2 && <DateSelector onSelect={handleDateSelect} selectedDate={bookingData.date} serviceId={bookingData.service?.id} />}
                {step === 3 && <TimeSlots date={bookingData.date} serviceId={bookingData.service?.id} onSelect={handleTimeSelect} selectedTime={bookingData.startTime} />}
                {step === 4 && <BookingForm onSubmit={handleFormSubmit} loading={submitting} />}
                {step === 5 && <StepSuccess finalData={bookingData} onFinish={handleClose} />}
            </div>
        </div>
    );
};

export default BookingScreen;
