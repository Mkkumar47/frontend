import { useEffect, useState } from 'react';
import { roomService } from '../services/roomService';
import RoomCard from '../components/RoomCard';
import { ListSkeleton } from '../components/Skeleton';
import { Search as SearchIcon, SlidersHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';

const Rooms = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ q: '', city: '', category: '', ac: '', food: '', sort: 'newest' });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setLoading(true);
    const params = Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ''));
    roomService.list(params)
      .then(({ data }) => setItems(data.items))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [filters]);

  const update = (k, v) => setFilters(f => ({ ...f, [k]: v }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Find your room</h1>
        <p className="text-gray-500 mt-1">Browse verified hostels across India.</p>
      </div>

      <div className="card p-3 sm:p-4 flex flex-col gap-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
            <input className="input !pl-9" placeholder="Search rooms, hostels…"
              value={filters.q} onChange={e => update('q', e.target.value)} />
          </div>
          <button onClick={() => setShowFilters(s => !s)} className="btn-ghost !px-3">
            <SlidersHorizontal size={16}/>
          </button>
        </div>

        {showFilters && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            <input className="input" placeholder="City" value={filters.city} onChange={e => update('city', e.target.value)} />
            <select className="input" value={filters.category} onChange={e => update('category', e.target.value)}>
              <option value="">All sharing</option>
              <option value="1-bed">1 Bed</option>
              <option value="2-bed">2 Bed</option>
              <option value="3-bed">3 Bed</option>
            </select>
            <select className="input" value={filters.ac} onChange={e => update('ac', e.target.value)}>
              <option value="">AC: Any</option>
              <option value="true">AC</option>
              <option value="false">Non-AC</option>
            </select>
            <select className="input" value={filters.food} onChange={e => update('food', e.target.value)}>
              <option value="">Food: Any</option>
              <option value="true">With food</option>
              <option value="false">Without food</option>
            </select>
            <select className="input" value={filters.sort} onChange={e => update('sort', e.target.value)}>
              <option value="newest">Newest</option>
              <option value="price_asc">Price: low → high</option>
              <option value="price_desc">Price: high → low</option>
              <option value="rating">Top rated</option>
            </select>
          </motion.div>
        )}
      </div>

      {loading ? <ListSkeleton /> : items.length === 0 ? (
        <div className="text-center py-16 text-gray-500">No rooms match those filters.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map(r => <RoomCard key={r._id} room={r} />)}
        </div>
      )}
    </div>
  );
};

export default Rooms;
