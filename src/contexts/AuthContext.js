import React, { createContext, useContext, useState, useEffect } from 'react';
import { saveToStorage, getFromStorage, removeFromStorage } from '../utils/storageUtils';

// Create the authentication context
const AuthContext = createContext();

// Storage key for the auth data
const AUTH_STORAGE_KEY = 'expense_tracker_auth';

// Initial auth state
const initialAuthState = {
    isAuthenticated: false,
    user: null,
    token: null,
};

export const AuthProvider = ({ children }) => {
    // Initialize state from local storage or default values
    const [auth, setAuth] = useState(() => {
        const storedAuth = getFromStorage(AUTH_STORAGE_KEY, initialAuthState);
        return storedAuth;
    });

    const [loading, setLoading] = useState(true);

    // Update local storage when auth state changes
    useEffect(() => {
        if (auth.isAuthenticated) {
            saveToStorage(AUTH_STORAGE_KEY, auth);
        } else {
            removeFromStorage(AUTH_STORAGE_KEY);
        }
        setLoading(false);
    }, [auth]);

    // Login function
    const login = (userData, token) => {
        setAuth({
            isAuthenticated: true,
            user: userData,
            token: token,
        });
    };

    // Logout function
    const logout = () => {
        setAuth(initialAuthState);
    };

    // Update user data
    const updateUser = (userData) => {
        setAuth(prevAuth => ({
            ...prevAuth,
            user: { ...prevAuth.user, ...userData },
        }));
    };

    // Register function (will connect to API in future)
    const register = async (name, email, password) => {
        // For now, just simulate a successful registration
        const userData = { id: Date.now(), name, email };
        const token = 'simulated-jwt-token';

        // After successful registration, log the user in
        login(userData, token);

        return { success: true, user: userData };
    };

    // Context value to be provided
    const contextValue = {
        isAuthenticated: auth.isAuthenticated,
        user: auth.user,
        token: auth.token,
        loading,
        login,
        logout,
        register,
        updateUser,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook for using the auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext; 