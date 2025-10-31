"use server";

import { z } from "zod";
import { sendLeadNotification, type Lead } from '@/services/email';

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

   // Prepare the lead data
   const lead: Lead = {
     name: name || undefined,
     email: email || undefined,
     phone: phone || undefined,
   };

  try {
    console.log("Attempting to submit lead with data:", lead);
    // This will always capture the lead (even if email fails, it logs to console)
    await sendLeadNotification(lead);
    
    console.log("Lead submission successful");
    return { success: true, message: "Thank you for your interest! We'll contact you soon." };
  } catch (error) {
    console.error("Error submitting lead:", error);
    // Even on unexpected errors, log the lead to console as backup
    console.log("📧 LEAD SUBMITTED (with error, but captured):", lead);
    // Still return success since we captured the lead
    return { success: true, message: "Thank you for your interest! We'll contact you soon." };
  }
}

