import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col relative">
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50 to-white" />
                <div className="absolute -left-20 top-10 w-80 h-80 bg-violet-200/30 blur-3xl" />
                <div className="absolute right-0 bottom-10 w-96 h-96 bg-blue-200/30 blur-3xl" />
            </div>

            <Navbar />
            <main className="flex-grow pt-24">
                <div className="container-max">{children}</div>
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
