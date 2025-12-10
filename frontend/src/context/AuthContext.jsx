import { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        if (storedUser) setUser(JSON.parse(storedUser));
        if (storedToken) setToken(storedToken);
        setLoading(false);
    }, []);

    const persistSession = (payload) => {
        setUser(payload.user);
        setToken(payload.token);
        localStorage.setItem('user', JSON.stringify(payload.user));
        localStorage.setItem('token', payload.token);
        api.defaults.headers.common['Authorization'] = `Bearer ${payload.token}`;
    };

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login.php', { email, password });
            if (response.data?.user && response.data?.token) {
                persistSession({ user: response.data.user, token: response.data.token });
                return { success: true };
            }
            return { success: false, message: response.data?.message || 'Invalid response from server' };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Login failed' };
        }
    };

    const register = async (name, email, password, phone) => {
        try {
            const response = await api.post('/auth/register.php', { name, email, password, phone });
            if (response.data?.user && response.data?.token) {
                persistSession({ user: response.data.user, token: response.data.token });
                return { success: true };
            }
            return { success: false, message: response.data?.message || 'Registration failed' };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Registration failed' };
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        delete api.defaults.headers.common['Authorization'];
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
