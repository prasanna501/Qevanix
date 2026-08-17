import nodemailer from 'nodemailer';
import { ENV } from '../config/env';

export interface EmailOptions {
  name: string;
  email: string;
  subject: string;
  message: string;
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    if (ENV.SMTP_HOST && ENV.SMTP_USER && ENV.SMTP_PASS) {
      try {
        this.transporter = nodemailer.createTransport({
          host: ENV.SMTP_HOST,
          port: ENV.SMTP_PORT,
          secure: ENV.SMTP_SECURE,
          auth: {
            user: ENV.SMTP_USER,
            pass: ENV.SMTP_PASS,
          },
        });
        console.log('📧 Nodemailer SMTP transporter initialized.');
      } catch (err) {
        console.warn('⚠️ Could not initialize SMTP transporter:', err);
      }
    } else {
      console.log('ℹ️ SMTP credentials not fully configured. Contact submissions will be logged and saved to PostgreSQL.');
    }
  }

  async sendContactNotification(data: EmailOptions): Promise<boolean> {
    console.log(`📩 [NEW CONTACT INQUIRY] From: ${data.name} <${data.email}> | Subject: "${data.subject}"`);
    console.log(`💬 Message Preview: ${data.message.substring(0, 100)}...`);

    if (!this.transporter) {
      return true; // Gracefully handled via DB storage
    }

    try {
      await this.transporter.sendMail({
        from: `"${data.name}" <${ENV.SMTP_USER || 'no-reply@qevanix.dev'}>`,
        replyTo: data.email,
        to: ENV.NOTIFICATION_EMAIL,
        subject: `[Portfolio Inquiry] ${data.subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h2 style="color: #0f172a; margin-top: 0; border-bottom: 2px solid #6366f1; padding-bottom: 8px;">
              New Contact Submission on Qevanix
            </h2>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
            <p><strong>Subject:</strong> ${data.subject}</p>
            <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; border-left: 4px solid #6366f1; margin: 15px 0;">
              <p style="white-space: pre-wrap; margin: 0;">${data.message}</p>
            </div>
            <p style="font-size: 12px; color: #64748b; margin-top: 20px;">
              Sent via Qevanix Portfolio Contact System at ${new Date().toUTCString()}
            </p>
          </div>
        `,
      });
      return true;
    } catch (error) {
      console.error('⚠️ Failed to send contact email notification:', error);
      return false;
    }
  }
}

export const emailService = new EmailService();
