import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import Form from '../components/forms/Form';
import FormGroup from '../components/forms/FormGroup';
import FormError from '../components/forms/FormError';
import Divider from '../components/ui/Divider';
import SocialButton from '../components/ui/SocialButton';
import { GoogleIcon, FacebookIcon, GithubIcon } from '../components/ui/icons';
import { isValidEmail, isNotEmpty } from '../utils/validationUtils';
import './auth.css';

const Login = () => {
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!isNotEmpty(formData.email)) {
            newErrors.email = 'Email is required';
        } else if (!isValidEmail(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        if (!isNotEmpty(formData.password)) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError('');

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            // For now, simulate successful login with dummy data
            // In a real app, this would make an API call to authenticate
            setTimeout(() => {
                const userData = {
                    id: 1,
                    name: 'Demo User',
                    email: formData.email,
                };
                const token = 'demo-token-12345';

                login(userData, token);
            }, 1000);
        } catch (error) {
            setSubmitError('Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    const handleSocialLogin = (provider) => {
        setSubmitError('');
        setLoading(true);

        // Simulate a social login
        setTimeout(() => {
            try {
                const userData = {
                    id: 2,
                    name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
                    email: `user@${provider}.com`,
                };
                const token = `${provider}-token-12345`;

                login(userData, token);
            } catch (error) {
                setSubmitError(`Login with ${provider} failed. Please try again.`);
                setLoading(false);
            }
        }, 1000);
    };

    return (
        <div className="login-container">
            <Card title="Login to Your Account" className="login-card">
                {submitError && (
                    <Alert type="danger" message={submitError} />
                )}

                <div className="social-login-buttons">
                    <SocialButton
                        provider="google"
                        icon={<GoogleIcon />}
                        onClick={() => handleSocialLogin('google')}
                        disabled={loading}
                    />
                    <SocialButton
                        provider="facebook"
                        icon={<FacebookIcon />}
                        onClick={() => handleSocialLogin('facebook')}
                        disabled={loading}
                    />
                    <SocialButton
                        provider="github"
                        icon={<GithubIcon />}
                        onClick={() => handleSocialLogin('github')}
                        disabled={loading}
                    />
                </div>

                <Divider text="OR" />

                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Input
                            label="Email"
                            type="email"
                            name="email"
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            error={errors.email}
                            required
                        />
                        {errors.email && <FormError>{errors.email}</FormError>}
                    </FormGroup>

                    <FormGroup>
                        <Input
                            label="Password"
                            type="password"
                            name="password"
                            id="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            error={errors.password}
                            required
                        />
                        {errors.password && <FormError>{errors.password}</FormError>}
                    </FormGroup>

                    <div className="forgot-password">
                        <Link to="/forgot-password" className="auth-link">
                            Forgot password?
                        </Link>
                    </div>

                    <FormGroup>
                        <Button
                            type="submit"
                            variant="primary"
                            fullWidth
                            disabled={loading}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </Button>
                    </FormGroup>
                </Form>

                <div className="auth-links">
                    <p>
                        Don't have an account?{' '}
                        <Link to="/register" className="auth-link">
                            Register
                        </Link>
                    </p>
                </div>
            </Card>
        </div>
    );
};

export default Login; 