
"use server";

import { z } from "zod";
import { sendEmail, type Message } from '@/services/email';

// Define the schema for the form data
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters.").max(50, "Name cannot exceed 50 characters."),
  email: z.string().email("Please enter a valid email address."),
  message: z.string().min(10, "Message must be at least 10 characters.").max(500, "Message cannot exceed 500 characters."),
});

// Define the type based on the schema
type FormData = z.infer<typeof formSchema>;

// Define the state structure returned by the action
type ContactFormState = {
  success: boolean;
  message?: string;
  error?: string | null;
  fieldErrors?: Partial<Record<keyof FormData, string[]>>; // Use Partial for fieldErrors
};

export async function sendContactEmail(
   data: FormData // Expect the validated FormData type directly
): Promise<ContactFormState> {

  // Server-side validation (good practice even if validated on client)
  const validatedFields = formSchema.safeParse(data);

  // If validation fails on the server, return errors
  if (!validatedFields.success) {
    console.error("Server-side validation failed:", validatedFields.error.flatten());
    return {
      success: false,
      error: "Invalid form data received on server.",
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

   // Destructure validated data
   const { name, email, message } = validatedFields.data;

   // Prepare the message for the email service
   const emailMessage: Message = {
     name,
     email,
     message,
   };

  try {
    // Call your email sending service (placeholder)
    console.log("Attempting to send email with data:", emailMessage);
    const emailSent = await sendEmail(emailMessage);

    if (emailSent) {
       console.log("Contact email processing successful for:", email);
      return { success: true, message: "Message sent successfully!" };
    } else {
      console.error("Email service failed to send for:", email);
      return { success: false, error: "Failed to send email via service." };
    }
  } catch (error) {
    console.error("Error sending contact email:", error);
     // Provide a generic error message to the client
    return { success: false, error: "An unexpected error occurred while sending your message. Please try again later." };
  }
}
