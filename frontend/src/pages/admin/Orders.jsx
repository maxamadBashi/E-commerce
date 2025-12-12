import { useState, useEffect } from 'react';
import api from '../../api/axios';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await api.get('/orders/read_admin.php');
                setOrders(res.data.records || []);
            } catch (err) {
                console.error(err);
            }
        };
        fetchOrders();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-700';
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            case 'cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    return (
        <div className="animate-fade-in-up">
            <h1 className="text-3xl font-display font-bold text-slate-900 mb-8">Order Management</h1>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="text-left p-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Order ID</th>
                            <th className="text-left p-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Customer</th>
                            <th className="text-left p-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Date</th>
                            <th className="text-left p-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Total</th>
                            <th className="text-left p-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {orders.map(order => (
                            <tr key={order.id} className="hover:bg-slate-50/50">
                                <td className="p-4 font-mono text-sm text-slate-500">#{order.id}</td>
                                <td className="p-4 font-bold text-slate-800">{order.user_name}</td>
                                <td className="p-4 text-slate-600 text-sm">{new Date(order.created_at).toLocaleDateString()}</td>
                                <td className="p-4 font-bold text-slate-900">${order.total_amount}</td>
                                <td className="p-4">
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminOrders;
