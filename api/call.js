// api/call.js
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const callerId = process.env.CALLER_ID;

const twilio = require('twilio');
const client = twilio(accountSid, authToken);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { to } = req.body;
  const cleanTo = to.replace(/\D/g, '');

  try {
    const call = await client.calls.create({
      url: 'https://handler.twilio.com/twiml/EH83a3a2a2a2a2a2a2a2a2a2a2a2a2a2a2',
      to: `+${cleanTo}`,
      from: callerId,
      callerId: 'private'
    });

    res.status(200).json({ success: true, callSid: call.sid });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}