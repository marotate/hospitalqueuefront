import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";

type Queue = {
    queue_id: string;
    queueNumber: string;
    patient_firstname: string;
    patient_lastname: string;
    remaining_queue: number;
    dept_name: string;
    room_number: string;
};

const DashboardPage = () => {
    const router = useRouter();
    const [selectedDept, setSelectedDept] = useState<string>("Screening Center");
    const [loading, setLoading] = useState<boolean>(true);
    const [queues, setQueues] = useState<Queue[]>([]);
    const [roomInput, setRoomInput] = useState<{ [key: string]: string }>({});
    const [newDeptInput, setNewDeptInput] = useState<{ [key: string]: string }>({});
    const websocketRef = useRef<WebSocket | null>(null);

    // Fetch queues when a department is selected
    useEffect(() => {
        if (selectedDept) {
            fetchQueues(selectedDept);
        }
    }, [selectedDept]);

    const fetchQueues = async (department: string) => {
        try {
            setLoading(true);
            const response = await fetch(
                `https://203o7qhoh2.execute-api.us-east-1.amazonaws.com/queue/totalqueue?dept_name=${encodeURIComponent(
                    department
                )}`,
                { method: "GET" }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch queues");
            }

            const data = await response.json();
            setQueues(
                data.queues.sort((a: Queue, b: Queue) => a.remaining_queue - b.remaining_queue)
            );
        } catch (error) {
            console.error("Error fetching queues:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAssignRoom = async (queueId: string) => {
        if (!roomInput[queueId]) {
            alert("Please select a room number.");
            return;
        }

        try {
            const response = await fetch(
                "https://duq6zvqdd3.execute-api.us-east-1.amazonaws.com/updatequeue/updatequeue",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        queue_id: queueId,
                        room_number: roomInput[queueId],
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to assign room");
            }

            alert("Room assigned successfully!");

            // Update the state to show the room number immediately
            setQueues((prevQueues) =>
                prevQueues.map((queue) =>
                    queue.queue_id === queueId
                        ? { ...queue, room_number: roomInput[queueId] }
                        : queue
                )
            );

            // Clear the input field for the room number
            setRoomInput((prev) => ({ ...prev, [queueId]: "" }));
        } catch (error) {
            console.error("Error assigning room:", error);
        }
    };

    const handleAssignDept = async (queueId: string) => {
    if (!newDeptInput[queueId]) {
        alert("Please select a department.");
        return;
    }

    try {
        const response = await fetch(
            "https://duq6zvqdd3.execute-api.us-east-1.amazonaws.com/updatequeue/updatequeue",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    queue_id: queueId,
                    dept_name: newDeptInput[queueId],
                    room_number: "-", // Reset room_number when changing department
                }),
            }
        );

        if (!response.ok) {
            throw new Error("Failed to assign department");
        }

        alert("Department assigned successfully!");

        // Update state to reflect the changes
        setQueues((prevQueues) =>
            prevQueues.map((queue) =>
                queue.queue_id === queueId
                    ? { ...queue, dept_name: newDeptInput[queueId], room_number: "-" }
                    : queue
            )
        );

        setNewDeptInput((prev) => ({ ...prev, [queueId]: "" }));
        fetchQueues(selectedDept); // Refresh the queue list
    } catch (error) {
        console.error("Error assigning department:", error);
    }
};

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-500 to-white p-4">
            {/* Header Section */}
            <div className="flex justify-between items-center bg-white p-4 shadow rounded-md">
                <div>
                    <h1 className="text-xl font-bold text-teal-500">Admin Dashboard</h1>
                    <p className="text-sm text-gray-600">Manage queues and assignments</p>
                </div>
                <div>
                    <select
                        value={selectedDept}
                        onChange={(e) => setSelectedDept(e.target.value)}
                        className="border border-gray-300 rounded-md px-4 py-2"
                    >
                        <option value="Screening Center">Screening Center</option>
                        <option value="Cardiology">Cardiology</option>
                        <option value="Payment">Payment</option>
                        <option value="Dispensary">Dispensary</option>
                    </select>
                </div>
            </div>

            {/* Queue List */}
            <div className="mt-6 bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-700 mb-4">
                    Queues in {selectedDept}
                </h2>
                {loading ? (
                    <p>Loading...</p>
                ) : queues.length === 0 ? (
                    <p>No queues available for this department.</p>
                ) : (
                    <div className="space-y-4">
                        {queues.map((queue) => (
                            <div
                                key={queue.queue_id}
                                className="flex justify-between items-center border-b pb-4"
                            >
                                <div>
                                    <p className="text-lg font-bold text-gray-800">
                                        Queue {queue.queueNumber}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {queue.patient_firstname} {queue.patient_lastname}
                                    </p>
                                    {queue.room_number && (
                                        <p className="text-sm text-teal-500">
                                            Room: {queue.room_number}
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-center space-x-4">
                                    {/* Assign Room */}
                                    <div>
                                        <select
                                            value={roomInput[queue.queue_id] || ""}
                                            onChange={(e) =>
                                                setRoomInput((prev) => ({
                                                    ...prev,
                                                    [queue.queue_id]: e.target.value,
                                                }))
                                            }
                                            className="border border-gray-300 rounded-md px-2 py-1"
                                        >
                                            <option value="" disabled>
                                                Select Room
                                            </option>
                                            {selectedDept === "Cardiology" ? (
                                                <>
                                                    <option value="101">Room 101</option>
                                                    <option value="102">Room 102</option>
                                                    <option value="103">Room 103</option>
                                                </>
                                            ) : (
                                                <>
                                                    <option value="1">Channel 1</option>
                                                    <option value="2">Channel 2</option>
                                                    <option value="3">Channel 3</option>
                                                </>
                                            )}
                                        </select>
                                        <button
                                            onClick={() => handleAssignRoom(queue.queue_id)}
                                            className="ml-2 bg-teal-500 text-white px-4 py-2 rounded-md"
                                        >
                                            Assign Room
                                        </button>
                                    </div>
                                    {/* Assign Department */}
                                    <div>
                                        <select
                                            value={newDeptInput[queue.queue_id] || ""}
                                            onChange={(e) =>
                                                setNewDeptInput((prev) => ({
                                                    ...prev,
                                                    [queue.queue_id]: e.target.value,
                                                }))
                                            }
                                            className="border border-gray-300 rounded-md px-2 py-1"
                                        >
                                            <option value="" disabled>
                                                Select Department
                                            </option>
                                            <option value="Screening Center">
                                                Screening Center
                                            </option>
                                            <option value="Cardiology">Cardiology</option>
                                            <option value="Payment">Payment</option>
                                            <option value="Dispensary">Dispensary</option>
                                        </select>
                                        <button
                                            onClick={() => handleAssignDept(queue.queue_id)}
                                            className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-md"
                                        >
                                            Assign Dept
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;
