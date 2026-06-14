import { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { setLoading(false); return; }
    authService.me()
      .then(({ data }) => setUser(data.user))
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false));
  }, []);

  const login = async (credentials) => {
    const { data } = await authService.login(credentials);
    localStorage.setItem('token', data.token);
    setUser(data.user);
    return data.user;
  };

  const googleLogin = async (credentialResponse) => {
    const { data } = await authService.googleLogin(credentialResponse.credential);
    localStorage.setItem('token', data.token);
    setUser(data.user);
    return data.user;
  };

  const register = async (payload) => {
    const { data } = await authService.register(payload);
    localStorage.setItem('token', data.token);
    setUser(data.user);
    return data.user;
  };

  const googleRegister = async (credentialResponse) => {
    const token = credentialResponse.credential;
    try {
      const { data } = await authService.googleRegister(token);
      localStorage.setItem('token', data.token);
      setUser(data.user);
      return data.user;
    } catch (err) {
      const backendMessage = err.response?.data?.message || '';
      const isMissingGoogleRegisterRoute =
        err.response?.status === 404 && /route not found/i.test(backendMessage);

      if (!isMissingGoogleRegisterRoute) throw err;

      // Backward-compatible fallback when backend supports only google-login.
      const { data } = await authService.googleLogin(token);
      localStorage.setItem('token', data.token);
      setUser(data.user);
      return data.user;
    }
  };

  const logout = () => { localStorage.removeItem('token'); setUser(null); };

  const refreshUser = async () => {
    const { data } = await authService.me();
    setUser(data.user);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, googleLogin, register, googleRegister, logout, refreshUser, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
