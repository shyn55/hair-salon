import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import IntroLoader from './components/IntroLoader';
import BottomNav from './components/BottomNav';
import HomeScreen from './screens/HomeScreen';
import SubtleBackground from './components/SubtleBackground';
import AdminApp from './admin/AdminApp';

// Code-split GSAP-dependent screens — loaded on demand
const BookingScreen = lazy(() => import('./screens/BookingScreen'));
const Gallery = lazy(() => import('./screens/Gallery'));
const Services = lazy(() => import('./screens/Services'));
const About = lazy(() => import('./screens/About'));

const ScreenFallback = () => (
    <div style={{ position: 'absolute', inset: 0, zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="shimmer" style={{ width: 120, height: 16, borderRadius: 8 }} />
    </div>
);

// ErrorBoundary to prevent full-page crash
import { Component } from 'react';
class ErrorBoundary extends Component {
    constructor(props) { super(props); this.state = { hasError: false, error: null }; }
    static getDerivedStateFromError(error) { return { hasError: true, error }; }
    componentDidCatch(error, info) { console.error('ErrorBoundary caught:', error, info); }
    render() {
        if (this.state.hasError) return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#1A1A1C', color: '#F7F5F0', fontFamily: 'inherit', padding: 40, textAlign: 'center' }}>
                <h2 style={{ fontSize: 18, marginBottom: 12 }}>خطایی رخ داد</h2>
                <p style={{ fontSize: 13, color: '#A3A099', marginBottom: 20 }}>{this.state.error?.message || 'خطای غیرمنتظره'}</p>
                <button onClick={() => this.setState({ hasError: false, error: null })} style={{ padding: '10px 24px', backgroundColor: '#D4AF37', color: '#1A1A1C', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>تلاش مجدد</button>
            </div>
        );
        return this.props.children;
    }
}

const screensMap = {
    home: (props) => <HomeScreen onNavigate={props.onNavigate} />,
    booking: (props) => <Suspense fallback={<ScreenFallback />}><BookingScreen onBack={props.onBack} /></Suspense>,
    gallery: (props) => <Suspense fallback={<ScreenFallback />}><Gallery onBack={props.onBack} /></Suspense>,
    services: (props) => <Suspense fallback={<ScreenFallback />}><Services onBack={props.onBack} /></Suspense>,
    about: (props) => <Suspense fallback={<ScreenFallback />}><About onBack={props.onBack} /></Suspense>,
};

const App = () => {
    const [route, setRoute] = useState(window.location.hash.slice(1) || 'home');
    const [appReady, setAppReady] = useState(false);
    const [currentScreen, setCurrentScreen] = useState('home');

    useEffect(() => {
        const onHash = () => {
            const hash = window.location.hash.slice(1) || 'home';
            setRoute(hash);
            if (hash !== 'admin' && !hash.startsWith('admin/')) {
                setCurrentScreen(hash);
            }
        };
        window.addEventListener('hashchange', onHash);
        return () => window.removeEventListener('hashchange', onHash);
    }, []);

    // Sync currentScreen from initial route
    useEffect(() => {
        if (route !== 'admin' && !route.startsWith('admin/')) {
            setCurrentScreen(route);
        }
    }, [route]);

    const navigate = useCallback((screen) => {
        setCurrentScreen(screen);
        window.location.hash = screen;
    }, []);

    const isAdmin = route === 'admin' || route.startsWith('admin/');

    if (isAdmin) {
        return <AdminApp />;
    }

    return (
        <ErrorBoundary>
        <div id="app-frame">
            <a href="#main-content" style={{ position: 'absolute', top: '-40px', left: 0, background: '#D4AF37', color: '#1A1A1C', padding: '8px 16px', zIndex: 200, borderRadius: '0 0 8px 0', transition: 'top 0.2s', fontSize: '14px', fontWeight: 600 }} onFocus={(e) => e.target.style.top = '0'} onBlur={(e) => e.target.style.top = '-40px'}>رد شدن از محتوا</a>
            <SubtleBackground />
            {!appReady ? (
                <IntroLoader onComplete={() => setAppReady(true)} />
            ) : (
                <main id="main-content" role="main" style={{ position: 'relative', width: '100%', height: '100%' }}>
                    {screensMap[currentScreen] ? screensMap[currentScreen]({ onNavigate: navigate, onBack: () => navigate('home') }) : screensMap.home({ onNavigate: navigate, onBack: () => navigate('home') })}
                    <BottomNav activeTab={currentScreen} setActiveTab={navigate} />
                </main>
            )}
        </div>
        </ErrorBoundary>
    );
};

export default App;
