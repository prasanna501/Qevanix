import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma';
import { sendSuccess } from '../utils/response';

export const faqSchema = z.object({
  question: z.string().min(3, 'Question is required'),
  answer: z.string().min(5, 'Answer is required'),
  category: z.string().default('General'),
  order: z.number().int().default(0),
  isFeatured: z.boolean().default(true),
});

export async function getAllFAQs(req: Request, res: Response, next: NextFunction) {
  try {
    const { category } = req.query;
    const where: any = {};
    if (category && category !== 'All') {
      where.category = String(category);
    }

    const faqs = await prisma.fAQ.findMany({
      where,
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    });
    return sendSuccess(res, faqs);
  } catch (error) {
    return next(error);
  }
}

export async function createFAQ(req: Request, res: Response, next: NextFunction) {
  try {
    const faq = await prisma.fAQ.create({ data: req.body });
    return sendSuccess(res, faq, 'FAQ created', 201);
  } catch (error) {
    return next(error);
  }
}

export async function updateFAQ(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const faq = await prisma.fAQ.update({
      where: { id },
      data: req.body,
    });
    return sendSuccess(res, faq, 'FAQ updated');
  } catch (error) {
    return next(error);
  }
}

export async function deleteFAQ(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    await prisma.fAQ.delete({ where: { id } });
    return sendSuccess(res, null, 'FAQ deleted');
  } catch (error) {
    return next(error);
  }
}
