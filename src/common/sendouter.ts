import * as nodemailer from 'nodemailer';


const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 25,
  secure: true, 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendVerificationEmail(email: string, code: string) {
  const mailOptions = {
    from: '"Verification Code" <verification@example.com>',
    to: email,
    subject: 'Verification Code',
    text: `Your verification code is ${code}`,
  };

  await transporter.sendMail(mailOptions);
}

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = 'twilio(accountSid, authToken)';

export async function sendVerificationSMS(phoneNumber: string, code: string) {
  await ({
    body: `Your verification code is ${code}`,
    from: '+1234567890',
    to: phoneNumber,
  });

}

