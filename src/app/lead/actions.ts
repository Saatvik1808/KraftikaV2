"use server";

import { z } from "zod";
import { API_BASE_URL } from "@/services/config";

// Define the schema for the lead form data
const leadSchema = z.object({
  email: z.string().email("Please enter a valid email address.").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  name: z.string().min(2, "Name must be at least 2 characters.").max(50, "Name cannot exceed 50 characters.").optional(),
}).refine((data) => {
  const hasEmail = data.email && data.email.trim() !== "";
  const hasPhone = data.phone && data.phone.trim() !== "";
  return hasEmail || hasPhone;
}, {
  message: "Either email or phone number is required.",
  path: ["email"],
}).refine((data) => {
  // If phone is provided, it should be at least 10 characters
  if (data.phone && data.phone.trim() !== "") {
    return data.phone.trim().length >= 10;
  }
  return true;
}, {
  message: "Phone number must be at least 10 digits.",
  path: ["phone"],
});

// Define the type based on the schema
type LeadFormData = z.infer<typeof leadSchema>;

// Define the state structure returned by the action
type LeadFormState = {
  success: boolean;
  message?: string;
  error?: string | null;
  fieldErrors?: Partial<Record<keyof LeadFormData, string[]>>;
};

export async function submitLead(
   data: LeadFormData
): Promise<LeadFormState> {

  // Server-side validation
  const validatedFields = leadSchema.safeParse(data);

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
   const { name, email, phone } = validatedFields.data;

   // Prepare the lead data for backend API (array format to match backend expectation)
   const requestBody = [{
     name: name || undefined,
     email: email || undefined,
     phone: phone || undefined,
   }];

  try {
    // Build the API URL using the base URL from config (API_BASE_URL already includes /api)
    const leadUrl = `${API_BASE_URL || 'http://kraftika-env.eba-vyn62iv2.ap-south-1.elasticbeanstalk.com/api'}/leads`;
    
    // Call backend API to create lead and send email notification
    console.log("Attempting to submit lead via backend API:", requestBody);
    console.log("Lead API URL:", leadUrl);
    const response = await fetch(leadUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    // Check if response is ok before trying to parse JSON
    if (!response.ok) {
      console.error("Lead submission failed - HTTP status:", response.status, response.statusText);
      
      // Try to parse error response
      let errorMessage = "Failed to submit lead. Please try again later.";
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

    const responseData = await response.json();

    if (responseData.success) {
      console.log("Lead submission successful for:", email || phone);
      return { 
        success: true, 
        message: responseData.message || "Thank you for your interest! We'll contact you soon." 
      };
    } else {
      console.error("Lead submission failed for:", email || phone);
      console.error("Error response:", responseData);
      
      return { 
        success: false, 
        error: responseData.error || "Failed to submit lead. Please try again later." 
      };
    }
  } catch (error) {
    console.error("Error submitting lead:", error);
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
      error: "An unexpected error occurred while submitting your information. Please try again later." 
    };
  }
}

