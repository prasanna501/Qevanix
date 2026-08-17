import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma';
import { sendSuccess } from '../utils/response';

export const educationSchema = z.object({
  degree: z.string().min(2, 'Degree is required'),
  fieldOfStudy: z.string().min(2, 'Field of study is required'),
  institution: z.string().min(2, 'Institution name is required'),
  institutionUrl: z.string().url().optional().nullable().or(z.literal('')),
  location: z.string().min(2, 'Location is required'),
  startDate: z.string().min(4, 'Start date required'),
  endDate: z.string().optional().nullable(),
  isCurrent: z.boolean().default(false),
  grade: z.string().optional().nullable(),
  activities: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  order: z.number().int().default(0),
});

export async function getAllEducations(req: Request, res: Response, next: NextFunction) {
  try {
    const educations = await prisma.education.findMany({
      orderBy: [{ order: 'asc' }, { startDate: 'desc' }],
    });
    return sendSuccess(res, educations);
  } catch (error) {
    return next(error);
  }
}

export async function createEducation(req: Request, res: Response, next: NextFunction) {
  try {
    const data = { ...req.body };
    data.startDate = new Date(data.startDate);
    data.endDate = data.endDate ? new Date(data.endDate) : null;
    if (data.institutionUrl === '') data.institutionUrl = null;

    const edu = await prisma.education.create({ data });
    return sendSuccess(res, edu, 'Education entry created', 201);
  } catch (error) {
    return next(error);
  }
}

export async function updateEducation(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const data = { ...req.body };
    if (data.startDate) data.startDate = new Date(data.startDate);
    if (data.endDate !== undefined) data.endDate = data.endDate ? new Date(data.endDate) : null;
    if (data.institutionUrl === '') data.institutionUrl = null;

    const edu = await prisma.education.update({
      where: { id },
      data,
    });
    return sendSuccess(res, edu, 'Education updated successfully');
  } catch (error) {
    return next(error);
  }
}

export async function deleteEducation(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    await prisma.education.delete({ where: { id } });
    return sendSuccess(res, null, 'Education deleted successfully');
  } catch (error) {
    return next(error);
  }
}
