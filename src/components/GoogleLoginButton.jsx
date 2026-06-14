import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useState } from 'react';

const GoogleLoginButton = ({ mode = 'login' }) => {
  const { googleLogin, googleRegister } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const [loading, setLoading] = useState(false);

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const handler = mode === 'register' ? googleRegister : googleLogin;
      const user = await handler(credentialResponse);
      toast.success(mode === 'register' 
        ? `Welcome, ${user.name.split(' ')[0]}!` 
        : `Welcome back, ${user.name.split(' ')[0]}!`);
      nav(loc.state?.from || (user.role === 'admin' ? '/admin' : '/'));
    } catch (err) {
      toast.error(err.response?.data?.message || `${mode === 'register' ? 'Registration' : 'Login'} failed with Google`);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    toast.error('Google login failed');
  };

  return (
    <div className="mt-6">
      <div className="relative flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-300"></div>
        <span className="text-xs text-gray-500 px-2">OR</span>
        <div className="flex-1 h-px bg-gray-300"></div>
      </div>
      <div className="mt-4 flex justify-center">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          text={mode === 'register' ? 'signup_with' : 'signin_with'}
          locale="en"
        />
      </div>
    </div>
  );
};

export default GoogleLoginButton;
