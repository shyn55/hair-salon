import React, { useState } from 'react';
import { User, Phone } from 'lucide-react';

const BookingForm = ({ onSubmit, loading }) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};
        if (!name.trim()) newErrors.name = 'نام را وارد کنید';
        if (!phone.trim()) newErrors.phone = 'شماره تلفن را وارد کنید';
        else if (!/^09\d{9}$/.test(phone.trim())) newErrors.phone = 'شماره تلفن معتبر نیست';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) onSubmit({ customerName: name.trim(), phone: phone.trim() });
    };

    const inputBase = {
        width: '100%',
        padding: '13px 14px 13px 40px',
        backgroundColor: '#1e1e20',
        borderRadius: '12px',
        color: '#F7F5F0',
        fontSize: '14px',
        outline: 'none',
        fontFamily: 'inherit',
        direction: 'rtl',
        transition: 'border-color 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
    };

    return (
        <form onSubmit={handleSubmit} noValidate style={{ height: '100%', display: 'flex', flexDirection: 'column', paddingBottom: '100px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                <User size={18} color="#D4AF37" strokeWidth={1.5} />
                <h3 style={{ fontSize: '15px', color: '#F7F5F0', margin: 0, fontWeight: 500 }}>اطلاعات شما</h3>
            </div>

            <div style={{ position: 'relative', marginBottom: '16px' }}>
                <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', zIndex: 1 }}><User size={18} color="#A3A099" /></span>
                <input
                    id="booking-name"
                    type="text"
                    aria-label="نام و نام خانوادگی"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 'booking-name-error' : undefined}
                    placeholder="نام و نام خانوادگی"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ ...inputBase, border: `1px solid ${errors.name ? '#E74C3C' : 'rgba(255,255,255,0.08)'}` }}
                />
                {errors.name && <p id="booking-name-error" role="alert" style={{ fontSize: '11px', color: '#E74C3C', marginTop: '6px', marginRight: '4px' }}>{errors.name}</p>}
            </div>

            <div style={{ position: 'relative', marginBottom: '16px' }}>
                <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', zIndex: 1 }}><Phone size={18} color="#A3A099" /></span>
                <input
                    id="booking-phone"
                    type="tel"
                    aria-label="شماره تلفن"
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? 'booking-phone-error' : undefined}
                    placeholder="شماره تلفن (0912...)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                    style={{ ...inputBase, border: `1px solid ${errors.phone ? '#E74C3C' : 'rgba(255,255,255,0.08)'}`, direction: 'ltr', textAlign: 'left' }}
                />
                {errors.phone && <p id="booking-phone-error" role="alert" style={{ fontSize: '11px', color: '#E74C3C', marginTop: '6px', marginRight: '4px' }}>{errors.phone}</p>}
            </div>

            <div style={{ flex: 1 }} />

            <button
                type="submit"
                disabled={loading}
                style={{
                    padding: '14px',
                    width: '100%',
                    backgroundColor: loading ? '#888' : '#D4AF37',
                    color: '#1A1A1C',
                    borderRadius: '12px',
                    border: 'none',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    marginBottom: '16px',
                    transition: 'background-color 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
            >
                {loading ? 'در حال ثبت...' : 'ثبت نهایی رزرو'}
            </button>
        </form>
    );
};

export default BookingForm;
