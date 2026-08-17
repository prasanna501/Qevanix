import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma';
import { sendSuccess, sendError } from '../utils/response';

export const projectSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  slug: z.string().min(2, 'Slug is required'),
  summary: z.string().min(10, 'Summary is required'),
  description: z.string().min(20, 'Description is required'),
  category: z.string().default('Full Stack'),
  tags: z.array(z.string()).default([]),
  imageUrl: z.string().url('Image URL must be valid'),
  galleryImages: z.array(z.string()).default([]),
  demoUrl: z.string().url().optional().nullable().or(z.literal('')),
  githubUrl: z.string().url().optional().nullable().or(z.literal('')),
  isFeatured: z.boolean().default(false),
  order: z.number().int().default(0),
  clientName: z.string().optional().nullable(),
  completionDate: z.string().optional().nullable(),
  metrics: z.string().optional().nullable(),
});

export async function getAllProjects(req: Request, res: Response, next: NextFunction) {
  try {
    const { category, featured, search } = req.query;

    const where: any = {};
    if (category && category !== 'All') {
      where.category = String(category);
    }
    if (featured === 'true') {
      where.isFeatured = true;
    }
    if (search) {
      const q = String(search);
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { summary: { contains: q, mode: 'insensitive' } },
        { tags: { has: q } },
      ];
    }

    const projects = await prisma.project.findMany({
      where,
      orderBy: [{ isFeatured: 'desc' }, { order: 'asc' }, { createdAt: 'desc' }],
    });

    return sendSuccess(res, projects);
  } catch (error) {
    return next(error);
  }
}

export async function getProjectByIdOrSlug(req: Request, res: Response, next: NextFunction) {
  try {
    const { idOrSlug } = req.params;

    const project = await prisma.project.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
    });

    if (!project) {
      return sendError(res, 'Project not found', 404);
    }

    return sendSuccess(res, project);
  } catch (error) {
    return next(error);
  }
}

export async function createProject(req: Request, res: Response, next: NextFunction) {
  try {
    const data = req.body;
    if (data.completionDate) {
      data.completionDate = new Date(data.completionDate);
    }
    if (data.demoUrl === '') data.demoUrl = null;
    if (data.githubUrl === '') data.githubUrl = null;

    const existing = await prisma.project.findUnique({ where: { slug: data.slug } });
    if (existing) {
      return sendError(res, 'A project with this slug already exists. Please choose a unique slug.', 409);
    }

    const project = await prisma.project.create({ data });
    return sendSuccess(res, project, 'Project created successfully', 201);
  } catch (error) {
    return next(error);
  }
}

export async function updateProject(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const data = req.body;
    if (data.completionDate) {
      data.completionDate = new Date(data.completionDate);
    }
    if (data.demoUrl === '') data.demoUrl = null;
    if (data.githubUrl === '') data.githubUrl = null;

    const project = await prisma.project.update({
      where: { id },
      data,
    });

    return sendSuccess(res, project, 'Project updated successfully');
  } catch (error) {
    return next(error);
  }
}

export async function deleteProject(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    await prisma.project.delete({ where: { id } });
    return sendSuccess(res, null, 'Project deleted successfully');
  } catch (error) {
    return next(error);
  }
}
