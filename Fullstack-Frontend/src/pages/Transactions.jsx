import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Edit2, Plus, ArrowLeft, ArrowRight, RefreshCcw, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { API_URL } from '../config';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [recurring, setRecurring] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || {});
    const [showModal, setShowModal] = useState(false);
    const [isRecurringMode, setIsRecurringMode] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const navigate = useNavigate();

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        amount: '',
        type: 'expense',
        category: 'Food'
    });

    // Categories
    const categories = ['Housing', 'Food', 'Transport', 'Entertainment', 'Loans', 'Health', 'Education', 'Shopping', 'Other'];

    useEffect(() => {
        if (user && user.id) {
            fetchTransactions();
            fetchRecurring();
        }
    }, [user]);

    const fetchTransactions = () => {
        axios.get(`${API_URL}/transactions/get/${user.id}`)
            .then(res => {
                setTransactions(res.data);
                setLoading(false);
            })
            .catch(err => console.error(err));
    };

    const fetchRecurring = () => {
        axios.get(`${API_URL}/transactions/recurring/get/${user.id}`)
            .then(res => {
                setRecurring(res.data);
            })
            .catch(err => console.error(err));
    };

    const handleDelete = (id, isRec) => {
        if (confirm('Are you sure you want to delete this?')) {
            const endpoint = isRec
                ? `${API_URL}/transactions/recurring/delete/${id}`
                : `${API_URL}/transactions/delete/${id}`;

            axios.delete(endpoint)
                .then(() => {
                    if (isRec) fetchRecurring();
                    else fetchTransactions();
                })
                .catch(err => alert('Error deleting item'));
        }
    };

    const handleEdit = (tx) => {
        setFormData({
            title: tx.title,
            amount: tx.amount,
            type: tx.type,
            category: tx.category
        });
        setEditingId(tx._id);
        setIsRecurringMode(false);
        setShowModal(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingId && !isRecurringMode) {
            axios.put(`${API_URL}/transactions/update/${editingId}`, formData)
                .then(res => {
                    setShowModal(false);
                    setFormData({ title: '', amount: '', type: 'expense', category: 'Food' });
                    setEditingId(null);
                    fetchTransactions();
                })
                .catch(err => alert('Error updating item'));
            return;
        }

        const endpoint = isRecurringMode
            ? `${API_URL}/transactions/recurring/add`
            : `${API_URL}/transactions/add`;

        axios.post(endpoint, { ...formData, userId: user.id })
            .then(res => {
                setShowModal(false);
                setFormData({ title: '', amount: '', type: 'expense', category: 'Food' });
                if (isRecurringMode) fetchRecurring();
                else fetchTransactions();
            })
            .catch(err => alert('Error adding item'));
    };

    return (
        <div className="flex h-screen bg-gray-50 font-sans text-gray-800">
            <Sidebar sidebarOpen={sidebarOpen} user={user} activeItem="Transactions" />

            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 hover:bg-gray-100 rounded-full">
                            <Menu className="w-6 h-6 text-gray-600" />
                        </button>
                        <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => { setIsRecurringMode(true); setShowModal(true); }}
                            className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors font-medium"
                        >
                            <RefreshCcw className="w-4 h-4" /> Fixed Items
                        </button>
                        <button
                            onClick={() => { setIsRecurringMode(false); setShowModal(true); }}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-sm"
                        >
                            <Plus className="w-4 h-4" /> Add Transaction
                        </button>
                    </div>
                </div>

                <div className="p-6 max-w-7xl mx-auto w-full space-y-8">

                    {/* Fixed / Recurring Section */}
                    {recurring.length > 0 && (
                        <div className="bg-white rounded-xl shadow-sm border border-purple-100 overflow-hidden">
                            <div className="px-6 py-4 bg-purple-50 border-b border-purple-100 flex justify-between items-center">
                                <h3 className="font-bold text-purple-800 flex items-center gap-2">
                                    <RefreshCcw className="w-4 h-4" /> Fixed Monthly Items
                                </h3>
                                <span className="text-xs text-purple-600 font-medium">Auto-added at start of month</span>
                            </div>
                            <div className="divide-y divide-purple-50">
                                {recurring.map(rec => (
                                    <div key={rec._id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${rec.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                                {rec.type === 'income' ? <ArrowLeft className="w-5 h-5 -rotate-45" /> : <ArrowRight className="w-5 h-5 -rotate-45" />}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{rec.title}</p>
                                                <p className="text-xs text-gray-500">{rec.category} • Monthly</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <span className={`font-bold ${rec.type === 'income' ? 'text-green-600' : 'text-gray-900'}`}>
                                                {rec.type === 'income' ? '+' : '-'}${rec.amount}
                                            </span>
                                            <button onClick={() => handleDelete(rec._id, true)} className="text-gray-400 hover:text-red-500">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Transactions Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <h3 className="font-bold text-gray-800">All Transactions</h3>
                        </div>
                        {loading ? (
                            <div className="p-8 text-center text-gray-500">Loading...</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-gray-600">
                                    <thead className="bg-gray-50 border-b border-gray-100">
                                        <tr>
                                            <th className="px-6 py-3 font-medium">Title</th>
                                            <th className="px-6 py-3 font-medium">Category</th>
                                            <th className="px-6 py-3 font-medium">Date</th>
                                            <th className="px-6 py-3 font-medium text-right">Amount</th>
                                            <th className="px-6 py-3 font-medium text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {transactions.map(tx => (
                                            <tr key={tx._id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 font-medium text-gray-900">{tx.title}</td>
                                                <td className="px-6 py-4">
                                                    <span className="px-2 py-1 bg-gray-100 rounded-md text-xs font-medium text-gray-600 border border-gray-200">
                                                        {tx.category}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-gray-500">{new Date(tx.date).toLocaleDateString()}</td>
                                                <td className={`px-6 py-4 text-right font-bold ${tx.type === 'income' ? 'text-green-600' : 'text-gray-900'}`}>
                                                    {tx.type === 'income' ? '+' : '-'}${tx.amount}
                                                </td>
                                                <td className="px-6 py-4 text-right flex justify-end gap-2">
                                                    <button onClick={() => handleEdit(tx)} className="text-gray-400 hover:text-blue-500 transition-colors">
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => handleDelete(tx._id, false)} className="text-gray-400 hover:text-red-500 transition-colors">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {transactions.length === 0 && (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                                    No transactions found. Add one to get started!
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {/* Modal */}
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                                <h3 className="font-bold text-lg text-gray-900">
                                    {isRecurringMode ? 'Add Fixed Monthly Item' : (editingId ? 'Edit Transaction' : 'Add New Transaction')}
                                </h3>
                                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                                    &times;
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                        placeholder={isRecurringMode ? "e.g. Monthly Salary" : "e.g. Grocery Shopping"}
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                                            <input
                                                type="number"
                                                required
                                                min="0"
                                                step="0.01"
                                                className="w-full rounded-lg border-gray-300 border p-2.5 pl-7 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                                placeholder="0.00"
                                                value={formData.amount}
                                                onChange={e => setFormData({ ...formData, amount: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                        <select
                                            className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
                                            value={formData.type}
                                            onChange={e => setFormData({ ...formData, type: e.target.value })}
                                        >
                                            <option value="expense">Expense</option>
                                            <option value="income">Income</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <select
                                        className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition-colors mt-2"
                                >
                                    {isRecurringMode ? 'Set Recurring Item' : (editingId ? 'Update Transaction' : 'Add Transaction')}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Transactions;
