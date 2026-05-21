import { useState } from 'react';
import toast from 'react-hot-toast';
import { authService } from '../services/authService';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      toast.success('If that account exists, an email has been sent.');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };
  return (
    <div className="max-w-md mx-auto card p-7">
      <h1 className="text-2xl font-bold">Forgot password?</h1>
      <p className="text-sm text-gray-500 mt-1">Enter your email — we'll send you a reset link.</p>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <input className="input" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
        <button disabled={loading} className="btn-primary w-full !py-3">{loading ? 'Sending…' : 'Send reset link'}</button>
      </form>
      <p className="text-sm text-center text-gray-500 mt-6">
        <Link to="/login" className="text-brand-600 hover:underline">Back to login</Link>
      </p>
    </div>
  );
};
export default ForgotPassword;
