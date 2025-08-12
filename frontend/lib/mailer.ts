// lib/mailer.ts
import nodemailer from 'nodemailer';
import { google } from 'googleapis';

const {
  GMAIL_CLIENT_ID,
  GMAIL_CLIENT_SECRET,
  GMAIL_REFRESH_TOKEN,
  GMAIL_SENDER,
} = process.env;

const oauth2Client = new google.auth.OAuth2(
  GMAIL_CLIENT_ID,
  GMAIL_CLIENT_SECRET,
  'https://developers.google.com/oauthplayground' // redirect URI not used here
);

oauth2Client.setCredentials({ refresh_token: GMAIL_REFRESH_TOKEN });

export async function sendOTPEmail(to: string, otp: string) {
  const { token } = await oauth2Client.getAccessToken();

  const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: GMAIL_SENDER,
      clientId: GMAIL_CLIENT_ID,
      clientSecret: GMAIL_CLIENT_SECRET,
      refreshToken: GMAIL_REFRESH_TOKEN,
      accessToken: token as string,
    },
  });

  await transport.sendMail({
    from: `"DKB OTP Sender" <${GMAIL_SENDER}>`,
    to,
    subject: 'Your One-Time Password',
    text: `Your OTP is: ${otp}`,
    html: `<p>Your OTP is: <strong>${otp}</strong></p>`,
  });
}
