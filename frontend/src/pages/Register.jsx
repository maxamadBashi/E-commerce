import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await register(name, email, password, phone);
        if (result?.success) {
            navigate('/');
        } else {
            setError(result?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen bg-black flex relative overflow-hidden">
            {/* Background Texture */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-30"></div>

            {/* Gold Glow */}
            <div className="absolute bottom-0 right-1/2 w-[500px] h-[500px] bg-yellow-600/10 rounded-full blur-[120px]"></div>

            <div className="w-full flex items-center justify-center relative z-10 px-4 py-12">
                <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 p-12 shadow-2xl relative">
                    {/* Decorative Borders */}
                    <div className="absolute top-0 right-0 w-24 h-1 bg-gradient-to-l from-yellow-600 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-1 bg-gradient-to-r from-yellow-600 to-transparent"></div>

                    <div className="text-center mb-10">
                        <Link to="/" className="inline-flex items-center gap-2 mb-4">
                            <Sparkles className="text-yellow-500" size={24} />
                            <span className="font-display font-bold text-2xl text-white tracking-widest">LUXEMART</span>
                        </Link>
                        <h2 className="text-3xl text-white font-display mb-2">Private Registration</h2>
                        <p className="text-zinc-500 text-sm uppercase tracking-widest">Join the elite club</p>
                    </div>

                    {error && (
                        <div className="bg-red-900/20 border border-red-900/50 text-red-400 p-4 mb-8 text-center text-sm tracking-wide">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs uppercase tracking-widest text-zinc-500 ml-1">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    className="input-dark"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs uppercase tracking-widest text-zinc-500 ml-1">Phone</label>
                                <input
                                    type="text"
                                    className="input-dark"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>
                        </div>

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

                        <div className="pt-4">
                            <button
                                type="submit"
                                className="w-full py-4 btn-gold flex items-center justify-center gap-4 group"
                            >
                                Initiate Membership
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-zinc-600 text-xs uppercase tracking-widest">
                            Already a member? <Link to="/login" className="text-yellow-600 hover:text-yellow-400 font-bold ml-2 transition">Sign In</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
