import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Loader2, ShieldCheck, BarChart2, PackageSearch, Users2, TrendingUp, Circle } from 'lucide-react';

const StatTile = ({ label, value, accent }) => (
    <div className="bg-white rounded-xl shadow-lg shadow-slate-900/10 border border-slate-100 p-5 flex flex-col gap-2">
        <p className="text-xs uppercase tracking-widest text-slate-400">{label}</p>
        <div className="flex items-center gap-2">
            <div className="text-3xl font-display font-bold text-slate-900">{value}</div>
            <div className={`w-2 h-2 rounded-full ${accent}`}></div>
        </div>
    </div>
);

const MiniBars = () => {
    const bars = [42, 28, 36, 55, 24, 40, 31, 44, 26];
    return (
        <div className="flex items-end gap-2 h-28">
            {bars.map((h, i) => (
                <div
                    key={i}
                    className="w-6 rounded-t-xl bg-gradient-to-t from-amber-400 to-violet-600 shadow-sm"
                    style={{ height: `${h * 1.2}px` }}
                />
            ))}
        </div>
    );
};

const MiniDonut = ({ value }) => (
    <div className="relative w-28 h-28">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            <path
                className="text-slate-200"
                strokeWidth="4"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845
                   a 15.9155 15.9155 0 0 1 0 31.831
                   a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
                className="text-amber-500"
                strokeWidth="4"
                strokeDasharray={`${value}, 100`}
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845
                   a 15.9155 15.9155 0 0 1 0 31.831
                   a 15.9155 15.9155 0 0 1 0 -31.831"
            />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-xl font-display font-bold text-slate-900">
            {value}%
        </div>
    </div>
);

const AdminDashboard = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [overview, setOverview] = useState({ total_sales: 0, popular_products: [], low_stock: [] });
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const [productForm, setProductForm] = useState({ title: '', price: '', stock_quantity: '', category_id: '', image_url: '' });
    const [message, setMessage] = useState('');

    const fetchAll = async () => {
        try {
            const [ov, ord, us] = await Promise.all([
                api.get('/admin/analytics/overview.php'),
                api.get('/admin/orders/read.php'),
                api.get('/admin/users/read.php'),
            ]);
            setOverview(ov.data);
            setOrders(ord.data.records || []);
            setUsers(us.data.records || []);
        } catch (e) {
            setMessage(e.response?.data?.message || 'Failed to load admin data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAll();
    }, []);

    const updateOrderStatus = async (id, status) => {
        await api.post('/admin/orders/update_status.php', { id, status });
        fetchAll();
    };

    const blockUser = async (id, block = true) => {
        const path = block ? '/admin/users/block.php' : '/admin/users/unblock.php';
        await api.post(path, { id });
        fetchAll();
    };

    const createProduct = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            await api.post('/admin/products/create.php', {
                ...productForm,
                price: parseFloat(productForm.price),
                stock_quantity: parseInt(productForm.stock_quantity || 0, 10),
            });
            setProductForm({ title: '', price: '', stock_quantity: '', category_id: '', image_url: '' });
            setMessage('Product created');
        } catch (err) {
            setMessage(err.response?.data?.message || 'Failed to create product');
        }
    };

    if (loading) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center">
                <Loader2 className="animate-spin text-violet-600" size={32} />
            </div>
        );
    }

    const Sidebar = () => (
        <div className="w-full lg:w-72 bg-gradient-to-b from-slate-900 to-slate-800 text-white rounded-3xl p-8 shadow-2xl shadow-slate-900/30">
            <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-20 h-20 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-3xl font-bold">
                    {user?.name?.[0]?.toUpperCase() || 'A'}
                </div>
                <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-300">Administrator</p>
                    <p className="text-xl font-display font-bold mt-1">{user?.name}</p>
                    <p className="text-slate-300 text-sm break-all">{user?.email}</p>
                </div>
            </div>

            <div className="mt-10 space-y-4 text-sm">
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10">
                    <BarChart2 size={18} /> <span>Overview</span>
                </div>
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10">
                    <PackageSearch size={18} /> <span>Orders</span>
                </div>
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10">
                    <Users2 size={18} /> <span>Customers</span>
                </div>
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10">
                    <ShieldCheck size={18} /> <span>Products</span>
                </div>
            </div>
        </div>
    );

    return (
        <div className="py-10">
            <div className="bg-slate-100/70 p-4 md:p-6 rounded-[24px] shadow-inner">
                <div className="flex flex-col lg:flex-row gap-6">
                    <Sidebar />

                    <div className="flex-1 bg-white rounded-3xl shadow-2xl shadow-slate-900/10 border border-slate-100 p-6 space-y-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <p className="text-sm uppercase tracking-widest text-slate-400">Dashboard</p>
                                <h1 className="text-3xl font-display font-bold text-slate-900 mt-1">Executive View</h1>
                                <p className="text-slate-500">At-a-glance metrics for today’s operations.</p>
                            </div>
                            <div className="pill bg-slate-900 text-white shadow-lg">
                                <ShieldCheck size={18} />
                                <span>{user?.role}</span>
                            </div>
                        </div>

                        {message && <div className="glass-card border border-red-200 text-red-600 px-4 py-3 rounded-xl">{message}</div>}

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <StatTile label="Revenue" value={`$${Number(overview.total_sales || 0).toFixed(0)}`} accent="bg-amber-500" />
                            <StatTile label="Orders" value={orders.length} accent="bg-violet-500" />
                            <StatTile label="Customers" value={users.filter(u => u.role === 'customer').length} accent="bg-blue-500" />
                            <StatTile label="Conversion" value="45%" accent="bg-emerald-500" />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-md p-5 space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-display text-lg font-bold text-slate-900">Performance</h3>
                                    <div className="text-xs uppercase tracking-widest text-slate-400">Last 9 periods</div>
                                </div>
                                <MiniBars />
                            </div>
                            <div className="bg-white rounded-2xl border border-slate-100 shadow-md p-5 space-y-4 flex flex-col items-center justify-center">
                                <h3 className="font-display text-lg font-bold text-slate-900">Health</h3>
                                <MiniDonut value={45} />
                                <div className="text-xs uppercase tracking-widest text-slate-400">Fulfillment score</div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-white rounded-2xl border border-slate-100 shadow-md p-5 space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-display text-lg font-bold text-slate-900">Top products</h3>
                                </div>
                                <div className="space-y-3">
                                    {(overview.popular_products || []).map(item => (
                                        <div key={item.id} className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-xl px-4 py-3">
                                            <div>
                                                <p className="font-semibold text-slate-900">{item.title}</p>
                                                <p className="text-xs uppercase tracking-widest text-slate-400">Units {item.qty}</p>
                                            </div>
                                            <TrendingUp className="text-emerald-500" size={18} />
                                        </div>
                                    ))}
                                    {(!overview.popular_products || overview.popular_products.length === 0) && (
                                        <p className="text-slate-500 text-sm">No sales data yet.</p>
                                    )}
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl border border-slate-100 shadow-md p-6 space-y-4 max-w-3xl mx-auto">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-display text-lg font-bold text-slate-900">Create product</h3>
                                </div>
                                <form className="space-y-3" onSubmit={createProduct}>
                                    <input className="input-dark" placeholder="Title" value={productForm.title} onChange={e => setProductForm(f => ({ ...f, title: e.target.value }))} required />
                                    <input className="input-dark" placeholder="Price" type="number" step="0.01" value={productForm.price} onChange={e => setProductForm(f => ({ ...f, price: e.target.value }))} required />
                                    <input className="input-dark" placeholder="Stock" type="number" value={productForm.stock_quantity} onChange={e => setProductForm(f => ({ ...f, stock_quantity: e.target.value }))} />
                                    <input className="input-dark" placeholder="Category ID" type="number" value={productForm.category_id} onChange={e => setProductForm(f => ({ ...f, category_id: e.target.value }))} />
                                    <input className="input-dark" placeholder="Image URL" value={productForm.image_url} onChange={e => setProductForm(f => ({ ...f, image_url: e.target.value }))} />
                                    <button type="submit" className="w-full py-3 btn-primary justify-center">Save</button>
                                </form>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                            <div className="bg-white rounded-2xl border border-slate-100 shadow-md p-5 space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-display text-lg font-bold text-slate-900">Orders</h3>
                                    <span className="badge-soft">{orders.length} total</span>
                                </div>
                                <div className="space-y-3 max-h-72 overflow-auto pr-1">
                                    {orders.map(o => (
                                        <div key={o.id} className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-xl px-4 py-3">
                                            <div>
                                                <p className="font-semibold text-slate-900">Order #{o.id}</p>
                                                <p className="text-xs uppercase tracking-widest text-slate-400">{o.customer_name || 'N/A'}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="badge-soft">{o.status}</span>
                                                <div className="text-slate-900 font-bold">${Number(o.total_amount).toFixed(2)}</div>
                                            </div>
                                            <div className="flex gap-2">
                                                {['pending', 'shipped', 'delivered', 'cancelled'].map(st => (
                                                    <button key={st} onClick={() => updateOrderStatus(o.id, st)} className="btn-ghost text-[11px] py-1 px-2">
                                                        {st}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                    {orders.length === 0 && <p className="text-slate-500 text-sm">No orders yet.</p>}
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl border border-slate-100 shadow-md p-5 space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-display text-lg font-bold text-slate-900">Users</h3>
                                    <span className="badge-soft">{users.length} total</span>
                                </div>
                                <div className="space-y-3 max-h-72 overflow-auto pr-1">
                                    {users.map(u => (
                                        <div key={u.id} className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-xl px-4 py-3">
                                            <div>
                                                <p className="font-semibold text-slate-900">{u.name}</p>
                                                <p className="text-xs uppercase tracking-widest text-slate-400 break-all">{u.email}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Circle size={10} className={u.is_blocked ? 'text-red-500' : 'text-emerald-500'} />
                                                <span className="badge-soft">{u.role}</span>
                                            </div>
                                            <div>
                                                {u.role === 'customer' && (
                                                    u.is_blocked ? (
                                                        <button onClick={() => blockUser(u.id, false)} className="btn-ghost text-[11px] py-1 px-3">Unblock</button>
                                                    ) : (
                                                        <button onClick={() => blockUser(u.id, true)} className="btn-ghost text-[11px] py-1 px-3">Block</button>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    {users.length === 0 && <p className="text-slate-500 text-sm">No users found.</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

