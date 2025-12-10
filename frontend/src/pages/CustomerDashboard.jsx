import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Loader2, ShoppingBag, User, Save, ArrowRight } from 'lucide-react';

const CustomerDashboard = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState([]);
    const [form, setForm] = useState({ name: user?.name || '', phone: '' , password: ''});
    const [message, setMessage] = useState('');

    const fetchOrders = async () => {
        try {
            const res = await api.get('/user/orders/read.php');
            setOrders(res.data.records || []);
        } catch (err) {
            setMessage(err.response?.data?.message || 'Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            const payload = { };
            if (form.name) payload.name = form.name;
            if (form.phone) payload.phone = form.phone;
            if (form.password) payload.password = form.password;
            await api.post('/user/profile/update.php', payload);
            setMessage('Profile updated');
            setForm(f => ({ ...f, password: '' }));
        } catch (err) {
            setMessage(err.response?.data?.message || 'Update failed');
        }
    };

    if (loading) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center">
                <Loader2 className="animate-spin text-violet-600" size={32} />
            </div>
        );
    }

    return (
        <div className="py-16 space-y-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <p className="text-sm uppercase tracking-widest text-blue-500 font-semibold">Customer</p>
                    <h1 className="text-4xl font-display font-bold text-slate-900 mt-2">Your Space</h1>
                    <p className="text-slate-500 mt-2">Hi {user?.name}, manage your profile and orders.</p>
                </div>
                <div className="pill bg-slate-900 text-white shadow-lg">
                    <User size={18} />
                    <span>{user?.email}</span>
                </div>
            </div>

            {message && <div className="glass-card border border-blue-100 text-blue-700 px-4 py-3 rounded-xl">{message}</div>}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile */}
                <div className="glass-card rounded-3xl p-6 lg:col-span-1">
                    <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">Profile</h2>
                    <form className="space-y-4" onSubmit={handleUpdate}>
                        <input
                            className="input-dark"
                            placeholder="Name"
                            value={form.name}
                            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        />
                        <input
                            className="input-dark"
                            placeholder="Phone"
                            value={form.phone}
                            onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                        />
                        <input
                            className="input-dark"
                            placeholder="New Password"
                            type="password"
                            value={form.password}
                            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                        />
                        <button type="submit" className="w-full py-3 btn-primary justify-center">
                            <Save size={16} />
                            Save Changes
                        </button>
                    </form>
                </div>

                {/* Orders */}
                <div className="glass-card rounded-3xl p-6 lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="font-display text-2xl font-bold text-slate-900">Orders</h2>
                        <div className="pill bg-blue-600 text-white">
                            <ShoppingBag size={16} />
                            <span>{orders.length} orders</span>
                        </div>
                    </div>
                    {orders.length === 0 && <p className="text-slate-500">No orders yet.</p>}
                    <div className="space-y-3">
                        {orders.map(order => (
                            <div key={order.id} className="flex items-center justify-between bg-white/80 border border-slate-100 rounded-2xl px-4 py-3 shadow-sm">
                                <div>
                                    <p className="font-semibold text-slate-900">Order #{order.id}</p>
                                    <p className="text-xs uppercase tracking-widest text-slate-400">Placed: {order.created_at}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="badge-soft">{order.status}</span>
                                    <div className="text-slate-900 font-bold">${Number(order.total_amount).toFixed(2)}</div>
                                    <ArrowRight className="text-slate-400" size={16} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerDashboard;

