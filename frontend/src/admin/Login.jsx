import React, { useState } from 'react';
import { login } from '../api';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await login(username, password);
            onLogin(res.token);
        } catch (err) {
            setError(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0a0a0b' }}>
            <div style={{ width: '360px', padding: '40px', backgroundColor: '#111113', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h1 style={{ fontSize: '20px', color: '#D4AF37', margin: '0 0 5px' }}>Admin Panel</h1>
                    <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>Hamid Hair Studio</p>
                </div>

                {error && <div style={{ padding: '10px', borderRadius: '8px', backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444', fontSize: '13px', marginBottom: '16px' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '6px' }}>Username</label>
                        <input value={username} onChange={e => setUsername(e.target.value)} required
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: '#1e1e20', color: '#e5e7eb', fontSize: '14px', outline: 'none' }} />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '6px' }}>Password</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: '#1e1e20', color: '#e5e7eb', fontSize: '14px', outline: 'none' }} />
                    </div>
                    <button type="submit" disabled={loading}
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: loading ? '#666' : '#D4AF37', color: '#1A1A1C', fontSize: '14px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }}>
                        {loading ? 'Loading...' : 'Login'}
                    </button>
                </form>

                <p style={{ fontSize: '11px', color: '#555', textAlign: 'center', marginTop: '16px' }}>admin / admin123</p>
            </div>
        </div>
    );
};

export default Login;
