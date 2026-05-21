import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Moon, Sun, User, LogOut, LayoutDashboard, Heart, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);

  const links = [
    { to: '/', label: 'Home' },
    { to: '/rooms', label: 'Rooms' },
    user && { to: '/my-bookings', label: 'My Bookings' },
    user?.role === 'admin' && { to: '/admin', label: 'Admin' }
  ].filter(Boolean);

  return (
    <header className="sticky top-0 z-40 glass border-b border-white/20 dark:border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <motion.div whileHover={{ rotate: 10 }} className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 grid place-items-center text-white shadow-lg shadow-brand-600/30">H</motion.div>
          <span className="bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent">HostelHub</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map(l => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'} className={({isActive}) =>
              `px-3 py-2 rounded-lg text-sm font-medium transition ${isActive
                ? 'text-brand-600 bg-brand-50 dark:bg-brand-500/10'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5'}`
            }>{l.label}</NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button onClick={toggle} aria-label="Toggle theme"
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          {user ? (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/profile" className="btn-ghost !py-2 !px-3">
                <User size={16}/> {user.name.split(' ')[0]}
              </Link>
              <button onClick={() => { logout(); nav('/'); }} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5" aria-label="Logout">
                <LogOut size={18}/>
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/login" className="btn-ghost !py-2">Login</Link>
              <Link to="/register" className="btn-primary !py-2">Get started</Link>
            </div>
          )}
          <button onClick={() => setOpen(v => !v)} className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5" aria-label="Menu">
            {open ? <X size={20}/> : <Menu size={20}/>}
          </button>
        </div>
      </div>

      {open && (
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
          className="md:hidden border-t border-white/10 px-4 py-3 space-y-1 bg-white/95 dark:bg-gray-900/95">
          {links.map(l => (
            <NavLink key={l.to} to={l.to} onClick={() => setOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5">{l.label}</NavLink>
          ))}
          {user ? (
            <button onClick={() => { logout(); setOpen(false); nav('/'); }}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5">Logout</button>
          ) : (
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Link to="/login" onClick={() => setOpen(false)} className="btn-ghost">Login</Link>
              <Link to="/register" onClick={() => setOpen(false)} className="btn-primary">Sign up</Link>
            </div>
          )}
        </motion.div>
      )}
    </header>
  );
};

export default Navbar;
