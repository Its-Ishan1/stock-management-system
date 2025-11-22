import React from 'react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
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
                        Privacy Policy
                    </h1>

                    <div className="policy-content" style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                        <p style={{ marginBottom: '1.5rem' }}>Last updated: November 22, 2025</p>

                        <h2 style={{ color: 'var(--text-primary)', fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>1. Introduction</h2>
                        <p style={{ marginBottom: '1rem' }}>
                            Welcome to StockMaster. We respect your privacy and are committed to protecting your personal data.
                            This privacy policy will inform you as to how we look after your personal data when you visit our website
                            and use our inventory management services.
                        </p>

                        <h2 style={{ color: 'var(--text-primary)', fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>2. Data We Collect</h2>
                        <p style={{ marginBottom: '1rem' }}>
                            We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:
                        </p>
                        <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', marginBottom: '1rem' }}>
                            <li style={{ marginBottom: '0.5rem' }}><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
                            <li style={{ marginBottom: '0.5rem' }}><strong>Contact Data:</strong> includes billing address, delivery address, email address and telephone numbers.</li>
                            <li style={{ marginBottom: '0.5rem' }}><strong>Inventory Data:</strong> includes details about your stock, warehouses, suppliers, and transaction history.</li>
                            <li style={{ marginBottom: '0.5rem' }}><strong>Usage Data:</strong> includes information about how you use our website and services.</li>
                        </ul>

                        <h2 style={{ color: 'var(--text-primary)', fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>3. How We Use Your Data</h2>
                        <p style={{ marginBottom: '1rem' }}>
                            We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                        </p>
                        <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', marginBottom: '1rem' }}>
                            <li style={{ marginBottom: '0.5rem' }}>To provide and maintain our Service, including to monitor the usage of our Service.</li>
                            <li style={{ marginBottom: '0.5rem' }}>To manage your Account: to manage your registration as a user of the Service.</li>
                            <li style={{ marginBottom: '0.5rem' }}>To contact you: To contact you by email, telephone calls, SMS, or other equivalent forms of electronic communication.</li>
                        </ul>

                        <h2 style={{ color: 'var(--text-primary)', fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>4. Data Security</h2>
                        <p style={{ marginBottom: '1rem' }}>
                            We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed.
                            In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
                        </p>

                        <h2 style={{ color: 'var(--text-primary)', fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>5. Contact Us</h2>
                        <p style={{ marginBottom: '1rem' }}>
                            If you have any questions about this privacy policy or our privacy practices, please contact us at: support@stockmaster.com
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
                        <span style={{ cursor: 'pointer', color: 'var(--primary)' }}>Privacy Policy</span>
                        <span style={{ cursor: 'pointer' }} onClick={() => navigate('/terms')}>Terms of Service</span>
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

export default PrivacyPolicy;
