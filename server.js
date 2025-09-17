const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
const port = 3001;


app.use(cors());
app.use(bodyParser.json());

// Create transporter for Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

// Test sending email on server start to verify SMTP config
transporter.sendMail({
  from: process.env.GMAIL_USER,
  to: 'ugure47@gmail.com',
  subject: 'Test Email from Notify Backend',
  text: 'This is a test email sent on server start to verify SMTP configuration.'
}, (err, info) => {
  if (err) {
    console.error('Test email failed:', err);
  } else {
    console.log('Test email sent:', info.response);
  }
});

// Endpoint to send notification email
app.post('/send-notify-email', async (req, res) => {
  const { userEmail } = req.body;

  if (!userEmail) {
    return res.status(400).json({ error: 'User email is required' });
  }

  try {
    // Send email to ugure47@gmail.com
    const mailOptions = {
      from: process.env.GMAIL_USER || 'your-gmail@gmail.com',
      to: 'ugure47@gmail.com',
      subject: 'New Subscription Notification',
      text: `A new user has subscribed with email: ${userEmail}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending notification email:', error);
        return res.status(500).json({ error: 'Failed to send notification email' });
      } else {
        console.log(`Notification email sent successfully to ugure47@gmail.com for user: ${userEmail}`);
        return res.status(200).json({ message: 'Notification email sent successfully' });
      }
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({ error: 'Failed to send notification email' });
  }
});

app.listen(port, () => {
  console.log(`Notify email backend listening at http://localhost:${port}`);
});
