import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { Mail, Lock, User, ArrowRight } from "lucide-react";

function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        axios.post('http://localhost:3001/api/auth/signup', { email, password, name })
            .then(response => {
                setLoading(false);
                console.log(response.data);
                if (response.data.message === 'SignUp successful') {
                    localStorage.setItem("token", response.data.token);
                    localStorage.setItem("user", JSON.stringify(response.data.user));
                    // alert('SignUp successful!');
                    navigate('/dashboard');
                }
            })
            .catch(error => {
                setLoading(false);
                console.log(error);
                if (error.response && error.response.data) {
                    alert(error.response.data.message);
                } else {
                    alert("An error occurred during signup.");
                }
            });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg mb-4">
                        PB
                    </div>
                </div>
                <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
                    Create your account
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Start managing your finance today
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white/80 backdrop-blur-lg py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-white/50">
                    <form className="space-y-6" onSubmit={handleSubmit} method="POST">

                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Full Name
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </div>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg p-2.5 bg-gray-50 border"
                                    placeholder="John Doe"
                                    onChange={(e) => setName(e.target.value)}
                                    value={name}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg p-2.5 bg-gray-50 border"
                                    placeholder="you@example.com"
                                    onChange={(e) => setEmail(e.target.value)}
                                    value={email}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg p-2.5 bg-gray-50 border"
                                    placeholder="••••••••"
                                    onChange={(e) => setPassword(e.target.value)}
                                    value={password}
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Creating account...' : 'Create Account'}
                                {!loading && <ArrowRight className="ml-2 w-4 h-4" />}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6">
                        {/* Social login or other options can go here if needed */}
                    </div>
                </div>
                <p className="mt-8 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <button onClick={() => navigate('/login')} className="font-medium text-indigo-600 hover:text-indigo-500">
                        Log in
                    </button>
                </p>
            </div>
        </div>
    )
}
export default SignUp