import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma';
import { sendSuccess } from '../utils/response';

export const testimonialSchema = z.object({
  clientName: z.string().min(2, 'Client name is required'),
  clientRole: z.string().min(2, 'Client role is required'),
  clientCompany: z.string().min(2, 'Company name is required'),
  clientAvatar: z.string().url().optional().nullable().or(z.literal('')),
  content: z.string().min(10, 'Testimonial content is required'),
  rating: z.number().int().min(1).max(5).default(5),
  isFeatured: z.boolean().default(true),
  order: z.number().int().default(0),
});

export const publicReviewSchema = z.object({
  clientName: z.string().min(2, 'Your name is required'),
  clientRole: z.string().optional().default('Visitor / Peer Developer'),
  clientCompany: z.string().optional().default('Web Community'),
  clientAvatar: z.string().optional().nullable().or(z.literal('')),
  content: z.string().min(5, 'Review message must be at least 5 characters'),
  rating: z.number().int().min(1).max(5).default(5),
});

export async function getAllTestimonials(_req: Request, res: Response, next: NextFunction) {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: [{ isFeatured: 'desc' }, { order: 'asc' }, { createdAt: 'desc' }],
    });
    return sendSuccess(res, testimonials);
  } catch (error) {
    return next(error);
  }
}

export async function createTestimonial(req: Request, res: Response, next: NextFunction) {
  try {
    const data = req.body;
    if (data.clientAvatar === '') data.clientAvatar = null;
    const test = await prisma.testimonial.create({ data });
    return sendSuccess(res, test, 'Testimonial added', 201);
  } catch (error) {
    return next(error);
  }
}

export async function submitPublicReview(req: Request, res: Response, next: NextFunction) {
  try {
    const { clientName, clientRole, clientCompany, clientAvatar, content, rating } = req.body;

    const newReview = await prisma.testimonial.create({
      data: {
        clientName: clientName.trim(),
        clientRole: clientRole?.trim() || 'Visitor / Peer Developer',
        clientCompany: clientCompany?.trim() || 'Tech Community',
        clientAvatar: clientAvatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(clientName)}`,
        content: content.trim(),
        rating: Math.min(5, Math.max(1, rating || 5)),
        isFeatured: true,
        order: 0,
      },
    });

    return sendSuccess(res, newReview, 'Thank you! Your review has been published successfully.', 201);
  } catch (error) {
    return next(error);
  }
}

export async function updateTestimonial(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const data = req.body;
    if (data.clientAvatar === '') data.clientAvatar = null;
    const test = await prisma.testimonial.update({
      where: { id },
      data,
    });
    return sendSuccess(res, test, 'Testimonial updated');
  } catch (error) {
    return next(error);
  }
}

export async function deleteTestimonial(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    await prisma.testimonial.delete({ where: { id } });
    return sendSuccess(res, null, 'Testimonial deleted');
  } catch (error) {
    return next(error);
  }
}
