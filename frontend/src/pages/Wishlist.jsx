import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Trash2, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Wishlist = () => {
    const { wishlist, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();
    const navigate = useNavigate();

    if (wishlist.length === 0) {
        return (
            <div className="min-h-screen bg-slate-50 pt-32 pb-20 flex flex-col items-center justify-center text-center px-4">
                <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 mb-6">
                    <Heart size={48} />
                </div>
                <h2 className="text-3xl font-display font-bold text-slate-900 mb-4">Your Wishlist is Empty</h2>
                <p className="text-slate-500 mb-8 max-w-md">Save items you love to revisit them later.</p>
                <button onClick={() => navigate('/')} className="btn-primary px-8 py-3">Start Shopping</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-20 animate-fade-in-up">
            <div className="container-max">
                <h1 className="text-4xl font-display font-bold text-slate-900 mb-8 flex items-center gap-3">
                    <Heart className="text-rose-500 fill-current" /> My Wishlist
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlist.map(product => (
                        <div key={product.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex gap-4 group">
                            <div
                                className="w-24 h-24 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0 cursor-pointer"
                                onClick={() => navigate(`/product/${product.id}`)}
                            >
                                {product.image_url ? (
                                    <img src={product.image_url} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-slate-300"><ShoppingBag size={20} /></div>
                                )}
                            </div>

                            <div className="flex-1 flex flex-col justify-between">
                                <div>
                                    <h3 className="font-bold text-slate-900 line-clamp-1 cursor-pointer hover:text-violet-600" onClick={() => navigate(`/product/${product.id}`)}>
                                        {product.title}
                                    </h3>
                                    <p className="font-bold text-slate-500 text-sm mt-1">${product.price}</p>
                                </div>

                                <div className="flex gap-2 mt-3">
                                    <button
                                        onClick={() => addToCart(product)}
                                        className="flex-1 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-violet-600 transition"
                                    >
                                        Add to Cart
                                    </button>
                                    <button
                                        onClick={() => removeFromWishlist(product.id)}
                                        className="w-10 flex items-center justify-center bg-slate-100 text-slate-500 rounded-lg hover:bg-red-50 hover:text-red-500 transition"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Wishlist;
