import { ArrowRight, ShoppingBag, Truck, ShieldCheck, Clock, Check, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useCart } from '../context/CartContext';

const Home = () => {
    const [products, setProducts] = useState([]);
    const { addToCart } = useCart();
    const [addedId, setAddedId] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get('/products/read.php');
                if (response.data.records) setProducts(response.data.records);
            } catch (err) {
                // handle error
            }
        };
        fetchProducts();
    }, []);

    const handleAddToCart = (product) => {
        addToCart(product);
        setAddedId(product.id);
        setTimeout(() => setAddedId(null), 2000);
    };

    return (
        <div className="relative min-h-screen text-slate-900">
            {/* Immersive Hero Section */}
            <header className="relative h-[90vh] flex items-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover" alt="Hero" />
                    <div className="absolute inset-0 bg-slate-900/40 mix-blend-multiply"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                </div>

                <div className="container-max relative z-10 text-center">
                    <span className="inline-block py-2 px-6 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold tracking-widest uppercase text-sm mb-6 animate-fade-in-up">
                        New Collection 2025
                    </span>
                    <h1 className="text-6xl md:text-8xl font-display font-bold text-white mb-8 leading-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                        Redefine Your <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-indigo-300">Aesthetic.</span>
                    </h1>
                    <p className="text-xl text-slate-200 mb-10 max-w-2xl mx-auto font-light leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        Experience the pinnacle of design and functionality with our premium selection of lifestyle essentials.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                        <a href="#shop" className="px-10 py-5 bg-white text-slate-900 rounded-full font-bold hover:scale-105 transition-transform shadow-xl flex items-center justify-center gap-2">
                            Shop Collection <ArrowRight size={20} />
                        </a>
                    </div>

                    {/* Floating Stats */}
                    <div className="absolute bottom-10 left-0 right-0 hidden lg:flex justify-center gap-16 animate-float">
                        <div className="text-center">
                            <div className="text-3xl font-display font-bold text-white">2k+</div>
                            <div className="text-sm text-slate-300 uppercase tracking-widest">Products</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-display font-bold text-white">50k+</div>
                            <div className="text-sm text-slate-300 uppercase tracking-widest">Customers</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-display font-bold text-white">99%</div>
                            <div className="text-sm text-slate-300 uppercase tracking-widest">Satisfaction</div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Features Glass Strip */}
            <div className="relative -mt-20 z-20">
                <div className="container-max">
                    <div className="glass-card rounded-3xl p-8 grid grid-cols-1 md:grid-cols-3 gap-8 shadow-2xl shadow-violet-500/10">
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center flex-shrink-0">
                                <Truck size={32} />
                            </div>
                            <div>
                                <h3 className="font-bold text-xl text-slate-900 mb-1">Free Shipping</h3>
                                <p className="text-slate-500 leading-relaxed">Global delivery on all orders over $200.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                                <ShieldCheck size={32} />
                            </div>
                            <div>
                                <h3 className="font-bold text-xl text-slate-900 mb-1">Secure Payment</h3>
                                <p className="text-slate-500 leading-relaxed">Protected by 256-bit SSL encryption.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                                <Clock size={32} />
                            </div>
                            <div>
                                <h3 className="font-bold text-xl text-slate-900 mb-1">Fast Support</h3>
                                <p className="text-slate-500 leading-relaxed">24/7 dedicated customer care team.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Grid */}
            <section id="shop" className="py-32">
                <div className="container-max">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                        <div>
                            <span className="text-violet-600 font-bold tracking-widest uppercase text-sm mb-2 block">Curated For You</span>
                            <h2 className="text-5xl font-display font-bold text-slate-900 mt-2">Trending Essentials</h2>
                        </div>
                        <a href="#" className="flex items-center gap-2 font-bold text-slate-600 hover:text-violet-600 transition group border-b border-slate-300 pb-1 hover:border-violet-600">
                            View all products <ArrowRight size={20} className="group-hover:translate-x-1 transition" />
                        </a>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                        {products.map(product => (
                            <div key={product.id} className="group relative">
                                {/* Image Card */}
                                <div className="aspect-[4/5] bg-white/80 rounded-[2rem] overflow-hidden relative mb-6 border border-white/70 shadow-xl shadow-slate-900/5">
                                    {product.image_url ? (
                                        <img src={product.image_url} alt={product.title} className="w-full h-full object-cover transition duration-700 group-hover:scale-110" />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-slate-300">
                                            <ShoppingBag size={64} />
                                        </div>
                                    )}

                                    {/* Overlay Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                    {/* Action Button */}
                                    <button
                                        onClick={() => handleAddToCart(product)}
                                        className="absolute bottom-6 left-6 right-6 py-4 bg-white text-slate-900 font-bold rounded-xl transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 shadow-xl hover:bg-violet-600 hover:text-white flex items-center justify-center gap-2"
                                    >
                                        {addedId === product.id ? (
                                            <>Added <Check size={20} /></>
                                        ) : (
                                            <>Add to Cart <ShoppingBag size={20} /></>
                                        )}
                                    </button>

                                    {/* Category Badge */}
                                    {product.category_name && (
                                        <div className="absolute top-6 left-6 bg-white/90 backdrop-blur px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-slate-900">
                                            {product.category_name}
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div>
                                    <h3 className="font-display font-bold text-xl text-slate-900 mb-2 truncate">{product.title}</h3>
                                    <div className="flex items-center justify-between">
                                        <span className="text-2xl font-bold text-slate-900">${product.price}</span>
                                        <div className="flex items-center gap-1 text-slate-400">
                                            <Star size={16} className="fill-current text-yellow-400" />
                                            <span className="text-sm font-medium text-slate-600">4.8</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
