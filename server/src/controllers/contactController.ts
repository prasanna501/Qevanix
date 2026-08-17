import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma';
import { emailService } from '../services/emailService';
import { sendSuccess, sendError } from '../utils/response';

export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please provide a valid email address'),
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export async function submitContactMessage(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email, subject, message } = req.body;

    // 1. Save to PostgreSQL database
    const savedMessage = await prisma.contactMessage.create({
      data: {
        name,
        email: email.toLowerCase().trim(),
        subject: subject.trim(),
        message: message.trim(),
      },
    });

    // 2. Dispatch email notification asynchronously
    emailService.sendContactNotification({
      name,
      email,
      subject,
      message,
    }).catch((err) => console.error('Background email notification error:', err));

    return sendSuccess(
      res,
      { id: savedMessage.id, createdAt: savedMessage.createdAt },
      'Thank you for reaching out! Your message has been received, and I will get back to you shortly.',
      201
    );
  } catch (error) {
    return next(error);
  }
}

export async function getAllContactMessages(req: Request, res: Response, next: NextFunction) {
  try {
    const { isRead } = req.query;
    const where: any = {};
    if (isRead !== undefined) {
      where.isRead = isRead === 'true';
    }

    const messages = await prisma.contactMessage.findMany({
      where,
      orderBy: [{ isRead: 'asc' }, { createdAt: 'desc' }],
    });

    return sendSuccess(res, messages);
  } catch (error) {
    return next(error);
  }
}

export async function markContactMessageStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { isRead, replySent } = req.body;

    const data: any = {};
    if (isRead !== undefined) data.isRead = isRead;
    if (replySent !== undefined) data.replySent = replySent;

    const updated = await prisma.contactMessage.update({
      where: { id },
      data,
    });

    return sendSuccess(res, updated, 'Message status updated');
  } catch (error) {
    return next(error);
  }
}

export async function deleteContactMessage(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    await prisma.contactMessage.delete({ where: { id } });
    return sendSuccess(res, null, 'Message deleted successfully');
  } catch (error) {
    return next(error);
  }
}
