const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendOTP = async (email, otp, purpose = 'verification') => {
    try {
        const subjects = {
            verification: 'Your Verification Code',
            login: 'Your Login Code',
            reset: 'Your Password Reset Code'
        };

        const htmlContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Security Code</h2>
                <p>Hello,</p>
                <p>Your verification code is:</p>
                <div style="background: #f4f4f4; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; border-radius: 8px;">
                    ${otp}
                </div>
                <p>This code expires in <strong>10 minutes</strong>.</p>
                <p style="color: #666; font-size: 12px;">If you didn't request this, please ignore this email.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="color: #999; font-size: 11px;">This is an automated message. Please do not reply.</p>
            </div>
        `;

        const info = await transporter.sendMail({
            from: `"Your App Name" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: subjects[purpose],
            html: htmlContent,
            text: `Your code is: ${otp}. Expires in 10 minutes.`  // Plain text version
        });

        return true;
    } catch (error) {
        console.error('Failed to send email:', error);
        throw error;
    }
};


const sendRequestMessage = async () => {
    try {
        const subjects = {
            verification: 'Your Verification Code',
            login: 'Your Login Code',
            reset: 'Your Password Reset Code'
        };

        const htmlContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Security Code</h2>
                <p>Hello,</p>
                <p>Your verification code is:</p>
                <div style="background: #f4f4f4; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; border-radius: 8px;">
                    ${otp}
                </div>
                <p>This code expires in <strong>10 minutes</strong>.</p>
                <p style="color: #666; font-size: 12px;">If you didn't request this, please ignore this email.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="color: #999; font-size: 11px;">This is an automated message. Please do not reply.</p>
            </div>
        `;

        const info = await transporter.sendMail({
            from: `"Your App Name" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: subjects[purpose],
            html: htmlContent,
            text: `Your code is: ${otp}. Expires in 10 minutes.`  // Plain text version
        });

        return true;
    } catch (error) {
        console.error('Failed to send email:', error);
        throw error;
    }
};

module.exports = { sendOTP, sendRequestMessage};