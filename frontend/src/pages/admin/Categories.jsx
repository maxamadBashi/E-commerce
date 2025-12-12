import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Plus, Trash2, Edit, Save, X } from 'lucide-react';

const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await api.get('/categories/read.php');
            setCategories(res.data.records || []);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await api.post('/categories/create.php', { name: newCategory });
            setNewCategory('');
            fetchCategories();
        } catch (err) {
            alert('Failed to add category');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await api.post('/categories/delete.php', { id });
            fetchCategories();
        } catch (err) {
            alert('Failed to delete category');
        }
    };

    const startEdit = (cat) => {
        setEditingId(cat.id);
        setEditName(cat.name);
    };

    const saveEdit = async () => {
        try {
            await api.post('/categories/update.php', { id: editingId, name: editName });
            setEditingId(null);
            fetchCategories();
        } catch (err) {
            alert('Failed to update category');
        }
    };

    return (
        <div className="animate-fade-in-up max-w-4xl">
            <h1 className="text-3xl font-display font-bold text-slate-900 mb-8">Categories</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* List */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h2 className="font-bold text-lg mb-4">Existing Categories</h2>
                    <ul className="space-y-3">
                        {categories.map(cat => (
                            <li key={cat.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl group hover:bg-white hover:shadow-md transition border border-transparent hover:border-slate-100">
                                {editingId === cat.id ? (
                                    <div className="flex gap-2 w-full">
                                        <input
                                            value={editName}
                                            onChange={e => setEditName(e.target.value)}
                                            className="flex-1 p-2 border rounded-lg"
                                        />
                                        <button onClick={saveEdit} className="text-green-600 p-2"><Save size={18} /></button>
                                        <button onClick={() => setEditingId(null)} className="text-slate-400 p-2"><X size={18} /></button>
                                    </div>
                                ) : (
                                    <>
                                        <span className="font-medium text-slate-700">{cat.name}</span>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                                            <button onClick={() => startEdit(cat)} className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg"><Edit size={16} /></button>
                                            <button onClick={() => handleDelete(cat.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg"><Trash2 size={16} /></button>
                                        </div>
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Add Form */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-fit">
                    <h2 className="font-bold text-lg mb-4">Add New Category</h2>
                    <form onSubmit={handleAdd} className="flex gap-2">
                        <input
                            type="text"
                            required
                            className="flex-1 p-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-violet-500"
                            placeholder="Category Name"
                            value={newCategory}
                            onChange={e => setNewCategory(e.target.value)}
                        />
                        <button type="submit" className="bg-violet-600 text-white p-3 rounded-xl hover:bg-violet-700">
                            <Plus size={24} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminCategories;
