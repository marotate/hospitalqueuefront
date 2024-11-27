import { useState } from "react";
import QRCode from "react-qr-code";

export default function RegisterQueuePage() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [phone, setPhone] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [error, setError] = useState("");
  const [patientType, setPatientType] = useState<"new" | "existing" | "">("");
  const [hasAppointment, setHasAppointment] = useState<boolean | null>(null);
  const [queueCreated, setQueueCreated] = useState(false);
  const [queueDetails, setQueueDetails] = useState({
    queueNumber: "",
    remainingQueue: 0,
    queue_id: "",
    status: "", // Track whether the queue was "exists" or "success"
  });

  const isValidNationalId = (id: string) => /^[0-9]{13}$/.test(id);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    const value = e.target.value;
    if (field === "nationalId") {
      setNationalId(value);
      setError("");
      if (value && !isValidNationalId(value)) {
        setError("National ID must be a 13-digit number");
      }
    } else if (field === "firstname") {
      setFirstname(value);
    } else if (field === "lastname") {
      setLastname(value);
    } else if (field === "phone") {
      setPhone(value);
    }
  };

  const handlePatientTypeSelection = (type: "new" | "existing") => {
    setPatientType(type);
    setFirstname(""); // Reset fields when switching patient type
    setLastname("");
    setPhone("");
    setHasAppointment(null); // Reset appointment selection
    setError("");
  };

  const handleAppointmentSelection = (hasAppointment: boolean) => {
    setHasAppointment(hasAppointment);
    setError("");
  };

  const handleSubmit = async () => {
    // Validate fields for new patients
    if (
      patientType === "new" &&
      (!isValidNationalId(nationalId) || !firstname || !lastname || !phone)
      
    ) {
      setError("Please fill out all fields for new patients.");
      return;
    }

    // Validate fields for existing patients
    if (patientType === "existing") {
      if (!isValidNationalId(nationalId)) {
        setError("National ID is required for existing patients.");
        return;
      }
      if (hasAppointment === null) {
        setError("Please specify whether you have an appointment.");
        return;
      }
    }

    // Determine patient type code: "A" for new, "B" for existing with appointment, "C" for existing without appointment
    const patientTypeCode =
      patientType === "new" ? "A" : hasAppointment ? "B" : "C";

    try {
      const response = await fetch(
        "https://d8xhij6vv7.execute-api.us-east-1.amazonaws.com/queue/createqueue",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            patient_idcard: nationalId,
            patient_firstname: firstname,
            patient_lastname: lastname,
            patient_type: patientTypeCode,
            patient_phone: phone,
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();

        if (result.status === "exists") {
          // Handle case where the patient already has a queue
          setQueueDetails({
            queueNumber: result.queueNumber,
            remainingQueue: result.remainingQueue,
            queue_id: result.queue_id || "",
            status: "exists",
          });
        } else if (result.status === "success") {
          // Handle case where a new queue is created
          setQueueDetails({
            queueNumber: result.queueNumber,
            remainingQueue: result.remainingQueue,
            queue_id: result.queue_id,
            status: "success",
          });
        }
        setQueueCreated(true);
      } else {
        // Extract the error message from the API response
        const errorResponse = await response.json();
        setError(
          errorResponse.message || "Failed to create queue. Please try again."
        );
      }
    } catch (error) {
      console.error("Error during queue creation:", error);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-500 to-white">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-3xl">
        <h1 className="text-4xl font-bold text-center mb-6 text-gray-700">
          Welcome to the Cloud Hospital
        </h1>
        <p className="text-center mb-6 text-lg text-gray-500">
          Please enter your details to create a queue
        </p>

        {!queueCreated ? (
          <>
            <div className="flex justify-center mb-6">
              <button
                onClick={() => handlePatientTypeSelection("new")}
                className={`px-4 py-2 mx-2 rounded-md font-bold ${
                  patientType === "new"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                New Patient
              </button>
              <button
                onClick={() => handlePatientTypeSelection("existing")}
                className={`px-4 py-2 mx-2 rounded-md font-bold ${
                  patientType === "existing"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Existing Patient
              </button>
            </div>

            {patientType === "new" && (
              <>
                <input
                  type="text"
                  value={firstname}
                  onChange={(e) => handleInputChange(e, "firstname")}
                  placeholder="Enter First Name"
                  className="w-full px-4 py-2 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                />
                <input
                  type="text"
                  value={lastname}
                  onChange={(e) => handleInputChange(e, "lastname")}
                  placeholder="Enter Last Name"
                  className="w-full px-4 py-2 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => handleInputChange(e, "phone")}
                  placeholder="Enter Phone Number"
                  className="w-full px-4 py-2 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                />
              </>
            )}

            <input
              type="text"
              value={nationalId}
              onChange={(e) => handleInputChange(e, "nationalId")}
              placeholder="Enter National ID"
              maxLength={13}
              className="w-full px-4 py-2 border rounded-md mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            />

            {patientType === "existing" && (
              <div className="mb-6 text-center">
                <p className="text-lg text-gray-500 mb-2">
                  Do you have an appointment?
                </p>
                <button
                  onClick={() => handleAppointmentSelection(true)}
                  className={`px-4 py-2 mx-2 rounded-md font-bold ${
                    hasAppointment === true
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  Yes
                </button>
                <button
                  onClick={() => handleAppointmentSelection(false)}
                  className={`px-4 py-2 mx-2 rounded-md font-bold ${
                    hasAppointment === false
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  No
                </button>
              </div>
            )}

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <button
              onClick={handleSubmit}
              disabled={
                (patientType === "new" &&
                  (!isValidNationalId(nationalId) ||
                    !firstname ||
                    !lastname ||
                    !phone)) ||
                (patientType === "existing" &&
                  (!isValidNationalId(nationalId) || hasAppointment === null))
              }
              className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 transition disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              Create Queue
            </button>
          </>
        ) : (
          <div className="text-center mt-6">
            {queueDetails.status === "exists" ? (
              <>
                <h2 className="text-2xl font-bold text-gray-700">
                  You already have queue
                </h2>
                <p className="text-lg text-gray-500 mt-2">
                  Queue Number: {queueDetails.queueNumber}
                </p>
                <p className="text-lg text-gray-500 mt-2">
                  Remaining Queue: {queueDetails.remainingQueue}
                </p>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-700">
                  Queue Created Successfully!
                </h2>
                <p className="text-lg text-gray-500 mt-2">
                  Queue Number: {queueDetails.queueNumber}
                </p>
                <p className="text-lg text-gray-500 mt-2">
                  Remaining Queue: {queueDetails.remainingQueue}
                </p>
                <div className="flex mt-6 flex-col items-center justify-center">
                  <QRCode
                    value={`http://localhost:3000/user/qr-page?queue_id=${queueDetails.queue_id}`}
                    size={128}
                  />
                  <a
                    href={`http://localhost:3000/user/qr-page?queue_id=${queueDetails.queue_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 mt-4 hover:underline"
                  >
                    QR Code
                  </a>
                </div>
              </>
            )}
            <button
              onClick={() => setQueueCreated(false)} // Reset for new entry
              className="mt-6 bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 transition"
            >
              Reset
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
