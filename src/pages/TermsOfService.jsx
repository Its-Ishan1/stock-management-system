import React from 'react';
import { useNavigate } from 'react-router-dom';

const TermsOfService = () => {
    const navigate = useNavigate();

    return (
        <div className="landing-container" style={{ overflowY: 'auto' }}>
            <nav className="landing-nav">
                <div className="landing-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                    <span className="logo-icon">📦</span>
                    <h1>StockMaster</h1>
                </div>
                <div className="landing-actions">
                    <button className="btn-text" onClick={() => navigate('/login')}>Sign In</button>
                    <button className="btn-primary" onClick={() => navigate('/signup')}>Sign Up</button>
                </div>
            </nav>

            <main className="landing-hero" style={{ minHeight: 'auto', paddingBottom: '4rem' }}>
                <div className="hero-content" style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
                    <h1 className="hero-title" style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>
                        Terms of Service
                    </h1>

                    <div className="policy-content" style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                        <p style={{ marginBottom: '1.5rem' }}>Last updated: November 22, 2025</p>

                        <h2 style={{ color: 'var(--text-primary)', fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>1. Agreement to Terms</h2>
                        <p style={{ marginBottom: '1rem' }}>
                            By accessing our website at StockMaster, you are agreeing to be bound by these terms of service, all applicable laws and regulations,
                            and agree that you are responsible for compliance with any applicable local laws.
                        </p>

                        <h2 style={{ color: 'var(--text-primary)', fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>2. Use License</h2>
                        <p style={{ marginBottom: '1rem' }}>
                            Permission is granted to temporarily download one copy of the materials (information or software) on StockMaster's website for personal,
                            non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                        </p>
                        <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', marginBottom: '1rem' }}>
                            <li style={{ marginBottom: '0.5rem' }}>modify or copy the materials;</li>
                            <li style={{ marginBottom: '0.5rem' }}>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
                            <li style={{ marginBottom: '0.5rem' }}>attempt to decompile or reverse engineer any software contained on StockMaster's website;</li>
                            <li style={{ marginBottom: '0.5rem' }}>remove any copyright or other proprietary notations from the materials; or</li>
                            <li style={{ marginBottom: '0.5rem' }}>transfer the materials to another person or "mirror" the materials on any other server.</li>
                        </ul>

                        <h2 style={{ color: 'var(--text-primary)', fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>3. Disclaimer</h2>
                        <p style={{ marginBottom: '1rem' }}>
                            The materials on StockMaster's website are provided on an 'as is' basis. StockMaster makes no warranties, expressed or implied,
                            and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability,
                            fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                        </p>

                        <h2 style={{ color: 'var(--text-primary)', fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>4. Limitations</h2>
                        <p style={{ marginBottom: '1rem' }}>
                            In no event shall StockMaster or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit,
                            or due to business interruption) arising out of the use or inability to use the materials on StockMaster's website.
                        </p>

                        <h2 style={{ color: 'var(--text-primary)', fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>5. Governing Law</h2>
                        <p style={{ marginBottom: '1rem' }}>
                            These terms and conditions are governed by and construed in accordance with the laws and you irrevocably submit to the exclusive jurisdiction
                            of the courts in that location.
                        </p>
                    </div>
                </div>
            </main>

            <footer className="landing-footer">
                <div className="footer-content">
                    <div className="footer-brand">
                        <span className="logo-icon">📦</span>
                        <span>StockMaster</span>
                    </div>
                    <div className="footer-links">
                        <span style={{ cursor: 'pointer' }} onClick={() => navigate('/privacy')}>Privacy Policy</span>
                        <span style={{ cursor: 'pointer', color: 'var(--primary)' }}>Terms of Service</span>
                        <a href="#">Contact Us</a>
                    </div>
                    <div className="footer-copyright">
                        © 2024 StockMaster. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default TermsOfService;
