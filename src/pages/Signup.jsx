import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { FormInput } from '../components/FormComponents';
import { authAPI } from '../services/api';

const Signup = () => {
    const navigate = useNavigate();
    const { login, showToast } = useApp();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
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
        setError('');

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            showToast('Passwords do not match', 'error');
            return;
        }

        // Validate password strength
        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters long');
            showToast('Password too short', 'error');
            return;
        }

        setLoading(true);

        try {
            const response = await authAPI.register({
                name: formData.name,
                email: formData.email,
                password: formData.password
            });

            const { user, token } = response.data;

            // Automatically log in the user after registration
            login(user, token);

            showToast(`Welcome, ${user.name}! Account created successfully!`, 'success');
            navigate('/dashboard');
        } catch (err) {
            console.error('Signup error:', err);

            if (err.response?.data?.error) {
                setError(err.response.data.error);
                showToast(err.response.data.error, 'error');
            } else {
                setError('Unable to create account. Please try again later.');
                showToast('Registration failed', 'error');
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
                    <h2>Create Account</h2>
                    <p>Start managing your inventory today</p>
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
                        label="Full Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        required
                    />
                    <FormInput
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="name@company.com"
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
                        Must be at least 8 characters
                    </div>
                    <FormInput
                        label="Confirm Password"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="••••••••"
                        required
                    />

                    <div className="form-actions">
                        <button type="submit" className="btn-primary btn-block" disabled={loading}>
                            {loading ? 'Creating Account...' : 'Sign Up'}
                        </button>
                    </div>
                </form>

                <div className="auth-footer">
                    <p>Already have an account? <Link to="/login">Sign in</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Signup;

