import nodemailer from "nodemailer";

/**
 * ✅ Function to send a verification email
 */
export async function sendVerificationEmail(email: string, verificationCode: string) {
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.EMAIL_USER, // Your email
            pass: process.env.EMAIL_PASS, // Your email password or app-specific password
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Verify Your Email",
        text: `Your verification code is: ${verificationCode}`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`📧 Verification email sent to ${email}`);
}
