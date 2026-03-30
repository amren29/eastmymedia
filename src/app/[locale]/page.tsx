'use client';

import { Hero } from '@/components/home/Hero';
import { AboutSection } from '@/components/home/AboutSection';
import { DistrictsCovered } from '@/components/home/DistrictsCovered';
import { MediaFormats } from '@/components/home/MediaFormats';
import { OurProcess } from '@/components/home/OurProcess';
import { BlogSection } from '@/components/home/BlogSection';
import { FAQSection } from '@/components/home/FAQSection';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export default function Home() {
  useScrollAnimation();

  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <AboutSection />
      <DistrictsCovered />
      <MediaFormats />
      <OurProcess />
      <BlogSection />
      <FAQSection />
    </div>
  );
}
