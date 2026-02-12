import nodemailer from 'nodemailer';
import dotenv from 'dotenv'

dotenv.config();

// sendEmail will create a transporter, verify connection and send mail.
// It logs and rethrows errors so callers can see what failed (useful on Render).
export const sendEmail = async (email, subject, message) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp-relay.brevo.com',
            port: 587,
            secure: false, // TLS ke liye false hi rahega
            auth: {
                user: process.env.BREVO_USER, // Aapka Brevo login email
                pass: process.env.BREVO_API_KEY, // Aapki generate ki hui SMTP Key
            },
            // service: 'gmail', // Agar gmail use kar rahe hain
            // host: 'smtp.gmail.com',
            // port: 587,
            // secure: false, // Port 587 ke liye ye false hona chahiye
            // auth: {
            //     user: process.env.EMAIL_USER,
            //     pass: process.env.EMAIL_PASS, // Make sure ye App Password hai
            // },
            // tls: {
            //     rejectUnauthorized: false // Ye line connection issues ko bypass karne mein help karti hai
            // }
        });

        // verify transporter (helps surface auth/connection errors early)
        // await transporter.verify();
        // console.log('transporter verified');

        const info = await transporter.sendMail({
            from: process.env.OTP_SENDER_EMAIL,
            to: email,
            subject: subject,
            html: message
        });
        console.log('email,sent');
        console.log('Email sent:', info.messageId);
        return info;
    } catch (err) {
        // log detailed error for server logs (Render logs will capture this)
        console.log(err);
        console.error('sendEmail error:', err && err.message ? err.message : err);
        throw err;
    }
}

