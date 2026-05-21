import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, Shield, Zap, IndianRupee, Star, Wifi } from 'lucide-react';

const features = [
  { icon: Shield, title: 'Verified hostels', desc: 'Every listing is owner-verified and reviewed by real guests.' },
  { icon: Zap, title: 'Instant booking', desc: 'Book in under 60 seconds with secure UPI payments.' },
  { icon: IndianRupee, title: 'Best prices', desc: 'Daily, weekly & monthly options — no hidden charges.' },
  { icon: Wifi, title: 'Modern amenities', desc: 'AC, Wi-Fi, food, laundry — filter what matters to you.' }
];

const Landing = () => (
  <div className="space-y-20">
    {/* Hero */}
    <section className="relative pt-6 sm:pt-10">
      <div className="grid lg:grid-cols-2 gap-10 items-center">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-300 mb-4">
            <Star size={12} className="fill-current"/> Trusted by 12,000+ travellers
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
            Find your next <span className="bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent">comfortable stay</span> in seconds.
          </h1>
          <p className="mt-5 text-lg text-gray-600 dark:text-gray-300 max-w-xl">
            Discover verified hostels across India — daily, weekly or monthly. Filter by AC, food & sharing type. Book with UPI in a tap.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/rooms" className="btn-primary !py-3"><Search size={18}/> Browse rooms</Link>
            <Link to="/register" className="btn-ghost !py-3">Create an account</Link>
          </div>
          <div className="mt-8 flex items-center gap-6 text-sm text-gray-500">
            <div><span className="block text-2xl font-bold text-gray-900 dark:text-white">500+</span> Hostels</div>
            <div><span className="block text-2xl font-bold text-gray-900 dark:text-white">15</span> Cities</div>
            <div><span className="block text-2xl font-bold text-gray-900 dark:text-white">4.8★</span> Avg. rating</div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.1 }}
          className="relative">
          <div className="absolute -inset-8 bg-gradient-to-br from-brand-400/20 to-purple-400/20 blur-3xl rounded-full" />
          <div className="relative grid grid-cols-2 gap-4">
            <img src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600" className="rounded-2xl shadow-xl aspect-[3/4] object-cover" alt="" />
            <div className="space-y-4 pt-10">
              <img src="https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600" className="rounded-2xl shadow-xl aspect-square object-cover" alt="" />
              <img src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600" className="rounded-2xl shadow-xl aspect-square object-cover" alt="" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>

    {/* Features */}
    <section>
      <h2 className="text-3xl sm:text-4xl font-bold text-center">Why HostelHub</h2>
      <p className="text-center text-gray-500 mt-2 max-w-xl mx-auto">Everything you need for hassle-free hostel booking.</p>
      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {features.map((f, i) => (
          <motion.div key={f.title} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: i * 0.05 }}
            className="card p-6">
            <div className="w-11 h-11 rounded-xl bg-brand-50 dark:bg-brand-500/10 text-brand-600 grid place-items-center mb-4">
              <f.icon size={20}/>
            </div>
            <h3 className="font-semibold">{f.title}</h3>
            <p className="text-sm text-gray-500 mt-1">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>

    {/* CTA */}
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-purple-700 text-white p-10 sm:p-14 text-center">
      <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"/>
      <h2 className="text-3xl sm:text-4xl font-bold relative">Ready to book your stay?</h2>
      <p className="mt-3 opacity-90 relative">Join thousands of travellers who book smart with HostelHub.</p>
      <div className="mt-6 flex justify-center gap-3 relative">
        <Link to="/rooms" className="px-6 py-3 rounded-xl bg-white text-brand-700 font-semibold hover:bg-white/90">Explore rooms</Link>
        <Link to="/register" className="px-6 py-3 rounded-xl border border-white/40 hover:bg-white/10">Create account</Link>
      </div>
    </section>
  </div>
);

export default Landing;
