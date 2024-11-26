import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface QueueDetails {
  queue_id: string;
  patient_firstname: string;
  patient_lastname: string;
  queueNumber: string;
  remaining_queue: number;
  dept_name: string;
  room_number: string;
}

const QueueDetailsPage = () => {
  const router = useRouter();
  const { queue_id } = router.query; // Retrieve queue_id from the query parameters
  const [queueDetails, setQueueDetails] = useState<QueueDetails | null>(null); // Store queue details
  const [error, setError] = useState<string | null>(null); // Store error messages
  const [loading, setLoading] = useState(true); // Loading state
  const [wsStatus, setWsStatus] = useState<string>(""); // WebSocket connection status for debugging

  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates after component unmount
    let socket: WebSocket; // WebSocket instance

    const fetchQueueDetails = async () => {
      if (!queue_id) return;

      try {
        // Initial fetch to get queue details
        const response = await fetch(
          `https://jb3v9lrzx2.execute-api.us-east-1.amazonaws.com/queue/trackqueue?queue_id=${queue_id}`,
          { method: "GET" }
        );

        if (response.ok) {
          const result = await response.json();
          if (isMounted) {
            setQueueDetails(result.data); // Update state with fetched queue details
            setWsStatus("Initial data fetched successfully.");
          }
        } else {
          const errorData = await response.json();
          if (isMounted) {
            setError(errorData.message || "Failed to fetch queue details.");
            setWsStatus("Error fetching initial data.");
          }
        }
      } catch (e) {
        console.error("Error fetching queue details:", e);
        if (isMounted) {
          setError("An unexpected error occurred. Please try again.");
          setWsStatus("Error during initial fetch.");
        }
      } finally {
        if (isMounted) {
          setLoading(false); // Set loading to false after fetching
        }
      }
    };

    fetchQueueDetails();

    // Establish WebSocket connection
    if (queue_id) {
      socket = new WebSocket("wss://g3jo9j2tn5.execute-api.us-east-1.amazonaws.com/queue/");

      socket.onopen = () => {
        console.log("WebSocket connection opened.");
        if (socket.readyState === WebSocket.OPEN) {
          const queue_id_str = String(queue_id);
          socket.send(JSON.stringify({ action: "trackqueue", queue_id }));
          console.log(JSON.stringify({ action: "trackqueue", queue_id }));
          console.log(queue_id_str);
          console.log("send finish");
        } else {
          console.error("WebSocket is not open. Subscription message not sent.");
        }
      };

      socket.onmessage = (event) => {
        console.log("WebSocket message received1:", event.data);
        try {
          const data = JSON.parse(event.data);
          console.log("WebSocket message received2:", data);

          // Update queue details if the message matches the current queue_id
          if (data.queue_id === queue_id && isMounted) {
            console.log("Updating state with:", data);
            setQueueDetails((prevDetails) => ({
              ...prevDetails,
              ...data, // Merge new data into existing queue details
              //room_number: data.room_number || prevDetails?.room_number || "Not Assigned", // Retain old value if new one is null
            }));
            setWsStatus("Real-time update received.");
          }
        } catch (e) {
          console.error("Error parsing WebSocket message:", e);
          setWsStatus("Error parsing WebSocket message.");
        }
      };

      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
        if (isMounted) {
          setError("WebSocket connection error.");
          setWsStatus("WebSocket connection error.");
        }
      };

      socket.onclose = () => {
        console.log("WebSocket connection closed.");
        setWsStatus("WebSocket connection closed.");
      };
    }

    // Cleanup on component unmount
    return () => {
      isMounted = false;
      if (socket && socket.readyState === WebSocket.OPEN) {
        console.log("Closing WebSocket connection...");
        socket.close();
      }
    };
  }, [queue_id]);

  if (loading) {
    return <p className="text-center text-gray-700 text-xl">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 text-xl">{error}</p>;
  }

  if (!queueDetails) {
    return <p className="text-center text-gray-700 text-xl">No queue details available.</p>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-500 to-white">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg my-4 text-center">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-blue-600">Cloud Hospital</h1>
          <p className="text-lg text-gray-500 mt-2">Queue Tracking System</p>
        </div>

        {/* Patient Name */}
        <div className="mb-6">
          <p className="text-2xl font-semibold text-gray-800">
            {queueDetails.patient_firstname} {queueDetails.patient_lastname}
          </p>
        </div>

        {/* Queue Number */}
        <div className="mb-6">
          <p className="text-lg text-gray-600">Your Queue Number</p>
          <p className="text-5xl font-extrabold text-blue-500">{queueDetails.queueNumber}</p>
        </div>

        {/* Remaining Queue */}
        <div className="mb-6">
          <p className="text-lg text-gray-600 mb-2">Queue Ahead</p>
          <div className="flex justify-center items-center">
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="absolute w-full h-full" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" stroke="#e5e5e5" strokeWidth="10" fill="none" />
              </svg>
              <p className="text-5xl font-bold text-blue-500">{queueDetails.remaining_queue}</p>
            </div>
          </div>
        </div>

        <p className="text-xl text-gray-800 font-extrabold mb-4">Please wait for your turn</p>
        <div className="mt-8">
          <p className="text-lg text-gray-800 font-semibold mb-2">Destination</p>
          <button className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md">
            {queueDetails.dept_name}
          </button>
          <p className="text-lg text-gray-800 font-semibold mt-6 mb-2">Room</p>
          <div className="flex justify-center items-center mt-2">
            <p className="bg-blue-600 text-2xl font-semibold text-white py-1 px-3 rounded-lg shadow-md">
              {queueDetails.room_number}
            </p>
          </div>
        </div>

        {/* Debug WebSocket Status */}
        <div className="mt-8">
          <p className="text-sm text-gray-500">WebSocket Status: {wsStatus}</p>
        </div>
      </div>
    </div>
  );
};

export default QueueDetailsPage;
