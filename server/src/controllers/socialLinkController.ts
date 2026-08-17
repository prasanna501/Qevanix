import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma';
import { sendSuccess } from '../utils/response';

export const socialLinkSchema = z.object({
  platform: z.string().min(1, 'Platform is required'),
  url: z.string().url('Valid URL is required'),
  icon: z.string().default('Link'),
  username: z.string().optional().nullable(),
  isVisible: z.boolean().default(true),
  order: z.number().int().default(0),
});

export async function getAllSocialLinks(req: Request, res: Response, next: NextFunction) {
  try {
    const links = await prisma.socialLink.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    });
    return sendSuccess(res, links);
  } catch (error) {
    return next(error);
  }
}

export async function createSocialLink(req: Request, res: Response, next: NextFunction) {
  try {
    const link = await prisma.socialLink.create({ data: req.body });
    return sendSuccess(res, link, 'Social link created', 201);
  } catch (error) {
    return next(error);
  }
}

export async function updateSocialLink(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const link = await prisma.socialLink.update({
      where: { id },
      data: req.body,
    });
    return sendSuccess(res, link, 'Social link updated');
  } catch (error) {
    return next(error);
  }
}

export async function deleteSocialLink(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    await prisma.socialLink.delete({ where: { id } });
    return sendSuccess(res, null, 'Social link deleted');
  } catch (error) {
    return next(error);
  }
}
