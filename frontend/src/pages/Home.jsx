import { ArrowRight, ShoppingBag, Search, Filter, Star, Truck, ShieldCheck, Clock, MessageCircle, Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const { addToCart } = useCart();

    // Filters
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('all'); // all, new, popular

    const navigate = useNavigate();

    useEffect(() => {
        fetchCategories();
        fetchProducts();
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [selectedCategory, searchQuery]);

    const fetchCategories = async () => {
        try {
            const res = await api.get('/categories/read.php');
            setCategories(res.data.records || []);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params = {};
            if (selectedCategory) params.category_id = selectedCategory;
            if (searchQuery) params.search = searchQuery;

            const response = await api.get('/products/read.php', { params });
            setProducts(response.data.records || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">

            {/* HER0 SECTION: Premium & Immersive */}
            <header className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2670&auto=format&fit=crop" className="w-full h-full object-cover opacity-90" alt="Hero Background" />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/40 to-transparent"></div>
                </div>

                <div className="container-max relative z-10">
                    <div className="max-w-2xl animate-fade-in-up">
                        <span className="inline-block py-1 px-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold tracking-widest uppercase mb-6 shadow-lg">
                            New Collection 2025
                        </span>
                        <h1 className="text-5xl lg:text-7xl font-display font-bold text-white mb-6 leading-[1.1] tracking-tight text-shadow-lg">
                            Elevate Your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-yellow-200">Lifestyle.</span>
                        </h1>
                        <p className="text-lg text-slate-200 mb-8 leading-relaxed font-light">
                            Discover a curated selection of premium essentials designed to enhance your everyday life with style and substance.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <button onClick={() => document.getElementById('shop').scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-white text-slate-900 rounded-full font-bold hover:bg-slate-100 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center gap-2">
                                Start Shopping <ArrowRight size={20} />
                            </button>
                            <button className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full font-bold hover:bg-white/20 transition-all">
                                View Lookbook
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* FEATURES STRIP - Glassmorphism */}
            <div className="relative z-20 -mt-16 container-max px-4">
                <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-slate-900/10 p-8 grid grid-cols-1 md:grid-cols-3 gap-8 border border-white/50">
                    <div className="flex items-center gap-4 group">
                        <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                            <Truck size={28} />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-slate-900">Free Shipping</h3>
                            <p className="text-sm text-slate-500">On all global orders</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 group">
                        <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-colors duration-300">
                            <ShieldCheck size={28} />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-slate-900">Secure Payment</h3>
                            <p className="text-sm text-slate-500">100% protected checkout</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 group">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                            <Clock size={28} />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-slate-900">24/7 Support</h3>
                            <p className="text-sm text-slate-500">Dedicated team</p>
                        </div>
                    </div>
                </div>
            </div>

            <main id="shop" className="container-max py-24">
                {/* SECTION HEADER */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <span className="text-violet-600 font-bold tracking-widest uppercase text-xs mb-2 block">Curated For You</span>
                        <h2 className="text-4xl font-display font-bold text-slate-900">Trending Now</h2>
                    </div>

                    {/* SEARCH BAR */}
                    <div className="relative w-full md:w-96 group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-slate-400 group-focus-within:text-violet-600 transition-colors" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-full leading-5 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all shadow-sm group-hover:shadow-md"
                            placeholder="Search essentials..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
                    {/* SIDEBAR FILTERS - Sticky & Modern */}
                    <aside className="lg:col-span-1">
                        <div className="sticky top-28 space-y-8">
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                                <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                                    <Filter size={20} className="text-violet-600" /> Categories
                                </h3>
                                <div className="space-y-1">
                                    <button
                                        onClick={() => setSelectedCategory(null)}
                                        className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex justify-between items-center ${!selectedCategory ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' : 'text-slate-600 hover:bg-slate-50'}`}
                                    >
                                        All Products
                                        {!selectedCategory && <div className="w-2 h-2 rounded-full bg-white"></div>}
                                    </button>
                                    {categories.map(cat => (
                                        <button
                                            key={cat.id}
                                            onClick={() => setSelectedCategory(cat.id)}
                                            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex justify-between items-center ${selectedCategory === cat.id ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' : 'text-slate-600 hover:bg-slate-50'}`}
                                        >
                                            {cat.name}
                                            {selectedCategory === cat.id && <div className="w-2 h-2 rounded-full bg-white"></div>}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Promo Card (Sidebar) */}
                            <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-2xl p-6 text-white text-center shadow-xl shadow-indigo-500/30">
                                <p className="font-display font-bold text-2xl mb-2">Summer Sale</p>
                                <p className="text-indigo-100 text-sm mb-6">Up to 50% off on selected items.</p>
                                <button className="w-full py-3 bg-white text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 transition">
                                    View Offers
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* PRODUCT GRID */}
                    <div className="lg:col-span-3">
                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <div key={i} className="bg-white rounded-2xl h-96 animate-pulse"></div>
                                ))}
                            </div>
                        ) : products.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                                <ShoppingBag size={48} className="text-slate-300 mb-4" />
                                <p className="text-slate-500 font-medium">No products found matching your criteria.</p>
                                <button onClick={() => { setSearchQuery(''); setSelectedCategory(null) }} className="mt-4 text-violet-600 font-bold hover:underline">Clear Filters</button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {products.map(product => (
                                    <div
                                        key={product.id}
                                        onClick={() => navigate(`/product/${product.id}`)}
                                        className="group bg-white rounded-[2rem] p-3 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 cursor-pointer border border-slate-100 relative top-0 hover:-top-2"
                                    >
                                        <div className="aspect-[4/5] bg-slate-100 rounded-[1.5rem] overflow-hidden mb-4 relative">
                                            {product.image_url ? (
                                                <img src={product.image_url} alt={product.title} className="w-full h-full object-cover transition duration-700 group-hover:scale-110" />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-slate-300">
                                                    <ShoppingBag size={40} />
                                                </div>
                                            )}

                                            <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/80 backdrop-blur text-slate-400 hover:text-red-500 hover:scale-110 transition flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-300 delay-75">
                                                <Heart size={18} />
                                            </button>

                                            {product.category_name && (
                                                <span className="absolute bottom-4 left-4 inline-block px-3 py-1 bg-white/90 backdrop-blur rounded-full text-xs font-bold uppercase tracking-wider text-slate-900 shadow-sm">
                                                    {product.category_name}
                                                </span>
                                            )}

                                            {/* Quick Add Overlay */}
                                            <div className="absolute inset-x-4 bottom-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                                                    className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl shadow-xl flex items-center justify-center gap-2 hover:bg-violet-600 transition-colors"
                                                >
                                                    <ShoppingBag size={18} /> Add to Cart
                                                </button>
                                            </div>
                                        </div>

                                        <div className="px-2 pb-2">
                                            <h3 className="font-bold text-slate-900 mb-1 truncate text-lg group-hover:text-violet-600 transition-colors">{product.title}</h3>
                                            <div className="flex items-center justify-between">
                                                <span className="text-lg font-bold text-slate-600">${product.price}</span>
                                                <div className="flex items-center gap-1 text-amber-400 text-sm font-bold">
                                                    <Star size={14} className="fill-current" /> 4.9
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Floating Chat Button */}
            <button className="fixed bottom-8 right-8 w-14 h-14 bg-violet-600 text-white rounded-full shadow-2xl shadow-violet-600/40 flex items-center justify-center hover:scale-110 hover:rotate-3 transition-transform duration-300 z-40 group">
                <MessageCircle size={24} className="group-hover:animate-pulse" />
            </button>
        </div>
    );
};

export default Home;
