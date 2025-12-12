import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            fetchWishlist();
        } else {
            setWishlist([]);
        }
    }, [user]);

    const fetchWishlist = async () => {
        try {
            const res = await api.get('/wishlist/read.php');
            setWishlist(res.data.records || []);
        } catch (error) {
            console.error("Failed to fetch wishlist", error);
        }
    };

    const addToWishlist = async (product) => {
        if (!user) return alert("Please login to save items.");

        // Optimistic update
        if (wishlist.some(item => item.id === product.id)) return;

        try {
            await api.post('/wishlist/add.php', { product_id: product.id });
            setWishlist([...wishlist, product]);
        } catch (error) {
            console.error(error);
        }
    };

    const removeFromWishlist = async (productId) => {
        try {
            await api.delete(`/wishlist/remove.php?product_id=${productId}`);
            setWishlist(wishlist.filter(item => item.id !== productId));
        } catch (error) {
            console.error(error);
        }
    };

    const isInWishlist = (productId) => {
        return wishlist.some(item => item.id === productId);
    };

    return (
        <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};
