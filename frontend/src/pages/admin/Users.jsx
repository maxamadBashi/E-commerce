import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Plus, User, Shield, Lock, Mail } from 'lucide-react';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'customer' // default
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/users/read.php');
            setUsers(res.data.records || []);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/users/create.php', formData);
            alert('User created successfully');
            setIsModalOpen(false);
            setFormData({ name: '', email: '', password: '', role: 'customer' });
            fetchUsers();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to create user');
        }
    };

    return (
        <div className="animate-fade-in-up">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-display font-bold text-slate-900">User Management</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-slate-900 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-slate-800 transition"
                >
                    <Plus size={20} /> Add User
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="text-left p-4 text-xs font-bold uppercase text-slate-500 tracking-wider">User</th>
                            <th className="text-left p-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Role</th>
                            <th className="text-left p-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Status</th>
                            <th className="text-left p-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Joined</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {users.map(user => (
                            <tr key={user.id} className="hover:bg-slate-50/50 transition">
                                <td className="p-4 flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${user.role === 'admin' ? 'bg-gold-500' : 'bg-violet-500'
                                        }`}>
                                        {user.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-900">{user.name}</div>
                                        <div className="text-sm text-slate-500">{user.email}</div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${user.role === 'admin' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
                                        }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${user.is_blocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                                        }`}>
                                        {user.is_blocked ? 'Blocked' : 'Active'}
                                    </span>
                                </td>
                                <td className="p-4 text-sm text-slate-500">
                                    {new Date(user.created_at).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" aria-hidden="true" onClick={() => setIsModalOpen(false)}></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        <div className="relative inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md w-full p-6 animate-fade-in-up" onClick={e => e.stopPropagation()}>
                            <h2 className="text-xl font-bold mb-6">Create New User</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
                                    <div className="relative">
                                        <User size={18} className="absolute left-3 top-3 text-slate-400" />
                                        <input required type="text" className="w-full pl-10 p-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-violet-500"
                                            value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
                                    <div className="relative">
                                        <Mail size={18} className="absolute left-3 top-3 text-slate-400" />
                                        <input required type="email" className="w-full pl-10 p-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-violet-500"
                                            value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
                                    <div className="relative">
                                        <Lock size={18} className="absolute left-3 top-3 text-slate-400" />
                                        <input required type="password" className="w-full pl-10 p-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-violet-500"
                                            value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Role</label>
                                    <div className="relative">
                                        <Shield size={18} className="absolute left-3 top-3 text-slate-400" />
                                        <select className="w-full pl-10 p-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-violet-500 appearance-none"
                                            value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}>
                                            <option value="customer">Customer</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-slate-100 font-bold text-slate-600 rounded-xl hover:bg-slate-200">Cancel</button>
                                    <button type="submit" className="flex-1 py-3 bg-slate-900 font-bold text-white rounded-xl hover:bg-slate-800">Create User</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;
