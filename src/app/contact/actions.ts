
"use server";

import { z } from "zod";
import { API_BASE_URL } from "@/services/config";

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

   // Prepare the request body for the backend API
   const requestBody = {
     name,
     email,
     message,
   };

  try {
    // Ensure URL is properly formatted (remove trailing slash if present)
    const baseUrl = API_BASE_URL.replace(/\/$/, '');
    const contactUrl = `${baseUrl}/contact`;
    
    // Call backend API to send email
    console.log("Attempting to send email via backend API:", requestBody);
    console.log("Contact API URL:", contactUrl);
    const response = await fetch(contactUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    // Check if response is ok before trying to parse JSON
    if (!response.ok) {
      console.error("Email service failed - HTTP status:", response.status, response.statusText);
      
      // Try to parse error response
      let errorMessage = "Failed to send email. Please try again later.";
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch (e) {
        // If response is not JSON, use status text
        errorMessage = response.statusText || errorMessage;
      }
      
      return { 
        success: false, 
        error: errorMessage 
      };
    }

    const data = await response.json();

    if (data.success) {
       console.log("Contact email processing successful for:", email);
      return { success: true, message: data.message || "Message sent successfully!" };
    } else {
      console.error("Email service failed to send for:", email);
      console.error("Error response:", data);
      
      return { 
        success: false, 
        error: data.error || "Failed to send email. Please try again later or contact us directly at studiokraftika@gmail.com." 
      };
    }
  } catch (error) {
    console.error("Error sending contact email:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error details:", errorMessage);
    
    // Check if it's a network error
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return { 
        success: false, 
        error: "Cannot connect to server. Please check your connection and try again." 
      };
    }
    
    // Provide a generic error message to the client
    return { 
      success: false, 
      error: "An unexpected error occurred while sending your message. Please try again later or contact us directly at studiokraftika@gmail.com." 
    };
  }
}
