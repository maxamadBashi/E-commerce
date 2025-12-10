import { ShoppingBag, Menu, X, Search, Sparkles, Shield } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = useAuth();
    const { cartItems } = useCart();
    const navigate = useNavigate();

    const cartCount = cartItems ? cartItems.reduce((acc, item) => acc + item.quantity, 0) : 0;

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'glass-nav py-3' : 'bg-transparent py-5'}`}>
            <div className="container-max">
                <div className="flex justify-between items-center">
                    {/* Brand */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-violet-500/30 group-hover:scale-105 transition-transform duration-300">
                            <Sparkles size={20} />
                        </div>
                        <span className={`font-display font-bold text-2xl tracking-tight transition-colors ${scrolled ? 'text-slate-900' : 'text-slate-900 lg:text-slate-900'}`}>
                            Luxe<span className="text-violet-600">Mart</span>
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8 bg-white/50 backdrop-blur-md px-6 py-2 rounded-full border border-white/20 shadow-sm">
                        <Link to="/" className="text-sm font-medium text-slate-600 hover:text-violet-600 transition">Home</Link>
                        {user?.role === 'admin' && (
                            <Link to="/admin" className="text-sm font-medium text-slate-600 hover:text-violet-600 transition flex items-center gap-1">
                                <Shield size={16} /> Admin
                            </Link>
                        )}
                        {user?.role === 'customer' && (
                            <Link to="/account" className="text-sm font-medium text-slate-600 hover:text-violet-600 transition">Account</Link>
                        )}
                        <Link to="/products" className="text-sm font-medium text-slate-600 hover:text-violet-600 transition">Collection</Link>
                        <Link to="/about" className="text-sm font-medium text-slate-600 hover:text-violet-600 transition">Story</Link>
                        <Link to="/contact" className="text-sm font-medium text-slate-600 hover:text-violet-600 transition">Contact</Link>
                    </div>

                    {/* Icons, Search & Actions */}
                    <div className="hidden md:flex items-center space-x-4">
                        <div className="hidden lg:flex items-center bg-white/80 rounded-full px-3 py-1 border border-white/20 shadow-sm">
                            <Search size={18} className="text-slate-500 mr-2" />
                            <input type="text" placeholder="Search products" className="bg-transparent outline-none text-sm text-slate-700 w-48" />
                        </div>

                        <Link to="/cart" className="relative text-slate-600 hover:text-violet-600 transition group">
                            <ShoppingBag size={20} />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-violet-600 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {user ? (
                            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                                <span className="text-sm font-semibold text-slate-700">{user.name}</span>
                                <button
                                    onClick={handleLogout}
                                    className="text-xs font-bold text-red-500 hover:text-red-600 px-3 py-1 bg-red-50 rounded-full transition"
                                >
                                    LOGOUT
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link to="/login" className="text-sm font-bold text-slate-700 hover:text-violet-600">Log in</Link>
                                <Link to="/register" className="btn-primary hidden lg:inline-flex">
                                    Sign Up
                                </Link>
                                <Link to="/register" className="bg-slate-900 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-slate-800 transition shadow-lg shadow-slate-900/20 lg:hidden">
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Toggle */}
                    <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-slate-800">
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
                    {isOpen && (
                <div className="absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl border-t border-slate-100 p-6 shadow-xl md:hidden flex flex-col gap-4 animate-fade-in-up">
                    <Link to="/" className="text-lg font-medium text-slate-800">Home</Link>
                    {user?.role === 'admin' && <Link to="/admin" className="text-lg font-medium text-slate-800 flex items-center gap-2"><Shield size={18}/> Admin</Link>}
                    {user?.role === 'customer' && <Link to="/account" className="text-lg font-medium text-slate-800">Account</Link>}
                    <Link to="/products" className="text-lg font-medium text-slate-800">Collection</Link>
                    <hr className="border-slate-100" />
                    {!user ? (
                        <>
                            <Link to="/login" className="text-center py-3 rounded-xl bg-slate-100 text-slate-900 font-bold">Log in</Link>
                            <Link to="/register" className="text-center py-3 rounded-xl bg-violet-600 text-white font-bold shadow-lg shadow-violet-500/30">Sign Up Free</Link>
                        </>
                    ) : (
                        <button onClick={handleLogout} className="text-red-600 font-bold text-left">Log Out</button>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
