// admin-dashboard.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

type Queue = {
    queueNumber: string;
    patient_firstname: string;
    patient_lastname: string;
};

type AssignedQueue = {
    queueNumber: string;
    patientFirstname: string;
    patientLastname: string;
    room: string;
};


const NextDepartmentPage = () => {
    const router = useRouter();
    const [totalQueue, setTotalQueue] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [queues, setQueues] = useState<Queue[]>([]);
    const [waitingQueues, setWaitingQueues] = useState<Queue[]>([]);
    const [currentQueue, setCurrentQueue] = useState<Queue | null>(null);
    const [selectedQueue, setSelectedQueue] = useState<Queue | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDept, setSelectedDept] = useState<string>('Screening Center');
    const [department, setDepartment] = useState('');
    const [currentTime, setCurrentTime] = useState('');
    const [nextQueueVisible, setNextQueueVisible] = useState(false);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const websocketRef = useRef<WebSocket | null>(null);
    const [assignedQueues, setAssignedQueues] = useState<AssignedQueue[]>([]);


    const handleDepartmentSelect = (dept: string) => {
        setSelectedDept(dept);
        setDropdownVisible(false);

        if (dept === 'Cardiology') {
            router.push('/admin/next-department');
        } else if (dept === 'Screening Center') {
            router.push('/admin/admin-dashboard');
        } else if (dept === 'Payment') {
            router.push('/admin/payment-page');
        } else if (dept === 'Dispensary') {
            router.push('/admin/dispensary');
        }
    };

    useEffect(() => {
        const storedQueues = JSON.parse(localStorage.getItem('assignedQueues') || '[]');
        console.log('Loaded Assigned Queues:', storedQueues); // Debugging
        setAssignedQueues(storedQueues);
    }, []);


    useEffect(() => {
        const deptMap: { [key: string]: string } = {
            '/admin/next-department': 'Cardiology',
            '/admin/admin-dashboard': 'Screening Center',
            '/admin/payment-page': 'Payment',
            '/admin/dispensary': 'Dispensary',
        };

        const newDept = deptMap[router.pathname];
        if (newDept && newDept !== selectedDept) {
            setSelectedDept(newDept);
        }
    }, [router.pathname]);


    useEffect(() => {
        if (selectedDept) {
            fetchQueueData(selectedDept);
        }
    }, [selectedDept]);


    useEffect(() => {
        console.log('Current path:', router.pathname);
        console.log('Selected department:', selectedDept);
    }, [router.pathname, selectedDept]);




    const fetchQueueData = async (department: string) => {
        try {
            setLoading(true);

            const response = await fetch(
                `https://203o7qhoh2.execute-api.us-east-1.amazonaws.com/queue/totalqueue?dept_name=${encodeURIComponent(
                    department
                )}`,
                { method: "GET" }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Fetched data:', data); // Debug the response

            if (!data || !('totalQueue' in data)) {
                throw new Error('Invalid response structure');
            }

            setTotalQueue(data.totalQueue || 0);

            // Handle queues only if they exist in the response
            const fetchedQueues = data.queues || [];
            setWaitingQueues(fetchedQueues);
            setCurrentQueue(fetchedQueues.length > 0 ? fetchedQueues[0] : null);
        } catch (error) {
            console.error('Error fetching queue data:', error);
            setTotalQueue(null);
            setWaitingQueues([]);
            setCurrentQueue(null);
        } finally {
            setLoading(false);
        }
    };


    const handleAssign = (queue: Queue) => {
        if (queue === currentQueue) {
            router.push({
                pathname: '/admin/assign-room',
                query: {
                    queueNumber: queue.queueNumber,
                    patientFirstname: queue.patient_firstname,
                    patientLastname: queue.patient_lastname,
                },
            });
        }
    };


    const handleCancel = () => {
        setIsModalOpen(false);
        setSelectedQueue(null);
        setDepartment('');
    };

    const handleConfirm = async () => {
        if (selectedQueue && department) {
            try {
                const message = {
                    type: 'updateQueue',
                    queueNumber: selectedQueue.queueNumber,
                    patient_firstname: selectedQueue.patient_firstname,
                    patient_lastname: selectedQueue.patient_lastname,
                    dept_name: department,
                };

                console.log('Sending data to WebSocket:', message);

                if (websocketRef.current?.readyState === WebSocket.OPEN) {
                    websocketRef.current.send(JSON.stringify(message));
                    console.log('Queue successfully sent to WebSocket');
                } else {
                    console.error('WebSocket is not connected');
                    alert('WebSocket connection is not established. Please try again.');
                }

                // Reset modal state
                setIsModalOpen(false);
                setSelectedQueue(null);
                setDepartment('');
            } catch (error) {
                console.error('Error sending data via WebSocket:', error);
                alert('Failed to update the queue. Please try again.');
            }
        }
    };

    /*
    const connectWebSocket = () => {
        if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
            console.log("WebSocket already connected.");
            return;
        }
    
        const websocket = new WebSocket('wss://inkwwyt107.execute-api.us-east-1.amazonaws.com/dev/');
    
        websocket.onopen = () => {
            console.log('WebSocket connection established');
            websocketRef.current = websocket;
        };
    
        websocket.onclose = () => {
            console.log('WebSocket connection closed. Reconnecting...');
            websocketRef.current = null;
            setTimeout(connectWebSocket, 5000); // Retry after 5 seconds
        };
    
        websocket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    
        websocket.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                console.log('WebSocket message received:', message);
            } catch (error) {
                console.error('Error processing WebSocket message:', error);
            }
        };
    };
    
    useEffect(() => {
        if (!websocketRef.current) {
            connectWebSocket();
        }
    
        return () => {
            if (websocketRef.current) {
                console.log('Closing WebSocket connection.');
                websocketRef.current.close();
                websocketRef.current = null;
            }
        };
    }, []);  */

    const handleNextQueue = () => {
        if (currentQueue) {
            // Set the next queue as the currentQueue
            const nextQueue = waitingQueues.length > 0 ? waitingQueues[0] : null;
            setCurrentQueue(nextQueue);

            // Show the Assign button for the next queue
            setNextQueueVisible(false); // Disable Next Queue button
        }
    };

    // Use another effect for time updates
    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            setCurrentTime(
                now.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                })
            );
        }, 1000);

        return () => clearInterval(interval);
    }, []);



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
                        <div className="relative">
                            <button
                                onClick={() => setDropdownVisible((prev) => !prev)}
                                className="text-gray-500 focus:outline-none flex items-center"
                            >
                                {selectedDept}
                                <span className="ml-2 text-lg">
                                    {dropdownVisible ? '▲' : '▼'}
                                </span>
                            </button>
                            {dropdownVisible && (
                                <div className="absolute top-full left-0 mt-2 w-48 text-gray-500 bg-white border border-gray-300 rounded-md shadow-md z-10">
                                    <ul>
                                        <li
                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                            onClick={() => handleDepartmentSelect('Screening Center')}
                                        >
                                            Screening Center
                                        </li>
                                        <li
                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                            onClick={() => handleDepartmentSelect('Cardiology')}
                                        >
                                            Cardiology
                                        </li>
                                        <li
                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                            onClick={() => handleDepartmentSelect('Payment')}
                                        >
                                            Payment
                                        </li>
                                        <li
                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                            onClick={() => handleDepartmentSelect('Dispensary')}
                                        >
                                            Dispensary
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-6">
                    <div className="text-right">
                        <h2 className="text-lg font-bold text-black">Channel 1</h2>
                        <p className="text-sm text-gray-500">{currentTime}</p>
                    </div>
                    <div className="font-bold text-teal-400 p-2 border-2 border-teal-400 rounded-md">
                        Total Queue: {loading ? 'Loading...' : totalQueue !== null ? totalQueue : 'N/A'}
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

            {/* Current Queue */}
            <div className="flex justify-center items-center bg-white p-4 shadow rounded-b-md border-t-2 border-gray-100">
                <div className="flex items-center space-x-2">
                    <h1 className="text-xl font-bold text-black">Queue {currentQueue?.queueNumber}</h1>
                    <p className="text-gray-500">/ In progress on channel 1</p>
                </div>
                {nextQueueVisible && (
                    <div className="text-right">
                        <button
                            onClick={handleNextQueue}
                            className="bg-white border-2 border-rose-500 text-rose-500 px-4 py-2 rounded-md"
                        >
                            Next Queue
                        </button>
                    </div>
                )}
            </div>

            {/* Queue Sections */}
            <div className="grid grid-cols-2 gap-6 mt-6">
                {/* Left Column */}
                <div className="bg-white shadow rounded-lg p-4">
                    <h2 className="text-xl font-bold text-gray-700 mb-4">Waiting List</h2>
                    <div className="border-t-2 border-gray-100 pt-2 space-y-4 overflow-y-auto max-h-[500px]">
                        <ul>
                            {assignedQueues.map((queue, index) => (
                                <li
                                    key={index}
                                    className="grid grid-cols-2 border-b py-3 items-center">
                                    <p className="col-span-1 font-bold text-lg text-black">
                                        {queue.queueNumber}
                                    </p>
                                    <p className="col-span-1 text-sm text-gray-500">
                                        {queue.patientFirstname} {queue.patientLastname}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Right Column */}
                <div className="bg-white shadow rounded-lg p-4">
                    <h2 className="text-xl font-bold text-gray-700 mb-4">Waiting List</h2>
                    <div className="border-t-2 border-gray-100 pt-2 space-y-4 overflow-y-auto max-h-[500px]">
                        {waitingQueues.map((queue) => (
                            <div
                                key={queue.queueNumber}
                                className="flex border-b pl-4 pb-2 items-center"
                            >
                                <p className="w-1/2 text-left flex items-center space-x-2">
                                    <span className="font-bold text-lg text-black">{queue.queueNumber}</span>
                                    <span className="text-sm text-gray-500 pl-4">{queue.patient_firstname} {queue.patient_lastname}</span>
                                </p>

                                <div className="pl-44">
                                    <button
                                        onClick={() => handleAssign(queue)}
                                        className={`px-10 py-2 rounded-md text-white ${queue.queueNumber === currentQueue?.queueNumber
                                            ? 'bg-green-500 hover:bg-green-600'
                                            : 'bg-gray-300 cursor-not-allowed'
                                            }`}
                                        disabled={queue.queueNumber !== currentQueue?.queueNumber}
                                    >
                                        Assign
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>



                {/* Waiting List */}
                {isModalOpen && selectedQueue && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                            <h2 className="text-2xl font-bold text-black text-center mb-4">
                                Queue {selectedQueue.queueNumber}
                            </h2>
                            <p className="text-center text-xl text-black mb-6">
                                {selectedQueue.patient_firstname} {selectedQueue.patient_lastname}
                            </p>
                            <div className="mb-4">
                                <label
                                    htmlFor="department"
                                    className="block text-gray-700 mb-2 text-center"
                                >
                                    Select Department
                                </label>
                                <select
                                    id="department"
                                    value={department}
                                    onChange={(e) => setDepartment(e.target.value)}
                                    className="w-full border text-gray-500 border-gray-300 rounded-md px-3 py-2"
                                >
                                    <option value="" disabled hidden>
                                        Assign a department
                                    </option>
                                    <option value="Screening Center">Screening Center</option>
                                    <option value="Payment">Payment</option>
                                    <option value="Dentistry">Dentistry</option>
                                </select>
                            </div>
                            <div className="flex justify-end space-x-4">
                                <button
                                    onClick={handleCancel}
                                    className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleConfirm}
                                    disabled={!department}
                                    className={`${department
                                        ? 'bg-blue-500 hover:bg-blue-600'
                                        : 'bg-blue-300 cursor-not-allowed'
                                        } text-white px-4 py-2 rounded-md`}
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NextDepartmentPage;
