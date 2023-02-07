import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';

@Injectable()
export class CalendarService {
  private calendar: any;
  private gmail: any;
  private oauth2Client: any;

  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URL,
    );

    this.calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });
    this.gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });
  }

  async addPaymentReminderEvent(
    customerName: string,
    customerEmail: string,
    nextPaymentDateString: Date,
  ) {
    const nextPaymentDate = new Date(nextPaymentDateString);
    const nextPaymentDateFinish = new Date(nextPaymentDate.getTime() + 2000);
    const event = {
      summary: `Payment Reminder for ${customerName}`,
      description: 'Reminder to make a payment from the balance',
      start: {
        dateTime: nextPaymentDate.toISOString(),
        timeZone: 'America/Los_Angeles',
      },
      end: {
        dateTime: nextPaymentDateFinish.toISOString(),
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
        html: `<p>This is a reminder to make a payment from the balance on ${nextPaymentDate.toDateString()}.</p>`,
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
