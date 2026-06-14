import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import GoogleLoginButton from '../components/GoogleLoginButton';
import Loader from '../components/Loader';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

const schema = yup.object({
  name: yup.string().min(3, 'Min 3 characters').required(),
  email: yup.string().email().required(),
  mobile: yup.string().matches(/^[6-9]\d{9}$/, 'Invalid 10-digit mobile').required(),
  password: yup.string().matches(passwordRegex,
    'Min 8 chars, upper, lower, number, special').required()
});

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) });
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const nav = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await auth.register(data);
      toast.success('Account created!');
      nav('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-md mx-auto">
      {loading && <Loader />}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card p-7 sm:p-8" style={{ opacity: loading ? 0.5 : 1 }}>
        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="text-sm text-gray-500 mt-1">Start booking hostels in under a minute.</p>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium">Full name</label>
            <input className="input mt-1" {...register('name')} placeholder="Your name" disabled={loading} />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <input className="input mt-1" type="email" {...register('email')} placeholder="you@example.com" disabled={loading} />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="text-sm font-medium">Mobile</label>
            <input className="input mt-1" {...register('mobile')} placeholder="10-digit mobile" disabled={loading} />
            {errors.mobile && <p className="text-xs text-red-500 mt-1">{errors.mobile.message}</p>}
          </div>
          <div>
            <label className="text-sm font-medium">Password</label>
            <input className="input mt-1" type="password" {...register('password')} placeholder="••••••••" disabled={loading} />
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
            <p className="text-[11px] text-gray-500 mt-1">Min 8 chars with upper, lower, number & special</p>
          </div>
          <button disabled={loading} className="btn-primary w-full !py-3">{loading ? 'Creating…' : 'Create account'}</button>
        </form>
        <GoogleLoginButton mode="register" />
        <p className="text-sm text-center text-gray-500 mt-6">
          Already have an account? <Link to="/login" className="text-brand-600 font-medium hover:underline">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
