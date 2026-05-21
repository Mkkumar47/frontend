import { useEffect, useState } from 'react';
import api from '../../services/api';
import { formatINR } from '../../utils/helpers';
import { Users, ClipboardList, Bed, IndianRupee, TrendingUp, Percent } from 'lucide-react';
import Loader from '../../components/Loader';
import { motion } from 'framer-motion';

const KPI = ({ icon: Icon, label, value, accent }) => (
  <motion.div whileHover={{ y: -2 }} className="card p-5">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
      </div>
      <div className={`w-11 h-11 rounded-xl grid place-items-center ${accent}`}><Icon size={20}/></div>
    </div>
  </motion.div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState(null);

  useEffect(() => {
    api.get('/admin/stats').then(r => setStats(r.data.data));
    api.get('/admin/activity').then(r => setActivity(r.data.data));
  }, []);

  if (!stats) return <Loader />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Overview</h1>
        <p className="text-gray-500 text-sm">Real-time snapshot of HostelHub.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPI icon={ClipboardList} label="Total bookings" value={stats.totalBookings} accent="bg-brand-50 text-brand-600" />
        <KPI icon={Bed} label="Active rooms" value={stats.totalRooms} accent="bg-amber-50 text-amber-600" />
        <KPI icon={Users} label="Customers" value={stats.totalUsers} accent="bg-emerald-50 text-emerald-600" />
        <KPI icon={IndianRupee} label="Revenue" value={formatINR(stats.totalRevenue)} accent="bg-purple-50 text-purple-600" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <KPI icon={Percent} label="Occupancy rate" value={`${stats.occupancyRate}%`} accent="bg-rose-50 text-rose-600" />
        <KPI icon={TrendingUp} label="Bookings (30d)" value={stats.bookingTrends.reduce((s, x) => s + x.count, 0)} accent="bg-sky-50 text-sky-600" />
      </div>

      <div className="card p-5">
        <h2 className="font-semibold mb-3">Recent bookings</h2>
        {!activity ? <Loader /> : activity.bookings.length === 0 ? (
          <p className="text-sm text-gray-500">No bookings yet.</p>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-white/5">
            {activity.bookings.map(b => (
              <div key={b._id} className="py-3 flex items-center justify-between text-sm">
                <div className="min-w-0">
                  <p className="font-medium truncate">{b.user?.name} · {b.room?.title}</p>
                  <p className="text-xs text-gray-500 font-mono">{b.bookingId}</p>
                </div>
                <span className="capitalize text-xs px-2 py-1 rounded bg-gray-100 dark:bg-white/5">{b.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
