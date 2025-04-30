
/**
 * Represents the structure of a message, including name, email, and the message body.
 */
export interface Message {
  /**
   * The name of the sender.
   */
  name: string;
  /**
   * The email address of the sender.
   */
  email: string;
  /**
   * The content of the message.
   */
  message: string;
}

/**
 * Asynchronously sends an email with the provided message details.
 * This is a placeholder function. Replace with actual email sending logic.
 *
 * @param message The message object containing name, email, and message body.
 * @returns A promise that resolves to true if the email was sent successfully (simulated), false otherwise.
 */
export async function sendEmail(message: Message): Promise<boolean> {
  console.log("--- Sending Email ---");
  console.log("To: saatvik.shrivastava08@gmail.com"); // Hardcoded recipient for this example
  console.log("From:", message.email);
  console.log("Name:", message.name);
  console.log("Message:", message.message);
  console.log("--------------------");

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Simulate success/failure (e.g., based on email format or just randomly)
  // In a real scenario, this would depend on the API response.
  const success = Math.random() > 0.1; // Simulate 90% success rate

  if (success) {
    console.log("Email successfully sent (simulated).");
    return true;
  } else {
    console.error("Email sending failed (simulated).");
    return false;
  }
}
