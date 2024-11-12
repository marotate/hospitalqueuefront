import { useRouter } from 'next/router';
import QRCode from 'react-qr-code';

export default function QueueQRPage() {
  const router = useRouter();
  const { nationalId } = router.query; // Get user ID from the query parameters
  const queuenumber = 'a123';
 

  // Define the URL to be encoded in the QR code
 const queueViewUrl = nationalId ? `/user/qr-page?nationalId=${nationalId}&queuenumber=${queuenumber}`: '#';
  
 const handleLinkClick = () => {
    // Navigate programmatically to the qr-page with the nationalId and queuenumber
    router.push({
      query: { nationalId, queuenumber }, // Pass the nationalId here
    });
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-500 to-white p-4">
    <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-center">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">Queue QR Code</h1>
      <p className="mb-6 text-gray-700">Scan this QR code to view your queue</p>

      {nationalId ? (
        <QRCode
        size={256}
        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
        value={queueViewUrl}
        viewBox={`0 0 256 256`}
      />
      ) : (
        <p className="text-red-500 font-medium">Invalid user ID.</p>
      )}

<p className="mt-6 text-l text-center text-gray-500">
          This QR code links to: <br />
          <a
            href={queueViewUrl}
            onClick={handleLinkClick} // Use the custom onClick handler
            className="text-blue-500 underline"
          >
            {queueViewUrl}
          </a>
      </p>
    </div>
    </div>
  );
}
