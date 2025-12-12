import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Package, Clock } from 'lucide-react';

const Profile = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await api.get('/orders/read_user.php');
                setOrders(res.data.records || []);
            } catch (error) {
                console.error("Failed to fetch orders", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchOrders();
    }, [user]);

    if (!user) return <div className="p-20 text-center">Please log in.</div>;

    return (
        <div className="container-max py-12 animate-fade-in-up">
            <div className="flex items-center gap-6 mb-12">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-3xl font-bold text-white shadow-xl shadow-violet-500/30">
                    {user.name.charAt(0)}
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">{user.name}</h1>
                    <p className="text-slate-500">{user.email}</p>
                    <span className="inline-block mt-2 px-3 py-1 bg-slate-100 rounded-full text-xs font-bold uppercase tracking-wide text-slate-600">
                        {user.role}
                    </span>
                </div>
            </div>

            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <Clock className="text-violet-600" /> Order History
            </h2>

            {loading ? (
                <div>Loading...</div>
            ) : orders.length === 0 ? (
                <div className="p-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <p className="text-slate-500 mb-4">No orders found.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map(order => (
                        <div key={order.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-wrap justify-between items-center hover:shadow-md transition">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-violet-50 text-violet-600 rounded-xl">
                                    <Package size={24} />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900">Order #{order.id}</p>
                                    <p className="text-sm text-slate-500">{new Date(order.created_at).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-8 mt-4 sm:mt-0">
                                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase ${order.status === 'completed' ? 'bg-green-100 text-green-700' :
                                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-slate-100 text-slate-700'
                                    }`}>
                                    {order.status}
                                </span>
                                <span className="text-xl font-bold text-slate-900">${order.total_amount}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Profile;
