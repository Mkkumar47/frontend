import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import GoogleLoginButton from '../components/GoogleLoginButton';

const schema = yup.object({
  email: yup.string().email().required('Email is required'),
  password: yup.string().required('Password is required')
});

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const user = await login(data);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);
      nav(loc.state?.from || (user.role === 'admin' ? '/admin' : '/'));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-md mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card p-7 sm:p-8">
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="text-sm text-gray-500 mt-1">Sign in to manage your bookings.</p>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium">Email</label>
            <input className="input mt-1" type="email" {...register('email')} placeholder="you@example.com"/>
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Password</label>
              <Link to="/forgot-password" className="text-xs text-brand-600 hover:underline">Forgot?</Link>
            </div>
            <input className="input mt-1" type="password" {...register('password')} placeholder="••••••••"/>
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
          </div>
          <button disabled={loading} className="btn-primary w-full !py-3">{loading ? 'Signing in…' : 'Sign in'}</button>
        </form>
        <GoogleLoginButton mode="login" />
        <p className="text-sm text-center text-gray-500 mt-6">
          New here? <Link to="/register" className="text-brand-600 font-medium hover:underline">Create account</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
