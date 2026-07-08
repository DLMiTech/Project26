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


const sendAccessGrantedEmail = async (to, name, courseTitle, accessLevel, startDatetime, endDatetime) => {
    try {
        const start = new Date(startDatetime).toLocaleString();
        const end = new Date(endDatetime).toLocaleString();

        const mailOptions = {
            from: `"Course Access" <${process.env.EMAIL_USER}>`,
            to,
            subject: `Access Granted: ${courseTitle}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #2c3e50;">Hello ${name},</h2>
                    <p>Your access request has been <strong style="color: #27ae60;">APPROVED</strong>.</p>
                    
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="margin-top: 0; color: #34495e;">Access Details</h3>
                        <p><strong>Course:</strong> ${courseTitle}</p>
                        <p><strong>Access Level:</strong> ${accessLevel}</p>
                        <p><strong>Start:</strong> ${start}</p>
                        <p><strong>End:</strong> ${end}</p>
                    </div>
                    
                    <p>You can now access the course materials during the specified period.</p>
                    <p style="color: #7f8c8d; font-size: 12px;">If you did not request this access, please contact the administrator.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`Access granted email sent to ${to}`);
    } catch (error) {
        console.error('Failed to send access granted email:', error);
        throw error;
    }
};

const sendAccessDeclinedEmail = async (to, name, courseTitle) => {
    try {
        const mailOptions = {
            from: `"Course Access" <${process.env.EMAIL_USER}>`,
            to,
            subject: `Access Declined: ${courseTitle}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #2c3e50;">Hello ${name},</h2>
                    <p>We regret to inform you that your access request for <strong>${courseTitle}</strong> has been <strong style="color: #e74c3c;">DECLINED</strong>.</p>
                    <p>If you believe this is an error, please contact the administrator for further assistance.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`Access declined email sent to ${to}`);
    } catch (error) {
        console.error('Failed to send access declined email:', error);
        throw error;
    }
};

module.exports = { sendOTP, sendAccessDeclinedEmail, sendAccessGrantedEmail};