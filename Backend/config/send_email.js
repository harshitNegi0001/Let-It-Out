import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();
const api = process.env.RESEND_API_KEY;

const resend = new Resend(api);


export const sendEmail = async (email, subject, message) => {

    try {
        await resend.emails.send({
            from: process.env.OTP_SENDER_EMAIL,
            to: email,
            subject: subject,
            html: message
        })
    } catch (err) {
        console.log(err);
        throw err;
    }

}