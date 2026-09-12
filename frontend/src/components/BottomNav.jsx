import React from 'react';
import { Home, Image as ImageIcon, CalendarPlus, Scissors, User } from 'lucide-react';

const BottomNav = ({ activeTab, setActiveTab }) => {
    const navItems = [
        { id: 'home', icon: Home, label: 'خانه' },
        { id: 'gallery', icon: ImageIcon, label: 'نمونه‌کار' },
        { id: 'booking', icon: CalendarPlus, label: 'رزرو' },
        { id: 'services', icon: Scissors, label: 'خدمات' },
        { id: 'about', icon: User, label: 'درباره من' },
    ];

    return (
        <nav className="glass-panel" role="tablist" aria-label="ناوبری اصلی" style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            height: '64px',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            zIndex: 50,
            paddingBottom: '6px'
        }}>
            {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                    <button key={item.id}
                        role="tab"
                        aria-selected={isActive}
                        aria-label={item.label}
                        onClick={() => setActiveTab(item.id)}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '2px',
                            cursor: 'pointer',
                            color: isActive ? '#D4AF37' : '#777',
                            transition: 'color 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                            padding: '4px 10px',
                            borderRadius: '10px',
                            backgroundColor: isActive ? 'rgba(212,175,55,0.08)' : 'transparent',
                            border: 'none',
                            outline: 'none',
                            WebkitTapHighlightColor: 'transparent'
                        }}>
                        <item.icon size={19} strokeWidth={isActive ? 2 : 1.5} />
                        <span style={{
                            fontSize: '9px',
                            fontWeight: isActive ? 600 : 400,
                            letterSpacing: '0.3px'
                        }}>{item.label}</span>
                    </button>
                );
            })}
        </nav>
    );
};

export default BottomNav;
