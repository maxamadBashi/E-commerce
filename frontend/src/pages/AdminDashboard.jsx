import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, BarChart2, PackageSearch, Users2, ShieldCheck, Loader2 } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon }) => (
    <div className="glass-card p-6 rounded-2xl flex items-center justify-between">
        <div>
            <p className="text-xs uppercase tracking-widest text-slate-500">{title}</p>
            <p className="text-3xl font-display font-bold text-slate-900 mt-2">{value}</p>
        </div>
        {Icon && <Icon className="text-violet-600" size={28} />}
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
            setMessage(e.response?.data?.message || 'Failed to  load admin data');
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

    return (
        <div className="py-16 space-y-12">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <p className="text-sm uppercase tracking-widest text-violet-600 font-semibold">Admin</p>
                    <h1 className="text-4xl font-display font-bold text-slate-900 mt-2">Control Center</h1>
                    <p className="text-slate-500 mt-2">Welcome back, {user?.name}</p>
                </div>
                <div className="pill gap-2">
                    <ShieldCheck size={18} />
                    <span>{user?.role}</span>
                </div>
            </div>

            {message && <div className="glass-card border border-red-200 text-red-600 px-4 py-3 rounded-xl">{message}</div>}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total Sales" value={`$${Number(overview.total_sales || 0).toFixed(2)}`} icon={BarChart2} />
                <StatCard title="Orders" value={orders.length} icon={PackageSearch} />
                <StatCard title="Customers" value={users.filter(u => u.role === 'customer').length} icon={Users2} />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Popular & Low Stock */}
                <div className="glass-card rounded-3xl p-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="font-display text-2xl font-bold text-slate-900">Popular Products</h2>
                    </div>
                    <div className="space-y-3">
                        {(overview.popular_products || []).map(item => (
                            <div key={item.id} className="flex items-center justify-between bg-white/70 border border-slate-100 rounded-xl px-4 py-3">
                                <div>
                                    <p className="font-semibold text-slate-900">{item.title}</p>
                                    <p className="text-xs uppercase tracking-widest text-slate-400">Qty sold: {item.qty}</p>
                                </div>
                                <ArrowRight className="text-slate-400" size={16} />
                            </div>
                        ))}
                        {(!overview.popular_products || overview.popular_products.length === 0) && (
                            <p className="text-slate-500 text-sm">No sales data yet.</p>
                        )}
                    </div>

                    <div className="pt-4">
                        <h3 className="font-display text-xl font-bold text-slate-900 mb-3">Low Stock</h3>
                        <div className="space-y-3">
                            {(overview.low_stock || []).map(item => (
                                <div key={item.id} className="flex items-center justify-between bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                                    <p className="font-semibold text-slate-900">{item.title}</p>
                                    <span className="text-xs uppercase tracking-widest text-amber-700">Stock: {item.stock_quantity}</span>
                                </div>
                            ))}
                            {(!overview.low_stock || overview.low_stock.length === 0) && (
                                <p className="text-slate-500 text-sm">No low-stock alerts.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Quick Create Product */}
                <div className="glass-card rounded-3xl p-6">
                    <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">Create Product</h2>
                    <form className="space-y-4" onSubmit={createProduct}>
                        <input className="input-dark" placeholder="Title" value={productForm.title} onChange={e => setProductForm(f => ({ ...f, title: e.target.value }))} required />
                        <input className="input-dark" placeholder="Price" type="number" step="0.01" value={productForm.price} onChange={e => setProductForm(f => ({ ...f, price: e.target.value }))} required />
                        <input className="input-dark" placeholder="Stock" type="number" value={productForm.stock_quantity} onChange={e => setProductForm(f => ({ ...f, stock_quantity: e.target.value }))} />
                        <input className="input-dark" placeholder="Category ID" type="number" value={productForm.category_id} onChange={e => setProductForm(f => ({ ...f, category_id: e.target.value }))} />
                        <input className="input-dark" placeholder="Image URL" value={productForm.image_url} onChange={e => setProductForm(f => ({ ...f, image_url: e.target.value }))} />
                        <button type="submit" className="w-full py-3 btn-primary justify-center">Save Product</button>
                    </form>
                </div>
            </div>

            {/* Orders */}
            <div className="glass-card rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="font-display text-2xl font-bold text-slate-900">Orders</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="text-left text-slate-500 uppercase tracking-widest text-xs">
                            <tr>
                                <th className="py-2 pr-4">ID</th>
                                <th className="py-2 pr-4">Customer</th>
                                <th className="py-2 pr-4">Total</th>
                                <th className="py-2 pr-4">Status</th>
                                <th className="py-2 pr-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {orders.map(o => (
                                <tr key={o.id}>
                                    <td className="py-3 pr-4 font-semibold text-slate-900">{o.id}</td>
                                    <td className="py-3 pr-4">{o.customer_name || 'N/A'}</td>
                                    <td className="py-3 pr-4 font-semibold">${Number(o.total_amount).toFixed(2)}</td>
                                    <td className="py-3 pr-4">
                                        <span className="badge-soft">{o.status}</span>
                                    </td>
                                    <td className="py-3 pr-4 flex gap-2 flex-wrap">
                                        {['pending', 'shipped', 'delivered', 'cancelled'].map(st => (
                                            <button key={st} onClick={() => updateOrderStatus(o.id, st)} className="btn-ghost text-xs py-1 px-3">
                                                {st}
                                            </button>
                                        ))}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {orders.length === 0 && <p className="text-slate-500 text-sm py-4">No orders yet.</p>}
                </div>
            </div>

            {/* Users */}
            <div className="glass-card rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="font-display text-2xl font-bold text-slate-900">Users</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="text-left text-slate-500 uppercase tracking-widest text-xs">
                            <tr>
                                <th className="py-2 pr-4">Name</th>
                                <th className="py-2 pr-4">Email</th>
                                <th className="py-2 pr-4">Role</th>
                                <th className="py-2 pr-4">Status</th>
                                <th className="py-2 pr-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {users.map(u => (
                                <tr key={u.id}>
                                    <td className="py-3 pr-4 font-semibold text-slate-900">{u.name}</td>
                                    <td className="py-3 pr-4">{u.email}</td>
                                    <td className="py-3 pr-4">{u.role}</td>
                                    <td className="py-3 pr-4">
                                        <span className="badge-soft">{u.is_blocked ? 'Blocked' : 'Active'}</span>
                                    </td>
                                    <td className="py-3 pr-4 flex gap-2">
                                        {u.role === 'customer' && (
                                            u.is_blocked ? (
                                                <button onClick={() => blockUser(u.id, false)} className="btn-ghost text-xs py-1 px-3">Unblock</button>
                                            ) : (
                                                <button onClick={() => blockUser(u.id, true)} className="btn-ghost text-xs py-1 px-3">Block</button>
                                            )
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {users.length === 0 && <p className="text-slate-500 text-sm py-4">No users found.</p>}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

