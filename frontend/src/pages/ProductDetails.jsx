import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { ShoppingBag, ArrowLeft, Truck, ShieldCheck, Check, Star } from 'lucide-react';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [added, setAdded] = useState(false);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await api.get(`/products/read_one.php?id=${id}`);
                setProduct(res.data);
            } catch (err) {
                console.error(err);
                // navigate('/'); // optional: redirect on fail
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        // Add multiple times based on quantity
        for (let i = 0; i < quantity; i++) {
            addToCart(product);
        }
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-500">Loading details...</div>;
    if (!product) return <div className="min-h-screen flex items-center justify-center text-slate-500">Product not found.</div>;

    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-20">
            <div className="container-max">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-violet-600 mb-8 font-medium transition">
                    <ArrowLeft size={20} /> Back to Browse
                </button>

                <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 overflow-hidden border border-white">
                    <div className="flex flex-col lg:flex-row">
                        {/* Image Section */}
                        <div className="lg:w-1/2 bg-slate-100 relative min-h-[500px]">
                            {product.image_url ? (
                                <img src={product.image_url} alt={product.title} className="absolute inset-0 w-full h-full object-cover" />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                                    <ShoppingBag size={80} />
                                </div>
                            )}
                        </div>

                        {/* Info Section */}
                        <div className="lg:w-1/2 p-10 lg:p-14 flex flex-col justify-center">
                            {product.category_name && (
                                <span className="inline-block px-4 py-2 rounded-full bg-violet-50 text-violet-700 font-bold text-xs uppercase tracking-wider mb-6 w-fit">
                                    {product.category_name}
                                </span>
                            )}

                            <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-6 leading-tight">
                                {product.title}
                            </h1>

                            <div className="flex items-center gap-6 mb-8 border-b border-slate-100 pb-8">
                                <span className="text-4xl font-bold text-slate-900">${product.price}</span>
                                <div className="flex items-center gap-1">
                                    <Star size={20} className="fill-current text-yellow-400" />
                                    <Star size={20} className="fill-current text-yellow-400" />
                                    <Star size={20} className="fill-current text-yellow-400" />
                                    <Star size={20} className="fill-current text-yellow-400" />
                                    <Star size={20} className="fill-current text-yellow-400" />
                                    <span className="ml-2 text-sm font-bold text-slate-500">(128 Reviews)</span>
                                </div>
                            </div>

                            <p className="text-lg text-slate-600 leading-relaxed mb-10">
                                {product.description || "No description available for this product. High quality, premium item designed for your lifestyle."}
                            </p>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-4 mb-10">
                                <div className="flex items-center bg-slate-50 rounded-xl px-4 border border-slate-200">
                                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-slate-400 hover:text-slate-900 text-xl font-bold px-2">-</button>
                                    <span className="w-12 text-center font-bold text-slate-900">{quantity}</span>
                                    <button onClick={() => setQuantity(quantity + 1)} className="text-slate-400 hover:text-slate-900 text-xl font-bold px-2">+</button>
                                </div>
                                <button
                                    onClick={handleAddToCart}
                                    className="flex-1 py-4 bg-slate-900 text-white font-bold rounded-xl shadow-lg shadow-slate-900/20 hover:bg-violet-600 hover:shadow-violet-600/20 transition-all flex items-center justify-center gap-3"
                                >
                                    {added ? (
                                        <>Added to Cart <Check size={20} /></>
                                    ) : (
                                        <>Add to Cart <ShoppingBag size={20} /></>
                                    )}
                                </button>
                            </div>

                            {/* Trust Badges */}
                            <div className="grid grid-cols-2 gap-4 text-sm text-slate-500">
                                <div className="flex items-center gap-3">
                                    <Truck className="text-violet-600" size={20} />
                                    <span>Free Shipping Worldwide</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <ShieldCheck className="text-violet-600" size={20} />
                                    <span>2 Year Warranty</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
