'use server';
import { sendNotificationEmail } from '@/lib/mail';

export async function submitContactForm(formData) {
  const name = formData.get('name');
  const email = formData.get('email');
  const message = formData.get('message');

  if (!name || !email || !message) {
    return { success: false, error: 'All fields are required.' };
  }

  const subject = `New Contact Inquiry from ${name}`;
  const text = `Name: ${name}\nEmail: ${email}\nMessage: ${message}`;
  const html = `
    <div style="font-family: sans-serif; padding: 20px; color: #333;">
      <h2 style="color: #1A1A1A;">New Contact Inquiry</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <div style="background: #F8F9FB; padding: 15px; border-radius: 8px; margin-top: 10px;">
        ${message.replace(/\n/g, '<br>')}
      </div>
    </div>
  `;

  // Send email to the official address
  const result = await sendNotificationEmail(
    process.env.SMTP_USER,
    subject,
    text,
    html
  );

  return result;
}
