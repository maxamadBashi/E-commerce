import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, CreditCard } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity } = useCart();

    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const tax = subtotal * 0.05;
    const total = subtotal + tax;

    if (cartItems.length === 0) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6 animate-fade-in-up">
                <div className="w-32 h-32 bg-slate-100 rounded-full flex items-center justify-center mb-8 animate-pulse">
                    <ShoppingBag size={48} className="text-slate-400" />
                </div>
                <h2 className="text-4xl font-display font-bold text-slate-900 mb-4">Your Bag is Empty</h2>
                <p className="text-lg text-slate-500 mb-10 max-w-lg">Looks like you haven't decided on an item yet. Check out our latest collection.</p>
                <Link to="/" className="px-10 py-4 bg-slate-900 text-white rounded-full font-bold shadow-xl shadow-slate-900/20 hover:scale-105 transition-transform">
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6 py-32 animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-12 text-slate-900">Shopping Bag</h1>

            <div className="flex flex-col lg:flex-row gap-16">
                {/* Cart Items List */}
                <div className="lg:w-2/3 space-y-8">
                    {cartItems.map(item => (
                        <div key={item.id} className="flex gap-8 group">
                            {/* Image */}
                            <div className="w-32 h-40 bg-slate-100 rounded-2xl overflow-hidden flex-shrink-0">
                                {item.image_url ? (
                                    <img src={item.image_url} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-400">IMG</div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-grow flex flex-col justify-between py-2">
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-display font-bold text-2xl text-slate-900">{item.title}</h3>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-slate-400 hover:text-red-500 transition"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                    <p className="text-slate-500 text-sm font-medium uppercase tracking-wide">{item.category_name}</p>
                                </div>

                                <div className="flex justify-between items-end">
                                    <div className="flex items-center gap-4 bg-slate-50 rounded-full px-4 py-2 border border-slate-200">
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className="w-8 h-8 flex items-center justify-center text-slate-600 hover:text-slate-900"
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <span className="font-bold w-4 text-center text-slate-900">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="w-8 h-8 flex items-center justify-center text-slate-600 hover:text-slate-900"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                    <div className="font-bold text-2xl text-slate-900">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary Panel */}
                <div className="lg:w-1/3">
                    <div className="glass-card p-10 rounded-3xl sticky top-32">
                        <h2 className="font-display font-bold text-2xl mb-8">Order Summary</h2>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-slate-600">
                                <span>Subtotal</span>
                                <span className="font-medium text-slate-900">${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-slate-600">
                                <span>Tax (5%)</span>
                                <span className="font-medium text-slate-900">${tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-slate-600">
                                <span>Shipping</span>
                                <span className="text-green-600 font-bold uppercase text-sm">Free</span>
                            </div>
                        </div>

                        <div className="border-t border-slate-200 pt-6 mb-8">
                            <div className="flex justify-between items-end">
                                <span className="text-slate-600 font-medium">Total for Order</span>
                                <span className="text-4xl font-display font-bold text-slate-900">${total.toFixed(2)}</span>
                            </div>
                        </div>

                        <button className="w-full py-5 bg-violet-600 text-white rounded-2xl font-bold shadow-xl shadow-violet-500/30 hover:bg-violet-700 transition flex items-center justify-center gap-3 group">
                            Checkout Securely
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>

                        <div className="mt-6 flex items-center justify-center gap-2 text-slate-400 text-sm">
                            <CreditCard size={16} />
                            <span>Encrypted & Secure Payment</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
