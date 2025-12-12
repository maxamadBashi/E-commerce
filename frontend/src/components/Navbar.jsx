import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { user, logout } = useAuth();
    const { cartCount } = useCart();
    const navigate = useNavigate();

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
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'py-4' : 'py-6'
                }`}
        >
            <div className="container-max">
                <nav
                    className={`mx-auto rounded-full transition-all duration-300 px-6 py-3 flex items-center justify-between ${scrolled
                            ? 'bg-white/80 backdrop-blur-md shadow-lg shadow-slate-900/5 hover:bg-white/90 border border-white/50'
                            : 'bg-transparent'
                        }`}
                >
                    {/* Logo */}
                    <Link to="/" className="text-2xl font-display font-bold text-slate-900 tracking-tight">
                        Luxe<span className="text-violet-600">Mart</span>.
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link to="/" className="text-sm font-medium text-slate-600 hover:text-violet-600 transition">Shop</Link>
                        {user && <Link to="/profile" className="text-sm font-medium text-slate-600 hover:text-violet-600 transition">Orders</Link>}
                        {user?.role === 'admin' && (
                            <Link to="/admin" className="text-sm font-bold text-gold-600 hover:text-gold-700 transition flex items-center gap-1">
                                <LayoutDashboard size={16} /> Admin
                            </Link>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link to="/cart" className="relative p-2 text-slate-800 hover:text-violet-600 transition">
                            <ShoppingCart size={22} />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-violet-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full animate-bounce">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {user ? (
                            <div className="flex items-center gap-4 pl-4 border-l border-slate-200">
                                <Link to="/profile" className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-xs">
                                        {user.name.charAt(0)}
                                    </div>
                                </Link>
                                <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 transition">
                                    <LogOut size={20} />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4 pl-4 border-l border-slate-200">
                                <Link to="/login" className="text-sm font-bold text-slate-700 hover:text-violet-600">Log In</Link>
                                <Link to="/register" className="btn-primary px-6 py-2 rounded-full text-xs uppercase tracking-wider">
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Toggle */}
                    <button className="md:hidden text-slate-800" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </nav>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="absolute top-full left-0 right-0 bg-white border-b border-slate-100 p-6 md:hidden shadow-xl animate-fade-in-up">
                    <div className="flex flex-col gap-4">
                        <Link to="/" className="text-lg font-medium text-slate-800" onClick={() => setMobileMenuOpen(false)}>Shop</Link>
                        {user && (
                            <Link to="/profile" className="text-lg font-medium text-slate-800" onClick={() => setMobileMenuOpen(false)}>My Orders</Link>
                        )}
                        {user?.role === 'admin' && (
                            <Link to="/admin" className="text-lg font-bold text-gold-600" onClick={() => setMobileMenuOpen(false)}>Admin Dashboard</Link>
                        )}
                        <Link to="/cart" className="text-lg font-medium text-slate-800 flex items-center justify-between" onClick={() => setMobileMenuOpen(false)}>
                            Cart <span className="bg-violet-100 text-violet-700 px-2 py-1 rounded-full text-xs font-bold">{cartCount}</span>
                        </Link>
                        <hr className="border-slate-100" />
                        {user ? (
                            <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="text-left text-lg font-medium text-red-500">
                                Logout
                            </button>
                        ) : (
                            <div className="grid grid-cols-2 gap-4">
                                <Link to="/login" className="btn-ghost justify-center" onClick={() => setMobileMenuOpen(false)}>Log In</Link>
                                <Link to="/register" className="btn-primary justify-center" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
