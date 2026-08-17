import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma';
import { sendSuccess } from '../utils/response';

export const skillCategories = ['FRONTEND', 'BACKEND', 'DATABASE', 'DEVOPS_CLOUD', 'TOOLS_ARCHITECTURE'] as const;
export type SkillCategoryType = typeof skillCategories[number];

export const skillSchema = z.object({
  name: z.string().min(1, 'Skill name is required'),
  category: z.enum(skillCategories),
  proficiency: z.number().int().min(0).max(100),
  icon: z.string().optional().nullable(),
  order: z.number().int().default(0),
  isFeatured: z.boolean().default(false),
});

export async function getAllSkills(req: Request, res: Response, next: NextFunction) {
  try {
    const { category, featured } = req.query;
    const where: any = {};
    if (category) {
      where.category = category as any;
    }
    if (featured === 'true') {
      where.isFeatured = true;
    }

    const skills = await prisma.skill.findMany({
      where,
      orderBy: [{ category: 'asc' }, { order: 'asc' }, { proficiency: 'desc' }],
    });

    return sendSuccess(res, skills);
  } catch (error) {
    return next(error);
  }
}

export async function createSkill(req: Request, res: Response, next: NextFunction) {
  try {
    const skill = await prisma.skill.create({ data: req.body });
    return sendSuccess(res, skill, 'Skill created successfully', 201);
  } catch (error) {
    return next(error);
  }
}

export async function updateSkill(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const skill = await prisma.skill.update({
      where: { id },
      data: req.body,
    });
    return sendSuccess(res, skill, 'Skill updated successfully');
  } catch (error) {
    return next(error);
  }
}

export async function deleteSkill(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    await prisma.skill.delete({ where: { id } });
    return sendSuccess(res, null, 'Skill deleted successfully');
  } catch (error) {
    return next(error);
  }
}
