import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gradient-to-t from-white to-slate-50 border-t pt-16 pb-8">
            <div className="container-max">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">E</div>
                            <span className="font-display font-bold text-2xl text-gray-900">EcoStore</span>
                        </div>
                        <p className="text-gray-500 leading-relaxed mb-6">
                            Your one-stop destination for premium products. We bring quality to your doorstep with minimal effort.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="btn-ghost w-10 h-10 p-0 rounded-full flex items-center justify-center">
                                <Facebook size={18} />
                            </a>
                            <a href="#" className="btn-ghost w-10 h-10 p-0 rounded-full flex items-center justify-center">
                                <Twitter size={18} />
                            </a>
                            <a href="#" className="btn-ghost w-10 h-10 p-0 rounded-full flex items-center justify-center">
                                <Instagram size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bold text-gray-900 text-lg mb-6">Quick Links</h4>
                        <ul className="space-y-4 text-gray-600">
                            <li><a href="#" className="hover:text-primary transition">Home</a></li>
                            <li><a href="#" className="hover:text-primary transition">Shop</a></li>
                            <li><a href="#" className="hover:text-primary transition">About Us</a></li>
                            <li><a href="#" className="hover:text-primary transition">Contact</a></li>
                        </ul>
                    </div>

                    {/* Customer Care */}
                    <div>
                        <h4 className="font-bold text-gray-900 text-lg mb-6">Customer Care</h4>
                        <ul className="space-y-4 text-gray-600">
                            <li><a href="#" className="hover:text-primary transition">FAQ</a></li>
                            <li><a href="#" className="hover:text-primary transition">Shipping Policy</a></li>
                            <li><a href="#" className="hover:text-primary transition">Returns & Refunds</a></li>
                            <li><a href="#" className="hover:text-primary transition">Privacy Policy</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-bold text-gray-900 text-lg mb-6">Get In Touch</h4>
                        <ul className="space-y-4 text-gray-600">
                            <li className="flex items-center gap-3">
                                <MapPin size={20} className="text-primary" />
                                <span>123 Market St, Mogadishu, Somalia</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={20} className="text-primary" />
                                <span>+252 61 500 0000</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail size={20} className="text-primary" />
                                <span>support@ecostore.so</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t pt-8 text-center text-gray-500 text-sm">
                    &copy; {new Date().getFullYear()} EcoStore. All rights reserved. Built with React & PHP.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
