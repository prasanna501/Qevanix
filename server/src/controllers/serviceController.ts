import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma';
import { sendSuccess } from '../utils/response';

export const serviceSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  description: z.string().min(10, 'Description is required'),
  icon: z.string().default('Code'),
  features: z.array(z.string()).default([]),
  priceHint: z.string().optional().nullable(),
  isFeatured: z.boolean().default(true),
  order: z.number().int().default(0),
});

export async function getAllServices(req: Request, res: Response, next: NextFunction) {
  try {
    const services = await prisma.service.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    });
    return sendSuccess(res, services);
  } catch (error) {
    return next(error);
  }
}

export async function createService(req: Request, res: Response, next: NextFunction) {
  try {
    const service = await prisma.service.create({ data: req.body });
    return sendSuccess(res, service, 'Service created successfully', 201);
  } catch (error) {
    return next(error);
  }
}

export async function updateService(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const service = await prisma.service.update({
      where: { id },
      data: req.body,
    });
    return sendSuccess(res, service, 'Service updated successfully');
  } catch (error) {
    return next(error);
  }
}

export async function deleteService(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    await prisma.service.delete({ where: { id } });
    return sendSuccess(res, null, 'Service deleted successfully');
  } catch (error) {
    return next(error);
  }
}
