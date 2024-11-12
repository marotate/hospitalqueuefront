// arc/apps/user/get-queue.tsx
import { useRouter } from 'next/router';

export default function GetQueuePage() {
  const router = useRouter();
  const { nationalId } = router.query; // Get the national ID from the query parameters

  const handleNewPatient = () => {
    if (nationalId) {
      router.push({
        pathname: '/user/qr-track-queue',
        query: { nationalId }
      });
    } else {
      alert("No valid National ID provided.");
    }
  };

  const handleExistingPatient = () => {
    if (nationalId) {
      router.push({
        pathname: '/user/select-appointment',
        query: { nationalId }
      });
    } else {
      alert("No valid National ID provided.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-500 to-white">
      <div className="bg-white shadow-lg rounded-lg p-12 w-full max-w-2xl">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Get Queue</h1>
        <p className="text-xl text-gray-600 text-center mb-10">
          Select an option to proceed with your appointment or queue.
        </p>
        <div className="flex flex-col gap-6">
          <button 
            onClick={handleNewPatient}
            className="bg-blue-600 text-white py-4 rounded-lg text-2xl font-semibold hover:bg-blue-700 transition-all duration-300"
          >
            New Patient
          </button>
          <button 
            onClick={handleExistingPatient}
            className="bg-green-500 text-white py-4 rounded-lg text-2xl font-semibold hover:bg-green-700 transition-all duration-300"
          >
            Existing Patient
          </button>
        </div>
      </div>
    </div>
  );
}
