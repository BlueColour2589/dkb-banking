import nodemailer from 'nodemailer';

export async function sendOtpEmail(to: string, otp: string) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.GMAIL_USER,
      clientId: process.env.GMAIL_CLIENT_ID,
      clientSecret: process.env.GMAIL_CLIENT_SECRET,
      refreshToken: process.env.GMAIL_REFRESH_TOKEN,
    },
  });

  const mailOptions = {
    from: `"DKB Banking" <${process.env.GMAIL_USER}>`,
    to,
    subject: 'Your OTP Code',
    text: `Your verification code is: ${otp}`,
  };

  await transporter.sendMail(mailOptions);
}
