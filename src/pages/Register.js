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
import { isValidEmail, isNotEmpty, hasMinLength, valuesMatch } from '../utils/validationUtils';
import './auth.css';

const Register = () => {
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
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

        if (!isNotEmpty(formData.name)) {
            newErrors.name = 'Name is required';
        }

        if (!isNotEmpty(formData.email)) {
            newErrors.email = 'Email is required';
        } else if (!isValidEmail(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        if (!isNotEmpty(formData.password)) {
            newErrors.password = 'Password is required';
        } else if (!hasMinLength(formData.password, 6)) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (!isNotEmpty(formData.confirmPassword)) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (!valuesMatch(formData.password, formData.confirmPassword)) {
            newErrors.confirmPassword = 'Passwords do not match';
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
            await register(formData.name, formData.email, formData.password);
            // Registration successful (handled by the register function in AuthContext)
        } catch (error) {
            setSubmitError('Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSocialRegister = (provider) => {
        setSubmitError('');
        setLoading(true);

        // Simulate social registration
        setTimeout(() => {
            try {
                register(
                    `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
                    `user@${provider}.com`,
                    'password'
                );
            } catch (error) {
                setSubmitError(`Registration with ${provider} failed. Please try again.`);
                setLoading(false);
            }
        }, 1000);
    };

    return (
        <div className="register-container">
            <Card title="Create an Account" className="register-card">
                {submitError && (
                    <Alert type="danger" message={submitError} />
                )}

                <div className="social-login-buttons">
                    <SocialButton
                        provider="google"
                        icon={<GoogleIcon />}
                        onClick={() => handleSocialRegister('google')}
                        disabled={loading}
                    />
                    <SocialButton
                        provider="facebook"
                        icon={<FacebookIcon />}
                        onClick={() => handleSocialRegister('facebook')}
                        disabled={loading}
                    />
                    <SocialButton
                        provider="github"
                        icon={<GithubIcon />}
                        onClick={() => handleSocialRegister('github')}
                        disabled={loading}
                    />
                </div>

                <Divider text="OR" />

                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Input
                            label="Name"
                            type="text"
                            name="name"
                            id="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            error={errors.name}
                            required
                        />
                        {errors.name && <FormError>{errors.name}</FormError>}
                    </FormGroup>

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
                            placeholder="Create a password"
                            error={errors.password}
                            required
                        />
                        {errors.password && <FormError>{errors.password}</FormError>}
                    </FormGroup>

                    <FormGroup>
                        <Input
                            label="Confirm Password"
                            type="password"
                            name="confirmPassword"
                            id="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm your password"
                            error={errors.confirmPassword}
                            required
                        />
                        {errors.confirmPassword && <FormError>{errors.confirmPassword}</FormError>}
                    </FormGroup>

                    <div className="terms-policy">
                        By registering, you agree to our{' '}
                        <Link to="#" className="auth-link">Terms of Service</Link> and{' '}
                        <Link to="#" className="auth-link">Privacy Policy</Link>.
                    </div>

                    <FormGroup>
                        <Button
                            type="submit"
                            variant="primary"
                            fullWidth
                            disabled={loading}
                        >
                            {loading ? 'Creating account...' : 'Register'}
                        </Button>
                    </FormGroup>
                </Form>

                <div className="auth-links">
                    <p>
                        Already have an account?{' '}
                        <Link to="/login" className="auth-link">
                            Login
                        </Link>
                    </p>
                </div>
            </Card>
        </div>
    );
};

export default Register;
