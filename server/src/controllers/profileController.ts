import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma';
import { sendSuccess, sendError } from '../utils/response';

export const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  title: z.string().min(1, 'Title is required'),
  tagline: z.string().optional().nullable(),
  bio: z.string().min(10, 'Bio must be at least 10 characters'),
  aboutSnippet: z.string().optional().nullable(),
  location: z.string().min(1, 'Location is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().optional().nullable(),
  avatarUrl: z.string().optional().nullable(),
  heroHeadline: z.string().min(5, 'Headline required'),
  heroSubheadline: z.string().min(5, 'Subheadline required'),
  yearsExperience: z.number().int().nonnegative(),
  completedProjects: z.number().int().nonnegative(),
  satisfiedClients: z.number().int().nonnegative(),
  codeCommits: z.number().int().nonnegative(),
  resumeUrl: z.string().optional().nullable(),
  isAvailable: z.boolean().default(true),
  availabilityStatus: z.string().default('Available for work'),
});

export async function getProfile(req: Request, res: Response, next: NextFunction) {
  try {
    let profile = await prisma.profile.findFirst();
    if (!profile) {
      // Create default if not found
      profile = await prisma.profile.create({
        data: {
          name: 'Qevanix',
          title: 'Senior Full-Stack Engineer & Cloud Solutions Architect',
          bio: 'Full-stack engineer with 6+ years experience in TypeScript, React, Node.js, and Cloud architectures.',
          location: 'San Francisco, CA',
          email: 'contact@qevanix.dev',
          heroHeadline: 'Building next-generation web applications with precision.',
          heroSubheadline: 'Specialized in scalable full-stack architectures and modern user interfaces.',
        },
      });
    }
    return sendSuccess(res, profile);
  } catch (error) {
    return next(error);
  }
}

export async function updateProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const existing = await prisma.profile.findFirst();
    let updated;
    if (existing) {
      updated = await prisma.profile.update({
        where: { id: existing.id },
        data: req.body,
      });
    } else {
      updated = await prisma.profile.create({
        data: req.body,
      });
    }
    return sendSuccess(res, updated, 'Profile updated successfully');
  } catch (error) {
    return next(error);
  }
}
