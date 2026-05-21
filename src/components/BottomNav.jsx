import { NavLink } from 'react-router-dom';
import { Home, Search, Calendar, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const items = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/rooms', icon: Search, label: 'Rooms' },
  { to: '/my-bookings', icon: Calendar, label: 'Trips', auth: true },
  { to: '/profile', icon: User, label: 'Me', auth: true }
];

const BottomNav = () => {
  const { user } = useAuth();
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 glass border-t border-white/20 dark:border-white/5 pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-4">
        {items.map(({ to, icon: Icon, label, auth }) => {
          const target = auth && !user ? '/login' : to;
          return (
            <NavLink key={to} to={target} end={to === '/'}
              className={({isActive}) =>
                `flex flex-col items-center justify-center py-2.5 text-[11px] font-medium transition ${isActive ? 'text-brand-600' : 'text-gray-600 dark:text-gray-400'}`}>
              <Icon size={20} />
              <span className="mt-0.5">{label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
