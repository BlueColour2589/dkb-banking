import nodemailer from 'nodemailer';

export async function sendOtpEmail(to: string, otp: string) {
  const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD, // App password instead of OAuth2
    },
  });

  const mailOptions = {
    from: `"DKB Banking" <${process.env.GMAIL_USER}>`,
    to,
    subject: 'DKB Banking - Your Verification Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #1e40af; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">DKB Banking</h1>
        </div>
        <div style="background-color: #f8fafc; padding: 30px;">
          <h2 style="color: #1e40af; text-align: center;">Your Verification Code</h2>
          <div style="background-color: white; border: 2px solid #1e40af; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="font-size: 36px; color: #1e40af; margin: 10px 0; letter-spacing: 8px; font-family: monospace;">${otp}</h1>
            <p style="color: #64748b;">This code expires in 10 minutes</p>
          </div>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}
