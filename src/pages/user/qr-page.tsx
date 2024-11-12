import { useRouter } from 'next/router';

const QueueDetailsPage = () => {
  const router = useRouter();
  const { nationalId, queuenumber } = router.query; // Retrieve nationalId and queuenumber from the query

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-500 to-white">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg my-4 md:mx-auto text-center transform transition duration-500 ease-in-out">

        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-blue-600 text-center">Cloud Hospital</h1>
        </div>

        <div className="mb-6">
          <p className="text-xl text-gray-800 font-semibold mb-4">{nationalId}</p>
          <p className="text-lg text-gray-700">Your Queue Number</p>
          <p className="text-4xl font-bold text-blue-600">{queuenumber}</p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-center">
            <div className="relative w-40 h-40">
              <svg className="absolute w-full h-full rounded-full" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="50" stroke="#e5e5e5" strokeWidth="15" fill="none" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <p className="text-4xl font-extrabold text-blue-500">5</p>
                <p className="text-xl text-gray-800 text-blue-500">Queue</p>
                </div>
                
            </div>
              </div>
           
        </div>

        <p className="text-xl text-gray-800 font-extrabold mb-4">Please wait for your turn</p>
        <p className="text-l font-bold text-gray-400">Estimated Waiting Time: 10 - 20 minutes</p>
        <div className="mt-8">
          <p className="text-lg text-gray-800 font-semibold mb-2">Next Destination</p>
          <button className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200">
            General Examination Room
          </button>
          <p className="text-lg text-gray-800 font-semibold mt-6 mb-2">Room</p>
          <div className="flex justify-center items-center mt-2">
          <p className="bg-blue-600 text-3xl font-semibold text-white  py-1 px-3 rounded-lg shadow-md w-min ">3</p>
        </div>
        </div>
      </div>
    </div>
  );
};

export default QueueDetailsPage;
