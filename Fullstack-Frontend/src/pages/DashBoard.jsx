import React, { useState } from 'react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  Wallet, TrendingUp, TrendingDown, DollarSign, Calendar, Bell, Search, Menu, ArrowUpRight, ArrowDownRight
} from 'lucide-react';

// --- Mock Data ---
const monthlyData = [
  { name: 'Jan', income: 4000, expense: 2400 },
  { name: 'Feb', income: 3000, expense: 1398 },
  { name: 'Mar', income: 2000, expense: 9800 }, // High expense month
  { name: 'Apr', income: 2780, expense: 3908 },
  { name: 'May', income: 1890, expense: 4800 },
  { name: 'Jun', income: 2390, expense: 3800 },
];

const categoryData = [
  { name: 'Housing', value: 1200, color: '#3b82f6' }, // Blue
  { name: 'Food', value: 450, color: '#10b981' },    // Green
  { name: 'Transport', value: 300, color: '#f59e0b' }, // Amber
  { name: 'Entertainment', value: 200, color: '#ef4444' }, // Red
];

const recentTransactions = [
  { id: 1, title: 'Grocery Market', date: 'Today, 10:23 AM', amount: -85.20, type: 'expense' },
  { id: 2, title: 'Freelance Payment', date: 'Yesterday, 4:00 PM', amount: +1250.00, type: 'income' },
  { id: 3, title: 'Netflix Subscription', date: 'Nov 10, 2025', amount: -14.99, type: 'expense' },
  { id: 4, title: 'Electric Bill', date: 'Nov 08, 2025', amount: -120.50, type: 'expense' },
];

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 text-gray-800 font-sans">

      {/* --- Sidebar (Mobile responsive) --- */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-center h-20 border-b border-gray-100">
            <h1 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
              <Wallet className="w-8 h-8" /> FinTrack
            </h1>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2">
            {['Dashboard', 'Transactions', 'Budget', 'Goals', 'Reports'].map((item, index) => (
              <a key={item} href="#" className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${index === 0 ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                {item}
              </a>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">JD</div>
              <div>
                <p className="text-sm font-semibold">John Doe</p>
                <p className="text-xs text-gray-500">Free Plan</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

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
                    <h3 className="text-3xl font-bold text-gray-900">$24,562.00</h3>
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
                    <h3 className="text-3xl font-bold text-gray-900">$4,250.00</h3>
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
                    <h3 className="text-3xl font-bold text-gray-900">$1,840.50</h3>
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
                    <span className="text-2xl font-bold text-gray-800">$2.1k</span>
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
                      <th className="px-6 py-3 font-medium">Status</th>
                      <th className="px-6 py-3 font-medium text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {recentTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-900">{tx.title}</td>
                        <td className="px-6 py-4">{tx.date}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Completed</span>
                        </td>
                        <td className={`px-6 py-4 text-right font-bold ${tx.type === 'income' ? 'text-green-600' : 'text-gray-900'}`}>
                          {tx.type === 'income' ? '+' : ''}${Math.abs(tx.amount).toFixed(2)}
                        </td>
                      </tr>
                    ))}
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