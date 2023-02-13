import fs = require('fs');
import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import axios from 'axios';
import qs from 'qs';


@Injectable()
export class CalendarService {
  private credentials: any;
  private auth: any;
  private calendar: any;
  private CALENDAR_ID: string;
  private GOOGLE_CLIENT_ID: string;
  private GOOGLE_CLIENT_SECRET: string;
  private GOOGLE_CALENDAR_REDIRECT_URI: string;

  constructor() {
    this.CALENDAR_ID = process.env.CALENDAR_ID;
    this.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    this.GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
    this.GOOGLE_CALENDAR_REDIRECT_URI =
      process.env.GOOGLE_CALENDAR_REDIRECT_URI;

    this.auth = new google.auth.OAuth2(
      this.GOOGLE_CLIENT_ID,
      this.GOOGLE_CLIENT_SECRET,
      this.GOOGLE_CALENDAR_REDIRECT_URI,
    );

    this.credentials = {
      access_token: 'ACCESS_TOKEN',
      token_type: 'Bearer', // mostly Bearer
      refresh_token: 'REFRESH_TOKEN',
      expiry_date: 'EXPIRY_TIME',
    };
    this.auth.setCredentials(this.credentials);
    this.calendar = google.calendar({ version: 'v3' });
  }

  // async readPrivateKey() {
  //   const content = fs.readFileSync(this.KEYFILE);
  //   return JSON.parse(content.toString());
  // }

  // async authenticate(key) {
  //   const jwtClient = new google.auth.JWT(
  //     key.client_email,
  //     null,
  //     key.private_key,
  //     [this.SCOPE_CALENDAR, this.SCOPE_EVENTS],
  //   );
  //   await jwtClient.authorize();
  //   return jwtClient;
  // }
  async googleAuthVersion1(customerName: string, customerEmail: string) {
    const scopes = ['https://www.googleapis.com/auth/calendar'];
    const authUrl = this.auth.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent',
      customer_name: customerName,
      customer_email: customerEmail,
    });
    console.log(`Authorize this app by visiting this URL: ${authUrl}`);
    try {
      const response = await axios.get(authUrl);
      const code = response.data.match(/code=([^&]+)/)[1];

      const { data } = await axios.post(
        `https://oauth2.googleapis.com/token`,
        qs.stringify({
          code,
          client_id: this.GOOGLE_CLIENT_ID,
          client_secret: this.GOOGLE_CLIENT_SECRET,
          redirect_uri: this.GOOGLE_CALENDAR_REDIRECT_URI,
          grant_type: 'authorization_code',
        }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
      );
      this.auth.setCredentials(data);
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }






  async addPaymentReminderEvent(customerName: string, customerEmail: string) {
    const rezult = await this.googleAuthVersion1(customerName, customerEmail);
    return rezult;

    // //const key = await this.readPrivateKey();
    // passport.initialize();
    // passport.session();
    // passport.use(
    //   new GoogleStrategy(
    //     {
    //       clientID: this.GOOGLE_CLIENT_ID,
    //       clientSecret: this.GOOGLE_CLIENT_SECRET,
    //       callbackURL: this.GOOGLE_CALENDAR_REDIRECT_URI,
    //       passReqToCallback: true,
    //     },
    //     function (request, accessToken, refreshToken, profile, done) {
    //       return done(null, profile);
    //     },
    //   ),
    // );

    // const nextPaymentDate = new Date(nextPaymentDateString);
    // const nextPaymentDateFinish = new Date(nextPaymentDate.getTime() + 2000);
    // const event = {
    //   summary: `Payment Reminder for ${customerName}`,
    //   description: 'Reminder to make a payment from the balance',
    //   start: {
    //     dateTime: nextPaymentDate.toISOString(),
    //     timeZone: 'Europe/Riga',
    //   },
    //   end: {
    //     dateTime: nextPaymentDateFinish.toISOString(),
    //     timeZone: 'Europe/Riga',
    //   },
    //   reminders: {
    //     useDefault: false,
    //     overrides: [
    //       { method: 'email', minutes: 1440 },
    //       { method: 'popup', minutes: 30 },
    //     ],
    //   },
    // };

    // try {
    //   const eventResult = await this.calendar.events.insert({
    //     auth: this.auth,
    //     calendarId: this.CALENDAR_ID,
    //     resource: event,
    //   });
    //   console.log(`Event created: ${eventResult.data.htmlLink}`);
    //   return eventResult.data.htmlLink;
    // } catch (err) {
    //   console.error(`Error creating the event or sending the email: ${err}`);
    //   return err;
    // }
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
