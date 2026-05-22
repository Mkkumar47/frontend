import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { authService } from '../services/authService';
import Loader from '../components/Loader';

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState('pending');
  const [message, setMessage] = useState('Verifying your email...');
  const navigate = useNavigate();
  const hasVerified = useRef(false);

  useEffect(() => {
    if (hasVerified.current) return;
    hasVerified.current = true;
    let timeoutId;

    const verify = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Verification token is missing.');
        return;
      }

      try {
        await authService.verifyEmail(token);
        toast.success('Email verified successfully.');
        setStatus('success');
        setMessage('Your email has been verified. Redirecting to login...');
        timeoutId = window.setTimeout(() => navigate('/login', { replace: true }), 2000);
      } catch (err) {
        setStatus('error');
        const errorText = err.response?.data?.message || 'Invalid or expired verification link.';
        setMessage(errorText);
        toast.error(errorText);
      }
    };

    verify();
    return () => window.clearTimeout(timeoutId);
  }, [token, navigate]);

  if (status === 'pending') {
    return <Loader />;
  }

  return (
    <div className="max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-7 sm:p-8"
      >
        <h1 className="text-2xl font-bold">Email verification</h1>
        <p className="text-sm text-gray-500 mt-1">{message}</p>

        {status === 'error' && (
          <div className="mt-6 space-y-3">
            <Link to="/login" className="btn-primary w-full !py-3 block text-center">Go to login</Link>
            <Link to="/register" className="btn-secondary w-full !py-3 block text-center">Create a new account</Link>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
