import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ name: user.name, mobile: user.mobile, avatar: user.avatar || '' });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authService.updateProfile(form);
      setUser(data.user);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Profile</h1>
      <div className="card p-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 grid place-items-center text-white text-2xl font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
            <p className="text-xs text-gray-400 capitalize mt-0.5">{user.role}</p>
          </div>
        </div>
        <form onSubmit={submit} className="space-y-3 pt-2">
          <div>
            <label className="text-sm">Name</label>
            <input className="input mt-1" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="text-sm">Mobile</label>
            <input className="input mt-1" value={form.mobile} onChange={e => setForm({ ...form, mobile: e.target.value })} />
          </div>
          <div>
            <label className="text-sm">Avatar URL</label>
            <input className="input mt-1" value={form.avatar} onChange={e => setForm({ ...form, avatar: e.target.value })} placeholder="https://..." />
          </div>
          <button disabled={loading} className="btn-primary w-full !py-3">{loading ? 'Saving…' : 'Save changes'}</button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
