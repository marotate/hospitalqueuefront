import React, { useState } from 'react';

const DashboardPage = () => {
  const [queues, setQueues] = useState([
    { id: 'A0019', name: 'Phanutchanat Nongya', status: 'Done' },
    { id: 'A0020', name: 'Apisara Rattana', status: 'Done' },
    { id: 'A0021', name: 'Voranuch Sab-Udommark', status: 'Done' },
  ]);

  const [waitingQueues, setWaitingQueues] = useState([
    { id: 'A0022', name: 'Apisara Rattana' },
    { id: 'A0023', name: 'Voranuch Sab-Udommark' },
    { id: 'A0024', name: 'Chutikarn Jongvijitkun' },
    { id: 'A0025', name: 'Tiya Donlakorn' },
    { id: 'A0026', name: 'Dodo Deeja' },
  ]);

  const handleAssign = (queueId: string) => {
    const assignedQueue = waitingQueues.find(queue => queue.id === queueId);
    if (assignedQueue) {
      setQueues([...queues, { ...assignedQueue, status: 'In Progress' }]);
      setWaitingQueues(waitingQueues.filter(queue => queue.id !== queueId));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-white p-4">
      {/* Header Section */}
      <div className="flex justify-between items-center bg-white p-4 shadow rounded-md">
        <div>
          <h1 className="text-xl font-bold text-blue-700">Master Admin</h1>
          <p className="text-gray-500">Screening Center</p>
        </div>
        <div className="flex items-center space-x-6">
          <div className="text-right">
            <h2 className="text-lg font-bold text-black">Channel 1</h2>
            <p className="text-sm text-gray-500">02:28:59 PM</p>
          </div>
          <div className=" font-bold text-sky-300 p-2 border-2 border-sky-300 rounded-md"> 
            Total Queue: 70
          </div>
          <div className="flex items-center space-x-2">
            <img
              src="/path/to/avatar.jpg"
              alt="Admin Avatar"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-bold">Johnny Yespapa</p>
              <p className="text-sm text-gray-500">Pom Prap Sattru Phai, Bangkok</p>
            </div>
          </div>
        </div>
      </div>

      {/* Queue Section */}
      <div className="grid grid-cols-2 gap-6 mt-6">
        {/* Left Column: Active Queues */}
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-xl font-bold text-gray-700 mb-4">Completed Queue</h2>
          <div className="space-y-4">
            {queues.map(queue => (
              <div
                key={queue.id}
                className="flex justify-between items-center border-b pb-2"
              >
                <div>
                  <p className="font-bold text-black">{queue.id}</p>
                  <p className="text-sm text-gray-500">{queue.name}</p>
                </div>
                <button
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md cursor-not-allowed"
                  disabled
                >
                  {queue.status}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Waiting Queues */}
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-xl font-bold text-gray-700 mb-4">Waiting List</h2>
          <div className="space-y-4">
            {waitingQueues.map(queue => (
              <div
                key={queue.id}
                className="flex justify-between items-center border-b pb-2"
              >
                <div>
                  <p className="font-bold text-black">{queue.id}</p>
                  <p className="text-sm text-gray-500">{queue.name}</p>
                </div>
                <button
                  onClick={() => handleAssign(queue.id)}
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                >
                  Assign
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

