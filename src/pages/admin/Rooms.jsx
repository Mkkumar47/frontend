import { useEffect, useState } from 'react';
import { roomService } from '../../services/roomService';
import { formatINR } from '../../utils/helpers';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';

const empty = {
  title: '', description: '', hostelName: '', category: '1-bed', ac: false, foodIncluded: false,
  totalUnits: 1, occupiedUnits: 0,
  pricing: { daily: 800, weekly: 5000, monthly: 18000 },
  location: { city: '', state: '', address: '', pincode: '' },
  amenities: [], images: []
};

const AdminRooms = () => {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);

  const load = () => roomService.list({ limit: 50 }).then(({ data }) => setItems(data.items));
  useEffect(() => { load(); }, []);

  const save = async (e) => {
    e.preventDefault();
    try {
      if (editing._id) await roomService.update(editing._id, editing);
      else await roomService.create(editing);
      toast.success('Saved');
      setOpen(false); setEditing(null);
      load();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const remove = async (id) => {
    if (!confirm('Deactivate this room?')) return;
    await roomService.remove(id);
    toast.success('Deactivated');
    load();
  };

  const upload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const fd = new FormData();
    files.forEach(f => fd.append('files', f));
    try {
      const { data } = await roomService.uploadImages(fd);
      setEditing(s => ({ ...s, images: [...(s.images || []), ...data.items] }));
      toast.success(`${data.items.length} image(s) uploaded`);
    } catch (err) { toast.error('Upload failed'); }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Rooms</h1>
        <button onClick={() => { setEditing({ ...empty }); setOpen(true); }} className="btn-primary !py-2"><Plus size={16}/> Add room</button>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-white/5 text-left">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">City</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Daily</th>
              <th className="px-4 py-3">Occupancy</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/5">
            {items.map(r => (
              <tr key={r._id}>
                <td className="px-4 py-3 font-medium">{r.title}</td>
                <td className="px-4 py-3 text-gray-500">{r.location?.city}</td>
                <td className="px-4 py-3"><span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-white/5 text-xs">{r.category}{r.ac && ' AC'}</span></td>
                <td className="px-4 py-3">{formatINR(r.pricing.daily)}</td>
                <td className="px-4 py-3">{r.occupiedUnits}/{r.totalUnits}</td>
                <td className="px-4 py-3 text-right space-x-1">
                  <button onClick={() => { setEditing(r); setOpen(true); }} className="p-2 rounded hover:bg-gray-100 dark:hover:bg-white/5"><Pencil size={14}/></button>
                  <button onClick={() => remove(r._id)} className="p-2 rounded hover:bg-red-50 text-red-600"><Trash2 size={14}/></button>
                </td>
              </tr>
            ))}
            {!items.length && <tr><td colSpan="6" className="text-center py-8 text-gray-500">No rooms yet.</td></tr>}
          </tbody>
        </table>
      </div>

      {open && editing && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm grid place-items-center p-4 overflow-y-auto">
          <div className="card p-6 w-full max-w-2xl my-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">{editing._id ? 'Edit room' : 'Add room'}</h2>
              <button onClick={() => { setOpen(false); setEditing(null); }} className="p-2 rounded hover:bg-gray-100 dark:hover:bg-white/5"><X size={18}/></button>
            </div>
            <form onSubmit={save} className="grid sm:grid-cols-2 gap-3">
              <input className="input sm:col-span-2" placeholder="Room title" required value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} />
              <input className="input" placeholder="Hostel name" required value={editing.hostelName} onChange={e => setEditing({ ...editing, hostelName: e.target.value })} />
              <input className="input" placeholder="City" required value={editing.location?.city || ''} onChange={e => setEditing({ ...editing, location: { ...editing.location, city: e.target.value } })} />
              <textarea className="input sm:col-span-2" placeholder="Description" rows={3} required value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} />
              <select className="input" value={editing.category} onChange={e => setEditing({ ...editing, category: e.target.value })}>
                <option value="1-bed">1 Bed</option><option value="2-bed">2 Bed</option><option value="3-bed">3 Bed</option>
              </select>
              <input className="input" type="number" min="1" placeholder="Total units" value={editing.totalUnits} onChange={e => setEditing({ ...editing, totalUnits: +e.target.value })} />
              <input className="input" type="number" placeholder="Daily price" value={editing.pricing.daily} onChange={e => setEditing({ ...editing, pricing: { ...editing.pricing, daily: +e.target.value } })} />
              <input className="input" type="number" placeholder="Weekly price" value={editing.pricing.weekly} onChange={e => setEditing({ ...editing, pricing: { ...editing.pricing, weekly: +e.target.value } })} />
              <input className="input" type="number" placeholder="Monthly price" value={editing.pricing.monthly} onChange={e => setEditing({ ...editing, pricing: { ...editing.pricing, monthly: +e.target.value } })} />
              <label className="flex items-center gap-2"><input type="checkbox" className="accent-brand-600" checked={editing.ac} onChange={e => setEditing({ ...editing, ac: e.target.checked })}/> AC</label>
              <label className="flex items-center gap-2"><input type="checkbox" className="accent-brand-600" checked={editing.foodIncluded} onChange={e => setEditing({ ...editing, foodIncluded: e.target.checked })}/> Food included</label>
              <div className="sm:col-span-2">
                <label className="text-sm font-medium">Images</label>
                <input type="file" accept="image/*" multiple onChange={upload} className="block mt-1 text-sm" />
                <div className="mt-2 flex gap-2 flex-wrap">
                  {editing.images?.map((img, i) => (
                    <div key={i} className="relative">
                      <img src={img.url} className="w-16 h-16 object-cover rounded-lg" alt="" />
                      <button type="button" onClick={() => setEditing(s => ({ ...s, images: s.images.filter((_, x) => x !== i) }))}
                        className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white grid place-items-center"><X size={10}/></button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => { setOpen(false); setEditing(null); }} className="btn-ghost">Cancel</button>
                <button className="btn-primary">{editing._id ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRooms;
