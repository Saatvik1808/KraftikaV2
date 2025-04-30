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
 *
 * @param message The message object containing name, email, and message body.
 * @returns A promise that resolves to true if the email was sent successfully, false otherwise.
 */
export async function sendEmail(message: Message): Promise<boolean> {
  // TODO: Implement this by calling an email sending API.
  console.log("Sending email:", message);
  return true;
}
