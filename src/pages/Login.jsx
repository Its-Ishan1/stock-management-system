import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { FormInput } from '../components/FormComponents';
import { authAPI } from '../services/api';

const Login = () => {
    const navigate = useNavigate();
    const { login, showToast } = useApp();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError(''); // Clear error when user types
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await authAPI.login(formData);
            const { user, token } = response.data;

            // Call login with both user data and token
            login(user, token);

            showToast(`Welcome back, ${user.name}!`, 'success');
            navigate('/dashboard');
        } catch (err) {
            console.error('Login error:', err);

            if (err.response?.data?.error) {
                setError(err.response.data.error);
                showToast(err.response.data.error, 'error');
            } else {
                setError('Unable to connect to server. Please try again later.');
                showToast('Connection error', 'error');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="logo-icon large">📦</div>
                    <h2>Welcome Back</h2>
                    <p>Sign in to continue to StockMaster</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {error && (
                        <div className="error-message" style={{
                            padding: '0.75rem',
                            marginBottom: '1rem',
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            borderRadius: '8px',
                            color: '#fca5a5',
                            fontSize: '0.9rem'
                        }}>
                            {error}
                        </div>
                    )}

                    <FormInput
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="demo@stockmaster.com"
                        required
                    />
                    <FormInput
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        required
                    />

                    <div className="form-hint" style={{
                        fontSize: '0.85rem',
                        color: 'var(--text-muted)',
                        marginTop: '-0.5rem',
                        marginBottom: '1rem'
                    }}>
                        Demo: demo@stockmaster.com / Demo1234
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn-primary btn-block" disabled={loading}>
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </div>
                </form>

                <div className="auth-footer">
                    <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;

