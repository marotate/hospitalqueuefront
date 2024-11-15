import { useState } from "react";
import QRCode from "react-qr-code";

export default function RegisterQueuePage() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [error, setError] = useState("");
  const [patientType, setPatientType] = useState<"new" | "existing" | "">("");
  const [hasAppointment, setHasAppointment] = useState<boolean | null>(null);
  const [queueCreated, setQueueCreated] = useState(false);
  const [queueDetails, setQueueDetails] = useState({
    queueNumber: "",
    remainingQueue: 0,
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
    }
  };

  const handlePatientTypeSelection = (type: "new" | "existing") => {
    setPatientType(type);
    setHasAppointment(null); // Reset appointment selection if switching patient type
  };

  const handleAppointmentSelection = (hasAppointment: boolean) => {
    setHasAppointment(hasAppointment);
  };

  const handleSubmit = async () => {
    if (isValidNationalId(nationalId) && firstname && lastname) {
      const patientTypeCode =
        patientType === "new" ? "A" : hasAppointment ? "B" : "C";
      try {
        const response = await fetch("https://cors-anywhere.herokuapp.com/https://mmryvmf73h.execute-api.us-east-1.amazonaws.com/prod/createqueue", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            patient_idcard: nationalId,
            patient_firstname: firstname,
            patient_lastname: lastname,
            patient_type: patientTypeCode,
          }),
        });
        
        console.log("Response Status:", response.status);
        console.log("Response Headers:", response.headers);
        
        if (response.ok) {
          const result = await response.json();
          console.log("Queue created:", result);
          setQueueDetails({
            queueNumber: result.queueNumber,
            remainingQueue: result.remainingQueue,
          });
          setQueueCreated(true);
        } else {
          console.error("Failed to create queue:", response.statusText);
          setError("Failed to create queue. Please try again.");
        }
        
      } catch (error) {
        console.error("Error during queue creation:", error);
        setError("An error occurred. Please try again.");
      }
    } else {
      setError("Please fill out all fields correctly.");
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
          value={nationalId}
          onChange={(e) => handleInputChange(e, "nationalId")}
          placeholder="Enter National ID number"
          maxLength={13}
          className="w-full px-4 py-2 border rounded-md mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
        />
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {/* Show patient type selection buttons */}
        {!queueCreated && (
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

            {/* Show appointment options if patient is existing */}
            {patientType === "existing" && (
              <div className="mb-6 text-center">
                <p className="text-lg text-gray-500 mb-2">
                  Do you have an appointment and attended as scheduled?
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

            {/* Show submit button if valid inputs are provided */}
            <button
              onClick={handleSubmit}
              disabled={
                !isValidNationalId(nationalId) ||
                !firstname ||
                !lastname ||
                (patientType === "existing" && hasAppointment === null)
              }
              className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 transition disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              Create Queue
            </button>
          </>
        )}

        {/* Display success message when queue is created */}
        {queueCreated && (
          <div className="text-center mt-6">
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
              <h3 className="text-lg text-gray-700 font-bold">Your QR Code</h3>
              <QRCode
                value={JSON.stringify(queueDetails)}
                className="mt-4"
                size={128}
              />
            </div>
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
