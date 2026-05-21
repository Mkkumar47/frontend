import { useEffect, useState } from 'react';
import api from '../../services/api';
import { formatINR } from '../../utils/helpers';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Loader from '../../components/Loader';

const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const AdminAnalytics = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => { api.get('/admin/stats').then(r => setStats(r.data.data)); }, []);

  if (!stats) return <Loader />;

  const revenueData = stats.monthlyRevenue.map(d => ({
    name: `${monthNames[d._id.m - 1]} ${String(d._id.y).slice(2)}`,
    revenue: d.total
  }));
  const trendData = stats.bookingTrends.map(d => ({ name: d._id.slice(5), count: d.count }));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Analytics</h1>

      <div className="card p-5">
        <h2 className="font-semibold mb-4">Monthly revenue (last 12 months)</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" fontSize={12}/>
              <YAxis fontSize={12} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`}/>
              <Tooltip formatter={(v) => formatINR(v)} />
              <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card p-5">
        <h2 className="font-semibold mb-4">Booking trends (last 30 days)</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="bcolor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" fontSize={12}/>
              <YAxis fontSize={12} allowDecimals={false}/>
              <Tooltip />
              <Area type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={2} fill="url(#bcolor)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="card p-5">
          <p className="text-sm text-gray-500">Total revenue</p>
          <p className="text-3xl font-bold mt-1">{formatINR(stats.totalRevenue)}</p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-gray-500">Occupancy rate</p>
          <p className="text-3xl font-bold mt-1">{stats.occupancyRate}%</p>
          <div className="mt-3 h-2 rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-brand-500 to-purple-600" style={{ width: `${stats.occupancyRate}%` }}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
