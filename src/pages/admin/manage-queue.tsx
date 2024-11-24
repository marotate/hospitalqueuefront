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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-500 to-white">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-4xl font-bold text-center mb-6 text-gray-700">Login to Admin Page</h1>
        <p className="text-center mb-6 text-lg text-gray-500">Welcome to the Online Queue Reservation</p>

        <input
          type="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="Enter your Admin’s Email"
          className="w-full px-4 py-2 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
        />
        <input
          type="password"
          value={password}
          onChange={handlePasswordChange}
          placeholder="Enter your Password"
          className="w-full px-4 py-2 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
        />
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={!email || !password}
          className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 transition disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          Login
        </button>
      </div>
    </div>
  );
}

