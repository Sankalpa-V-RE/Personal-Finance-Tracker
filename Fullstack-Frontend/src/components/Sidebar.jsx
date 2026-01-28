import React from 'react';
import { Wallet, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ sidebarOpen, user, activeItem }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            navigate('/login');
        }
    };

    return (
        <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="h-full flex flex-col">
                <div className="flex items-center justify-center h-20 border-b border-gray-100">
                    <h1 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
                        <Wallet className="w-8 h-8" /> Piggy Bank
                    </h1>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2">
                    {[
                        { name: 'Dashboard', path: '/dashboard' },
                        { name: 'Transactions', path: '/transactions' },
                        { name: 'Budget', path: '#' },
                        { name: 'Goals', path: '#' },
                        { name: 'Reports', path: '#' }
                    ].map((item) => (
                        <a
                            key={item.name}
                            href={item.path}
                            className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeItem === item.name ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                        >
                            {item.name}
                        </a>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                            <p className="text-sm font-semibold">{user.name || 'User'}</p>
                            <p className="text-xs text-gray-500">Free Plan</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-colors"
                    >
                        <LogOut className="w-4 h-4" /> Logout
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
