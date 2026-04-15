import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Common styling constants to keep the design consistent
const BRAND_COLOR = "#88BDF2";
const BG_DARK = "#1A232E";
const CARD_BG = "#1F2937";
const TEXT_MAIN = "#ffffff";
const TEXT_MUTED = "#94a3b8";

const emailTemplate = (content) => `
  <div style="background-color: ${BG_DARK}; padding: 40px 20px; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: ${TEXT_MUTED};">
    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: ${CARD_BG}; border: 1px solid rgba(255,255,255,0.05); border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
      
      <tr>
        <td align="center" style="padding: 40px 0 20px 0;">
          <div style="display: inline-block; background-color: rgba(136, 189, 242, 0.1); padding: 12px; border-radius: 12px; border: 1px solid rgba(136, 189, 242, 0.2); margin-bottom: 15px;">
            <span style="font-size: 24px;">✨</span>
          </div>
          <h1 style="margin: 0; color: ${TEXT_MAIN}; font-size: 22px; font-weight: 900; letter-spacing: -0.05em; text-transform: uppercase; font-style: italic;">
            CANVAS<span style="color: ${BRAND_COLOR};">.</span>OS
          </h1>
        </td>
      </tr>

      <tr>
        <td style="padding: 0 40px 40px 40px; text-align: center;">
          ${content}
        </td>
      </tr>

      <tr>
        <td style="padding: 20px; background-color: rgba(0,0,0,0.2); text-align: center; border-top: 1px solid rgba(255,255,255,0.05);">
          <p style="margin: 0; font-size: 10px; color: #475569; text-transform: uppercase; font-weight: 800; letter-spacing: 0.2em;">
            &copy; 2026 Canvas.OS • Intelligent Writing Workspace
          </p>
        </td>
      </tr>
    </table>
  </div>
`;

// --- Updated OTP Function ---
export const sendOTP = async (email, otp) => {
  try {
    const htmlContent = `
      <h2 style="color: ${TEXT_MAIN}; font-size: 20px; margin-bottom: 10px;">Verify Your Identity</h2>
      <p style="font-size: 15px; line-height: 24px; color: ${TEXT_MUTED}; margin-bottom: 30px;">
        Use the following verification code to complete your sign-in process. This code is private and should not be shared.
      </p>
      <div style="background-color: rgba(136, 189, 242, 0.05); border: 2px dashed ${BRAND_COLOR}; border-radius: 12px; padding: 20px; margin-bottom: 25px;">
        <span style="font-size: 32px; font-weight: 900; color: ${BRAND_COLOR}; letter-spacing: 0.3em; margin-left: 0.3em;">${otp}</span>
      </div>
      <p style="font-size: 12px; color: #64748b; font-style: italic;">
        Valid for 10 minutes. If you didn't request this, please ignore this email.
      </p>
    `;

    await transporter.sendMail({
      from: `"Canvas.OS" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `[${otp}] Your Verification Code`,
      html: emailTemplate(htmlContent),
    });
  } catch (error) {
    console.error("OTP Email sending failed:", error);
    throw new Error("Failed to send verification email.");
  }
};

// --- Updated Forgot Password Function ---
export const sendResetEmail = async (email, token) => {
  try {
    const resetLink = `${process.env.FRONTEND_URL || "http://localhost:3000"}/forget?token=${token}`;

    const htmlContent = `
      <h2 style="color: ${TEXT_MAIN}; font-size: 20px; margin-bottom: 10px;">Password Reset Request</h2>
      <p style="font-size: 15px; line-height: 24px; color: ${TEXT_MUTED}; margin-bottom: 30px;">
        Lost your way? No problem. Click the button below to reset your password and get back to creating.
      </p>
      
      <a href="${resetLink}" 
         style="background-color: ${BRAND_COLOR}; color: ${BG_DARK}; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: 900; font-size: 13px; text-transform: uppercase; letter-spacing: 0.1em; display: inline-block; box-shadow: 0 4px 20px rgba(136, 189, 242, 0.3);">
         Reset Password
      </a>

      <p style="font-size: 12px; color: #64748b; margin-top: 35px; font-style: italic;">
        This secure link will expire in 1 hour.
      </p>
    `;

    await transporter.sendMail({
      from: `"Canvas.OS" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Security: Password Reset Request",
      html: emailTemplate(htmlContent),
    });
  } catch (error) {
    console.error("Reset Email sending failed:", error);
    throw new Error("Failed to send reset email.");
  }
};
