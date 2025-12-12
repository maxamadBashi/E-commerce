import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useState } from 'react';

const Checkout = () => {
    const { cart, cartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    if (cart.length === 0) {
        return (
            <div className="container-max py-20 text-center">
                <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
                <button onClick={() => navigate('/')} className="btn-primary">Browse Products</button>
            </div>
        );
    }

    const handlePlaceOrder = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        setLoading(true);
        try {
            await api.post('/orders/create.php', {
                items: cart.map(item => ({
                    id: item.id,
                    quantity: item.quantity,
                    price: item.price
                }))
            });
            clearCart();
            navigate('/profile');
            alert('Order placed successfully!');
        } catch (error) {
            console.error(error);
            alert('Failed to place order.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-max py-12 animate-fade-in-up">
            <h1 className="text-4xl font-display font-bold text-slate-900 mb-8">Checkout</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Order Summary */}
                <div className="glass-card p-8 rounded-2xl h-fit">
                    <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                    <ul className="space-y-4 mb-6">
                        {cart.map(item => (
                            <li key={item.id} className="flex justify-between items-center border-b border-slate-100 pb-4">
                                <div>
                                    <p className="font-bold text-slate-800">{item.title}</p>
                                    <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                                </div>
                                <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="flex justify-between items-center text-2xl font-bold pt-4 border-t border-slate-200">
                        <span>Total</span>
                        <span>${cartTotal.toFixed(2)}</span>
                    </div>
                </div>

                {/* Shipping / Payment Info (Mock) */}
                <div className="space-y-8">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                        <h2 className="text-xl font-bold mb-6">Shipping Information</h2>
                        <div className="space-y-4">
                            <input type="text" placeholder="Full Name" className="w-full p-4 bg-slate-50 rounded-xl outline-none border focus:border-violet-500" defaultValue={user?.name} />
                            <input type="text" placeholder="Address" className="w-full p-4 bg-slate-50 rounded-xl outline-none border focus:border-violet-500" />
                            <div className="grid grid-cols-2 gap-4">
                                <input type="text" placeholder="City" className="w-full p-4 bg-slate-50 rounded-xl outline-none border focus:border-violet-500" />
                                <input type="text" placeholder="ZIP Code" className="w-full p-4 bg-slate-50 rounded-xl outline-none border focus:border-violet-500" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                        <h2 className="text-xl font-bold mb-6">Payment Method</h2>
                        <div className="p-4 bg-green-50 text-green-700 rounded-xl mb-4 text-sm font-bold flex items-center gap-2">
                            ✓ Cash on Delivery (Pay when you receive)
                        </div>
                        <button
                            onClick={handlePlaceOrder}
                            disabled={loading}
                            className="w-full btn-primary py-4 text-lg shadow-xl shadow-violet-500/20"
                        >
                            {loading ? 'Processing...' : 'Checkout Securely'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
