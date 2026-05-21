import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authService } from '../services/authService';

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.resetPassword(token, password);
      toast.success('Password reset! Please login.');
      nav('/login');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };
  return (
    <div className="max-w-md mx-auto card p-7">
      <h1 className="text-2xl font-bold">Set a new password</h1>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <input className="input" type="password" required minLength={8} value={password}
          onChange={e => setPassword(e.target.value)} placeholder="New password" />
        <button disabled={loading} className="btn-primary w-full !py-3">{loading ? 'Resetting…' : 'Reset password'}</button>
      </form>
      <p className="text-sm text-center text-gray-500 mt-6">
        <Link to="/login" className="text-brand-600 hover:underline">Back to login</Link>
      </p>
    </div>
  );
};
export default ResetPassword;
