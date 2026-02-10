import nodemailer from 'nodemailer';
import dotenv from 'dotenv'

dotenv.config();

export const sendEmail = async (email, subject, message) => {
    const transporter = nodemailer.createTransport({
        host:'smtp.gmail.com',
        port:587,
        secure:false,
        auth:{
            user:process.env.OTP_SENDER_EMAIL,
            pass:process.env.OTP_SENDER_PASSWORD
        }
    });

    await transporter.sendMail({
        from:process.env.OTP_SENDER_EMAIL,
        to:email,
        subject:subject,
        html:message
    })
}

