import { useState } from "react";

export default function App() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [callStatus, setCallStatus] = useState("Ready");
  const [isCalling, setIsCalling] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  let interval;

  const handleNumberClick = (digit) => {
    if (phoneNumber.length < 15) {
      setPhoneNumber(phoneNumber + digit);
    }
  };

  const deleteLastDigit = () => {
    setPhoneNumber(phoneNumber.slice(0, -1));
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const secsPart = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${secsPart.toString().padStart(2, "0")}`;
  };

  const startCall = async () => {
    if (!phoneNumber || phoneNumber.length < 5) {
      setCallStatus("Enter a valid number");
      return;
    }

    setCallStatus("Calling...");
    setIsCalling(true);
    setCallDuration(0);

    try {
      const res = await fetch("/api/call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: phoneNumber }),
      });

      const data = await res.json();
      if (data.success) {
        setCallStatus("Call Connected");
        interval = setInterval(() => {
          setCallDuration((prev) => prev + 1);
        }, 1000);
      } else {
        setCallStatus(`Error: ${data.message}`);
        setIsCalling(false);
      }
    } catch (err) {
      setCallStatus(`Error: ${err.message}`);
      setIsCalling(false);
    }
  };

  const endCall = () => {
    clearInterval(interval);
    setCallStatus("Call Ended");
    setIsCalling(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold">SecureCall</h1>
          <p className="text-gray-300 text-sm">Anonymous & Encrypted Calling</p>
        </div>

        <div className="bg-black bg-opacity-30 backdrop-blur-sm rounded-2xl p-6 mb-6 text-center border border-gray-700">
          <div className="text-sm text-gray-300 mb-2">Status: {callStatus}</div>
          <div className="text-3xl font-medium mb-2 min-h-10">{phoneNumber || "Enter number"}</div>
          {isCalling && (
            <div className="text-red-400 font-mono text-lg">{formatTime(callDuration)}</div>
          )}
        </div>

        <div className="bg-gray-900 bg-opacity-50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
          <div className="grid grid-cols-3 gap-4 mb-6">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"].map((key) => (
              <button
                key={key}
                onClick={() => handleNumberClick(key)}
                className="bg-gray-800 hover:bg-gray-700 active:bg-gray-600 rounded-xl py-4 text-xl font-medium transition"
              >
                {key}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between gap-4">
            <button
              onClick={deleteLastDigit}
              className="flex-1 bg-gray-800 hover:bg-gray-700 rounded-xl py-3"
            >
              ←
            </button>
            {!isCalling ? (
              <button
                onClick={startCall}
                className="flex-1 bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-xl py-3 font-medium flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call
              </button>
            ) : (
              <button
                onClick={endCall}
                className="flex-1 bg-gray-600 hover:bg-gray-700 rounded-xl py-3 font-medium flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                End
              </button>
            )}
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-gray-400">
          <p>• End-to-End Encrypted • No Logs • Global Calling</p>
        </div>
      </div>
    </div>
  );
}