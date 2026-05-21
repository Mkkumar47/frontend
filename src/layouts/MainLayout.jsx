import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BottomNav from '../components/BottomNav';

const MainLayout = () => (
  <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-indigo-50/40 dark:from-gray-950 dark:via-gray-950 dark:to-gray-900 text-gray-900 dark:text-gray-100 pb-16 md:pb-0">
    <Navbar />
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <Outlet />
    </main>
    <Footer />
    <BottomNav />
  </div>
);

export default MainLayout;
