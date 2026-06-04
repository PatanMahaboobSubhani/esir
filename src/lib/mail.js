import nodemailer from 'nodemailer';
import { getInvitationEmailTemplate } from './email-templates';

const isSMTPConfigured =
  process.env.SMTP_HOST &&
  process.env.SMTP_PORT &&
  process.env.SMTP_USER &&
  process.env.SMTP_PASS;

const transporter = isSMTPConfigured
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  : null;

export const sendReviewerInvitation = async ({
  to,
  reviewerName,
  journalName = 'Journal of Eye Innovation in Security Analysis',
  articleTitle,
  abstract,
  responseDueDate,
  reviewDueDate,
  submissionId,
  editorName = 'Editorial Team',
  acceptLink,
  declineLink
}) => {
  try {
    if (!transporter) {
      console.warn('⚠️ SMTP not configured. Skipping email.');
      return { success: true, skipped: true };
    }

    const dashboardUrl = `${
      process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    }/dashboard/reviewer/assignments/${submissionId}`;

    const html = getInvitationEmailTemplate({
      reviewerName,
      journalName,
      articleTitle,
      abstract,
      responseDueDate,
      reviewDueDate,
      dashboardUrl,
      editorName,
      acceptLink,
      declineLink
    });

    const mailOptions = {
      from: `"${journalName}" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to,
      subject: `Invitation to review: ${
        articleTitle?.substring(0, 50) || ''
      }${articleTitle?.length > 50 ? '...' : ''}`,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Invitation email sent:', info.messageId);

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending invitation email:', error);
    return { success: false, error: error.message };
  }
};

export const sendNotificationEmail = async (to, subject, text, html) => {
  try {
    if (!transporter) {
      console.warn('⚠️ SMTP not configured. Skipping email.');
      return { success: true, skipped: true };
    }

    const mailOptions = {
      from: `"${process.env.SMTP_FROM_NAME || 'EISR Portal'}" <${
        process.env.SMTP_FROM || process.env.SMTP_USER
      }>`,
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Notification email sent:', info.messageId);

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending notification email:', error);
    return { success: false, error: error.message };
  }
};
