// arc/apps/user/welcome.tsx
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function RegisterQueuePage() {
  const router = useRouter();
  const [nationalId, setNationalId] = useState('');
  const [error, setError] = useState('');

  const isValidNationalId = (id: string) => /^[0-9]{13}$/.test(id);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = e.target.value;
    setNationalId(id);
    setError('');
    if (id && !isValidNationalId(id)) {
      setError('National ID must be a 13-digit number');
    }
  };

  const handleSubmit = () => {
    if (isValidNationalId(nationalId)) {
      // Pass the national ID to the next page if necessary
      router.push({
        pathname: '/user/select-patient',
        query: { nationalId }
      });
    } else {
      setError('Please enter a valid 13-digit National ID number');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-500 to-white">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-3xl">
        <h1 className="text-4xl font-bold text-center mb-6 text-gray-700">Welcome to the Cloud Hospital</h1>
        <p className="text-center mb-6 text-lg text-gray-500">Please enter your National ID number to get queue</p>
        
        <input
          type="text"
          value={nationalId}
          onChange={handleInputChange}
          placeholder="Enter National ID number"
          maxLength={13}
          className="w-full px-4 py-2 border rounded-md mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
        />
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={!isValidNationalId(nationalId)}
          className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 transition disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
