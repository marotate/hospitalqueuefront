import { useState } from 'react';

export default function RegisterQueuePage() {
  const [nationalId, setNationalId] = useState('');
  const [error, setError] = useState('');
  const [patientType, setPatientType] = useState<'new' | 'returning' | ''>('');
  const [hasAppointment, setHasAppointment] = useState<boolean | null>(null);
  const [queueCreated, setQueueCreated] = useState(false);

  const isValidNationalId = (id: string) => /^[0-9]{13}$/.test(id);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = e.target.value;
    setNationalId(id);
    setError('');
    if (id && !isValidNationalId(id)) {
      setError('National ID must be a 13-digit number');
    }
  };

  const handlePatientTypeSelection = (type: 'new' | 'returning') => {
    setPatientType(type);
    setHasAppointment(null); // Reset appointment selection if switching patient type
  };

  const handleAppointmentSelection = (hasAppointment: boolean) => {
    setHasAppointment(hasAppointment);
  };

  const handleSubmit = () => {
    if (isValidNationalId(nationalId)) {
      setQueueCreated(true); // Indicate that queue is created successfully
    } else {
      setError('Please enter a valid 13-digit National ID number');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-500 to-white">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-3xl">
        <h1 className="text-4xl font-bold text-center mb-6 text-gray-700">Welcome to the Cloud Hospital</h1>
        <p className="text-center mb-6 text-lg text-gray-500">Please enter your National ID number to create a queue</p>

        <input
          type="text"
          value={nationalId}
          onChange={handleInputChange}
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
                onClick={() => handlePatientTypeSelection('new')}
                className={`px-4 py-2 mx-2 rounded-md font-bold ${patientType === 'new' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                New Patient
              </button>
              <button
                onClick={() => handlePatientTypeSelection('returning')}
                className={`px-4 py-2 mx-2 rounded-md font-bold ${patientType === 'returning' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                Returning Patient
              </button>
            </div>

            {/* Show appointment options if patient is returning */}
            {patientType === 'returning' && (
              <div className="mb-6 text-center">
                <p className="text-lg text-gray-500 mb-2">Do you have an appointment?</p>
                <button
                  onClick={() => handleAppointmentSelection(true)}
                  className={`px-4 py-2 mx-2 rounded-md font-bold ${hasAppointment === true ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  Yes
                </button>
                <button
                  onClick={() => handleAppointmentSelection(false)}
                  className={`px-4 py-2 mx-2 rounded-md font-bold ${hasAppointment === false ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  No
                </button>
              </div>
            )}

            {/* Show submit button if valid inputs are provided */}
            <button
              onClick={handleSubmit}
              disabled={!isValidNationalId(nationalId) || (patientType === 'returning' && hasAppointment === null)}
              className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 transition disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              Create Queue
            </button>
          </>
        )}

        {/* Display success message when queue is created */}
        {queueCreated && (
          <div className="text-center mt-6">
            <h2 className="text-2xl font-bold text-gray-700">Queue Created Successfully!</h2>
            <p className="text-lg text-gray-500 mt-4">
              National ID: {nationalId}
            </p>
            <p className="text-lg text-gray-500 mt-2">
              Patient Type: {patientType === 'new' ? 'New Patient' : 'Returning Patient'}
            </p>
            {patientType === 'returning' && hasAppointment !== null && (
              <p className="text-lg text-gray-500 mt-2">
                Appointment: {hasAppointment ? 'Yes' : 'No'}
              </p>
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
