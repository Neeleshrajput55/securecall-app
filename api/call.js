// api/call.js
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const callerId = process.env.CALLER_ID;

// Check if credentials are set
if (!accountSid || !authToken || !callerId) {
  console.error("Missing Twilio credentials");
  export default (req, res) => {
    res.status(500).json({ 
      success: false, 
      message: "Server not configured. Check environment variables." 
    });
  };
  return;
}

const twilio = require('twilio');
const client = twilio(accountSid, authToken);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { to } = req.body;
  if (!to) {
    return res.status(400).json({ success: false, message: "Phone number is required" });
  }

  const cleanTo = to.replace(/\D/g, '');
  if (cleanTo.length < 7) {
    return res.status(400).json({ success: false, message: "Invalid phone number" });
  }

  try {
    const call = await client.calls.create({
      url: 'https://handler.twilio.com/twiml/EH83a3a2a2a2a2a2a2a2a2a2a2a2a2a2a2',
      to: `+${cleanTo}`,
      from: callerId,
      callerId: 'private'
    });

    res.status(200).json({ success: true, callSid: call.sid });
  } catch (err) {
    console.error("Twilio Error:", err.message);
    res.status(500).json({ 
      success: false, 
      message: "Call failed. Check credentials and phone number." 
    });
  }
}
