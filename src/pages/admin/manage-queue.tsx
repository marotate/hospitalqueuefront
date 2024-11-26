import { useRouter } from 'next/router';
import { useState } from 'react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError('');
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setError('');
  };

  const handleSubmit = () => {
    if (email && password) {
      // Example: Validate admin credentials (can be replaced with API calls)
      if (email === 'a' && password === 'a') {
        router.push('/admin/admin-dashboard'); // Redirect to admin dashboard
      } else {
        setError('Invalid email or password');
      }
    } else {
      setError('Please fill out all fields');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-500 to-white">
      <div className="flex w-4/5 max-w-7xl items-center space-x-10">
        {/* Login Section */}
        <div className="flex-1 flex flex-col items-center p-6">
          <h1 className="text-5xl font-bold text-center mb-8 text-white">Login to Admin Page</h1>
          <p className="text-center mb-8 text-2xl text-white">Welcome to the Online Queue Reservation</p>

          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Enter your Admin’s Email"
            className="w-[500px] px-6 py-3 border rounded-md mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 text-lg"
          />
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Enter your Password"
            className="w-[500px] px-6 py-3 border rounded-md mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 text-lg"
          />
          {error && <p className="text-red-500 text-lg mb-6">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={!email || !password}
            className="w-[500px] bg-blue-500 text-white font-bold py-3 px-6 rounded-md hover:bg-blue-600 transition disabled:bg-blue-500 disabled:cursor-not-allowed text-lg"
          >
            Login
          </button>
        </div>

        {/* Image Section */}
        <div>
          <img
            src="/image-admin/icon-login.png"
            alt="Icon Login"
            className="w-[500px]"
          />
        </div>
      </div>
    </div>
  );
}
