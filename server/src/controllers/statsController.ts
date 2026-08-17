import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma';
import { sendSuccess } from '../utils/response';

export async function getDashboardStats(req: Request, res: Response, next: NextFunction) {
  try {
    const [
      totalProjects,
      totalSkills,
      totalServices,
      totalExperiences,
      totalBlogPosts,
      publishedBlogPosts,
      totalMessages,
      unreadMessages,
      totalTestimonials,
      totalFAQs,
    ] = await Promise.all([
      prisma.project.count(),
      prisma.skill.count(),
      prisma.service.count(),
      prisma.experience.count(),
      prisma.blogPost.count(),
      prisma.blogPost.count({ where: { isPublished: true } }),
      prisma.contactMessage.count(),
      prisma.contactMessage.count({ where: { isRead: false } }),
      prisma.testimonial.count(),
      prisma.fAQ.count(),
    ]);

    const recentMessages = await prisma.contactMessage.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
    });

    const recentProjects = await prisma.project.findMany({
      take: 4,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        category: true,
        isFeatured: true,
        createdAt: true,
      },
    });

    return sendSuccess(res, {
      metrics: {
        totalProjects,
        totalSkills,
        totalServices,
        totalExperiences,
        totalBlogPosts,
        publishedBlogPosts,
        totalMessages,
        unreadMessages,
        totalTestimonials,
        totalFAQs,
      },
      recentMessages,
      recentProjects,
    });
  } catch (error) {
    return next(error);
  }
}
