import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, Bed, ClipboardList, BarChart3, Users } from 'lucide-react';
import Navbar from '../components/Navbar';

const items = [
  { to: '/admin', icon: LayoutDashboard, label: 'Overview', end: true },
  { to: '/admin/rooms', icon: Bed, label: 'Rooms' },
  { to: '/admin/bookings', icon: ClipboardList, label: 'Bookings' },
  { to: '/admin/analytics', icon: BarChart3, label: 'Analytics' }
];

const DashboardLayout = () => (
  <div className="min-h-screen bg-slate-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
    <Navbar />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid md:grid-cols-[220px_1fr] gap-6">
      <aside className="hidden md:block">
        <div className="sticky top-20 space-y-1">
          {items.map(({ to, icon: Icon, label, end }) => (
            <NavLink key={to} to={to} end={end} className={({isActive}) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${isActive
                ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5'}`
            }><Icon size={18}/> {label}</NavLink>
          ))}
        </div>
      </aside>
      <div className="min-w-0">
        <Outlet />
      </div>
    </div>
  </div>
);

export default DashboardLayout;
