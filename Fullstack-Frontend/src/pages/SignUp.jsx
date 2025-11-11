import { useState } from "react";
import axios from "axios";

function SignUp() {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [name, setName] = useState();

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3001/api/auth/signup', { email, password, name })
            .then(response => {
                console.log(response.data);
                if (response.data.message === 'SignUp successful') {
                    localStorage.setItem("token", response.data.token);
                    alert('SignUp successful!');
                }
            })
            .catch(error => {
                console.log(error);
                alert(error.response.data.message);
            });
    };

    return (
        <div className="flex h-screen min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                <form onSubmit={handleSubmit} method="POST" className="space-y-6">
                    <div>
                        <label className="block text-sm/6 font-medium text-gray-100">Email address</label>
                        <div className="mt-2">
                            <input onChange={(e) => setEmail(e.target.value)} id="email" type="email" name="email" className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm/6 font-medium text-gray-100">User Name</label>
                        <div className="mt-2">
                            <input onChange={(e) => setName(e.target.value)} id="name" type="text" name="name" className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" />
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center justify-between">
                            <label className="block text-sm/6 font-medium text-gray-100">Password</label>
                        </div>
                        <div className="mt-2">
                            <input onChange={(e) => setPassword(e.target.value)} id="password" type="password" name="password" className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" />
                        </div>
                    </div>

                    <div>
                        <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">SignUp</button>
                    </div>
                </form>
            </div>
        </div>
    )
}
export default SignUp