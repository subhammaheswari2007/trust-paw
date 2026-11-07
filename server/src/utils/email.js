import nodemailer from 'nodemailer';

/**
 * Build a Nodemailer transport.
 *  - When SMTP_USER & SMTP_PASS are set → real SMTP transport
 *  - Otherwise → a JSON transport that logs to console (dev mode)
 */
function createTransport() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (SMTP_USER && SMTP_PASS) {
    return nodemailer.createTransport({
      host: SMTP_HOST || 'smtp.gmail.com',
      port: Number(SMTP_PORT) || 587,
      secure: false,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
  }

  // Dev fallback — prints to stdout
  return nodemailer.createTransport({ jsonTransport: true });
}

const transporter = createTransport();

/**
 * Send an OTP email.
 * In dev mode (no SMTP configured) the email body is logged to the console.
 *
 * @param {string} to   - Recipient email address
 * @param {string} otp  - The plaintext OTP to include in the email
 */
export async function sendOTPEmail(to, otp) {
  const mailOptions = {
    from: process.env.SMTP_USER || '"TrustPaw" <noreply@trustpaw.in>',
    to,
    subject: 'Your TrustPaw Verification Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 420px; margin: auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px;">
        <h2 style="color: #2d3748;">🐾 TrustPaw Verification</h2>
        <p>Your one-time password is:</p>
        <div style="font-size: 32px; font-weight: bold; letter-spacing: 6px; text-align: center; padding: 16px; background: #f7fafc; border-radius: 8px; color: #2b6cb0;">
          ${otp}
        </div>
        <p style="color: #718096; font-size: 14px; margin-top: 16px;">This code expires in 5 minutes. Do not share it with anyone.</p>
      </div>
    `,
  };

  const info = await transporter.sendMail(mailOptions);

  // In dev mode (jsonTransport), log the message so developers can read the OTP
  if (info.message) {
    console.log('[DEV EMAIL]', JSON.parse(info.message).subject);
  }
}
