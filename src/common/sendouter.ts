import * as nodemailer from 'nodemailer';

export async function sendVerificationEmail(email: string, code: string) {
  const smtpOptions = {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 2525,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
    timeout: 50,
  };

  const mailOptions = {
    from: `${process.env.SMTP_USER}`,
    to: email,
    subject: 'Verification Code is here',
    text: `Your verification code is ${code}`,
  };

  const transporter = nodemailer.createTransport(smtpOptions);

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.log(error);
  }
}

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = 'twilio(accountSid, authToken)';

export async function sendVerificationSMS(phoneNumber: string, code: string) {
  await {
    body: `Your verification code is ${code}`,
    from: '+1234567890',
    to: phoneNumber,
  };
}
