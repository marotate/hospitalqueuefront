import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { rooms as initialRooms } from './data/roomData'; // Import rooms data

type Room = {
  room: string;
  name: string;
  status: string; // Ensure status is included
};

const AssignRoomPage = () => {
  const router = useRouter();
  const { queueNumber, patientFirstname, patientLastname } = router.query;

  const [currentTime, setCurrentTime] = useState('');
  const [rooms, setRooms] = useState<Room[]>(initialRooms); // Initialize with room data
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formattedTime = now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setCurrentTime(formattedTime);
    };

    const interval = setInterval(updateTime, 1000);
    updateTime();

    return () => clearInterval(interval);
  }, []);

  const handleBookClick = (room: Room) => {
    setSelectedRoom(room);
    setIsPopupOpen(true);
  };

  const handleConfirm = () => {
    if (selectedRoom) {
      // Mark the room as "In Progress"
      const updatedRooms = rooms.map((room) =>
        room.room === selectedRoom.room
          ? { ...room, status: 'In Progress' }
          : room
      );
      setRooms(updatedRooms);

      // Save the assigned queue data to localStorage
      const assignedQueue = {
        queueNumber,
        patientFirstname,
        patientLastname,
        room: selectedRoom.room,
        doctor: selectedRoom.name,
      };
      const assignedQueues =
        JSON.parse(localStorage.getItem('assignedQueues') || '[]');
      assignedQueues.push(assignedQueue);
      localStorage.setItem('assignedQueues', JSON.stringify(assignedQueues));

      // Redirect back to next-department
      router.push('/admin/next-department');
    }
  };

  const handleCancel = () => {
    setSelectedRoom(null);
    setIsPopupOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-white p-4">
      {/* Header Section */}
      <div className="flex justify-between items-center bg-white p-4 shadow rounded-t-md">
        <div className="flex items-center space-x-2">
          <img
            src="/image-admin/icon-dashboard.png"
            alt="Icon Dashboard"
            className="w-13 h-10"
          />
          <div>
            <h1 className="text-xl font-bold text-teal-400">Master Admin</h1>
            <p className="text-gray-500">Screening Center</p>
          </div>
        </div>
        <div className="flex items-center space-x-6">
          <div className="text-right">
            <h2 className="text-lg font-bold text-black">Channel 1</h2>
            <p className="text-sm text-gray-500">{currentTime}</p>
          </div>
          <div className="font-bold text-teal-400 p-2 border-2 border-teal-400 rounded-md">
            Total Queue: 70
          </div>
          <div className="flex items-center space-x-2">
            <img
              src="/image-admin/admin.jpeg"
              alt="Admin Avatar"
              className="w-10 h-10 rounded-full overflow-hidden"
            />
            <div>
              <p className="font-bold text-black">Johnny Yespapa</p>
              <p className="text-sm text-gray-500">Pom Prap Sattru Phai, Bangkok</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center bg-white p-4 shadow rounded-b-md border-t-2 border-gray-100">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-bold text-black">Queue {queueNumber}</h1>
          <p className="text-gray-500">/ In progress on channel 1</p>
        </div>
      </div>

      {/* Assign Room Section */}
      <div className="bg-white shadow rounded-lg p-6 mt-6">
        <div className="relative flex items-center h-16">
          <button
            onClick={() => router.back()}
            className="bg-gray-200 px-4 py-2 rounded-md text-black"
          >
            Back
          </button>
          <h1 className="absolute left-1/2 transform -translate-x-1/2 text-3xl font-bold text-black">
            {queueNumber}
          </h1>
        </div>

        <div className="flex flex-col items-center justify-center border-b-2 border-gray-100">
          <p className="text-lg text-gray-700 mb-6">
            {patientFirstname} {patientLastname}
          </p>
        </div>

        {/* Room List */}
        <div className="space-y-4 overflow-y-auto max-h-[450px] mt-4">
          {rooms.map((room, index) => (
            <div
              key={index}
              className="flex justify-between items-center border-b pb-2"
            >
              <div className="flex items-center space-x-2">
                <p className="text-lg font-bold text-black">{room.room}</p>
                <p className="text-lg text-gray-700">- {room.name}</p>
              </div>
              <button
                onClick={() => handleBookClick(room)}
                className={`w-52 h-11 ${
                  room.status === 'Book'
                    ? 'bg-green-500 hover:bg-green-600'
                    : 'bg-gray-300 cursor-not-allowed'
                } text-white px-4 py-2 rounded-md`}
                disabled={room.status !== 'Book'}
              >
                {room.status}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Confirmation Popup */}
      {isPopupOpen && selectedRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96 text-center">
            <h2 className="text-2xl font-bold text-black mb-4">Confirmation</h2>
            <p className="text-lg text-black">{selectedRoom.room}</p>
            <p className="text-lg text-gray-700">{selectedRoom.name}</p>
            <div className="my-6">
              <img
                src="/image-admin/icon-confirmation.png"
                alt="Confirmation"
                className="mx-auto w-40"
              />
            </div>
            <div className="flex justify-around mt-4">
              <button
                onClick={handleConfirm}
                className="bg-teal-400 text-white px-6 py-2 rounded-md hover:bg-teal-400"
              >
                Confirm
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignRoomPage;
