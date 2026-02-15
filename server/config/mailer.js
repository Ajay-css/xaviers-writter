import nodemailer from "nodemailer";
import "dotenv/config";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendWelcomeEmail = async (email, name) => {
  await transporter.sendMail({
    from: `"Xaviers Writer" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Welcome to Xaviers Writer 🚀",
    html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <title>Welcome</title>
    </head>
    <body style="margin:0;padding:0;background-color:#f3f4f6;font-family:Arial, sans-serif;">

      <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
        <tr>
          <td align="center">

            <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.08);">

              <!-- Header -->
              <tr>
                <td align="center" style="background:linear-gradient(135deg,#2563eb,#1e40af);padding:40px 20px;">
                  <h1 style="color:#ffffff;margin:0;font-size:28px;">
                    Xaviers Writer ✍️
                  </h1>
                  <p style="color:#e0e7ff;margin-top:8px;font-size:14px;">
                    Real-Time Collaborative Editor
                  </p>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding:40px 30px;">
                  <h2 style="margin-top:0;color:#111827;">
                    Welcome aboard, ${name}! 🎉
                  </h2>

                  <p style="color:#4b5563;font-size:15px;line-height:1.6;">
                    We're excited to have you inside <strong>Xaviers Writer</strong>.
                    You can now create, edit, and collaborate on documents in real time.
                  </p>

                  <!-- Features -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin:30px 0;">
                    <tr>
                      <td style="padding:8px 0;color:#111827;">⚡ Real-time collaboration</td>
                    </tr>
                    <tr>
                      <td style="padding:8px 0;color:#111827;">💾 Auto save technology</td>
                    </tr>
                    <tr>
                      <td style="padding:8px 0;color:#111827;">🎨 Rich formatting tools</td>
                    </tr>
                    <tr>
                      <td style="padding:8px 0;color:#111827;">🔒 Secure cloud storage</td>
                    </tr>
                  </table>

                  <!-- CTA Button -->
                  <div style="text-align:center;margin:30px 0;">
                    <a href="${process.env.FRONTEND}/dashboard"
                       style="background:#2563eb;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:8px;font-weight:bold;display:inline-block;">
                       Open Dashboard →
                    </a>
                  </div>

                  <p style="color:#6b7280;font-size:13px;margin-top:30px;">
                    If you have any questions, simply reply to this email.
                  </p>

                  <p style="color:#111827;font-weight:bold;">
                    — Team Xaviers Writer
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td align="center" style="background:#f9fafb;padding:20px;font-size:12px;color:#9ca3af;">
                  © ${new Date().getFullYear()} Xaviers Writer. All rights reserved.
                </td>
              </tr>

            </table>

          </td>
        </tr>
      </table>

    </body>
    </html>
    `
  });
};
