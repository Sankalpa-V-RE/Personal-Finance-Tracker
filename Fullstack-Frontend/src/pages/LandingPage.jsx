import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle, Shield, TrendingUp, Users } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 font-sans text-gray-900">

      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
            PB
          </div>
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            Piggy Bank
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/login')}
            className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
          >
            Log in
          </button>
          <button
            onClick={() => navigate('/signup')}
            className="px-5 py-2.5 text-sm font-medium bg-indigo-600 text-white rounded-full hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all"
          >
            Sign up free
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
            Vihanga<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              intelligent tracking
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Take control of your financial future. Track expenses, set budgets, and achieve your goals with our intuitive and powerful Personal Finance Tracker.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/signup')}
              className="px-8 py-4 text-lg font-bold bg-indigo-600 text-white rounded-full hover:bg-indigo-700 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center gap-2"
            >
              Get Started Now <ArrowRight className="w-5 h-5" />
            </button>
            <button
              className="px-8 py-4 text-lg font-bold bg-white text-gray-700 border border-gray-200 rounded-full hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
            >
              Learn More
            </button>
          </div>
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-100 rounded-full blur-3xl opacity-30 -z-10 animate-pulse"></div>
      </header>
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why choose Piggy Bank?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage your personal finances in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                icon: <TrendingUp className="w-8 h-8 text-indigo-600" />,
                title: "Smart Analytics",
                desc: "Visualize your spending habits with intuitive charts and detailed reports."
              },
              {
                icon: <Shield className="w-8 h-8 text-purple-600" />,
                title: "Bank-Grade Security",
                desc: "Your data is encrypted and secure. We prioritize your privacy above all else."
              },
              {
                icon: <Users className="w-8 h-8 text-pink-600" />,
                title: "Collaborative Goals",
                desc: "Set shared financial goals with family or partners and track progress together."
              }
            ].map((feature, idx) => (
              <div key={idx} className="p-8 rounded-2xl bg-gray-50 hover:bg-white border border-gray-100 hover:border-indigo-100 hover:shadow-xl transition-all duration-300">
                <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-lg mb-6 text-indigo-600">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-sm">PB</div>
            <span className="font-bold text-lg">Piggy Bank</span>
          </div>
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Personal Finance Tracker. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
