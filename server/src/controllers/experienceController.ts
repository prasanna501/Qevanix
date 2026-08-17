import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma';
import { sendSuccess } from '../utils/response';

export const experienceSchema = z.object({
  role: z.string().min(2, 'Role is required'),
  company: z.string().min(2, 'Company is required'),
  companyUrl: z.string().url().optional().nullable().or(z.literal('')),
  location: z.string().min(2, 'Location is required'),
  employmentType: z.string().default('Full-time'),
  startDate: z.string().min(4, 'Start date required'),
  endDate: z.string().optional().nullable(),
  isCurrent: z.boolean().default(false),
  description: z.string().min(10, 'Description is required'),
  achievements: z.array(z.string()).default([]),
  technologies: z.array(z.string()).default([]),
  order: z.number().int().default(0),
});

export async function getAllExperiences(req: Request, res: Response, next: NextFunction) {
  try {
    const experiences = await prisma.experience.findMany({
      orderBy: [{ order: 'asc' }, { startDate: 'desc' }],
    });
    return sendSuccess(res, experiences);
  } catch (error) {
    return next(error);
  }
}

export async function createExperience(req: Request, res: Response, next: NextFunction) {
  try {
    const data = { ...req.body };
    data.startDate = new Date(data.startDate);
    data.endDate = data.endDate ? new Date(data.endDate) : null;
    if (data.companyUrl === '') data.companyUrl = null;

    const exp = await prisma.experience.create({ data });
    return sendSuccess(res, exp, 'Experience entry created', 201);
  } catch (error) {
    return next(error);
  }
}

export async function updateExperience(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const data = { ...req.body };
    if (data.startDate) data.startDate = new Date(data.startDate);
    if (data.endDate !== undefined) data.endDate = data.endDate ? new Date(data.endDate) : null;
    if (data.companyUrl === '') data.companyUrl = null;

    const exp = await prisma.experience.update({
      where: { id },
      data,
    });
    return sendSuccess(res, exp, 'Experience updated successfully');
  } catch (error) {
    return next(error);
  }
}

export async function deleteExperience(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    await prisma.experience.delete({ where: { id } });
    return sendSuccess(res, null, 'Experience deleted successfully');
  } catch (error) {
    return next(error);
  }
}
