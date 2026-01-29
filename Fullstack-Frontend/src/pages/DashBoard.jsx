import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  Wallet, TrendingUp, TrendingDown, DollarSign, Calendar, Bell, Search, Menu, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { API_URL } from '../config';

// --- Mock Data ---
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1'];



const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || { name: 'User', email: 'user@example.com' });
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ totalBalance: 0, income: 0, expense: 0 });
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    if (user && user.id) {
      axios.get(`${API_URL}/transactions/get/${user.id}`)
        .then(res => {
          const data = res.data;
          setTransactions(data);
          let total = 0;
          let inc = 0;
          let exp = 0;
          data.forEach(t => {
            if (t.type === 'income') {
              total += t.amount;
              inc += t.amount;
            } else {
              total -= t.amount;
              exp += t.amount;
            }
          });
          setSummary({ totalBalance: total, income: inc, expense: exp });
          processChartData(data);
        })
        .catch(err => console.error(err));
    }

    // Check for recurring transactions lazy load
    if (user && user.id) {
      axios.post(`${API_URL}/transactions/recurring/process`, { userId: user.id })
        .then(res => {
          if (res.data.count > 0) {
            console.log("Processed " + res.data.count + " recurring transactions.");
            // Optional: reload transactions if we want to show them immediately, but user might not notice.
          }
        })
        .catch(err => console.error("Error processing recurring:", err));
    }
  }, [user]);

  const processChartData = (data) => {
    // 1. Process Monthly Data
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentYear = new Date().getFullYear();
    const monthlyMap = new Map();

    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = `${monthNames[d.getMonth()]}`;
      monthlyMap.set(key, { name: key, income: 0, expense: 0 });
    }

    data.forEach(t => {
      const d = new Date(t.date);
      const key = monthNames[d.getMonth()];
      if (monthlyMap.has(key)) { // Only track if within our view window
        const entry = monthlyMap.get(key);
        if (t.type === 'income') entry.income += t.amount;
        else entry.expense += t.amount;
      }
    });
    setMonthlyData(Array.from(monthlyMap.values()));

    // 2. Process Category Data (Expenses only)
    const catMap = new Map();
    data.filter(t => t.type === 'expense').forEach(t => {
      const val = catMap.get(t.category) || 0;
      catMap.set(t.category, val + t.amount);
    });

    const catArray = Array.from(catMap).map(([name, value], index) => ({
      name, value, color: COLORS[index % COLORS.length]
    }));
    setCategoryData(catArray);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 text-gray-800 font-sans">

      {/* --- Sidebar (Mobile responsive) --- */}
      <Sidebar sidebarOpen={sidebarOpen} user={user} activeItem="Dashboard" />

      {/* --- Main Content --- */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top Header */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-6 lg:px-8">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 rounded-md hover:bg-gray-100">
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex items-center bg-gray-100 rounded-lg px-4 py-2 w-full max-w-md mx-4">
            <Search className="w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Search transactions..." className="bg-transparent border-none outline-none ml-2 w-full text-sm" />
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </header>

        {/* Scrollable Dashboard Area */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">

          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Financial Overview</h2>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Total Balance */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Total Balance</p>
                    <h3 className="text-3xl font-bold text-gray-900">${summary.totalBalance.toFixed(2)}</h3>
                  </div>
                  <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                    <DollarSign className="w-6 h-6" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-green-600">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  <span>+2.5% from last month</span>
                </div>
              </div>

              {/* Income */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Monthly Income</p>
                    <h3 className="text-3xl font-bold text-gray-900">${summary.income.toFixed(2)}</h3>
                  </div>
                  <div className="p-2 bg-green-50 rounded-lg text-green-600">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>Nov 1 - Nov 30</span>
                </div>
              </div>

              {/* Expenses */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Monthly Expenses</p>
                    <h3 className="text-3xl font-bold text-gray-900">${summary.expense.toFixed(2)}</h3>
                  </div>
                  <div className="p-2 bg-red-50 rounded-lg text-red-600">
                    <TrendingDown className="w-6 h-6" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-red-600">
                  <ArrowDownRight className="w-4 h-4 mr-1" />
                  <span>+4.1% higher than usual</span>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">

              {/* Bar Chart */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
                <h3 className="text-lg font-bold mb-4">Income vs Expenses</h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} />
                      <Tooltip />
                      <Bar dataKey="income" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="expense" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Pie Chart */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold mb-4">Spending Categories</h3>
                <div className="h-64 w-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Center Text for Pie */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-bold text-gray-800">${summary.expense}</span>
                    <span className="text-xs text-gray-500">Total Spent</span>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  {categoryData.map((cat) => (
                    <div key={cat.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: cat.color }}></span>
                        {cat.name}
                      </div>
                      <span className="font-medium">${cat.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Transactions Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-bold">Recent Transactions</h3>
                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">View All</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 font-medium">Transaction</th>
                      <th className="px-6 py-3 font-medium">Date</th>
                      <th className="px-6 py-3 font-medium text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {transactions.slice(0, 5).map((tx) => (
                      <tr key={tx._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-900">{tx.title}</td>
                        <td className="px-6 py-4">{new Date(tx.date).toLocaleDateString()}</td>
                        <td className={`px-6 py-4 text-right font-bold ${tx.type === 'income' ? 'text-green-600' : 'text-gray-900'}`}>
                          {tx.type === 'income' ? '+' : ''}${Math.abs(tx.amount).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                    {transactions.length === 0 && (
                      <tr>
                        <td colSpan="4" className="px-6 py-4 text-center text-gray-500">No transactions found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;