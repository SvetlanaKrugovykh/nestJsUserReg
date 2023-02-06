import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';

const OAuth2 = google.auth.OAuth2;

const CLIENT_ID = '   ';
const CLIENT_SECRET = '   ';
const REDIRECT_URI = '   ';

const oauth2Client = new OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/gmail.readonly',
  ],
});

// Redirect the user to the authorization URL

// After the user grants permission, the authorization server will redirect the user back to your application with an authorization code
const code = '   '; // extract the authorization code from the URL query parameters

oauth2Client.getToken(code, (err, tokens) => {
  if (err) {
    console.error('Error obtaining access token', err);
    return;
  }

  // Store the tokens securely for future use
  oauth2Client.setCredentials(tokens);

  // Use the authenticated client to access the Google Calendar and Gmail APIs
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

  // ...
});

@Injectable()
export class CalendarService {
  private calendar: any;
  private gmail: any;

  constructor(AUTH_CLIENT) {
    this.calendar = google.calendar({ version: 'v3', auth: AUTH_CLIENT });
    this.gmail = google.gmail({ version: 'v1', auth: AUTH_CLIENT });
  }

  async addPaymentReminderEvent(customerName: string, customerEmail: string) {
    const date = new Date();
    date.setDate(date.getDate() + 1);

    const event = {
      summary: `Payment Reminder for ${customerName}`,
      description: 'Reminder to make a payment from the balance',
      start: {
        dateTime: date.toISOString(),
        timeZone: 'America/Los_Angeles',
      },
      end: {
        dateTime: date.toISOString(),
        timeZone: 'America/Los_Angeles',
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 1440 }, // remind the customer by email a day before the payment
        ],
      },
    };

    try {
      const eventResult = await this.calendar.events.insert({
        calendarId: 'primary',
        resource: event,
      });

      console.log(`Event created: ${eventResult.data.htmlLink}`);

      const email = {
        to: customerEmail,
        subject: `Payment Reminder for ${customerName}`,
        html: `<p>This is a reminder to make a payment from the balance on ${date.toDateString()}.</p>`,
      };

      const emailResult = await this.gmail.users.messages.send({
        userId: 'me',
        resource: { raw: this.createMessage(email) },
      });

      console.log(`Reminder email sent to ${customerEmail}`);
    } catch (err) {
      console.error(`Error creating the event or sending the email: ${err}`);
    }
  }

  private createMessage(email: any) {
    const headers = [
      `To: ${email.to}`,
      `Subject: ${email.subject}`,
      `Content-Type: text/html; charset=UTF-8`,
      'MIME-Version: 1.0',
    ];

    const message = `${headers.join('\r\n')}\r\n\r\n${email.html}`;
    const encodedMessage = new Buffer(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    return encodedMessage;
  }
}
