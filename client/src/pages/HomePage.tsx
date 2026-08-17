import React, { useState, useEffect } from 'react';
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
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const HomePage: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getProfile()
      .then((res) => {
        if (res.data.success) {
          setProfile(res.data.data);
        }
      })
      .catch((err) => {
        console.error('Failed to load profile details:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading Qevanix Portfolio System..." />
      </div>
    );
  }

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
