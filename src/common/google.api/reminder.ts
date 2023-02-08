import fs = require('fs');
import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';

@Injectable()
export class CalendarService {
	private calendar: any;
  private CALENDAR_ID: string;
  private KEYFILE: string;
  private SCOPE_CALENDAR: string;
  private SCOPE_EVENTS: string;

  constructor() {
    this.CALENDAR_ID = process.env.CALENDAR_ID;
    this.KEYFILE = process.env.KEYFILE;
    this.SCOPE_CALENDAR = process.env.SCOPE_CALENDAR;
    this.SCOPE_EVENTS = process.env.SCOPE_EVENTS;
		this.calendar = google.calendar('v3');
  }

  async readPrivateKey() {
    const content = fs.readFileSync(this.KEYFILE);
    return JSON.parse(content.toString());
  }

  async authenticate(key) {
    const jwtClient = new google.auth.JWT(
      key.client_email,
      null,
      key.private_key,
      [this.SCOPE_CALENDAR, this.SCOPE_EVENTS],
    );
    await jwtClient.authorize();
    return jwtClient;
  }

  async addPaymentReminderEvent(
    customerName: string,
    customerEmail: string,
    nextPaymentDateString: Date,
  ) {
    const key = await this.readPrivateKey();
    const auth = await this.authenticate(key);
//    const calendar: any = google.calendar({ version: 'v3', auth });

    const nextPaymentDate = new Date(nextPaymentDateString);
    const nextPaymentDateFinish = new Date(nextPaymentDate.getTime() + 2000);
    const event = {
      summary: `Payment Reminder for ${customerName}`,
      description: 'Reminder to make a payment from the balance',
      start: {
        dateTime: nextPaymentDate.toISOString(),
        timeZone: 'Europe/Riga',
      },
      end: {
        dateTime: nextPaymentDateFinish.toISOString(),
        timeZone: 'Europe/Riga',
      },
//      reminders: {
//        useDefault: false,
//        overrides: [
//          { method: 'email', minutes: 24 * 60 },
//          { method: 'popup', minutes: 30 },
//        ],
 //     },
    };

    try {
      const eventResult = await this.calendar.events.insert({
        auth: auth,
        calendarId: this.CALENDAR_ID,
        resource: event,
      });

      console.log(`Event created: ${eventResult.data}`);
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
