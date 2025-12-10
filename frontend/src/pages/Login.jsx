import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await login(email, password);
        if (result?.success) {
            navigate('/');
        } else {
            setError(result?.message || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen bg-black flex relative overflow-hidden">
            {/* Background Texture */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-30"></div>

            {/* Gold Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-yellow-600/20 rounded-full blur-[120px]"></div>

            <div className="w-full flex items-center justify-center relative z-10 px-4">
                <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 p-12 shadow-2xl relative">
                    {/* Decorative Corner */}
                    <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-yellow-600"></div>
                    <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-yellow-600"></div>

                    <div className="text-center mb-12">
                        <Link to="/" className="inline-flex items-center gap-2 mb-6">
                            <Sparkles className="text-yellow-500" size={24} />
                            <span className="font-display font-bold text-2xl text-white tracking-widest">LUXEMART</span>
                        </Link>
                        <h2 className="text-4xl text-white mb-2 font-display">Welcome Back</h2>
                        <p className="text-zinc-500 text-sm uppercase tracking-widest">Sign in to your account</p>
                    </div>

                    {error && (
                        <div className="bg-red-900/20 border border-red-900/50 text-red-400 p-4 mb-8 text-center text-sm tracking-wide">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-1">
                            <label className="text-xs uppercase tracking-widest text-zinc-500 ml-1">Email Address</label>
                            <input
                                type="email"
                                required
                                className="input-dark"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs uppercase tracking-widest text-zinc-500 ml-1">Password</label>
                            <input
                                type="password"
                                required
                                className="input-dark"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center justify-between text-xs uppercase tracking-wider text-zinc-500 pt-2">
                            <label className="flex items-center gap-2 cursor-pointer hover:text-yellow-500 transition">
                                <input type="checkbox" className="bg-transparent border-zinc-700 rounded-none checked:bg-yellow-600" />
                                <span>Remember me</span>
                            </label>
                            <a href="#" className="hover:text-yellow-500 transition">Forgot details?</a>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-4 btn-gold flex items-center justify-center gap-4 group mt-8"
                        >
                            Access Account
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>

                    <div className="mt-12 text-center">
                        <p className="text-zinc-600 text-xs uppercase tracking-widest">
                            New Member? <Link to="/register" className="text-yellow-600 hover:text-yellow-400 font-bold ml-2 transition">Apply for Access</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
