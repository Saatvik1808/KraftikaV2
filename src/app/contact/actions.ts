"use server";

import { z } from "zod";
import { sendEmail, type Message } from '@/services/email';

const formSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  message: z.string().min(10).max(500),
});

type ContactFormState = {
  success: boolean;
  message?: string;
  error?: string | null; // More specific error typing
  fieldErrors?: {
    name?: string[];
    email?: string[];
    message?: string[];
  };
};

export async function sendContactEmail(
   formData: unknown // Accept raw form data
): Promise<ContactFormState> {

  // Validate the form data
  const validatedFields = formSchema.safeParse(formData);

  // If validation fails, return errors
  if (!validatedFields.success) {
    return {
      success: false,
      error: "Invalid form data.",
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

   const { name, email, message } = validatedFields.data;

   // Prepare the message for the email service
   const emailMessage: Message = {
     name,
     email,
     message,
   };

  try {
    // Call your email sending service
    // IMPORTANT: Replace this with your actual email sending logic
    // (e.g., using Nodemailer, SendGrid, Resend, etc.)
    // For this example, we'll use the placeholder `sendEmail` function.
    const emailSent = await sendEmail(emailMessage);

    if (emailSent) {
       console.log("Contact email sent successfully to saatvik.shrivastava08@gmail.com from:", email);
      return { success: true, message: "Message sent successfully!" };
    } else {
      return { success: false, error: "Failed to send email via service." };
    }
  } catch (error) {
    console.error("Error sending contact email:", error);
    return { success: false, error: "An unexpected error occurred on the server." };
  }
}