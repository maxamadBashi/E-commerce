import { DollarSign, Package, ShoppingBag, Users } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
        <div>
            <p className="text-slate-500 text-sm font-medium uppercase tracking-wider mb-1">{title}</p>
            <h3 className="text-3xl font-bold text-slate-900">{value}</h3>
        </div>
        <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center text-white`}>
            <Icon size={24} />
        </div>
    </div>
);

const AdminDashboard = () => {
    // In a real app, fetch these stats from the backend
    return (
        <div className="animate-fade-in-up">
            <h1 className="text-3xl font-display font-bold text-slate-900 mb-8">Dashboard Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Total Sales" value="$12,450" icon={DollarSign} color="bg-emerald-500" />
                <StatCard title="Total Orders" value="156" icon={ShoppingBag} color="bg-violet-500" />
                <StatCard title="Products" value="48" icon={Package} color="bg-blue-500" />
                <StatCard title="Customers" value="342" icon={Users} color="bg-amber-500" />
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 min-h-[400px]">
                <h3 className="font-bold text-lg mb-4">Recent Activity</h3>
                <div className="text-slate-500 text-center py-20 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    Chart Integration Coming Soon
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
