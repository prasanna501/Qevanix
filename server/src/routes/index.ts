import { Router } from 'express';
import { requireAuth, requireAdmin } from '../middleware/authMiddleware';
import { validateBody } from '../middleware/validate';

// Controllers
import * as authController from '../controllers/authController';
import * as profileController from '../controllers/profileController';
import * as projectController from '../controllers/projectController';
import * as skillController from '../controllers/skillController';
import * as serviceController from '../controllers/serviceController';
import * as experienceController from '../controllers/experienceController';
import * as educationController from '../controllers/educationController';
import * as certificationController from '../controllers/certificationController';
import * as testimonialController from '../controllers/testimonialController';
import * as blogController from '../controllers/blogController';
import * as faqController from '../controllers/faqController';
import * as contactController from '../controllers/contactController';
import * as socialLinkController from '../controllers/socialLinkController';
import * as statsController from '../controllers/statsController';
import * as visitorController from '../controllers/visitorController';

export const apiRouter = Router();

// ==========================================
// 0. REALTIME VISITORS & ANALYTICS ROUTES
// ==========================================
apiRouter.post('/visitors/ping', visitorController.recordVisitorPing);
apiRouter.get('/visitors/stats', visitorController.getVisitorStats);

// ==========================================
// 1. AUTHENTICATION ROUTES
// ==========================================
apiRouter.post('/auth/login', validateBody(authController.loginSchema), authController.login);
apiRouter.get('/auth/me', requireAuth, authController.getMe);
apiRouter.post('/auth/password', requireAuth, validateBody(authController.updatePasswordSchema), authController.updatePassword);

// ==========================================
// 2. PROFILE ROUTES
// ==========================================
apiRouter.get('/profile', profileController.getProfile);
apiRouter.put('/profile', requireAuth, requireAdmin, validateBody(profileController.profileSchema), profileController.updateProfile);

// ==========================================
// 3. PROJECTS ROUTES
// ==========================================
apiRouter.get('/projects', projectController.getAllProjects);
apiRouter.get('/projects/:idOrSlug', projectController.getProjectByIdOrSlug);
apiRouter.post('/projects', requireAuth, requireAdmin, validateBody(projectController.projectSchema), projectController.createProject);
apiRouter.put('/projects/:id', requireAuth, requireAdmin, validateBody(projectController.projectSchema), projectController.updateProject);
apiRouter.delete('/projects/:id', requireAuth, requireAdmin, projectController.deleteProject);

// ==========================================
// 4. SKILLS ROUTES
// ==========================================
apiRouter.get('/skills', skillController.getAllSkills);
apiRouter.post('/skills', requireAuth, requireAdmin, validateBody(skillController.skillSchema), skillController.createSkill);
apiRouter.put('/skills/:id', requireAuth, requireAdmin, validateBody(skillController.skillSchema), skillController.updateSkill);
apiRouter.delete('/skills/:id', requireAuth, requireAdmin, skillController.deleteSkill);

// ==========================================
// 5. SERVICES ROUTES
// ==========================================
apiRouter.get('/services', serviceController.getAllServices);
apiRouter.post('/services', requireAuth, requireAdmin, validateBody(serviceController.serviceSchema), serviceController.createService);
apiRouter.put('/services/:id', requireAuth, requireAdmin, validateBody(serviceController.serviceSchema), serviceController.updateService);
apiRouter.delete('/services/:id', requireAuth, requireAdmin, serviceController.deleteService);

// ==========================================
// 6. EXPERIENCE ROUTES
// ==========================================
apiRouter.get('/experience', experienceController.getAllExperiences);
apiRouter.post('/experience', requireAuth, requireAdmin, validateBody(experienceController.experienceSchema), experienceController.createExperience);
apiRouter.put('/experience/:id', requireAuth, requireAdmin, validateBody(experienceController.experienceSchema), experienceController.updateExperience);
apiRouter.delete('/experience/:id', requireAuth, requireAdmin, experienceController.deleteExperience);

// ==========================================
// 7. EDUCATION ROUTES
// ==========================================
apiRouter.get('/education', educationController.getAllEducations);
apiRouter.post('/education', requireAuth, requireAdmin, validateBody(educationController.educationSchema), educationController.createEducation);
apiRouter.put('/education/:id', requireAuth, requireAdmin, validateBody(educationController.educationSchema), educationController.updateEducation);
apiRouter.delete('/education/:id', requireAuth, requireAdmin, educationController.deleteEducation);

// ==========================================
// 8. CERTIFICATIONS ROUTES
// ==========================================
apiRouter.get('/certifications', certificationController.getAllCertifications);
apiRouter.post('/certifications', requireAuth, requireAdmin, validateBody(certificationController.certificationSchema), certificationController.createCertification);
apiRouter.put('/certifications/:id', requireAuth, requireAdmin, validateBody(certificationController.certificationSchema), certificationController.updateCertification);
apiRouter.delete('/certifications/:id', requireAuth, requireAdmin, certificationController.deleteCertification);

// ==========================================
// 9. TESTIMONIALS ROUTES
// ==========================================
apiRouter.get('/testimonials', testimonialController.getAllTestimonials);
apiRouter.post('/testimonials/public', validateBody(testimonialController.publicReviewSchema), testimonialController.submitPublicReview);
apiRouter.post('/testimonials', requireAuth, requireAdmin, validateBody(testimonialController.testimonialSchema), testimonialController.createTestimonial);
apiRouter.put('/testimonials/:id', requireAuth, requireAdmin, validateBody(testimonialController.testimonialSchema), testimonialController.updateTestimonial);
apiRouter.delete('/testimonials/:id', requireAuth, requireAdmin, testimonialController.deleteTestimonial);

// ==========================================
// 10. BLOG POSTS ROUTES
// ==========================================
apiRouter.get('/blog', blogController.getAllBlogPosts);
apiRouter.get('/blog/:slug', blogController.getBlogPostBySlug);
apiRouter.post('/blog', requireAuth, requireAdmin, validateBody(blogController.blogPostSchema), blogController.createBlogPost);
apiRouter.put('/blog/:id', requireAuth, requireAdmin, validateBody(blogController.blogPostSchema), blogController.updateBlogPost);
apiRouter.delete('/blog/:id', requireAuth, requireAdmin, blogController.deleteBlogPost);

// ==========================================
// 11. FAQS ROUTES
// ==========================================
apiRouter.get('/faqs', faqController.getAllFAQs);
apiRouter.post('/faqs', requireAuth, requireAdmin, validateBody(faqController.faqSchema), faqController.createFAQ);
apiRouter.put('/faqs/:id', requireAuth, requireAdmin, validateBody(faqController.faqSchema), faqController.updateFAQ);
apiRouter.delete('/faqs/:id', requireAuth, requireAdmin, faqController.deleteFAQ);

// ==========================================
// 12. CONTACT ROUTES
// ==========================================
apiRouter.post('/contact', validateBody(contactController.contactSchema), contactController.submitContactMessage);
apiRouter.get('/contact', requireAuth, requireAdmin, contactController.getAllContactMessages);
apiRouter.patch('/contact/:id', requireAuth, requireAdmin, contactController.markContactMessageStatus);
apiRouter.delete('/contact/:id', requireAuth, requireAdmin, contactController.deleteContactMessage);

// ==========================================
// 13. SOCIAL LINKS ROUTES
// ==========================================
apiRouter.get('/social-links', socialLinkController.getAllSocialLinks);
apiRouter.post('/social-links', requireAuth, requireAdmin, validateBody(socialLinkController.socialLinkSchema), socialLinkController.createSocialLink);
apiRouter.put('/social-links/:id', requireAuth, requireAdmin, validateBody(socialLinkController.socialLinkSchema), socialLinkController.updateSocialLink);
apiRouter.delete('/social-links/:id', requireAuth, requireAdmin, socialLinkController.deleteSocialLink);

// ==========================================
// 14. ADMIN DASHBOARD STATS
// ==========================================
apiRouter.get('/admin/stats', requireAuth, requireAdmin, statsController.getDashboardStats);
