import nodemailer from 'nodemailer';
import dotenv from 'dotenv'

dotenv.config();

// sendEmail will create a transporter, verify connection and send mail.
// It logs and rethrows errors so callers can see what failed (useful on Render).
export const sendEmail = async (email, subject, message) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // use STARTTLS
            auth: {
                user: process.env.OTP_SENDER_EMAIL,
                pass: process.env.OTP_SENDER_PASSWORD
            },
            tls: {
                rejectUnauthorized: false
            }
        });
console.log('transppporter created');
console.log('email',process.env.OTP_SENDER_EMAIL);
console.log('app-password',process.env.OTP_SENDER_PASSWORD);
        // verify transporter (helps surface auth/connection errors early)
        await transporter.verify();
console.log('transporter verified');

        const info = await transporter.sendMail({
            from: process.env.OTP_SENDER_EMAIL,
            to: email,
            subject: subject,
            html: message
        });
console.log('email,send');
        console.log('Email sent:', info.messageId);
        return info;
    } catch (err) {
        // log detailed error for server logs (Render logs will capture this)
        console.log(err);
        console.error('sendEmail error:', err && err.message ? err.message : err);
        throw err;
    }
}

