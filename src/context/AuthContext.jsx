import { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUserLoggedIn = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const res = await fetch('/api/auth/me', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    const data = await res.json();
                    if (res.ok) {
                        setUser(data);
                    } else {
                        localStorage.removeItem('token');
                    }
                } catch (error) {
                    console.error('Error checking login status:', error);
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };

        checkUserLoggedIn();
    }, []);

    const login = async (email, password) => {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json();

        if (res.ok) {
            setUser(data);
            localStorage.setItem('token', data.token);
            return { success: true };
        } else {
            return { success: false, message: data.message };
        }
    };

    const register = async (username, email, password) => {
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password }),
        });
        const data = await res.json();

        if (res.ok) {
            setUser(data);
            localStorage.setItem('token', data.token);
            return { success: true };
        } else {
            return { success: false, message: data.message };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
