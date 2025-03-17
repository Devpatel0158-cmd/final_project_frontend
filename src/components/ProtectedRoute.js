import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Loader from './ui/Loader';

const ProtectedRoute = () => {
    const { isAuthenticated, loading } = useAuth();

    // Show loader while authentication state is being determined
    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem' }}>
                <Loader size="large" />
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Render the child routes if authenticated
    return <Outlet />;
};

export default ProtectedRoute; 