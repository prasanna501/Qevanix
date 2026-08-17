import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma';
import { sendSuccess, sendError } from '../utils/response';

export const blogPostSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  slug: z.string().min(3, 'Slug is required'),
  summary: z.string().min(10, 'Summary is required'),
  content: z.string().min(20, 'Content is required'),
  coverImage: z.string().url('Valid cover image URL is required'),
  tags: z.array(z.string()).default([]),
  category: z.string().default('Engineering'),
  readingTime: z.string().default('5 min read'),
  isPublished: z.boolean().default(true),
  publishedAt: z.string().optional().nullable(),
});

export async function getAllBlogPosts(req: Request, res: Response, next: NextFunction) {
  try {
    const { category, tag, search, publishedOnly } = req.query;

    const where: any = {};
    if (publishedOnly === 'true' || publishedOnly === undefined) {
      // Default to published only for public viewing unless explicitly queried
      where.isPublished = true;
    }
    if (publishedOnly === 'false') {
      delete where.isPublished;
    }
    if (category && category !== 'All') {
      where.category = String(category);
    }
    if (tag) {
      where.tags = { has: String(tag) };
    }
    if (search) {
      const q = String(search);
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { summary: { contains: q, mode: 'insensitive' } },
      ];
    }

    const posts = await prisma.blogPost.findMany({
      where,
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
    });

    return sendSuccess(res, posts);
  } catch (error) {
    return next(error);
  }
}

export async function getBlogPostBySlug(req: Request, res: Response, next: NextFunction) {
  try {
    const { slug } = req.params;
    const post = await prisma.blogPost.findUnique({
      where: { slug },
    });

    if (!post) {
      return sendError(res, 'Blog post not found', 404);
    }

    // Increment view count asynchronously
    await prisma.blogPost.update({
      where: { id: post.id },
      data: { viewsCount: { increment: 1 } },
    });

    return sendSuccess(res, post);
  } catch (error) {
    return next(error);
  }
}

export async function createBlogPost(req: Request, res: Response, next: NextFunction) {
  try {
    const data = { ...req.body };
    if (data.publishedAt) {
      data.publishedAt = new Date(data.publishedAt);
    } else if (data.isPublished) {
      data.publishedAt = new Date();
    }

    const existing = await prisma.blogPost.findUnique({ where: { slug: data.slug } });
    if (existing) {
      return sendError(res, 'A post with this slug already exists. Please pick a unique slug.', 409);
    }

    const post = await prisma.blogPost.create({ data });
    return sendSuccess(res, post, 'Blog post created successfully', 201);
  } catch (error) {
    return next(error);
  }
}

export async function updateBlogPost(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const data = { ...req.body };
    if (data.publishedAt) {
      data.publishedAt = new Date(data.publishedAt);
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data,
    });
    return sendSuccess(res, post, 'Blog post updated successfully');
  } catch (error) {
    return next(error);
  }
}

export async function deleteBlogPost(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    await prisma.blogPost.delete({ where: { id } });
    return sendSuccess(res, null, 'Blog post deleted successfully');
  } catch (error) {
    return next(error);
  }
}
