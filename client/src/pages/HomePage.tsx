import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Profile } from '../types';
import { api } from '../services/api';
import { HeroSection } from '../components/sections/HeroSection';
import { AboutSection } from '../components/sections/AboutSection';
import { SkillsSection } from '../components/sections/SkillsSection';
import { ServicesSection } from '../components/sections/ServicesSection';
import { ProjectsSection } from '../components/sections/ProjectsSection';
import { ExperienceSection } from '../components/sections/ExperienceSection';
import { EducationSection } from '../components/sections/EducationSection';
import { CertificationsSection } from '../components/sections/CertificationsSection';
import { ResumeSection } from '../components/sections/ResumeSection';
import { TestimonialsSection } from '../components/sections/TestimonialsSection';
import { BlogSection } from '../components/sections/BlogSection';
import { FAQSection } from '../components/sections/FAQSection';
import { ContactSection } from '../components/sections/ContactSection';

export const HomePage: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const location = useLocation();

  useEffect(() => {
    api.getProfile()
      .then((res) => {
        if (res.data.success) {
          setProfile(res.data.data);
        }
      })
      .catch((err) => {
        console.error('Failed to load profile details:', err);
      });
  }, []);

  useEffect(() => {
    const sectionPathMap: Record<string, string> = {
      '/about': 'about',
      '/skills': 'skills',
      '/services': 'services',
      '/projects': 'projects',
      '/experience': 'experience',
      '/education': 'education',
      '/certifications': 'certifications',
      '/contact': 'contact',
      '/testimonials': 'testimonials',
      '/faq': 'faq',
    };

    const targetId = location.hash
      ? location.hash.replace('#', '')
      : sectionPathMap[location.pathname];

    if (targetId) {
      const scrollToElement = () => {
        const elem = document.getElementById(targetId);
        if (elem) {
          elem.scrollIntoView({ behavior: 'smooth' });
        }
      };
      scrollToElement();
      const timer1 = setTimeout(scrollToElement, 100);
      const timer2 = setTimeout(scrollToElement, 300);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    } else if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.pathname, location.hash]);

  return (
    <div className="space-y-0">
      {/* 1. Home / Hero */}
      <HeroSection profile={profile} />

      {/* 2. About */}
      <AboutSection profile={profile} />

      {/* 3. Skills */}
      <SkillsSection />

      {/* 4. Services */}
      <ServicesSection />

      {/* 5. Projects */}
      <ProjectsSection />

      {/* 6. Experience */}
      <ExperienceSection />

      {/* 7. Education */}
      <EducationSection />

      {/* 8. Certifications */}
      <CertificationsSection />

      {/* 9. Resume */}
      <ResumeSection profile={profile} />

      {/* 10. Testimonials */}
      <TestimonialsSection />

      {/* 11. Blog */}
      <BlogSection />

      {/* 12. FAQ */}
      <FAQSection />

      {/* 13. Contact */}
      <ContactSection profile={profile} />
    </div>
  );
};
