import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Interactive3DBox from '../components/Interactive3DBox';

const LandingPage = () => {
    const navigate = useNavigate();
    const { user } = useApp();

    return (
        <div className="landing-container">
            <nav className="landing-nav">
                <div className="landing-logo">
                    <span className="logo-icon">📦</span>
                    <h1>StockMaster</h1>
                </div>
                <div className="landing-actions">
                    {user ? (
                        <button className="btn-primary" onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
                    ) : (
                        <>
                            <button className="btn-text" onClick={() => navigate('/login')}>Sign In</button>
                            <button className="btn-primary" onClick={() => navigate('/signup')}>Sign Up</button>
                        </>
                    )}
                </div>
            </nav>

            <main className="landing-hero">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Smart Inventory Management <br />
                        <span className="text-gradient">for Modern Business</span>
                    </h1>
                    <p className="hero-subtitle">
                        Streamline your operations with real-time tracking, automated insights,
                        and seamless stock control. The all-in-one solution for warehouses of any size.
                    </p>
                    <div className="hero-cta">
                        {user ? (
                            <button className="btn-primary btn-lg" onClick={() => navigate('/dashboard')}>
                                Go to Dashboard
                            </button>
                        ) : (
                            <button className="btn-primary btn-lg" onClick={() => navigate('/signup')}>
                                Get Started Free
                            </button>
                        )}
                    </div>
                </div>

                <div className="hero-visual">
                    <Interactive3DBox />
                </div>
            </main>

            <section className="features-section">
                <h2 className="section-title">Why Choose StockMaster?</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">🚀</div>
                        <h3>Real-Time Tracking</h3>
                        <p>Monitor your inventory levels in real-time across multiple warehouses with 100% accuracy. Track every item movement from receipt to dispatch, ensuring you never lose sight of your stock.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">📊</div>
                        <h3>Smart Analytics</h3>
                        <p>Get actionable insights and predictive analytics to optimize your stock levels and reduce waste.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🛡️</div>
                        <h3>Secure & Reliable</h3>
                        <p>Enterprise-grade security ensures your data is safe, with daily backups and 99.9% uptime.</p>
                    </div>
                </div>
            </section>



            <footer className="landing-footer">
                <div className="footer-content">
                    <div className="footer-brand">
                        <span className="logo-icon">📦</span>
                        <span>StockMaster</span>
                    </div>
                    <div className="footer-links">
                        <span style={{ cursor: 'pointer' }} onClick={() => navigate('/privacy')}>Privacy Policy</span>
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

export default LandingPage;
