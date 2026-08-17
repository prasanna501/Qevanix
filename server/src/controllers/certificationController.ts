import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma';
import { sendSuccess } from '../utils/response';

export const certificationSchema = z.object({
  name: z.string().min(2, 'Certification name is required'),
  issuer: z.string().min(2, 'Issuer is required'),
  issueDate: z.string().min(4, 'Issue date is required'),
  expiryDate: z.string().optional().nullable(),
  credentialId: z.string().optional().nullable(),
  credentialUrl: z.string().url().optional().nullable().or(z.literal('')),
  badgeUrl: z.string().url().optional().nullable().or(z.literal('')),
  order: z.number().int().default(0),
});

export async function getAllCertifications(req: Request, res: Response, next: NextFunction) {
  try {
    const certs = await prisma.certification.findMany({
      orderBy: [{ order: 'asc' }, { issueDate: 'desc' }],
    });
    return sendSuccess(res, certs);
  } catch (error) {
    return next(error);
  }
}

export async function createCertification(req: Request, res: Response, next: NextFunction) {
  try {
    const data = { ...req.body };
    data.issueDate = new Date(data.issueDate);
    data.expiryDate = data.expiryDate ? new Date(data.expiryDate) : null;
    if (data.credentialUrl === '') data.credentialUrl = null;
    if (data.badgeUrl === '') data.badgeUrl = null;

    const cert = await prisma.certification.create({ data });
    return sendSuccess(res, cert, 'Certification added', 201);
  } catch (error) {
    return next(error);
  }
}

export async function updateCertification(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const data = { ...req.body };
    if (data.issueDate) data.issueDate = new Date(data.issueDate);
    if (data.expiryDate !== undefined) data.expiryDate = data.expiryDate ? new Date(data.expiryDate) : null;
    if (data.credentialUrl === '') data.credentialUrl = null;
    if (data.badgeUrl === '') data.badgeUrl = null;

    const cert = await prisma.certification.update({
      where: { id },
      data,
    });
    return sendSuccess(res, cert, 'Certification updated');
  } catch (error) {
    return next(error);
  }
}

export async function deleteCertification(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    await prisma.certification.delete({ where: { id } });
    return sendSuccess(res, null, 'Certification deleted');
  } catch (error) {
    return next(error);
  }
}
