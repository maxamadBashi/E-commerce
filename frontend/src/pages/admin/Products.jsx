import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Plus, Trash2, Edit, Image as ImageIcon, Loader } from 'lucide-react';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        id: null,
        title: '',
        price: '',
        description: '',
        category_id: '',
        image_url: ''
    });
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [prodRes, catRes] = await Promise.all([
                api.get('/products/read.php'),
                api.get('/categories/read.php')
            ]);
            setProducts(prodRes.data.records || []);
            setCategories(catRes.data.records || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append('image', file);

        setUploading(true);
        try {
            const res = await api.post('/upload.php', uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setFormData({ ...formData, image_url: res.data.url });
        } catch (error) {
            alert('Upload failed: ' + (error.response?.data?.message || error.message));
        } finally {
            setUploading(false);
        }
    };

    const openCreateModal = () => {
        setFormData({ id: null, title: '', price: '', description: '', category_id: '', image_url: '' });
        setIsModalOpen(true);
    };

    const openEditModal = (product) => {
        setFormData({
            id: product.id,
            title: product.title,
            price: product.price,
            description: product.description || '',
            category_id: product.category_id || '',
            image_url: product.image_url || ''
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formData.id) {
                // Update
                await api.post('/products/update.php', formData);
            } else {
                // Create
                await api.post('/products/create.php', formData);
            }
            setIsModalOpen(false);
            fetchData();
        } catch (error) {
            alert('Failed to save product');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await api.post('/products/delete.php', { id });
            fetchData();
        } catch (error) {
            alert('Delete failed');
        }
    };

    return (
        <>
            <div className="animate-fade-in-up">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-display font-bold text-slate-900">Products</h1>
                    <button
                        onClick={openCreateModal}
                        className="bg-slate-900 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-slate-800 transition"
                    >
                        <Plus size={20} /> Add Product
                    </button>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="text-left p-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Product</th>
                                <th className="text-left p-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Category</th>
                                <th className="text-left p-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Price</th>
                                <th className="text-right p-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {products.map(product => (
                                <tr key={product.id} className="hover:bg-slate-50/50 transition">
                                    <td className="p-4 flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden">
                                            {product.image_url ? (
                                                <img src={product.image_url} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-400"><ImageIcon size={16} /></div>
                                            )}
                                        </div>
                                        <span className="font-bold text-slate-800">{product.title}</span>
                                    </td>
                                    <td className="p-4 text-slate-600 font-medium">{product.category_name}</td>
                                    <td className="p-4 font-bold text-slate-900">${product.price}</td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => openEditModal(product)} className="text-blue-400 hover:text-blue-600 p-2 bg-blue-50 rounded-lg"><Edit size={18} /></button>
                                            <button onClick={() => handleDelete(product.id)} className="text-red-400 hover:text-red-600 p-2 bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" aria-hidden="true" onClick={() => setIsModalOpen(false)}></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        <div className="relative inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full p-6 animate-fade-in-up" onClick={e => e.stopPropagation()}>
                            <h2 className="text-xl font-bold mb-6">{formData.id ? 'Edit Product' : 'Add New Product'}</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Product Title</label>
                                    <input required type="text" className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-violet-500"
                                        value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">Price ($)</label>
                                        <input required type="number" step="0.01" className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-violet-500"
                                            value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">Category</label>
                                        <select required className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-violet-500"
                                            value={formData.category_id} onChange={e => setFormData({ ...formData, category_id: e.target.value })}>
                                            <option value="">Select...</option>
                                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Product Image</label>
                                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center cursor-pointer hover:border-violet-500 transition relative">
                                        <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                                        {uploading ? (
                                            <div className="flex items-center justify-center gap-2 text-violet-600"><Loader className="animate-spin" size={20} /> Uploading...</div>
                                        ) : formData.image_url ? (
                                            <div className="flex items-center gap-3">
                                                <img src={formData.image_url} className="w-16 h-16 rounded-lg object-cover" />
                                                <span className="text-green-600 font-bold text-sm">Image Uploaded!</span>
                                            </div>
                                        ) : (
                                            <div className="text-slate-500 text-sm">Click to upload image</div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-slate-100 font-bold text-slate-600 rounded-xl hover:bg-slate-200">Cancel</button>
                                    <button type="submit" disabled={uploading} className="flex-1 py-3 bg-slate-900 font-bold text-white rounded-xl hover:bg-slate-800 disabled:opacity-50">
                                        {formData.id ? 'Update Product' : 'Save Product'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AdminProducts;
