import nodemailer from "nodemailer";

export interface Message {
  name: string;
  email: string;
  message: string;
}

export async function sendEmail({ name, email, message }: Message): Promise<boolean> {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER, // your Gmail address
        pass: process.env.EMAIL_PASS, // app-specific password
      },
    });

    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: process.env.EMAIL_TO || "saatvik.shrivastava@gmail.com",
      subject: `New message from ${name}`,
      text: message,
      html: `
        <p><strong>Sender Name:</strong> ${name}</p>
        <p><strong>Sender Email:</strong> ${email}</p>
        <p><strong>Message:</strong><br/>${message}</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}
