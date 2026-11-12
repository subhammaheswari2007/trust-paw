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

/**
 * Send an appointment notification email to the doctor / facility.
 *
 * @param {string} to       - Doctor's or Clinic's email address
 * @param {object} booking  - Booking details (bookingDate, timeSlot, serviceType, notes, id)
 */
export async function sendBookingAlertEmail(to, booking) {
  try {
    const mailOptions = {
      from: process.env.SMTP_USER || '"TrustPaw Bookings" <noreply@trustpaw.in>',
      to,
      subject: `🐾 New Appointment Booked: ${booking.serviceType || 'Service'} on ${booking.bookingDate} (${booking.timeSlot})`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 520px; margin: auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
          <h2 style="color: #2b6cb0; margin-top: 0;">🐾 TrustPaw Appointment Alert</h2>
          <p style="color: #4a5568; font-size: 15px;">Hello,</p>
          <p style="color: #4a5568; font-size: 15px;">A pet parent has just scheduled an appointment with your clinic/facility:</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background: #f7fafc; border-radius: 8px; overflow: hidden;">
            <tr>
              <td style="padding: 10px 14px; font-weight: bold; color: #4a5568; border-bottom: 1px solid #e2e8f0; width: 35%;">Service:</td>
              <td style="padding: 10px 14px; color: #2d3748; border-bottom: 1px solid #e2e8f0;">${(booking.serviceType || 'Consultation').toUpperCase()}</td>
            </tr>
            <tr>
              <td style="padding: 10px 14px; font-weight: bold; color: #4a5568; border-bottom: 1px solid #e2e8f0;">Date:</td>
              <td style="padding: 10px 14px; color: #2d3748; border-bottom: 1px solid #e2e8f0;">${booking.bookingDate}</td>
            </tr>
            <tr>
              <td style="padding: 10px 14px; font-weight: bold; color: #4a5568; border-bottom: 1px solid #e2e8f0;">Time Slot:</td>
              <td style="padding: 10px 14px; color: #2d3748; border-bottom: 1px solid #e2e8f0;">${booking.timeSlot}</td>
            </tr>
            <tr>
              <td style="padding: 10px 14px; font-weight: bold; color: #4a5568; border-bottom: 1px solid #e2e8f0;">Booking Ref:</td>
              <td style="padding: 10px 14px; color: #2d3748; border-bottom: 1px solid #e2e8f0;">#${String(booking.id).slice(-6)}</td>
            </tr>
            <tr>
              <td style="padding: 10px 14px; font-weight: bold; color: #4a5568;">Notes:</td>
              <td style="padding: 10px 14px; color: #2d3748;">${booking.notes || 'None'}</td>
            </tr>
          </table>

          <p style="color: #718096; font-size: 13px; margin-top: 20px; border-top: 1px solid #e2e8f0; padding-top: 14px;">
            This appointment was scheduled via the TrustPaw Pet Services Platform.
          </p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    if (info.message) {
      console.log('[DEV EMAIL ALERT SENT TO DOCTOR]:', JSON.parse(info.message).subject);
    } else {
      console.log(`✉️ Email alert successfully dispatched to doctor: ${to}`);
    }
  } catch (err) {
    console.error('Failed to dispatch doctor alert email:', err.message);
  }
}
